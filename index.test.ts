import inputLoop from './index.ts';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Should not be done", () => {
  const loop = new inputLoop();
  assertEquals(loop.done, false);
});

Deno.test("Should not be marked as done", () => {
  const loop = new inputLoop();
  loop.close();
  assertEquals(loop.done, true);
});
