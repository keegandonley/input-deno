import History from './history.ts';
import { assertEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { ACTIONS } from './types.ts';

Deno.test("Initialize successfully", () => {
  const history = new History();
  history.retrieve();
});

Deno.test("Get default history", () => {
  const history = new History();
  const result = history.retrieve();
  assertEquals(result, {
	  argument: '',
	  lastOptionClose: false,
	  action: ACTIONS.NONE,
	  includeNewline: false,
	  privateInput: false,
	});
});

Deno.test("Save history (question)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION);
  const result = history.retrieve();
  assertEquals(result, {
	  argument: 'Hello, World!',
	  lastOptionClose: false,
	  action: ACTIONS.QUESTION,
	  includeNewline: false,
	  privateInput: false,
	});
});

Deno.test("Save history (question) (privateInput)", () => {
	const history = new History();
	history.save('Hello, World!', ACTIONS.QUESTION, undefined, undefined, true);
	const result = history.retrieve();
	assertEquals(result, {
		argument: 'Hello, World!',
		lastOptionClose: false,
		action: ACTIONS.QUESTION,
		includeNewline: false,
		privateInput: true,
	});
});

Deno.test("Save history (question) (newLine)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION, undefined, true);
  const result = history.retrieve();
  assertEquals(result, {
	  argument: 'Hello, World!',
	  lastOptionClose: false,
	  action: ACTIONS.QUESTION,
	  includeNewline: true,
	  privateInput: false,
	});
});

Deno.test("Save history (choose)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, false);
  const result = history.retrieve();
  assertEquals(result, {
	  argument: options,
	  lastOptionClose: false,
	  action: ACTIONS.CHOOSE,
	  includeNewline: false,
	  privateInput: false,
	});
});

Deno.test("Save history (choose) (autoLoop)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, true);
  const result = history.retrieve();
  assertEquals(result, {
	  argument: options,
	  lastOptionClose: true,
	  action: ACTIONS.CHOOSE,
	  includeNewline: false,
	  privateInput: false,
	});
});
