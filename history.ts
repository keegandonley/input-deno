import { ILastAction, ACTIONS, IHistoryOptions } from './types.ts';

export default class History {
	private _useFullHistory: boolean = true;

	private last: ILastAction = {
		argument: '',
		lastOptionClose: false,
		action: ACTIONS.NONE,
	};

	private fullHistory: ILastAction[] = [];

	constructor(options?: IHistoryOptions) {
		this._useFullHistory = options?.useFullHistory ?? true;
	}

	private addToHistory = (entry: ILastAction) => {
		if (this._useFullHistory) {
			this.fullHistory.push(entry);
		}
	}

	public save = (argument: string | string[], action: ACTIONS, lastOptionClose?: boolean) => {
		const historyEntry = {
			argument,
			lastOptionClose: lastOptionClose ?? this.last.lastOptionClose,
			action,
		};

		this.last = historyEntry;
		this.addToHistory(historyEntry);
	}

	public retrieve = () => {
		return this.last;
	}

	public shift = () => {
		if (this._useFullHistory) {
			return this.fullHistory.shift();
		}
		return undefined;
	}

	public pop = () => {
		if (this._useFullHistory) {
			return this.fullHistory.pop();
		}
		return undefined;
	}

	public length = () => {
		return this.fullHistory.length;
	}

	public get = () => {
		return this.fullHistory;
	}
}