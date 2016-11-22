# autorunAsync

`autorunAsync(action: () => void, minimumDelay?: number, scope?)`

就像`autorun`一样，除了action不会被同步调用，但是异步方法也是在很小的毫秒后调用的，`action`将会被运行并且观察它。但是，当观察的值改变时并不会立即执行action，而在之前会等待最小的延迟后，在重新执行action。

如果观察的值在等待期间更改多次改变，action也只会触发一次，因此它实现了和transaction一样的效果。这可能对高昂且不需要同步执行的东西是非常有用的，比如服务器通信时的去抖操作。

如果给定了作用域，action将会绑定到此作用域对象上。

`autorunAsync(debugName: string, action: () => void, minimumDelay?: number, scope?)`

如果传递给`autorunAsync`的第一个参数是字符串，则会被用作调试名。

`autorunAsync` 返回一个用于取消autorun的处理器。

```javascript
autorunAsync(() => {
	// Assuming that profile.asJson returns an observable Json representation of profile,
	// send it to the server each time it is changed, but await at least 300 milliseconds before sending it.
	// When sent, the latest value of profile.asJson will be used.
	sendProfileToServer(profile.asJson);
}, 300);
```