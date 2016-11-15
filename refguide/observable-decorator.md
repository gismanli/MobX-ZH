# @observable

可以在ES7 或者 TypeScript中类属性前使用装饰器以使得它们可以被观察。`@observable`可以作用在实例字段和属性`getters`上，这样就提供了对对象的可观察部分进行精细化控制。

```javascript
import {observable} from "mobx";

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

如果你的环境不支持装饰器或者字段初始化，`@observable key = value` 的语法糖变成[`extendObservable(this, { key: value })`](extend-observable.md)

可枚举性：`@observable`装饰的属性是可以枚举的，但是必须是定义在类原型上的而不是在类实例中。

换句话说：

```javascript
const line = new OrderLine();
console.log("price" in line); // true
console.log(line.hasOwnProperty("price")); // false, the price _property_ is defined on the class, although the value will be stored per instance.
```

`@observable`装饰器可以和修饰符结合，比如`asStructure`:

```javascript
@observable position = asStructure({ x: 0, y: 0})
```


### 编译器启用装饰器语法

默认情况下，在使用TypeScript或Babel等待ES标准中的定义时，装饰器不受支持。

* 对于 _typescript_ , 启用`--experimentalDecorators`编译标志或设置编译配置`experimentalDecorators`的值为`true`在`tsconfig.json`(推荐)
* 对于 _babel5_ , 确保把`--stage 0`传递给Babel CLI
* 对于 _babel6_ , 请参照此处建议的实例配置 [issue](https://github.com/mobxjs/mobx/issues/105)