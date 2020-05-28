enum ACTIONS {
	NONE,
	CHOOSE,
	QUESTION
}

interface ILastAction {
	argument: string | string[];
	lastOptionClose: boolean;
	action: ACTIONS;
}

export interface IConfig {
	silent?: boolean;
}

export default class InputLoop {
	private buf = new Uint8Array(1024);
	private silent = false;
	done = false;

	constructor(args?: IConfig) {
		this.silent = args?.silent ?? false;
	}

	private last: ILastAction = {
		argument: '',
		lastOptionClose: false,
		action: ACTIONS.NONE,
	};

	private saveLast = (argument: string | string[], action: ACTIONS, lastOptionClose: boolean) => {
		this.last = {
			argument,
			lastOptionClose,
			action,
		}
	}

	private coerceChoice = (value: string | number): string => {
		if (typeof value === 'number') {
			return String(value);
		}
		return value;
	}

	private writeLog = (value?: string) => {
		if (!this.silent) {
			console.log(value);
		}
	}

	private promisify = (value?: string): Promise<string> => {
		return new Promise((resolve) => resolve(value));
	}

	repeat = (value?: string | number) => {
		if (this.last.action) {
			if (this.last.action === ACTIONS.CHOOSE) {
				return this.choose(this.last.argument as string[], this.last.lastOptionClose, value);
			}
			if (this.last.action === ACTIONS.QUESTION) {
				return this.question(this.last.argument as string, value);
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

	choose = async (options: string[], lastOptionClose?: boolean, choice?: string | number): Promise<boolean[]> => {
		this.writeLog('\n');
		this.writeLog('------------------------------');
		options.forEach((option: string, index: number) => {
			this.writeLog(`${index}: ${option}`);
		});
		this.writeLog("------------------------------\n");
		
		// Allow passing a result directly instead of prompting for it.
		// Mostly used for testing without the need for interactive input

		let result: string;
		if (choice !== undefined) {
			result = this.coerceChoice(choice);
		} else {
			result = await this.read();
		}

		this.saveLast(options, ACTIONS.CHOOSE, lastOptionClose ?? false);

		if (lastOptionClose && result === String(options.length - 1)) {
			this.close();
		}

		return options.map((_option: string, index: number) => {
			if (result === String(index)) {
				return true;
			}
			return false;
		});
	}

	question = (question: string, value?: string | number): Promise<string> => {
		this.writeLog(question);

		this.saveLast(question, ACTIONS.QUESTION, this.last.lastOptionClose);

		if (value) {
			return this.promisify(this.coerceChoice(value));
		}

		return this.read();
	}

	close = () => {
		this.done = true;
	}
}