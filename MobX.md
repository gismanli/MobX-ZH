<img src="docs/mobx.png" alt="logo" height="120" align="right" />

# MobX

_简单, 可扩展的状态管理库_

[![Build Status](https://travis-ci.org/mobxjs/mobx.svg?branch=master)](https://travis-ci.org/mobxjs/mobx)

[![Coverage Status](https://coveralls.io/repos/mobxjs/mobx/badge.svg?branch=master&service=github)](https://coveralls.io/github/mobxjs/mobx?branch=master)

[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![npm install mobx](https://nodei.co/npm/mobx.png?downloadRank=true&downloads=true)

* 安装: `npm install mobx --save`.结合React: `npm install mobx-react --save`. 启用 ESNext 装饰 (可选), 可见下文.

* CDN: https://unpkg.com/mobx/lib/mobx.umd.js

## 入门

* [十分钟入门 MobX + React](https://mobxjs.github.io/mobx/getting-started.html)

* [官方文档和API概述](https://mobxjs.github.io/mobx/refguide/api.html)

* 视频教程:

    * [Egghead.io 课程: 用MobX管理React应用中复杂的应用](https://egghead.io/courses/manage-complex-state-in-react-apps-with-mobx) - 30m.

    * [React+MobX 实战](https://www.youtube.com/watch?v=XGwuM_u7UeQ). In depth introduction and explanation to MobX and React by Matt Ruby on OpenSourceNorth (ES5 only) - 42m.

    * LearnCode.academy MobX tutorial [Part I: MobX + React is AWESOME (7m)](https://www.youtube.com/watch?v=_q50BXqkAfI) [Part II: Computed Values and Nested/Referenced Observables (12m.)](https://www.youtube.com/watch?v=nYvNqKrl69s)

    * [Screencast: MobX 简介](https://www.youtube.com/watch?v=K8dr8BMU7-8) - 8m

    * [Talk: State Management Is Easy, React Amsterdam 2016 conf](https://www.youtube.com/watch?v=ApmSsu3qnf0&feature=youtu.be) ([slides](https://speakerdeck.com/mweststrate/state-management-is-easy-introduction-to-mobx))

* [项目实战样例](http://mobxjs.github.io/mobx/faq/boilerplates.html)

* 更多教程，博客和视频可以访问 [MobX 主页](http://mobxjs.github.io/mobx/faq/blogs.html)

## 概述

MobX是一个通过函数式响应编程使得状态管理更简单，扩展性更强的库。

其实MobX的背后理念是非常简单的:

_应用的状态是本源，其他的部分，都应该从本源派生._

其中包括用户界面，数据序列化，服务器通信，等等等。

<img alt="MobX unidirectional flow" src="images/flow.png" align="center" />

React + MobX 是一个非常强大的组合. React提供一个把应用程序的状态渲染成组件树的机制，MobX 提供存储和更新状态然后提供给 React 使用的机制。

React 和 MobX 都提供了一个开发过程中处理问题很理想和独特的的解决方案。React通过虚拟 DOM 减少 UI 渲染过程中 DOM 的操作次数已达到最佳的 UI 渲染。MobX通过一个虚拟的状态依赖图实现只更新  React 组件依赖的状态已达到最佳的的应用状态同步。

## 核心概念

MobX只有几个核心的概念，可以通过下面的实例尝试使用它。[JSFiddle](https://jsfiddle.net/mweststrate/wv3yopo0/) (or [without ES6 and JSX](https://jsfiddle.net/rubyred/55oc981v/)).

### 可观察的状态

MobX 可以直接在现有的数据结构如对象，数组和类实例添加 `observervable` 即可拥有可观察的能力。

这些可以简单的通过 [@observable](http://mobxjs.github.io/mobx/refguide/observable-decorator.html) 标识 (ES.Next) 来实现。

```javascript

class Todo {

    id = Math.random();

    @observable title = "";

    @observable finished = false;

}

```

使用 `observable` 就像是把对象的属性变成了电子表格单元格，

但是并不同于电子表格的是，这些属性不仅仅只能是原始值，还可以是引用，对象和数组，

你甚至可以[自定义](http://mobxjs.github.io/mobx/refguide/extending.html)可被观察的数据源. 

### 在`ES5/ES6/ES.next`环境中使用 MobX

这个 `@` 东西看起来好像很陌生, 它是 ES.next 的一个装饰符。

在MobX是否使用它是可选的. 详见[文档](http://mobxjs.github.io/mobx/best/decorators.html)获取更多信息去使用或者避免使用它们。

MobX 可以运行在任何ES5环境下, 但是利用 ES.next 的功能例如装饰器可以更加舒适的使用MobX。

本文中的大部分都是使用装饰器的，但是请记住， _它们是可选的_。

举个例子， 在 ES5 规范下的代码看起来是应该的:

```javascript

function Todo() {

    this.id = Math.random()

    extendObservable(this, {

        title: "",

        finished: false

    })

}

```

### Computed values

你可以定义一个值，当相关数据被改变的时候，这个值会被自动计算并返回

可以通过使用[`@computed`](http://mobxjs.github.io/mobx/refguide/computed-decorator.html)装饰器或者使用 getter / setter 方法当你使用 `(extend)Observable`时。

```javascript

class TodoList {

    @observable todos = [];

    @computed get unfinishedTodoCount() {

        return this.todos.filter(todo => !todo.finished).length;

    }

}

```

MobX 会确保 `unfinishedTodoCount` 自动更新当一个todo增加或者其中一个 `finished`属性修改时。就像 MS Excel 中的表格自动根据公式计算值一样，它们都是自动计算的，可以很好的解决多属性依赖问题。

### Reactions

Reactions 和 computed 很像，但是他并不是生成一个新值，只是一个产生一个相应的副作用，譬如在控制台打印，发起网络请求，增量更新 React 组件树去更改DOM，等等等.

简而言之，reactions 在开发中连接了 [reactive](https://en.wikipedia.org/wiki/Reactive_programming) 和 [imperative](https://en.wikipedia.org/wiki/Imperative_programming)。

#### React 组件

如果你在使用 React，你可以把你的(弱状态依赖函数)组件简单的通过加入 [`observer`](http://mobxjs.github.io/mobx/refguide/observer-component.html)方法或者装饰器包装起来。

```javascript

import React, {Component} from 'react';

import ReactDOM from 'react-dom';

import {observer} from "mobx-react";

@observer class TodoListView extends Component {

    render() {

        return <div>

            <ul>

                {this.props.todoList.todos.map(todo =>

                    <TodoView todo={todo} key={todo.id} />

                )}

            </ul>

            Tasks left: {this.props.todoList.unfinishedTodoCount}

        </div>

    }

}

const TodoView = observer(({todo}) =>

    <li>

        <input

            type="checkbox"

            checked={todo.finished}

            onClick={() => todo.finished = !todo.finished}/>

            {todo.title}

    </li>

)

const store = new TodoList();

ReactDOM.render(<TodoListView todoList={store} />, document.getElementById('mount'));

```

`observer` turns React (function) components into derivations of the data they render. When using MobX there are no smart or dumb components. All components render smartly but are defined in a dumb manner. MobX will simply make sure the components are always re-rendered whenever needed, but also no more than that. So the `onClick` handler in the above example will force the proper `TodoView` to render, and it will cause the `TodoListView` to render if the number of unfinished tasks has changed. However, if you would remove the `Tasks left` line (or put it into a separate component), the `TodoListView` will no longer re-render when ticking a box. You can verify this yourself by changing the [JSFiddle](https://jsfiddle.net/mweststrate/wv3yopo0/).

#### 自定义 Reactions

Custom reactions 可以简单的创建通过 [`autorun`](http://mobxjs.github.io/mobx/refguide/autorun.html), [`autorunAsync`](http://mobxjs.github.io/mobx/refguide/autorun-async.html) or [`when`](http://mobxjs.github.io/mobx/refguide/when.html) 方法去满足具体情况。

举个例子，下面的 `autorun` 会每次打印出`unfinishedTodoCount`变化的日志信息 

```javascript

autorun(() => {

    console.log("Tasks left: " + todos.unfinishedTodoCount)

})

```

### MobX 是如何响应工作的?

为什么`unfinishedTodoCount`每次变化时都会打印出新的消息呢？答案是这样的: 

_MobX会根据任何现有的可观察属性然后做出执行跟踪很能。_

_MobX reacts to any existing observable property that is read during the execution of a tracked function._

有关 Mobx 是如何确定一个观察是否需要相应的，可查看[理解 MobX 是如何响应的](https://github.com/mobxjs/mobx/blob/gh-pages/docs/best/react.md)

### Actions

不同于 FLUX 架构，MobX是不会处理用户的事件响应的。

* 这些是可以在flux中完成的比如manner

* 或者通过使用RxJS处理事件.

* 或者使用更简单直截了当的事件处理方式, 比如演示中的使用 `onClick` 事件.

最后简而言之: Somehow the state should be updated.

After updating the state `MobX` will take care of the rest in an efficient, glitch-free manner. So simple statements, like below, are enough to automatically update the user interface. There is no technical need for firing events, calling dispatcher or what more. A React component is in the end nothing more than a fancy representation of your state. A derivation that will be managed by MobX.

```javascript

store.todos.push(

    new Todo("Get Coffee"),

    new Todo("Write simpler code")

);

store.todos[0].finished = true;

```

然而， MobX 有一个内置的可选方法 [`actions`](https://mobxjs.github.io/mobx/refguide/action.html).

使用它们会有很多优点; 他们会帮助你组织更优秀的代码结构，当任何状态需要修改时。

## MobX: 简单可扩展

MobX is one of the least obtrusive libraries you can use for state management. That makes the `MobX` approach not just simple, but very scalable as well:

### Using classes and real references

With MobX you don't need to normalize your data. This makes the library very suitable for very complex domain models (At Mendix for example ~500 different domain classes in a single application). 

### Referential integrity is guaranteed

Since data doesn't need to be normalized, and MobX automatically tracks the relations between state and derivations, you get referential integrity for free. Rendering something that is accessed through three levels of indirection?

No problem, MobX will track them and re-render whenever one of the references changes. As a result staleness bugs are a thing of the past. As a programmer you might forget that changing some data might influence a seemingly unrelated component in a corner case. MobX won't forget.

### Simpler actions are easier to maintain

As demonstrated above, modifying state when using MobX is very straightforward. You simply write down your intentions. MobX will take care of the rest.

### Fine grained observability is efficient

MobX builds a graph of all the derivations in your application to find the least number of re-computations that is needed to prevent staleness. "Derive everything" might sound expensive, MobX builds a virtual derivation graph to minimize the number of recomputations needed to keep derivations in sync with the state.

In fact, when testing MobX at Mendix we found out that using this library to track the relations in our code is often a lot more efficient than pushing changes through our application by using handwritten events or "smart" selector based container components.

The simple reason is that MobX will establish far more fine grained 'listeners' on your data than you would do as a programmer.

Secondly MobX sees the causality between derivations so it can order them in such a way that no derivation has to run twice or introduces a glitch.

How that works? See this [in-depth explanation of MobX](https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254).

### Easy interoperability

MobX works plain javascript structures. Due to its unobtrusiveness it works with most javascript libraries out of the box, without needing MobX specific library flavors.

So you can simply keep using your existing router, data fetching and utility libraries like `react-router`, `director`, `superagent`, `lodash` etc.

For the same reason you can use it out of the box both server- and client side, in isomorphic applications and with react-native.

The result of this is that you often need to learn fewer new concepts when using MobX in comparison to other state management solutions.

---

<center> <img src="https://www.mendix.com/styleguide/img/logo-mendix.png" align="center" width="200"/> __MobX is proudly used in mission critical systems at [Mendix](https://www.mendix.com)__ </center>

## Credits

MobX is inspired by reactive programming principles as found in spreadsheets. It is inspired by MVVM frameworks like in MeteorJS tracker, knockout and Vue.js. But MobX brings Transparent Functional Reactive Programming to the next level and provides a stand alone implementation. It implements TFRP in a glitch-free, synchronous, predictable and efficient manner.

A ton of credits for [Mendix](https://github.com/mendix), for providing the flexibility and support to maintain MobX and the chance to prove the philosophy of MobX in a real, complex, performance critical applications.

And finally kudos for all the people that believed in, tried, validated and even [sponsored](https://github.com/mobxjs/mobx/blob/master/sponsors.md) MobX.

## Further resources and documentation

* [MobX homepage](http://mobxjs.github.io/mobx/faq/blogs.html)

* [API overview](http://mobxjs.github.io/mobx/refguide/api.html)

* [Tutorials, Blogs & Videos](http://mobxjs.github.io/mobx/faq/blogs.html)

* [Boilerplates](http://mobxjs.github.io/mobx/faq/boilerplates.html)

* [Related projects](http://mobxjs.github.io/mobx/faq/related.html)

## What others are saying...

> After using #mobx for lone projects for a few weeks, it feels awesome to introduce it to the team. Time: 1/2, Fun: 2X

> Working with #mobx is basically a continuous loop of me going “this is way too simple, it definitely won’t work” only to be proven wrong

> Try react-mobx with es6 and you will love it so much that you will hug someone.

> I have built big apps with MobX already and comparing to the one before that which was using Redux, it is simpler to read and much easier to reason about.

> The #mobx is the way I always want things to be! It's really surprising simple and fast! Totally awesome! Don't miss it!

## Contributing

* Feel free to send small pull requests. Please discuss new features or big changes in a GitHub issue first.

* Use `npm test` to run the basic test suite, `npm run coverage` for the test suite with coverage and `npm run perf` for the performance tests.

## Bower support

Bower support is available through the infamous npmcdn.com: `bower install https://npmcdn.com/mobx/bower.zip`

Then use `lib/mobx.umd.js` or `lib/mobx.umd.min.js`

## MobX was formerly known as Mobservable.

See the [changelog](https://github.com/mobxjs/mobx/blob/master/CHANGELOG.md#200) for all the details about `mobservable` to `mobx`.

## Donating

Was MobX key in making your project a success? Share the victory by using the [donate button](https://mobxjs.github.io/mobx/donate.html)!

MobX is developed largely in free time, so any ROI is appreciated :-).

If you leave a name you will be added to the [sponsors](https://github.com/mobxjs/mobx/blob/master/sponsors.md) list :).

