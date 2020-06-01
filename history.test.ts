import History from './history.ts';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ACTIONS } from './types.ts';

Deno.test("Initialize successfully with no options", () => {
  const history = new History();
  history.retrieve();
});

Deno.test("Initialize successfully with useFullHistory off", () => {
  const history = new History({
	  useFullHistory: false,
  });
  history.retrieve();
});

Deno.test("fullHistoryEnabled should be false", () => {
  const history = new History({
    useFullHistory: false,
  });
  const result = history.fullHistoryEnabled();
  assertEquals(result, false);
});

Deno.test("Initialize successfully with useFullHistory on", () => {
  const history = new History({
    useFullHistory: true,
  });
  history.retrieve();
});

Deno.test("fullHistoryEnabled should be true", () => {
  const history = new History({
    useFullHistory: true,
  });
  const result = history.fullHistoryEnabled();
  assertEquals(result, true);
});

Deno.test("Get default history", () => {
  const history = new History();
  const result = history.retrieve();
  assertEquals(result, { argument: '', lastOptionClose: false, action: ACTIONS.NONE });
});

Deno.test("Get default history length", () => {
  const history = new History();
  const result = history.length();
  assertEquals(result, 0);
});

Deno.test("Default history shift()", () => {
  const history = new History();
  const result = history.shift();
  assertEquals(result, undefined);
});

Deno.test("Default history pop()", () => {
  const history = new History();
  const result = history.pop();
  assertEquals(result, undefined);
});

Deno.test("Save history (question)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION);
  const result = history.retrieve();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION });
});

Deno.test("Shift history (question)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION);
  const lengthInitial = history.length();
  assertEquals(lengthInitial, 1);
  const result = history.shift();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION, result: undefined });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Shift history (question | value set)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION, 'Hi there!');
  const lengthInitial = history.length();
  assertEquals(lengthInitial, 1);
  const result = history.shift();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION, result: 'Hi there!' });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Pop history (question)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION);
  const lengthInitial = history.length();
  assertEquals(lengthInitial, 1);
  const result = history.pop();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION, result: undefined });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Save history (choose)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, undefined, false);
  const result = history.retrieve();
  assertEquals(result, { argument: options, lastOptionClose: false, action: ACTIONS.CHOOSE });
});

Deno.test("Shift history (choose)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, undefined, false);
  const lengthInitial = history.length();
  assertEquals(lengthInitial, 1);
  const result = history.shift();
  assertEquals(result, { argument: options, lastOptionClose: false, action: ACTIONS.CHOOSE, result: undefined });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Shift history (choose | value set)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, '0', false);
  const lengthInitial = history.length();
  assertEquals(lengthInitial, 1);
  const result = history.shift();
  assertEquals(result, { argument: options, lastOptionClose: false, action: ACTIONS.CHOOSE, result: '0' });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Save history (choose | autoLoop)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, undefined, true);
  const result = history.retrieve();
  assertEquals(result, { argument: options, lastOptionClose: true, action: ACTIONS.CHOOSE });
});

Deno.test("Get full history", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION);
  const result = history.retrieve();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION });
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, undefined, true);
  const result2 = history.retrieve();
  assertEquals(result2, { argument: options, lastOptionClose: true, action: ACTIONS.CHOOSE });
  const result3 = history.get();
  assertEquals(result3, [{
	  ...result,
	  result: undefined,
  }, {
	  ...result2,
	  result: undefined,
  }]);
});

Deno.test("Get full history (value set)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION, 'Hey hey hey');
  const result = history.retrieve();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION });
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, '1', true);
  const result2 = history.retrieve();
  assertEquals(result2, { argument: options, lastOptionClose: true, action: ACTIONS.CHOOSE });
  const result3 = history.get();
  assertEquals(result3, [{
	  ...result,
	  result: 'Hey hey hey',
  }, {
	  ...result2,
	  result: '1',
  }]);
});