import React, { useState, useEffect } from "react";
import { Tabs, Modal, Alert, Button, Checkbox,Table } from "antd";
import {
  $,
  Form,
  Inputs,
  Btn,
  TablePagination,
  Page,
  Modals,
  Uploadfile,
} from "../comlibs";
import { Teacher, Classroom,Course } from "../works";
import Detail from "./detail";
import AddClass from "./addClass";

export default function () {
  let { TabPane, tab1, tab2 } = Tabs;
  let { detail_page, add_page, table, out_modal,uploadTipModal, uploadResultModal} = {};
  let identity=$.store().GlobalData.user_power

  let NormalList = (props) => {
    let { update_modal, upload } = {};
    let { end = "NO" } = props;
    let columns = [
      {
        title: "序号",
        key: "i",
        align: "center",
        render(rs, obj, i) {
          return i + 1;
        },
      },
      {
        title: "班级名称",
        key: "name",
        render(rs) {
          return (
            <div
              className="link"
              onClick={() => {
                detail_page.open("班级详情", { uuid: rs.uuid });
              }}
            >
              {rs.name}
            </div>
          );
        },
      },
      {
        title: "课程",
        dataIndex: "course_name",
      },
      {
        title: "班主任",
        key: "teachers_name",
        render: (rs) => <div>{rs.teachers_name || "-"}</div>,
      },
      {
        title: "助教",
        key: "assistants_name",
        render: (rs) => <div>{rs.assistants_name || "-"}</div>,
      },
      {
        title: "教室",
        key: "classroom_name",
        render: (rs) => <div>{rs.classroom_name || "-"}</div>,
      },
      {
        title: "进度",
        key: "finished_classtimes",
        render: (rs) => (
          <div>
            {rs.finished_classtimes || 0}/{rs.classtimes || 0}
          </div>
        ),
      },
      {
        title: "在读学员/上限",
        key: "member",
        render: (rs) => (
          <div>
            {rs.member || 0}/{rs.students === 99999 ? "不限" : rs.students}
          </div>
        ),
      }
    ];
    if(true){
      columns.push({
        title: "操作",
        key: "edit",
        render(rs) {
          if (end === "YES") {
            return (
              <div className="box box-ac">
                <span className="link" onClick={() => {
                  detail_page.open("班级详情", { uuid: rs.uuid });
                }}>查看</span>
                <span className="mh_5">|</span>
                <span
                  className="fc_del hover_line pointer"
                  onClick={async () => {
                    await $.post("/banji/end/cancel", { group_uuid: rs.uuid });
                    $.msg('取消结班成功！')
                    tab1&&tab1.reload();
                    tab2&&tab2.reload();
                  }}
                >
                  取消结班
                </span>
              </div>
            );
          } else {
            return (
              <div className="box box-ac">
                  <span
                    className="link"
                    onClick={async () => {
                      await $.post(
                        "/banji/end",
                        { group_uuid: rs.uuid }
                      );
                      $.msg('结班成功！')
                      table.reload();
                      tab2&&tab2.reload();
                    }}
                  >
                    结班
                  </span>
                <span className="mh_5">|</span>
                <span
                  className="fc_del hover_line pointer"
                  onClick={async () => {
                    if(rs.member){
                      $.warning('班级无法删除,请先移除学员!')
                      return
                    }
                    Modal.confirm({
                      title: "提示",
                      content:
                        "确定删除该班级吗？删除后无法恢复，学员已扣课时将退回。",
                      async onOk() {
                          await $.get("/banji/remove", { group_uuid: rs.uuid });
                          $.msg('删除成功！')
                          table.reload();
                      },
                    });
                  }}
                >
                  删除
                </span>
                
              </div>
            );
          }
        },
      },)
    }
    

    function CopyBox(){
      let [clear,setC]=useState({})
      return (
          <Form action="/banji/import/check" method="post" success={async (rs)=>{
            if(rs.create_count){
              uploadTipModal.open('注意',rs)
            }else{
              let res=await $.post('/banji/import/sutdent',{student_text:JSON.stringify(rs.data)})
              if(res.failue_count){
                uploadResultModal.open('导入结果',res)
              }
              if(res.success_count){
                $.msg(`成功导入${res.success_count}条数据`)
              }
              update_modal.close();
            }
            table && table.reload();
          }} failure={rs=>{
            $.warning(rs.message)
          }}>
                  {({ form, submit,set }) => (
                    <div>
                      <div className="box box-ac jc_sb mb_15">
                        <Alert
                          message={
                            <div>
                              请将学员名单excel严格按照以下{" "}
                              <span className="fc_err">[表头格式]</span>
                              模版进行整理，然后
                              <span className="fb fc_blue">复制粘贴</span>
                              到下方输入框中。
                              <a
                                target="_blank"
                                className="fc_blue pointer hover_line"
                                href="https://www.yuque.com/zwriad/bz1d16"
                              >
                                点击查看操作视频
                              </a>
                            </div>
                          }
                          type="warning"
                          showIcon
                        />
                        <Button
                          icon="delete"
                          type="primary"
                          className="fl_r"
                          onClick={() => {
                            Modal.confirm({
                              title: "注意",
                              content: "确定要清空表格吗？",
                              async onOk() {
                                form.setFieldsValue({
                                  ["student_text"]: "",
                                });
                                setC({})
                              },
                            });
                          }}
                        >
                          清空表格
                        </Button>
                      </div>
                      <table
                        border="1"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        <thead>
                          <tr
                            style={{
                              background: "#fbfafa",
                              fontWeight: "bold",
                            }}
                          >
                            <td>班级名称</td>
                            <td>课程名称</td>
                            <td>学员姓名</td>
                            <td>联系电话</td>
                          </tr>
                        </thead>
                        <tbody style={{ background: "#ebeaea" }}>
                          <tr>
                            <td>2019暑假班七年级语文</td>
                            <td>语文</td>
                            <td>张三</td>
                            <td>10000000001</td>
                          </tr>
                          <tr>
                            <td>2019暑假班七年级语文</td>
                            <td>语文</td>
                            <td>李四</td>
                            <td>10000000001</td>
                          </tr>
                          <tr>
                            <td>少儿绘画提高班下午</td>
                            <td>语文</td>
                            <td>刘海</td>
                            <td>10000000001</td>
                          </tr>
                          <tr>
                            <td colSpan={4}>
                              {
                                set({
                                  name: "student_text",
                                },()=>(
                                  <div
                                    style={{width:'100%',height:200,overflowY:'scroll'}}
                                    className="bg_white ta_l excStu"
                                    placeholder='点击此处进行表格粘贴操作，请严格按照上方提示数据进行表格数据导入哦！'
                                    contentEditable={true}
                                    onInput={(e) => {
                                      form.setFieldsValue({
                                        ['student_text']: e.target.innerHTML,
                                      });
                                    }}
                                  />
                                ))
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="box box-pc mt_10">
                        <Btn icon="check" onClick={submit}>
                          立即导入
                        </Btn>
                      </div>
                    </div>
                  )}
                </Form>
      )
    }
    // 导入学员模态框
    let UpdateModal = () => {
      return (
        <Modals
          width="1000px"
          bodyStyle={{ padding: "0 5px 30px" }}
          ref={(ref) => (update_modal = ref)}
        >
          <div>
            <Tabs>
              <TabPane tab="Excel" key="excel" className="ph_15 box">
                <div
                  className="b_1 pall_10 br_4 mr_24"
                  style={{ width: "50%" }}
                >
                  <div>下载学员名单模板</div>
                  <div className="b_1 pall_10 br_4 box box-ver box-ac box-pc mv_10">
                    <img
                      className="mv_15"
                      src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"
                    />
                    <div>
                      <a
                        className="link mr_3"
                        href="https://sxzmedia.oss-cn-shanghai.aliyuncs.com/files/%E7%8F%AD%E7%BA%A7%E5%88%97%E8%A1%A8%E5%AD%A6%E5%91%98%E5%AF%BC%E5%85%A5.xlsx"
                      >
                        点击下载
                      </a>
                      <span>学员名单模板</span>
                    </div>
                  </div>
                  <div className="ta_c fs_12">
                    下载对应模板，阅读注意点后填写模板文件，模板表头不可删，班级名称、课程名称、学员姓名、联系电话为必填项
                  </div>
                </div>
                <div className="b_1 pall_10 br_4" style={{ width: "50%" }}>
                  <div>上传名单文件</div>
                  <div className="b_1 pall_10 br_4 box box-ver box-ac box-pc mv_10">
                    <img
                      className="mv_15"
                      src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"
                    />
                    <div>
                      <span
                        className="link mr_3"
                        onClick={() => {
                          upload.open();
                        }}
                      >
                        点击上传
                      </span>
                      <span>学员名单模板</span>
                    </div>
                  </div>
                  <div className="ta_c fs_12">
                    将学员名单按照模板格式填写，完成编辑后上传
                  </div>
                </div>
              </TabPane>
              <TabPane tab="复制粘贴" key="copy" className="ph_15">
                <CopyBox/>
              </TabPane>
            </Tabs>
          </div>
        </Modals>
      );
    };
    // 导入后错误提示模态框
    let UploadTipModal=()=>{
      let columns=[
        {
          title:'班级名称',
          align:'center',
          dataIndex:'group_name'
        },
        {
          title:'课程名称',
          align:'center',
          dataIndex:'course_name'
        },
        {
          title:'学员姓名',
          align:'center',
          dataIndex:'studentname'
        },
        {
          title:'联系电话',
          align:'center',
          dataIndex:'phone'
        },
        {
          title:'失败原因',
          dataIndex:'reason',
          align:'center',
          render:(rs)=>(<div className="fc_err">{rs}</div>)
        }
      ]
      return (
        <Modals bodyStyle={{padding:10}} width={800} ref={ref=>uploadTipModal=ref}>
          {(rs)=>{
            return (
              <div>
                <div style={{background:'#f2f2f2',borderLeft:'2px solid #009688'}} className="fs_12 fc_err box box-ac pl_15">
                  注意：以下学员在系统中未找到，请选择需要导入内容！
                </div>
                <Form action="/banji/import/sutdent" params={{
                  student_text:JSON.stringify(rs.data)
                }} method="post" success={(res)=>{
                  uploadTipModal.close()
                  update_modal.close();
                  if(res.success_count){
                    $.msg(`成功导入${res.success_count}条数据`)
                  }
                  if(res.failue_count){
                    uploadResultModal.open('导入结果',res)
                  }
                }}>
                  {({form,submit})=>(
                    <div className="mt_10">
                      <Inputs type="radio" value="all" radios={[
                        {text:'创建以下学员并进行导入',value:'all'},
                        {text:'仅导入系统中存在的学员',value:''}
                      ]} name="type" form={form}/>
                      <Table columns={columns} dataSource={rs.create_data}></Table>
                      <div className="box box-pe">
                        <Btn onClick={()=>{
                          Modal.confirm({
                            title:'提示',
                            content:'导入后，学员将会加入到所有的课节中',
                            onOk(){
                              submit({})
                            }
                          }) 
                        }
                        }>继续导入</Btn>
                      </div>
                    </div>
                  )}
                </Form>
              </div>
            )
          }}
        </Modals>
      )
    }
    

    return (
      <div>
        <Form
          onSubmit={(val, e) => {
            table.search(val);
            e.loading = false;
          }}
        >
          {({ form, submit }) => (
            <div className="mb_20">
              <Course className="mr_10" autoSubmit form={form} name="course_uuid"/>
              <Classroom
                autoSubmit={true}
                placeholder="全部教室"
                form={form}
                style={{ width: 200 }}
                className="mr_10"
                name="classroom_uuid"
              />
              
              {identity!='teacher'&&<Teacher
                mode="multiple"
                autoSubmit={true}
                placeholder="全部老师"
                form={form}
                style={{ width: 200 }}
                className="mr_10"
                name="teacher_uuid"
              />}
              <Inputs
                placeholder="输入班级名称搜索"
                form={form}
                style={{ width: 250 }}
                className="mr_10"
                name="name_query"
              />
              <Btn onClick={(e) => submit(e)}>搜 索</Btn>
            </div>
          )}
        </Form>
          <div className="mb_10">
            <Btn className="mr_10" onClick={() => add_page.open("建班排课")}>
              建班排课
            </Btn>
            <Button
              ghost
              type="primary"
              className="mr_10"
              onClick={() => {
                update_modal.open("学员导入");
              }}
            >
              导入班级学员
            </Button>
            <Button
              ghost
              type="primary"
              className="mr_10"
              onClick={() => {
                out_modal.open("导出学员");
              }}
            >
              导出班级学员
            </Button>
          </div>
        
        <TablePagination
          ref={(ref) => {
            table = ref;
            if (end != "YES") {
              tab1 = ref;
            } else {
              tab2 = ref;
            }
          }}
          columns={columns}
          api="/banji/normal/list"
          params={{
            join_way: "normal",
            is_end: end,
          }}
        />
        <UpdateModal />
        <UploadTipModal/>
        {/* 上传学员模板 */}
        <Uploadfile
          zIndex={1200}
          params={{type:'file'}}
          action="/banji/import/check"
          multiple={false}
          ref={(ref) => (upload = ref)}
          onSure={async (rs) => {
            if(rs.status==='success'&&rs.data.create_count){
              uploadTipModal.open('注意',rs.data)
              return
            }else if(!rs.data.create_count){
              let res=await $.post('/banji/import/sutdent',{student_text:JSON.stringify(rs.data.data)})
              if(res.failue_count){
                uploadResultModal.open('导入结果',res)
              }
              if(res.success_count){
                $.msg(`成功导入${res.success_count}条数据`)
              }
              update_modal.close();
              return
            }
            $.warning(rs.message)
          }}
        />


      </div>
    );
  };
  // 导出学员
  let OutModal = () => {
    let [banjis, setBanjis] = useState({ on: [], off: [], all: [] });

    useEffect(() => {
      (async () => {
        let res = await $.get("/banji/list", { limit: 9999 });
        let off = res.filter((b) => b.is_end === "YES");
        let on = res.filter((b) => b.is_end != "YES");
        setBanjis({ on, off, all: res });
      })();
    }, []);
    let { all } = banjis;
    let time=null
    // 获取验证码
    function GetVerBtn(){
      let [step,setStep]=useState(61)
      return (
        <Btn
            disabled={step!=61}
            icon="mobile"
            onClick={async () => {
              if(step!==61){
                return
              }
              let res = await $.post("/approval/verifycode", {
                permission: "EXPORT_BANJIS",
              });
              Modal.info({
                title: "信息",
                content: `验证码已发送至手机[${res.phone}]，请注意查看!`,
              });
              step=60
              setStep(60)
              time=setInterval(()=>{
                if(step===0){
                  setStep(61)
                  clearInterval(time)
                 return 
                }
                setStep(step--)
              },1000)
            }}
          >
            {step===61?'获取验证码':step}
        </Btn>
      )
    }

    function ContentBox(props) {
      let [step, setStep] = useState("one");
      let { form, set, submit } = props;
     
      return (
        <div>
          <div className="pv_10 bb_1 box jc_sb box-ac">
            <Alert banner message="请选择你要将进行学员导出的班级" />
            {step === "one" && (
              <Checkbox
                onChange={(e) => {
                  let { checked } = e.target;
                  if (checked) {
                    form.setFieldsValue({
                      group_uuids: all.map((b) => b.uuid),
                    });
                  } else {
                    form.setFieldsValue({ group_uuids: "" });
                  }
                }}
              >
                全选
              </Checkbox>
            )}
          </div>
          {step === "one" ? (
            <div>
              {set(
                {
                  name: "group_uuids",
                },
                () => (
                  <Checkbox.Group>
                    <div className="mv_10">普通班级</div>
                    <div className="box f_wrap fs_12">
                      {banjis.on.map((b) => (
                        <div key={b.uuid} style={{ width: "20%" }}>
                          <Checkbox
                            value={b.uuid}
                            className="ellipsis"
                            style={{ width: "100%" }}
                          >
                            {b.name}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                    <div className="mv_10">已完课班级</div>
                    <div className="box f_wrap fs_12 mb_15">
                      {banjis.off.map((b) => (
                        <div key={b.uuid} style={{ width: "20%" }}>
                          <Checkbox
                            value={b.uuid}
                            className="ellipsis"
                            style={{ width: "100%" }}
                            title={b.name}
                          >
                            {b.name}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </Checkbox.Group>
                )
              )}
            </div>
          ) : (
            <div className="pt_10">
                {set(
                    {
                    name: "group_uuids",
                    },
                    () => (<span></span>)
                )}
              <Btn
                icon="arrow-left"
                onClick={() => {
                  setStep("one");
                }}
              >
                上一步
              </Btn>
              <div style={{ margin: "60px auto" }} className="box box-pc">
                <div className="box box-ac box-ver">
                  <div>
                    <Inputs
                      form={form}
                      name="verifycode"
                      required
                      placeholder="请输入验证码"
                      className="mr_10"
                    />
                    <GetVerBtn/>
                  </div>
                  <div className="fc_err mt_10">
                    *如下载页提示验证码错误,请重新获取验证码
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "one" ? (
            <div className="bt_1 box box-pc pt_10">
              <Btn
                icon="check"
                onClick={() => {
                  let {group_uuids} = form.getFieldsValue(["group_uuids"]);
                  if (group_uuids.length) {
                    setStep("two");
                  } else {
                    $.msg("请选择班级后操作!");
                  }
                }}
              >
                确定并下一步
              </Btn>
            </div>
          ) : (
            <div className="bt_1 box box-pc pt_10">
              <Btn icon="download" onClick={submit}>
                开始导出
              </Btn>
            </div>
          )}
        </div>
      );
    }
    return (
      <Modals
        afterClose={()=>{
          clearInterval(time)
        }}
        width="1000px"
        bodyStyle={{ padding: "10px 20px" }}
        ref={(ref) => (out_modal = ref)}
      >
        <Form
          onSubmit={(val, btn) => {
            let {group_uuids,verifycode}=val
            let api=$.getProxyIdentify+`/campus/export/banjis`
            window.open(api+`?verifycode=${verifycode}&banji_uuids=${group_uuids}&campus_uuid=${$.campus_uuid()}&token=${$.token()}`)
            btn.loading = false;
          }}
        >
          {({ form, set, submit }) => (
            <ContentBox form={form} set={set} submit={submit} />
          )}
        </Form>
      </Modals>
    );
  };
  // 导入结果模态框
  let UploadResultBox=()=>{
    let columns=[
      {
        title:'班级名称',
        align:'center',
        dataIndex:'group_name'
      },
      {
        title:'课程名称',
        align:'center',
        dataIndex:'course_name'
      },
      {
        title:'学员姓名',
        align:'center',
        dataIndex:'studentname'
      },
      {
        title:'联系电话',
        align:'center',
        dataIndex:'phone'
      },
      {
        title:'失败原因',
        dataIndex:'reason',
        align:'center',
        render:(rs)=>(<div className="fc_err">{rs}</div>)
      }
    ]
    return (
      <Modals bodyStyle={{padding:10}} width={800} ref={ref=>uploadResultModal=ref}>
        {({failue_data})=>{
          return (
            <Table dataSource={failue_data} columns={columns}></Table>
          )
        }}
      </Modals>
    )
  }
  return (
    <div className="mt_20 bg_white ph_10 pb_10 br_3">
      <Tabs
        animated={false}
        defaultActiveKey="normal"
        onChange={(key) => {
          table = key === "normal" ? tab1 : tab2;
        }}
      >
        <TabPane tab="普通班" key="normal" className="ph_15">
          <NormalList />
        </TabPane>
        <TabPane tab="已完结" key="finsh" className="ph_15">
          <NormalList end="YES" />
        </TabPane>
      </Tabs>
      <Page
        ref={(ref) => (detail_page = ref)}
        onClose={(uuid) => {
          if(uuid&&uuid!==true){
            detail_page.open("班级详情", { uuid });
          }
          table && table.reload();
        }}
      >
        <Detail />
      </Page>

      <Page
        ref={(ref) => (add_page = ref)}
        onClose={() => {
          table && table.reload();
        }}
      >
        <AddClass />
      </Page>
      <OutModal />
      {/* 导入结果模态框 */}
      <UploadResultBox/>
    </div>
  );
}
