import React, { useState } from "react";
import { Tabs } from "antd";
import Alltable from "./alltable";
import Weektable from "./weektable";
import Teatable from "./teatable";
import Classtable from "./classtable";
import { $ } from "../comlibs";
export default function () {
  const { TabPane } = Tabs;
  let [curTabKey, setKey] = useState($.getQueryString("curTabKey") || "all");

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="bg_white br_2 ph_10 pb_10 mt_20"
        style={{ minWidth: 1230 }}
      >
        <Tabs
          animated={false}
          renderTabBar={(props, DefaultTabBar) => (
            <DefaultTabBar {...props} style={{ fontSize: "16 !important" }} />
          )}
          defaultActiveKey={curTabKey}
          onChange={(key) => setKey(key)}
        >
          <TabPane tab="总课表" key="all" className="ph_15">
           {curTabKey==='all'&&<Alltable />}
          </TabPane>
          <TabPane tab="周课表" key="week" className="ph_15">
           {curTabKey==='week'&&<Weektable />}
          </TabPane>
          <TabPane tab="教师课表" key="teacher" className="ph_15">
           {curTabKey==='teacher'&&<Teatable />}
          </TabPane>
          <TabPane tab="教室课表" key="class" className="ph_15">
           {curTabKey==='class'&&<Classtable />}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
