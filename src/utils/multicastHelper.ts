import { createSocket } from 'dgram'
import { DEFAULT_MULTICAST_ADDRESS, DEFAULT_PORT } from '../types'

// this creates a socket for sending
export const multicastHelper = (localIp: string) => {
	const socket = createSocket({
		type: 'udp4',
		reuseAddr: true,
	})
	socket.bind({
		port: DEFAULT_PORT,
		address: localIp,
		exclusive: false,
	})

	// convenience func
	const sendSingle = (message: Buffer) => socket.send(
		message, DEFAULT_PORT, DEFAULT_MULTICAST_ADDRESS,
	)

	return {
		...socket,
		sendPsn: (packets: Buffer[]) => packets.forEach(sendSingle),

	}
}
