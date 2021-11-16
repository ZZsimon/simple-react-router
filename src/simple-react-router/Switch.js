import React from 'react';

import RouterContext from './context/RouterContext.js';
import { matchPath} from "react-router-dom";

class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const location = this.props.location || context.location;

          let element, match;

          // We use React.Children.forEach instead of React.Children.toArray().find()
          // here because toArray adds keys to all child elements and we do not want
          // to trigger an unmount/remount for two <Route>s that render the same
          // component at different URLs.
          React.Children.forEach(this.props.children, (child) => {
            if (match == null && React.isValidElement(child)) {
              element = child;
							
              // from 是来自 <Redirect />
              const path = child.props.path || child.props.from;

              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          });
          // 循环完毕后 只要进入if分支，就只会执行一次

          // 那么，match的值就是matchPath()执行后的结果，因为path肯定有有值的
          // 而matchPath()执行后的结果如果是null的话，match还是为null，因为context.match的值没有主动设置
          // 因此直到matchPath()执行后的结果有值，match的值才会确定下来，
          // 一旦match的值确定下来，不是null的时候，element也确定下来了
          // 于是，就开始渲染当前这个element了，也就是Route这个组件

          // Route组件如果拿到了match，那么直接就会渲染自身的子组件
          // 因此match是否有值决定了是否能渲染
          // 而match值的结果就是：url和Route组件传入的path参数匹配后的结果
                                  // 1.不匹配就是null，那么这个Route的子组件就不会渲染
                                  // 2.匹配上了，那么就会渲染这个Route的子组件

          // 而页面会变化是因为监听了popState事件，引起了location的值变化
          // location的值放在Router组件的state中，因此它的变化会影响Router子组件（即Switch/Route）的渲染
          

          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;
