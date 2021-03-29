import React, { useState, useEffect } from "react";
import { Skeleton, Tabs, Table } from "antd";
import { Method } from "../comlibs";

export default function(props) {
  const $ = new Method();
  const { TabPane } = Tabs;
  let [data, setData] = useState({});
  let [uuid, curTabKey = "carddetail"] = [props.Parent.data];
  let [loading, setLoading] = useState(true);
  let [dataUnfinished, setUnfinished] = useState([]);
  let [dataFinished, setFinished] = useState([]);
  function init() {
    (async () => {
      let res = await $.get(`/studentcard/${uuid}/detail`);
      setData(res);
      setUnfinished((res.unfinished && res.unfinished) || []);
      setFinished((res.finished && res.finished) || []);
      setLoading(false);
    })();
  }
  useEffect(() => {
    init();
  }, [uuid]);

  let columns = [
    {
      title: "班级名称",
      align: "center",
      dataIndex: "name"
    },
    {
      title: "上课时间",
      align: "center",
      dataIndex: "classtime"
    },
    {
      title: "操作",
      align: "center",
      render: rs => (
        <a
          onClick={() => {
            $.confirm(
              `确认将 [${data.student_name}] 从该课时从移除吗？移除后可用次数会增加一次。`,
              async () => {
                let res = await $.get("/lesson/student/remove", {
                  lesson_uuid: rs.lesson_uuid,
                  student_uuid: rs.student_uuid
                });
                $.msg("移除成功");
                init();
                return res;
              }
            );
          }}
          style={{ color: "#f07070" }}
        >
          移除
        </a>
      )
    }
  ]; 
  let columns_ = [
    {
      title: "班级名称",
      align: "center",
      dataIndex: "name"
    },
    {
      title: "上课时间",
      align: "center",
      dataIndex: "classtime"
    }
  ];
  return (
    <Skeleton loading={loading ? true : false} paragraph={{ rows: 10 }} active>
      <div className="bs bg_white mt_15 pall_15">
        <div className="box box-1">
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">课卡名称：</span>
            <span className="fc_black1 box box-1">{data.name}</span>
          </div>
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">价格：</span>
            <span className="fc_black1 box box-1">{data.price}</span>
          </div>
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">有效期：</span>
            <span className="fc_black1 box box-1">
              {data.enddate ? data.startdate + "至" + data.enddate : "不限"}
            </span>
          </div>
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">课卡状态：</span>
            <span className="fc_pink box box-1">
              <span className="fc_black1">{data.status === "normal" ? "正常" : ""}</span>
              {data.status === "expired" ? "已过期" : ""}
              {data.status === "recover" ? "已收回" : ""}
              {data.status === "finished" ? "已上完" : ""}
            </span>
          </div>
        </div>
        <div className="box box-1 mt_10">
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">可用次数：</span>
            <span className="fc_black1 box box-1">
              <span className={data.remain ? "" : "hide"}>{data.remain}</span>
              <span
                className={
                  !data.remain && data.status === "run_out" ? "" : "hide"
                }
              >
                不限
              </span>
              <span
                className={
                  !data.remain && data.status !== "run_out" ? "" : "hide"
                }
              >
                0
              </span>
            </span>
          </div>
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">待上课：</span>
            <span className="fc_black1 box box-1">
              {(data.unfinished && data.unfinished.length) || 0}
            </span>
          </div>
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">已完课：</span>
            <span className="fc_black1 box box-1">
              {(data.finished && data.finished.length) || 0}
            </span>
          </div>
          <div className="box box-1" style={{width:'33.33%'}}>
            <span className="fc_gray">总次数：</span>
            <span className="fc_black1 box box-1">
              {data.maxtimes || "不限"}
            </span>
          </div>
        </div>
        <div className="box box-1 mt_10">
          <div className="box box-1">
            <span className="fc_gray">适用课程：</span>
            <span className="fc_black1 box box-1">
              {data.courses_name || "不限"}
            </span>
          </div>
        </div>
      </div>
      <div className="bs bg_white mt_15 ph_15">
        <Tabs defaultActiveKey={curTabKey} onChange={key => curTabKey === key}>
          <TabPane tab="待上课" key="unfinished">
            <Table
              rowKey={rs => rs.uuid}
              dataSource={dataUnfinished}
              columns={columns}
              pagination={false}
            />
          </TabPane>
          <TabPane tab="已完课" key="finished">
            <Table
              rowKey={rs => rs.uuid}
              dataSource={dataFinished}
              columns={columns_}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </div>
    </Skeleton>
  );
}
