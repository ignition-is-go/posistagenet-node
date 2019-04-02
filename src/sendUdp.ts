import { createSocket, Socket } from 'dgram'
import { encodeInfoPacket } from './encodeInfoPacket'
import { psn } from './types'

let counter = 1

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

const sendInfo = (soc: Socket) => {
	const packet = encodeInfoPacket(counter * 1000, counter, theSystem, [theTrackedThing])
	soc.send(packet, 0, packet.length, psn.DEFAULT_PORT, psn.DEFAULT_MULTICAST_ADDRESS, () => {
		console.log(`Sending infoPacket "${packet}"`)
	})
	counter++
}

socket.on('listening', () => {
	socket.addMembership(psn.DEFAULT_MULTICAST_ADDRESS)
	setInterval(() => sendInfo(socket), 1000)
})
