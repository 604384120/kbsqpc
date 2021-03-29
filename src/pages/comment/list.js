import React, { useState } from "react";
import { Page, Form, Inputs, Btn, TablePagination, $ } from "../comlibs";
import { Tabs, Divider } from "antd";
import { Course } from "../works";
import ClassDetail from "./class_detail";
import DayDetail from "./day_detail";

const { TabPane } = Tabs;
export default function() {
  let { page_class_detail, page_day_detail } = {};
  let [tab_on, setTab_on] = useState(null);
  let [tab_off, setTab_off] = useState(null);
  let status_txt = {
    published: "已发布",
    unpublish: "待发布",
    ignored: "忽略"
  };
  let status_color = {
    published: "#52C41A",
    unpublish: "#1890FF",
    ignored: "rgba(0,0,0,0.25)"
  };
  let on_columns = [
    {
      title: "班级",
      width: 200,
      dataIndex: "group_name",
    },
    {
      title: "课程",
      dataIndex: "course_name",
    },
    {
      title: "上课时间",
      dataIndex: "lessontime",
      render(rs) {
        return (
          <span>
            {rs.year}-{rs.date} {rs.time}
          </span>
        );
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      render(res) {
        return <div className="dis_f ai_c">
            <span className="dis_ib mr_5" style={{width:6,height:6,backgroundColor:status_color[res],borderRadius:'50%'}}></span>    {status_txt[res]}
        </div>;
      }
    },
    {
      title: "创建者",
      dataIndex: "create_teacher_name",
    },
    {
      title: "最后更新",
      dataIndex: "time_update",
      render(rs) {
        return (
          <span>
            {rs.year}-{rs.origin_date} {rs.time}
          </span>
        );
      }
    },
    {
      title: "操作",
      render(rs) {
        return (
          <div>
            <span
              className="link"
              onClick={() => {
                page_class_detail.open("点评详情", {uuid:rs.uuid});
              }}
            >
              查看
            </span>
            <Divider type="vertical" />
						<span
							className="fc_pink pointer"
							onClick={() => {
								$.confirm("确定要删除该点评吗？", async () => {
									await $.post("/growing/remove", {
										growing_uuid: rs?.uuid,
									});
									tab_on.reload();
									$.msg("删除成功！");
								});
							}}
						>删除</span>
          </div>
        );
      }
    }
  ];
  let off_columns = [
    {
      title: "学员",
      dataIndex: "students",
      width: 250,
      ellipsis: true,
      render(rs) {
        let txt = "";
        let txtList = rs.map(stu => stu.name);
        if (rs.length < 4) {
          txt = txtList.join("、");
        } else {
          txt = txtList.slice(0, 3).join("、");
          txt += `等${txtList.length}名学员`;
        }
        return <span>{txt}</span>;
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      ellipsis: true,
      render(res) {
        return <div className="dis_f ai_c">
            <span className="dis_ib mr_5" style={{width:6,height:6,backgroundColor:status_color[res],borderRadius:'50%'}}></span>    {status_txt[res]}
        </div>;
      }
    },
    {
      title: "创建者",
      ellipsis: true,
      dataIndex: "create_teacher_name"
    },
    {
      title: "最后更新",
      ellipsis: true,
      dataIndex: "time_update",
      render(rs) {
        return (
          <span>
            {rs.year}-{rs.origin_date} {rs.time}
          </span>
        );
      }
    },
    {
      title: "操作",
      ellipsis: true,
      render(rs) {
        return (
          <div>
            <span
              className="link"
              onClick={() => {
                page_day_detail.open("点评详情", rs.uuid);
              }}
            >
              查看
            </span>
            <Divider type="vertical" />
						<span
							className="fc_pink pointer"
							onClick={() => {
								$.confirm("确定要删除该点评吗？", async () => {
									await $.post("/growing/remove", {
										growing_uuid: rs?.uuid,
									});
									tab_off.reload();
									$.msg("删除成功！");
								});
							}}
						>删除</span>
          </div>
        );
      }
    }
  ];

  return (
    <div className="bg_white mt_15 br_2 ph_10">
      <Tabs defaultActiveKey="tab_on">
        <TabPane tab='课后点评' key="tab_on">
          <Form onSubmit={values => tab_on.search(values)}>
            {({ form }) => (
              <div className="mb_15">
                <Inputs
                  className="mr_15"
                  name="status"
                  type="select"
                  placeholder="请选择状态"
                  value=''
                  form={form}
                  select={[
                    {
                      value: "",
                      text: "全部状态"
                    },
                    {
                      value: "published",
                      text: "已发布"
                    },
                    {
                      value: "unpublish",
                      text: "待发布"
                    }
                  ]}
                  autoSubmit={true}
                />
                <Course className="mr_15" form={form} value='' autoSubmit={true}  name="course_uuid" />
                <Inputs
                  placeholder="输入班级名称查询"
                  className="mr_15"
                  form={form}
                  name="group_name"
                />
                <Btn htmlType="submit" iconfont="sousuo">搜索</Btn>
                <a href="/pc#/campus_set">
                  <Btn className="fl_r mr_15">设置</Btn>
                </a>
              </div>
            )}
          </Form>
          <TablePagination
            api="/growing/edited/all"
            params={{ review_type: "CLASS" }}
            columns={on_columns}
            ref={ref => setTab_on(ref)}
          />
        </TabPane>
        <TabPane tab="日常点评" key="tab_off">
          <Form onSubmit={values => tab_off.search(values)}>
            {({ form }) => (
              <div className="mb_15">
                <Inputs
                  className="mr_15"
                  name="status"
                  onChange={val => {
                    tab_off.search({ status: val });
                  }}
                  type="select"
                  placeholder="请选择状态"
                  value=''
                  form={form}
                  select={[
                    {
                      value: "",
                      text: "全部状态"
                    },
                    {
                      value: "published",
                      text: "已发布"
                    },
                    {
                      value: "unpublish",
                      text: "待发布"
                    }
                  ]}
                  autoSubmit={true}
                />
              </div>
            )}
          </Form>
          <TablePagination
            api="/growing/edited/all"
            params={{ review_type: "NORMAL" }}
            columns={off_columns}
            ref={ref => setTab_off(ref)}
          />
        </TabPane>
      </Tabs>

      <Page ref={rs => (page_class_detail = rs)} onClose={() => {}}>
        <ClassDetail />
      </Page>
      <Page ref={rs => (page_day_detail = rs)} onClose={() => {}}>
        <DayDetail />
      </Page>
    </div>
  );
}
