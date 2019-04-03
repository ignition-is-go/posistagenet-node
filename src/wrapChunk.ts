// this function wraps a chunk header around data + child chunks
// hasSubChunks indicates that the childChunks includes sub chunks for calculating
// the flags in the header

export const wrapChunk = (
	childChunks: Buffer[] | Buffer,
	chunkId,
	hasSubchunks: boolean,
): Buffer => {
	const size = 4
	const children = Buffer.concat(Array.isArray(childChunks) ? childChunks : [childChunks])
	const chunkHeader = Buffer.alloc(size)
	chunkHeader.writeUInt16LE(chunkId, 0)

	// we have to take apart the length manually
	// then repack the 16LE shifted by 1 bit for the subchunks

	const lengthMsb = (children.length >> 8) % 127
	const lengthLsb = children.length % 256
	chunkHeader.writeUInt8(lengthLsb, 2)
	chunkHeader.writeUInt8((lengthMsb) + ((hasSubchunks ? 1 : 0) << 7), 3)
	// chunkHeader.writeUInt16LE((lengthLsb << 9) + (lengthMsb << 1) + (hasSubchunks ? 1 : 0), 2)
	// chunkHeader.writeUInt32LE(
	// 	(chunkId << 16) + ((children.length) << 1) + (hasSubchunks ? 1 : 0),
	// 	0,
	// )
	// 0)
	return Buffer.concat([chunkHeader, children])
}
