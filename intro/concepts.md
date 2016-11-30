# 概念 & 原则

## 概念

在你的MobX应用中区分下列概念，之前你看到了很多要点，现在让我们深入的了解下它们

### 1. State

_State_ 是驱动你的应用程序中的数据，通常他们有一些 _特定的主状态_ ，比如一个todo列表，并且还有一些当前选中行的 _视图状态_ ，请记住state就像是电子表格中的单元格。

### 2. Derivations

_任何_ 来自state的东西都是可以派生的 (Anything that can be derived from the state without any further interaction is a derivation)

派生有很多种表现形式
* _用户界面_
* _衍生数据_，比如todos中离开状态
* _后端通信_，比如将改变发给服务器

区分MobX两种不同的派生：
* _Computed values_，这些是可以使用纯函数从当前使用的可观察状态派生出的值
* _Reactions_，它是状态变化时自动触发的副作用，是执行命令和响应式编程中的桥梁，我们要明白，它们最终想达到的就是 I/O。

大家刚开始试用MobX时会频繁的使用reaction，这里有条黄金法则：如果你想根据现有状态创建一个数据，请使用`computed`

回到和电子表格的对比，`computed`就像使用公式会推导出一个值，但是还需要一个`reaction`重绘GUI，这样用户就可以在屏幕上看到了。

### 3. Actions

一个_Action_就是一段改变_State_的代码，比如用户事件，后端数据保存，回调事件等。_Action_就像用户在电子表格的单元格中新输入一个值。

在MobX中你可以明确的定义Actions，从而使你更清晰的组织代码结构。如果在严格模式下使用MobX，MobX会强制执行只有action才可以修改state。

## Principles

MobX提供了一套当 _actoins_ 改变 _state_ 时，然后 _state_ 再反向作用于 _views_  的单向数据流。

![Action, State, View](../images/action-state-view.png)

当状态改变时，所有派生**单元**都会**自动**的更新，这样的结果就是你永远不可能观察到中间值。

默认情况下，所有的派生都是**异步**更新的，这有就意味着，例如action可以在状态改变之后安全的推导计算值。

Computed 值是**延迟**更新的。任何没有在执行中使用到的computed值是不会自动更新的，除非它是一个副作用需要的(I/O)。如果视图不在使用它，它将会被进行垃圾回收。

所有的computed值都应该是纯净的，它们不应该被改变状态。

## Illustration

以下演示了上述的介绍的概念和原则

```javascript
import {observable, autorun} from 'mobx';

var todoStore = observable({
	/* some observable state */
	todos: [],

	/* a derived value */
	get completedCount() {
		return this.todos.filter(todo => todo.completed).length;
	}
});

/* a function that observes the state */
autorun(function() {
	console.log("Completed %d of %d items",
		todoStore.completedCount,
		todoStore.todos.length
	);
});

/* ..and some actions that modify the state */
todoStore.todos[0] = {
	title: "Take a walk",
	completed: false
};
// -> synchronously prints 'Completed 0 of 1 items'

todoStore.todos[0].completed = true;
// -> synchronously prints 'Completed 1 of 1 items'

```

[十分钟入门 MobX + React](https://mobxjs.github.io/mobx/getting-started.html) you can dive deeper into this example and build a user interface using [React](https://facebook.github.io/react/)
