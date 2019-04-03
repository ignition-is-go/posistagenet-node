import { psn } from './types'

export const packetHeader = (
	timestamp: number,
	frame: number,
	packets: number,
	system: psn.System,
) => {
	// header data packing
	const infoHeaderBuffer = Buffer.alloc(12)
	infoHeaderBuffer.writeUIntLE(timestamp, 4, 4)
	const versionParts = system.version.split('.')
	infoHeaderBuffer.writeUInt8(parseInt(versionParts[0], 10), 8)
	infoHeaderBuffer.writeUInt8(parseInt(versionParts[1], 10), 9)
	infoHeaderBuffer.writeUInt8(frame, 10)
	// TODO: implement breaking across multiple frames
	infoHeaderBuffer.writeUInt8(1, 11)

	return infoHeaderBuffer
}
