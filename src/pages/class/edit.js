import React,{useState} from 'react'
import {FixedBox,Btn,Inputs,Form,Modals,Num,$} from '../comlibs'
import {Teacher,Classroom} from '../works'
import { Modal, Switch,Table,Popover } from 'antd'

export default function(props){
    let parent=props.Parent
    let {conflict_modal,classroom_ref}={}
    let b=parent.data
    
    // 消课规则
    let XiaokeBox=()=>{
        let [info,setInfo]=useState(b.lesson_rules||{})
        let {xiaoke_modal}={}
        return (
            <div className="box box-ac" style={{marginBottom:28}}>
                <div style={{width:'16.66666667%'}} className="ta_r fc_black2">消课规则：</div>
                <div style={{paddingLeft:10,marginRight:10}}>
                {
                    info&&(
                        <span className="fc_black5">
                            到课<span className="fc_err">{info.arrived_consume==='YES'?'-'+info.default_lessons:'-1'}</span>课时，请假<span className="fc_err">{info.leave_consume==='YES'?'-'+info.default_lessons:'-0'}</span>课时，缺课<span className="fc_err">{info.absent_consume==='YES'?'-'+info.default_lessons:'-0'}</span>课时
                        </span>
                    )
                }
                </div>
                <span className="fs_14 link" onClick={()=>{
                    xiaoke_modal.open('修改消课规则')
                }}>修改</span>
                <Modals ref={ref=>xiaoke_modal=ref} width="300px">
                    {()=>(
                        <Form 
                            action="/banji/update"
                            method="post"
                            params={{group_uuid:b.uuid}}
                            valueReturn={(val)=>{
                                val.arrived_consume=val.arrived_consume?'YES':'NO'
                                val.leave_consume=val.leave_consume?'YES':'NO'
                                val.absent_consume=val.absent_consume?'YES':'NO'
                                return val
                            }}
                            success={(res,e)=>{            
                                parent.setCloseData(true)
                                e.btn.loading=false
                                xiaoke_modal.close()
                                setInfo(e.values)
                            }}
                        >
                            {({form,set,submit})=>(
                                <div>
                                    <div className="box box-ac mb_15">
                                        <div style={{width:100}} className="ta_r">每节课课时数：</div>
                                        <div className="box-1 ta_c">
                                            <Num set={set} min={0.5} form={form} value={info.default_lessons} name='default_lessons'/>
                                        </div>
                                    </div>
                                    <div className="box box-ac mb_15">
                                        <div style={{width:100}} className="ta_r">到课扣课时：</div>
                                        <div className="box-1 ta_c">
                                            {
                                                set({
                                                    name:'arrived_consume',
                                                    value:info.arrived_consume==='YES'
                                                },()=>(
                                                    <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked={info.arrived_consume==='YES'}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="box box-ac mb_15">
                                        <div style={{width:100}} className="ta_r">请假扣课时：</div>
                                        <div className="box-1 ta_c">
                                            {
                                                set({
                                                    name:'leave_consume',
                                                    value:info.leave_consume==='YES'
                                                },()=>(
                                                    <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked={info.leave_consume==='YES'}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="box box-ac mb_15">
                                        <div style={{width:100}} className="ta_r">缺课扣课时：</div>
                                        <div className="box-1 ta_c">
                                            {
                                                set({
                                                    name:'absent_consume',
                                                    value:info.absent_consume==='YES'
                                                },()=>(
                                                    <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked={info.absent_consume==='YES'}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="box box-pc">
                                        <Btn onClick={submit}></Btn>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Modals>
            </div>
        )
    }

    // 设置教室
    function ClassroomBox(props){
        let {newclass_modal}={}
        let {form}=props
        return (
            <div className="box box-ac" style={{marginBottom:28}}>
                <div style={{width:'16.66666667%'}} className="ta_r fc_black2">上课教室：</div>
                <Classroom name="classroom_uuid" ref={ref=>classroom_ref=ref} style={{paddingLeft:10,width:242,marginRight:10}} form={form} value={b.classroom_uuid}/>
                <span className="fs_14 link" onClick={()=>{newclass_modal.open('创建教室')}}>+新建教室</span>
                <Modals ref={ref=>newclass_modal=ref}>
                    <Form 
                        action='/classroom/create'
                        method="post"
                        labelCol={{span:6}}
                        wrapperCol={{span:18}}
                        success={(res,e)=>{
                            e.btn.loading=false
                            newclass_modal.close()
                            classroom_ref.reload()
                            classroom_ref.setValue(res.uuid)
                        }}
                    >
                        {({form,submit})=>(
                            <div>
                                <div className="mb_14 box box-ac">
                                    <div className="mr_10 ta_r" style={{width:130}}>
                                        <span className="fc_err">*</span>
                                        教室名称：
                                    </div>
                                    <Inputs form={form} placeholder="请输入教室名称" name="name" required/>
                                </div>
                                <div className="mb_18 box box-ac">
                                    <div className="mr_10 ta_r" style={{width:130}}>可容纳人数：</div>
                                    <Inputs form={form} placeholder="请输入可容纳人数" name="limit_member"/>
                                </div>
                                <div className="box box-pc mt_25">
                                    <Btn onClick={submit} className="mr_30" style={{width:120}}></Btn>
                                    <Btn onClick={()=>newclass_modal.close()} style={{width:120}}>取消</Btn>
                                </div>
                            </div>
                        )}
                    </Form>
                </Modals>
            </div>
        )
    }

    // 教室冲突弹窗
    function ConflictBox(){
        let columns=[
            {
                title:'序号',
                dataIndex:'key',
                width:'60px',
                align:'center'
            },{
                title:'上课日期',
                dataIndex:'lesson_date',
                render:(rs)=>(
                    <span>{rs.year}-{rs.origin_date}({rs.week})</span>
                )
            },{
                title:'上课时间',
                dataIndex:'show_start_time',
                render:(rs,o)=>(
                    <span>{o.show_start_time}-{o.show_end_time}</span>
                )
            },{
                title:'班级',
                dataIndex:'banji_name',
                render:(rs)=>(
                    <span>{rs||'-'}</span>
                )
            },{
                title:'上课教室',
                dataIndex:'classroom_name',
                render:(rs)=>(
                    <span>{rs||'-'}</span>
                )
            }
        ]
        return (
            <Modals width="900px" ref={ref=>conflict_modal=ref}>
                {({conflicts,classroom_uuid,group_uuid })=>(
                    <div style={{minHeight:500}}>
                        <div className="box mb_15">
                            <div className="box-1">与以下课节存在冲突</div>
                            <Btn onClick={async ()=>{
                                await $.post('/banji/change/classroom',{classroom_uuid,group_uuid,force:'YES'})
                                classroom_ref.setValue(classroom_uuid)
                                conflict_modal.close()
                                parent.close(true)
                            }}>忽略冲突</Btn>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={conflicts}
                        />
                    </div>
                )}
            </Modals>
        )
    }
    // 对外展示
    function ShowOpen(props){
        let {set,form}=props
        // let [show,setShow]=useState(b.group_show==='YES')
        return (
            <div className="box box-ac" style={{marginBottom:28}}>
                <div style={{width:'16.66666667%'}} className="ta_r fc_black2">展示排序：</div>
                <Inputs className="pl_10" form={form} name="sortby" placeholder="数字越大越靠前" value={b.sortby}/>
            </div>
        )
    }
    // 上课提醒
    function KaikeBox(){
        let [open,setOpen]=useState(b.notice_type&&b.notice_type!='no')
        return (
            <div className="box box-ac" style={{marginBottom:28}}>
                <div style={{width:'16.66666667%'}} className="ta_r fc_black2">上课提醒：</div>
                <div className="box box-ac pl_10">
                    <Switch onClick={async ()=>{
                        let res=await $.post('/banji/update',{group_uuid:b.uuid,notice_type:!open?'WX':'no'})
                        if(res.has_permission==='yes'){
                            setOpen(!open)
                        }else{
                            Modal.info({
                                title:'无法开启',
                                content:'您当前未购买微信通知，无法开启！请联系客服电话：400-766-1816',
                            })
                        }
                        parent.setCloseData(true)
                    }} checked={open}/>
                    <span className="pl_10 fs_13" style={{color:'#FAAD14'}}>
                        * 系统会在上课前一天20:30自动给学员发送上课提醒，支持自定义设置
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Form action="/banji/update"
                method="post"
                params={{group_uuid:b.uuid}}
                valueReturn={val=>{
                    if(!val.students){
                        val.students=99999
                    }
                    return val
                }}
                success={async (rs,e)=>{
                    parent.setCloseData(true)
                    if(e.values.classroom_uuid&&e.values.classroom_uuid!=b.classroom_uuid){
                        let res=await $.post(`/banji/change/classroom`,{classroom_uuid:e.values.classroom_uuid,group_uuid:b.uuid})
                        if(res.conflicts&&res.conflicts.length){
                            let conflicts=res.conflicts.map((o,i)=>{
                                o.key=i+1
                                return o
                            })
                            conflict_modal.open('课时冲突',{classroom_uuid:e.values.classroom_uuid,group_uuid:b.uuid,conflicts})
                        }else{
                            parent.close(true)
                        }
                    }else{
                        if(!e.values.classroom_uuid){
                            $.post('/banji/classroom/remove',{group_uuid:b.uuid})
                        }
                        $.msg('修改成功！')
                        parent.close(true)
                    }
                    
                }}
                labelCol={{span:4}} wrapperCol={{span:20}}>
                {({form,set,submit})=>(
                    <div className="mt_24">
                        <div style={{marginBottom:28}}>
                            <Inputs label="班级名称" style={{width:340}} form={form} required={true} value={b.name} name="name"/>
                        </div>
                        <div style={{marginBottom:28}}>
                            <Inputs label="所授课程" disabled form={form} required={true} value={b.course_name} name="course_name"/>
                        </div>
                        <div style={{marginBottom:28}}>
                            <Teacher name="teacher_uuids" mode="multiple" load={true} value={b.teacher_uuid} label="班主任" style={{width:340}} form={form} multiple required={true} />
                        </div>
                        <Teacher name="assistant_uuids" mode="multiple" load={true} value={b.assistant_uuids||undefined} label="助教" style={{width:340,marginBottom:28}} form={form} multiple />
                        <ClassroomBox form={form}/>
                        <Inputs form={form} value={b.students===99999?'不限':b.students} label="上限人数" style={{marginBottom:30}} name="students" placeholder="默认不限人数"/>
                        <XiaokeBox form={form}/>
                        <KaikeBox/>
                        <ShowOpen set={set} form={form}/>
                        <Inputs form={form} style={{width:'100%',marginBottom:30}} name="price" value={b.price} placeholder="例如120元/课时，3200元/期" label="报名价格"/>
                        <Inputs form={form} rows={5} name="remark" value={b.remark} label="备注" type="textArea"/>
                        <div style={{height:120}}></div>
                        <FixedBox>
                            <div style={{width:'100%'}} className="ml_6">
                                <Btn type="default" className="mr_8" onClick={()=>{
                                    parent.close()
                                }}>取消</Btn>
                                <Btn onClick={submit}>确定</Btn>
                            </div>
                        </FixedBox>
                    </div>
                )}
            </Form>

            <ConflictBox/>
        </div>
    )
}