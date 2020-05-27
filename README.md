# Input loop

Used to repeatedly get input from the user.

## Choose
Returns an array indicating which index was selected

```javascript
	const input = new InputLoop();
	const accepting = await input.choose(["Accepting node", "Non-accepting node"]);

	// output:

	// ------------------------------
	// 0: Accepting node
	// 1: Non-accepting node
	// ------------------------------

	// Return value:
	// [false, true]
```

## Question
Ask a single question

```javascript
	const input = new InputLoop();
	const nodeName = await input.question('Enter the label for the node:');

	// output:

	// Enter the label for the node:

	// Return Value:
	// 'a'

```

## Looping
Control an input loop which continues reprompting until terminated

```javascript
	const input = new InputLoop();
	const mainQuestions = ["Add a node", "Add an edge", "Set starting node", "Evaluate a string", "Quit"];

	while (!input.done) {
		const result = await input.choose(mainQuestions);

		// Business logic...

		if (result[mainQuestions.length - 1]) {
			input.close();
		}
	}

```