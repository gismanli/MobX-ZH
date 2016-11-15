# Autorun

`mobx.autorun` 可以用于那些只想创建一个反应函数，而它本身永远不会有观察者。这通常是当你需要建立响应到命令式代码，比如日志，持续化或者UI更新代码的桥梁。当使用`autorun`是，每当其依赖任何一个改变都会触发提供的函数。相比之下，`computed(function)`创建的函数只会重新评估它自身是否有观察的变量，否则它的值被认为是不相关的。作为一条法则：如果你有一个应该自动运行的函数但是结果不是一个新的值则使用`autorun`，其余的所有情况用`computed`。Autorun涉及到启动效果，但是并不会产生新值。如果传递给`autorun`的第一个参数是字符串，它将会被用于调试名称。

传递给autorun的函数在调用时将会接收一个参数，即当前reaction(autorun)，可用于在执行期间处理autorun。

和[`@observer` decorator/function](./observer-component.md)一样, `autorun`只会观察在执行期间提供的函数中使用的变量数据。

```javascript
var numbers = observable([1,2,3]);
var sum = computed(() => numbers.reduce((a, b) => a + b, 0));

var disposer = autorun(() => console.log(sum.get()));
// prints '6'
numbers.push(4);
// prints '10'

disposer();
numbers.push(5);
// won't print anything, nor is `sum` re-evaluated
```
