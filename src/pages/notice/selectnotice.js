import React, { useState, useEffect } from "react";
import { $, FixedBox, Img, Btn, Modals } from "../comlibs";
export default function (props) {
  const Iconfont = $.icon();
  let { Parent = props.Parent, data = props.Parent.data, prediv, $curCampus = JSON.parse(localStorage.campus_obj) || {}, } = {};
  let [noticeList, setList] = useState([]);
  useEffect(() => {
    (async () => {
      let d = await $.get("/notice/template/list", { limit: 999 });
      setList(d.data);
    })();
  }, [1]);
  $.hover(
    ".sub_albums",
    (t) => t.find(".pst_abs.tranall").removeClass("lucid"),
    (t) => t.find(".pst_abs.tranall").addClass("lucid")
  );
  async function click(e, uuid) {
    let v = await $.get("/notice/template/detail", { uuid });
    if (e === 1) {
      Parent.close(v);
    } else {
      prediv.open("模板预览", v);
    }
  }
  let getYMD = (y, m, d) => {
    let date = new Date();
    let years = date.getFullYear();
    let month =
      parseInt(date.getMonth() + 1) >= 10
        ? parseInt(date.getMonth() + 1)
        : "0" + parseInt(date.getMonth() + 1);
    let day =
      parseInt(date.getDate()) >= 10
        ? parseInt(date.getDate())
        : "0" + parseInt(date.getDate());

    return years + "-" + month + "-" + day;
  };
  return (
    <div className="bg_white mt_15 pt_15 pl_25">
      <div style={{ minHeight: 700 }}>
        <div className="fs_20 fc_black2 mb_15 fb">新建消息通知</div>
        <div
          className={
            data === 1 ? "b_1 dis_ib mr_15 mb_15 va_t pointer" : "hide"
          }
          onClick={() => {
            Parent.close("create");
          }}
        >
          <div
            className="ta_c br_6 bs_1"
            style={{
              width: 200,
              height: 264,
            }}
          >
            <Iconfont
              className="fc_info"
              style={{
                fontSize: 42,
                marginTop: 100,
              }}
              type="icon-chuangjian"
            />
            <div className="fc_info fs_16 mt_10">自定义</div>
          </div>
        </div>
        {noticeList.map((v, i) => {
          return (
            <div
              key={i}
              className={`sub_albums sub_album_${i} b_1 pst_rel br_6 bs_1 dis_ib mr_15 mb_15 va_t pointer`}
            >
              <div
                className="ta_c"
                style={{
                  width: 200,
                  height: 264,
                }}
              >
                <Img
                  width="200"
                  src={v.cover + "?x-oss-process=style/coverbook200"}
                  height="200"
                  alt="null"
                  style={{ borderRadius: "6px 6px 0 0" }}
                />
                <div className="fc_black2 fs_16 ellipsis ta_c ph_5" style={{ lineHeight: '64px' }}>
                  {v.notice_title}
                </div>
                <div
                  className="pst_abs t_0 r_0 tranall lucid pst_abs"
                  style={{
                    width: 200,
                    height: 200,
                    background: "rgba(0,0,0,0.45)",
                    borderRadius: "6px 6px 0 0",
                  }}
                >
                  <div style={{ marginTop: 50 }}>
                    <Btn
                      onClick={() => {
                        click(1, v.uuid);
                      }}
                    >
                      立即使用
                    </Btn>
                  </div>
                  <Btn
                    className="cancelBtn fc_black5 mt_20"
                    onClick={() => {
                      click(2, v.uuid);
                    }}
                  >
                    预览模板
                  </Btn>
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ height: 100 }}></div>
        <FixedBox>
          <Btn
            onClick={() => {
              Parent.close(true);
            }}
          >
            关闭
          </Btn>
        </FixedBox>
      </div>
      <Modals ref={(rs) => (prediv = rs)} style={{ width: 375 }}>
        {(rs) => {
          return (
            <div className="tb_c">
              <div
                className="bg_spcc"
                style={{
                  width: 292,
                  height: 538,
                  backgroundImage: `url(https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b5b9413c-cc0a-11ea-8b99-00163e04cc20.png)`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                }}
              >
                <div
                  className="br_4"
                  style={{
                    paddingRight: 10,
                    height: 510,
                    width: 280,
                    paddingLeft: 20,
                    paddingTop: 50,
                  }}
                >
                  <div
                    className="CUSTOM_scroll CUSTOM_scroll_1"
                    style={{ overflowY: "auto", height: 460, paddingRight: 0 }}
                  >
                    <div
                      style={{
                        background: "#E7E7E7",
                        borderRadius: 7,
                        height: 14,
                        padding: "0 4px",
                      }}
                    >
                      <div
                        className="pst_rel"
                        style={{
                          background: "#CDCDCD",
                          height: 7,
                          borderRadius: 4,
                          top: 3,
                        }}
                      ></div>
                    </div>
                    <div className="bg_white mh_10 pst_rel pt_10" style={{ top: -7, borderRadius: '0 0 5px 5px', boxShadow: '0px 3px 6px 1px rgba(242,242,242,1)' }}>
                      <div className="ta_c fs_18 mt_10 fc_black1">{rs.notice_title}</div>
                      <div className="ta_c pb_10 fs_16 fc_black5">{$curCampus.name}</div>
                      <div className="ta_c fs_14 pb_10 fc_black6">{getYMD()}</div>
                      <div
                        style={{
                          borderBottom: "1px dashed #D3D3D3",
                          height: 1,
                        }}
                      ></div>
                      <div
                        className="notice_content ph_10 pt_10"
                        dangerouslySetInnerHTML={{ __html: rs.notice_content }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bt_1 mt_15 box box-pc pt_15">
                <Btn
                  onClick={() => {
                    Parent.close(rs);
                  }}
                >
                  使用此模板
                </Btn>
              </div>
            </div>
          );
        }}
      </Modals>
    </div>
  );
}
