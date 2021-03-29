import React, { useState, useEffect } from "react";
import { $, Form, Btn } from "../comlibs";
import { Tooltip } from "antd";
const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};
export default function (props) {
  let { uuid = props.Parent.data } = {};
  let [data, setDatd] = useState({ students: [],user:{} });
  useEffect(() => {
    (async () => {
      let d = await $.get("/notice/custom/detail", { notice_uuid: uuid });
      setDatd(d);
    })();
  }, [uuid]);
  return (
    <div className="mt_20">
      <Form {...col} onSubmit={(values) => {}}>
        {({ form }) => (
          <div className="box">
            <div className="box box-ver bg_white br_2" style={{ width: 300 }}>
              <div className="box box-ac pv_10 bb_1">
                <div className="box pl_10 box-1 box-ver">
                  <div className="fs_15 fc_black">通知人群</div>
                  <div>共发送{data.students.length}人</div>
                </div>
                <Btn
                  className="fl_r mr_10"
                  width={80}
                  onClick={() => {
                    let text = "给未读学员再次发送提醒。";
                    if (data.confirm && data.confirm === "ON") {
                      text = "给未确认消息通知的学员再次发送提醒。";
                    }
                    $.confirm(text, async () => {
                      await $.post(`/notice/custom/warning`, {
                        notice_uuid: uuid,
                      });
                      $.msg("发送成功！");
                    });
                  }}
                >
                  再次提醒
                </Btn>
              </div>
              <div
                className="box box-ver pl_10"
                style={{ overflowY: "auto", height: 545 }}
              >
                {data.students &&
                  data.students.map((v,i) => {
                    return (
                      <div className={i+1===data.students.length?"box box-ac pr_10 pv_5":"box box-ac pr_10 pv_5 bb_1"}>
                        {v.gzh_bind && v.gzh_bind === "YES" ? (
                          <img
                            className="box"
                            src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/a4c6fe6e-c192-11ea-8b94-00163e04cc20.png"
                            style={{ width: 20, height: 16 }}
                          />
                        ) : (
                          <Tooltip title="学员未绑定公众号">
                            <img
                              className="box pointer"
                              src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/9eb1d06c-c192-11ea-8b94-00163e04cc20.png"
                              style={{ width: 20, height: 16 }}
                            />
                          </Tooltip>
                        )}
                        <div className="box ml_5 box-1 fc_black2">
                          {v.name || "未命名"}
                        </div>
                        <div className="box ">
                          {data.confirm && data.confirm === "ON" ? (
                            <span className="">
                              <span
                                className={
                                  v.is_confirm !== "YES" && v.is_read === "YES"
                                    ? ""
                                    : "hide"
                                }
                              >
                                已读
                              </span>
                              <span
                                className={v.is_confirm === "YES" ? "" : "hide"}
                              >
                                已确认
                              </span>
                            </span>
                          ) : (
                            <span
                              className={
                                v.is_read === "YES" ? "fc_green" : "hide"
                              }
                            >
                              已读
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="box box-ver box-1 ml_15 bg_white pt_10 pb_30">
              <div className="box ph_20 pv_10 box-ver bb_1">
                <div className="box fs_18 fb fc_black2 mb_15">
                  {data.notice_title}
                </div>
                <div className="box mb_5">
                  <div className="box box-1">
                    <span className="fc_black2">发布人：</span>
                    <span className="fc_black3">
                      {data.teacher_name
                        ? data.teacher_name+`(${data.phone})` || "-"
                        : "-"}
                    </span>
                  </div>
                  <div className="box box-1">
                    <span className="fc_black2">发送时间：</span>
                    <span className="fc_black3">{data.time_sent || "-"}</span>
                  </div>
                  <div className="box box-1 fc_black3">
                    {data.confirm && data.confirm === "ON" ? "需学员确认" : ""}
                  </div>
                </div>
              </div>
              <div
                className="CUSTOM_scroll"
                style={{
                  padding: 20,
                  height: 480,
                  overflowY: "auto",
                }}
              >
                <div
                  className="notice_content"
                  dangerouslySetInnerHTML={{ __html: data.notice_content }}
                />
              </div>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
