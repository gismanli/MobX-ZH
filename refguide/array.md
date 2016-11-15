## Observable Arrays

和对象相似，使用`observable`也可以使数组变成可观察的，其还是通过递归工作实现的，所以所有（将来有）的数组值都是可被观察的。

```javascript
import {observable, autorun} from "mobx";

var todos = observable([
	{ title: "Spoil tea", completed: true },
	{ title: "Make coffee", completed: false }
]);

autorun(() => {
	console.log("Remaining:", todos
		.filter(todo => !todo.completed)
		.map(todo => todo.title)
		.join(", ")
	);
});
// Prints: 'Remaining: Make coffee'

todos[0].completed = false;
// Prints: 'Remaining: Spoil tea, Make coffee'

todos[2] = { title: 'Take a nap', completed: false };
// Prints: 'Remaining: Spoil tea, Make coffee, Take a nap'

todos.shift();
// Prints: 'Remaining: Make coffee, Take a nap'
```

由于 ES5 中原生数组的限制（`array.observe`仅在 ES7 中可用, 并且数组无法扩展），`observable`将参数提供的数组进行克隆替代原始的那个。在实践中，这些数组工作的和原生的数组一样好，并且其支持所有原生方法，包括索引分配，up-to 和包括数组的长度。


Bear in mind however that `Array.isArray(observable([]))` will yield `false`, so whenever you need to pass an observable array to an external library,
it is a good idea to _create a shallow copy before passing it to other libraries or built-in functions_ (which is good practice anyway) by using `array.slice()`.
In other words, `Array.isArray(observable([]).slice())` will yield `true`.

Unlike the built-in implementation of the functions `sort` and `reverse`, observableArray.sort and reverse  will not change the array in-place, but only will return a sorted / reversed copy.

Besides all built-in functions, the following goodies are available as well on observable arrays:

* `intercept(interceptor)`. Can be used to intercept any change before it is applied to the array. See [observe & intercept](observe.md) 
* `observe(listener, fireImmediately? = false)` Listen to changes in this array. The callback will receive arguments that express an array splice or array change, conforming to [ES7 proposal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe). It returns a disposer function to stop the listener.
* `clear()` Remove all current entries from the array.
* `replace(newItems)` Replaces all existing entries in the array with new ones.
* `find(predicate: (item, index, array) => boolean, thisArg?, fromIndex?)` Basically the same as the ES7 `Array.find` proposal, except for the additional `fromIndex` parameter.
* `remove(value)` Remove a single item by value from the array. Returns `true` if the item was found and removed.
* `peek()` Returns an array with all the values which can safely be passed to other libraries, similar to `slice()`.
In contrast to `slice`, `peek` doesn't create a defensive copy. Use this in performance critical applications if you know for sure that you use the array in a read-only manner.
In performance critical sections it is recommended to use a flat observable array as well.
