export function getUsedSize(buffers: Buffer[]) {

	return buffers
		.map(x => x.byteLength)
		.reduce(sum, 0)
}

const sum = <T>(a: T, b: T) => <T> (<any> a + <any> b)
