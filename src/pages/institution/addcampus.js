import React, { useState } from "react";
import { Form as Forms, Steps, Icon, Input, Tooltip } from "antd";
import {
  $,
  Form,
  Inputs,
  Btn,
  FixedBox,
  Uploadimgs,
  Uploadvideo,
  Img,
} from "../comlibs";
import { Cascaders } from "../works";
import { Page_ChoiceAdmin } from "../works";

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
};
export default function (props) {
  const Iconfont = $.icon();
  const { Step } = Steps;
  let {
    Parent = props.Parent,
    data = Parent.props.datas,
    uploadimgs,
    uploadvideo,
    cover,
    setCover,
    video = {},
    setVideo,
    owner,
    setOwner,
    choiceAdmin,
    adminType,
    setType,
  } = {};
  let [current, setCurrent] = useState(0);
  let [campus, setCampus] = useState("");
  $.hover(
    ".sub_albums",
    (t) => t.find(".pst_abs.tranall").removeClass("lucid"),
    (t) => t.find(".pst_abs.tranall").addClass("lucid")
  );
  let Covers = ({ set }) => {
    [cover, setCover] = useState([]);
    return (
      <Forms.Item label="">
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
                        <Img width={260} height={146} className="box" src={r} />
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
                    width: 260,
                    height: 146,
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
                  <div className="box fc_gray3 fs_14">??????????????????</div>
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
  let Videos = ({ set }) => {
    [video, setVideo] = useState({});
    return (
      <Forms.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
        {set(
          {
            name: "video",
            value: "",
          },
          (valueSet) => (
            <div className="mt_10">
              {video.cover ? (
                <div className="box mr_10">
                  <div className="box pointer">
                    <Img
                      width={260}
                      height={146}
                      className="box"
                      src={video.cover || ""}
                    />
                  </div>
                  <div className="box" style={{ paddingTop: 110 }}>
                    <Btn
                      className="ml_15"
                      type="danger"
                      onClick={() => {
                        setVideo({});
                        valueSet("");
                      }}
                    >
                      ????????????
                    </Btn>
                    <Btn
                      className={video.isOk ? "hide" : "ml_15"}
                      onClick={async () => {
                        video.isOk = await $.videoTransStatus(video.url);
                        setVideo(video);
                      }}
                    >
                      ??????????????????
                    </Btn>
                  </div>
                </div>
              ) : (
                <div
                  className="pointer mb_10 dis_ib va_t"
                  onClick={() => uploadvideo.open()}
                >
                  <div
                    className="box box-ver box-allc"
                    style={{
                      width: 260,
                      height: 146,
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
                    <div className="box fc_gray3 fs_14">??????????????????</div>
                  </div>
                </div>
              )}
              <Uploadvideo
                ref={(e) => (uploadvideo = e)}
                multiple={false}
                onSure={async (rs) => {
                  let isOk = await $.videoTransStatus(rs[0].url);
                  rs[0].isOk = isOk;
                  setVideo(rs[0]);
                  valueSet(rs[0].url);
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    );
  };
  let Selectadmin = ({ form }) => {
    [adminType, setType] = useState("select");
    [owner, setOwner] = useState({ add: {}, select: {} });
    return (
      <Forms.Item label="????????????" className="mb_10" required={true}>
        <Inputs
          name="admins"
          form={form}
          placeholder="?????????"
          value={adminType}
          required={true}
          radios={[
            {
              value: "select",
              text: "??????????????????",
            },
            {
              value: "add",
              text: "??????",
            },
          ]}
          onChange={(e) => {
            setType(e);
          }}
        />
        {adminType === "select" ? (
          <div
            style={{ width: 700 }}
            onClick={() => {
              choiceAdmin.open({
                max: 1,
                onSure: (d) => {
                  let s = d[0];
                  let owners = { ...owner };
                  owners.select = {
                    owner_name: s.name || s.user.nickname,
                    owner_phone: s.phone || s.user.phone,
                  };
                  setOwner(owners);
                },
                institution_uuid: data.uuid,
              });
            }}
          >
            <Tooltip title="??????????????????">
              <Forms.Item
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                label="??????"
                className="mb_10"
                required
              >
                <Input
                  name="owner_name"
                  value={
                    !owner.select.owner_name
                      ? "??????????????????"
                      : owner.select.owner_name
                  }
                  disabled
                  style={{ cursor: "pointer", width: 388 }}
                />
              </Forms.Item>
              <Forms.Item
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                label="?????????"
                className="mb_10"
                required
              >
                <Input
                  name="owner_phone"
                  value={
                    !owner.select.owner_phone
                      ? "??????????????????"
                      : owner.select.owner_phone
                  }
                  disabled
                  style={{ cursor: "pointer", width: 388 }}
                />
              </Forms.Item>
            </Tooltip>
          </div>
        ) : (
          <div style={{ width: 700 }}>
            <Inputs
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
              form={form}
              label="??????"
              name="owner_name"
              width={388}
              placeholder="???????????????"
              value={owner.add.owner_name || ""}
              onChange={(e) => {
                owner.add.owner_name = e;
              }}
              required
            />
            <Inputs
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
              name="owner_phone"
              label="?????????"
              form={form}
              width={388}
              placeholder="??????????????????"
              value={owner.add.owner_phone || ""}
              onChange={(e) => {
                owner.add.owner_phone = e;
              }}
              required
            />
          </div>
        )}
      </Forms.Item>
    );
  };
  const steps = [
    {
      title: "????????????",
      content: (
        <div className="mt_30">
          <Form
            {...col}
            onSubmit={async (values,btn) => {
              btn.loading = true;
              let text = "";
              values.owner_name = owner[adminType].owner_name;
              values.owner_phone = owner[adminType].owner_phone;
              if (!values.owner_name) {
                $.warning("????????????????????????");
                btn.loading = false;
                return false;
              } else if (!values.zonecode[2]) {
                $.warning("????????????????????????");
                btn.loading = false;
                return false;
              }
              text = `${values.owner_name}(${values.owner_phone})`;
              values.institution_uuid = data.uuid;
              values.zonecode = values.zonecode[2];
              btn.loading = false;
              let campusData = await $.post("/ins/campus/create", values);
              campusData.campus.admin_name = text;
              await $.store().SMT_getUserData();
              setCampus(campusData.campus);
              setCurrent(1);
              Parent.setCloseData(true);
            }}
          >
            {({ form, set,submit }) => (
              <div className="box box-ver mt_30">
                <div className="pb_20">
                  <Inputs
                    label="????????????"
                    className="mb_15"
                    form={form}
                    name="name"
                    width={388}
                    value={data.shortname}
                    disabled
                  />
                  <Inputs
                    label="?????????"
                    className="mb_15"
                    form={form}
                    name="campus_name"
                    required={true}
                    width={388}
                    placeholder="?????????????????????/??????"
                  />
                  <Forms.Item
                    label="????????????"
                    className="mb_15"
                    required={true}
                  >
                    <Cascaders
                      style={{
                        width: 250,
                        borderBottom: "none",
                        borderRaduis: "4px 4px 0 0",
                      }}
                      rows={4}
                      form={form}
                      name="zonecode"
                      type="citychoice"
                      placeholder="????????????/???/???"
                      required
                    />
                    <div className="dis_ib">
                      {form.getFieldDecorator("address", {
                        initialValue: "",
                        rules: [{ required: true, message: "" }],
                      })(
                        <Inputs
                          name="address"
                          style={{ width: 500, borderRaduis: "0 0 4px 4px" }}
                          form={form}
                          placeholder="???????????????"
                          required
                        />
                      )}
                    </div>
                  </Forms.Item>
                  <Forms.Item {...col} label="????????????" className="mb_15">
                    <Inputs
                      form={form}
                      name="lnglat"
                      width={388}
                      placeholder="????????????????????????????????????"
                    />
                    <span className="pl_15">
                      <a
                        href="https://lbs.amap.com/console/show/picker"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ???????????????????????????
                      </a>
                    </span>
                  </Forms.Item>
                  <Inputs
                    className="mb_15"
                    label="????????????"
                    form={form}
                    name="showphone"
                    width={388}
                    placeholder="?????????"
                    required
                  />
                  <Inputs
                    className="mb_15"
                    name="promotion"
                    form={form}
                    label="????????????"
                    rows={5}
                    placeholder="?????????????????????"
                    type="textArea"
                  />
                </div>
                <div className="pv_20 bt_1">
                  <Inputs
                    label="??????"
                    name="belong_type"
                    form={form}
                    placeholder="?????????"
                    value="SUB"
                    required={true}
                    radios={[
                      {
                        value: "SUB",
                        text: "??????",
                      },
                      {
                        value: "JOIN",
                        text: "??????",
                      },
                    ]}
                  />
                  <Selectadmin className="mb_15" form={form} />
                  <Inputs
                    className="mb_15"
                    name="summary"
                    form={form}
                    label="??????"
                    rows={5}
                    placeholder="???????????????"
                    type="textArea"
                  />
                </div>
                <div style={{ height: 200 }}></div>
                <FixedBox>
                  <Btn className="ml_10" onClick={(e)=>{
                    submit(e);
                  }}>
                    ?????????
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "????????????",
      content: (
        <div>
          <Form
            onSubmit={async (values) => {
              values.institution_uuid = data.uuid;
              values.campus_uuid = campus.uuid;
              await $.post(`/ins/campus/update`, values);
              setCurrent(2);
            }}
          >
            {({ form, set }) => (
              <div className="box box-ver mt_30">
                <div className="pl_10 pb_20">
                  <div className="box">
                    <div className="box pl_10 fc_black fs_16 fb">??????</div>
                    <div className="box ml_15 fs_13 fc-gray">
                      ????????????????????????1???????????????60s???????????????????????????????????????????????????????????????????????????400-766-1816
                    </div>
                  </div>
                  <Videos set={set} />
                </div>
                <div className="pl_10 bt_1 pt_20">
                  <div className="box">
                    <div className="box pl_10 fc_black fs_16 fb">????????????</div>
                    <div className="box ml_15 fs_13 fc-gray">
                      ?????? ?????????????????? 750x422
                    </div>
                  </div>
                  <Covers set={set} />
                </div>
                <FixedBox>
                  <Btn
                    style={{ background: "#ccc" }}
                    onClick={() => setCurrent(2)}
                  >
                    ??? ???
                  </Btn>
                  <Btn className="ml_10" htmlType="submit">
                    ?????????
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "????????????",
      content: (
        <div>
          <Form
            {...col}
            onSubmit={async (values) => {
              values.institution_uuid = data.uuid;
              values.campus_uuid = campus.uuid;
              await $.post(`/ins/campus/update`, values);
              setCurrent(3);
            }}
          >
            {({ form }) => (
              <div className="box box-ver">
                <div className="box box-ac mv_15">
                  <Iconfont className="fs_18" type="icon-tishi" />
                  <span className="ml_10 fc_yellow">
                    ???????????????????????????????????????????????????????????????????????????????????????????????????
                  </span>
                </div>
                <Inputs
                  label=""
                  form={form}
                  value=""
                  name="memo"
                  type="editor"
                />
                <FixedBox>
                  <Btn
                    style={{ background: "#ccc" }}
                    onClick={() => setCurrent(3)}
                  >
                    ??? ???
                  </Btn>
                  <Btn className="ml_10" htmlType="submit">
                    ?????????
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "??????",
      content: (
        <div className="box box-ver">
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
            ??????????????????
          </div>
          <div
            className="box pv_20 box-ver box-ac mb_15 fc_gray br_2 bg_gray3 m_auto"
            style={{ width: 550 }}
          >
            <div className="box box-1" style={{ width: "100%" }}>
              <div className="box box-pe fc_black2" style={{ width: "37%" }}>
                ?????????
              </div>
              <div className="box box-1 fc_black5">
                {campus.institution_shortname}
              </div>
            </div>
            <div className="box box-1 mv_15" style={{ width: "100%" }}>
              <div className="box box-pe fc_black2" style={{ width: "37%" }}>
                ?????????
              </div>
              <div className="box box-1 fc_black5">{campus.name}</div>
            </div>
            <div className="box box-1 mb_15" style={{ width: "100%" }}>
              <div className="box box-pe fc_black2" style={{ width: "37%" }}>
                ???????????????
              </div>
              <div className="box box-1 fc_black5">{campus.admin_name}</div>
            </div>
            <div className="box box-1 fc_err ta_c" style={{ width: "70%" }}>
              ??????????????????????????????????????????????????????????????????????????????400-766-1816?????????
            </div>
          </div>
          <div className="ta_c mt_24">
            <Btn className="mr_15" style={{ width: 100 }} onClick={() => Parent.close(true)}>
              ??????
            </Btn>
            {/* <a target="_blank" href="https://www.sxzapi.cn/page/74713dbd-2b6f-11e8-b7b9-00163e04cc20.html?menu=xcx">
              <Btn type="default" style={{ width: 100 }}>
                ???????????????
              </Btn>
            </a> */}
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="bg_white ph_10 mt_15" style={{ minHeight: 800 }}>
      <Steps type="navigation" current={current} className="bb_i1">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <Page_ChoiceAdmin
        configs={{ left: 150 }}
        ref={(ref) => (choiceAdmin = ref)}
      />
    </div>
  );
}
