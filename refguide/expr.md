# Expr

`expr` 可以用来在计算值计算中创建临时性的计算值。
嵌套计算值对于创建低廉的计算以避免防止运行昂贵的计算是非常有用的。

在下面列子中，如果 selection 在其它地方改变，表达式会阻止 TodoView 组件重新渲染。
取而代之的是只有当相关 todo 被(取消)选择时，组件才会重新渲染。

```javascript
const TodoView = observer(({todo, editorState}) => {
    const isSelected = mobx.expr(() => editorState.selection === todo);
    return <div className={isSelected ? "todo todo-selected" : "todo"}>{todo.title}</div>;
});
```

`expr(func)` 是 `computed(func).get()` 的别名。