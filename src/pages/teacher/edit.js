import React, { useState, useEffect } from "react";
import { Form as Forms, Skeleton, InputNumber,Checkbox } from "antd";
import {
  $,
  Form,
  Inputs,
  Btn,
  FixedBox,
  Img,
  Modals,
  Uploadimgs,
} from "../comlibs";
import { Cover } from "../works";

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
};

export default function (props) {
  const Iconfont = $.icon();
  let _page = props.Parent;
  let {
    uuid = props.uuid,
    bind,
    disabled,
    setDis,
    phonechange,
    setPhone,
    uploadimgs,
    certificate = [],
    setCer,
  } = {};
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState({});
  let [traits, setTra] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await $.get(`/teacher/detail/${uuid}`);
      setData(res);
      let rs = await $.get("/teacher/trait");
      setTra(
        rs.map((v) => {
          v.label = v.trait_name;
          v.value = v.uuid;
          return v;
        })
      );
      setLoading(false);
    })();
  }, [uuid]);
  $.hover(
    ".sub_albums",
    (t) => t.find(".pst_abs.tranall").removeClass("lucid"),
    (t) => t.find(".pst_abs.tranall").addClass("lucid")
  );
  let Change = ({ form }) => {
    [disabled, setDis] = useState(true);
    [phonechange, setPhone] = useState(data.user.user_phone);
    return (
      <Forms.Item label="登录账号" required={true}>
        <Inputs
          form={form}
          name="phone"
          required={true}
          value={phonechange || "无账号"}
          width={388}
          disabled={disabled}
          placeholder="手机号将作为老师登录开班神器的账号，请准确填写"
          onChange={(e) => {
            setPhone(e);
          }}
        />
        <span
          className={disabled ? "ml_10 link" : "hide"}
          onClick={() => {
            setDis(false);
          }}
        >
          修改账号
        </span>
        <span className={!disabled ? "ml_10" : "hide"}>
          <span
            className="link"
            onClick={async (e) => {
              await $.post(`/teacher/save/${data.teacher_uuid}`, {
                phone: phonechange,
              });
              $.msg("修改成功~");
              setDis(true);
            }}
          >
            保存
          </span>
          <span
            className="link ml_10"
            onClick={() => {
              setDis(true);
            }}
          >
            取消
          </span>
        </span>
      </Forms.Item>
    );
  };

  let Certificates = ({ form, set }) => {
    [certificate, setCer] = useState(data.certificate||[]);
    return (
      <Forms.Item label="证书">
        {set(
          {
            name: "certificate",
            value: certificate.join(","),
          },
          (valueSet) => (
            <div className="mt_10">
              {certificate.length > 0 &&
                certificate.map((r, i) => {
                  return (
                    <div className={`ov_h mr_10  mb_10 dis_ib va_t`} key={i}>
                      <div className={`sub_albums box sub_album_${i} pointer`}>
                        <Img width={200} height={200} className="box" src={r} />
                        <div
                          className="pst_abs t_10 r_10 tranall lucid"
                          onClick={() => {
                            for (let s = 0; s < certificate.length; s++) {
                              if (certificate[s] === r) {
                                certificate.splice(s, 1);
                                setCer(certificate);
                                valueSet(certificate);
                              }
                            }
                          }}
                        >
                          <Iconfont
                            className="fs_20 fc_red"
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
                  className="ta_c b_1"
                  style={{
                    height: 200,
                    width: 200,
                  }}
                >
                  <Iconfont
                    className="fc_info"
                    style={{
                      marginTop: 46,
                      fontSize: 42,
                    }}
                    type="icon-chuangjian"
                  />
                  <div className="fc_info fs_16 mt_15">上传荣誉证书</div>
                </div>
              </div>
              <Uploadimgs
                prefix="upload/image/"
                ref={(e) => (uploadimgs = e)}
                onSure={(d) => {
                  setCer(certificate.concat(d.split(",")));
                  valueSet(certificate.concat(d.split(",")).join(","));
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    );
  };

  return (
    <Skeleton loading={loading ? true : false} paragraph={{ rows: 10 }} active>
       <div className={data.wxuser === "NO"?'topTips mt_15':'hide'}>
        <Iconfont className="fs_20" type="icon-tishi" />
        <span className="ml_10">当前老师还未绑定微信号，请尽快绑定以免错过接收相关的教务教学通知。 </span>
        <a
          href="https://www.yuque.com/zwriad/bz1d16/teaching_notice"
          target="_blank"
          style={{ color: "#388DED", textDecoration: "underline" }}
        >
          邀请老师绑定
        </a>
      </div>
      <div className="mt_15 pt_15 pb_100 bg_white">
        <Form
          {...col}
          action={`/teacher/save/${data.teacher_uuid}`}
          method="POST"
          success={async (res) => {
            _page.setCloseData(true);
            $.msg("数据更新成功~");
          }}
        >
          {({ form, set, setByName, submit }) => (
            <div className="box box-ver">
              <div
                style={{ width: 120, height: 40, lineHeight: "40px" }}
                className="fc_white fs_18 ta_c bg_blue mb_20"
              >
                基本信息
              </div>
              <Forms.Item label="头像">
                {set(
                  {
                    name: "avatar",
                  },
                  (valueSet) => (
                    <Cover
                      url={data.avatar}
                      type="avatar"
                      prefix="teacher/avatar/"
                      onSure={(d) => valueSet(d)}
                    />
                  )
                )}
              </Forms.Item>
              <Inputs
                label="老师姓名"
                form={form}
                name="name"
                required={true}
                width={388}
                value={data.name}
                placeholder="请输入老师姓名"
              />
              <Change form={form} />
              <Inputs
                label="性别"
                name="gender"
                form={form}
                value={data.gender}
                placeholder="请设置性别"
                radios={[
                  {
                    value: "male",
                    text: "男",
                  },
                  {
                    value: "female",
                    text: "女",
                  },
                ]}
              />
              <Forms.Item
                {...col}
                label="权限"
                className={data.user_kind !== "owner" ? "" : "hide"}
              >
                <Inputs
                  name="user_kind"
                  form={form}
                  placeholder="请设置权限"
                  value={data.user_kind}
                  radios={[
                    {
                      value: "teacher",
                      text: "普通老师",
                    },
                    {
                      value: "admin",
                      text: "管理员",
                    },
                  ]}
                />
                {/* <span className="ml_10">
                  <a
                    href="https://www.yuque.com/zwriad/bz1d16/permission"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看权限说明
                  </a>
                </span> */}
              </Forms.Item>
              <Forms.Item
                {...col}
                label="权限"
                className={data.user_kind === "owner" ? "" : "hide"}
              >
                <Inputs
                  name="user_kind"
                  form={form}
                  placeholder="请设置权限"
                  value={data.user_kind}
                  radios={[
                    {
                      value: "owner",
                      text: "校区校长",
                    },
                  ]}
                />
                {/* <span>
                  <a
                    href="https://www.yuque.com/zwriad/bz1d16/permission"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看权限说明
                  </a>
                </span> */}
              </Forms.Item>
              <Inputs
                label="岗位性质"
                name="fulltime"
                form={form}
                value={data.fulltime}
                placeholder="请设置岗位性质"
                radios={[
                  {
                    value: "fulltime",
                    text: "全职",
                  },
                  {
                    value: "partime",
                    text: "兼职",
                  },
                ]}
              />
              <Inputs
                label="出生日期"
                name="birthday"
                type="datePicker"
                form={form}
                value={data.birthday || null}
                width={200}
                onChange={(rs) => {
                  setByName({ birthday: rs });
                }}
                placeholder="请输入出生日期"
              />
              <Inputs
                label="入职日期"
                name="entryday"
                type="datePicker"
                form={form}
                value={data.entryday || null}
                width={200}
                onChange={(rs) => {
                  setByName({ entryday: rs });
                }}
                placeholder="请输入入职日期"
              />
              <Forms.Item label="学员端展示">
                <Inputs
                  name="show"
                  form={form}
                  value={data.show}
                  radios={[
                    {
                      value: "yes",
                      text: "展示",
                    },
                    {
                      value: "no",
                      text: "隐藏",
                    },
                  ]}
                />
                <span
                  className="fc_blue pointer"
                  onClick={() => bind.open("")}
                  style={{ textDecoration: "underline" }}
                >
                  查看学员端展示
                </span>
              </Forms.Item>
              <Inputs
                label="展示排序"
                form={form}
                name="sortby"
                value={data.sortby}
                width={200}
                placeholder="数字越大越靠前"
              />
              <div
                style={{ width: 120, height: 40, lineHeight: "40px" }}
                className="fc_white fs_18 ta_c bg_blue mv_20"
              >
                职业信息
              </div>
              <Forms.Item label="教学特点">
                {set(
                  {
                    name: "trait_uuids",
                    value: data.trait_uuids||"",
                  },
                  (valueSet) => (
                    <Checkbox.Group
                      className="mb_10"
                      options={traits}
                      onChange={(rs) => setByName("trait_uuids", rs.toString())}
                    />
                  )
                )}
              </Forms.Item>
              <Forms.Item label="教龄">
                {set(
                  {
                    name: "teachage",
                    value: parseInt(data.teachage)>0?data.teachage:'',
                  },
                  (valueSet) => (
                    <InputNumber placeholder="请输入" min={1} />
                  )
                )}
                <span className="ml_10">年</span>
              </Forms.Item>
              <Inputs
                label="毕业院校"
                form={form}
                name="finishschool"
                width={388}
                value={data.finishschool}
                placeholder="请输入毕业院校"
              />
              <Inputs
                className="mv_10"
                form={form}
                label="获得荣誉"
                name="honor"
                value={data.honor || ""}
                rows={4}
                width={240}
                placeholder="可填写老师所获得的一些荣誉职称，也可直接上传相关的荣誉证书"
              />
              <Certificates form={form} set={set} />
              <Inputs
                label="详细介绍"
                form={form}
                value={data.memo}
                name="memo"
                type="editor"
              />
              <FixedBox>
                <Btn className="ml_10" onClick={(e) => submit(e)}>
                  保存
                </Btn>
              </FixedBox>
            </div>
          )}
        </Form>
      </div>
      <Modals
        ref={(rs) => (bind = rs)}
        style={{ width: 320, height: 560 }}
        maskClosable={false}
      >
        <img
          alt="学员端展示"
          src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/d3212c10-3049-11ea-ac9b-00163e04cc20.png"
          style={{
            height: 530,
            width: 270,
          }}
        />
      </Modals>
    </Skeleton>
  );
}
