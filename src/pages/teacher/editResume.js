import React, { useState,useEffect } from "react";
import { Form as Forms, InputNumber } from "antd";
import { Form, Inputs, Btn,Page,Method, FixedBox } from "../comlibs";
import { Cascaders } from "../works";
import Share from './share'

export default function(props) {
  let $=new Method()
  let {page_share}={}
  let parent=props.Parent
  let [job,setJob]=useState(parent.data)
  useEffect(()=>{
    (async ()=>{
      let res=await $.get(`/campus/detail/${$.campus_uuid()}`)
      if(!job.address)job.address=res.address
      if(!job.zonecode)job.zonecode=res.zonecode
      setJob(JSON.parse(JSON.stringify(job)))
    })()
  },[])
    
  let edus = ["不限", "博士", "硕士", "本科", "大专", "其它"];
  let exps = [
    "不限",
    "1年",
    "2年",
    "3年",
    "4年",
    "5年",
    "6~9年",
    "10~19年",
    "20年及以上"
  ];

  function SuccessPage(){
    // [val,setValue]=useState({})
    return (
      <Page ref={(ref)=>{page_share=ref}} onClose={()=>{
        parent.close(true)
      }}>
          <Share/>
      </Page>
    )
  }


  return (
    <div className="bg_white mt_24 br_2 pt_30 mb_24 pb_30">
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 13 }}
        method="POST"
        valueReturn={(val)=>{
          val.zonecode=val.zonecode[2]
          if(job.opera==='edit'){
            val.job_uuid=job.uuid
          }
          // setValue(val)
          return val
        }}
       action={job.opera==='add'?'/jobs/create':'/jobs/save'}
       success={(res)=>{
        parent.setCloseData(true);
         if(job.opera==='add'){
            page_share.open('职位发布',res)
         }else{
           $.msg('职位修改成功')
         }

       }}
       >
        {({ form }) => (
          <div>
            <Forms.Item label="职位名称" required={true} className="mb_18">
              <div className="box w_500">
                <Inputs
                  className="mr_12 box-1"
                  placeholder="请输入职位名称，如语文老师"
                  value={job.job_name}
                  style={{ width: "100%" }}
                  name="job_name"
                  form={form}
                  required={true}
                />
                <Inputs
                  placeholder="职位类型"
                  name="job_nature"
                  value={job.job_nature || "fulltime"}
                  form={form}
                  select={[
                    { text: "全职", value: "fulltime" },
                    { text: "兼职", value: "parttime" },
                    { text: "实习", value: "internship" }
                  ]}
                  required={true}
                />
              </div>
            </Forms.Item>
            <Forms.Item label="薪资范围" className="mb_18">
              <div className="w_500 box box-ac">
                {form.getFieldDecorator("salary_min", {
                  initialValue: job.salary_min_tag||job.salary_min,
                  rules: [{ required: true, message: "请输入薪资范围" }]
                })(
                  <InputNumber
                    className="box-1"
                    placeholder="最低薪资"
                    min={0}
                  />
                )}
                <span className="mh_8">-</span>
                {form.getFieldDecorator("salary_max", {
                  initialValue: job.salary_max_tag||job.salary_max,
                  rules: [{ required: true, message: "请输入薪资范围" }]
                })(
                  <InputNumber
                    placeholder="最高薪资"
                    className="mr_12 box-1"
                    min={0}
                  />
                )}
                <Inputs
                  name="date_tag"
                  placeholder="月/天/小时"
                  value={job.date_tag || "month"}
                  select={[
                    { text: "月", value: "month" },
                    { text: "天", value: "day" },
                    { text: "小时", value: "hour" }
                  ]}
                  required={true}
                  form={form}
                />
              </div>
            </Forms.Item>

            <Forms.Item label="职位福利" required={true} className="mb_18">
              <Inputs
                name="advantages"
                value={job.advantages}
                required={true}
                style={{ width: 500 }}
                rows={4}
                form={form}
                placeholder="每项福利建议2~5个字，以逗号隔开"
                type="textArea"
              />
            </Forms.Item>

            <Forms.Item label="工作地址" required={true} className="mb_18">
              <Cascaders
                style={{
                  width: 500,
                  borderBottom:'none',
                  borderRaduis:'4px 4px 0 0'
                }}
                rows={4}
                form={form}
                name="zonecode"
                type="citychoice"
                value={job.zonecode}
                required={true}
                placeholder="请选择省/市/区"
              />
              <div style={{marginTop:-10}}>
                <Inputs
                  name="address"
                  value={job.address}
                  style={{ width: 500,borderRaduis:'0 0 4px 4px' }}
                  form={form}
                  required={true}
                  rows={2}
                  placeholder="请输入详细地址"
                  type="textArea"
                />
              </div>
            </Forms.Item>

            <Inputs
              label="学历"
              required={true}
              className="mb_18"
              form={form}
              name="education"
              value={job.education || "不限"}
              select={edus.map(edu => ({ text: edu, value: edu }))}
              style={{ width: 500 }}
            />
            <Inputs
              label="工作经验"
              required={true}
              className="mb_18"
              form={form}
              name="experience"
              value={job.experience||"不限"}
              select={exps.map(exp => ({ text: exp, value: exp }))}
              style={{ width: 500 }}
            />
            <Inputs
              label="职位描述"
              required={true}
              type="textArea"
              className="mb_18"
              form={form}
              value={job.job_description}
              name="job_description"
              style={{ width: 500 }}
              rows={7}
            />
            <Inputs
              label="任职要求"
              required={true}
              type="textArea"
              className="mb_18"
              form={form}
              value={job.requirements}
              name="requirements"
              style={{ width: 500 }}
              rows={7}
            />

            <FixedBox>
                <Btn type="default" style={{width:80}} className="mr_8" onClick={()=>{
                  parent.close(true)
                }}>取消</Btn>
                <Btn htmlType="submit" style={{width:80}}>{job.opera === "add" ? "发布": "确定"}</Btn>
            </FixedBox>
          </div>
        )}
      </Form>

      <SuccessPage/>
    </div>
  );
}
