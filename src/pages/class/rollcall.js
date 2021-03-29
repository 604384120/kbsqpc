import React, { useState } from "react";
import { Form as Forms, Icon } from "antd";
import { Method, Form, Inputs, Btn } from "../comlibs";
const col = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};
export default function(props) {
  const $ = new Method();
  let { data, success } = props;
  let { lesson_uuid, student_uuids, hide, lesson_rules } = data;
  let [default_lessons, setDefault] = [];

  let CallLesson = ({ form }) => {
    [default_lessons, setDefault] = useState(lesson_rules.default_lessons);
    return (
      <div>
        <span
          className="pointer"
          onClick={() => {
            if (default_lessons === 0) {
              $.warning("课时数不能小于0!");
              return false;
            }
            setDefault(default_lessons - 0.5);
          }}
          style={{
            background: "#3FADFF",
            borderRadius: 4,
            height: 32,
            lineHeight: "32px",
            width: 32,
            display: "inline-block",
            textAlign: "center"
          }}
        >
          <Icon type="minus" style={{ fontSize: 15, color: "#fff" }} />
        </span>
        <Inputs
          name="frozenlessons"
          form={form}
          value={default_lessons}
          className="mh_5"
          style={{ textAlign: "center", width: 60 }}
        />
        <span
          className="pointer"
          onClick={() => setDefault(default_lessons + 0.5)}
          style={{
            background: "#3FADFF",
            borderRadius: 4,
            height: 32,
            lineHeight: "32px",
            width: 32,
            display: "inline-block",
            textAlign: "center"
          }}
        >
          <Icon type="plus" style={{ fontSize: 15, color: "#fff" }} />
        </span>
      </div>
    );
  };

  return (
    <div className="">
      <Form
        action={`/lesson/${lesson_uuid}/rollcall`}
        params={{
          student_uuids: student_uuids
        }}
        method="POST"
        success={async res => success && success()}
      >
        {({ form, submit }) => (
          <div className="box box-1 box-ver">
            <Forms.Item {...col} label="状态" className={hide ? "hide" : ""}>
              <Inputs
                name="status"
                form={form}
                value="normal"
                radios={[
                  {
                    value: "normal",
                    text: "到课"
                  },
                  {
                    value: "leave",
                    text: "请假"
                  },
                  {
                    value: "absent",
                    text: "缺课"
                  }
                ]}
                onChange={rs => {
                  if (
                    (rs === "normal" &&
                      lesson_rules.arrived_consume === "YES") ||
                    (rs === "leave" && lesson_rules.leave_consume === "YES") ||
                    (rs === "absent" && lesson_rules.absent_consume === "YES")
                  ) {
                    setDefault(lesson_rules.default_lessons);
                  } else {
                    setDefault(0);
                  }
                }}
              />
            </Forms.Item>
            <Forms.Item {...col} label="扣课时数">
              <CallLesson form={form} />
            </Forms.Item>
            <div className="box box-1 box-pc">
              <Btn
                style={{ width: 80 }}
                onClick={e => {
                  if (e.frozenlessons === "") {
                    $.warning("课时数据错误！");
                    return false;
                  }
                  submit(e);
                }}
              >
                确定
              </Btn>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
