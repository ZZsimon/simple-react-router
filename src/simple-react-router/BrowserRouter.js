import React from "react";
import { createBrowserHistory as createHistory } from "history";

import Router from "./Router";

class BrowserRouter extends React.Component {
  // createHistory 返回一个基于 html5 history api 的自定义 history 对象
  history = createHistory(this.props);

  render() {
    // 将 history 提供给 Router
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default BrowserRouter;
