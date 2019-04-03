import { packetHeader } from './packetHeader'
import { psn } from './types'
import { wrapChunk } from './wrapChunk'

export const encodeInfoPacket = (
	timestamp: number,
	frame: number,
	system: psn.System,
	trackerList: psn.Tracker[],
) => {

	const CHUNKS = psn.INFO_PACKET.CHUNKS

	// const trackerName = wrapChunk(
	// 	[Buffer.from(trackerList[0].name)],
	// 	0,
	// 	false,
	// )
	// const tracker = wrapChunk(
	// 	[trackerName],
	// 	trackerList[0].id,
	// 	true,
	// )

	const trackerListChunk = wrapChunk(
		trackerList.map(t => wrapChunk(
			[wrapChunk([Buffer.from(t.name)], 0, false)],
			t.id,
			true,
		)),
		CHUNKS.TRACKER_LIST,
		true,
	)

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

	return wrapChunk(
		[infoPacketHeaderChunk, systemNameChunk, trackerListChunk],
		psn.INFO_PACKET.HEADER,
		true,
	)

}

// const packet = encodeInfoPacket(0, 1, theSystem, [theTrackedThing])
// console.log(packet)
// console.log(packet.length)
// console.log(encodeInfoPacket(0, 1, theSystem, [theTrackedThing]).toString())
