import React, { useState, useEffect } from "react";
import {
  Btn,
  $,
  Page,
  Modals,
  Form,
  Inputs,
  TablePagination,
} from "../comlibs";
import { Alert, Switch, Tabs, Empty, Tooltip } from "antd";
import Service from "../other/service";
import Send from "./send";
import Senddetail from "./senddetail";
import Selectnotice from "./selectnotice";
import Success from "./success";

export default function () {
  const { TabPane } = Tabs;
  let {
    inst_uuid = localStorage.institution_uuid,
    type_modal,
    time_modal,
    tab = {
      noticelist: {},
      noticetype: {},
    },
    curTabKey = "noticelist",
    page_send,
    page_senddetail,
    page_selectnotice,
    page_success,
  } = {};
  let [noticeTime, setTime] = useState(
    JSON.parse(localStorage.campus_obj).custom_time || "20:30"
  );
  let [noticeEnabled, setEnabled] = useState([]);
  let [info, setInfo] = useState({});
  let [permission, setPer] = useState({ buy: true, enddate: "" });
  let [imgSrc, setSrc] = useState({
    src:
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/30291372-387e-11eb-a81e-00163e04cc20.png",
    title: "自定义通知",
  });
  useEffect(() => {
    (async () => {
      let d = await $.get("/notice/permission");
      if (Object.getOwnPropertyNames(d).length === 0) return false;
      if (!d.enddate) {
        setPer({ buy: false, enddate: "" });
      } else {
        setPer({ buy: true, enddate: d.enddate });
      }
      getEnabled();
      getInfo();
    })();
  }, []);
  function getEnabled() {
    (async () => {
      let res = await $.get("/notice/enabled");
      setEnabled(res.enabled_notices);
    })();
  }
  function getInfo() {
    (async () => {
      let data = await $.get(`/institution/detail/${inst_uuid}`);
      if (data.gzh_appid) {
        //行业设置
        let res = await $.get("/gzh/industry/valid", {
          gzh_appid: data.gzh_appid,
        });
        if (res.pass !== "YES") {
          $.confirm(
            `您当前公众号行业信息设置不正确，无法进行消息推送，点击确定进行一键修改`,
            async () => {
              await $.get("/gzh/industry/set", { gzh_appid: data.gzh_appid });
            }
          );
        }
      }
      setInfo(data);
    })();
  }
  window.addEventListener(
    "message",
    (e) => {
      if (e.data === "1") {
        type_modal.close();
        $.msg("授权成功！");
        getInfo();
        //重新激活
        if (noticeEnabled.length > 0) {
          enable(noticeEnabled.toString());
        }
      }
    },
    false
  );
  function switchs(e, s) {
    (async () => {
      if (!permission.buy) {
        setEnabled([]);
        $.confirm(`您当前未购买消息通知或通知已过期！`, () => {});
        return false;
      }
      if (!info.xcx_appid && !info.gzh_appid && e) {
        $.confirm(
          `您当前未授权公众号或购买的是经典版小程序，学员消息将通过享学中心进行推送，请知晓。`,
          () => {
            enable(s);
          }
        );
      } else {
        if (e) {
          enable(s);
        } else {
          await $.get("/notice/disable", {
            notice_types: s,
          });
          getEnabled();
          $.msg("关闭成功！");
        }
      }
    })();
  }
  //   开启
  function enable(e) {
    (async () => {
      await $.get("/notice/enable", {
        notice_types: e,
      });
      getEnabled();
      $.msg("开启成功！");
    })();
  }
  let columns = [
    {
      title: "序号",
      dataIndex: "_key",
    },
    {
      title: "主题",
      render(rs) {
        return (
          <span
            className="link"
            onClick={() => page_senddetail.open(rs.notice_title, rs.uuid)}
          >
            {rs.notice_title}
          </span>
        );
      },
    },
    {
      title: "已阅/总人数",
      align: "center",
      render(rs) {
        return (
          <span>
            {rs.cnt_read}/{rs.cnt_student}
          </span>
        );
      },
    },
    {
      title: "时间",
      dataIndex: "time_sent",
    },
    {
      title: "发布人",
      render(rs) {
        return <span>{rs.teacher_name || "-"}</span>;
      },
    },
    {
      title: "操作",
      align: "center",
      render(rs) {
        return (
          <a
            onClick={() => {
              $.confirm("删除通知后，学员将无法继续查看", async () => {
                await $.get("/notice/custom/delete", {
                  notice_uuid: rs.uuid,
                });
                $.msg("删除成功");
                tab.noticelist.reload();
              });
            }}
            style={{ color: "#f07070" }}
          >
            删除
          </a>
        );
      },
    },
  ];

  return (
    <div className="br_2 bg_white ph_15 mt_20">
      <Tabs
        animated={false}
        defaultActiveKey={curTabKey}
        onChange={(key) => curTabKey === key}
      >
        <TabPane tab="消息列表" key="noticelist">
          <Form onSubmit={(values) => tab.noticelist.search(values)}>
            {({ form }) => (
              <div className="mb_5 ov_h">
                <div className="fl_r">
                  <Btn
                    className={permission.buy ? "mb_10" : "hide"}
                    onClick={() => {
                      if (noticeEnabled.indexOf("CUSTOMNEW") === -1) {
                        $.confirm("请在学员消息设置中开启自定义通知");
                        return false;
                      }
                      page_selectnotice.open("新建消息通知", 1);
                    }}
                  >
                    发布新通知
                  </Btn>
                </div>
              </div>
            )}
          </Form>
          {!permission.buy ? (
            <div className="box box-allc minH">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="ta_c fc_black2">
                    <Tooltip title={() => <Service />}>
                      <span className="dis_b">
                        暂未开通群发通知功能，可
                        <span className="link">联系客服</span>咨询
                      </span>
                    </Tooltip>
                  </span>
                }
              ></Empty>
            </div>
          ) : (
            <TablePagination
              api="/notice/custom/list"
              columns={columns}
              ref={(ref) => (tab.noticelist = ref)}
              emptyText={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    noticeEnabled.indexOf("CUSTOMNEW") > -1 ? (
                      <span className="ta_c ant-empty-description">
                        暂无数据
                      </span>
                    ) : (
                      <span className="ta_c fc_black2">
                        <span className="dis_b">
                          请去<span className="link">学员消息设置</span>
                          中开启自定义通知
                        </span>
                      </span>
                    )
                  }
                ></Empty>
              }
            />
          )}
        </TabPane>
        <TabPane tab="学员消息设置" key="noticetype">
          <div className={!permission.buy ? "mb_15" : "hide"}>
            <Alert
              message="您当前未开通消息通知，请联系客服：400-766-1816 或添加客服微信号：kaibanshenqi"
              type="warning"
              showIcon
            />
          </div>
          <div className={permission.buy ? "mb_15" : "hide"}>
            <div className="mb_15">
              请先授权微信公众号
              <span style={{ color: "red" }}>[ 经典版无需授权 ]</span>
            </div>
            <div className="box">
              <div
                className="box box-pc pv_20 ph_15 bs_1"
                style={{ width: 240 }}
              >
                <div className="box box-allc" style={{ width: 80 }}>
                  <img
                    src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b7f1c2e8-f9e9-11e8-9a54-00163e04cc20.png"
                    className="box"
                    width={54}
                    alt="null"
                  />
                </div>
                <div className="box box-ver box-allc box-1">
                  <div className="box mb_6">微信公众号</div>
                  <div
                    className={info.gzh_appid ? "box fs_14 fc_gray" : "hide"}
                  >
                    您已授权 [{info.gzh && info.gzh.nick_name}]
                    {info.gzh && info.gzh.account_type === "SERVICE_ACCOUNT"
                      ? "服务号"
                      : "订阅号"}
                  </div>
                  <div
                    className={
                      info.gzh_appid &&
                      info.gzh &&
                      info.gzh.account_type !== "SERVICE_ACCOUNT"
                        ? "fs_12 fc_red"
                        : "hide"
                    }
                  >
                    由于受腾讯限制，订阅号无法进行消息推送。请升级为服务号。
                  </div>
                  <Btn
                    size="small"
                    className={!info.gzh_appid ? "" : "hide"}
                    onClick={async () => {
                      let $curCampus = JSON.parse(localStorage.campus_obj);
                      if (
                        $curCampus.user_kind === "owner" ||
                        $curCampus.user_kind === "admin"
                      ) {
                        let rs = await $.get("/wechat/gzh/authurl", {
                          institution_uuid: inst_uuid,
                          auth_type: 1,
                        });
                        type_modal.open("公众号授权", rs.authurl);
                      } else {
                        $.confirm(
                          `注意：您当前不是管理员权限，无法进行授权操作哦！`,
                          () => {}
                        );
                      }
                    }}
                  >
                    点击授权
                  </Btn>
                  <Btn
                    size="small"
                    className={info.gzh_appid ? "" : "hide"}
                    onClick={() => {
                      $.confirm(
                        `确定要将公众号[${info.gzh.nick_name}] 与当前学校解除绑定关系吗？`,
                        async () => {
                          await $.get(
                            `/institution/${inst_uuid}/gzh/unassociate`,
                            {
                              auth_type: 1,
                            }
                          );
                          getInfo();
                          $.msg("解绑成功！");
                        }
                      );
                    }}
                  >
                    解绑
                  </Btn>
                </div>
              </div>
              <div className="box box-1 box-ac box-pe">
                有效期：{permission.enddate}
              </div>
            </div>
          </div>
          <div className="box b_1">
            <div className="box box-ver box-1">
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">自定义通知</span>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("CUSTOMNEW") > -1 ? true : false
                      }
                      onChange={(e, s) => {
                        switchs(e, "CUSTOMNEW");
                      }}
                    />
                    <div className="box box-ver ml_15">
                      <Btn
                        style={{
                          width: 84,
                        }}
                        className="cancelBtn fc_gray"
                        onClick={() => {
                          setSrc({
                            src:
                              "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/30291372-387e-11eb-a81e-00163e04cc20.png",
                            title: "自定义通知",
                          });
                        }}
                      >
                        预&nbsp; &nbsp; 览
                      </Btn>
                    </div>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  教培学校可通过微信发送放假通知/调课通知/停课通知/活动通知/考试考级通知等
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1 box-ac">
                  <div className="box box-1 box-ver">
                    <div className="box mb_10">
                      <span className="fs_14 fc_black1 fw_600">上课提醒</span>
                      <div className="box ml_15 fs_12 fc_pink">
                        *系统自动发送
                      </div>
                    </div>
                    <div className="box fs_12 fc_dis">
                      开启后，系统会在每天{noticeTime}
                      自动向第二天有课的学员/家长发送上课提醒，学校也可自定义设置发送时间
                    </div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("CLASS") > -1 ? true : false
                      }
                      onChange={(e) => {
                        switchs(e, "CLASS");
                      }}
                    />
                    <div className="box box-ver ml_15">
                      <Btn
                        className="mb_10"
                        onClick={() => {
                          time_modal.open("上课提醒时间设置");
                        }}
                      >
                        设置
                      </Btn>
                      <Btn
                        className="cancelBtn fc_gray"
                        onClick={() => {
                          setSrc({
                            src:
                              "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b0546048-3882-11eb-a81e-00163e04cc20.png",
                            title: "上课提醒",
                          });
                        }}
                        style={{
                          width: 84,
                        }}
                      >
                        预&nbsp; &nbsp; 览
                      </Btn>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">学员点评</span>
                    <div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("LESSONREVIEW") > -1
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        switchs(e, "LESSONREVIEW");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/7fb29150-3880-11eb-a81e-00163e04cc20.png",
                          title: "学员点评",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  开启后，老师发布学员点评，学员/家长即可收到消息通知
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">上课点名</span>
                    <div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("ROLLCALL") > -1 ? true : false
                      }
                      onChange={(e) => {
                        switchs(e, "ROLLCALL");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/ce6a0880-3882-11eb-a81e-00163e04cc20.png",
                          title: "上课点名",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  开启后，老师上课点名，学员/家长即可收到老师的点名消息
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">到离校打卡</span>
                    <div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("ATTENDENCE") > -1 ? true : false
                      }
                      onChange={(e) => {
                        switchs(e, "ATTENDENCE");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/f83020c8-3882-11eb-a81e-00163e04cc20.png",
                          title: "到离校打卡",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  开启后，学员打卡签到，学员/家长即可收到打卡消息
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">作业提醒</span>
                    <div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("HOMEWORK") > -1 ? true : false
                      }
                      onChange={(e) => {
                        switchs(e, "HOMEWORK");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0c0fc36e-3883-11eb-a81e-00163e04cc20.png",
                          title: "作业提醒",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  老师在作业布置/批改作业/催缴作业时，学员/家长可收到对应的消息
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">约课成功提醒</span>
                    <div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("APPOINTSUCCESS") > -1
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        switchs(e, "APPOINTSUCCESS");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1d73b44e-3883-11eb-a81e-00163e04cc20.png",
                          title: "约课成功提醒",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  开启后，学员通过享学预约课程成功后，会收到约课成功提醒通知
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">
                      学员消课统计提醒
                    </span>
                    <div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("COURSELESSONS") > -1
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        switchs(e, "COURSELESSONS");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/37512cb6-3883-11eb-a81e-00163e04cc20.png",
                          title: "学员消课统计提醒",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  开启后，系统会在每天09:00自动向前一天有消课记录的学员/家长发送消课统计
                </div>
              </div>
              <div className="box box-ver pall_20 bb_1">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">补课通知</span>
                    <div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("REMEDYLESSON") > -1
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        switchs(e, "REMEDYLESSON");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/4e80fa92-3883-11eb-a81e-00163e04cc20.png",
                          title: "补课通知",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  老师在给学员安排补课时，学员可收到具体的补课时间
                </div>
              </div>
              <div className="box box-ver bb_1 pall_20">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">学员签退通知</span>
                    <div className="box ml_15 fs_12 fc_pink">
                      *课节结课后发送
                    </div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("LESSONEND") > -1 ? true : false
                      }
                      onChange={(e) => {
                        switchs(e, "LESSONEND");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/5dff7bce-3883-11eb-a81e-00163e04cc20.png",
                          title: "学员签退通知",
                        });
                      }}
                      style={{
                        width: 84,
                      }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  老师在课节中点击课节结课操作的时候，给学员推送结课提醒。
                </div>
              </div>
              <div className="box box-ver pall_20">
                <div className="box box-1">
                  <div className="box box-ac box-1 mb_10">
                    <span className="fs_14 fc_black1 fw_600">学员续费提醒</span>
                    <div className="box ml_15 fs_12 fc_pink">*手动发送</div>
                  </div>
                  <div className="box box-ac">
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      checked={
                        noticeEnabled.indexOf("PAYMENTSTUDENT") > -1
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        switchs(e, "PAYMENTSTUDENT");
                      }}
                    />
                    <Btn
                      className="ml_15 cancelBtn fc_gray"
                      onClick={() => {
                        setSrc({
                          src:
                            "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/737ab7b6-3883-11eb-a81e-00163e04cc20.png",
                          title: "学员续费提醒",
                        });
                      }}
                      style={{ width: 84 }}
                    >
                      预&nbsp; &nbsp; 览
                    </Btn>
                  </div>
                </div>
                <div className="box fs_12 fc_dis">
                  可对报名缴费-续费提醒中的学员进行续费提醒发送。
                </div>
              </div>
            </div>
            <div
              className="box box-ver bl_1 ph_5 pt_5"
              style={{
                width: 400,
                height: 1010,
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              <div className="mt_10 box box-allc fc_black fs_14 fw_600">
                {imgSrc.title}
              </div>
              <div className="bg_spcc mt_10">
                <img src={imgSrc.src} width={375} alt="null" />
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <Modals
        ref={(rs) => (type_modal = rs)}
        style={{ width: 1000, height: 700 }}
      >
        {(res) => (
          <iframe
            style={{ width: "100%", height: "700px", overflow: "visible" }}
            src={res}
            width="100%"
            height={700}
            scrolling="no"
            frameBorder="0"
          />
        )}
      </Modals>
      <Modals ref={(rs) => (time_modal = rs)} style={{ width: 300 }}>
        {(rs) => (
          <Form
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 12 }}
            onSubmit={async (values) => {
              if (values.custom_time) {
                await $.post(`/campus/custom/lessontime`, {
                  custom_time: values.custom_time,
                });
                time_modal.close();
                setTime(values.custom_time);
                $.msg("设置成功!");
              }
            }}
          >
            {({ form }) => (
              <div>
                <Inputs
                  className="mt_10"
                  label="开课前一天"
                  name="custom_time"
                  form={form}
                  placeholder="选择提醒时间"
                  style={{ width: 130 }}
                  type="timePicker"
                  minuteStep={30}
                  value={noticeTime}
                />
                <div className="box box-allc mt_6">
                  <img
                    className="box"
                    src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/dbaa3964-7ef8-11ea-8b8e-00163e04cc20.png"
                    style={{ width: 18, height: 18 }}
                    alt="null"
                  />
                  <span className="ml_10">修改后，新规则于明天生效！</span>
                </div>
                <div className="ta_c mt_15">
                  <Btn htmlType="submit" style={{ width: 80 }} />
                </div>
              </div>
            )}
          </Form>
        )}
      </Modals>
      <Page
        ref={(rs) => (page_selectnotice = rs)}
        onClose={(e) => {
          page_selectnotice.close();
          page_send.open("发布新通知", e);
        }}
      >
        <Selectnotice />
      </Page>
      <Page
        ref={(rs) => (page_send = rs)}
        onClose={(r) => {
          tab.noticelist.reload();
          page_success.open("发送通知", r);
        }}
      >
        <Send />
      </Page>
      <Page ref={(rs) => (page_senddetail = rs)}>
        <Senddetail />
      </Page>
      <Page ref={(rs) => (page_success = rs)}>
        <Success />
      </Page>
    </div>
  );
}
