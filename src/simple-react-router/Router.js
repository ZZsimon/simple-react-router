import React from "react";

import HistoryContext from "./context/HistoryContext.js";
import RouterContext from "./context/RouterContext.js";

class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }

  constructor(props) {
    super(props);

    this.state = {
      // history由BrowerRouter传入
      location: props.history.location
    };

    // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.
    this._isMounted = false;
    this._pendingLocation = null;

    // staticContext 是 StaticRouter 传入的，使用 BrowserRouter 时是没有的
    if (!props.staticContext) {

      // 当history对象变化的时候会执行这个函数
      const listenCb=location => {
        console.log('listenCb函数执行啦');
        // 这里做了一层兼容操作，有可能这里执行的时候，
        // 组件还没加载完成，就会把 location 暂存起来，
        // 等组件加载完成后再去更新 location

        // 正常执行回调函数的时候_isMounted已经是true了
        if (this._isMounted) {
          this.setState({ location });
        } else {
          this._pendingLocation = location;
        }
      }
      /**
        *  实际上在history库源码中会监听popstate事件，然后来触发传入的listenCb方法
        *  监听了popstate事件，当事件发生的时候，就会自动通知绑定到这个事件上的回调函数，因此到目前为止是观察者模式
        *  
        *  但是history库对事件监听做了一层上层封装，通过popstate事件注册的回调函数会执行，但是传入的观察者（listenCb）的不一定会执行
        *  history库创建了一个transitionManager对象来管理传入的观察者（listenCb）
        *  因此这个时候就和发布订阅模式一样了：
        *      事件触发的时候，不需要操心通知的事情，只管自己的触发就行了。
        *      至于触发了以后，最后要执行哪些回调函数，transitionManager这个消息中心会来做的 
           那么：
            listenCb就是一个订阅者了，listenCb可以被通知执行
            是因为消息中心通知它应该执行了，而不是popstate事件触发通知它应该执行了，
            popstate事件只会通知transitionManager对象，这个对象经过一系列逻辑来决定是否触发订阅者列表中的回调函数（listenCb）

          总结这行代码做了一件事情：订阅了popstate事件，事件触发的时候可以执行这些订阅者（listenCb）
      */
      this.unlisten = props.history.listen(listenCb);
    }
  }

  componentDidMount() {
    // 将_isMounted设为true
    this._isMounted = true;
    // 第一次进来的时候肯定是true
    // 那么第一次进来后 this.state.location=true
    if (this._pendingLocation) {
      this.setState({ location: this._pendingLocation });
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  }

  render() {
    return (
      /*
       * RouterContext 为子组件提供 history,location,match,staticContext 数据
       * 这里 history 已经包含了 location，为什么这里还要将 location 单独传递呢？
       * 因为 location 通过 state 保存，用于当 url 发生变化时，更新 state 实现同步渲染页面
       */
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      >
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    );
  }
}

export default Router;
