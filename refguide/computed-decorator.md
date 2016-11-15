# @computed

可以在ES6或TypeScript派生类的属性上使用装饰器，以使它们可观察。`@computed`只能用于实例属性的get函数上。

如果你有一个值是根据另外一个可观察的值生成导出的，则使用`@computed`。

不要对`@computed`和`autorun`疑惑，它们都是反应性的调用其表达式，只是如果你想这个反应通过使用其他的可观察值生产除一个新的值使用`@computed`，`autorun`是你不想要生成一个新值而只是单纯的想调用一些命令式的代码，比如日志，网络请求等等。

MobX会在许多情况下优化计算属性，因为它们被假定为纯净的。所以，当它们输入的参数没有修改时，或者它们没有被一些计算值或者autorun观察时，它们是不会被调用的。

```javascript
import {observable, computed} from "mobx";

class OrderLine {
    @observable price:number = 0;
    @observable amount:number = 1;

    constructor(price) {
        this.price = price;
    }

    @computed get total() {
        return this.price * this.amount;
    }
}
```

如果你的环境不支持装饰器或者字段初始化，`@computed get funcName() { }` 的语法糖应该为`extendObservable(this, { funcName: func })`

`@computed`是可以参数化的。`@computed({asStructure: true})`确保派生的结果在结构上比较，而不是和其预览值比较。这样就确保如果返回的新的结构和原始结构相同时，就不会重新引起计算值的观察值重新计算。当使用点，矢量或者颜色结构时其是非常有用的。它的行为和`asStructure`修饰的可观察值是一样的。

`@computed`属性是不可以被枚举的，它们也不能在继承链中被重写。

# 通过`observable`或`extendObservable`创建计算值.

`observable(object)`或`extendObservable(target, properties)`函数也可以用来添加计算属性，以替代使用装饰器的方法。可以使用ES5的getters，所以上面的例子可以改写为：

```javascript
var orderLine = observable({
    price: 0,
    amount: 1,
    get total() {
        return this.price * this.amount
    }
});
```

_注意：getters在 MobX 2.5.1 时被引入，MobX会自动的将作为 _`observable`_ \/ _`extendObservable`_属性值传递的无参函数转换为计算属性，但是这将会在下一个主要版本中移除。_

# 计算属性的Setters

我们也可以为计算属性定义setters方法，注意这些setters不能用于直接更改计算属性的值，但是它们可以用作派生的逆向。举个列子：

```javascript
const box = observable({
    length: 2,
    get squared() {
        return this.length * this.length;
    },
    set squared(value) {
        this.length = Math.sqrt(value);
    }
});
```

_注意：setters需要 MobX 2.5.1 或更高版本_

# `computed(expression)`

`computed`也可以直接作为函数调用，就像`observable(primitive value)`会创建一个独立的可观察变量一样。对返回的对象使用`.get()`方法获取当前计算的值，或使用`.observe(callback)`去监听它的变化。这种形式的`computed`不是经常使用，但是在某些情况下，你需要传递一个`boxed`的计算值，它是非常有用的。

举例:

```javascript
import {observable, computed} from "mobx";
var name = observable("John");

var upperCaseName = computed(() =>
    name.get().toUpperCase()
);

var disposer = upperCaseName.observe(name => console.log(name));

name.set("Dave");
// prints: 'DAVE'
```

