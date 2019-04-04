import { createSocket } from 'dgram'
import { psn } from '../types'

// this creates a socket for sending
export const multicastHelper = (localIp: string) => {
	return createSocket({
		type: 'udp4',
		reuseAddr: true,
	}).bind({
		port: psn.DEFAULT_PORT,
		address: localIp,
		exclusive: false,
	})

}
