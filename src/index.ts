import { encodeDataPacket } from './encodeDataPacket'
import { encodeInfoPacket } from './encodeInfoPacket'
import { psn as psn_lib } from './types'
import { multicastHelper as createMulticastSocket } from './utils/multicastHelper'

export const psn = {
	...psn_lib,
	encodeDataPacket,
	encodeInfoPacket,
	createMulticastSocket,
}

// require('./sendUdp')
// require('./benchmark')
