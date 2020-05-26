export default class InputLoop {
	buf = new Uint8Array(1024);
	done = false;

	read = async () => {
		return new Promise(async (resolve, reject) => {
			const n = await Deno.stdin.read(this.buf);

			if (n) {
				resolve(new TextDecoder().decode(this.buf.subarray(0, n)).replace('\n', ''));
			}
		});
	}

	choose = async (options: string[]) => {
		options.forEach((option: string, index: number) => {
			console.log(`${index}: ${option}`);
		});

		const result = await this.read();

		return options.map((option: string, index: number) => {
			if (result === String(index)) {
				return true;
			}
			return false;
		});
	}

	question = (question: string) => {
		console.log(question);

		return this.read();
	}

	close = () => {
		this.done = true;
	}
}