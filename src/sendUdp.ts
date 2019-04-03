import { createSocket, Socket } from 'dgram'
import { encodeDataPacket } from './encodeDataPacket'
import { encodeInfoPacket } from './encodeInfoPacket'
import { psn } from './types'

let counter = 1
const startTime = Date.now()

const socket = createSocket({ type: 'udp4', reuseAddr: true })
socket.bind({ port: psn.DEFAULT_PORT })

const theSystem: psn.System = {
	name: 'node test',
	version: '2.02',
}

const zeroVector = {
	x: 0,
	y: 0,
	z: 0,
}

const theTrackedThing: psn.Tracker = {
	id: 1,
	name: 'Test Tracked Thing',
	orientation: zeroVector,
	position: zeroVector,
	speed: zeroVector,
	acceleration: zeroVector,
	target: zeroVector,
	status: true,

}

const trackers = Array(10).fill(theTrackedThing).map((t, idx) => ({
	...t,
	id: idx,
	name: `Tracker ${idx}`,
}))

const timestamp = () => (Date.now() - startTime) * 1000

const sendInfo = (soc: Socket) => {
	const packets = encodeInfoPacket(timestamp(), counter, theSystem, trackers)

	packets.forEach(packet =>
		soc.send(packet, 0, packet.length, psn.DEFAULT_PORT, psn.DEFAULT_MULTICAST_ADDRESS, () => {
			console.log(`Sending infoPacket ${packet}`)
		}),
	)

	counter++
}

const sendData = (soc: Socket) => {
	const packets = encodeDataPacket(timestamp(), counter, theSystem, trackers)

	packets.forEach(packet =>
		soc.send(packet, 0, packet.length, psn.DEFAULT_PORT, psn.DEFAULT_MULTICAST_ADDRESS, () => {
			console.log(`Sending dataPacket ${packet}`)
		}),
	)
}

socket.on('listening', () => {
	socket.addMembership(psn.DEFAULT_MULTICAST_ADDRESS)
	setInterval(() => sendData(socket), 1000 / 5)
	setInterval(() => sendInfo(socket), 1000)
})
