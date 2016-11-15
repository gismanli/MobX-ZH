# MobX API 参考

# 核心 API

_MobX中最重要的API，理解_`observable, computed, reactions, actions`_就足够在我们的应用程序中使用MobX了！_

## 创建observables

### `observable`

* `observable(value)`
* `@observable classProperty = value`

Observable的值可以是JS元数据，引用，纯对象，类实例，数组和maps。

有如下转换规则，但是它们可以使用修饰符微调，我们往下看。

1. 如果`value`是在`asMap`里面的，将会返回一个新的[Observable Map](map.md)。当你想指定一个特定条目改变时不触发响应，Observable maps是非常有用的，当然也报过条目的增加或删除。
2. 如果`value`是一个数组，将会返回一个新的[Observable Array](array.md)。
3. 如果`value`是一个_无_原型的对象，其当前含有的所有属性都会被观察。详见[Observable Object](object.md)。
4. 如果`value`是_包含_原型，JS元数据或者方法，将会返回一个[Boxed Observable](boxed.md)。MobX不会自动的观察一个包含原型的对象，因为这是它的构造函数的责任。在构造函数中使用`extendObservable`，或者试用`@observable`修饰符在其类定义的时候取代。

这些规则第一眼看上去很复杂，但是在实际使用中，你会发现它们运作起来是非常直观的。

一些注意事项：

* :\(
* 如果使用`@overvable`装饰器，要确保在你的编译器\(babel 或 typescript\)中[启用装饰器语法](http://mobxjs.github.io/mobx/refguide/observable-decorator.html)
* 默认创建一个可观察的数据结构是

### `extendObservable`

用法: `extendObservable(target, propertyMap)`
对于`propertyMap`中的任何一个键/值对，目标对象上将会被引入一个新的`observable`属性。我们可以使用它在`constructor`构造函数引入`observable`属性取代`decorators`装饰器方法。如果`propertyMap`中的值为无参函数时，会被当做是一个`computed`属性。

## Computed values

用法：
* `computed(() => expression)`
* `@computed get classProperty() { return expression; }`

创建一个`computed`属性。表达式`expression`应该返回一个值而不应该包含其它副作用。当任何被观察的变量改变时，表达式会自动重新运行计算，当然了只有它使用的`reaction`。

## Actions

任何应用都有`actions`，`Action`可以是修改`State`的任何东西。

使用Mobx，你可以在代码中显式的标记你的`action`。`Actions`帮助你更好的组织你的代码。建议将它们用于修改可观察的变量或具有任何副作用的任何函数。`action`还提供了和开发工具组合使用时的调试信息。

注：如果启用严格模式，则必须使用`action`去操作`State`，详见`useStrict`。

用法：
* `action(fn)`
* `action(name, fn)`
* `@action classMethod`
* `@action(name) classMethod`
* `@action boundClassMethod = (args) => { body }`
* `@action(name) boundClassMethod = (args) => {body}`

## Reactions

`Computed values`是自动对状态变化响应计算的值，而`Reactions`是状态变化时的副作用。`Reaction`可用于确保在相关状态改变（如状态改变，日志记录，网络请求等）时自动的执行某些副作用(主要是`I/O`操作)。最常用的响应是`React`组件的`observer`装饰器（见下文）。

### `observer`

可以作用在React组件周围的高阶语法。然后在组件的`render`函数中使用的任何被observable的变量变化时，组件就自动的重新渲染。**注意`observer`由`mobx-react`包提供，而不是由`mobx`本身提供的**。

用法：
* `observer(React.createClass({ ... }))`
* `observer((props, context) => ReactElement)`
* `observer(class MyComponent extends React.Component { ... })`
* `@observer class MyComponent extends React.Component { ... }`

### `autorun`

用法：`autorun(debugname?, () => { sideEffect })`，`Autorun`会运行提供的`sideEffect`并且会跟踪副作用运行时使用的被观察的状态。任何一个使用的被观察的变量变化时，`sideEffect`都会被重新运行。其返回一个处理器函数以取消副作用。


### `when`

用法：`when(debugname?, () => condition, () => { sideEffect })`。条件表达式在其使用的任何可观察的变量变化时会自动执行。一旦表达式返回true，`sideEffect`函数将被调用，但只调用一次。`when`会返回一个处理器函数以取消整个过程。

### `autorunAsync`

用法：`autorunAsync(debugname?, () => { sideEffect }, delay)`。和`autorun`相似，但是`sideEffect`将被延迟执行以达到去抖目的。

### `reaction`

用法：`reaction(debugname?, () => data, data => { sideEffect }, fireImmediately = false, delay = 0)`。

## Modifiers for `observable`

---

# 实用

### `Provider`

### `inject`

### `toJS`

### `isObservable`

### `isObservableObject|Array|Map`

### `isAction`

### `isComputed`

### `createTransformer`

### `intercept`

### `observe`

### `useStrict`

# 开发实用工具

### `mobx-react-devtools`

### `spy`

### `whyRun`

### `extras.getAtom`

### `extras.getDebugName`

### `extras.getDependencyTree`

### `extras.getObserverTree`

### `extras.isSpyEnabled`

### `extras.spyReport`

### `extras.spyReportStart`

### `extras.spyReportEnd`

### `mobx-react` 开发钩子

# 内部方法

### `transaction`

### `untracked`

### `Atom`

### `Reaction`

### `extras.allowStateChanges`

### `extras.resetGoobalState`

# 可能会被废弃的方法

### `map`

### `expr`

