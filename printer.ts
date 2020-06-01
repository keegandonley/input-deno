import { IConfig } from "./types.ts";

const dividerChar = '-';

export default class Printer {
	private silent = false;

	constructor(config?: IConfig) {
		this.silent = config?.silent ?? false;
	}

	private writeLine = (value?: string) => {
		if (!this.silent) {
			console.log(value);
		}
	}

	public print = (value?: string) => {
		this.writeLine(value);
	}

	public newline = () => {
		this.writeLine('\n');
	}

	public divider = (length: number = 10) => {
		let outStr = '';

		for (let i = 0; i < length; i++) {
			outStr += dividerChar
		}

		this.writeLine(outStr);
	}
}