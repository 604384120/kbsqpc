import React from "react";
import { Table } from "antd";
import { $, TablePagination, Btn, Page, FixedBox, Modals } from "../comlibs";

export default function (props) {
  let [uuid, tab, page_detail, modal_invoice, orderData = []] = [props.uuid];
  let columns_order = [
    {
      title: "商品名称",
      align: "center",
      dataIndex: "product_name",
    },
    {
      title: "售卖方式",
      render(rs) {
        return (
          <span>
            <span className={rs.unit === "year" ? "" : "hide"}>按年</span>
            <span className={rs.unit === "month" ? "" : "hide"}>按年</span>
            <span className={rs.unit === "day" ? "" : "hide"}>按年</span>
          </span>
        );
      },
    },
    {
      title: "数量",
      align: "center",
      dataIndex: "num",
    },
    {
      title: "校区",
      dataIndex: "receiver.name",
    },
    {
      title: "商品价格(元)",
      align: "right",
      dataIndex: "amount",
    },
    {
      title: "优惠金额(元)",
      align: "right",
      render(rs) {
        return <span>{rs.coupon_fee || 0}</span>;
      },
    },
    {
      title: "订单总价(元)",
      align: "right",
      dataIndex: "payamount",
    },
  ];
  let columns = [
    {
      title: "名称",
      width: 300,
      render(rs) {
        return (
          <span>
            <p
              className="link mb_0"
              onClick={async () => {
                let res = await $.get(`/ins/order/detail`, {
                  order_uuid: rs.uuid,
                  institution_uuid: uuid,
                });
                orderData = [];
                orderData.push(res);
                page_detail.open("订单详情", res);
              }}
            >
              <span>订单编号：</span>
              <span>{rs.show_id}</span>
            </p>
            <p className="mb_0 mt_5">{rs.product_name}</p>
          </span>
        );
      },
    },
    {
      title: "价格",
      dataIndex: "actual_price",
      align: "right",
    },
    {
      title: "订单总价(元)",
      dataIndex: "amount",
      align: "right",
    },
    {
      title: "实付金额(元)",
      dataIndex: "payamount",
      align: "right",
    },
    {
      title: "交易状态",
      render(t) {
        return (
          <span>
            <font className={t.status === "SUCCESS" ? "" : "hide"}>
              <p className="fc_blue mb_0">未分配</p>
              <a
                target="_blank"
                href={`/adminPc/invoiceApply?uuid=${t.uuid}&payamount=${t.payamount}`}
                className={
                  t.invoice_status === "UNAPPLY" || !t.invoice_status
                    ? ""
                    : "hide"
                }
              >
                去开票
              </a>
            </font>
            <font className={t.status === "FINISHED" ? "" : "hide"}>
              <p className="fc_black3 mb_0">交易成功</p>
              <p className="mb_0">
                <a
                  target="_blank"
                  href={t.payamount >= 10 && `/adminPc/invoiceApply?uuid=${t.uuid}&payamount=${t.payamount}`}
                  onClick={() => {
                    if (t.payamount < 10) {
                      $.confirm("交易金额低于10元，开发票请联系客服")
                    }
                  }}
                  className={
                    t.invoice_status === "UNAPPLY" || !t.invoice_status
                      ? ""
                      : "hide"
                  }
                >
                  去开票
                </a>
                <font className={t.invoice_status === "APPLYING" ? "" : "hide"}>
                  开票中
                </font>
                <font className={t.invoice_status === "FINISHED" ? "" : "hide"}>
                  已开票
                </font>
              </p>
            </font>
            <span className={t.status === "NOTPAY" ? "" : "hide"}>
              <p className="fc_black3 mb_0">待支付</p>
              <p className="mb_0">
                <a
                  href={`/order/orderpay.html?ord_id=${t.uuid}&pro_id=${t.product_uuid}`}
                  target="_blank"
                  className="fc_blue"
                >
                  去支付
                </a>
              </p>
            </span>
            <font className={t.status==="PAYERROR" ? "fc_red" : "hide"}>
              支付失败
            </font>
            <font className={t.status==="CLOSED" ? "fc_gray" : "hide"}>
              交易关闭
            </font>
          </span>
        );
      },
    },
    {
      title: "创建时间",
      align: "center",
      render(rs) {
        return (
          <span>
            <p className="mb_0">
              {rs.time_create && rs.time_create.split(" ")[0]}
            </p>
            <p className="mb_0">
              {rs.time_create && rs.time_create.split(" ")[1]}
            </p>
          </span>
        );
      },
    },
    {
      title: "支付时间",
      align: "center",
      render(rs) {
        return (
          <span>
            <p className="mb_0">
              {rs.time_success && rs.time_success.split(" ")[0]}
            </p>
            <p className="mb_0">
              {rs.time_success && rs.time_success.split(" ")[1]}
            </p>
          </span>
        );
      },
    },
  ];
  return (
    <div>
      <a href="/adminPc/invoice">
        <Btn className="mb_16">发票申请记录</Btn>
      </a>
      <TablePagination
        api="/ins/orders"
        columns={columns}
        params={{
          institution_uuid: uuid,
        }}
        className="minH"
        ref={(ref) => (tab = ref)}
      />
      <Page ref={(rs) => (page_detail = rs)}>
        {(d) => {
          return (
            <div>
              <div className="bs mt_15 ph_10 bg_white pt_15 pb_30 box box-ver">
                <div className="fs_16 mv_15 fc_black1 fb">买家信息</div>
                <div className="box">
                  <div className="box box-1">
                    <span className="ta_r" style={{ width: 70 }}>下单人：</span>
                    <span>{d.user.nickname || "-"}</span>
                  </div>
                  <div className="box box-1">
                    <span>联系电话：</span>
                    <span>{d.user.phone || "-"}</span>
                  </div>
                </div>
                <div className="fs_16 mv_15 fc_black1 fb">订单信息</div>
                <div className="box mb_10">
                  <div className="box box-1">
                    <span>订单状态：</span>
                    <span>
                      <font className={d.status==="SUCCESS" ? "" : "hide"}>
                        <span className="fc_blue">未分配</span>
                      </font>
                      <font className={d.status==="FINISHED" ? "" : "hide"}>
                        <span className="fc_black">交易成功</span>
                      </font>
                      <span className={d.status==="NOTPAY" ? "" : "hide"}>
                        <span className="fc_red">待支付</span>
                      </span>
                      <font
                        className={d.status==="PAYERROR" ? "fc_red" : "hide"}
                      >
                        支付失败
                      </font>
                      <font
                        className={d.status==="CLOSED" ? "fc_gray" : "hide"}
                      >
                        交易关闭
                      </font>
                    </span>
                  </div>
                  <div className="box box-1">
                    <span>订单编号：</span>
                    <span>{d.show_id || "-"}</span>
                  </div>
                </div>
                <div className="box mb_10">
                  <div className="box box-1">
                    <span>商户单号：</span>
                    <span>{d.order_id || "-"}</span>
                  </div>
                  <div className="box box-1">
                    <span>交易单号：</span>
                    <span>{d.order_uuid || "-"}</span>
                  </div>
                </div>
                <div className="box mb_10">
                  <div className="box box-1">
                    <span>创建时间：</span>
                    <span>{d.time_create || "-"}</span>
                  </div>
                  <div className="box box-1">
                    <span>支付时间：</span>
                    <span>{d.time_success || "-"}</span>
                  </div>
                </div>
                <div className="box">
                  <div className="box box-1">
                    <span>支付方式：</span>
                    <span>
                      {d.pay_channel ? (
                        <span>
                          {d.pay_channel === "SXZPAY" ? "0元支付" : ""}
                          {d.pay_channel === "WXPAY" ? "微信支付" : ""}
                          {d.pay_channel === "ALIPAY" ? "支付宝支付" : ""}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </span>
                  </div>
                  <div className="box box-1">
                    <span>支付人账号：</span>
                    <span>
                      {d.pay_user && d.pay_user.nickname}
                      {(d.pay_user && d.pay_user.phone) || "-"}
                    </span>
                  </div>
                </div>
                <div className="fs_16 mv_15 fc_black1 fb">订单备注</div>
                <Table
                  rowKey={(rs) => rs.uuid}
                  dataSource={orderData}
                  columns={columns_order}
                  pagination={false}
                />
                <div
                  className={
                    d.status === "FINISHED"? "box box-ac box-pe pv_10 pr_15" : "hide"
                  }
                >
                  <span>实付金额：</span>
                  <span className="fc_err">{d.payamount && d.payamount}</span>
                  <span>元</span>
                </div>
              </div>
              <FixedBox>
                <Btn
                  className="cancelBtn"
                  onClick={() => {
                    page_detail.close();
                  }}
                >
                  关闭
                </Btn>
                {d.status === "NOTPAY" ? (
                  <span>
                    <a
                      target="_blank"
                      className="ml_15"
                      href={`/order/orderpay.html?ord_id=${d.uuid}&pro_id=${d.product_uuid}`}
                    >
                      <Btn>去支付</Btn>
                    </a>
                    <Btn
                      className="ml_15"
                      onClick={() => {
                        $.confirm("确定要取消这个订单吗？", async () => {
                          await $.get(`/order/${d.uuid}/close`);
                          $.msg("取消成功");
                          page_detail.close();
                        });
                      }}
                    >
                      取消订单
                    </Btn>
                  </span>
                ) : (
                  ""
                )}
                {(d.status === "SUCCESS" || d.status==="FINISHED") &&
                (d.invoice_status === "UNAPPLY" || !d.invoice_status) ? (
                  <a
                    target="_blank"
                    className="ml_15"
                    href={`/adminPc/invoiceApply?uuid=${d.uuid}&payamount=${d.payamount}`}
                  >
                    <Btn>去开票</Btn>
                  </a>
                ) : (
                  ""
                )}
                {(d.status==="SUCCESS" || d.status === "FINISHED") &&
                d.invoice_status === "APPLYING" ? (
                  <Btn
                    className="ml_15"
                    onClick={() => {
                      modal_invoice.open("发票申请详情", d.invoice);
                    }}
                  >
                    查看发票
                  </Btn>
                ) : (
                  ""
                )}
                {(d.status === "SUCCESS" || d.status === "FINISHED") &&
                d.invoice_status === "FINISHED" ? (
                  <a
                    className="ml_15"
                    target="_blank"
                    download={d.invoice.title}
                    href={d.invoice.invoice_url}
                  >
                    <Btn>查看发票</Btn>
                  </a>
                ) : (
                  ""
                )}
              </FixedBox>
            </div>
          );
        }}
      </Page>
      <Modals ref={(rs) => (modal_invoice = rs)} style={{ height: 400 }}>
        {(data) => {
          return (
            <div className="box box-ver">
              <div className="box mb_10">
                <div className="box box-1">
                  <span className="fc_black1">发票抬头：</span>
                  <span>{data.title || "-"}</span>
                </div>
                <div className="box box-1">
                  <span className="fc_black1">发票金额：</span>
                  <span>{data.fee || "-"}</span>
                </div>
              </div>
              <div className="box mb_10">
                <div className="box box-1">
                  <span className="fc_black1">发票类型：</span>
                  <span>
                    {data.title_type === "COMPANY"
                      ? "企业单位"
                      : "个人/非企业单位"}
                  </span>
                </div>
                <div className="box box-1">
                  <span className="fc_black1">发票内容：</span>
                  <span>{data.content || "-"}</span>
                </div>
              </div>
              <div className="box mb_10">
                <div className="box box-1">
                  <span className="fc_black1">申请时间：</span>
                  <span>{data.time_create || "-"}</span>
                </div>
                <div className="box box-1">
                  <span className="fc_black1">状态：</span>
                  <span>{data.show_status || "-"}</span>
                </div>
              </div>
            </div>
          );
        }}
      </Modals>
    </div>
  );
}
