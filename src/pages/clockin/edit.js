import React,{useState} from 'react'
import {Page_ChoiceTeacher} from '../works'
import {Form,Inputs,Btn,Method} from '../comlibs'
import {Form as Forms,Radio,Checkbox } from 'antd'

export default function(props){
    let parent=props.Parent
    let {Bottom,type,success,clock={},className}=parent?parent.data:props
    let {page_tacher}={}
    let $=new Method()
    const options=[
        {label:'文字',value:'word'},
        {label:'视频',value:'video'},
        {label:'图片',value:'photo'},
        {label:'音频',value:'audio'}
    ]
    // 选择打卡周期
    let SelectTime=(props)=>{
        let [day,setDay]=useState(clock.start_time?$.timeSpace(clock.start_time,clock.end_time):0)
        return (
            <div className="dis_f ai_c mt_30" title={clock.status&&clock.status!=='UNSTART'&&'已开始的和已结束的打卡只允许修改打卡名称，打卡助教，打卡要求'}>
                <Inputs name="time" className="w_500" style={{width:"100%"}} label="打卡周期" disabled={clock.status&&clock.status!=='UNSTART'} mode={['date','date']} value={clock.start_time?[clock.start_time,clock.end_time]:''} type="rangePicker" required={true} {...props} onChange={res => {
                    setDay($.timeSpace(res[0], res[1]))
                }}/>
                <span className="ml_8">共{day}天</span>
            </div>
        )
    }
    // 选择老师
    let SelectTeacher=(props)=>{
        let [teachers,SetTeachers]=useState([])
        let {set}=props
        return (
            <div className="box">
                <div className="ta_r lh_32" style={{width:'166px'}}>打卡助教：</div>
                {set({
                        name: "teacher_uuids",
                    },
                    valueSet=>(
                        <div>
                            <div style={{maxWidth:300,lineHeight: '32px',minHeight:'32px',height: 'auto',whiteSpace: 'break-spaces'}} className="mr_10 mb_10 dis_ib ant-btn ant-btn-primary" onClick={()=>{page_tacher.open({value:teachers,
                            onSure: d => {
                                SetTeachers(d)
                                valueSet(d.map(rs=>rs.teacher_uuid));
                            }})}}><span style={{maxWidth:300}}>{teachers.length>0?teachers.map(tea=>tea.name).join('、'):clock.teacher_names||'选择老师'}</span></div>
                            <span className="dis_ib ml_8">打卡助教可协助学习打卡创建者对学员提交上来的打卡内容进行管理。</span>
                        </div>
                ))}
            </div>
        )
    }
    return (
        <div className={className}>
            <Form labelCol={{span:8}} wrapperCol={{span:16}}
                action={type==='add'?"/clock/add":'/clock/update'}
                method="POST"
                params={{
                    clock_uuid:clock.uuid
                }}
                success={async (res) => {
                    success&&success(res,parent)
                }}
                valueReturn={(res)=>{
                    res.content=res.content.join(",")
                    if(res.teacher_uuids&&res.teacher_uuids.length!==0)res.teacher_uuids=res.teacher_uuids.join(",")
                    if(!res.teacher_uuids||res.teacher_uuids.length===0)delete res.teacher_uuids
                    res.start_time=res.time[0]
                    res.end_time=res.time[1]
                    
                    delete res.time
                    return res
                }}>
                {({form,set,submit})=>(
                    <div>
                        <div className="dis_f mt_30">
                            <Inputs name="name" className="w_500" value={clock.name} style={{width:"100%"}} label="打卡名称" required={true} form={form}/>
                        </div>
                        <SelectTime form={form}/>
                        <div className="mt_30 dis_f ai_c">
                            <SelectTeacher set={set}/>
                        </div>
                        
                        <div className="mt_30 dis_f" title={clock.status&&clock.status!=='UNSTART'&&'已开始的和已结束的打卡只允许修改打卡名称，打卡助教，打卡要求'}>
                            <Forms.Item label="补打卡" className="w_500" labelCol={{span:8}} wrapperCol={{span:16}}>
                                {form.getFieldDecorator("repair", {
                                    initialValue: clock.repair||'NO'
                                    })(
                                        <Radio.Group disabled={clock.status&&clock.status!=='UNSTART'} className="box box-ver pt_8">
                                            <Radio value="YES">允许</Radio>
                                            <Radio value="NO">不允许</Radio>
                                        </Radio.Group>
                                    )}
                            </Forms.Item>
                        </div>
                        <div className="mt_30 dis_f">
                            <Forms.Item label="打卡提交内容" title={clock.status&&clock.status!=='UNSTART'&&'已开始的和已结束的打卡只允许修改打卡名称，打卡助教，打卡要求'} style={{width:500}} labelCol={{span:8}} wrapperCol={{span:16}}>
                                <div className="fc_err lh_40" style={{whiteSpace:"nowrap"}}>（学员提交打卡时必须包含以下所设置的内容，才可提交打卡成功）</div>
                                {form.getFieldDecorator("content", {
                                    initialValue: clock.content||["word"],
                                    rules:[{required:true,message:"打卡提交内容至少保留一项"}]
                                    })(
                                    <Checkbox.Group disabled={clock.status&&clock.status!=='UNSTART'} className="ml_8" options={options}/>
                                )}
                            </Forms.Item>
                        </div>
                        <div className="mt_30">
                            <Inputs label="打卡要求" required value={clock.memo} name="memo" className="w_800" labelCol={{span:5}} wrapperCol={{span:19}} rows={4} type="textArea" form={form}/>
                        </div>
                        <Bottom submit={submit}/>
                    </div>
                )}
            </Form>

            <Page_ChoiceTeacher ref={(ref)=>{page_tacher=ref}}/>
        </div>
    )
}