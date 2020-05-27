import inputLoop from './index.ts';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Should not be done", () => {
  const loop = new inputLoop({
	  silent: true,
  });
  assertEquals(loop.done, false);
});

Deno.test("Should be marked as done", () => {
  const loop = new inputLoop({
	  silent: true,
  });
  loop.close();
  assertEquals(loop.done, true);
});

Deno.test("Should choose an answer (number)", async () => {
  const loop = new inputLoop({
	  silent: true,
  });
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], 2);
  assertEquals(result, [false, false, true]);
});

Deno.test("Should choose an answer (string)", async () => {
  const loop = new inputLoop({
	  silent: true,
  });
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], '2');
  assertEquals(result, [false, false, true]);
});

Deno.test("Should not choose an answer (number)", async () => {
  const loop = new inputLoop({
	  silent: true,
  });
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], 3);
  assertEquals(result, [false, false, false]);
});

Deno.test("Should not choose an answer (string)", async () => {
  const loop = new inputLoop({
	  silent: true,
  });
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], '3');
  assertEquals(result, [false, false, false]);
});

Deno.test("Should run repeat on choose success (number)", async () => {
  const loop = new inputLoop({
	silent: true,
	});
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], 2);
  assertEquals(result, [false, false, true]);
  const result2 = await loop.repeat(2);
  assertEquals(result2, [false, false, true]);
});

Deno.test("Should run repeat on choose success (string)", async () => {
  const loop = new inputLoop({
	  silent: true,
  });
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], '2');
  assertEquals(result, [false, false, true]);
  const result2 = await loop.repeat('2');
  assertEquals(result2, [false, false, true]);
});

Deno.test("Should run repeat on choose fail (number)", async () => {
  const loop = new inputLoop({
	  silent: true,
  });
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], 3);
  assertEquals(result, [false, false, false]);
  const result2 = await loop.repeat(3);
  assertEquals(result2, [false, false, false]);
});

Deno.test("Should run repeat on choose fail (string)", async () => {
  const loop = new inputLoop({
	  silent: true,
  });
  const result = await loop.choose(["Option 1", "Option 2", "Option 3"], "3");
  assertEquals(result, [false, false, false]);
  const result2 = await loop.repeat("3");
  assertEquals(result2, [false, false, false]);
});

Deno.test("Should answer a question (number)", async () => {
  const loop = new inputLoop({
    silent: true,
  });
  const result = await loop.question("Please answer the question", 2);
  assertEquals(result, '2');
});

Deno.test("Should answer a question (string)", async () => {
  const loop = new inputLoop({
    silent: true,
  });
  const result = await loop.question("Please answer the question", "Hello!");
  assertEquals(result, "Hello!");
});

Deno.test("Should run repeat on question (string)", async () => {
  const loop = new inputLoop({
    silent: true,
  });
  const result = await loop.question("Please answer the question", "Hello!");
  assertEquals(result, "Hello!");
  const result2 = await loop.repeat("Hello Again!");
  assertEquals(result2, 'Hello Again!')
});
