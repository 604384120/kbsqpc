import React from "react";
import { Tabs } from "antd";
import Releaserecord from "./releaserecord";
import Info from "./info";

export default function(props) {
  const { TabPane } = Tabs;
  let Parent = props.Parent
  let uuid = props.Parent.data;
  let { curTabKey = "carddetail" } = {};
  
  return (
    <div className="bs ph_10 mt_15 bg_white">
      <Tabs defaultActiveKey={curTabKey} onChange={key => curTabKey === key}>
        <TabPane tab="课卡信息" key="carddetail">
          <Info uuid={uuid} Parent={Parent}/>
        </TabPane>
        <TabPane tab="发放记录" key="releaserecord">
          <Releaserecord uuid={uuid} />
        </TabPane>
      </Tabs>
    </div>
  );
}
