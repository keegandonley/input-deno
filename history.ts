import { ILastAction, ACTIONS } from './types.ts';

export default class History {
	private last: ILastAction = {
		argument: '',
		lastOptionClose: false,
		action: ACTIONS.NONE,
		includeNewline: false,
	};

	public save = (argument: string | string[], action: ACTIONS, lastOptionClose?: boolean, includeNewline?: boolean) => {
		this.last = {
			argument,
			lastOptionClose: lastOptionClose ?? this.last.lastOptionClose,
			includeNewline: includeNewline ?? this.last.includeNewline,
			action,
		}
	}

	public retrieve = () => {
		return this.last;
	}
}