import React from "react";
import { Btn } from "../comlibs";
import { Icon } from "antd";

export default function (props) {
  let Parent = props.Parent;
  let data = Parent.data;
  console.log(data);
  return (
    <div className="bg_white mt_15 box box-ver" style={{ paddingBottom: 100 }}>
      <div className="box box-allc">
        <Icon
          className="fc_suc"
          type="check-circle"
          theme="filled"
          style={{
            fontSize: 60,
            margin: "120px 0 24px 0",
          }}
        />
      </div>
      <div className="box box-allc fc_black mb_15 fs_20 fw_600">
      {data.custom_time !== "" ? '通知创建成功' : '通知发送成功'}
      </div>
      <div className="box box-allc fc_info mb_15 fs_18">
        {data.notice_title}
      </div>
      <div
        className="box pv_20 box-ver box-ac mb_15 fc_gray br_2 bg_gray3 m_auto"
        style={{ width: 550 }}
      >
        <div className="box box-1" style={{ width: "100%" }}>
          <div className="box box-pe fc_black2" style={{ width: "45%" }}>
            通知人数：
          </div>
          <div className="box box-1 fc_black5">
            {data.cnt_student}人
            {data.confirm === "ON" ? <span>，需确认</span> : ""}
          </div>
        </div>
        <div className="box box-1 mv_15" style={{ width: "100%" }}>
          <div className="box box-pe fc_black2" style={{ width: "45%" }}>
            发送时间：
          </div>
          <div className="box box-1 fc_black5">
            {data.custom_time !== "" ? data.custom_time : data.time_create}
          </div>
        </div>
      </div>
      <div className="ta_c mt_24">
        <Btn
          className="mr_15"
          onClick={() => {
            Parent.close();
          }}
        >
          返回通知列表
        </Btn>
      </div>
    </div>
  );
}
