import React from "react";
import { Divider } from "antd";
import { Page, TablePagination } from "../comlibs";
import CardBtn from "../card/cardBtn";
import Stucarddetail from "../card/detailstu";
import Cardrecord from "../card/record";

export default function(props) {
  let [uuid, tab, Page_stucarddetail, Page_cardrecord] = [props.uuid];

  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key"
    },
    {
      title: "学员姓名",
      align: "center",
      dataIndex: "student_name"
    },
    {
      title: "价格",
      align: "center",
      render: rs => <span>￥{rs.price}</span>
    },
    {
      title: "状态",
      align: "center",
      render: rs => <span>{rs.status === "recover" ? "已收回" : "可用"}</span>
    },
    {
      title: "操作",
      align: "center",
      render: rs => {
        return (
          <div>
            <span
              className="fc_blue pointer hover"
              onClick={r => Page_cardrecord.open("课卡使用记录", rs.uuid)}
            >
              使用记录
            </span>
            <Divider type="vertical" />
            {rs.status === "recover" ? (
              <span>
                <a disabled={true} >编辑</a>
                <Divider type="vertical" />
                <CardBtn
                  type="restore"
                  studentcard_uuid={rs.uuid}
                  success={() => tab.reload()}
                />
              </span>
            ) : (
              <span>
                <span
                  className="fc_blue pointer hover"
                  onClick={r => Page_stucarddetail.open("编辑学员下课卡", rs.uuid)}
                >
                  编辑
                </span>
                <Divider type="vertical" />
                <CardBtn
                  type="recover"
                  student_name={rs.student_name}
                  studentcard_uuid={rs.uuid}
                  success={() => tab.reload()}
                />
              </span>
            )}
            <Divider type="vertical" />
            <CardBtn
              type="del"
              student_name={rs.student_name}
              studentcard_uuid={rs.uuid}
              success={() => tab.reload()}
            />
          </div>
        );
      }
    }
  ];
  return (
    <div>
      <TablePagination
        api="/studentcard/list"
        columns={columns}
        params={{
          card_uuid: uuid
        }}
        ref={ref => (tab = ref)}
      />
      <Page background="#F1F1F1" ref={rs => (Page_stucarddetail = rs)}>
        <Stucarddetail />
      </Page>
      <Page background="#F1F1F1" ref={rs => (Page_cardrecord = rs)}>
        <Cardrecord />
      </Page>
    </div>
  );
}
