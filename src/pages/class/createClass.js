import React from "react";
import { Form as Forms } from "antd";
import { $, Form, Inputs, Btn } from "../comlibs";

export default function (props) {
  let { data, success } = props;

  return (
    <div className="">
      <Form
        onSubmit={async (values) => {
          let obj = {
            default_lessons: 1,
            arrived_consume: "YES",
            absent_consume: "NO",
            leave_consume: "NO",
          };
          obj.name = values.name;
          obj.course_uuid = data.uuid;
          obj.join_way = values.join_way;
          let r = await $.post("/banji/create", obj);
          $.msg("创建成功");
          success && success();
          let links = "/pc#/class2_detail?cid=" + r.uuid;
          if (values.join_way === "appoint") {
            links = "/pc#/class2_detail?type=3&cid=" + r.uuid;
          }
          window.open(links, "_blank");
        }}
      >
        {({ form }) => (
          <div>
            <Forms.Item
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="班级名称"
              required={true}
            >
              <Inputs form={form} name="name" value="" required={true} />
            </Forms.Item>
            <Forms.Item
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="班级类型"
              required={true}
            >
              <Inputs
                name="join_way"
                form={form}
                value="appoint"
                radios={[
                  // {
                  //   value: "normal",
                  //   text: "普通班",
                  // },
                  {
                    value: "appoint",
                    text: "约课班",
                  },
                ]}
              />
            </Forms.Item>
            <Forms.Item
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="课程名称"
            >
              <Inputs
                form={form}
                name="coursename"
                value={data.coursename}
                type="text"
                disabled
              />
            </Forms.Item>
            <div className="ta_c mt_15">
              <Btn htmlType="submit" width={100}>
                确认
              </Btn>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
