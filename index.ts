enum ACTIONS {
	NONE,
	CHOOSE,
	QUESTION
}

interface ILastAction {
	argument: string | string[];
	action: ACTIONS;
}

export default class InputLoop {
	private buf = new Uint8Array(1024);
	done = false;

	private last: ILastAction = {
		argument: '',
		action: ACTIONS.NONE,
	};

	private saveLast = (argument: string | string[], action: ACTIONS) => {
		this.last = {
			argument,
			action,
		}
	}

	repeat = () => {
		if (this.last.action) {
			if (this.last.action === ACTIONS.CHOOSE) {
				return this.choose(this.last.argument as string[]);
			}
			if (this.last.action === ACTIONS.QUESTION) {
				return this.question(this.last.argument as string);
			}
		}
	}

	read = async (): Promise<string> => {
		return new Promise(async (resolve, reject) => {
			const n = await Deno.stdin.read(this.buf);

			if (n) {
				resolve(new TextDecoder().decode(this.buf.subarray(0, n)).replace('\n', ''));
			} else {
				reject();
			}
		});
	}

	choose = async (options: string[]): Promise<boolean[]> => {
		console.log('\n');
		console.log('------------------------------');
		options.forEach((option: string, index: number) => {
			console.log(`${index}: ${option}`);
		});
		console.log("------------------------------");
		
		const result = await this.read();
		console.log('\n');

		this.saveLast(options, ACTIONS.CHOOSE);

		return options.map((_option: string, index: number) => {
			if (result === String(index)) {
				return true;
			}
			return false;
		});
	}

	question = (question: string): Promise<string> => {
		console.log(question);

		this.saveLast(question, ACTIONS.QUESTION);

		return this.read();
	}

	close = () => {
		this.done = true;
	}
}