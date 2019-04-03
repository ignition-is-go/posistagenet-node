import { packetHeader } from './packetHeader'
import { psn } from './types'
import { wrapChunk } from './wrapChunk'

export const encodeDataPacket = (
	timestamp: number,
	frame: number,
	system: psn.System,
	trackerList: psn.Tracker[],
) => {

	const trackerListChunk = wrapChunk(
		trackerList.map(t => wrapChunk(
			trackerDataChunks(t),
			t.id,
			true,
		)),
		psn.DATA_PACKET.CHUNKS.TRACKER_LIST,
		true,
	)
	const packetHeaderChunk = wrapChunk(
		packetHeader(timestamp, frame, 1, system),
		psn.DATA_PACKET.CHUNKS.HEADER,
		false,
	)

	return wrapChunk(
		[packetHeaderChunk, trackerListChunk],
		psn.DATA_PACKET.HEADER,
		true,
	)

}

const trackerDataChunks = (tracker: psn.Tracker): Buffer[] => {
	// NOTE(kb): chunk ids are hard coded for now
	return [
		vecToChunk(tracker.position, 0x0000),
		vecToChunk(tracker.speed, 0x0001),
		vecToChunk(tracker.orientation, 0x0002),
		wrapChunk(Buffer.from([1]), 0x0003, false),
		vecToChunk(tracker.acceleration, 0x0004),
		vecToChunk(tracker.target, 0x0005),
	]
}

const vecToChunk = (vec: psn.Vector3, chunkId: number): Buffer => {
	return wrapChunk(
		Buffer.from(new Float32Array([vec.x, vec.y, vec.z])),
		chunkId,
		false,
	)
}
