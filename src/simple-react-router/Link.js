import React from "react";
import RouterContext from "./context/RouterContext";

import { createLocation } from "history";

// React 15 compat
const forwardRefShim = C => C;
let { forwardRef } = React;
if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const LinkAnchor = forwardRef(
  (
    {
      innerRef, // TODO: deprecate
      navigate,
      onClick,
      ...rest
    },
    forwardedRef
  ) => {
    const { target } = rest;

    let props = {
      ...rest,
      onClick: event => {
        try {
          if (onClick) onClick(event);
        } catch (ex) {
          event.preventDefault();
          throw ex;
        }

        /*
         * event.defaultPrevented 判断 onClick 中是否执行了 event.preventDefault()
         * event.button 判断点击的是否是左键
         * target 判断链接是不是在当前窗口打开
         * isModifiedEvent 判断是否是 组合键 事件（例如：按住alt+左键点击）
         */
        if (
          !event.defaultPrevented && // onClick prevented default
          event.button === 0 && // ignore everything but left clicks
          (!target || target === "_self") && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
          event.preventDefault();
          navigate();
        }
      }
    };

    // React 15 compat
    if (forwardRefShim !== forwardRef) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.ref = innerRef;
    }

    /* eslint-disable-next-line jsx-a11y/anchor-has-content */
    return <a {...props} />;
  }
);

/**
 * The public API for rendering a history-aware <a>.
 */
const Link = forwardRef(
  (
    {
      // 可以传自定义的 component，如果没传 默认使用 LinkAnchor 组件
      component = LinkAnchor,
      // 默认是 false，使用 history.push，如果传 true，会使用 history.replace
      replace,
      // 跳转的目标，可以是 string、Object、Function
      to,
      innerRef, // TODO: deprecate
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <RouterContext.Consumer>
        {context => {
          const { history } = context;

          /**
           * 根据传入  to 参数的不同形式，创建一个 location 对象
           * resolveToLocation： 如果 to 是function 执行 to，
           * 传入 context.location 创建一个新的location，否则返回 to 本身
           * 
           * normalizeToLocation：如果 to 是 string，使用 createLocation 创建一个 location，
           * 否则返回 to 本身
           */
           const location = typeof to === "string" ? createLocation(to, null, null, context.location) : to;

          // 通过 location（{ pathname, search, hash }） 与 basename 组成 href
          // basename 是使用 BrowserRouter 时传入的 props
          const href = location ? history.createHref(location) : "";
          const props = {
            ...rest,
            href,
            navigate() {
              /**
               * navigate 使用 history 进行跳转
               * 
               * replace 是传入的 props 参数，
               * 决定使用 history.replace 还是 history.push 进行跳转
               * 
               * history.replace 会替换当前history 栈中当前指针指向的那条记录 (history length 不变)
               * history.push 会向栈中 push 多一条记录（history length + 1）
               */
              const method = replace ? history.replace : history.push;

              method(location);
            }
          };

          // React 15 compat
          if (forwardRefShim !== forwardRef) {
            props.ref = forwardedRef || innerRef;
          } else {
            props.innerRef = innerRef;
          }

          return React.createElement(component, props);
        }}
      </RouterContext.Consumer>
    );
  }
);

export default Link;
