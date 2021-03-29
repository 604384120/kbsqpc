import React, { useState, useEffect } from "react";
import { Alert, Switch, Empty } from "antd";
import { $, Img, Btn, FixedBox } from "../comlibs";

export default function (props) {
  let [campusData = props.Parent.data, Parent = props.Parent] = [];
  let [data, setData] = useState({});
  useEffect(() => {
    init();
  }, [1]);
  function init() {
    (async () => {
      let hidden = [
        "TEACHER_XCX",
        "BOOKS",
        "ALBUM",
        "COUPON",
        "USER_DYNAMIC",
        "FEEDBACK",
      ];
      let rs = await $.get("/campus/xcx/enable/funcs", {
        campus_uuid: campusData.campus_uuid,
      });
      rs.funcs.map((v) => {
        hidden.indexOf(v.func_id) > -1 ? (v.hidden = true) : (v.hidden = false);
        return v;
      });
      setData(rs.funcs);
    })();
  }
  function switchs(e, s) {
    (async () => {
      let obj = {
        campus_uuid: campusData.campus_uuid,
        func_id: s.func_id,
      };
      if (e) {
        //   开启
        await $.get("/campus/xcx/func/on", obj);
        $.msg("开启成功！");
        init();
      } else {
        //   关闭
        await $.get("/campus/xcx/func/off", obj);
        $.msg("关闭成功！");
        init();
      }
    })();
  }
  return (
    <div className="bg_white mt_15 pv_15 pl_24 pr_10 box box-ver">
      <div className="box mb_10 mr_15">
        <div className="box box-1">
          <span className="fc_black2">校区：</span>
          <span>{campusData.name}</span>
        </div>
        <div className="box box-1">
          <span className="fc_black2">类型：</span>
          <span className="fc_black5">
            {campusData.belong_type && campusData.belong_type === "JOIN"
              ? "加盟"
              : "直营"}
          </span>
        </div>
      </div>
      <div className="box mb_10 mr_15">
        <div className="box box-1">
          <span className="fc_black2">校区校长：</span>
          <span className="fc_black5">{campusData.owner_teaher.name}</span>
        </div>
        <div className="box box-1">
          <span className="fc_black2">联系电话：</span>
          <span className="fc_black5">{campusData.owner_teaher.phone}</span>
        </div>
      </div>
      <div className="box mb_10 mr_15">
        <div className="box box-1">
          <span className="fc_black2">服务到期时间：</span>
          <span className="fc_black5">{campusData.enddate}</span>
        </div>
      </div>
      {campusData.jingdian_permission &&
      campusData.jingdian_permission === "YES"||!data.length ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>当前版本暂无可自定义配置的功能</span>}
        />
      ) : (
        <div>
          <div className="box mr_15">
            <Alert
              className="box box-1"
              message={
                <span className="fc_black5">
                  以下功能模块可设置是否在学员端展示
                </span>
              }
              type="info"
              showIcon
            />
          </div>
          <div className="mt_15 ov_h">
            {data.length > 0 &&
              data.map((v, i) => {
                return (
                  <div
                    className={
                      v.hidden
                        ? "hide"
                        : "box box-1 mr_15 fl_l br_2 mb_30 pall_15"
                    }
                    style={{ width: "31.5%", background: "#F7F8FA" }}
                    key={i}
                  >
                    <div className="box">
                      <Img
                        className="box"
                        src={v.icon}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="box box-1 ml_15 box-ver">
                      <div className="box">
                        <div className="box box-1 fb fs_16 fc_black2">
                          {v.func_name}
                        </div>
                        <div className="box">
                          <Switch
                            checkedChildren=""
                            unCheckedChildren=""
                            checked={v.switch_status === "ON" ? true : false}
                            onChange={(e) => {
                              switchs(e, v);
                            }}
                          />
                        </div>
                      </div>
                      <div className="box"></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      <FixedBox>
        <Btn
          className="ml_10"
          onClick={() => {
            Parent.close(true);
          }}
        >
          关闭
        </Btn>
      </FixedBox>
    </div>
  );
}
