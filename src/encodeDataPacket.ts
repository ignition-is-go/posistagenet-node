import { packetHeader } from './packetHeader'
import { DATA_PACKET, MAX_PACKET_SIZE, DATA_TYPE, System, Tracker, Vector3 } from './types'
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
	let r:Buffer[] = [];
	if (tracker.position) r.push(vecToChunk(tracker.position, DATA_TYPE.TRACKER_POS));
	if (tracker.speed) r.push(vecToChunk(tracker.speed, DATA_TYPE.TRACKER_SPEED));
	if (tracker.orientation) r.push(vecToChunk(tracker.orientation, DATA_TYPE.TRACKER_ORI));
	if (tracker.validity) r.push(floatToChunk(tracker.validity, DATA_TYPE.TRACKER_STATUS));
	if (tracker.acceleration) r.push(vecToChunk(tracker.acceleration, DATA_TYPE.TRACKER_ACCEL));
	if (tracker.target) r.push(vecToChunk(tracker.target, DATA_TYPE.TRACKER_TRGTPOS));
	return r;
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
