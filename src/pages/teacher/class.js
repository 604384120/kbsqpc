import React, { useState } from "react";
import { Divider } from "antd";
import { Method, Form, Inputs, TablePagination } from "../comlibs";

export default function(props) {
  const $ = new Method();
  let [uuid, tab] = [props.uuid];
  let [groupend, setGroupend] = useState("NO");
  let columns_banji = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key"
    },
    {
      title: "班级名称",
      align: "center",
      dataIndex: "name"
    },
    {
      title: "班级类型",
      align: "center",
      render: rs => (
        <span className={rs.join_way === "appoint" ? "fc_gold" : "fc_green"}>
          {rs.join_way === "appoint" ? "约课班" : "普通班"}
        </span>
      )
    },
    {
      title: "班主任",
      align: "center",
      dataIndex: "teachers_name"
    }
  ];
  if (groupend === "NO") {
    columns_banji.push({
      title: "操作",
      align: "center",
      render: rs => (
        <div>
          <a
            onClick={() => {
              let teacherLength = rs.teachers.length;
              $.confirm(
                teacherLength > 1
                  ? "取消班主任后，请确保已通知授课老师上课的调整。"
                  : "班级至少需要保留一个班主任",
                async () => {
                  if (teacherLength > 1) {
                    let res = await $.get("/teacher/group/remove", {
                      teacher_uuid: uuid,
                      group_uuid: rs.uuid
                    });
                    $.msg("取消班主任成功！");
                    tab.reload();
                    return res;
                  }
                }
              );
            }}
          >
            取消班主任
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              $.confirm(
                `请确认已经给该班级下所有的课节进行了结课操作！`,
                async () => {
                  let res = await $.post("/banji/end", {
                    group_uuid: rs.uuid
                  });
                  $.msg("结班成功！");
                  tab.reload();
                  return res;
                }
              );
            }}
          >
            结班
          </a>
        </div>
      )
    });
  }
  return (
    <div>
      <span className="fc_golds mb_10">
        管理班级指当前该老师在班级中担任班主任角色的班级
      </span>
      <Form>
        {({ form }) => (
          <div className="mb_10">
            <Inputs
              name="is_end"
              form={form}
              value={groupend}
              radios={[
                {
                  value: "NO",
                  text: "上课中"
                },
                {
                  value: "YES",
                  text: "已结班"
                }
              ]}
              onChange={res => {
                tab.search({
                  is_end: res
                });
                setGroupend(res);
              }}
            />
          </div>
        )}
      </Form>
      <TablePagination
        {...props}
        api="/teacher/banji/list"
        columns={columns_banji}
        params={{
          is_end: "NO",
          teacher_uuid: uuid
        }}
        ref={ref => (tab = ref)}
      />
    </div>
  );
}
