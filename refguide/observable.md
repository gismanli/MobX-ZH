# observable

用法: 
* `observable(value)`
* `@observable classProperty = value` 

Observable值可以是JS原始数据，引用，普通对象，类实例，数组和 Maps。应用以下转换规则，但是可以通过 *修饰符* 进行微调整。

1. 如果 *值* 包含在`asMap` *修饰符* 中：将会返回一个新的[Observable Map](map.md)。如果你不是想对特定的条目更改，而是对条目的添加或删除，Observable maps 是非常有用的。
1. 如果 *值* 是一个数组，将会返回一个新的[Observable Array](array.md)。
1. 如果 *值* 是一个 *没有* 原型的对象，它所有当前拥有的属性都将会被观察。具体查看[Observable Object](object.md)
1. 如果 *值* 是一个 *有* 原型的对象，Javasctipt原始数据或者函数，将会返回一个[Boxed Observable](boxed.md)。MobX不会自动的观察带有原型的对象，因为这是他的构造函数的事情，在构造函数中使用`extendObservable`或者在类定义的时候使用`@observable`替代。

这些规则似乎很复杂，但是在实践中，你会发现使用它们是非常的直观的。

一些注意点：

* 使用`asMap`修饰符创建一个有动态键值的对象！初始化时只有对象中存在的属性才会被观察，虽然可以使用`extendObservable`可以添加新的条目。
* 如果使用`@observable`装饰器，请确保在你的编译器(babel or typescript)中[开启decorators支持](http://mobxjs.github.io/mobx/refguide/observable-decorator.html)。
* 默认情况下，使一个数据结构可观察是很有感染性的，这意味着`observable`可以应用于数据结构中包含的任意值，或者将来会被包含在数据结构中的值。此行为可以通过使用 *修饰符* 更改。

例子:

```javascript
const map = observable(asMap({ key: "value"}));
map.set("key", "new value");

const list = observable([1, 2, 4]);
list[2] = 3;

const person = observable({
    firstName: "Clive Staples",
    lastName: "Lewis"
});
person.firstName = "C.S.";

const temperature = observable(20);
temperature.set(25);
```