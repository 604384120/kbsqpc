import React, { useState, useEffect } from "react";
import { Tag, Divider, Dropdown, Menu, Empty } from "antd";
import { Inputs, Form, Btn, Method, Page, Modals } from "../comlibs";
import { Poster } from "../works";
import Resume from "./resume";
import Edit from "./editResume";

export default function() {
  let $ = new Method();
  let {
    page_resume,
    page_edit,
    list,
    setList,
    modal_add,
    count,
    setCount,
    search,
    setSearch,
    orList,
    setOrList,
    poster
  } = {};
  const Iconfont = $.icon();
  let date = { month: "月", day: "日", hour: "小时" };
  useEffect(() => {
    init();
    (async () => {
      let res = await $.get("/jobs/list");
      let res2=await $.get("/jobdesc/list")
      setList(res);
      setOrList(res2.map((rs)=>{
        rs.job_description=rs.description
        delete rs.description
        return rs
      }));
    })();
  }, []);
  async function init() {
    let res2 = await $.get("/resume/count");
    setCount(res2.status ? res2.data : res2);
  }
  async function bindStatus(index, job_uuid, status) {
    await $.get("/jobs/stop", { job_uuid, status });
    list[index].status = status;
    setList([].concat(list));
  }
  async function getList(val = {}) {
    let res = await $.get("/jobs/list", val);
    setList([]);
    setList(res);
  }
  // 未查看简历数
  function NoReadBox() {
    [count, setCount] = useState(0);
    if (count) {
      return (
        <div
          className="pointer h_40 lh_40 ph_18 w_full ta_c"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.15)" }}
        >
          <div
            className="dis_ib circle"
            style={{
              width: 6,
              height: 6,
              backgroundColor: "#E91717",
              marginRight: 8
            }}
          ></div>
          <span
            className="underline"
            onClick={() => {
              page_resume.open("查看简历", { read_status: "NO" ,placeholder:"新简历"});
            }}
            style={{
              color: "rgba(0,0,0,0.45)",
              textDecorationColor: "rgba(0,0,0,0.45)"
            }}
          >
            您有{count}份新简历未查看
          </span>
        </div>
      );
    } else {
      return "";
    }
  }

  // 可伸缩字段
  function OpenBox(props) {
    let [show, setShow] = useState(false);
    let [box, setBox] = useState({});
    return (
      <div className="box ov_h" style={{ height: show ? "auto" : "21px" }}>
        <div style={{ whiteSpace: "nowrap" }}>{props.title}：</div>
        <div
          className="mr_5"
          style={{ width: "80%", height: "fit-content" }}
          ref={ref => {
            setBox(ref);
          }}
        >
          {props.children}
        </div>
        
        {!show && box.clientHeight > 21 && (
          <span
            className="fc_gray pointer"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => {
              setShow(true);
            }}
          >
            更多{" "}
            <span
              className="dis_ib"
              style={{
                width: 7,
                height: 7,
                borderLeft: "1px solid #666666",
                borderBottom: "1px solid #666666",
                transform: "rotate(-45deg)",
                marginBottom: 3
              }}
            ></span>
          </span>
        )}
      </div>
    );
  }
  // 职位列表
  function JobList() {
    [list, setList] = useState([]);
    if(list.length===0){
      return (
        <div className="ta_c">
          <img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/42113448-6e71-11ea-aca2-00163e04cc20.png" style={{width:600,padding:'50px 0'}} title="" alt="null"/>
        </div>
      )
    }
    return (
      <div>
        {list &&
          list.map((job, index) => (
            <div className="b_1 mb_24 pst_rel" key={job.uuid}>
              {job.status === "ON" ? (
                <Iconfont
                  type="icon-zhaopinzhong"
                  className="pst_abs"
                  style={{ right: 0, top: 0, fontSize: 48 }}
                />
              ) : (
                <img
                  className="pst_abs"
                  style={{ right: 35, bottom: 61,width:106,height:106 }}
                  src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b9bf1f96-6b65-11ea-aca2-00163e04cc20.png"
                  alt="图片无法显示"
                />
              )}

              <div className="pall_24 box">
                <div className="box-1" style={{ width: "70%" }}>
                  <div className="mb_6">
                    <span className="fb fs_16 fc_black2 mr_8">
                      {job.job_name}
                    </span>
                    {job.job_nature === "fulltime" && (
                      <Tag
                        className="fs_11 mr_8"
                        color="#FFF7ED"
                        style={{ color: "#FE9F2E" }}
                      >
                        全职
                      </Tag>
                    )}
                    {job.job_nature === "parttime" && (
                      <Tag
                        className="fs_11 mr_8"
                        color="#EDF9FF"
                        style={{ color: "#2EC3FE" }}
                      >
                        兼职
                      </Tag>
                    )}
                    {job.job_nature === "internship" && (
                      
                      <Tag
                        className="fs_11 mr_8"
                        color="#FFEDEF"
                        style={{ color: "#FE2E32" }}
                      >
                        实习
                      </Tag>
                    )}
                    <div
                      className="br_3 fc_blue dis_ib mr_8 fs_11 pointer"
                      style={{
                        border: "1px solid #3FADFF",
                        padding: "1px 8px",
                        color: "#3FADFF"
                      }}
                      onClick={async () => {
                        job.job_uuid = job.uuid;
                        job.salary = `${job.salary_min}-${job.salary_max}/${date[job.date_tag]}`;
                        job.wxgzhqrcode = "YES";
                        let {
                          uuid,
                          job_name,
                          salary,
                          experience,
                          education,
                          wxgzhqrcode
                        } = job;
                        if(experience==='不限')experience='不限经验'
                        if(education==='不限')education='不限学历'
                        let address=job.z_addr.name2?job.z_addr.name2:job.z_addr.name1
                        poster.open("海报分享", {
                          api: "/poster/teacher",
                          params: {
                            token:$.token(),
                            campus_uuid:$.campus_uuid(),
                            job_url: $.loc.origin + "/h5#/teacher_jobdetail?jid=" +uuid ,
                            job_name,
                            salary,
                            address,
                            experience,
                            education,
                            wxgzhqrcode
                          }
                        });
                      }}
                    >
                      <Iconfont type="icon-fenxiang" className="mr_6" />
                      分享
                    </div>
                  </div>
                  <div className="pv_6" style={{ color: "#676767" }}>
                    {job.z_addr.name2?job.z_addr.name2:job.z_addr.name1}{job.z_addr.zonename}
                    <Divider type="vertical" />
                    {job.salary_min}-{job.salary_max}/{date[job.date_tag]}
                    <Divider type="vertical" />
                    {job.education==='不限'?'不限学历':job.education}
                    <Divider type="vertical" />
                    {job.experience==='不限'?'不限经验':job.experience}
                  </div>
                  <div className="pv_6" style={{ color: "#B9B9B9" }}>
                    {job.advantages}
                  </div>
                  <div className="pv_6" style={{ color: "rgba(0,0,0,0.45)" }}>
                    <OpenBox title="职位描述">{job.job_description}</OpenBox>
                  </div>
                  <div className="pv_6" style={{ color: "rgba(0,0,0,0.45)" }}>
                    <OpenBox title="任职要求">{job.requirements}</OpenBox>
                  </div>
                </div>
                <div className="ta_c box box-as" style={{ marginTop: "25px" }}>
                  <div
                    className="ph_6 pointer"
                    onClick={() => {
                      page_resume.open("查看简历", {
                        read_status: "NO",
                        placeholder:job.job_name,
                        job_uuid: job.uuid
                      });
                    }}
                  >
                    <div
                      className="fc_blue fb fs_16"
                      style={{ marginBottom: 9 }}
                    >
                      {job.cnt_read || 0}
                    </div>
                    <div className="fc_black3">新简历</div>
                  </div>
                  <Divider
                    className="h_40 mt_10"
                    style={{ margin: "0 28px" }}
                    type="vertical"
                  />
                  <div
                    className="ph_6 pointer"
                    onClick={() => {
                      page_resume.open("查看简历", { job_uuid: job.uuid,placeholder:job.job_name });
                    }}
                  >
                    <div
                      className="fc_black2 fb fs_16"
                      style={{ marginBottom: 9 }}
                    >
                      {job.cnt_resume || 0}
                    </div>
                    <div className="fc_black3">已投递</div>
                  </div>
                </div>
              </div>

              <div
                className="bt_1 fc_black3 pv_13 pr_24 ta_r"
                style={{ backgroundColor: "rgba(247,249,250,1)" }}
              >
                <span
                  className="pointer"
                  onClick={() => {
                    job.opera = "edit";
                    page_edit.open("编辑职位", job);
                  }}
                >
                  编辑
                </span>
                <Divider
                  className="mh_48"
                  style={{ backgroundColor: "#E8E8E8" }}
                  type="vertical"
                />
                <Dropdown
                  overlay={
                    <Menu>
                      {job.status === "ON" ? (
                        <Menu.Item
                          onClick={() => {
                            bindStatus(index, job.uuid, "OFF");
                          }}
                        >
                          <span>停止招聘</span>
                        </Menu.Item>
                      ) : (
                        <Menu.Item
                          onClick={() => {
                            bindStatus(index, job.uuid, "ON");
                          }}
                        >
                          <span>重新发布</span>
                        </Menu.Item>
                      )}
                      <Menu.Item
                        onClick={async () => {
                          await $.get(`/jobs/${job.uuid}/remove`);
                          delete list[index];
                          setList([].concat(list));
                        }}
                      >
                        <span>删除</span>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <span className="pointer">更多操作</span>
                </Dropdown>
              </div>
            </div>
          ))}
        {list.length === 0 && <Empty style={{paddingBottom:50}} />}
      </div>
    );
  }

  // 表单
  function SearchForm() {
    return (
      <Form
        onSubmit={async val => {
          let res = await $.get("/jobs/list", val);
          setList(res);
          setSearch(val);
          return res;
        }}
      >
        {({ form, submit }) => (
          <div>
            <Inputs
              className="mr_15"
              name="status"
              form={form}
              placeholder="筛选职位"
              value=""
              select={[
                { text: "全部", value: "" },
                { text: "招聘中", value: "ON" },
                { text: "停止招聘", value: "OFF" }
              ]}
              autoSubmit={true}
            />
            <Inputs
              className="mr_15"
              name="job_name"
              placeholder="输入职位名称"
              form={form}
            />
            <Btn iconfont="sousuo" htmlType="submit">
              搜索
            </Btn>
            <Btn
              className="fl_r"
              onClick={() => {
                modal_add.open("新建职位");
              }}
            >
              新建职位
            </Btn>
          </div>
        )}
      </Form>
    );
  }
  // 编辑页
  function EditPage() {
    [search, setSearch] = useState({});
    return (
      <Page
        ref={ref => (page_edit = ref)}
        onClose={async () => {
          init();
          await getList(search);
        }}
      >
        <Edit />
      </Page>
    );
  }

  // 新建职位弹框
  function AddModal() {
    [orList, setOrList] = useState([]);
    return (
      <Modals width="550px" ref={ref => (modal_add = ref)}>
        {() => (
          <div className={`pv_20 pl_20 box ${orList.length===0?'jc_sb':''} f_wrap`}>
            <div
              className="mb_24 pv_8 pointer fc_info ta_c"
              style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.15)",width:130,margin:orList.length===0?"0 auto":"0 27px 24px 0" }}
              onClick={() => {
                page_edit.open("发布职位", { opera: "add" });
                modal_add.close();
              }}
            >
              + 直接创建
            </div>
            {orList.map(job => (
              <div
                className="mr_27 mb_24 pv_8 pointer fc_info ta_c"
                key={job.uuid}
                style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.15)",width:130 }}
                onClick={() => {
                  job.opera = "add";
                  page_edit.open("发布职位", job);
                  modal_add.close();
                }}
              >
                {job.job_name}
              </div>
            ))}
          </div>
        )}
      </Modals>
    );
  }

  return (
    <div className="ph_5">
      <SearchForm />
      <div className="dis_f jc_sb ai_c mt_16 mb_16">
        <NoReadBox />
      </div>

      <JobList />

      <AddModal />

      <Poster ref={ref => (poster = ref)} />
      <Page ref={ref => (page_resume = ref)} onClose={()=>{
        init()
        getList()
      }}>
        <Resume />
      </Page>
      <EditPage />
    </div>
  );
}
