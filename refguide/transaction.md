# Transaction

`transaction(worker: () => void)` 可用于批量进行一批更新而不通知观察者，直到事务结束。`transaction` 只需要一个且无参的`worker`函数当做参数并运行它。在这个function结束前，不会通知任何观察者。`transaction`返回其`worker`函数返回的任何值。注意`transaction`是完全同步运行的。Transactions可以嵌套使用，但是只有在最外层的`transaction`完成后，待处理的reaction的才会运行。

```javascript
import {observable, transaction, autorun} from "mobx";

const numbers = observable([]);

autorun(() => console.log(numbers.length, "numbers!"));
// Prints: '0 numbers!'

transaction(() => {
	transaction(() => {
		numbers.push(1);
		numbers.push(2);
	});
	numbers.push(3);
});
// Prints: '3 numbers!'
```