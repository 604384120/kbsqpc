import React, { useState, useEffect } from "react";
import { Divider, Skeleton, Row, Col, Table } from "antd";
import { $ } from "../comlibs";

export default function (props) {
  let { Parent } = props;
  let order_uuid = Parent.data;
  let status = {
    FINISHED: "交易完成",
    NOTPAY: "未支付",
    SUCCESS: "异常",
    CLOSED: "已关闭",
  };
  let specification_type = { LESSONTIMES: "按课时" };
  let [loading, setLoading] = useState(true);
  let [order, setOrder] = useState(null);
  let [shops, setShop] = useState([]);

  useEffect(() => {
    (async () => {
      if (order_uuid) {
        var res = await $.get(`/order/${order_uuid}/detail`);
        setOrder(res);
        setShop([
          {
            key: 0,
            index: 1,
            product_name: res.product_name,
            specification_type:
              specification_type[res.product_ext.specification_type],
            cnt_courselessons: res.specifications[0].cnt_courselessons,
            gift_courselessons: res.specifications[0].gift_courselessons,
            banji_name: res.receiver.banji_name,
            product_price: res.specifications[0].actual_price,
            amount: res.specifications[0].original_price,
          },
        ]);
      }
      setLoading(false);
    })();
  }, [order_uuid]);

  let columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "商品名称",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "售卖方式",
      dataIndex: "specification_type",
      key: "specification_type",
    },
    {
      title: "规格",
      render: (rs) => (
        <span>
          {rs.cnt_courselessons || 0}课时 + 赠送{rs.gift_courselessons || 0}课时
        </span>
      ),
    },
    {
      title: "班级",
      key: "banji_name",
      render: (rs) => (
        <span>
          {rs.banji_name || '-'}
        </span>
      ),
    },
    {
      title: "商品价格(元)",
      dataIndex: "product_price",
      key: "product_price",
    },
    {
      title: "订单总价(元)",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  return (
    <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
      <div className="bg_white pv_10 mt_15 br_3">
        <Row className="ml_15">
          <div className="fb fs_20">
            买家信息
            {order ? (
              order.receiver.is_oversell === "YES" ? (
                <span className="fc_err fs_14">
                  该学员超额报名，请联系学员进行处理，以免影响正常开班
                </span>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
        </Row>
        <Divider className="mv_10" />
        <Row className="ml_15">
          <Col span={6}>
            <span className="fc_black">学员：</span>
            {order ? order.receiver.student_name : "-"}
          </Col>
          <Col span={6}>
            <span className="fc_black">默认联系电话：</span>
            {order ? order.receiver.phone : "-"}
          </Col>
        </Row>
      </div>
      <div className="bg_white br_3 mt_20">
        <Row className="ml_15">
          <div className="fb fs_20 mt_15">订单信息</div>
        </Row>
        <Divider className="mv_10" />
        <Row className="box ml_15 mb_15">
          <div className="box w_400">
            <span className="fc_black">订单状态：</span>
            {order ? status[order.status] : "-"}
          </div>
          <div className="box box-1">
            <span className="fc_black">订单编号：</span>
            {order ? order.show_id : "-"}
          </div>
        </Row>
        <Row className="box ml_15 mb_15">
          <div className="box w_400">
            <span className="fc_black">商户单号：</span>
            {order ? order.order_id : "-"}
          </div>
          <div className="box box-1">
            <span className="fc_black">微信交易单号：</span>
            {order && order.original
              ? order.original.original.transaction_id || "-"
              : "-"}
          </div>
        </Row>
        <Row className="box ml_15 mb_15">
          <div className="box w_400">
            <span className="fc_black">创建时间：</span>
            {order ? order.time_create : "-"}
          </div>
          <div className="box box-1">
            <span className="fc_black">支付时间：</span>
            {order ? order.time_success || "-" : "-"}
          </div>
        </Row>
        <Row className="shop-List mt_15 mh_15">
          <Table
            loading={loading}
            dataSource={shops}
            columns={columns}
            pagination={false}
          ></Table>
        </Row>
        <Row className="ta_r mt_15 mr_15">
          {order ? (
            order.actual_price ? (
              <h3 className="mb_15">
                <span className="fc_black">实付金额:</span>
                <span className="fc_red">{order.actual_price}</span>
                <span>元</span>
              </h3>
            ) : (
              <h3 className="fc_err">未付款</h3>
            )
          ) : (
            "-"
          )}
        </Row>
      </div>
    </Skeleton>
  );
}
