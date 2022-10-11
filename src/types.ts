
export interface System {
	name: string
	version: string
}

export interface Tracker {
	id: number
	name: string
	position?: Vector3
	speed?: Vector3
	acceleration?: Vector3
	orientation?: Vector3 // rotation is in RADIANS!
	target?: Vector3
	validity?: number
}

export interface Vector3 {
	x: number,
	y: number,
	z: number,
}

export enum PACKET_TYPE {
	INFO = 0x6756,
	DATA = 0x6755,
}

export enum DATA_TYPE {
	TRACKER_POS = 0x0000,
	TRACKER_SPEED = 0x0001,
	TRACKER_ORI = 0x0002,
	TRACKER_STATUS = 0x0003,
	TRACKER_ACCEL = 0x0004,
	TRACKER_TRGTPOS = 0x0005,
	TRACKER_TIMESTAMP = 0x0006
}

export namespace INFO_PACKET {
	export const HEADER = 0x6756
	export enum CHUNKS {
		HEADER = 0x0000,
		SYSTEM_NAME = 0x0001,
		TRACKER_LIST = 0x0002,
	}
}

export namespace DATA_PACKET {
	export const HEADER = 0x6755

	export enum CHUNKS {
		HEADER = 0x0000,
		TRACKER_LIST = 0x0001,
	}
}

export const DEFAULT_MULTICAST_ADDRESS = '236.10.10.10'
export const DEFAULT_PORT = 56565
// max packet is 1500 bytes for udp
export const MAX_PACKET_SIZE = 1500
