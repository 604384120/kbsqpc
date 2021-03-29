import React, { useState, useEffect } from "react";
import {
  Tabs,
  Radio,
  Divider,
  Tooltip,
  Empty,
  Table,
  Input,
  Form as Forms,
} from "antd";
import {
  $,
  Modals,
  Page,
  Btn,
  Img,
  Form,
  TablePagination,
  Inputs,
} from "../comlibs";
import Service from "../other/service";
import Features from "./features";

let getCates = false;
export default function () {
  const { TabPane } = Tabs;
  const Iconfont = $.icon();
  let {
    type_modal,
    selIndex = 0,
    setIndex,
    previewimage = [
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/66680800-a934-11ea-8b90-00163e04cc20.png",
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/89335e5c-a934-11ea-8b90-00163e04cc20.png",
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/81199eac-a934-11ea-8b90-00163e04cc20.png",
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/6e7bae70-a934-11ea-8b90-00163e04cc20.png",
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/75de547e-a934-11ea-8b90-00163e04cc20.png",
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/9077791e-a934-11ea-8b90-00163e04cc20.png",
    ],
    MD = {
      "#1EC47C": 0, //绿色
      "#E95F5A": 1, //红色
      "#37C8FF": 2, //蓝色
      "#FCCB00": 3, //黄色
      "#099FFE": 4, //紫色
      "#FF8800": 5, //橙色
    },
    version = "qijian",
    setVersion,
    columnsData,
    setBardata,
    updateText = [],
    tabbar = {
      tabbarImg: {
        0: [
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b1bc28da-a9ef-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/8f592094-a93b-11ea-8b90-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b311011a-a9ef-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b4738d34-a9ef-11e9-81f9-00163e04cc20.png",
        ],
        1: [
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/ead2daa6-a9ef-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/9aec50de-a93b-11ea-8b90-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/edc370fe-a9ef-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/eefece14-a9ef-11e9-81f9-00163e04cc20.png",
        ],
        2: [
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/04bab574-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/a50de668-a93b-11ea-8b90-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/078a7924-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/08fc17b8-a9f0-11e9-81f9-00163e04cc20.png",
        ],
        3: [
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0d37da06-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/af681890-a93b-11ea-8b90-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0fe1d9a0-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/11145e74-a9f0-11e9-81f9-00163e04cc20.png",
        ],
        4: [
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/14ea015c-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/bb13635c-a93b-11ea-8b90-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/171b3b76-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1864b476-a9f0-11e9-81f9-00163e04cc20.png",
        ],
        5: [
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1c6d678e-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/d97c3cb0-aa2b-11ea-8b90-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1f28018c-a9f0-11e9-81f9-00163e04cc20.png",
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/20558cd2-a9f0-11e9-81f9-00163e04cc20.png",
        ],
      },
      tabbarColor: [
        "#1EC47C",
        "#E95F5A",
        "#37C8FF",
        "#FCCB00",
        "#099FFE",
        "#FF8800",
      ],
      tabbar_title: ["首页", "发现", "学习", "我的"],
      tabbarSelimg: {
        0: [
          "image/green/1.png",
          "image/green/find.png",
          "image/green/3.png",
          "image/green/4.png",
        ],
        1: [
          "image/red/1.png",
          "image/red/find.png",
          "image/red/3.png",
          "image/red/4.png",
        ],
        2: [
          "image/blue/1.png",
          "image/blue/find.png",
          "image/blue/3.png",
          "image/blue/4.png",
        ],
        3: [
          "image/yellow/1.png",
          "image/yellow/find.png",
          "image/yellow/3.png",
          "image/yellow/4.png",
        ],
        4: [
          "image/blues/1.png",
          "image/blues/find.png",
          "image/blues/3.png",
          "image/blues/4.png",
        ],
        5: [
          "image/orange/1.png",
          "image/orange/find.png",
          "image/orange/3.png",
          "image/orange/4.png",
        ],
      },
    },
    tabbar_update = {
      qijian: {
        type: "qijian",
        color: "#8E8E8E",
        selectedColor: tabbar.tabbarColor[selIndex],
        borderStyle: "black",
        backgroundColor: "#ffffff",
        list: [
          {
            pagePath: "pages/qijian/index",
            iconPath: "image/8.png",
            selectedIconPath: tabbar.tabbarSelimg[selIndex][0],
            text: tabbar.tabbar_title[0],
          },
          {
            pagePath: "pages/qijian/find",
            iconPath: "image/find-none.png",
            selectedIconPath: tabbar.tabbarSelimg[selIndex][1],
            text: tabbar.tabbar_title[1],
          },
          {
            pagePath: "pages/qijian/study",
            iconPath: "image/5.png",
            selectedIconPath: tabbar.tabbarSelimg[selIndex][2],
            text: tabbar.tabbar_title[2],
          },
          {
            pagePath: "pages/qijian/me",
            iconPath: "image/person.png",
            selectedIconPath: tabbar.tabbarSelimg[selIndex][3],
            text: tabbar.tabbar_title[3],
          },
        ],
      },
    },
  } = {};
  let {
    $curCampus = JSON.parse(localStorage.campus_obj),
    inst_uuid = localStorage.institution_uuid,
    show,
    setShow,
    tab = {
      xcx: {},
      style: {},
      gzh: {},
    },
    insInfo,
    setInfo,
    curTabKey = "xcx",
    page_features,
    modal_apply,
    permission,
    setPer,
    qrCode = "",
    setQr,
  } = {};
  let [cate, setCate] = useState();
  let [data, setData] = useState({});

  useEffect(() => {
    init();
  }, [1]);
  function init() {
    (async () => {
      let f = await $.get("/ins/multcampus/setting", {
        institution_uuid: inst_uuid,
      });
      // 字段需要与运营后台小程序模板code一致
      let arr = ["qijian", "biaozhun", "zhuoyue", "zhuanye", "jingdian"];
      // is_auditing 审核中 need_upgrade 可更新
      let buy = await $.get("/user/product/ext", {
        product_type: "extjson",
      });
      for (let w in arr) {
        for (let s in buy) {
          if (buy[s].extension.ext_code === arr[w]) {
            buy[s].need_tj =
              buy[s].is_auditing === "NO" &&
              buy[s].need_upgrade !== "YES" &&
              buy[s].permission &&
              buy[s].permission.status === "ACCESSIBLE" &&
              buy[s].is_using !== "YES";
            buy[s].MULT_CAMPUS = f.MULT_CAMPUS || "OFF";
            data = buy[s];
            setData(data);
            return false;
          }
        }
      }
    })();
  }
  function getInfo() {
    (async () => {
      // if (data.extension && data.extension.ext_code === "qijian") {
      //   setVersion(data.extension.ext_code);
      // } else {
      setVersion("qijian");
      //}
      if (inst_uuid) {
        let a = await $.get("/institution/detail/" + inst_uuid);
        if (!a.xcx_appid) {
          associate("小程序授权", 2);
          tabledata(0);
        } else {
          getAuth(a.xcx_appid);
        }
        setInfo(a);
      }
    })();
  }
  let columns = [
    {
      title: "序号",
      dataIndex: "_key",
      align: "center",
    },
    {
      title: "校区",
      render(rs) {
        return (
          <span
            className={rs.xcx_permission === "OFF" ? "fc_gray" : "link"}
            onClick={() => {
              if (rs.xcx_permission === "OFF") {
                return false;
              }
              page_features.open("校区功能配置", rs);
            }}
          >
            {rs.name}
          </span>
        );
      },
    },
    {
      title: "类型",
      render(rs) {
        return (
          <span>
            {rs.belong_type && rs.belong_type === "JOIN" ? "加盟" : "直营"}
          </span>
        );
      },
    },
    {
      title: "校区校长",
      dataIndex: "owner_teaher.name",
    },
    {
      title: "校长电话",
      dataIndex: "owner_teaher.phone",
    },
    {
      title: "到期时间",
      dataIndex: "enddate",
    },
    {
      title: "状态",
      render(rs) {
        return (
          <span className="dis_f ai_c">
            <span className={rs.xcx_permission === "EXIRPED" ? "" : "hide"}>
              <span
                className="dis_ib mr_5"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "#FAAD14",
                  borderRadius: "50%",
                }}
              ></span>
              过期
            </span>
            <span
              className={
                rs.xcx_permission === "ON" && rs.switch_status === "ON"
                  ? ""
                  : "hide"
              }
            >
              <span
                className="dis_ib mr_5"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "#52C41A",
                  borderRadius: "50%",
                }}
              ></span>
              开通
            </span>
            <span
              className={
                rs.xcx_permission === "OFF" || rs.switch_status === "OFF"
                  ? ""
                  : "hide"
              }
            >
              <span
                className="dis_ib mr_5"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: "50%",
                }}
              ></span>
              关闭
            </span>
          </span>
        );
      },
    },
    {
      title: "操作",
      align: "center",
      render(rs) {
        return (
          <div>
            <span
              className="pointer link"
              onClick={() => {
                window.open(
                  $.loc.origin +
                    `/product/productset.html?id=${data.uuid}&menu=xcx`
                );
              }}
            >
              {rs.xcx_permission === "OFF" ? "开通" : "续费"}
            </span>
            <Divider type="vertical" />
            <span
              className={
                rs.xcx_permission === "OFF" || rs.xcx_permission === "EXIRPED"
                  ? "fc_gray"
                  : "link pointer"
              }
              onClick={() => {
                if (
                  rs.xcx_permission === "OFF" ||
                  rs.xcx_permission === "EXIRPED"
                ) {
                  return false;
                }
                page_features.open("校区功能配置", rs);
              }}
            >
              功能配置
            </span>
          </div>
        );
      },
    },
  ];
  // 授权
  async function associate(title, type) {
    let rs = await $.get("/wechat/gzh/authurl", {
      institution_uuid: inst_uuid,
      auth_type: type,
    });
    type_modal && type_modal.open(title, rs.authurl);
  }
  let Authorize = () => {
    [insInfo, setInfo] = useState({});
    [version, setVersion] = useState("qijian");
    useEffect(() => {
      getInfo();
    }, [1]);
    return (
      <div>
        {insInfo.xcx_appid ? (
          <div className="box box-1">
            <div
              className="box br_4 b_1 box-ac ph_15"
              style={{
                boxShadow: "0px 0px 24px 0px rgba(236,235,235,0.5)",
                minWidth: 190,
                height: 65,
              }}
            >
              <div className="box">
                <Img
                  className="circle"
                  src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0fceac8c-a705-11ea-8b90-00163e04cc20.png"
                  width="30"
                />
              </div>
              <div className="box box-ver box-1 box-allc">
                <div className="box">
                  {(insInfo.xcx && insInfo.xcx.nick_name) || ""}
                </div>
                <div
                  onClick={() => {
                    $.confirm(
                      `提示：确定将当前小程序账号与开班神器解绑吗？解绑后会导致小程序部分功能无法使用。`,
                      async () => {
                        await $.get(
                          `/institution/${inst_uuid}/gzh/unassociate`,
                          {
                            auth_type: 2,
                          }
                        );
                        getInfo();
                        $.msg("解绑成功！");
                      }
                    );
                  }}
                  className={
                    data.extension && data.extension.ext_code === "jingdian"
                      ? "hide"
                      : "box fc_red pointer"
                  }
                >
                  解绑
                </div>
              </div>
            </div>
            {data.extension && data.extension.ext_code !== "jingdian" ? (
              <div className="box box-allc ml_25">
                <Btn
                  onClick={(e) => {
                    e.loading = true;
                    preview(1);
                  }}
                  className={
                    (!data.need_upgrade &&
                      !data.is_using &&
                      !data.is_auditing) ||
                    data.need_tj
                      ? ""
                      : "hide"
                  }
                >
                  提交审核
                </Btn>
                <Btn
                  onClick={(e) => {
                    e.loading = true;
                    preview();
                  }}
                  className={data.need_upgrade === "YES" ? "" : "hide"}
                >
                  升级更新
                </Btn>
                <div className={data.is_auditing === "YES" ? "" : "hide"}>
                  <Btn disabled>审核中</Btn>
                  <span
                    className="fs_13 lh_32 ml_15"
                    style={{ color: "#ea6060" }}
                  >
                    预计1-5个工作日，审核结果会以微信/短信形式通知给校长
                  </span>
                </div>
                <div
                  className={
                    data.is_using === "YES" &&
                    data.is_auditing !== "YES" &&
                    data.need_upgrade !== "YES"
                      ? "cancelBtn ph_10 pv_2 br_3 ml_25"
                      : "hide"
                  }
                >
                  使用中
                </div>
                <Qrcode />
              </div>
            ) : (
              <div className="box box-ac ml_25">
                {!data.permission ||
                (data.permission && data.permission.status !== "ACCESSIBLE") ? (
                  <a
                    target="_blank"
                    href={`product/productset.html?id=${data.uuid}&menu=xcx`}
                  >
                    <Btn>购买</Btn>
                  </a>
                ) : (
                  <div className="box cancelBtn ml_15 ph_10 pv_2 br_3">
                    使用中
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className="box br_4 b_1 box-ac ph_15"
            style={{
              boxShadow: "0px 0px 24px 0px rgba(236,235,235,0.5)",
              width: 190,
              height: 65,
            }}
          >
            <div className="box">
              <Img
                className="circle"
                src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0fceac8c-a705-11ea-8b90-00163e04cc20.png"
                width="30"
              />
            </div>
            <div className="box box-ver box-1 box-allc">
              <div
                onClick={() => {
                  associate("小程序授权", 2);
                }}
                className="box fc_blue pointer"
              >
                点击授权小程序
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  let Record = () => {
    [show, setShow] = useState("a");
    return (
      <div>
        <div style={{ marginTop: 16 }}>
          <Radio.Group
            defaultValue="a"
            onChange={(e) => {
              setShow(e.target.value);
            }}
          >
            <Radio.Button value="a">校区开通</Radio.Button>
            <Radio.Button value="b">更新记录</Radio.Button>
          </Radio.Group>
        </div>
        <div className="mt_15 box box-1" style={{ minHeight: 400 }}>
          {show === "a" ? (
            <div className="box box-ver box-1">
              <div
                className={
                  data.MULT_CAMPUS === "OFF"
                    ? "box box-ac mb_15 topTips"
                    : "hide"
                }
              >
                <Iconfont className="box fs_20" type="icon-tishi" />
                <span className="ml_10">
                  当前版本为单校区版本，若需要开通更多校区，请
                  <Tooltip title={() => <Service />}>
                    <span className="link">联系客服</span>
                  </Tooltip>
                </span>
              </div>
              <TablePagination
                className="box-1"
                api="/manage/ins/ext/campus"
                columns={columns}
                params={{
                  totalnum: "NO",
                  institution_uuid: inst_uuid,
                }}
              />
            </div>
          ) : (
            <div style={{ whiteSpace: "pre-line" }}>{data.ext_summary}</div>
          )}
        </div>
      </div>
    );
  };
  window.addEventListener(
    "message",
    (e) => {
      if (e.data === "1") {
        type_modal.close();
        $.msg("授权成功！");
        getInfo();
      }
    },
    false
  );
  let Gzh = () => {
    [insInfo, setInfo] = useState({});
    [permission, setPer] = useState({ buy: true, enddate: "" });
    useEffect(() => {
      (async () => {
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
        let d = await $.get("/notice/permission");
        if (Object.getOwnPropertyNames(d).length === 0) return false;
        if (!d.enddate) {
          setPer({ buy: false, enddate: "" });
        } else {
          setPer({ buy: true, enddate: d.enddate });
        }
      })();
    }, [inst_uuid]);
    return (
      <div className={permission.buy ? "mb_15" : "hide"}>
        <div className="mb_15">
          请先授权微信公众号
          <span style={{ color: "red" }}>[ 经典版无需授权 ]</span>
          <span className="ml_15">有效期：{permission.enddate}</span>
        </div>
        <div className="box">
          <div className="box box-pc pv_20 ph_15 bs_1" style={{ width: 240 }}>
            <div className="box box-allc" style={{ width: 80 }}>
              <img
                src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b7f1c2e8-f9e9-11e8-9a54-00163e04cc20.png"
                className="box"
                width={30}
                alt="null"
              />
            </div>
            <div className="box box-ver box-allc box-1">
              <div className={insInfo.gzh_appid ? "box fs_14 fc_gray" : "hide"}>
                您已授权 [{insInfo.gzh && insInfo.gzh.nick_name}]
                {insInfo.gzh && insInfo.gzh.account_type === "SERVICE_ACCOUNT"
                  ? "服务号"
                  : "订阅号"}
              </div>
              <div
                className={
                  insInfo.gzh_appid &&
                  insInfo.gzh &&
                  insInfo.gzh.account_type !== "SERVICE_ACCOUNT"
                    ? "fs_12 fc_red"
                    : "hide"
                }
              >
                由于受腾讯限制，订阅号无法进行消息推送。请升级为服务号。
              </div>
              <span
                size="small"
                className={
                  !insInfo.gzh_appid ? "fc_blue underline pointer" : "hide"
                }
                onClick={() => {
                  associate("公众号授权", 1);
                }}
              >
                点击授权公众号
              </span>
              <span
                size="small"
                className={
                  insInfo.gzh_appid ? "fc_red underline pointer" : "hide"
                }
                onClick={() => {
                  $.confirm(
                    `确定要将公众号[${insInfo.gzh.nick_name}] 与当前学校解除绑定关系吗？`,
                    async () => {
                      await $.get(`/institution/${inst_uuid}/gzh/unassociate`, {
                        auth_type: 1,
                      });
                      getInfo();
                      $.msg("解绑成功！");
                    }
                  );
                }}
              >
                解绑
              </span>
            </div>
          </div>
          <Tooltip title={() => <Service />}>
            <div
              className="box box-pc pv_20 ph_15 ml_15 bs_1 pointer"
              style={{ width: 240 }}
            >
              <div className="box box-allc" style={{ width: 80 }}>
                <img
                  src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/64c4253c-a705-11ea-8b90-00163e04cc20.png"
                  className="box"
                  width={30}
                  alt="null"
                />
              </div>
              <div className="box box-ver box-allc box-1">
                <span className="fc_blue underline">联系客服配置</span>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  };
  function getAuth(appid) {
    (async () => {
      if (!appid) {
        changeTabbar(MD["#1EC47C"], true);
        return false;
      }
      let res = await $.get("/wechat/auth/info", {
        authorizer_appid: appid,
      });
      if (res.tabbar) {
        let use_tabbar = JSON.parse(res.tabbar);
        let selectedColor = use_tabbar.selectedColor;
        setIndex && setIndex(MD[selectedColor]);
        // tabbar 文字
        tabbar.tabbar_title[0] = use_tabbar.list[0].text;
        tabbar.tabbar_title[1] = use_tabbar.list[1].text;
        tabbar.tabbar_title[2] = use_tabbar.list[2].text;
        tabbar.tabbar_title[3] = use_tabbar.list[3].text;
        changeTabbar(MD[selectedColor], true);
      } else {
        tabledata(0);
      }
      if (!getCates) {
        getCates = true;
        let s = await $.get(`/institution/${inst_uuid}/xcx/category`);
        s.map((v, i) => {
          if (v.third_class) {
            v.text = v.first_class + "-" + v.second_class + "-" + v.third_class;
          } else {
            v.text = v.first_class + "-" + v.second_class;
          }
          v.value = i;
          return v;
        });
        setCate(s);
      }
    })();
  }
  // 更新主题 文字 颜色 图标
  function changeTabbar(e, c) {
    // 颜色
    tabbar_update[version].selectedColor = tabbar.tabbarColor[e];
    // 文字
    tabbar_update[version].list[0].text = tabbar.tabbar_title[0];
    tabbar_update[version].list[1].text = tabbar.tabbar_title[1];
    tabbar_update[version].list[2].text = tabbar.tabbar_title[2];
    tabbar_update[version].list[3].text = tabbar.tabbar_title[3];
    // 图片
    tabbar_update[version].list[0].selectedIconPath = tabbar.tabbarSelimg[e][0];
    tabbar_update[version].list[1].selectedIconPath = tabbar.tabbarSelimg[e][1];
    tabbar_update[version].list[2].selectedIconPath = tabbar.tabbarSelimg[e][2];
    tabbar_update[version].list[3].selectedIconPath = tabbar.tabbarSelimg[e][3];
    if (c) {
      tabledata(e);
    }
  }
  function tabledata(e) {
    let title = [];
    tabbar_update[version].list.map((v) => {
      title.push(v.text);
      return v;
    });
    let data = [
      {
        key: "1",
        title: title[0],
        img: tabbar.tabbarImg[e][0],
        value: updateText[0] || "",
      },
      {
        key: "2",
        title: title[1],
        img: tabbar.tabbarImg[e][1],
        value: updateText[1] || "",
      },
      {
        key: "3",
        title: title[2],
        img: tabbar.tabbarImg[e][2],
        value: updateText[2] || "",
      },
      {
        key: "4",
        title: title[3],
        img: tabbar.tabbarImg[e][3],
        value: updateText[3] || "",
      },
    ];
    setBardata && setBardata(data);
  }
  let columns_tab = [
    {
      title: "图标",
      align: "center",
      key: "img",
      render(rs) {
        return <Img className="bg_white" src={rs.img} width={24} height={24} />;
      },
    },
    {
      title: "当前导航名称",
      dataIndex: "title",
      align: "center",
      key: "title",
    },
    {
      title: "自定义导航名称",
      align: "center",
      key: "value",
      render(rs) {
        return (
          <div>
            <Input
              value={rs.value}
              name={rs.key}
              style={{ width: 180 }}
              maxLength={4}
              placeholder="不超过4个字"
              onChange={(e) => {
                updateText[e.target.name - 1] = e.target.value;
                tabbar.tabbar_title[e.target.name - 1] = e.target.value;
                tabledata(selIndex);
              }}
            />
          </div>
        );
      },
    },
  ];
  async function preview(e) {
    changeTabbar(selIndex, true);
    let ext_s = "";
    let use_datas = {};
    if (data.extension.ext_code !== "jingdian") {
      ext_s = `{"institution_uuid":"${inst_uuid}","campus_uuid":"${$curCampus.campus_uuid}","appid":"${insInfo.xcx_appid}","code":"${data.extension.ext_code}","theme":"${tabbar_update[version].selectedColor}"}`;
      use_datas = {
        ext: ext_s,
        tabbar: JSON.stringify(tabbar_update[version]),
      };
    } else {
      ext_s = `{"institution_uuid":"${inst_uuid}","campus_uuid":"${$curCampus.campus_uuid}","appid":"${insInfo.xcx_appid}","code":"${data.extension.ext_code}"}`;
      use_datas = {
        ext: ext_s,
      };
    }
    await $.post(
      `/institution/${inst_uuid}/ext/${data.extension.ext_uuid}/use`,
      use_datas
    );
    let res = await $.get(`/institution/${inst_uuid}/xcx/preview`);
    setQr("data:image/png;base64," + res.qr);
    modal_apply.open("请选择服务类目", e);
  }
  let Setting = () => {
    [selIndex, setIndex] = useState(0);
    [columnsData, setBardata] = useState();
    useEffect(() => {
      getAuth(insInfo.xcx_appid);
    }, [1]);
    return (
      <div className="box">
        <div className="box">
          <Img src={previewimage[selIndex]} width={320} />
        </div>
        <div className="box box-ver box-1 ml_25">
          <div className="box box-ac">
            <div className="box">主题色：</div>
            <div className="box">
              <Radio.Group
                onChange={(e) => {
                  setIndex(e.target.value);
                  tabledata(e.target.value);
                }}
                defaultValue={selIndex}
                value={selIndex}
              >
                <Radio.Button
                  value={0}
                  className="mr_24"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    padding: 0,
                    lineHeight: "40px",
                  }}
                >
                  <div
                    className="box"
                    style={{
                      background: "#1EC47C",
                      width: 36,
                      height: 36,
                      margin: "1px auto",
                    }}
                  ></div>
                </Radio.Button>
                <Radio.Button
                  value={1}
                  className="mr_24"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    padding: 0,
                    lineHeight: "40px",
                  }}
                >
                  <div
                    className="box"
                    style={{
                      background: "#E95F5A",
                      width: 37,
                      height: 36,
                      margin: "1px auto",
                    }}
                  ></div>
                </Radio.Button>
                <Radio.Button
                  value={2}
                  className="mr_24"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    padding: 0,
                    lineHeight: "40px",
                  }}
                >
                  <div
                    className="box"
                    style={{
                      background: "#37C8FF",
                      width: 37,
                      height: 36,
                      margin: "1px auto",
                    }}
                  ></div>
                </Radio.Button>
                <Radio.Button
                  value={3}
                  className="mr_24"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    padding: 0,
                    lineHeight: "40px",
                  }}
                >
                  <div
                    className="box"
                    style={{
                      background: "#FCCB00",
                      width: 37,
                      height: 36,
                      margin: "1px auto",
                    }}
                  ></div>
                </Radio.Button>
                <Radio.Button
                  value={4}
                  className="mr_24"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    padding: 0,
                    lineHeight: "40px",
                  }}
                >
                  <div
                    className="box"
                    style={{
                      background: "#099FFE",
                      width: 37,
                      height: 36,
                      margin: "1px auto",
                    }}
                  ></div>
                </Radio.Button>
                <Radio.Button
                  value={5}
                  className="mr_24"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    padding: 0,
                    lineHeight: "40px",
                  }}
                >
                  <div
                    className="box"
                    style={{
                      background: "#FF8800",
                      width: 37,
                      height: 36,
                      margin: "1px auto",
                    }}
                  ></div>
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div className="mt_15">
            <Table
              rowKey={(rs) => rs.title}
              columns={columns_tab}
              dataSource={columnsData}
              size="middle"
              pagination={false}
            />
            <div className="box box-1 mt_15">
              <div className="fc_black5 box box-ac box-1">
                <span className="box fs_15" style={{ color: "#E63E3E" }}>
                  *
                </span>
                <span className="box">
                  修改主题色和导航名称需要重新提交微信审核
                </span>
              </div>
              <Btn
                onClick={() => {
                  $.confirm(
                    `确定变更主题吗？变更主题后，需要重新提交至腾讯审核`,
                    () => {
                      preview();
                    }
                  );
                }}
              >
                确定
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  };
  let Qrcode = () => {
    [qrCode, setQr] = useState("");
    return <Img src={qrCode} width={320} className="hide qrcode" />;
  };
  return (
    <div className="ph_16 box-1">
      <Tabs
        animated={false}
        defaultActiveKey={curTabKey}
        onChange={(key) => curTabKey === key}
      >
        <TabPane tab="小程序" key="xcx">
          <Authorize />
          <Record />
        </TabPane>
        <TabPane tab="风格样式" key="style">
          {data.extension && data.extension.ext_code !== "jingdian" ? (
            <Setting />
          ) : (
            <div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    当前版本不支持自定义导航内容，您可以
                    <br />
                    <Tooltip title={() => <Service />}>
                      <span className="link">联系客服</span>
                    </Tooltip>
                    升级到卓越版/旗舰版进行体验
                  </span>
                }
              />
            </div>
          )}
        </TabPane>
        <TabPane tab="公众号" key="gzh">
          <Gzh />
          <div
            className="box box-allc"
            style={{
              background: "linear-gradient(180deg,#FDFDFD 80%,#F5F3F1 100%)",
            }}
          >
            <img
              src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/e9ba2408-a705-11ea-8b90-00163e04cc20.png"
              className="box"
              style={{ height: "420", width: "1144px" }}
              alt="null"
            />
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
      <Modals
        ref={(rs) => (modal_apply = rs)}
        style={{ width: 400, height: 600 }}
      >
        {(res) => {
          return (
            <Form
              onSubmit={(values) => {
                let $cate = cate[0];
                let category = {
                  first_class: $cate.first_class,
                  first_id: $cate.first_id,
                  second_class: cate[values.index].second_class,
                  second_id: cate[values.index].second_id,
                };
                $.confirm(
                  "确定将小程序提交到腾讯审核吗？审核时间为1-5个工作日，审核成功后会以微信/短信的形式通知给校长",
                  async () => {
                    await $.post(`/institution/${inst_uuid}/xcx/audit`, {
                      category: JSON.stringify(category),
                    });
                    modal_apply.close();
                    init();
                    $.msg("申请已提交!");
                  }
                );
              }}
            >
              {({ form, set }) => (
                <div>
                  {cate.length > 0 ? (
                    <div>
                      <Forms.Item
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                        label="服务类目"
                        required
                      >
                        <Inputs
                          placeholder="请选择服务类目"
                          form={form}
                          name="index"
                          required={true}
                          select={cate}
                          width={240}
                        />
                      </Forms.Item>
                      <div className="ta_c mt_30">
                        <Btn htmlType="submit">
                          {res === 1 ? "确定并申请更新" : "确定并提交审核"}
                        </Btn>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        抱歉，您的小程序当前服务类目不在 [教育]
                        类目下，请前往微信小程序管理后台添加相应的教育类目！
                      </div>
                      <div className="mv_15">
                        注意，小程序服务类目的设置将直接影响到小程序在微信端的审核进度！
                      </div>
                      <div className="gray">
                        如有疑惑，可查看
                        <a
                          href="/page/fb5abb49-0016-11e8-b7b9-00163e04cc20.html"
                          target="_blank"
                        >
                          《小程序服务类目设置教程》
                        </a>
                        或
                        <Tooltip title={() => <Service />}>
                          <span className="link">联系客服</span>
                        </Tooltip>
                        人员寻求帮助。
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Form>
          );
        }}
      </Modals>
      <Page mask={true} ref={(rs) => (page_features = rs)}>
        <Features />
      </Page>
    </div>
  );
}
