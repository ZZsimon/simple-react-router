import React from "react";

import RouterContext from "./context/RouterContext.js";
import { matchPath } from "react-router-dom";

function isEmptyChildren(children) {
  return React.Children.count(children) === 0;
}

class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const location = this.props.location || context.location;

          // 这里判断是否匹配当前 url，
          // computedMatch 是使用 Switch 时，Switch 提前计算好是否匹配
          // context.math 是 Router 传下来的
          // 如果有用 Switch 则优先使用Switch 传递的 computedMatch 判断匹配
          // 否则判断是否有 path，有 path 就计算是否匹配当前 url，
          // 如果没有 path，则使用 Router 传递的 context.match
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
              ? matchPath(location.pathname, this.props)
              : context.match;

          const props = { ...context, location, match };

          let { children, component, render } = this.props;

          // Preact uses an empty array as children by
          // default, so use null if that's the case.
          if (Array.isArray(children) && isEmptyChildren(children)) {
            children = null;
          }
          return (
            <RouterContext.Provider value={props}>
              {/* 渲染的优先级 children > component > render */}
              {props.match
                ? children
                  ? typeof children === "function"
                    ? children(props)
                    : children
                  : component
                    ? React.createElement(component, props)
                    : render
                      ? render(props)
                      : null
                : typeof children === "function"
                  ? children(props)
                  : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;
