export interface IConfig {
  silent?: boolean;
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