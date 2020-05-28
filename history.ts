import { ILastAction, ACTIONS } from './types.ts';

export default class History {
	private last: ILastAction = {
		argument: '',
		lastOptionClose: false,
		action: ACTIONS.NONE,
	};

	public save = (argument: string | string[], action: ACTIONS, lastOptionClose?: boolean) => {
		this.last = {
			argument,
			lastOptionClose: lastOptionClose ?? this.last.lastOptionClose,
			action,
		}
	}

	public retrieve = () => {
		return this.last;
	}
}