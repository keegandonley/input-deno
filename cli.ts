import Input from './index.ts';

const input = new Input();

while (!input.done) {
    await input.question('Say something: ', false);
    await input.question('Say something with newline:');
    await input.choose(['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Quit'], {
        lastOptionClose: true,
        displayInline: true,
        indexStyle: ['{ ', ' }'],
        dividerTop: true,
        dividerBottom: true,
		dividerPadding: true,
		dividerLength: 120,
		inlineSpacing: 8,
		inlineSeparator: ' | '
    });
}
