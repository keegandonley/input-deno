import { ILastAction, ACTIONS } from './types.ts';

export default class History {
	private last: ILastAction = {
		argument: '',
		lastOptionClose: false,
		action: ACTIONS.NONE,
		includeNewline: false,
		privateInput: false,
	};

	public save = (argument: string | string[], action: ACTIONS, lastOptionClose?: boolean, includeNewline?: boolean, privateInput?: boolean) => {
		this.last = {
			argument,
			lastOptionClose: lastOptionClose ?? this.last.lastOptionClose,
			includeNewline: includeNewline ?? this.last.includeNewline,
			privateInput: privateInput ?? this.last.privateInput,
			action,
		}
	}

	public retrieve = () => {
		return this.last;
	}
}