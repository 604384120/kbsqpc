import React, { useState, useEffect } from "react";
import { Empty, List, Pagination, TreeSelect } from "antd";
import {
  $,
  Page,
  Form,
  Inputs,
  Modals,
  Btn,
  TablePagination,
} from "../comlibs";
import { Teacher } from "../works";
import Detail from "./detail";
import Add from "./add";
import $$ from "jquery";

export default function () {
  const Iconfont = $.icon();
  let {
    tab,
    page_detail,
    Page_add,
    tmpl_modal,
    video_modal,
    status = 1,
    coursetmpl,
    current,
    setCur,
    setTmpl,
    courseTemp,
    setCourse,
    expr = "",
    cate = "",
    cate_value,
    setValue,
  } = {};
  let [category, setCate] = useState([]);
  let [list, setList] = useState([]);
  useEffect(() => {
    (async () => {
      let rs = await $.get("/category");
      rs.map((v) => {
        v.title = v.name;
        v.value = v.cat1;
        v.children = v.sub || [];
        v.children.map((s) => {
          s.title = s.name2;
          s.value = v.cat1 + s.cat2;
        });
      });
      courselist();
      setCate(rs);
    })();
  }, [1]);
  async function courselist() {
    let s = await $.get("/course/list", { limit: 1 });
    setList(s);
  }
  const statusList = [
    { text: "上架中课程", value: "online" },
    { text: "已下架课程", value: "offline" },
    { text: "全部课程", value: "" },
  ];
  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key",
    },
    {
      title: "课程名称",
      render: (rs) => (
        <span
          className="link"
          onClick={() => page_detail.open("课程管理\\" + rs.name, rs.uuid)}
        >
          {rs.name}
        </span>
      ),
    },
    {
      title: "课程名师",
      dataIndex: "teachers_name",
    },
    {
      title: "开课情况",
      render: (rs) => {
        return (
          <span>
            普通班级：{rs.cnt_normal_groups || 0}/约课班级：
            {rs.cnt_appoint_groups || 0}
          </span>
        );
      },
    },
    {
      title: "操作",
      width: 140,
      render: (rs) => {
        return rs.status === "online" ? (
          <a
            onClick={() => {
              $.confirm(
                "确定下架课程吗？下架后课程无法对外展示与线上报名。",
                async () => {
                  await $.get("/course/offline", {
                    course_uuid: rs.uuid,
                  });
                  $.msg("下架成功");
                  tab.search();
                }
              );
            }}
            style={{ color: "#f07070" }}
          >
            下架
          </a>
        ) : (
          <a
            onClick={async () => {
              await $.get("/course/online", {
                course_uuid: rs.uuid,
              });
              $.msg("上架成功");
              tab.reload();
            }}
          >
            上架
          </a>
        );
      },
    },
  ];
  function getlist(page) {
    (async () => {
      let obj = {
        page: page || 1,
        limit: 10,
        totalnum: "YES",
      };
      if (cate !== "") {
        obj.category = cate;
      }
      if (expr !== "") {
        obj.expr = expr;
      }
      let res = await $.get("/coursetmpl/list", obj);
      setTmpl(res);
    })();
  }
  let Search = () => {
    [cate_value, setValue] = useState(undefined);
    return (
      <Form
        className="box box-ac mb_10"
        onSubmit={(values) => {
          expr = values.expr;
          getlist();
        }}
      >
        {({ form }) => (
          <div className="">
            <TreeSelect
              form={form}
              style={{ width: 180 }}
              value={cate_value}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={category}
              placeholder="选择模板类目"
              treeDefaultExpandAll
              allowClear
              onChange={(e) => {
                setValue(e);
                cate = e;
                getlist();
              }}
            />
            <Inputs
              form={form}
              name="expr"
              value={expr}
              className="ml_10 mr_10"
              placeholder="请输入模板名称"
            />
            <Btn htmlType="submit" icon="search">
              搜索
            </Btn>
          </div>
        )}
      </Form>
    );
  };
  let Contents = () => {
    [coursetmpl, setTmpl] = useState({ totalnum: 0, data: [] });
    [current, setCur] = useState(1);
    [courseTemp, setCourse] = useState(undefined);
    useEffect(() => {
      getlist(1);
    }, [status]);
    return (
      <div className="box box-ver">
        <div className="box">
          <div className="box box-1 box-ver">
            <Search />
            <div className="box fs_13 fc_yellow">
              点击课程模版，在右侧预览区可进行该模版信息预览，使用模版创建好相关课程后，进入该课程详情页后还可进行二次编辑
            </div>
            <div
              className={
                coursetmpl.data && coursetmpl.data.length > 0
                  ? "box"
                  : "box box-ac"
              }
              style={{ height: 360 }}
            >
              <List
                className="box box-ver box-1 ov_h"
                dataSource={coursetmpl.data || []}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      width: "132px",
                      float: "left",
                      borderBottom: 0,
                      padding: 0,
                    }}
                    className="box box-ver mv_10 mh_5 bg_gray ov_h tranall courseTemp pointer"
                    onClick={(e) => {
                      $$(".courseTemp").removeClass("active");
                      $$(e.target).closest(".courseTemp").addClass("active");
                      setCourse(item);
                    }}
                  >
                    <div
                      className="info_cover bg_spcc"
                      style={{
                        width: "100%",
                        height: "124px",
                        backgroundImage: `url(${item.cover[0]})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                      }}
                    />
                    <p
                      className="box ta_c pv_5 ellipsis"
                      style={{ width: 120, marginBottom: 0 }}
                    >
                      {item.name}
                    </p>
                  </List.Item>
                )}
              />
            </div>
            <div className="box">
              <Pagination
                current={current}
                total={coursetmpl.totalnum}
                onChange={(page) => {
                  setCur(page);
                  getlist(page);
                }}
                showTotal={(total) => `共${total} 条`}
              />
            </div>
          </div>
          <div
            className="b_1 ml_5"
            style={{
              width: 320,
              height: 450,
            }}
          >
            {courseTemp === undefined ? (
              <div
                style={{ lineHeight: "350px", width: "100%" }}
                className="ta_c"
              >
                点击左侧课程模版可进行预览哦
              </div>
            ) : (
              <iframe
                style={{ width: "100%", height: "100%" }}
                src={
                  $.loc.origin +
                  `/h5#/home_coursedetail?cid=${
                    courseTemp.uuid
                  }&id=${$.campus_uuid()}&type=courseTempPre`
                }
                scrolling="auto"
                frameBorder="0"
              />
            )}
          </div>
        </div>
        <div className="box box-pc mt_15 bt_1 pt_24">
          <Btn
            onClick={(e) => {
              $.confirm(
                `确定要使用课程模版 [${courseTemp.name}] 来创建课程吗`,
                async () => {
                  let rs = await $.post(`/course/copy/${courseTemp.uuid}`);
                  await $.post("/course/openshow", {
                    course_uuid: rs.course_uuid,
                  });
                  $.msg("课程创建成功！");
                  tmpl_modal.close();
                  if (list.length) {
                    tab.reload();
                  } else {
                    courselist();
                  }
                }
              );
            }}
          >
            确定创建
          </Btn>
        </div>
      </div>
    );
  };
  return (
    <div className="mt_15">
      <div className="topTips">
        <Iconfont className="fs_20" type="icon-tishi" />
        <span className="ml_10">
          可通过模板快速添加课程，在课程下可创建相应班级
        </span>
        <a
          className="ml_15"
          onClick={() => {
            video_modal.open(
              "视频教程",
              "https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/3addcourse.Ogg"
            );
          }}
          style={{ color: "#388DED", textDecoration: "underline" }}
        >
          查看视频教程
        </a>
      </div>
      <div className="bs mt_15 ph_10 bg_white minH">
        <div className="pt_20">
          <Form onSubmit={(values) => tab.search(values)}>
            {({ form }) => (
              <div className="mb_15">
                <Inputs
                  width={120}
                  className="mr_10"
                  name="status"
                  placeholder="课程状态"
                  form={form}
                  select={statusList}
                  autoSubmit={true}
                  value="online"
                />
                <Teacher
                  form={form}
                  className="mr_15"
                  name="teacher_uuid"
                  style={{ width: 200 }}
                  autoSubmit={true}
                />
                <Inputs
                  form={form}
                  name="name"
                  className="mr_10"
                  placeholder="请输入课程名称"
                />
                <Btn htmlType="submit" icon="search">
                  搜索
                </Btn>
                <div className={list.length ? "fl_r" : "hide"}>
                  <Btn onClick={() => Page_add.open("创建课程", {})}>
                    创建课程
                  </Btn>
                  <Btn
                    className="ml_10"
                    onClick={() => tmpl_modal.open("通过模板添加", {})}
                  >
                    通过模板添加
                  </Btn>
                </div>
              </div>
            )}
          </Form>
          {list.length ? (
            <TablePagination
              api="/course/list"
              params={{ status: "online" }}
              columns={columns}
              ref={(ref) => (tab = ref)}
            />
          ) : (
            <div className="mt_100">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    课程是学校对外开展招生，对内进行排班排课管理，串联起招生、开班、排课、预约上课的重要内容。
                  </span>
                }
              >
                <Btn onClick={() => Page_add.open("创建课程", {})}>
                  创建课程
                </Btn>
                <Btn
                  className="ml_10"
                  onClick={() => tmpl_modal.open("通过模板添加", {})}
                >
                  通过模板添加
                </Btn>
              </Empty>
            </div>
          )}
        </div>
      </div>
      <Modals
        ref={(rs) => (tmpl_modal = rs)}
        style={{ width: 1080, maxHeight: 600 }}
        bodyStyle={{ padding: 20 }}
      >
        <Contents />
      </Modals>
      <Page
        ref={(rs) => (page_detail = rs)}
        onClose={() => {
          tab.reload();
        }}
      >
        <Detail />
      </Page>
      <Page
        ref={(rs) => (Page_add = rs)}
        onClose={() => {
          tab.reload();
        }}
      >
        <Add />
      </Page>
      <Modals
        ref={(rs) => (video_modal = rs)}
        style={{ width: 1000, height: 650 }}
        bodyStyle={{ padding: 0 }}
      >
        {(r) => (
          <video ref="videoObj" src={r} autoPlay controls className="w_full" />
        )}
      </Modals>
    </div>
  );
}
