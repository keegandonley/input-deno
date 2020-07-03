import Input from './index.ts';

const input = new Input();

while (!input.done) {
	await input.question("Say something: ", false);
	await input.question("Say something with newline:");
	await input.choose(['Option 1', 'Option 2', 'Quit'], true);
}
