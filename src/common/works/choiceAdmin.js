import React, { useState } from "react";
import { List, Empty, Tabs, Avatar } from "antd";
import Method from "../method";
import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import { FixedBox } from "../../pages/comlibs";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";

import Campus from "../works/campus";

export default function (props) {
  const { TabPane } = Tabs;
  let { Parent } = props;
  let { value = [], max, onSure, type = "add", institution_uuid } = Parent.data;
  let {
    campus_uuid = localStorage.campus_uuid,
    curTabKey = "admin",
    tabs = {
      admin: {},
    },
    list,
    setList,
  } = {};

  let columns = [
    {
      title: "姓名",
      dataIndex: "user.nickname",
      width: 150,
    },
    {
      title: "角色",
      render(rs) {
        return (
          <span className={rs.user_kind === "ADMIN" ? "fc_gold" : "fc_green"}>
            {rs.user_kind === "ADMIN" ? "总管理员" : "总校长"}
          </span>
        );
      },
    },
    {
      title: "联系方式",
      dataIndex: "user.phone",
    },
  ];
  let columns_teacher = [
    {
      title: "姓名",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "权限",
      render: (rs) => (
        <span>
          <font style={{ color: "#8BD881" }}>
            {rs.user_kind === "owner" ? "校区校长" : ""}
          </font>
          <font style={{ color: "#DDAD58" }}>
            {rs.user_kind === "admin" ? "管理员" : ""}
          </font>
          <font style={{ color: "#646567" }}>
            {rs.user_kind === "teacher" ? "普通老师" : ""}
          </font>
        </span>
      ),
    },
    {
      title: "岗位性质",
      render: (rs) => (
        <span>{rs.fulltime === "fulltime" ? "全职" : "兼职"}</span>
      ),
    },
    {
      title: "联系方式",
      dataIndex: "phone",
    },
  ];

  let sure = (data) => {
    if (type === "add") {
      Parent.close(data);
      onSure && onSure(data);
    } else {
      let $ = new Method(props);
      $.confirm(`修改校区校长，原先的校区校长会转为校区管理员`, async () => {
        Parent.close(data);
        onSure && onSure(data);
      });
    }
  };
  let Sel = () => {
    [list, setList] = useState([]);
    let height = 460;
    let width = 270;
    return (
      <div
        className="box box-ver pt_16"
        style={{ marginTop: 46, borderTop: "1px solid #e8e8e8" }}
      >
        <div style={{ height: 46 }} className="box box-pc box-ver bb_1 bg_gray">
          已选{list.length}名老师
        </div>
        <div style={{ height, width }} className="box box-ver bb_1 bl_1">
          {list.length > 0 ? (
            <List
              style={{ height, width }}
              className="choiceCourseList CUSTOM_scroll oy_a pl_20"
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <span
                      onClick={() => tabs[curTabKey].delSelection(item.uuid)}
                      className="link"
                      key="0"
                    >
                      删除
                    </span>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                      item.name || (item.user && item.user.nickname) || "无名"
                    }
                    description={
                      item.phone ||
                      (item.user && item.user.phone) ||
                      "暂无联系方式"
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty className="mt_30" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="box mt_15 ph_15 bg_white">
      <div className="box-1">
        <Tabs
          animated={false}
          defaultActiveKey={curTabKey}
          onChange={(key) => {
            if(list.length){
              tabs[curTabKey].delSelection(list[0].uuid);
              setList && setList([]);
            }
            curTabKey = key;
          }}
        >
          <TabPane tab="学校负责人" key="admin">
            <Form
              onSubmit={(values) => {
                tabs.admin.search(values);
              }}
            >
              {({ form }) => (
                <div className="bg_white pb_15">
                  <TablePagination
                    className="CUSTOM_choiceScroll nPointer"
                    api="/ins/admin/page"
                    params={{ institution_uuid: institution_uuid }}
                    columns={columns}
                    keyName="user_uuid"
                    rowSelection={true}
                    setSelection={value}
                    onRow={true}
                    rowType={max === 1 ? "radio" : "checkbox"}
                    onSelection={(keys) => {
                      if (max === 1 && Object.values(keys).length > 1) {
                        tabs.admin.delSelection(
                          Object.values(keys)[0].user_uuid
                        );
                        setList &&
                          setList([
                            Object.values(keys)[Object.values(keys).length - 1],
                          ]);
                      } else {
                        setList && setList(Object.values(keys));
                      }
                    }}
                    scroll={{ y: 460 }}
                    ref={(ref) => (tabs.admin = ref)}
                  />
                </div>
              )}
            </Form>
          </TabPane>
          <TabPane tab="校区老师" key="teacher">
            <Form
              onSubmit={(values) => {
                tabs.teacher.search(values);
              }}
            >
              {({ form }) => (
                <div className="bg_white pb_15">
                  <div className="mb_10">
                    <Campus
                      style={{ width: 130 }}
                      value={campus_uuid}
                      form={form}
                      name="campus_uuid"
                      autoSubmit={true}
                      required
                    />
                    <div className="dis_ib ml_10 mr_10">
                      <Inputs
                        name="name"
                        placeholder="请输入名称或联系方式"
                        style={{ width: 150 }}
                        form={form}
                      />
                    </div>
                    <Btn htmlType="submit" iconfont="sousuo">
                      搜索
                    </Btn>
                  </div>
                  <TablePagination
                    className="CUSTOM_choiceScroll nPointer"
                    api="/teacher/list"
                    params={{
                      campus_uuid: campus_uuid,
                      status: "INSERVICE",
                      limit: 1000,
                      totalnum: "NO",
                    }}
                    columns={columns_teacher}
                    keyName="uuid"
                    rowSelection={true}
                    setSelection={value}
                    onRow={true}
                    rowType={max === 1 ? "radio" : "checkbox"}
                    scroll={{ y: 460, x: "max-content" }}
                    onSelection={(keys) => {
                      if (max === 1 && Object.values(keys).length > 1) {
                        tabs.teacher.delSelection(Object.values(keys)[0].uuid);
                        setList &&
                          setList([
                            Object.values(keys)[Object.values(keys).length - 1],
                          ]);
                      } else {
                        setList && setList(Object.values(keys));
                      }
                    }}
                    scroll={{ y: 460 }}
                    ref={(ref) => (tabs.teacher = ref)}
                  />
                </div>
              )}
            </Form>
          </TabPane>
        </Tabs>
      </div>
      <Sel />
      <FixedBox>
        <Btn type="default" onClick={() => Parent.close()}>
          取消
        </Btn>
        <Btn
          className="ml_20"
          onClick={() => {
            sure(list);
          }}
        />
      </FixedBox>
    </div>
  );
}
