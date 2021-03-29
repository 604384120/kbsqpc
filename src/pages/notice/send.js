import React, { useState } from "react";
import { Btn, $, Form, Inputs, Page, FixedBox, Modals } from "../comlibs";
import { Form as Forms, Switch, Tooltip } from "antd";
import { Page_ChoiceClassStudent } from "../works";
import Selectnotice from "./selectnotice";

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};
export default function (props) {
  const Iconfont = $.icon();
  let {
    selectStudents,
    Parent = props.Parent,
    student = [],
    setStudent,
    page_selectnotice,
    preview,
    $campus = JSON.parse(localStorage.campus_obj),
  } = {};
  let [data, setData] = useState(Parent.data || {});
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
  let Students = () => {
    [student, setStudent] = useState([]);
    return (
      <div className="box box-ver bg_white br_2" style={{ width: 300 }}>
        <div className="box box-ac pv_10 bb_1">
          <div className="box pl_10 box-1 box-ver">
            <div className="fs_15 fc_black">消息接收者</div>
            <div>已选学员（{student.length}）</div>
          </div>
          <div className="box pr_10">
            <Btn
              onClick={() => {
                selectStudents.open(
                  {
                    value: student || [],
                    onSure: (d) => {
                      setStudent(d);
                    },
                  },
                  { left: 200 }
                );
              }}
            >
              选择学员
            </Btn>
          </div>
        </div>
        <div
          className="box box-ver pl_10"
          style={{ overflowY: "auto", height: 700 }}
        >
          {student.map((v, i) => {
            return (
              <div className={i + 1 === student.length ? 'box pr_10 pv_5' : 'box pr_10 pv_5 bb_1'} key={v.student_uuid}>
                <div className="box box-ac box-1">
                  {v.gzh_bind && v.gzh_bind === "YES" ? (
                    <img
                      className="box"
                      src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/a4c6fe6e-c192-11ea-8b94-00163e04cc20.png"
                      style={{ width: 20, height: 16 }}
                    />
                  ) : (
                      <Tooltip title="学员未绑定公众号">
                        <img
                          className="box pointer"
                          src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/9eb1d06c-c192-11ea-8b94-00163e04cc20.png"
                          style={{ width: 20, height: 16 }}
                        />
                      </Tooltip>
                    )}
                  <div className="box ml_5 box-1 fc_black2">
                    {v.name || "未命名"}
                  </div>
                </div>
                <Iconfont
                  className="box fs_26 pointer"
                  type="icon-quxiao"
                  onClick={() => {
                    let list = [...student];
                    list.map((s, i) => {
                      if (v.student_uuid === s.student_uuid) {
                        list.splice(i, 1);
                        setStudent(list);
                      }
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ height: 150 }}></div>
      </div>
    );
  };

  return (
    <div className="mt_20">
      <Form
        {...col}
        onSubmit={(values, btn, t) => {
          if (t) {
            preview.open("通知预览", values);
            btn.loading = false;
            return false;
          }
          if (values.pushType === "settime" && !values.custom_time) {
            $.warning("请设置发送时间！");
            return;
          } else if (student.length === 0) {
            $.warning("请选择学员！");
            return;
          } else if (values.notice_content === "") {
            $.warning("请填写好消息通知内容后再发送！");
            return;
          }
          if (values.pushType === 'now') {
            values.custom_time = ''
          }
          values.confirm = values.confirm || "OFF";
          values.notice_type = data.notice_type;
          values.student_uuids = student
            .map((v) => {
              return v.student_uuid;
            })
            .toString();
          $.confirm(
            `确定发送[ ${values.notice_title} ]吗？发送后消息无法撤回，无法修改!`,
            async () => {
              let r = await $.post(`/notice/custom/send`, values);
              r.confirm = values.confirm
              r.notice_title = values.notice_title
              Parent.close(r);
            }
          );
        }}
      >
        {({ form, setByName, submit }) => (
          <div className="box" style={{ minHeight: 600 }}>
            <Students />
            <div className="box box-ver box-1 ml_15 bg_white pt_10 pb_30">
              <Forms.Item label="标题">
                <Inputs
                  className="dis_ib"
                  form={form}
                  name="notice_title"
                  value={data.notice_title || ""}
                  width={388}
                  placeholder="请输入标题"
                />
                <Btn
                  className="box ml_15 dis_ib mt_3"
                  width={80}
                  onClick={() => {
                    page_selectnotice.open("新建消息通知");
                  }}
                >
                  模板
                </Btn>
              </Forms.Item>
              <Inputs
                label="通知内容"
                form={form}
                value={data.notice_content || ""}
                name="notice_content"
                type="editor"
                className="mt_15"
              />
              <Forms.Item className="mt_10" label="需确认">
                <Switch
                  onChange={(e) => {
                    if (e) {
                      setByName("confirm", "ON");
                    } else {
                      setByName("confirm", "OFF");
                    }
                  }}
                />
              </Forms.Item>
              <Forms.Item label="发送方式">
                <Inputs
                  name="pushType"
                  value="now"
                  form={form}
                  required={true}
                  className="va_tt dis_b"
                  placeholder="请设置发送方式~"
                  radios={[
                    {
                      value: "now",
                      text: [<span>立即发送<span className="fc_err pl_24" >*开启后，收到的消息通知会增加“确认收到”操作</span></span>],
                    },
                    {
                      value: "settime",
                      text: (
                        <span>
                          <span className="mr_10">定时发送</span>
                          <Inputs
                            placeholder="选择时间"
                            showToday={false}
                            type="dateTimePicker"
                            form={form}
                            format="YYYY-MM-DD HH:mm:ss"
                            showtime={{
                              format: "HH:mm:ss",
                              minuteStep: 1,
                            }}
                            name="custom_time"
                          />
                        </span>
                      ),
                    },
                  ]}
                />
              </Forms.Item>
            </div>
            <FixedBox>
              <Btn
                className="cancelBtn mr_10"
                onClick={(e) => submit(e, "通知预览")}
              >
                预览
              </Btn>
              <Btn htmlType="submit" className="ml_10">
                发布
              </Btn>
            </FixedBox>
          </div>
        )}
      </Form>
      <Modals ref={(rs) => (preview = rs)} style={{ width: 375 }}>
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
                      <div className="ta_c fs_16 fc_black5">{$campus.name}</div>
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
            </div>
          );
        }}
      </Modals>
      <Page_ChoiceClassStudent
        ref={(ref) => {
          selectStudents = ref;
        }}
      />
      <Page
        ref={(rs) => (page_selectnotice = rs)}
        onClose={(e) => {
          setData(e);
        }}
      >
        <Selectnotice />
      </Page>

    </div>
  );
}
