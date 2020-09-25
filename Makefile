test:
	deno test index.test.ts
	deno test history.test.ts

cli:
	deno run cli.ts

cli-unstable:
	deno run --unstable cli.ts