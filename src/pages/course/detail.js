import React, { useState, useEffect } from "react";
import { Tag, Tabs, Modal, Menu, Dropdown, Button } from "antd";
import {
  $,
  Page,
  Form,
  Inputs,
  Modals,
  Btn,
  TablePagination,
} from "../comlibs";
import Edit from "./edit";
import Createclass from "../class/createClass";
import Detail from "../class/detail";
import AddClass from "../class/addClass";


export default function (props) {
  const { TabPane } = Tabs;
  const { confirm } = Modal;
  const Parent = props.Parent;
  let _page = Parent;
  let [data, setData] = useState({});
  let {
    uuid = _page.data,
    Page_edit,
    class_page,
    add_page,
    createclass,
    tab = {
      lesson: {},
    },
    curTabKey = "lesson",
  } = {};
  function init() {
    (async () => {
      let res = await $.get(`/course/detail/${uuid}`);
      setData(res);
      _page.setCloseData(true);
    })();
  }
  useEffect(() => {
    init();
  }, [uuid]);
  const classStatus = [
    { text: "全部状态", value: "" },
    { text: "开班中", value: "NO" },
    { text: "已结班", value: "YES" },
  ];
  const classType = [
    { text: "全部类型", value: "" },
    { text: "约课班", value: "appoint" },
    { text: "普通班", value: "normal" },
  ];
  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key",
    },
    {
      title: "班级名称",
      align: "center",
      render: (rs) => (
        <a
          className="link"
          target="_blank"
          onClick={() => rs.join_way === "normal" ?
            class_page.open('班级详情', { uuid: rs.uuid }) :
            window.location.href=`/pc#/class2_detail?type=3&cid=${rs.uuid}`
          }
        >
          {rs.name}
        </a>
      ),
    },
    {
      title: "班主任",
      align: "center",
      dataIndex: "teachers_name",
    },
    {
      title: "班级类型",
      align: "center",
      render: (rs) => {
        return (
          <span>
            <font>{rs.join_way === "appoint" ? "约课班" : ""}</font>
            <font>{rs.join_way === "normal" ? "普通班" : ""}</font>
          </span>
        );
      },
    },
    {
      title: "班级状态",
      align: "center",
      render: (rs) => {
        return (
          <span>
            <font className="fc_green">
              {!rs.is_end || rs.is_end === "NO" ? "开班中" : ""}
            </font>
            <font className="fc_dis">
              {rs.is_end === "YES" ? "已结班" : ""}
            </font>
          </span>
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 140,
      render: (rs) => {
        return (
          <a
            onClick={() => {
              $.confirm(
                "确定删除该班级吗？删除后无法恢复，学员已扣课时将退回。",
                async () => {
                  await $.get(`/banji/remove/${rs.uuid}`);
                  $.msg("删除成功");
                  tab.lesson.reload();
                }
              );
            }}
            style={{ color: "#f07070" }}
          >
            删除
          </a>
        );
      },
    },
  ];
  const menu = (
    <Menu>
      <Menu.Item onClick={() => add_page.open("建班排课", {course_uuid: data.uuid})}>
          普通班
      </Menu.Item>
      <Menu.Item onClick={() => createclass.open("创建班级")}>
          约课班
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="mt_15">
      <div className="box bs mt_15 ph_10 pv_15 bg_white">
        <div className="box box-ver box-pc mr_25" style={{ width: 200 }}>
          <div
            className="bg_spcc"
            style={{
              width: 200,
              height: 120,
              backgroundImage: `url(${
                data.cover && data.cover.length && data.cover[0] !== ""
                  ? data.cover[0]
                  : "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/course.png"
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
          />
        </div>
        <div className="box box-1">
          <div className="box box-1 mb_10">
            <div className="box box-1 box-ver">
              <div className="box box-1">
                <div className="box" style={{ width: 300 }}>
                  <span className="fw_600 fs_18 fc_black1">{data.name}</span>
                </div>
              </div>
              <div className="box box-1 mt_10">
                <div className="box" style={{ width: 300 }}>
                  <span className="fc_gray">单课时长：</span>
                  <span className="fc_black1">{data.duration}</span>
                  <span>分钟/课时</span>
                </div>
                <div className="box box-1">
                  <span className="fc_gary">课程名师：</span>
                  <span className="fc_black1">
                    {data.teachers_name?data.teachers_name.split(",").join("，"):'未设置'}
                  </span>
                </div>
              </div>
              <div className="box box-1 mt_10">
                <div className="box" style={{ width: 300 }}>
                  <span className="fc_gray">展示 | 排序：</span>
                  <span className="fc_black1">
                    {data.course_show === "YES" ? "展示" : "隐藏"}
                  </span>
                  <span style={{ width: 14, textAlign: "center" }}>|</span>
                  <span className="fc_black1">
                    {!data.sortby || data.sortby === ""
                      ? "未设置"
                      : data.sortby}
                  </span>
                </div>
                <div className="box" style={{ minWidth: 150 }}>
                  <span className="fc_gary">适合人群：</span>
                  <span className="fc_black1">{data.crowd||"不限"}</span>
                </div>
                <div className="box box-1 ml_15">
                  <span className="fc_gary">详细介绍：</span>
                  <span className="fc_black1">
                    {!data.memo || data.memo === "" ? "未填写" : "已完善"}
                  </span>
                </div>
              </div>
              <div className="box box-1 mt_10">
                {data.traits &&
                  data.traits.length > 0 &&
                  data.traits.map((i) => {
                    return (
                      <Tag
                        style={{ background: "#F5F5F5", color: "#666" }}
                        className="ph_10 pv_5 fs_14 box box-allc"
                        key={i.trait_uuid}
                      >
                        <font>{i.trait_name}</font>
                      </Tag>
                    );
                  })}
              </div>
            </div>
            <div className="box box-ver" style={{ width: 140 }}>
              <div className="ta_r">
                <Btn
                  className="mr_10"
                  onClick={(data) => Page_edit.open("编辑课程详情")}
                >
                  编辑
                </Btn>
                {data.status === "online" ? (
                  <Btn
                    type="default"
                    onClick={() => {
                      confirm({
                        title: "确定下架课程吗？",
                        content: "下架后课程无法对外展示与线上报名。",
                        async onOk() {
                          await $.get("/course/offline", {
                            course_uuid: uuid,
                          });
                          $.msg("下架成功");
                          init();
                        },
                        async onCancel() {},
                      });
                    }}
                  >
                    下架
                  </Btn>
                ) : (
                  <Btn
                    type="default"
                    onClick={async () => {
                      await $.get("/course/online", {
                        course_uuid: uuid,
                      });
                      $.msg("上架成功");
                      init();
                    }}
                  >
                    上架
                  </Btn>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bs mt_15 ph_10 bg_white">
        <Tabs
          animated={false}
          defaultActiveKey={curTabKey}
          onChange={(key) => curTabKey === key}
        >
          <TabPane tab="开课情况" key="lesson">
            <Form onSubmit={(values) => tab.lesson.search(values)}>
              {({ form }) => (
                <div className="mb_15">
                  <Inputs
                    width={120}
                    className="mr_10"
                    name="join_way"
                    placeholder="班级类型"
                    form={form}
                    select={classType}
                    autoSubmit={true}
                  />
                  <Inputs
                    width={120}
                    className="mr_10"
                    name="is_end"
                    placeholder="班级状态"
                    form={form}
                    select={classStatus}
                    autoSubmit={true}
                  />
                  <Inputs
                    form={form}
                    name="name_query"
                    className="mr_10"
                    placeholder="请输入班级名称"
                  />
                  <Btn htmlType="submit" icon="search">
                    搜索
                  </Btn>
                  {data.status==='online'&&(
                    <div className="fl_r">
                      <Dropdown overlay={menu}>
                        <Button type='primary'>创建班级</Button>
                      </Dropdown>
                    </div>
                  )}
                  
                </div>
              )}
            </Form>
            <TablePagination
              api="/banji/query"
              params={{
                course_uuid: uuid,
                join_way: "",
              }}
              columns={columns}
              ref={(ref) => (tab.lesson = ref)}
            />
          </TabPane>
        </Tabs>
      </div>
      <Modals ref={(rs) => (createclass = rs)} style={{ width: 360 }}>
        <Createclass
          data={{
            coursename: data.name,
            uuid: uuid,
          }}
          success={() => {
            createclass.close();
            tab.lesson.reload();
          }}
        />
      </Modals>
      <Page
        ref={(rs) => (Page_edit = rs)}
        onClose={() => {
          init();
        }}
      >
        <Edit uuid={uuid} />
      </Page>
      <Page
        ref={(ref) => (class_page = ref)}
        onClose={(uuid) => {
          if(uuid&&uuid!==true){
            class_page.open("班级详情", { uuid });
          }
          tab && tab.lesson.reload();
        }}
      >
        <Detail />
      </Page>
      <Page
        ref={(ref) => (add_page = ref)}
        onClose={() => {
          tab && tab.lesson.reload();
        }}
      >
        <AddClass />
      </Page>
    </div>
  );
}
