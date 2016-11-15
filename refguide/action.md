# action

用法:

* `action(fn)`
* `action(name, fn)`
* `@action classMethod`
* `@action(name) classMethod`
* `@action boundClassMethod = (args) => { body }`
* `@action(name) boundClassMethod = (args) => { body }`

任何应用都有操作，Actions 可以是修改状态的任何东西。使用 MobX，你可以通过在你的代码中显式的标记它们显示你的操作，Actions 帮助你更好的组织你的代码结构。它需要一个函数，并之后返回一个其使用`untracked`，`transaction`和`allowStateChanges`包装的函数，建议将它们用于修改可观察的变量或具有任何副作用的任何函数。`action`还提供了和开发工具组合使用时的调试信息。

注：如果启用 _严格模式_，则必须使用`action`去操作 state，详见`useStrict`。不支持使用`@action`装饰器在 [ES 5.1 setters](http://www.ecma-international.org/ecma-262/5.1/#sec-11.1.5) \(i.e. `@action set propertyName`\)

有关操作的详细介绍，请参阅 [MobX 2.2 发行版说明](https://medium.com/p/45cdc73c7c8d/)。

`contace-list`项目中的两个示例：

```javascript
    @action    createRandomContact() {
        this.pendingRequestCount++;
        superagent
            .get('https://randomuser.me/api/')
            .set('Accept', 'application/json')
            .end(action("createRandomContact-callback", (error, results) => {
                if (error)
                    console.error(error);
                else {
                    const data = JSON.parse(results.text).results[0];
                    const contact = new Contact(this, data.dob, data.name, data.login.username, data.picture)
                    contact.addTag('random-user');
                    this.contacts.push(contact);
                    this.pendingRequestCount--;
                }
            }));
    }
```

## `async`actions 和`runInAction`

`action`只影响当前运行的函数，不是由当前调度（不是调用）的函数。也就是说，如果你有一个`setTimeOut`，promise`.then`或`async`构造，在回调中有更多的状态被该改变，这些回调也应该被包含在`action`中。这可以在上面的`"createRandomContact-callback"`操作来演示。

如果你使用`async/await`，这就非常棘手了，因为你不能只是在`action`中单纯的包装异步函数体了。在这种情况下，`runInAction`就可以派上用场了，在你打算更新状态的地方使用它就可以了。(但是不要在`await`中调用这些区块)

举例:

```javascript
@action /*optional*/ updateDocument = async () => {
    const data = await fetchDataFromUrl();
    /* required in strict mode to be allowed to update state: */
    runInAction("update state after fetching data", () => {
        this.data.replace(data);
        this.isSaving = true;
    })
}
```

`runInAction`的另外一种用法是： `runInAction(name?, fn, scope?)`

