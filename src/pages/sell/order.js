import React from "react";
import { Page, Form, Inputs, Btn, TablePagination } from "../comlibs";
import OrderDetail from "./orderDetail";

export default function (props) {
  let { Parent = {} } = props;
  let [name, Page_detail, tab] = [Parent.data];
  let status = {
    FINISHED: "交易完成",
    NOTPAY: "未支付",
    SUCCESS: "异常",
    CLOSED: "已关闭",
  };

  let columns = [
    {
      title: "序号",
      dataIndex: "_key",
    },
    {
      title: "名称",
      width:400,
      render: (rs) => (
        <span>
          <p
            onClick={() => Page_detail.open("订单详情", rs.uuid)}
            className="link"
          >
            订单编号：{rs.show_id}
          </p>
          <p className="mb_0">{rs.product_name}</p>
        </span>
      ),
    },
    {
      title: "商品价格",
      align:'right',
      dataIndex: "amount",
    },
    {
      title: "订单总价(元)",
      align:'right',
      dataIndex: "specifications[0].original_price",
    },
    {
      title: "实付金额(元)",
      align:'right',
      dataIndex: "payamount",
    },
    {
      title: "学员",
      render(rs) {
        return (
          <span>
            <p className="mb_0"> {rs.receiver.name}</p>
            <p className="mb_0 fs_12 fc_err">
              {rs.receiver.is_oversell === "YES" ? "(超额报名)" : ""}
            </p>
          </span>
        );
      },
    },
    {
      title: "交易状态",
      dataIndex: "status",
      render: (res) => {
        return status[res];
      },
    },
    {
      title: "创建时间",
      dataIndex: "time_create",
    },
    {
      title: "支付时间",
      dataIndex: "time_success",
      render: (res) => {
        return res ? res : "-";
      },
    },
  ];
  return (
    <div className="bg_white ph_16 pv_16 mt_15">
      <Form onSubmit={(values) => tab.search(values)}>
        {({ form }) => (
          <div className="mb_15">
            <Inputs
              width={100}
              className="mr_10"
              name="status"
              placeholder="请选择订单状态"
              form={form}
              select={[
                {
                  value: "",
                  text: "全部状态",
                },
                {
                  value: "FINISHED",
                  text: "交易完成",
                },
                {
                  value: "NOTPAY",
                  text: "未支付",
                },
                {
                  value: "SUCCESS",
                  text: "异常",
                },
                {
                  value: "CLOSED",
                  text: "已关闭",
                },
              ]}
            />
            <Inputs
              form={form}
              name="show_id"
              className="mr_10"
              placeholder="输入订单编号查询"
            />
            <Inputs
              form={form}
              name="product_name"
              className="mr_10"
              value={name}
              placeholder="输入商品名称搜索"
            />
            <Inputs
              form={form}
              name="student_name"
              className="mr_10"
              placeholder="输入学员名字搜索"
            />
            <Btn htmlType="submit" iconfont="sousuo">
              搜索
            </Btn>
          </div>
        )}
      </Form>
      <TablePagination
        api="/order/list"
        params={{
          product_name: name,
          product_type: "courselesson",
          userself: "NO",
        }}
        columns={columns}
        ref={(ref) => (tab = ref)}
      />
      <Page background="#F0F2F5" ref={(rs) => (Page_detail = rs)}>
        <OrderDetail />
      </Page>
    </div>
  );
}
