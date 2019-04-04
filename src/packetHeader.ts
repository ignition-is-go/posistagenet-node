import { System } from './types'

export const packetHeader = (
	timestamp: number,
	frame: number,
	packets: number,
	system: System,
) => {
	// header data packing
	const infoHeaderBuffer = Buffer.alloc(12)
	infoHeaderBuffer.writeUIntLE(timestamp, 4, 4)
	const versionParts = system.version.split('.')
	infoHeaderBuffer.writeUInt8(parseInt(versionParts[0], 10), 8)
	infoHeaderBuffer.writeUInt8(parseInt(versionParts[1], 10), 9)
	infoHeaderBuffer.writeUInt8(frame, 10)
	infoHeaderBuffer.writeUInt8(packets, 11)

	return infoHeaderBuffer
}

// export const segmentPacket = (childChunks: Buffer | Buffer[]): Buffer[] => {
// 	const fullPacket = Buffer.concat(Array.isArray(childChunks) ? childChunks : [childChunks])
// 	// todo: split full packet into chunks of psn.MAX_PACKET_SIZE

// 	// todo: return split up packets
// 	return []
// }
