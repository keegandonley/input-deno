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
	includeNewline: boolean;
}

export interface Preferences {
	lastOptionClose?: boolean,
	choice?: string | number,
	
	// Breakpoint
	breakPoint?: number,
	
	// Index
	indexStyle?: string,
	
	// Divider
	dividerUp?: boolean,
	dividerBottom?: boolean
	dividerStyle?: string
}