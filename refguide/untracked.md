# Untracked

Untracked 允许你运行一段代码而不建立观察者。
类似 `transaction`，`untracked` 由 `(@)action` 自动应用，因此通常使用 actions 比直接使用 `untracked` 更有意义。
示例:

```javascript

const person = observable({
	firstName: "Michel",
	lastName: "Weststrate"
});

autorun(() => {
	console.log(
		person.lastName,
		",",
		// this untracked block will return the person's firstName without establishing a dependency
		untracked(() => person.firstName)
	);
});
// prints: Weststrate, Michel

person.firstName = "G.K.";
// doesn't print!

person.lastName = "Chesterton";
// prints: Chesterton, G.K.
```