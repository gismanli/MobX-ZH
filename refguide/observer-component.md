# @observer

`observer`方法/装饰器可以用于将ReactJS组件转换为响应式组件。它将组件中的`render`函数包在`mobx.autorun`中以确保组件渲染期间使用的任何数据变化时强制重新渲染。它通过单独的`mobx-react`包提供。

```javascript
import {observer} from "mobx-react";

var timerData = observable({
    secondsPassed: 0
});

setInterval(() => {
    timerData.secondsPassed++;
}, 1000);

@observer class Timer extends React.Component {
    render() {
        return (<span>Seconds passed: { this.props.timerData.secondsPassed } </span> )
    }
});

React.render(<Timer timerData={timerData} />, document.body);
```

提示：当`obserer`需要和其它装饰器或者高阶组件组合时，确保`observer`是最内层（首次应用）的装饰器，否则它可能什么事情都不会做。

注意，使用`@observer`装饰器是可选的，和`observer(class Timer ... { })`实现是完全相同的。

## 疑难杂症: 间接引用你组件 _中_ 的值

MobX可以做很多事，但是它不能使原始数据可观察（虽然可以把它们包含在一个对象中，见[boxed observables](boxed.md)）。所以它观察的不是对象中的 _值_，而是 _属性_。这意味着`observer`实际上反应了你间接引用一个值的事实。所以我们在上面的例子中，如果我们如下初始化，则`Timer`组件**不会**做出响应。

```javascript
React.render(<Timer timerData={timerData.secondsPassed} />, document.body)
```

在这段代码里，我们只是吧`secondsPassed`的当前值传递给`Timer`，这是不可变得值`0`(JS中所有的原始数据都是不可变的）。这个数字在将来不会再发生改变，所以`Timer`将永远不会更新。属性`secondsPassed`将来会发生改变，所以我们需要在组件 _中_ 访问它。换句话说：值需要通过 _引用_ 传递 而非 _值_ 传递。 

## ES5 支持

在 ES5 环境下，observer 组件可以简单的通过使用`observer(React.createClass({ ... `声明。另请参考 [syntax guide](../best/syntax.md)

## 无状态函数组件

上面的timer小部件也可以通过给`observer`传递无状态函数组件进行编写：

```javascript
import {observer} from "mobx-react";

const Timer = observer(({ timerData }) =>
    <span>Seconds passed: { timerData.secondsPassed } </span>
);
```

## 观察组件本地状态

就像正常的类一样，你可以在组件中使用`@observable`装饰器引入可观察的属性。这意味着你可以有组件自己的本地状态，而且不需要React的冗余和强制的`setState`机制来管理它，它是非常强大的。响应状态将由`render`接收，而不会显式的调用React的生命周期方法如`componentShouldUpdate`或`componentWillUpdate`。如果你需要她们，只需正常使用React基于`state`的APIs即可。

上面的例子也可以写成：

```javascript
import {observer} from "mobx-react"
import {observable} from "mobx"

@observer class Timer extends React.Component {
    @observable secondsPassed = 0

    componentWillMount() {
        setInterval(() => {
            this.secondsPassed++
        }, 1000)
    }

    render() {
        return (<span>Seconds passed: { this.secondsPassed } </span> )
    }
})

React.render(<Timer />, document.body)
```

对于使用可被观察的组件局部状态有很多优点，具体详见 [我们为什么要停止使用`setState`](https://medium.com/@mweststrate/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e)

## 将`observer`连接到 stores

`mobx-react`包也提供了`Provider`组件，可以用于使用React的上下文机制来传递stores。为了连接多个stores，可以传递一个store名称的数组参数给`observer`，它会把这些stores变成props。当使用装饰器（`@observer(["store"]) class ...`）或者`observer(["store"], React.createClass({ ...`方法也是支持的。

Example:

```javascript
const colors = observable({
   foreground: '#000',
   background: '#fff'
});

const App = () =>
  <Provider colors={colors}>
     <app stuff... />
  </Provider>;

const Button = observer(["colors"], ({ colors, label, onClick }) =>
  <button style={{
      color: colors.foreground,
      backgroundColor: colors.background
    }}
    onClick={onClick}
  >{label}<button>
);

// later..
colors.foreground = 'blue';
// all buttons updated
```

有关更多信息，请参阅 `mobx-react`[ docs](https://github.com/mobxjs/mobx-react#provider-experimental)。

## 何时使用`observer`?

这里有一个简单的原则：_所有使用可观察数据渲染的组件_。如果你不想把这个组件标记为可观察的，例如为了减少通用组件库的依赖，请确保你传递的只是纯粹的数据。

通过使用`@observer`，我们就不需要为了渲染的目的区分 'smart' 组件和 'dump' 组件。它仍然是一个很好的分离，我们只需关注在哪里处理事件，发起请求等。当它们 _自身_ 的依赖发生变化时，所有的组件都负责更新。它的开销是可以忽略的，它可以确保每当你使用可观察的数据时，组件将会根据它响应。更多信息请参阅 [thread](https://www.reddit.com/r/reactjs/comments/4vnxg5/free_eggheadio_course_learn_mobx_react_in_30/d61oh0l)

## `observer`和`PureRenderMixin`

`observer`也是阻止 _props_ 浅改变时的重新渲染，这使得传递到组件的数据是具有响应性的，这是非常有意义的。这个行为和 [React PureRender mixin](https://facebook.github.io/react/docs/pure-render-mixin.html)是非常相似的，除了仍然还是要处理状态改变。如果一个组件提供了它自己的`shouldComponentUpdate`，那么它的优先级更高。可以参阅这个解释 [github issue](https://github.com/mobxjs/mobx/issues/101)

## `componentWillReact` (生命周期钩子)

React组件通常在一个新的堆栈上渲染，这使得它经常很难弄清楚到底是什么 _导致_ 了组件的重新渲染。当使用`mobx-react`时，你可以定义一个新的生命周期钩子，当一个组件将要计划重新渲染是，`componentWillReact`(双关语)将会被触发，应为它观察到的数据已经发生了变化。这使得它很容易的追踪到什么造成了组件的重新渲染。

```javascript
import {observer} from "mobx-react";

@observer class TodoView extends React.Component {
    componentWillReact() {
        console.log("I will re-render, since the todo has changed!");
    }

    render() {
        return <div>this.props.todo.title</div>;
    }
}
```

* `componentWillReact` 没有参数
* `componentWillReact` 初始化render之前不会被触发(使用`componentWillMount`取代)
* `componentWillReact` 当接收到新的 props 或代用`setState`之后不会被触发(使用`componentWillUpdate`替代)

## 优化 components

请参阅相关 [章节](../best/react-performance.md).

## MobX-React-DevTools

你可以结合`@observer`使用 Mobx-React-DevTools，它可以展示出你的组件何时重新渲染，并且你还可以查看你的组件依赖哪些数据。详情请参阅 [DevTools](../best/devtools.md) 章节.

##  observer 组件的特征

* Observer 仅仅订阅上次组件渲染时主动使用的数据结构。这意味着你不能 under-subscribe 或 over-subscribe，你甚至可以在渲染时使用稍后才可用的数据，这是异步加载数据的理想选择。
* 你不需要声明组件将要使用什么数据，而相反，它是在运行时才确定其依赖并进行以精细化的方式跟踪。
* 通常，响应式组件没有或有极少的状态，因为在与其它组件共享的对象中封装（视图）状态通常更方便。但你仍可以自用的使用其状态。
* `@observer`与`PureRenderMixin`实现`shouldCompoentUpdate`的方式一样，所以其子元素没有重新进行渲染的必要。
* 响应式组件侧向加载数据，所以其父组件如果没必要更新，其就不会重新渲染，即使它的子组件需要重新渲染。
* `@observer` 不依赖于 React 的上下文系统。

## 在你的编译器中启用 ES6 装饰器语法支持

在默认情况下，使用 TypeScript 或 Babel等待 ES 标准中的定义时，装饰器语法是不被支持的。

* 对于 _typescript_, 启用 `--experimentalDecorators` 编译标志或配置编译选项`experimentalDecorators`为`true`在`tsconfig.json`中(推荐)
* 对于 _babel5_, 确保把`--stage 0`传递给 Babel CLI
* 对于 _babel6_, 请参阅此处建议的实例配置 [issue](https://github.com/mobxjs/mobx/issues/105)

