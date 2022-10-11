import { encodeDataPacket } from './encodeDataPacket'
import { encodeInfoPacket } from './encodeInfoPacket'
import { Tracker } from './types'

const zeroVector = {
	x: 0,
	y: 0,
	z: 0,
}

const theTrackedThing: Tracker = {
	id: 1,
	name: 'Test Tracked Thing',
	orientation: zeroVector,
	position: zeroVector,
	speed: zeroVector,
	acceleration: zeroVector,
	target: zeroVector,
	validity: 1,
}

const trackers = Array(10).fill(theTrackedThing).map((t, idx) => ({
	...t,
	id: idx,
	name: `Tracker ${idx}`,
}))

encodeInfoPacket(
	1,
	1,
	{ name: 'Test', version: '2.2' },
	trackers,
)

console.time('encodeInfoPacket-1x')
encodeInfoPacket(
	1,
	1,
	{ name: 'Test', version: '2.2' },
	trackers,
)
console.timeEnd('encodeInfoPacket-1x')

console.time('encodeInfoPacket-60x')
Array(60).fill({}).forEach(() =>
	encodeInfoPacket(
		1,
		1,
		{ name: 'Test', version: '2.2' },
		trackers,
	),
)
console.timeEnd('encodeInfoPacket-60x')

console.time('encodeInfoPacket-1k')
Array(1000).fill({}).forEach(() =>
	encodeInfoPacket(
		1,
		1,
		{ name: 'Test', version: '2.2' },
		trackers,
	),
)
console.timeEnd('encodeInfoPacket-1k')

console.time('encodeDataPacket-1x')
encodeDataPacket(
	1,
	1,
	{ name: 'Test', version: '2.2' },
	trackers,
)
console.timeEnd('encodeDataPacket-1x')

console.time('encodeDataPacket-60x')
Array(60).fill({}).forEach(() =>
	encodeDataPacket(
		1,
		1,
		{ name: 'Test', version: '2.2' },
		trackers,
	),
)
console.timeEnd('encodeDataPacket-60x')

console.time('encodeDataPacket-1k')
Array(1000).fill({}).forEach(() =>
	encodeDataPacket(
		1,
		1,
		{ name: 'Test', version: '2.2' },
		trackers,
	),
)
console.timeEnd('encodeDataPacket-1k')
