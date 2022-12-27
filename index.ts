import { ACTIONS } from './types.ts';
import type { IConfig } from './types.ts';
import Printer from './printer.ts';
import History from './history.ts';
import { deferred } from "https://deno.land/std/async/mod.ts";

export default class InputLoop {
	private buf = new Uint8Array(1024);
	done = false;
	out = new Printer();
	history = new History();

	constructor(args?: IConfig) {
		this.out = new Printer(args);
	}

	private coerceChoice = (value: string | number): string => {
		if (typeof value === 'number') {
			return String(value);
		}
		return value;
	}

	private cleanInput = (value?: string): string => {
		return value?.replace('\n', '').replace('\r', '') ?? '';
	}

	/**
	 * Repeats the last prompt
	 * @param {string | number} value value to auto-select
	 */
	public repeat = (value?: string | number) => {
		const retrievedHistory = this.history.retrieve();
		if (retrievedHistory.action) {
			if (retrievedHistory.action === ACTIONS.CHOOSE) {
				return this.choose(retrievedHistory.argument as string[], retrievedHistory.lastOptionClose, retrievedHistory.privateInput, value);
			}
			if (retrievedHistory.action === ACTIONS.QUESTION) {
				return this.question(retrievedHistory.argument as string, retrievedHistory.includeNewline, retrievedHistory.privateInput, value);
			}
		}
	}

	/**
	 * Read input from the console
	 * @param {boolean} privateInput should use private input (requires --unstable flag)
	 * @returns {Promise<string>} The value read
	 */
	public read = async (privateInput: boolean): Promise<string> => {
		if (privateInput) {
			const result = await this.readPrivate();
			this.out.newline();
			return result;
		}
		return new Promise(async (resolve, reject) => {
			const n = await Deno.stdin.read(this.buf);

			if (n) {
				resolve(this.cleanInput(new TextDecoder().decode(this.buf.subarray(0, n))));
			} else {
				reject();
			}
		});
	}

	private readPrivate = async (): Promise<string> => {
		(Deno as any).stdin.setRaw?.(Deno.stdin.rid, true);
		const p = deferred<string>();
		let input = '';

		let n = await Deno.stdin.read(this.buf);

		while (n) {
			const text = new TextDecoder().decode(this.buf.subarray(0, n));
			if (text.includes('\n') || text.includes('\r')) {
				(Deno as any).stdin.setRaw?.(Deno.stdin.rid, false);
				p.resolve(input);
				break;
			}
			if (text.includes('\u0003') || text.includes('\u0004')) {
				(Deno as any).stdin.setRaw?.(Deno.stdin.rid, false);
				p.resolve('');
				Deno.exit();
			}
			input += text;
			n = await Deno.stdin.read(this.buf);
		}

		return p;
	}

	public wait = async (question?: string, includeNewline?: boolean): Promise<boolean> => {
		this.out.print(question ?? 'Press any key to continue...', includeNewline ?? true);
		(Deno as any).stdin.setRaw?.(Deno.stdin.rid, true);
		const p = deferred<boolean>();

		let n = await Deno.stdin.read(this.buf);

		if (n) {
			(Deno as any).stdin.setRaw?.(Deno.stdin.rid, false);
			p.resolve(true);
		} else {
			p.resolve(false);
		}

		return p;
	}

	/**
	 * Prompts the user to choose from a list of options
	 * @param {string[]} options
	 * @param {boolean} lastOptionClose Whether selecting the last option in the list should close the loop
	 * @param {boolean} privateInput Use private input (requires --unstable flag)
	 * @param {string | number} choice value to auto-select
	 * @returns {Promise<boolean[]>} An array of booleans representing which index was selected
	 */
	public choose = async (options: string[], lastOptionClose?: boolean, privateInput?: boolean, choice?: string | number): Promise<boolean[]> => {
		this.out.newline();
		this.out.divider(30);
		options.forEach((option: string, index: number) => {
			this.out.print(`${index}: ${option}`, true);
		});
		this.out.divider(30);

		// Allow passing a result directly instead of prompting for it.
		// Mostly used for testing without the need for interactive input

		let result: string;
		if (choice !== undefined) {
			result = this.cleanInput(this.coerceChoice(choice));
		} else {
			result = await this.read(privateInput ?? false);
		}

		this.history.save(options, ACTIONS.CHOOSE, lastOptionClose ?? false, undefined, privateInput ?? false);

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

	/**
	 * Prompts the user to answer a question
	 * @param {string} question
	 * @param {boolean} includeNewline Include a newline before asking for the input
	 * @param {boolean} privateInput Use private input (requires --unstable flag)
	 * @param {string | number} value value to auto-select
	 * @returns {Promise<string>} The value entered
	 */
	public question = async (question: string, includeNewline?: boolean, privateInput?: boolean, value?: string | number): Promise<string> => {
		this.out.print(question, includeNewline ?? true);

		this.history.save(question, ACTIONS.QUESTION, undefined, includeNewline ?? true, privateInput ?? false);

		if (value) {
			return this.cleanInput(this.coerceChoice(value));
		}

		const result = await this.read(privateInput ?? false);
		return result;
	}

	/**
	 * Closes the loop
	 */
	public close = () => {
		this.done = true;
	}
}
