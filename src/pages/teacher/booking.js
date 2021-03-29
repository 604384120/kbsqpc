import React, { useState } from "react";
import { Divider } from "antd";
import { Page, Form, Inputs, TablePagination } from "../comlibs";
import { Page_ChoiceStudent } from "../works";
import CardBtn, { deliver } from "../card/cardBtn";
import Carddetail from "../card/detail";
import Stucarddetail from "../card/detailstu";
import Cardrecord from "../card/record";

export default function(props) {
  let [
    uuid,
    classStudent,
    lessoncard = "card",
    setcardStatus,
    tab,
    Page_carddetail,
    Page_stucarddetail,
    Page_cardrecord
  ] = [props.uuid, []];
  let choiceStudent = {};

  let AppointCourse = () => {
    [lessoncard, setcardStatus] = useState("card");
    let getApi = "/teacher/lessoncard/list";
    let getData = {
      teacher_uuid: uuid
    };
    let columns_lesson = [
      {
        title: "序号",
        align: "center",
        dataIndex: "_key"
      },
      {
        title: "课卡名称",
        align: "center",
        dataIndex: "name"
      },
      {
        title: "可用课程",
        align: "center",
        dataIndex: "courses_name"
      },
      {
        title: "可预约老师",
        align: "center",
        dataIndex: "teachers_name"
      },
      {
        title: "价格",
        align: "center",
        render: rs => <span>{rs.price ? "￥" + rs.price : "-"}</span>
      },
      {
        title: "状态",
        align: "center",
        render: rs => <span>{rs.status === "enabled" ? "正常" : "已废弃"}</span>
      },
      {
        title: "操作",
        align: "center",
        render: rs => (
          <span className={rs.status === "disabled"?'hide':''}>
            <span
              className="fc_blue pointer hover"
              onClick={() => Page_carddetail.open("编辑课卡", rs.uuid)}
            >
              编辑
            </span>
            <Divider type="vertical" />
            <span
              className="pointer hover fc_blue"
              onClick={() => {
                choiceStudent.open({
                  value: classStudent,
                  onSure: d => {
                    deliver(rs.uuid,d.map(v => {
                          return v.student_uuid;
                        }).toString()
                    );
                  }
                });
              }}
            >
              发放
            </span>
            <Divider type="vertical" />
            <CardBtn
              type="disable"
              cardname={rs.name}
              carduuid={rs.uuid}
              success={() => {
                tab.reload();
              }}
            />
          </span>
        )
      }
    ];
    if (lessoncard === "cardstudent") {
      getApi = "/teacher/lessonstudent/list";
      getData.status = "";
      columns_lesson = [
        {
          title: "序号",
          align: "center",
          dataIndex: "_key"
        },
        {
          title: "学员",
          align: "center",
          dataIndex: "student_name"
        },
        {
          title: "课卡名称",
          align: "center",
          dataIndex: "car_name"
        },
        {
          title: "价格",
          align: "center",
          render: rs => <span>{rs.price ? "￥" + rs.price : "-"}</span>
        },
        {
          title: "状态",
          align: "center",
          render: rs => (
            <span>{rs.status === "normal" ? "正常" : "已收回"}</span>
          )
        },
        {
          title: "操作",
          align: "center",
          width:230,
          render: rs => (
            <div>
              <span
                className="fc_blue pointer hover"
                onClick={r => Page_cardrecord.open("课卡使用记录", rs.uuid)}
              >
                使用记录
              </span>
              <Divider type="vertical" />
              {rs.status === "recover" ? (
                <span>
                  <a disabled={true}>编辑</a>
                  <Divider type="vertical" />
                  <CardBtn
                    type="restore"
                    student_name={rs.student_name}
                    studentcard_uuid={rs.uuid}
                    success={() => tab.reload()}
                  />
                </span>
              ) : (
                <span>
                  <span
                    className="fc_blue pointer hover"
                    onClick={r =>
                      Page_stucarddetail.open("编辑学员下课卡", rs.uuid)
                    }
                  >
                    编辑
                  </span>
                  <Divider type="vertical" />
                  <CardBtn
                    type="recover"
                    student_name={rs.student_name}
                    studentcard_uuid={rs.uuid}
                    success={() => tab.reload()}
                  />
                </span>
              )}
              <Divider type="vertical" />
              <CardBtn
                type="del"
                student_name={rs.student_name}
                studentcard_uuid={rs.uuid}
                success={() => tab.reload()}
              />
            </div>
          )
        }
      ];
    }
    return (
      <TablePagination
        api={getApi}
        columns={columns_lesson}
        params={getData}
        ref={ref => (tab = ref)}
        success={()=>{
        }}
      />
    );
  };

  return (
    <div>
      <Form>
        {({ form }) => (
          <div className="mb_10">
            <Inputs
              name="lessoncard"
              form={form}
              value={lessoncard}
              radios={[
                {
                  value: "card",
                  text: "售卖中"
                },
                {
                  value: "cardstudent",
                  text: "预约的学员"
                }
              ]}
              onChange={e => {
                setcardStatus(e);
              }}
            />
          </div>
        )}
      </Form>
      <AppointCourse />
      <Page_ChoiceStudent ref={ref => (choiceStudent = ref)} />
      <Page ref={rs => (Page_carddetail = rs)} onClose={() => tab.reload()}>
        <Carddetail />
      </Page>
      <Page ref={rs => (Page_stucarddetail = rs)} onClose={() => tab.reload()}>
        <Stucarddetail />
      </Page>
      <Page ref={rs => (Page_cardrecord = rs)}>
        <Cardrecord />
      </Page>
    </div>
  );
}
