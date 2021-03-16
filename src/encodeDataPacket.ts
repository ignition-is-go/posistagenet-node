import { packetHeader } from './packetHeader'
import { DATA_PACKET, MAX_PACKET_SIZE, System, Tracker, Vector3 } from './types'
import { getUsedSize } from './utils/getUsedSize'
import { wrapChunk } from './wrapChunk'

export const encodeDataPacket = (
	timestamp: number,
	frame: number,
	system: System,
	trackerList: Tracker[],
) => {

	const packetHeaderChunk = wrapChunk(
		packetHeader(timestamp, frame, 1, system),
		DATA_PACKET.CHUNKS.HEADER,
		false,
	)

	const packets: Buffer[] = []

	const initialUsedBytes = packetHeaderChunk.byteLength
		+ 4 /* PSN_DATA_PACKAGE (header) */
		+ 4 /* PSN_DATA_TRACKER_LIST (header) */
		+ 4 /* PSN_DATA_TRACKER (header) */

	let trackerChunkList: Buffer[] = []
	trackerList.forEach(t => {
		const trackerChunk = wrapChunk(
			trackerDataChunks(t),
			t.id,
			true,
		)

		const totalSize = initialUsedBytes + getUsedSize(trackerChunkList) + trackerChunk.byteLength
		if (totalSize > MAX_PACKET_SIZE) {

			packets.push(createDataPacket(
				packetHeaderChunk,
				trackerChunkList,
			))

			trackerChunkList = [trackerChunk]
			return
		}

		trackerChunkList.push(trackerChunk)
	})

	packets.push(createDataPacket(
		packetHeaderChunk,
		trackerChunkList,
	))

	return packets
}

const trackerDataChunks = (tracker: Tracker): Buffer[] => {
	// NOTE(kb): chunk ids are hard coded for now
	return [
		vecToChunk(tracker.position, 0x0000),
		vecToChunk(tracker.speed, 0x0001),
		vecToChunk(tracker.orientation, 0x0002),
		floatToChunk(tracker.validity, 0x0003),
		vecToChunk(tracker.acceleration, 0x0004),
		vecToChunk(tracker.target, 0x0005),
	]
}

const vecToChunk = (vec: Vector3, chunkId: number): Buffer => {
	const buffer = Buffer.allocUnsafe(12)
	buffer.writeFloatLE(vec.x, 0)
	buffer.writeFloatLE(vec.y, 4)
	buffer.writeFloatLE(vec.z, 8)
	return wrapChunk(
		buffer,
		chunkId,
		false,
	)
}

const floatToChunk = (value: number, chunkId: number): Buffer => {
	const buffer = Buffer.allocUnsafe(4)
	buffer.writeFloatLE(value, 0)
	return wrapChunk(
		buffer,
		chunkId,
		false,
	)
}

function createDataPacket(
	infoPacketHeaderChunk: Buffer,
	trackerChunkList: Buffer[],
) {

	const trackerListChunk = wrapChunk(
		trackerChunkList,
		DATA_PACKET.CHUNKS.TRACKER_LIST,
		true,
	)

	const packet = wrapChunk(
		[infoPacketHeaderChunk, trackerListChunk],
		DATA_PACKET.HEADER,
		true,
	)

	return packet
}
