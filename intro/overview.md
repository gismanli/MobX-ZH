# MobX 要点

到目前为止这一切听起来很滑稽，但是使用MobX创建一个响应式程序只需要三步：

## 1. 定义你的State，并使它是可观察的

你可以存储的任何数据类型状态，比如对象，数组，类， 即使是循环数据，引用类型也没有问题，只要你确保所有属性是被`mobx`标记可观察的即可。

```javascript
import {observable} from 'mobx';

var appState = observable({
    timer: 0
});
```

## 2. 创建响应状态变化的视图

我们并没有让观测的`appState`去做任何事，你现在就可以创建视图，这些视图当`appState`中的数据变化时自动的更新。MobX会找一种最小变动的方法去更新你的视图。这个简单的效果会帮你节省一大堆没用的样板，并且它还是很[高效的](https://mendix.com/tech-blog/making-react-reactive-pursuit-high-performing-easily-maintainable-react-apps/)

一般来说任何方法都可以成为数据观测是的响应，并且MobX可以在任何的ES5环境下运行，但是这里列举一个试用ES6的语法写一个React组件

```javascript
import {observer} from 'mobx-react';

@observer
class TimerView extends React.Component {
    render() {
        return (<button onClick={this.onReset.bind(this)}>
                Seconds passed: {this.props.appState.timer}
            </button>);
    }

    onReset () {
        this.props.appState.resetTimer();
    }
};

React.render(<TimerView appState={appState} />, document.body);
```

(对于 `resetTimer` 方法的实现会在下面的章节中讲解)

## 3. 修改状态

第三步要做的事就是修改状态，其实也就是你的程序接下来要做什么。MobX不同于其他的框架，它是不会指引你如何去做这些的。经过多次的实践，非常关键的一点就是： **MobX提供一种简单直接的方法去做相应的事情**

下面的代码将会每秒更改你的数据，同时UI依赖这个数据，就会自动更新。
以下是两个改变状态的例子：

```javascript
appState.resetTimer = action(function reset() {
    appState.timer = 0;
});

setInterval(action(function tick() {
    appState.timer += 1;
}), 1000);
```
上面例子中的`action`只在严格模式下使用（默认是无须使用的），但是它会帮助你更好的组织代码结构，并且更直白的标识修改状态的意图。

尝试感受下这个列子[JSFiddle](http://jsfiddle.net/mweststrate/wgbe4guu/) or by cloning the [MobX boilerplate project](https://github.com/mobxjs/mobx-react-boilerplate)