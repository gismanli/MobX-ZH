## Primitive values and references

JavaScript中的所有原始数据都是不可变的，因此根据此定义这些是不可被观察的。通常来说这没问题，因为MobX通常只是把包含值的的_属性_变成可被观察的，详见[observable objects](object.md)。在特殊情况下，它可以方便的使一个不是对象拥有的"元"数据可被观察。对于这些情况，我们可以创建一个可被观察的box去管理，比如观察一个元数据。

所以`observable`也接收标量值，并返回一个含有一个 getter / setter 方法的对象去保存此值。此外，你可以使用`.observe`方法给存储的值注册一个回调去监听其值变化时，但是在多数情况下使用[`mobx.autorun`](autorun.md)替代。

所以`observable(scalar)`返回的对象签名是：
* `.get()` 返回当前值
* `.set(value)` 替换当前存储的值，并通知所有的观察者。
* `intercept(interceptor)` 可以在应用之前拦截更改，参阅[observe & intercept](observe.md)
* `.observe(callback: (newValue, previousValue) => void, fireImmediately = false): disposerFunction` 注册一个存储的值每次替换时都会触发的观察者函数，其返回一个函数以取消该观察。请参阅[observe & intercept](observe.md)

例子:

```javascript
import {observable} from "mobx";

const cityName = observable("Vienna");

console.log(cityName.get());
// prints 'Vienna'

cityName.observe(function(newCity, oldCity) {
	console.log(oldCity, "->", newCity);
});

cityName.set("Amsterdam");
// prints 'Vienna -> Amsterdam'
```

数组 例子:

```javascript
import {observable} from "mobx";

const myArray = ["Vienna"];
const cityName = observable(myArray);

console.log(cityName[0]);
// prints 'Vienna'

cityName.observe(function(observedArray) {
	if (observedArray.type === "update") {
		console.log(observedArray.oldValue + "->" + observedArray.newValue);
	} else if (observedArray.type === "splice") {
		if (observedArray.addedCount > 0) {
			console.log(observedArray.added + " added");
		}
		if (observedArray.removedCount > 0) {
			console.log(observedArray.removed + " removed");
		}
	}
});

cityName[0] = "Amsterdam";
// prints 'Vienna -> Amsterdam'

cityName[1] = "Cleveland";
// prints 'Cleveland added'

cityName.splice(0, 1);
// prints 'Amsterdam removed'
```

和 `observable`，`computed(function)` 创建一个boxed计算值相似，具体请参阅[`computed`](http://gismanli.github.io/MobX-ZH/refguide/computed-decorator.html)
