import React, { useState, useEffect } from "react";
import { Form as Forms } from "antd";
import { $, Form, Inputs, Btn, Img, Uploadimgs } from "../comlibs";

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};

export default function () {
  let user = $.store().GlobalData.user;
  let {
    user_uuid = user.uuid || undefined,
    uploadimgs,
    avatar,
    setAva,
    institution_uuid = localStorage.institution_uuid || undefined,
  } = {};
  let [data, setData] = useState({});
  let [ins, setIns] = useState([]);
  useEffect(() => {
    if (user_uuid !== undefined) {
      (async () => {
        let ins = await $.get(`/user/ins`);
        setIns(ins.institutions);
        init();
      })();
    }
  }, [1]);
  function init() {
    (async () => {
      let d = await $.get(`/user/detail/${user_uuid}`);
      setData(d);
    })();
  }
  $.hover(
    ".sub_albums",
    (t) => t.find(".avatarchange").removeClass("hide"),
    (t) => t.find(".avatarchange").addClass("hide")
  );
  let Avatar = ({ set }) => {
    [avatar, setAva] = useState(data.avatar || "");
    return (
      <Forms.Item label="头像">
        {set(
          {
            name: "avatar",
            value: avatar || "",
          },
          (valueSet) => (
            <div className={`ov_h mr_10  mb_10 dis_ib va_t`}>
              <div className={`sub_albums box sub_album_1 pointer`}>
                <Img
                  width={80}
                  height={80}
                  className="box circle"
                  src={avatar}
                />
                <div
                  className="pst_abs avatarchange tranall hide"
                  onClick={() => {
                    uploadimgs.open();
                  }}
                >
                  修改
                </div>
              </div>
              <Uploadimgs
                multiple={false}
                prefix="upload/image/"
                ref={(e) => (uploadimgs = e)}
                onSure={(d) => {
                  setAva(d);
                  valueSet(d);
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    );
  };
  return (
    <div className="mt_30">
      <div className="pt_15 ph_24 pb_20 br_2 bg_white">
        <div className="box">
          <Form
            className="box"
            {...formItemLayout}
            action={`/user/save/${user_uuid}`}
            method="POST"
            success={async () => {
              init();
              let store = $.store();
              await store.SMT_getUserData();
              $.msg("数据更新成功~");
            }}
          >
            {({ form, set, setByName }) => (
              <div className="box box-ver">
                <Avatar set={set} />
                <Inputs
                  label="账号"
                  form={form}
                  name="phone"
                  width={388}
                  value={data.phone}
                  placeholder="请输入昵称"
                  disabled
                />
                <Inputs
                  label="昵称"
                  form={form}
                  name="nickname"
                  width={388}
                  value={data.nickname}
                  placeholder="请输入昵称"
                />
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
                <Forms.Item
                  wrapperCol={{
                    sm: { span: 1, offset: 4 },
                  }}
                >
                  <Btn
                    className="mt_15"
                    htmlType="submit"
                    style={{ width: 65 }}
                  >
                    确定
                  </Btn>
                </Forms.Item>
              </div>
            )}
          </Form>
          <div className="box box-1"></div>
        </div>
      </div>
      <div className="pt_15 mt_24 br_2 pb_20 ph_24 bg_white">
        <div className="fs_24 fc_black2">所在学校</div>
        <div className="mt_24">
          {ins.length > 0 &&
            ins.map((c, i) => {
              return (
                <div
                  className="dis_ib br_4 mr_24 pv_25 mb_15"
                  style={{
                    width: 220,
                    boxShadow: "0px 0px 19px 0px rgba(220,220,220,0.5)",
                    border: "1px solid rgba(238,238,238,1)",
                  }}
                >
                  <Img
                    src={c.logo}
                    style={{ width: 80, height: 80, backgroundColor: "#fff" }}
                    className="box"
                  />
                  <div
                    className="ph_10 box box-pc fs_16 fc_black2 mt_25"
                    style={{ height: 70 }}
                  >
                    {c.shortname}
                  </div>
                  <div className="box box-allc">
                    <Btn
                      onClick={async () => {
                        localStorage.institution_uuid = c.institution_uuid;
                        let rs = await $.get("/user/ins/campus", {
                          institution_uuid: c.institution_uuid,
                        });
                        localStorage.campus_uuid = rs.campuss[0].campus_uuid;
                        await $.post('/manage/lastcampus',{campus_uuid:rs.campuss[0].campus_uuid});
                        let store = $.store();
                        await store.SMT_getUserData();
                        init();
                        $.msg("学校切换成功");
                      }}
                      style={
                        c.institution_uuid === institution_uuid
                          ? {
                              width: 110,
                              color: "#3FADFF",
                              background: "#fff",
                              border: "1px solid rgba(63,173,255,1)",
                            }
                          : { width: 110 }
                      }
                    >
                      {c.institution_uuid === institution_uuid
                        ? "当前学校"
                        : "切换至该学校"}
                    </Btn>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
