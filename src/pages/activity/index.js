import React from "react";
import { Tabs, Alert, Tag } from "antd";
import "./index.css";
import Create from "./create.js";
import Mange from "./manage";
const { TabPane } = Tabs;
export default class actitviy extends React.Component {
  callback(key) {
    // console.log(key);
  }
  render() {
    return (
      <div className="body">
        <div className="tip">
          <Alert
            message="开班神器为培训机构丰富的活动模版，您也可以联系客服提供需求给我们。"
            type="warning"
          />
        </div>
        <div className="count">
          <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
            <TabPane tab="创建活动" key="1">
              <Create />
            </TabPane>
            <TabPane tab="活动管理" key="2">
              <Mange />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
