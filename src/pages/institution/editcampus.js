import React, { useState, useEffect } from "react";
import { Form as Forms, Tabs, Input, Tooltip } from "antd";
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
  labelCol: { span: 2 },
  wrapperCol: { span: 19 },
};
export default function (props) {
  const Iconfont = $.icon();
  const { TabPane } = Tabs;
  let { uuid, shortname } = props.Parent.data;
  let {
    user = $.store().GlobalData.user,
    Parent = props.Parent,
    $curCampus = JSON.parse(localStorage.campus_obj) || {},
    tab = {
      basic: {},
      style: {},
      memos: {},
    },
    curTabKey = "basic",
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
  let [data, setDatd] = useState({});
  useEffect(() => {
    (async () => {
      let d = await $.get(`/campus/detail/${uuid}`);
      setDatd(d);
    })();
  }, [1]);

  $.hover(
    ".sub_albums",
    (t) => t.find(".pst_abs.tranall").removeClass("lucid"),
    (t) => t.find(".pst_abs.tranall").addClass("lucid")
  );
  let Covers = ({ set }) => {
    if (data.cover)
      if (
        data.cover.indexOf(
          "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/coverdefault.jpg"
        ) > -1
      ) {
        data.cover.splice(0, 1);
      }
    [cover, setCover] = useState(data.cover || []);
    return (
      <Forms.Item label="">
        {set(
          {
            name: "cover",
            value: data.cover,
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
  let Videos = ({ set }) => {
    [video, setVideo] = useState(data.video || "");
    return (
      <Forms.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
        {set(
          {
            name: "video",
            value: video,
          },
          (valueSet) => (
            <div className="mt_10">
              {video && video !== "" ? (
                <div className="box mr_10">
                  <div className="box pointer">
                    <video
                      width={260}
                      height={146}
                      src={video}
                      autoPlay={false}
                      controls
                    />
                  </div>
                  <div className="box" style={{ paddingTop: 110 }}>
                    <Btn
                      className="ml_15"
                      type="danger"
                      onClick={() => {
                        setVideo("");
                        valueSet("");
                      }}
                    >
                      删除视频
                    </Btn>
                    <Btn
                      className="ml_15"
                      onClick={async () => {
                        let isOk = await $.videoTransStatus(video);
                        if (isOk) {
                          $.msg("视频转码完成!");
                        } else {
                          $.warning("视频还在转码中!");
                        }
                      }}
                    >
                      查询转码状态
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
                    <div className="box fc_gray3 fs_14">点击上传视频</div>
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
    [owner, setOwner] = useState({
      add: {},
      select: {
        owner_name: (data.owner_teaher && data.owner_teaher.name) || "",
        owner_phone: (data.owner_teaher && data.owner_teaher.phone) || "",
      },
    });
    return (
      <Forms.Item label="校区校长" className="mb_10" required={true}>
        <Inputs
          name="admins"
          form={form}
          placeholder="请设置"
          value={adminType}
          required={true}
          radios={[
            {
              value: "select",
              text: "选择已有人员",
            },
            {
              value: "add",
              text: "新增",
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
                type: "edit",
                institution_uuid: data.institution_uuid,
              });
            }}
          >
            <Tooltip title="点击可重新选择">
              <Forms.Item
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                label="姓名"
                className="mb_10"
                required
              >
                <Input
                  name="owner_name"
                  value={
                    !owner.select.owner_name
                      ? "点击进行选择"
                      : owner.select.owner_name
                  }
                  disabled
                  style={{ cursor: "pointer", width: 388 }}
                />
              </Forms.Item>
              <Forms.Item
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                label="手机号"
                className="mb_10"
                required
              >
                <Input
                  name="owner_phone"
                  value={
                    !owner.select.owner_phone
                      ? "点击进行选择"
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
              label="姓名"
              name="owner_name"
              width={388}
              placeholder="请填写姓名"
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
              label="手机号"
              form={form}
              width={388}
              placeholder="请填写手机号"
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
  return (
    <div className="bg_white mt_15 ph_16">
      <Tabs
        animated={false}
        defaultActiveKey={curTabKey}
        onChange={(key) => curTabKey === key}
      >
        <TabPane tab="基本信息" key="basic">
          <Form
            {...col}
            onSubmit={async (values) => {
              if ($curCampus.ins_user_kind) {
                values.owner_name = owner[adminType].owner_name;
                values.owner_phone = owner[adminType].owner_phone;
                if (!values.owner_name) {
                  $.warning("请设置校区校长！");
                  return false;
                } else if (values.owner_name !== data.owner_teaher.name) {
                  // 更换校长
                  await $.post("/ins/campus/change/admin", {
                    institution_uuid: data.institution_uuid,
                    campus_uuid: data.uuid,
                    owner_name: values.owner_name,
                    owner_phone: values.owner_phone,
                  });
                }
              }
              delete values.admin_uuid;
              values.institution_uuid = data.institution_uuid;
              values.campus_uuid = data.uuid;
              values.zonecode = values.zonecode[2] || "";
              if (values.zonecode === "") {
                $.warning("请选择省市区!");
                return false;
              }
              values.uuid = user.uuid;
              await $.post(`/ins/campus/update`, values);
              $.msg("保存成功!");
              await $.store().SMT_getUserData();
              Parent.setCloseData(true);
            }}
          >
            {({ form, set }) => (
              <div className="box box-ver">
                <div className="pb_20">
                  <Inputs
                    className="mb_15"
                    label="学校名称"
                    form={form}
                    name="name"
                    width={388}
                    value={shortname}
                    disabled
                  />
                  <Inputs
                    className="mb_15"
                    label="校区名"
                    form={form}
                    name="name"
                    value={data.name}
                    required={true}
                    width={388}
                    placeholder="例如：西湖校区/总部"
                  />
                  <Forms.Item
                    label="校区地址"
                    className="mb_15"
                    required={true}
                  >
                    <Cascaders
                      style={{
                        width: 250,
                        borderBottom: "none",
                        borderRaduis: "4px 4px 0 0",
                      }}
                      value={data.zonecode}
                      rows={4}
                      form={form}
                      name="zonecode"
                      type="citychoice"
                      placeholder="请选择省/市/区"
                      required
                    />
                    <div className="dis_ib">
                      {form.getFieldDecorator("address", {
                        initialValue: data.address || "",
                        rules: [{ required: true, message: "请输入地址" }],
                      })(
                        <Inputs
                          name="address"
                          style={{ width: 500, borderRaduis: "0 0 4px 4px" }}
                          form={form}
                          placeholder="请输入地址"
                          required
                        />
                      )}
                    </div>
                  </Forms.Item>
                  <Forms.Item {...col} className="mb_15" label="导航坐标">
                    <Inputs
                      form={form}
                      name="lnglat"
                      width={388}
                      value={data.location && data.location.toString()}
                      placeholder="将获取的坐标粘贴到该区域"
                    />
                    <span className="pl_15">
                      <a
                        href="https://lbs.amap.com/console/show/picker"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        点击后去经纬度坐标
                      </a>
                    </span>
                  </Forms.Item>
                  <Inputs
                    className="mb_15"
                    label="门店电话"
                    form={form}
                    name="showphone"
                    value={data.showphone}
                    width={388}
                    placeholder="请填写"
                    required={true}
                  />
                  <Inputs
                    name="promotion"
                    className="mb_15"
                    form={form}
                    value={data.promotion && data.promotion[0].content}
                    label="门店公告"
                    rows={5}
                    placeholder="请填写门店公告"
                    type="textArea"
                  />
                </div>
                {$curCampus.ins_user_kind ? (
                  <div className="pv_20 bt_1 mb_15">
                    <Inputs
                      label="类型"
                      name="belong_type"
                      form={form}
                      placeholder="请设置"
                      value={data.belong_type || "SUB"}
                      required={true}
                      radios={[
                        {
                          value: "SUB",
                          text: "直营",
                        },
                        {
                          value: "JOIN",
                          text: "加盟",
                        },
                      ]}
                    />
                    <Selectadmin form={form} className="mb_5" />
                    <Inputs
                      className="mb_15"
                      name="summary"
                      value={data.summary}
                      form={form}
                      label="备注"
                      rows={5}
                      placeholder="请填写备注"
                      type="textArea"
                    />
                  </div>
                ) : (
                  ""
                )}
                <FixedBox>
                  <Btn className="ml_10" htmlType="submit">
                    保存
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </TabPane>
        <TabPane tab="校区风采" key="style">
          <Form
            onSubmit={async (values) => {
              values.institution_uuid = data.institution_uuid;
              values.uuid = user.uuid;
              values.campus_uuid = data.uuid;
              await $.post(`/ins/campus/update`, values);
              $.msg("保存成功!");
            }}
          >
            {({ form, set }) => (
              <div className="box box-ver pb_30">
                <div className="pl_10 pb_20">
                  <div className="box">
                    <div className="box pl_10 fc_black fs_16 fb">视频</div>
                    <div className="box ml_15 fs_13 fc-gray">
                      注：视频只能上传1个，仅支持60s，上传视频在【享学小程序】内展示，详情可致电客服：400-766-1816
                    </div>
                  </div>
                  <Videos set={set} />
                </div>
                <div className="pl_10 bt_1 pt_20">
                  <div className="box">
                    <div className="box pl_10 fc_black fs_16 fb">宣传图片</div>
                    <div className="box ml_15 fs_13 fc-gray">
                      注： 建议上传尺寸 750x422
                    </div>
                  </div>
                  <Covers set={set} />
                </div>
                <FixedBox>
                  <Btn className="ml_10" htmlType="submit">
                    保存
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </TabPane>
        <TabPane tab="详细介绍" key="memos">
          <Form
            {...col}
            onSubmit={async (values) => {
              values.institution_uuid = data.institution_uuid;
              values.campus_uuid = data.uuid;
              values.uuid = user.uuid;
              await $.post(`/ins/campus/update`, values);
              $.msg("保存成功!");
            }}
          >
            {({ form }) => (
              <div className="box box-ver pb_30">
                <div className="box box-ac mb_10">
                  <Iconfont className="fs_18" type="icon-tishi" />
                  <span className="ml_10 fc_yellow">
                    以图文方式展示机构的环境，师资队伍，课堂情况更能反映出机构的实力。
                  </span>
                </div>
                <Inputs
                  label=""
                  form={form}
                  value={data.memo}
                  name="memo"
                  type="editor"
                />
                <FixedBox>
                  <Btn className="ml_10" htmlType="submit">
                    保存
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </TabPane>
      </Tabs>
      <Page_ChoiceAdmin
        configs={{ left: 150 }}
        ref={(ref) => (choiceAdmin = ref)}
      />
    </div>
  );
}
