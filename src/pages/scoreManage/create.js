import React, { useState } from "react";
import { Steps, Button, InputNumber, Icon,Table,Tabs, Form as Forms } from "antd";
import { Page,Form, Inputs, Method, Btn,Uploadfile } from "../comlibs";
import { Page_ChoiceClass, Subject, Grades } from "../works";
import Detail from "./detail";
const { Step } = Steps;
const { TabPane } = Tabs;

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
};

export default function(props) {
  let $ = new Method();
  let parent = props.Parent;
  parent.setCloseData(true);
  
  let {
    choiceClass,
    examClass = {},
    setExamClass,
    step = 0,
    setStep,
    current = 0,
    setCurrent,
    upload,
    students=[],
    setStudents,
    exam={},
    setExam,
    uuid,
    setUuid,
    succ,
    setSucc,
    err,
    setErr,
    page_detail,
    showBtn,
    setShowBtn
  } = {};
  let ExamClass = () => {
    [examClass, setExamClass] = useState({});
    return <span>{examClass.name ? examClass.name : "班级 +"}</span>;
  };
  let columns=[
    {
      title:'姓名',
      dataIndex:'name',
    },
    {
      title:'手机号',
      dataIndex:'phone',
    },
    {
      title:'分数',
      dataIndex:'exam_score',
    }
  ]
  let err_columns=[
    {
      title:'姓名',
      dataIndex:'name',
    },
    {
      title:'手机号',
      dataIndex:'phone',
    },
    {
      title:'分数',
      dataIndex:'exam_score',
    },
    {
      title:'失败原因',
      dataIndex:'reason',
    }
  ]
  // 步骤条图标
  function stepIcon(index) {
    if (index < current) {
      return "finish";
    }
    if (index === current) {
      return "process";
    }
    if (index > current) {
      return "wait";
    }
  }
  async function getStudent() {
    let res = await $.get("/achievement/manualinput/show", {
      group_uuid: exam.group_uuid
    });
    // setStudents(
      let stus=res.map(stu => {
        return { student_uuid: stu.student_uuid,name:stu.name, exam_score: '' };
      })
      setStudents(stus)
    // );
  }
  // 手动输入学员成绩提交
  async function manualScore() {
    let stuList=students
    let flag=true
    for (let i = 0; i < stuList.length; i++) {
      if(!(stuList[i].exam_score||stuList[i].exam_score===0)){
        flag=false
      }
      delete stuList[i].name
    }
    if(!flag){
      $.warning("当前有学员成绩未填写，请填写后再继续")
      return
    }

    let stuStr=JSON.stringify(stuList)
    let data={
        "datas":stuStr,
        "group_uuid":exam.group_uuid,
        "exam_uuid":uuid,
        "exam_time":exam.exam_time,
        "campus_uuid":$.campus_uuid()
    }
    if(exam.examgrade||exam.examgrade===0){
      data.examgrade=exam.examgrade
    }
    if(exam.examsubject_uuid){
      data.examsubject_uuid=exam.examsubject_uuid
    }
    let res=await $.post('/achievement/manualinput/fields',data)
    if(res.status==="success"){
      setSucc([{name:'xx',exam_score:0}])
      setCurrent(2)
      setStep(2)
    }
    
  }

  // 考试基本信息提交
  function submitSuc(res) {
    setUuid(res);
    getStudent();
    setCurrent(1);
    setStep(1);
  }

  // 步骤条
  function StepBox() {
    [step, setStep] = useState(0);
    return (
      <Steps type="navigation" current={step}>
        <Step status={stepIcon()} title="考试基本信息" />
        <Step status={stepIcon()} title="登记成绩" />
        <Step status={stepIcon()} title="完成" />
      </Steps>
    );
  }
  function SuccList(){
    [succ,setSucc]=useState([])
    return <Table className="b_1" style={{width:500}} title={()=><div className="fb fs_20 ta_c">导入成功的数据</div>} dataSource={succ} columns={columns}/>
  }
  function ErrList(){
    [err,setErr]=useState([])
    return <Table className="b_1" style={{width:500}} title={()=><div className="fb fs_20 ta_c">导入失败的数据</div>} dataSource={err} columns={err_columns}/>
  }
  function WaitBtn(){
    [showBtn,setShowBtn]=useState(true)
    if(showBtn){
        return (
          <Button type="primary" className="mr_15" onClick={()=>{setCurrent(2);setStep(2)}}>
            稍后登记
          </Button>
      )
    }else{
      return '' 
    }
  }
  
  // 步骤2
  function Step2(){
    [students, setStudents] = useState(students);
    let data={
        group_uuid:exam.group_uuid,
        exam_uuid:uuid,
        exam_time:exam.exam_time,
    }
    if(exam.examgrade||exam.examgrade===0){
      data.examgrade=exam.examgrade
    }
    if(exam.examsubject_uuid){
      data.examsubject_uuid=exam.examsubject_uuid
    }
      return (
        <div>
            <Uploadfile
                action="/achievement/import/fields"
                params={data}
                multiple={false}
                ref={ref => (upload = ref)}
                onSure={rs => {  
                  if(rs.data){
                    setShowBtn(false)
                    setSucc(rs.data.success)
                    setErr(rs.data.failue)
                }
            }}
            />
          <Tabs defaultActiveKey="tab_on">
            <TabPane tab="批量上传" key="tab_on">
              <div className="mb_10">
                <Button style={{marginRight:10}} onClick={() => upload.open()}>导入成绩</Button>
                <Btn
                  type="link"
                  onClick={async btn => {
                    btn.loading = true;
                    await $.download("/achievement/export/fields", {
                      group_uuid: exam.group_uuid
                    });
                    btn.setloading(false, 5000);
                  }}
                >
                  点击下载成绩模板
                </Btn>
              </div>

              <div className="box box-pc">
                  <div className="box" style={{marginRight:40}}>
                    <SuccList/>
                  </div>
                  <div className="box">
                    <ErrList/>
                  </div>
              </div>

              <div className="box box-allc mt_30">
                <WaitBtn/>
                <Button type="primary" onClick={()=>{setCurrent(2);setStep(2)}}>
                  下一步
                </Button>
              </div>
            </TabPane>
            <TabPane tab="手动输入" key="tab_off">
            <div style={{display:'flex',flexWrap:'wrap'}}>
              {students.length===0&&'暂无学员'}
              {students.map((stu, index) => {
                return (
                  <div
                    key={stu.student_uuid}
                    className="b_1 box ta_c lh_30 mr_15"
                    style={{ width: 200 }}
                  >
                    <div
                      className="ellipsis"
                      style={{ width: 100, borderRight: "1px solid #e8e8e8" }}
                    >
                      {stu.name}：
                    </div>
                    <div style={{ width: 100 }}>
                      <InputNumber
                        min={0}
                        precision={2}
                        max={exam.totalscore}
                        defaultValue={students[index].exam_score}
                        onChange={val => {
                          students[index].exam_score = val;
                          setStudents(students);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
              <div className="box box-allc mt_30">
                <Button type="primary" className="mr_15" onClick={()=>{setCurrent(2);setStep(2)}} >
                  稍后登记
                </Button>
                <Button type="primary" onClick={manualScore}>
                  下一步
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </div>
      )
  }
  //步骤3
  function Step3(){
    return (
      <div className="ta_c pt_30">
        <div>
          <Icon style={{fontSize:100}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          {
              succ.length!==0?<div className="mt_30">{exam.name}成绩登记成功！</div>:<div className="mt_30">{exam.name}创建成功，您还未登记成绩！</div>
          }

          
        </div>
        <div className="mt_15">
          <Btn type="default" className="mr_15" onClick={()=>{parent.close(true)}}>返回成绩管理</Btn>
          {
            succ.length!==0?<Btn type="default" className="mr_15" onClick={()=>{page_detail.open('考试详情',{uuid,close:true})}}>查看详情</Btn>:<Btn type="primary" className="mr_15" onClick={()=>{page_detail.open('考试详情',{uuid,close:true})}}>登记成绩</Btn>
          }
          {/* <Btn type="primary">通知学员</Btn> */}
        </div>
      </div>
    )
  }
  
  function Content() {
    [uuid,setUuid] = useState(null);
    [exam, setExam] = useState({});
    [current, setCurrent] = useState(0);
    if (current === 0) {
      return (
        <div>
          <Form
            {...col}
            action={`/achievement/exam/create`}
            valueReturn={(res)=>{
              setExam(res)
              return res
            }}
            method="POST"
            success={async res => submitSuc(res)}
          >
            {({ form, submit, set }) => (
              <div className="m_auto pt_30" style={{ width: 600 }}>
                <Inputs
                  label="考试名称"
                  form={form}
                  name="name"
                  className="w_full box"
                  required={true}
                  placeholder="请输入考试名称"
                  style={{ width: "500px" }}
                />
                <Forms.Item {...col} label="考试班级">
                  {set(
                    {
                      name: "group_uuid",
                      value: examClass.uuid,
                      required: "请选择考试班级"
                    },
                    valueSet => (
                      <Button
                        className="box box-allc"
                        type="primary"
                        onClick={() =>
                          choiceClass.open({
                            max: 1,
                            onSure: d => {
                              setExamClass(d)
                              valueSet(d.uuid);
                            }
                          })
                        }
                      >
                        <ExamClass />
                      </Button>
                    )
                  )}
                </Forms.Item>
                <div className="mb_15 box">
                  <Forms.Item
                    required={true}
                    label="试卷总分"
                    labelCol={{ span: 6 }}
                    className="box"
                    style={{ width: 300 }}
                  >
                    {form.getFieldDecorator("totalscore", {
                      initialValue: 100,
                      rules: [{ required: true, message: "请输入考试总分" }]
                    })(
                      <InputNumber
                        form={form}
                        name="totalscore"
                        min={1}
                        max={10000}
                      />
                    )}
                  </Forms.Item>

                  <Inputs
                    label="考试日期"
                    labelCol={{ span: 6 }}
                    form={form}
                    required={true}
                    name="exam_time"
                    type="datePicker"
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="mb_15 box">
                  <Forms.Item
                    label="考试年级"
                    labelCol={{ span: 6 }}
                    className="box"
                    style={{ width: 300 }}
                  >
                    <Grades
                      type="compulsory"
                      style={{ width: 100 }}
                      name="examgrade"
                      form={form}
                    />
                  </Forms.Item>
                  <Forms.Item
                    label=" 考试科目"
                    labelCol={{ span: 6 }}
                    className="box box-1"
                  >
                    <Subject name="examsubject_uuid" form={form} />
                  </Forms.Item>
                </div>
                <div className="box box-allc">
                  <Button type="primary" onClick={e => submit(e)}>
                    下一步
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      );
    } else if (current === 1) {
      return (
        <Step2/>
      );
    } else if (current === 2) {
      return (
        <div>
          <Step3/>
        </div>
      );
    }
  }

  return (
    <div className="bg_white br_2 mt_24 pall_15">
      <StepBox />

      <Content />

      <Page_ChoiceClass ref={ref => (choiceClass = ref)} />
      <Page ref={rs => (page_detail = rs)} onClose={() => {
        parent.close(true)
      }}>
        <Detail />
      </Page>
    </div>
  );
}
