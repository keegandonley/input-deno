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
	displayInline?: boolean,
	inlineSpacing?: number,
	indexStyle?: string[],
	dividerTop?: boolean,
	dividerBottom?: boolean
	dividerLength?: number
	dividerChar?: string,
	dividerPadding?: boolean
}