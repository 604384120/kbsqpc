import React, { useState } from "react";
import { Form as Forms } from "antd";
import {
  $,
  Form,
  Inputs,
  Page,
  Uploadimgs,
  TablePagination,
  FixedBox,
  Btn,
  Img,
} from "../comlibs";
import Zmage from "react-zmage";

export default function (props) {
  const Iconfont = $.icon();
  let [
    cover,
    setCover,
    tab,
    uploadimgs,
    page_detail,
    campus_uuid = localStorage.campus_uuid,
  ] = [];
  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key",
    },
    {
      title: "反馈人",
      dataIndex: "user.nickname",
    },
    {
      title: "联系方式",
      dataIndex: "user.phone",
    },
    {
      title: "反馈内容",
      dataIndex: "content",
    },
    {
      title: "反馈时间",
      dataIndex: "time_create",
    },
    {
      title: "反馈类型",
      render: (rs) => (
        <span>{rs.feedback_type === "OPINION" ? "意见" : "建议"}</span>
      ),
    },
    {
      title: "状态",
      render: (rs) => (
        <span className={rs.status === "UNREPLY" ? "fc_gold" : "fc_green"}>
          {rs.status === "UNREPLY" ? "未回复" : "已回复"}
        </span>
      ),
    },
    {
      title: "操作",
      render(rs) {
        return (
          <div>
            <span
              className="pointer link"
              onClick={async () => {
                let d = await $.get(`/campus/feedback/detail`, {
                  feedback_uuid: rs.uuid,
                });
                page_detail.open("反馈详情", d, {
                  left: 180,
                });
              }}
            >
              查看
            </span>
          </div>
        );
      },
    },
  ];
  $.hover(
    ".sub_albums",
    (t) => t.find(".pst_abs.tranall").removeClass("lucid"),
    (t) => t.find(".pst_abs.tranall").addClass("lucid")
  );
  let Covers = ({ set }) => {
    [cover, setCover] = useState([]);
    return (
      <Forms.Item label="" style={{ width: "100%" }}>
        {set(
          {
            name: "cover",
            value: "",
          },
          (valueSet) => (
            <div className="mt_10">
              {cover.length > 0 &&
                cover.map((r, i) => {
                  return (
                    <div className={`ov_h mr_10  mb_10 dis_ib va_t`} key={i}>
                      <div className={`sub_albums box sub_album_${i} pointer`}>
                        <Img width={240} height={120} className="box" src={r} />
                        <div
                          className="pst_abs t_10 r_10 tranall lucid"
                          onClick={() => {
                            for (let s = 0; s < cover.length; s++) {
                              if (cover[s] === r) {
                                cover.splice(s, 1);
                                setCover(cover);
                                valueSet(cover);
                              }
                            }
                          }}
                        >
                          <Iconfont
                            className="fs_24 fc_red fb"
                            type="icon-shanchu"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div
                className="pointer mb_10 dis_ib va_t"
                onClick={() => uploadimgs.open()}
              >
                <div
                  className="box box-ver box-allc"
                  style={{
                    width: 240,
                    height: 120,
                    background: "#f7f7f7",
                  }}
                >
                  <Iconfont
                    className="box fc_gray3"
                    style={{
                      fontSize: 60,
                    }}
                    type="icon-chuangjianxiangce"
                  />
                  <div className="box fc_gray3 fs_14">点击上传图片</div>
                </div>
              </div>
              <Uploadimgs
                prefix="upload/image/"
                ref={(e) => (uploadimgs = e)}
                onSure={(d) => {
                  setCover(cover.concat(d.split(",")));
                  valueSet(cover.concat(d.split(",")).join(","));
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    );
  };
  return (
    <div className="bs mt_15 ph_10 bg_white minH">
      <Form onSubmit={(values) => tab.search(values)} className="pt_15">
        {({ form }) => (
          <div className="mb_15">
            <Inputs
              width={120}
              name="status"
              placeholder="全部状态"
              form={form}
              select={[
                { text: "全部状态", value: "" },
                { text: "已回复", value: "REPLY" },
                { text: "待回复", value: "UNREPLY" },
              ]}
              autoSubmit={true}
            />
          </div>
        )}
      </Form>
      {campus_uuid ? (
        <TablePagination
          api="/campus/feedback/query"
          columns={columns}
          ref={(ref) => (tab = ref)}
        />
      ) : (
        ""
      )}
      <Page ref={(rs) => (page_detail = rs)}>
        {(d) => {
          return (
            <Form
              className="bs mt_15 ph_10 bg_white pt_15 pb_30"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
              onSubmit={async (values) => {
                values.feedback_uuid = d.uuid;
                values.replay_imgs = values.cover || "";
                if (values.replay_content === "") {
                  $.warning("请填写反馈内容！");
                  return false;
                }
                await $.post("/campus/feedback/replay", values);
                $.msg("回复成功！");
                tab.reload();
                page_detail.close();
              }}
            >
              {({ form, set }) => (
                <div>
                  <div className="bs mt_15 ph_10 bg_white pt_15 pb_30 box box-ver">
                    <div className="box mb_10">
                      <div className="box box-1">
                        <span className="ta_r" style={{ width: 70 }}>
                          反馈人：
                        </span>
                        <span>{d.user.nickname}</span>
                      </div>
                      <div className="box box-1">
                        <span>联系方式：</span>
                        <span>{d.user.phone}</span>
                      </div>
                    </div>
                    <div className="box mb_10">
                      <div className="box box-1">
                        <span>反馈时间：</span>
                        <span>{d.time_create}</span>
                      </div>
                      <div className="box box-1">
                        <span>反馈校区：</span>
                        <span>{d.campus_name}</span>
                      </div>
                    </div>
                    <div className="box pt_15 mb_10 bt_1">
                      <div className="box box-1">
                        <span>反馈内容：</span>
                        <span>{d.content}</span>
                      </div>
                    </div>
                    <div className="mb_10" style={{ paddingLeft: 70 }}>
                      {d.imgs &&
                        d.imgs.length > 0 &&
                        d.imgs.map((c, index) => {
                          return (
                            <div className="box dis_ib mt_10 mr_10 mb_10">
                              <Zmage
                                className="br_3"
                                controller={{ zoom: false }}
                                backdrop="rgba(255,255,255,.9)"
                                alt={c}
                                src={c}
                                style={{ height: 120 }}
                                set={d.imgs.map((image) => ({
                                  src: image,
                                  alt: image,
                                }))}
                                defaultPage={index}
                              />
                            </div>
                          );
                        })}
                    </div>
                    <div className="box">
                      <span className="box" style={{ width: 70 }}>
                        回复：
                      </span>
                      <Inputs
                        className="box"
                        style={{ width: 500 }}
                        form={form}
                        rows={3}
                        name="replay_content"
                        value={d.replay_content || ""}
                        type="textArea"
                        disabled={d.status === "REPLY" ? true : false}
                      />
                    </div>
                    {d.status === "UNREPLY" ? (
                      <div className="box mb_10" style={{ paddingLeft: 60 }}>
                        <Covers set={set} />
                      </div>
                    ) : (
                      <div className="mb_10" style={{ paddingLeft: 70 }}>
                        {d.replay_imgs &&
                          d.replay_imgs.length > 0 &&
                          d.replay_imgs.map((c, index) => {
                            return (
                              <div className="box dis_ib mt_10 mr_10 mb_10">
                                <Zmage
                                  className="br_3"
                                  controller={{ zoom: false }}
                                  backdrop="rgba(255,255,255,.9)"
                                  alt={c}
                                  src={c}
                                  style={{ height: 220 }}
                                  set={d.replay_imgs.map((image) => ({
                                    src: image,
                                    alt: image,
                                  }))}
                                  defaultPage={index}
                                />
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  <FixedBox>
                    {d.status === "REPLY" ? (
                      <Btn
                        className="cancelBtn"
                        onClick={() => {
                          page_detail.close();
                        }}
                      >
                        返回
                      </Btn>
                    ) : (
                      <div>
                        <Btn
                          className="cancelBtn"
                          onClick={() => {
                            page_detail.close();
                          }}
                        >
                          取消
                        </Btn>
                        <Btn htmlType="submit" className="ml_15" />
                      </div>
                    )}
                  </FixedBox>
                </div>
              )}
            </Form>
          );
        }}
      </Page>
    </div>
  );
}
