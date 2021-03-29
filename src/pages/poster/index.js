import React, { useState, useEffect } from "react";
import { $, Form, Inputs, Modals, Btn, Img, Uploadimgs } from "../comlibs";
import { Input, Tag } from "antd";
const { CheckableTag } = Tag;
export default function () {
  let user = $.store().GlobalData.user;
  let {
    tags = ["全部", "可编辑", "招生营销", "二十四节气", "节日"],
    list,
    setList,
    $list,
    setList$,
    status = 1,
    feedback,
    posterDetail,
    uploadimgs,
    campus_obj = JSON.parse(localStorage.campus_obj),
    selectedTags = "全部",
    setTag,
    curimgindex = 1,
    setImgindex,
    detailData,
    setDetail,
    qrcode,
  } = {};
  function filter(tag) {
    let lists = [];
    if (tag !== "全部") {
      $list.map((v) => {
        if (v.tags.indexOf(tag) > -1) {
          lists.push(v);
        }
        return v;
      });
      setList(lists);
    } else {
      setList($list);
    }
  }

  let Postre = () => {
    [list, setList] = useState([]);
    [$list, setList$] = useState([]);
    [selectedTags, setTag] = useState("全部");
    useEffect(() => {
      (async () => {
        let d = await $.get("/poster/thumbs/list", {
          ptype: "M640x1008px",
          limit: 999,
        });
        d.map((v) => {
          if (v.components) {
            for (let t in v.components) {
              if (
                v.components[t].source_id === "CUSTOM" &&
                v.components[t].type === "TEXT"
              ) {
                v.editable = true;
                if (!(v.tags.indexOf("可编辑") > -1)) {
                  v.tags = v.tags + ",可编辑";
                }
                break;
              }
            }
          }
          return v;
        });
        setList(d);
        setList$(d);
      })();
    }, [status]);
    return (
      <div className="pb_20">
        <div className="box pv_20" style={{ width: 620, margin: "0 auto" }}>
          <div className="box box-1 fc_gray">
            <div>
              <span style={{ marginRight: 8 }}>海报分类:</span>
              {tags.map((tag) => (
                <CheckableTag
                  key={tag}
                  checked={selectedTags === tag}
                  className="fs_14 br_3 lh_30 ta_c pointer"
                  style={{ minWidth: 56 }}
                  onChange={() => {
                    filter(tag);
                    setTag(tag);
                  }}
                >
                  {tag}
                </CheckableTag>
              ))}
            </div>
          </div>
          <div
            className="box fc_14 fc_blue pointer underline lh_30"
            onClick={() => {
              feedback.open("海报反馈");
            }}
          >
            反馈您想要的海报类型
          </div>
        </div>
        {list.map((t, index) => {
          return (
            <div className="dis_ib mr_32" key={index}>
              <div
                className="mb_24 br_8 pall_12"
                style={{ boxShadow: "0px 1px 15px 0px rgba(238,238,238,1)" }}
              >
                <a
                  onClick={async () => {
                    let data = await $.get(`/poster/${t.uuid}/detail`);
                    let preObj = {};
                    if (
                      user.qr &&
                      user.qr !== "undefined" &&
                      user.qr !== undefined
                    ) {
                      preObj.qr = user.qr;
                    }
                    let r = await $.post(`/poster/${t.uuid}/preview`, preObj);
                    data.previewimg = "data:image/png;base64," + r.img;
                    posterDetail.open("", data);
                  }}
                  className="box box-ver poster_list"
                >
                  <div
                    style={{ width: 200, height: 315, position: "relative" }}
                  >
                    <Img
                      width="200"
                      height="315"
                      src={`${
                        t.thumb || t.imgurl
                      }?x-oss-process=style/coverbook200`}
                    />
                    <div
                      className="fc_white fs_14 ph_5 lh_30"
                      style={{
                        background:
                          "linear-gradient(180deg,rgba(126,126,126,0.55) 0%,rgba(0,0,0,0.75) 100%)",
                        position: "relative",
                        top: "-30px",
                      }}
                    >
                      <span>{t.usage || 0}次使用</span>
                      <span className={t.editable ? "" : "hide"}>·可编辑</span>
                    </div>
                  </div>
                  <p
                    className="fs_16 fc_black1 pt_5 ellipsis mb_0"
                    style={{ color: "#666", width: "200px" }}
                  >
                    {t.name}
                  </p>
                </a>
              </div>
            </div>
          );
        })}
        <div
          className={
            list.length > 0
              ? "hide"
              : "box box-1 box-ac box-pc FC-darkGray ph_10 pv_10 fs_12"
          }
          style={{ lineHeight: "400px" }}
        >
          没有搜索到相关海报哦~
        </div>
      </div>
    );
  };
  let Content = ({ data }) => {
    [detailData, setDetail] = useState(data);
    [curimgindex, setImgindex] = useState(1);
    return (
      <div className="box">
        <div className="box pall_24" style={{ width: 448 }}>
          <Img
            width="400"
            height="630"
            src={detailData.previewimg}
            alt="null"
          />
        </div>
        <div
          className="box box-ver box-1 pl_20"
          style={{
            boxShadow: "-2px 0px 4px 0px rgba(234,234,234,0.5)",
          }}
        >
          <div className="fs_16 box box-allc pt_30 pb_20">模板编辑</div>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17 }}
            onSubmit={async (values, btn, v) => {
              // 1.电脑下载海报 2.保存预览 3.上传图片后更新detailData 4.手机下载海报
              let datas = { ...detailData };
              if (v) {
                let keyNames = Object.getOwnPropertyNames(values);
                datas.components.map((v) => {
                  keyNames.map((s) => {
                    if (v.name === s) {
                      v.data = values[s];
                    }
                    return v;
                  });
                  if (v.type === "IMG" && v.data) {
                    values[v.name] = v.data;
                  }
                });
                if (v !== 3) {
                  let p = await $.post(`/poster/${datas.uuid}/preview`, values);
                  datas.previewimg = "data:image/png;base64," + p.img;
                  setDetail(datas);
                }
                if (v === 4) {
                  let downloadImg = await $.base64TransOss(
                    detailData.previewimg
                  );
                  let res = await $.get("/jobs/qrcode", {
                    url:
                      $.loc.origin +
                      "/h5#/poster_creat?previewimg=" +
                      downloadImg,
                  });
                  qrcode.open("下载到手机", {
                    img: "data:image/png;base64," + res.img,
                  });
                }
                btn && btn.props ? (btn.loading = false) : (btn.loading = true);
                if (v !== 1) {
                  return false;
                }
              }
              $.download(detailData.previewimg, {
                name: "海报",
                _type: "base64",
              });
              posterDetail.close();
            }}
          >
            {({ form, submit }) => (
              <div>
                <div
                  className="CUSTOM_scroll oy_a pr_0"
                  style={{ maxHeight: 500 }}
                >
                  {detailData.components.map((t, index) => {
                    if (t.type !== "MIX") {
                      if (t.type === "IMG") {
                        if (t.source_id === "CAMPUS_LOGO") {
                          if (!t.data) {
                            t.data =
                              (campus_obj.logo && campus_obj.logo.oss) ||
                              "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/campuslogo.png";
                          }
                          return (
                            <div
                              className={
                                index !== 0
                                  ? "box bt_1 box-1 mb_10 pt_24"
                                  : "box box-1 mb_10 pt_10"
                              }
                              key={index}
                            >
                              <span
                                className="fc_black2 ta_r"
                                style={{ width: 90 }}
                              >
                                {t.show_name}
                                <span style={{ margin: "0 8px 0 2px" }}>:</span>
                              </span>
                              <div className="ml_15">
                                <img
                                  src={
                                    t.data ||
                                    (campus_obj.logo && campus_obj.logo.oss) ||
                                    "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/campuslogo.png"
                                  }
                                  alt="null"
                                  width="56"
                                  height="56"
                                  className="circle dis_ib pointer"
                                  onClick={(e) => {
                                    setImgindex(index);
                                    submit(e, 3);
                                    uploadimgs.open();
                                  }}
                                />
                                <div className="dis_ib va_t ml_15">
                                  <span
                                    className="pointer fc_black3"
                                    onClick={(e) => {
                                      setImgindex(index);
                                      submit(e, 3);
                                      uploadimgs.open();
                                    }}
                                  >
                                    点击更换
                                  </span>
                                  <p className="mt_10 fc_black3">
                                    建议尺寸160px*160px，
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          if (!t.data) {
                            t.data =
                              user.qr &&
                              user.qr !== "undefined" &&
                              user.qr !== undefined
                                ? user.qr
                                : "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/2d91d782-8859-11ea-8b90-00163e04cc20.jpeg";
                          }
                          return (
                            <div
                              className={
                                index !== 0
                                  ? "box bt_1 box-1 mb_10 pt_24"
                                  : "box box-1 mb_10 pt_10"
                              }
                              key={index}
                            >
                              <span
                                className="fc_black2 ta_r"
                                style={{ width: 90 }}
                              >
                                {t.show_name}
                                <span style={{ margin: "0 8px 0 2px" }}>:</span>
                              </span>
                              <div
                                className="ml_15"
                                style={{ position: "relative" }}
                              >
                                <img
                                  src={t.data}
                                  alt="null"
                                  width="140"
                                  height="140"
                                  className="pointer b_1 br_10"
                                  onClick={(e) => {
                                    setImgindex(index);
                                    submit(e, 3);
                                    uploadimgs.open();
                                  }}
                                />
                                <img
                                  style={{
                                    position: "absolute",
                                    top: 40,
                                    left: 40,
                                  }}
                                  src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/4c98dee6-8859-11ea-8b90-00163e04cc20.png"
                                  width="60"
                                  height="60"
                                  className="pointer"
                                  onClick={(e) => {
                                    setImgindex(index);
                                    submit(e, 3);
                                    uploadimgs.open();
                                  }}
                                  alt="null"
                                />
                              </div>
                            </div>
                          );
                        }
                      } else if (t.type === "TEXT") {
                        if (!t.data && t.data !== "") {
                          if (t.source_id === "CAMPUS_ADDRESS") {
                            t.data = campus_obj.address || "";
                          } else if (t.source_id === "CAMPUS_NAME") {
                            t.data = campus_obj.name || "";
                          } else if (t.source_id === "CAMPUS_PHONE") {
                            t.data = campus_obj.showphone || "";
                          }
                        }
                        return (
                          <div
                            className={
                              index !== 0
                                ? "box bt_1 box-1 mb_10 pt_24"
                                : "box box-1 mb_10 pt_10"
                            }
                            key={index}
                          >
                            <Inputs
                              className="box-1 box fc_black5"
                              form={form}
                              label={t.show_name}
                              name={t.name}
                              value={t.data || ""}
                              maxLength={t.frame.char_limit}
                              rows={1}
                              width={240}
                              style={{
                                border: 0,
                                resize: "none",
                              }}
                            />
                          </div>
                        );
                      }
                    }
                  })}
                </div>
                <div className="box box-1 box-ver ta_c mt_15 bt_1 pt_20 pr_24">
                  <div className="box">
                    <Btn
                      className="bg_gray2 box box-1 box-allc fc_black1 noHover"
                      onClick={(e) => {
                        submit(e, 2);
                      }}
                    >
                      保存预览
                    </Btn>
                    <Btn
                      onClick={(e) => {
                        submit(e, 1);
                      }}
                      className="ml_15 box box-1 box-allc"
                    >
                      确认下载
                    </Btn>
                  </div>
                  <div
                    className="box pointer underline fc_gray box-pc pt_5"
                    onClick={async (e) => {
                      submit(e, 4);
                    }}
                  >
                    下载到手机
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    );
  };
  return (
    <div className="bg_white pt_30 mt_15 ph_20 br_2">
      <div className="box box-1" style={{ width: 620, margin: "0 auto" }}>
        <Form
          onSubmit={(values) => {
            if (values.name === "") {
              filter(selectedTags);
              return false;
            }
            let lists = [];
            list.map((v) => {
              if (v.name.indexOf(values.name) !== -1) {
                lists.push(v);
              }
              return v;
            });
            setList(lists);
          }}
        >
          {({ form }) => (
            <div>
              {form.getFieldDecorator(
                "name",
                {}
              )(
                <Input
                  placeholder="免费模板任你下载"
                  name="name"
                  style={{
                    width: 500,
                    height: 44,
                    background: "#F3F0F0",
                    borderRadius: "3px 0px 0px 3px",
                    border: 0,
                  }}
                />
              )}
              <Btn
                htmlType="submit"
                iconfont="sousuo"
                style={{
                  borderRadius: "0px 3px 3px 0px",
                  height: 44,
                  width: 100,
                  fontSize: "20px",
                }}
              ></Btn>
            </div>
          )}
        </Form>
      </div>
      <Postre />
      <Modals ref={(rs) => (feedback = rs)} bodyStyle={{ padding: 0 }}>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          onSubmit={async (values) => {
            await $.post(`/feedback/create`, values);
            feedback.close();
            $.msg("谢谢您，我们已经收到您的反馈！");
          }}
        >
          {({ form }) => (
            <div>
              <Inputs
                required={true}
                name="content"
                form={form}
                label=""
                rows={10}
                placeholder="海报反馈"
                type="textArea"
                style={{ border: 0, resize: "none" }}
                autoSize={false}
              />
              <div className="ta_r pt_20 bt_1 pb_20 pr_15">
                <Btn
                  className="cancelBtn"
                  onClick={() => {
                    feedback.close();
                  }}
                >
                  取消
                </Btn>
                <Btn htmlType="submit" className="ml_15">
                  提交
                </Btn>
              </div>
            </div>
          )}
        </Form>
      </Modals>
      <Modals
        ref={(rs) => (posterDetail = rs)}
        bodyStyle={{ padding: 0 }}
        width={840}
      >
        {(r) => <Content data={r} />}
      </Modals>
      <Modals ref={(rs) => (qrcode = rs)} width={440}>
        {(r) => {
          return (
            <div className="box box-ver pb_20">
              <Img
                width="150"
                height="150"
                src={r.img}
                alt="null"
                className="b_1 br_4"
              />
              <div className="bt_1 mt_20 box box-allc fs_11 fc_gray pv_20">
                请扫描二维码下载到手机
              </div>
            </div>
          );
        }}
      </Modals>
      <Uploadimgs
        multiple={false}
        prefix="upload/image/"
        ref={(e) => (uploadimgs = e)}
        onSure={(d) => {
          let data = { ...detailData };
          data.components[curimgindex].data = d;
          setDetail(data);
        }}
      />
    </div>
  );
}
