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

请记住无论如何`Array.isArray(observable([]))`都将返回`false`，所以当你需要传递一个可观察的数组给外部库时，最好使用`array.slice()` _创建一个其浅拷贝在传递给其它库或者内置函数_ 使用（这是最好的做法）。换句话说，`Array.isArray(observable([]).slice())`将会返回`true`。

和函数内置实现的`sort`和`reverse`不同，observableArray.sort 和 reverse 不会改变数组的结构, 只会返回一个 sorted / reversed 的克隆。

除了所有的内置函数，下面的方法对可观察的数组来说也是非常有用的：

* `intercept(interceptor)`，它可以作用于数组以拦截任何改变前的状态，具体请参阅[observe & intercept](observe.md) 
* `observe(listener, fireImmediately? = false)`监听数组的改变。其回调会在数组拼接或数组变化时接收参数 ：(。它将返回一个处理函数以停止监听。
* `clear()` 从数组中删除 
* `replace(newItems)` 用一个新的条目替换数组中所有存在的条目。
* `find(predicate: (item, index, array) => boolean, thisArg?), fromIndex?)` 基本上和ES7的`Array.find`提议相同，除了附加的`fromIndex`。
* `remove(value)`按值移除数组中的单条条目。如果找到它们并移除时将会返回`true`。
* `peek()` 返回一个包含所有值的并可以安全的传递给其它库使用的数组，就像`slice()`一样。和`slice`不同，`peek`并不会创建一个新的副本。如果你确定要以只读方式使用数组，你可以在对对性能要求较高的应用中使用它。在性能关键部分，建议也使用可观察的数组。