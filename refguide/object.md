## Observable Objects

如果一个纯 JavaScript 对象传递给`observable`，其包含的所有的属性都将被观察（纯对象就是不通过构造函数创造的对象）。默认情况下，`observable`是递归调用的，所以如果遇到一个值是对象或数组的情况，它的值也会将通过`observable`传递。

```javascript
import {observable, autorun, action} from "mobx";

var person = observable({
    // observable properties:
	name: "John",
	age: 42,
	showAge: false,
    // computed property:
	get labelText() {
		return this.showAge ? `${this.name} (age: ${this.age})` : this.name;
	},
    // action:
    setAge: action(function() {
        this.age = 21;
    })
});

// object properties don't expose an 'observe' method,
// but don't worry, 'mobx.autorun' is even more powerful
autorun(() => console.log(person.labelText));

person.name = "Dave";
// prints: 'Dave'

person.setAge(21);
// etc
```

在使一个对象可观察时需要注意一些事情：

* 当通过使用`observabel`传递对象时，在使对象变得可观察时，只有当时存在的属性才会被观察。后续在添加到对象中的属性是不会被观察的，除非使用
[`extendObservable`](extend-observable.md)
* 只有纯对象才能被观察。对于非纯对象，其构造函数负责初始化其可被观察的属性。使用[`@observable`](observable.md)注释或 [`extendObservable`](extend-observable.md)函数。
* getters 属性将会自动转换为派生属性，就像[`@computed`](computed-decorator)做的事是一样的。
* _已废弃_ 无参函数也将会自动转换为派生属性，就像[`@computed`](computed-decorator)做的事是一样的。
* `observable`自动的被递归应用于整个对象结构，在实例化和任何将来会被分配给可观察属性的新值。Observable 不会递归到非纯对象里。
* 默认情况下，95%的情况都可以运行良好，但是对于哪些属性应该精细化的可观察，请参阅 [modifiers](modifiers.md) 章节。
