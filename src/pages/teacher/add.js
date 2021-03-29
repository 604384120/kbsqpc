import React, { useState, useEffect } from "react";
import { Form as Forms, Steps, Icon, InputNumber, Checkbox } from "antd";
import {
  $,
  Form,
  Inputs,
  Btn,
  FixedBox,
  Modals,
  Uploadimgs,
  Img,
} from "../comlibs";
import { Cover } from "../works";
const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
};
export default function (props) {
  const Iconfont = $.icon();
  const { Step } = Steps;
  let avatar =
    "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/avatar.png";
  let { bind, Parent = props.Parent, uploadimgs, certificate, setCer } = {};
  let [current, setCurrent] = useState(0);
  let [teacher_uuid, setUuid] = useState("");
  let [traits, setTra] = useState([]);
  useEffect(() => {
    (async () => {
      let rs = await $.get("/teacher/trait");
      setTra(
        rs.map((v) => {
          v.label = v.trait_name;
          v.value = v.uuid;
          return v;
        })
      );
    })();
  }, [1]);
  $.hover(
    ".sub_albums",
    (t) => t.find(".pst_abs.tranall").removeClass("lucid"),
    (t) => t.find(".pst_abs.tranall").addClass("lucid")
  );
  let Certificates = ({ form, set }) => {
    [certificate, setCer] = useState([]);
    return (
      <Forms.Item label="证书">
        {set(
          {
            name: "certificate",
            value: "",
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
  const steps = [
    {
      title: "基本信息",
      content: (
        <div className="mt_30">
          <Form
            {...col}
            onSubmit={async (values) => {
              let teacherData = await $.post("/teacher/create", values);
              setUuid(teacherData.teacher_uuid);
              setCurrent(1);
              Parent.setCloseData(true);
            }}
          >
            {({ form, set }) => (
              <div className="box box-ver mt_30">
                <Forms.Item label="头像">
                  {set(
                    {
                      name: "avatar",
                    },
                    (valueSet) => (
                      <Cover
                        url={avatar}
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
                  placeholder="请输入老师姓名"
                />
                <Inputs
                  label="登录账号"
                  form={form}
                  name="phone"
                  required={true}
                  width={388}
                  placeholder="手机号将作为老师登录开班神器的账号，请准确填写"
                />
                <Inputs
                  label="性别"
                  name="gender"
                  form={form}
                  placeholder="请设置性别"
                  value="male"
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
                <Forms.Item {...col} label="权限">
                  <Inputs
                    name="user_kind"
                    form={form}
                    placeholder="请设置权限"
                    value="teacher"
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
                  {/* <span className="pL_15">
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
                  value="fulltime"
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
                  width={200}
                  placeholder="请输入出生日期"
                />
                <Inputs
                  label="入职日期"
                  name="entryday"
                  type="datePicker"
                  form={form}
                  width={200}
                  placeholder="请输入入职日期"
                />
                {/* <Forms.Item label="学员端展示">
                  <Inputs
                    name="show"
                    form={form}
                    value="yes"
                    radios={[
                      {
                        value: "yes",
                        text: "展示"
                      },
                      {
                        value: "no",
                        text: "隐藏"
                      }
                    ]}
                  />
                  <span
                    className="fc_blue pointer"
                    style={{ textDecoration: "underline" }}
                    onClick={() => bind.open("")}
                  >
                    查看学员端展示
                  </span>
                </Forms.Item>
                <Forms.Item label="展示排序">
                  {set(
                    {
                      name: "sortby"
                    },
                    valueSet => (
                      <InputNumber
                        placeholder="数字越大越靠前"
                        style={{ width: 200 }}
                        min={1}
                      />
                    )
                  )}
                </Forms.Item> */}
                <FixedBox>
                  <Btn className="ml_10" htmlType="submit">
                    下一步
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "职业信息",
      content: (
        <div>
          <Form
            {...col}
            onSubmit={async (values) => {
              let data = await $.post(`/teacher/save/${teacher_uuid}`, values);
              setCurrent(2);
              return data;
            }}
          >
            {({ form, set, setByName }) => (
              <div className="box box-ver mt_30">
                <Forms.Item label="教学特点">
                  {set(
                    {
                      name: "trait_uuids",
                      value: "",
                    },
                    (valueSet) => (
                      <Checkbox.Group
                        className="mb_10"
                        options={traits}
                        onChange={(rs) =>
                          setByName("trait_uuids", rs.toString())
                        }
                      />
                    )
                  )}
                </Forms.Item>
                <Forms.Item label="教龄">
                  {set(
                    {
                      name: "teachage",
                    },
                    (valueSet) => (
                      <InputNumber
                        placeholder="请输入教龄"
                        style={{ width: 200 }}
                        min={1}
                      />
                    )
                  )}
                  <span className="ml_10">年</span>
                </Forms.Item>
                <Inputs
                  label="毕业院校"
                  form={form}
                  name="finishschool"
                  value=""
                  width={388}
                  placeholder="请输入毕业院校"
                />
                <Inputs
                  className="mv_10"
                  form={form}
                  label="获得荣誉"
                  name="honor"
                  rows={4}
                  width={240}
                  value=""
                  placeholder="可填写老师所获得的一些荣誉职称，也可直接上传相关的荣誉证书"
                />
                <Certificates form={form} set={set} />
                <Inputs
                  label="详细介绍"
                  form={form}
                  value=""
                  name="memo"
                  type="editor"
                />
                <FixedBox>
                  <Btn
                    style={{ background: "#ccc" }}
                    onClick={() => setCurrent(2)}
                  >
                    跳 过
                  </Btn>
                  <Btn className="ml_10" htmlType="submit">
                    下一步
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "完成",
      content: (
        <div className="box box-ver">
          <div className="box box-allc">
            <Icon
              className="fc_suc"
              type="check-circle"
              theme="filled"
              style={{
                fontSize: 60,
                margin: "120px 0 30px 0",
              }}
            />
          </div>
          <div className="box box-allc fc_black mb_15 fs_20 fw_600">
            教师添加成功！
          </div>
          <div className="box box-allc mb_15 fc_gray">
            您可以邀请老师绑定微信，接收相关教学教务通知。
          </div>
          <div className="ta_c mt_30">
            <Btn type="default" onClick={() => Parent.close(true)}>
              返回列表
            </Btn>
            <Btn className="default ml_10" onClick={() => setCurrent(0)}>
              继续添加
            </Btn>
            <a
              style={{ color: "#fff" }}
              href="https://www.yuque.com/zwriad/bz1d16/teaching_notice"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Btn className="ml_10">邀请老师绑定</Btn>
            </a>
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
    </div>
  );
}
