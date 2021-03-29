import React,{useState} from 'react'
import Moment from "moment";
import {$,Form,Inputs,FixedBox,Btn,Page} from '../comlibs'
import {ChoiceClassStudents,Subject} from '../works'
import {Steps,Form as Forms,Icon,Modal} from 'antd'
import Detail from './detail'
import FileBox from './fileBox'

export default function(props){
    let parent=props.Parent
    const { Step } = Steps;
    let {img_ref,audio_ref,video_ref,detail_page}={}
    let [step,setStep]=useState(0)
    let [work,setWork]=useState({})
    function stepIcon(index) {
        if (index < step) {
            return "finish";
        }
        if (index === step) {
            return "process";
        }
        if (index > step) {
            return "wait";
        }
    }
    let Step1=()=>{
        return (
            <div className="mt_30">
                <Form
                    wrapperCol={{span:18}}
                    labelCol={{span:3}}
                    onSubmit={async val=>{
                        setWork(val)
                        setStep(1)
                    }}
                    >
                    {({set,form})=>(
                        <div>
                            <div className="mb_10">
                                <Inputs label="作业名称" style={{width:'100%'}} required={true} value={Moment().format('MM月Do作业')} form={form} name="title"/>
                            </div>
                            <div className="mb_10">
                                <Subject label="科目" style={{width:130}} form={form} name="examsubject_uuid"/>
                            </div>
                            <div>
                                <Inputs rows={7} required={true} label="作业内容" placeholder="请输入作业内容" type="textArea" form={form} name="memo"/>
                                
                                <div className="box">
                                    <div style={{width:'12.5%'}}></div>
                                    <div className="box pl_10 pv_8">
                                        <div className="mr_24 dis_f ai_c pointer" onClick={()=>{
                                            video_ref.open()
                                        }}>
                                            <img style={{width:23}} alt="图片走丢了" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/ace5ae92-ce18-11e9-8203-00163e04cc20.png"/>
                                            <span className="ml_8">视频</span>
                                        </div>
                                        <div className="mr_24 dis_f ai_c pointer" onClick={()=>{
                                            img_ref.open()
                                        }}>
                                            <img style={{width:18}} alt="图片走丢了" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b01e91fa-ce18-11e9-8203-00163e04cc20.png"/>
                                            <span className="ml_8">图片</span>
                                        </div>
                                        <div className="dis_f ai_c pointer" onClick={()=>{
                                            audio_ref.open()
                                        }}>
                                            <img style={{width:15}} alt="图片走丢了" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/622fbfbe-ce18-11e9-8203-00163e04cc20.png"/>
                                            <span className="ml_8">语音</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box">
                                <div style={{width:'12.5%'}}></div>
                                <div className="pl_10" style={{maxWidth:'700px'}}>
                                    <FileBox img_ref={ref=>{img_ref=ref}} video_ref={ref=>{video_ref=ref}} audio_ref={ref=>{audio_ref=ref}} set={set}/>
                                </div>
                            </div>
                            <div className="mb_10">
                                <Forms.Item label="作业未交提醒">
                                    <div className="box box-ac">
                                        <Inputs placeholder="选择时间" showToday={false} type="dateTimePicker" form={form} format="MM-DD HH:mm" showtime={{format:'HH:mm',minuteStep:30,defaultValue: Moment("00:00", "HH:mm")}} name="rem_time"/>
                                        <div className="fc_red ml_8 lh_16">
                                        *开通消息通知的后，系统会在此时间对未提交作业的学员自动发送提醒信息。
                                        </div>
                                    </div>
                                </Forms.Item>
                            </div>
                            
                            <FixedBox>
                                <Btn className="ph_10" htmlType="submit">下一步</Btn>
                            </FixedBox>
                        </div>
                    )}
                </Form>
            </div>
        )
    }
    let Step2=()=>{
        return (
            <div>
                <ChoiceClassStudents bottom={(props)=>{
                        let {sure}=props
                        return (
                            <FixedBox>
                                <Btn type="default" className="mr_12" onClick={async ()=>{
                                    let rs=await $.post('/testpaper/create',work)
                                    rs.num=0
                                    parent.setCloseData(true)
                                    setWork(rs)
                                    setStep(2)
                                }}>跳过</Btn>
                                <Btn onClick={()=>{
                                    sure()
                                }}>下一步</Btn>
                            </FixedBox>
                        )
                    }} onSure={async (data)=>{
                        if(data&&data.length>0){
                            let params={}
                            let group_uuids=data.map(obj=>obj.group_uuid)
                            params={...work,group_uuids}
                            data.forEach(obj => {
                                params[obj.group_uuid]=obj.stulist.map(stu=>stu.student_uuid).join(',')
                            });
                            let rs=await $.post('/testpaper/create',params)
                            rs.num=data.reduce((total,obj)=>(total+obj.stulist.length),0)
                            rs.testpaper_uuid=rs.uuid
                            setWork(Object.assign(rs,params))
                            setStep(2)
                        }else{
                            $.warning("请选择学员!")
                        }
                        
                    }}/>
            </div>
        )
    }
    let Step3=()=>{
        return (
            <div>
                <div className="ta_c mb_25" style={{marginTop:100}}>
                    <Icon style={{fontSize:60}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                    <div className="fs_20 fb" style={{marginTop:16}}>作业创建完成</div>
                </div>
                <div className="ta_c">
                    <div>作业名称：{work.title}</div>
                    <div>学员人数：{work.num}人</div>
                </div>
                <div className="ta_c mt_15 mb_30">
                    <Btn className="mr_15" type="default" onClick={()=>{
                        parent.close(true)
                    }}>返回列表</Btn>
                    {work.num?<Btn onClick={async ()=>{
                        await $.post('/testpaper/batch/assign',work)
                        parent.setCloseData(true)
                        Modal.info({
                            title:'发布作业',
                            content:(<div className="fs_16">发布成功！</div>),
                            okText:'确定',
                            onOk(){
                                parent.close(true)
                            }
                        })
                    }}>立即发布</Btn>:<Btn onClick={()=>{detail_page.open('作业详情',{uuid:work.uuid})}}>添加学员</Btn>}
                    
                </div>
            </div>
        )
    }
    return (
        <div className="mt_20 bg_white pall_20 br_3" style={{marginBottom:70}}>
            <Steps type="navigation" current={step} style={{boxShadow: '0px -1px 0 0 #e8e8e8 inset'}}>
                <Step status={stepIcon()} title="作业内容" />
                <Step status={stepIcon()} title="接收学员" />
                <Step status={stepIcon()} title="完成" />
            </Steps>
            {step===0&&<Step1/>}
            {step===1&&<Step2/>}
            {step===2&&<Step3/>}
            <Page ref={ref=>detail_page=ref} onClose={()=>{
                parent.close(true)
            }}>
                <Detail/>
            </Page>
        </div>
    )
}