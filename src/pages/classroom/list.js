import React from "react";
import { Form as Forms, Divider } from "antd";
import {
  Method,
  Page,
  Form,
  Inputs,
  Modals,
  Btn,
  TablePagination
} from "../comlibs";
import Detail from "./detail";

export default function(props) {
  let { tab, create, page_detail } = {};
  const $ = new Method();
  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key"
    },
    {
      title: "教室名称",
      align: "center",
      dataIndex: "name"
    },
    {
      title: "可容纳人数",
      align: "center",
      render: rs => {
        return (
          <span>{rs.limit_member||'-'}</span>
        )
      }
    },
    {
      title: "操作",
      align: "center",
      width:140,
      render: rs => {
        return (
          <div>
            <a onClick={() => create.open("修改教室", rs)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => page_detail.open("教室详情", rs.uuid)}>查看</a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                $.confirm("确定删除该教室吗？", async () => {
                  await $.post("/classroom/remove",{
                    classroom_uuid: rs.uuid
                  });
                  $.msg("删除成功");
                  tab.reload();
                });
              }}
              style={{ color: "#f07070" }}
            >
              删除
            </a>
          </div>
        );
      }
    }
  ];
  return (
    <div className="bs ph_10 mt_15 bg_white">
      <div className="mb_15 pt_15">
        <Btn onClick={() => create.open("创建教室", {})}>创建教室</Btn>
        <a
          className="ml_10"
          target="_blank"
          href="/adminPc/kebiao?curTabKey=class"
          rel="noopener noreferrer"
        >
          <span style={{lineHeight:'30px'}}>查看课表</span>
        </a>
      </div>
      <TablePagination
        api="/classroom/list"
        columns={columns}
        ref={(ref) => (tab = ref)}
      />
      <Modals {...props} ref={(rs) => (create = rs)} style={{ width: 360 }}>
        {({ name, limit_member, uuid }) => (
          <Form
            onSubmit={async (values) => {
              if (isNaN(values.limit_member)) {
                $.warning("可容纳人数请填写数字！");
                return false;
              }
              if (uuid) {
                values.classroom_uuid = uuid;
                await $.post("/classroom/update", values);
                $.msg("修改成功");
              } else {
                await $.post("/classroom/create", values);
                $.msg("创建成功");
              }
              create.close();
              tab.reload();
            }}
          >
            {({ form }) => (
              <div>
                <Forms.Item
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                  label="教室名称"
                  required={true}
                >
                  <Inputs
                    form={form}
                    name="name"
                    value={name}
                    required={true}
                  />
                </Forms.Item>
                <Forms.Item
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                  label="可容纳人数"
                >
                  <Inputs
                    form={form}
                    name="limit_member"
                    value={limit_member}
                    type="number"
                  />
                </Forms.Item>
                <div className="ta_c mt_15">
                  <Btn htmlType="submit" width={100}>
                    确认
                  </Btn>
                </div>
              </div>
            )}
          </Form>
        )}
      </Modals>
      <Page ref={(rs) => (page_detail = rs)}>
        <Detail />
      </Page>
    </div>
  );
}
