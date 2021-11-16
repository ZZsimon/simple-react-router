## 为什么需要react-router？

react-router可以方便地添加路由和页面，并用简单的方式保持路由和页面之间的同步。同时，还可以方便的传递和使用数据。

而建立多个路由，本质上是为了方便管理和理解一个网站，甚至可以理解为一种“数据结构”。因此如何方便的创建和管理多个路由就是一个值得研究的问题了，而react-router就是这个问题的一种解决方案。

### react-router的组件

##### \<BrowserRouter>

    使用history库来创建history 对象，将这个history对象传递给Router组件，并返回Router组件
##### \<Router>

    1.内部创建location存放于state中，后续子组件的视图更新依赖于这个值，子组件通过context获取这个值
    2.调用history.listen方法：props.history.listen(listenCb)。
        history库源码中会监听popstate事件，然后来触发传入的listenCb方法
        listenCb方法用来更新state中的location值
    3.history库中对popstate事件进行了上层封装，实现了发布订阅模式。
        - 创建了一个transitionManager对象来管理传入的listenCb
        - popstate事件触发的时候，是否需要通知由transitionManager对象来控制，此时transitionManager对象相当于消息中心的角色
        - listenCb是一个订阅者，listenCb被通知执行，是因为消息中心通知它应该执行了，而不是popstate事件触发通知它应该执行了。
        - popstate事件只会通知transitionManager对象，这个对象经过一系列逻辑来决定是否触发订阅者列表中的回调函数（listenCb）
##### \<Switch>

    1.利用React.Children.forEach来遍历Route组件，当location.pathname和Route的path参数值匹配上时，就返回当前这个Route组件。
    2.没有的话继续遍历，都没有的话返回null
    3.一旦返回了，就不会返回新的Route组件了。
    4.作用：返回匹配到的第一个Route组件
##### \<Route>

    1.当location.pathname和Route的path参数值匹配上时，就返回业务组件。
    2.没有的话返回null
    3.返回真实的业务组件，优先级children > component > render

        <Route path="/about">
            <About />
        </Route>

        <Route component={About} path="/about" />

        <Route render={() =><About />}  path="/about" />

##### \<Link>

    1.支持传入onClick事件，如果传入了就不会执行下面的逻辑了
    2.利用history.push或者history.replace来触发popState事件，从而改变Router组件中的location值，以引起页面重新渲染
    3.默认渲染LinkAnchor组件，它返回一个a标签。也可以传入component参数自定义渲染
    4.通过键盘事件，监听左键单击的时候来使用利用history api，并且会阻止a标签的一些默认浏览器行为
    