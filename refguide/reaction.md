#Reaction

用法: `reaction(() => data, data => { sideEffect }, fireImmediately = false, delay = 0)`.

它是一个提供了细粒度控制追踪哪些 observables 的 `autorun` 变种。
它接收两个函数, 第一个是用来追踪并返回数据并作为第二个方法的输入的副作用。
不同于 `autorun`, 当其创建时副作用不会直接运行，只有在数据表达式首次返回一个新值后才会运行。
在执行副作用时访问的任何 observable 都不会被追踪。
这个副作用是可以去抖的，就像 `autorunAsync`。
`reaction` 返回一个清理事务函数。
如果传给 `reaction` 的第一个参数是字符串, 它将被用来作为调试名称。
传入 `reaction` 的函数 `当` 调用时会接收一个参数，即当前的 reaction，可以用来在执行期间进行清理事务。

值得注意的是副作用 *仅* 对数据表达式中 *访问* 的数据作出响应，这可能会比实际在效果函数使用的数据要少。
当然, 副作用只会在表达式返回的数据发生更改时触发（修饰符 `asStructure` 可用于比较深的执行）。
换句话说: `reactio` 需要你生产副作用中所需要的东西。

在下面的示例中，`reaction1`、`reaction2` 和 `autorun1` 都会对 `todos` 数组中的 `todo` 的添加、删除或替换作出响应。
但只有 `reaction2` 和 `autorun` 会对某个 `todo` 的 `title` 变化作出响应，因为在 `reaction2` 的数据表达式中使用了 `title`，而 `reaction1` 的数据表达式没有使用。
`autorun` 追踪完整的副作用，因此它将始终正确触发，但也更容易意外地访问相关数据。更多资料查看: [what will MobX React to?](../best/react).

```javascript
const todos = observable([
    {
        title: "Make coffee",
        done: true,
    },
    {
        title: "Find biscuit",
        done: false
    }
]);

// wrong use of reaction: reacts to length changes, but not to title changes!
const reaction1 = reaction(
    () => todos.length,
    length => console.log("reaction 1:", todos.map(todo => todo.title).join(", "))
);

// correct use of reaction: reacts to length and title changes
const reaction2 = reaction(
    () => todos.map(todo => todo.title),
    titles => console.log("reaction 2:", titles.join(", "))
);

// autorun reacts to just everything that is used in it's function
const autorun1 = autorun(
    () => console.log("autorun 1:", todos.map(todo => todo.title).join(", "))
);

todos.push({ title: "explain reactions", done: false });
// prints:
// reaction 1: Make coffee, find biscuit, explain reactions
// reaction 2: Make coffee, find biscuit, explain reactions
// autorun 1: Make coffee, find biscuit, explain reactions

todos[0].title = "Make tea"
// prints:
// reaction 2: Make tea, find biscuit, explain reactions
// autorun 1: Make tea, find biscuit, explain reactions
```

Reaction 大致来讲其是 `computed(expression).observe(action(sideEffect))` 或 `autorun(() => action(sideEffect)(expression)` 的语法糖。