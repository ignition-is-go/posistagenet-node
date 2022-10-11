import { createSocket, Socket } from 'dgram'
import { encodeDataPacket } from './encodeDataPacket'
import { encodeInfoPacket } from './encodeInfoPacket'
import { DEFAULT_MULTICAST_ADDRESS, DEFAULT_PORT, System, Tracker } from './types'

let counter = 1
const fps = 250
const startTime = Date.now()

const socket = createSocket({ type: 'udp4', reuseAddr: true })

// the address here is the local ip of the NIC to use
socket.bind({ port: DEFAULT_PORT, address: '192.168.1.4' })

const theSystem: System = {
	name: 'Node PSN Server',
	version: '2.02',
}

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

const names = [
	'Sun',
	'Mercury',
	'Venus',
	'Earth',
	'Mars',
	'Jupiter',
	'Saturn',
	'Uranus',
	'Neptune',
	'Pluto',
]

const trackers = Array(10).fill(theTrackedThing).map((t, idx) => ({
	...t,
	id: idx,
	name: names[idx],
}))

const timestamp = () => (Date.now() - startTime) * 1000
const incrementCounter = (current) => current >= fps ? 0 : current + 1

const sendInfo = (soc: Socket) => {
	const packets = encodeInfoPacket(timestamp(), counter, theSystem, trackers)

	packets.forEach(packet =>
		soc.send(packet, 0, packet.length, DEFAULT_PORT, DEFAULT_MULTICAST_ADDRESS, () => {
			console.log(`Sending infoPacket ${packet}`)
		}),
	)
	counter = incrementCounter(counter)
}

const sendData = (soc: Socket) => {
	const packets = encodeDataPacket(timestamp(), counter, theSystem, trackers)

	packets.forEach(packet =>
		soc.send(packet, 0, packet.length, DEFAULT_PORT, DEFAULT_MULTICAST_ADDRESS, () => {
			console.log(`Sending dataPacket ${counter}`)
		}),
	)
	counter = incrementCounter(counter)
}

// socket.on('listening', () => {
// 	socket.addMembership(DEFAULT_MULTICAST_ADDRESS)
setInterval(() => sendData(socket), 1000 / fps)
setInterval(() => sendInfo(socket), 1000)
// })
