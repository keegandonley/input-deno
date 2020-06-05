import { IConfig } from "./types.ts";

const dividerChar = '-';

export default class Printer {
	silent = false;

	constructor(config?: IConfig) {
		this.silent = config?.silent ?? false;
	}

	private writeLine = (value?: string, includeNewline?: boolean) => {
		if (!this.silent) {
			const e = new TextEncoder().encode(`${value}${includeNewline ? '\n' : ''}`);
			Deno.stdout.writeSync(Uint8Array.from(e));
		}
	}

	public print = (value?: string, includeNewline?: boolean) => {
		this.writeLine(value, includeNewline);
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