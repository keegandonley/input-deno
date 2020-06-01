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

Deno.test("Initialize successfully with useFullHistory on", () => {
  const history = new History({
    useFullHistory: true,
  });
  history.retrieve();
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
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Pop history (question)", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION);
  const lengthInitial = history.length();
  assertEquals(lengthInitial, 1);
  const result = history.pop();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Save history (choose)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, false);
  const result = history.retrieve();
  assertEquals(result, { argument: options, lastOptionClose: false, action: ACTIONS.CHOOSE });
});

Deno.test("Shift history (choose)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, false);
  const lengthInitial = history.length();
  assertEquals(lengthInitial, 1);
  const result = history.shift();
  assertEquals(result, { argument: options, lastOptionClose: false, action: ACTIONS.CHOOSE });
  const length = history.length();
  assertEquals(length, 0);
});

Deno.test("Save history (choose | autoLoop)", () => {
  const history = new History();
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, true);
  const result = history.retrieve();
  assertEquals(result, { argument: options, lastOptionClose: true, action: ACTIONS.CHOOSE });
});

Deno.test("Get full history", () => {
  const history = new History();
  history.save('Hello, World!', ACTIONS.QUESTION);
  const result = history.retrieve();
  assertEquals(result, { argument: 'Hello, World!', lastOptionClose: false, action: ACTIONS.QUESTION });
  const options = ["Hello, World!", "Goodbye!"];
  history.save(['Hello, World!', 'Goodbye!'], ACTIONS.CHOOSE, true);
  const result2 = history.retrieve();
  assertEquals(result2, { argument: options, lastOptionClose: true, action: ACTIONS.CHOOSE });
  const result3 = history.get();
  assertEquals(result3, [result, result2]);
});