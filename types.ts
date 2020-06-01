export interface IConfig {
  silent?: boolean;
  useFullHistory?: boolean;
}

export enum ACTIONS {
	NONE,
	CHOOSE,
	QUESTION
}

export interface ILastAction {
	argument: string | string[];
	lastOptionClose: boolean;
	action: ACTIONS;
}

export interface ILastActionFull extends ILastAction {
	result?: string;
}

export interface IHistoryOptions {
	useFullHistory?: boolean;
}

export interface IHistoryAnswers {
	argument: string | string[];
	action: ACTIONS;
	value: string;
}