# 创建一个可被观察的数据结构和响应

## Atoms

在某些时候，你可能想要更多的数据结构或者其它可以在 reactive 计算时使用的东西(例如流)。
使用类 `Atom` 实现这些是非常简单的，Atoms可用于通知 MobX 当某些被观察的数据结构发生变化。
当数据源被使用或不再使用时，MobX 会通知 atom 。

下面的例子演示了如何创建一个可观察的 `Clock`，它可以用在响应式函数中，并且返回当前时间。
这个 clock 只有当它被观察了才会运行。

此示例演示了 `Atom` 类的完整API。

```javascript
import {Atom, autorun} from "mobx";

class Clock {
	atom;
	intervalHandler = null;
	currentDateTime;

	constructor() {
		// creates an atom to interact with the MobX core algorithm
		this.atom =	new Atom(
			// first param: a name for this atom, for debugging purposes
			"Clock",
			// second (optional) parameter: callback for when this atom transitions from unobserved to observed.
			() => this.startTicking(),
			// third (optional) parameter: callback for when this atom transitions from observed to unobserved
			// note that the same atom transitions multiple times between these two states
			() => this.stopTicking()
		);
	}

	getTime() {
		// let MobX know this observable data source has been used
        // reportObserved will return true if the atom is currenlty being observed
        // by some reaction.
        // reportObserved will alos trigger the onBecomeObserved event handler (startTicking) if needed
		if (this.atom.reportObserved()) {
            return this.currentDateTime;
        } else {
            // apparantly getTime was called but not while a reaction is running.
            // So, nobody depends on this value, hence the onBecomeObserved handler (startTicking) won't be fired
            // Depending on the nature
            // of your atom it might behave differently in such circumstances
            // (like throwing an error, returning a default value etc)
		    return new Date();
        }
	}

	tick() {
		this.currentDateTime = new Date();
		// let MobX know that this data source has changed
		this.atom.reportChanged();
	}

	startTicking() {
		this.tick(); // initial tick
        this.intervalHandler = setInterval(
			() => this.tick(),
			1000
		);
	}

	stopTicking() {
		clearInterval(this.intervalHandler);
		this.intervalHandler = null;
	}
}

const clock = new Clock();

const disposer = autorun(() => console.log(clock.getTime()));

// ... prints the time each second

disposer();

// printing stops. If nobody else uses the same `clock` the clock will stop ticking as well.
```

## Reactions

`Reaction` 允许你创建你自己的 'auto runner'。
当函数应该再次运行时，`Reaction` 会追踪函数和信号，因为一个或多个依赖关系已更改。

这是 `autorun` 如何使用 `Reaction` 来定义的代码:

```typescript
export function autorun(view: Lambda, scope?: any) {
	if (scope)
		view = view.bind(scope);

	const reaction = new Reaction(view.name || "Autorun", function () {
		this.track(view);
	});

	// Start or schedule the just created reaction
	if (isComputingDerivation() || globalState.inTransaction > 0)
		globalState.pendingReactions.push(reaction);
	else
		reaction.runReaction();

	return reaction.getDisposer();
}
```