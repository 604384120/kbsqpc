import React, { useState } from "react";
import { Divider, Form as Forms } from "antd";
import { $, Form, Inputs, Modals, Btn, TablePagination } from "../comlibs";

export default function (props) {
  let [
    uuid,
    tab,
    add,
    disabled,
    setDis,
    phonechange,
    setPhone,
    $curCampus = JSON.parse(localStorage.campus_obj) || {},
  ] = [props.uuid];
  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key",
    },
    {
      title: "姓名",
      render(rs) {
        return (
          <span
            className="link"
            onClick={() => {
              if (
                $curCampus.ins_user_kind &&
                $curCampus.ins_user_kind === "OWNER"
              ) {
                rs.nickname = rs.user.nickname;
                rs.phone = rs.user.phone;
                rs.gender = rs.user.gender;
                add.open("修改负责人", rs);
              }
            }}
          >
            {rs.user.nickname}
          </span>
        );
      },
    },
    {
      title: "角色",
      render: (rs) => (
        <span className={rs.user_kind === "ADMIN" ? "fc_gold" : "fc_green"}>
          {rs.user_kind === "ADMIN" ? "总管理员" : "总校长"}
        </span>
      ),
    },
    {
      title: "负责人电话",
      dataIndex: "user.phone",
    },
  ];
  if ($curCampus.ins_user_kind && $curCampus.ins_user_kind === "OWNER") {
    columns.push({
      title: "操作",
      align: "center",
      render(rs) {
        return (
          <div>
            <span>
              <span
                className="pointer link"
                onClick={() => {
                  rs.nickname = rs.user.nickname;
                  rs.phone = rs.user.phone;
                  rs.gender = rs.user.gender;
                  add.open("修改负责人", rs);
                }}
              >
                修改
              </span>
              <Divider type="vertical" />
              <span
                className={
                  rs.user_kind === "OWNER" ? "fc_gray" : "fc_err pointer"
                }
                onClick={() => {
                  if (rs.user_kind === "OWNER") {
                    return false;
                  }
                  $.confirm(`确定删除该负责人吗？`, async () => {
                    await $.post("/ins/release/admin", {
                      user_uuid: rs.user_uuid,
                      institution_uuid: uuid,
                    });
                    $.msg("删除成功！");
                    tab.reload();
                  });
                }}
              >
                删除
              </span>
            </span>
          </div>
        );
      },
    });
  }
  let Change = ({ form, phone, user_uuid }) => {
    [disabled, setDis] = useState(true);
    [phonechange, setPhone] = useState(phone);
    return (
      <div>
        <Forms.Item label="登录账号">
          <Inputs
            form={form}
            name="phone"
            required={true}
            value={phonechange}
            width={260}
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
              onClick={async () => {
                await $.post(`/ins/change/role`, {
                  phone: phonechange,
                  ori_user_uuid: user_uuid,
                  institution_uuid: uuid,
                });
                setPhone(phonechange);
                $.msg("修改成功~");
                tab.reload();
                setDis(true);
              }}
            >
              保存
            </span>
            <span
              className="link ml_10"
              onClick={() => {
                setPhone(phone);
                setDis(true);
              }}
            >
              取消
            </span>
          </span>
        </Forms.Item>
        <div
          className={!disabled ? "fs_10 mt_10" : "hide"}
          style={{ paddingLeft: 110 }}
        >
          修改负责人账号不会影响负责人在校区中的账号
        </div>
      </div>
    );
  };
  return (
    <div>
      {$curCampus.ins_user_kind ? (
        <Btn
          className="mb_16"
          onClick={() => {
            add.open("新增负责人", {});
          }}
        >
          新增负责人
        </Btn>
      ) : (
        ""
      )}
      <TablePagination
        className="minH"
        api="/ins/admin/page"
        columns={columns}
        params={{
          institution_uuid: uuid,
        }}
        ref={(ref) => (tab = ref)}
      />
      <Modals ref={(rs) => (add = rs)}>
        {({ nickname, phone, gender, user_kind, user_uuid }) => (
          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
            onSubmit={async (values) => {
              values.institution_uuid = uuid;
              if (user_uuid) {
                values.user_uuid = user_uuid;
                await $.post(`/ins/update/admin`, values);
                add.close();
                tab.reload();
                $.msg("更新成功!");
              } else {
                await $.post("/ins/add/admin", values);
                add.close();
                tab.reload();
                $.msg("创建成功!");
              }
            }}
          >
            {({ form }) => (
              <div>
                <Inputs
                  label="姓名"
                  form={form}
                  name="nickname"
                  value={nickname || ""}
                  required={true}
                  width={260}
                />
                {user_uuid ? (
                  <Change form={form} user_uuid={user_uuid} phone={phone} />
                ) : (
                  <Inputs
                    label="登录账号"
                    form={form}
                    name="phone"
                    value={phone || ""}
                    width={260}
                    required={true}
                    placeholder="手机号将作为老师的登录账号"
                  />
                )}
                <Inputs
                  label="性别"
                  name="gender"
                  form={form}
                  value={gender || "male"}
                  placeholder="请选择"
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
                {user_uuid ? (
                  <Inputs
                    label="角色"
                    name="user_kind"
                    form={form}
                    value={user_kind}
                    placeholder="请设置"
                    radios={[
                      {
                        value: user_kind,
                        text: user_kind === "ADMIN" ? "总管理员" : "总校长",
                      },
                    ]}
                  />
                ) : (
                  <Inputs
                    label="角色"
                    name="user_kind"
                    form={form}
                    value="ADMIN"
                    placeholder="请设置"
                    radios={[
                      {
                        value: "ADMIN",
                        text: "总管理员",
                      },
                    ]}
                  />
                )}
                <div className="ta_r mt_15 bt_1 pt_20">
                  <Btn
                    className="cancelBtn"
                    onClick={() => {
                      add.close();
                    }}
                  >
                    取消
                  </Btn>
                  <Btn htmlType="submit" className="ml_15" />
                </div>
              </div>
            )}
          </Form>
        )}
      </Modals>
    </div>
  );
}
