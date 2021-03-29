import React, { useState, useEffect } from "react";
import { Tag } from "antd";
import { Method, Btn, Page, Modals, Dropdown } from "../comlibs";
import { del, sus, rei } from "./publicBtn";
import Edit from "./edit";

export default function (props) {
  const $ = new Method();
  const Iconfont = $.icon();
  const Parent = props.data;
  let _page = Parent;
  let [data, setData] = useState({});
  let { uuid = _page.data, Page_edit, bind } = {};
  function init() {
    (async () => {
      let res = await $.get(`/teacher/detail/${uuid}`);
      setData(res);
      _page.setCloseData(true);
    })();
  }
  useEffect(() => {
    init();
  }, [uuid]);
  const dropdown = [
    {
      name: (rs) =>
        !data.status || data.status === "INSERVICE" ? "离职" : "复职",
      onClick: (rs) => {
        !data.status || data.status === "INSERVICE"
          ? sus(data.name, uuid, data.userkind, () => {
              init();
            })
          : rei(data.name, uuid, () => {
              init();
            });
      },
    },
    {
      name: "删除",
      onClick: (rs) => {
        del(data.name, uuid, data.userkind, () => {
          Parent.close(true);
        });
      },
    },
  ];

  return (
    <div>
      <div className="box mt_15 ph_16 pv_16 bg_white">
        <div className="box box-ver box-pc mr_25" style={{ width: 80 }}>
          <div
            className="bg_spcc circle"
            style={{
              width: 80,
              height: 80,
              backgroundImage: `url(${data.avatar})`,
            }}
          />
          <div className="box-1 ta_c fs_16 fw_600 fc_black1">{data.name}</div>
        </div>
        <div className="box box-1">
          <div className="box box-1 mb_10">
            <div className="box box-1 box-ver">
              <div className="box box-1">
                <div className="box" style={{ width: 300 }}>
                  <span className="fc_gray">老师账号：</span>
                  <span className="fc_black1">
                    {(data.user && data.user.user_phone) || "无账号"}
                  </span>
                </div>
                <div className="box box-1">
                  <span className="fc_gray">出生日期：</span>
                  <span className="fc_black1">
                    {data.birthday === "" ? "未设置" : data.birthday}
                  </span>
                </div>
              </div>
              <div className="box box-1 mt_10">
                <div className="box" style={{ width: 300 }}>
                  <span className="fc_gray">展示 | 排序：</span>
                  <span className="fc_black1">
                    {data.show === "yes" ? "展示" : "隐藏"}
                  </span>
                  <span style={{ width: 14, textAlign: "center" }}>|</span>
                  <span className="fc_black1">
                    {!data.sortby||data.sortby === "" ? "未设置" : data.sortby}
                  </span>
                </div>
                <div className="box box-1">
                  <span className="fc_gray">绑定微信：</span>
                  <span className="fc_black1">
                    {data.wxuser === "YES" ? "已绑定" : "未绑定"}
                  </span>
                  <span
                    onClick={() => bind.open("", {})}
                    className={
                      data.wxuser === "YES"
                        ? "hide"
                        : "ml_10 fc_blue underline pointer"
                    }
                  >
                    邀请老师绑定
                  </span>
                </div>
              </div>
              <div className="box box-1 mt_10">
                <div className="box" style={{ width: 300 }}>
                  <span className="fc_gary">入职日期：</span>
                  <span className="fc_black1">
                    {data.entryday === "" ? "未设置" : data.entryday}
                  </span>
                </div>
                <div className="box box-1">
                  <span className="fc_gary">详细介绍：</span>
                  <span className="fc_black1">
                    {!data.memo || data.memo === ""
                      ? "未填写，点右上角编辑填写"
                      : "已填写，点右上角编辑查看"}
                  </span>
                </div>
              </div>
              <div className="box box-1 mt_10">
                <Tag
                  style={{ background: "#F5F5F5", color: "#666" }}
                  className="ph_10 pv_5 fs_14"
                >
                  {data.fulltime === "fulltime" ? "全职" : "兼职"}
                </Tag>
                {!data.status || data.status === "INSERVICE" ? (
                  <Tag
                    style={{ background: "#F5F5F5", color: "#666" }}
                    className="ph_10 pv_5 fs_14"
                  >
                    <font>{data.user_kind === "owner" ? "校区校长" : ""}</font>
                    <font>{data.user_kind === "admin" ? "管理员" : ""}</font>
                    <font>
                      {data.user_kind === "teacher" ? "普通老师" : ""}
                    </font>
                  </Tag>
                ) : (
                  ""
                )}
                {data.gender && <Tag
                  style={{ background: "#F5F5F5", color: "#666" }}
                  className="ph_10 pv_5 fs_14"
                >
                  {data.gender === "male" && "男"}
                  {data.gender === "female" && "女"}
                </Tag>}
                <Tag
                  style={{ background: "#F5F5F5", color: "#666" }}
                  className={
                    parseInt(data.teachage)>0? "ph_10 pv_5 fs_14" : "hide"
                  }
                >
                  教龄{data.teachage}年
                </Tag>
              </div>
            </div>
            <div className="box box-ver" style={{ width: 140 }}>
              <div className="ta_r">
                <Btn
                  className="mr_10"
                  onClick={(data) => Page_edit.open("编辑老师详情")}
                >
                  编辑
                </Btn>
                <Dropdown
                  data={data}
                  list={dropdown}
                  className={data.user_kind === "owner" ? "hide" : ""}
                >
                  <span className="fc_gary ant-btn" style={{ lineHeight: 2 }}>
                    更多
                  </span>
                </Dropdown>
              </div>
              <div className="box box-ver">
                <div className="box box-pc mt_15">
                  <Iconfont
                    style={{ fontSize: 70 }}
                    type="icon-erweima"
                    className="box fc_black1"
                  />
                </div>
                <div
                  className="box box-pc box-1 pointer fc_blue mt_5"
                  onClick={async () => {
                    let base64 = await $.get("/teacher/qrcode", {
                      teacher_uuid: data.uuid,
                    });
                    $.download(base64.img, {
                      name: "老师二维码",
                      _type: "base64",
                    });
                  }}
                >
                  下载老师二维码
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modals
        ref={(rs) => (bind = rs)}
        style={{ width: 380, height: 400, borderRadius: 6 }}
      >
        <div className="box box-ver">
          <div className="box box-1 fs_18 fc_blue box-allc">
            <Iconfont
              style={{ fontSize: 20 }}
              type="icon-saoyisao"
              className="box fc_black1"
            />
            <span className="box ml_10">扫一扫，绑定开班神器公众号</span>
          </div>
          <div className="box box-ver box-1 box-pc">
            <div
              className="box bg_spcc"
              style={{
                width: 170,
                height: 170,
                backgroundImage: `url("https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/aa117c22-2855-11ea-ac92-00163e04cc20.jpeg")`,
                margin: "auto",
              }}
            />
            <div
              className="box box-ver fc_black1 fs_14 lh_28 ta_l"
              style={{ width: 260, margin: "0 0 0 55px" }}
            >
              <div className="box-1">1.打开微信，点击右上角+号；</div>
              <div className="box-1">2.点击扫一扫功能； </div>
              <div className="box-1">3.将二维码放入框内，扫描并关注； </div>
              <div className="box-1">4.点击右下角【机构中心】-【绑定微信】</div>
              <div className="box-1">
                5. 
                <a
                  target="_blank"
                  href="https://www.yuque.com/zwriad/bz1d16/teaching_notice"
                  rel="noopener noreferrer"
                >
                  查看帮助文档
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modals>
      <Page
        ref={(rs) => (Page_edit = rs)}
        onClose={() => {
          init();
        }}
      >
        <Edit uuid={uuid} />
      </Page>
    </div>
  );
}
