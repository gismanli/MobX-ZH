# extendObservable

和`Object.assign`xiang'非常相似，`extendObservable`需要两个或更多参数，其中包含一个`target`对象和至少一个`properties`maps。它将属性中的所有键值对作为可观察的属性添加到`target`。

如果传入的属性值是一个无参函数，`extendObservable`会把其变成一个`computed`(./computed-decorator.md)属性以取代一个可被观察的属性。

```javascript
var Person = function(firstName, lastName) {
	// initialize observable properties on a new instance
	extendObservable(this, {
		firstName: firstName,
		lastName: lastName
	});
}

var matthew = new Person("Matthew", "Henry");

// add a observable property to an already observable object
extendObservable(matthew, {
	age: 353
});
```

(N.b:  `observable(object)` is actually an alias for `extendObservable(object, object)`)