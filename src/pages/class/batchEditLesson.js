import React from 'react'
import {Form,Inputs,FixedBox,Btn,$,Page} from '../comlibs'
import {Radio} from 'antd'
import {Teacher} from '../works'
import Conflict from './conflict'

export default function(props){
    let parent=props.Parent
    let {lesson_uuids,group_uuid}=parent.data
    let {con_page}={}
    return (
        <div className="mt_20 bg_white br_3 pall_20">
            <Form
                onSubmit={async (e,btn)=>{
                    setTimeout(()=>{
                        btn.loading=false
                    },5000)
                    let value={delaymode:'byweek',delaydays:0,lesson_uuids,group_uuid}
                    if(e.is_date&&e.delaydays){
                        value.delaydays	=e.delaydays
                    }
                    if(e.is_time&&(!e.start_time||!e.end_time)){
                        $.warning('上课时间请填写完整')
                    }else if(e.is_time&&e.start_time&&e.end_time){
                        value.classtime='unite'
                        let start=e.start_time.split(':')
                        let end=e.end_time.split(':')
                        value.hour=start[0]
                        value.minute=start[1]
                        value.end_hour=end[0]
                        value.end_minute=end[1]
                    }
                    if(e.is_date||e.is_time||e.is_teacher||e.is_assistant){
                        if(e.is_teacher&&e.teacher_uuids)value.teacher_uuids=e.teacher_uuids
                        if(e.is_assistant&&e.assistant_uuids)value.assistant_uuids=e.assistant_uuids
                        let res=await $.post('/lessons/delay/changeteacher',value,()=>{btn.loading=false})
                        res.group_uuid=group_uuid
                        con_page.open('课节预览',res,{left:150})
                    }
                    
                    if(!e.is_teacher&&!e.is_assistant&&!e.is_time&&!e.is_date){
                        $.warning('您没有任何修改')
                        btn.loading=false
                    }
                }}

            >
                {({form,set,submit})=>(
                    <div>
                        <div className="mb_30">
                            <div className="mb_10 fb fs_20">上课日期</div>
                            <div className="box box-ac">
                                {
                                    set(
                                        {
                                            name:"is_date",
                                            value:false
                                        },()=>(
                                            <Radio.Group>
                                                <Radio value={false}>维持不变</Radio>
                                                <Radio value={true}>
                                                    往后延期
                                                    <Inputs form={form} className="mh_10" style={{width:120}} onFocus={()=>{
                                                        form.setFieldsValue({
                                                            is_date: true,
                                                        });
                                                    }} name="delaydays"/> 天
                                                </Radio>
                                            </Radio.Group>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="mb_30">
                            <div className="mb_10 fb fs_20">上课时间</div>
                            <div className="box box-ac">
                                {
                                    set(
                                        {
                                            name:"is_time",
                                            value:false
                                        },()=>(
                                            <Radio.Group>
                                                <Radio value={false}>维持不变</Radio>
                                                <Radio value={true}>
                                                    调整时间
                                                    <Inputs onFocus={()=>{
                                                        form.setFieldsValue({
                                                            is_time: true,
                                                        });
                                                    }} className="mr_10 ml_15" form={form} type="timePicker" name="start_time" value="07:30" format="HH:mm" placeholder="开始时间"/>
                                                    <Inputs onFocus={()=>{
                                                        form.setFieldsValue({
                                                            is_time: true,
                                                        });
                                                    }} form={form} type="timePicker" name="end_time" value="08:30" format="HH:mm" placeholder="开始时间"/>
                                                </Radio>
                                            </Radio.Group>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="mb_30">
                            <div className="mb_10 fb fs_20">授课老师</div>
                            <div className="box box-ac">
                                {
                                    set(
                                        {
                                            name:"is_teacher",
                                            value:false
                                        },()=>(
                                            <Radio.Group>
                                                <Radio value={false}>维持不变</Radio>
                                                <Radio value={true}>
                                                    更换老师
                                                    <Teacher onFocus={()=>{
                                                        form.setFieldsValue({
                                                            is_teacher: true,
                                                        });
                                                    }} multiple={true} mode="multiple" className="ml_15" form={form} placeholder="请选择授课老师" name="teacher_uuids" style={{width:300}}/>
                                                </Radio>
                                            </Radio.Group>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="mb_30">
                            <div className="mb_10 fb fs_20">助教老师</div>
                            <div className="box box-ac">
                                {
                                    set(
                                        {
                                            name:"is_assistant",
                                            value:false
                                        },()=>(
                                            <Radio.Group>
                                                <Radio value={false}>维持不变</Radio>
                                                <Radio value={true}>
                                                    更换老师
                                                    <Teacher onFocus={()=>{
                                                        form.setFieldsValue({
                                                            is_assistant: true,
                                                        });
                                                    }} multiple={true} mode="multiple" className="ml_15" form={form} placeholder="请选择助教老师" name="assistant_uuids" style={{width:300}}/>
                                                </Radio>
                                            </Radio.Group>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div style={{height:70}}></div>
                        <FixedBox>
                            <div style={{width:'100%'}}>
                                <Btn className="mr_10" type="default" onClick={()=>{
                                    parent.close()
                                }}>取消</Btn>
                                <Btn onClick={submit}>确定</Btn>
                            </div>
                        </FixedBox>
                    </div>
                )}
            </Form>
            <Page ref={ref=>con_page=ref} background="#fff" onClose={()=>{
                parent.close(true)
            }}>
                <Conflict/>
            </Page>
        </div>
    )
}