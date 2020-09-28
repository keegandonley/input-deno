import Input from './index.ts';

const input = new Input();

while (!input.done) {
	const result1 = await input.question("Say something: ", false);
	console.log('You said', result1);
	const result2 = await input.question("Say something with newline:");
	console.log('You said', result2);
	const result3 = await input.question("Say something secret:", false, true);
	console.log('You said', result3);
	const result3b = await input.repeat();
	console.log('You said again', result3b);
	const result4 = await input.choose(["Option A", "Option B"], false);
	console.log('You chose', result4);
	const result5 = await input.choose(["Option A Private", "Option B Private"], false, true);
	console.log('You chose', result5);
	await input.choose(["Continue", "Quit"], true);
}

Deno.exit();
