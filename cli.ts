import Input from './index.ts';

const input = new Input();

while (!input.done) {
	await input.question("Say something: ", false);
	await input.question("Say something with newline:");
}
