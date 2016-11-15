# 概念 & 原则

## 概念

MobX区分下列应用程序中的概念，之前你看到了很多要点，现在让我们深入的了解下他们

### 1. State

_State_是驱动你的应用程序中的数据，通常他们有一些_主特定的状态_，比如一个todo列表，并且还有一些当前选中行的_视图状态_，请记住state就像是电子表格中的单元格。

### 2. Derivations

_任何_东西都是可以派生的(这里太难翻译了)😂

派生有很多种表现形式
* 用户界面
* _派生数据_，比如todos中离开状态
* _后端通信_，比如将改变发给服务器

MobX区分两种不同的派生：
* _Computed values_，这些是可以随时使用纯函数去观测状态的派生
* _Reactions_，它是状态变化时自动触发的副作用，是当前环境和响应式编程中的桥梁，我们要明白，她们最终想达到的就是 I/O。

大家刚开始试用MobX时会频繁的使用reaction，这里有条黄金法则：如果你想根据现有状态创建一个数据，请使用`computed`

回到和电子表格的对比，`computed`就像公式会推导出一个值，但是还需要一个`reaction`重绘GUI，这样用户就可以在屏幕上看到了。

### 3. Actions

一个_Action_就是一段改变_State_的代码，比如用户事件，后端数据保存，回调事件等。_Action_就像用户在电子表格的单元格中新输入一个值。

## Principles

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
