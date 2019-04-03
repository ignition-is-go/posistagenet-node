import { packetHeader } from './packetHeader'
import { psn } from './types'
import { wrapChunk } from './wrapChunk'
import { getUsedSize } from './utils/getUsedSize';

export const encodeInfoPacket = (
	timestamp: number,
	frame: number,
	system: psn.System,
	trackerList: psn.Tracker[],
) => {

	const CHUNKS = psn.INFO_PACKET.CHUNKS

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
		if (totalSize > psn.MAX_PACKET_SIZE) {

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

export function createInfoPacket(
	infoPacketHeaderChunk: Buffer,
	systemNameChunk: Buffer,
	trackerChunkList: Buffer[],
) {

	const trackerListChunk = wrapChunk(
		trackerChunkList,
		psn.INFO_PACKET.CHUNKS.TRACKER_LIST,
		true,
	)

	const packet = wrapChunk(
		[infoPacketHeaderChunk, systemNameChunk, trackerListChunk],
		psn.INFO_PACKET.HEADER,
		true,
	)

	return packet
}

