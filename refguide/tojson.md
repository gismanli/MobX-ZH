# toJS

`toJS(value, supportCycles = true)`

递归的将一个（可观察的）对象变成javascript_结构_。支持可观察的数组，对象，maps和原始类型。计算值和其它不可枚举的属性将不会出现在转换结果中。默认情况下，其可以检测到循环并正确支持，但是也可以禁用此选项以提高性能。

For more complex (de)serialization scenario's, one can use [serializr](https://github.com/mobxjs/serializr)

```javascript
var obj = mobx.observable({
    x: 1
});

var clone = mobx.toJS(obj);

console.log(mobx.isObservableObject(obj)); // true
console.log(mobx.isObservableObject(clone)); // false
```

注意: 在 MobX2.2 之前这个方法叫做`toJSON`