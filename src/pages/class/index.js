import React from "react";
import { Form as Forms, Icon, Divider, Tabs } from "antd";
import { $, Form, Inputs, Btn,TablePagination } from "../comlibs";

export default function () {
  const { TabPane } = Tabs;
  let { tab = { normal: {}, end: {} }, curTabKey = "normal",Page_add,exports } = {};
  return (
    <div className="bs ph_10 mt_15 bg_white">
      <Tabs defaultActiveKey={curTabKey} onChange={(key) => curTabKey === key}>
        <TabPane tab="普通班" key="normal">
          <Form onSubmit={(values) => tab.normal.search(values)}>
            {({ form }) => (
              <div className="mb_15">
                <Inputs
                  form={form}
                  name="name"
                  className="mr_10"
                  placeholder="请输入班级名称"
                />
                <Btn htmlType="submit" icon="search">
                  搜索
                </Btn>
                <div className="fl_r">
                  <Btn
                    className="mr_10"
                    onClick={(rs) => Page_add.open("添加老师")}
                  >
                    建班排课
                  </Btn>
                  <Btn onClick={() => exports.open("导出老师", {})}>
                    导入/导出
                  </Btn>
                </div>
              </div>
            )}
          </Form>
          {/* <TablePagination
            api="/teacher/list"
            columns={columns_ins}
            params={{
              status: "INSERVICE",
              limit: 1000,
              totalnum: "NO",
            }}
            ref={(ref) => (tab.inservice = ref)}
          /> */}
        </TabPane>
        <TabPane tab="已完结" key="end">
          <Form onSubmit={(values) => tab.end.search(values)}>
            {({ form }) => (
              <div className="mb_15">
                <Inputs
                  form={form}
                  name="name"
                  className="mr_10"
                  placeholder="请输入老师名称"
                />
                <Btn htmlType="submit" icon="search">
                  搜索
                </Btn>
              </div>
            )}
          </Form>
          {/* <TablePagination
            api="/teacher/list"
            columns={columns_sub}
            params={{
              status: "SUSPENDED",
              limit: 1000,
              totalnum: "NO",
            }}
            ref={(ref) => (tab.end = ref)}
          /> */}
        </TabPane>
      </Tabs>
    </div>
  );
}
