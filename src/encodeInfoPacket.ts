import { packetHeader } from './packetHeader'
import { INFO_PACKET, MAX_PACKET_SIZE, System, Tracker } from './types'
import { getUsedSize } from './utils/getUsedSize'
import { wrapChunk } from './wrapChunk'

export const encodeInfoPacket = (
	timestamp: number,
	frame: number,
	system: System,
	trackerList: Tracker[],
) => {

	const CHUNKS = INFO_PACKET.CHUNKS

	const systemNameChunk = wrapChunk(
		[Buffer.from(system.name)],
		CHUNKS.SYSTEM_NAME,
		false,
	)

	const infoPacketHeaderChunk = wrapChunk(
		[packetHeader(timestamp, frame, 1, system)],
		0x0000,
		false,
	)

	const packets: Buffer[] = []

	const initialUsedBytes = infoPacketHeaderChunk.byteLength
		+ systemNameChunk.byteLength
		+ 4 /* PSN_INFO_PACKAGE (header) */
		+ 4 /* PSN_INFO_TRACKER_LIST (header) */
		+ 4 /* PSN_INFO_TRACKER (header) */

	let trackerChunkList: Buffer[] = []
	trackerList.forEach(t => {
		const trackerChunk = wrapChunk(
			[wrapChunk([Buffer.from(t.name)], 0, false)],
			t.id,
			true,
		)

		const totalSize = initialUsedBytes + getUsedSize(trackerChunkList) + trackerChunk.byteLength
		if (totalSize > MAX_PACKET_SIZE) {

			packets.push(createInfoPacket(
				infoPacketHeaderChunk,
				systemNameChunk,
				trackerChunkList,
			))

			trackerChunkList = [trackerChunk]
			return
		}

		trackerChunkList.push(trackerChunk)
	})

	packets.push(createInfoPacket(
		infoPacketHeaderChunk,
		systemNameChunk,
		trackerChunkList,
	))

	return packets
}

function createInfoPacket(
	infoPacketHeaderChunk: Buffer,
	systemNameChunk: Buffer,
	trackerChunkList: Buffer[],
) {

	const trackerListChunk = wrapChunk(
		trackerChunkList,
		INFO_PACKET.CHUNKS.TRACKER_LIST,
		true,
	)

	const packet = wrapChunk(
		[infoPacketHeaderChunk, systemNameChunk, trackerListChunk],
		INFO_PACKET.HEADER,
		true,
	)

	return packet
}
