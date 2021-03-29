import React, { useState, useEffect } from 'react'
import {Modals,Form, Inputs,FixedBox,Btn,Num,$,Page} from '../comlibs'
import {Course,Teacher,Classroom} from '../works'
import {Steps,Modal,Switch,Table,Icon,Popover} from 'antd'
import AddLesson from './addLesson'
import AddStu from './addStu'
import Detail from './detail'

export default function(props){
    const { Step } = Steps;
    let parent=props.Parent
    let {b={},detail_page,classroom_ref,conflict_modal,step,setStep,current,setCurrent,video_modal}={}

    let to=(i)=>{
        setStep(i)
        setCurrent(i)
    }

    // 步骤条
    let StepsBox=()=>{
        [step,setStep]=useState(0)
        let stutas=(index)=>{
            if(index>step)return 'wait'
            if(index===step)return 'process'
            if(index<step)return 'finish'
        }
        return (
            <Steps
                type="navigation"
                current={step}
                >
                <Step
                    title="基本信息"
                    status={stutas(0)}
                />
                <Step
                    title={"班级设置"}
                    status={stutas(1)}
                />
                <Step
                    title="添加排课"
                    status={stutas(2)}
                />
                <Step
                    title="添加学员"
                    status={stutas(3)}
                />
                <Step
                    title="完成"
                    status={stutas(4)}
                />
            </Steps>
        )
    }
    // 内容组合
    let Content=()=>{
        [current,setCurrent]=useState(0)
        return (
            <div>
                {current===0&&<InfoBox/>}
                {current===1&&<ClassSet/>}
                {current===2&&<AddLessonBox/>}
                {current===3&&<AddStuBox/>}
                {current===4&&<FinishBox/>}
            </div>
        )
    }
    // 基本信息
    let InfoBox=()=>{
        let {course_modal,course}={}
        return (
            <div className="pall_20">
                <Form
                    action="/banji/create"
                    method="post"
                    params={{
                        default_lessons:1,
                        arrived_consume:'YES',
                        absent_consume:'NO',
                        leave_consume:'NO',
                        client:'pc'
                    }}
                    success={(res)=>{
                        parent.setCloseData(true)
                        b=res
                        to(1)
                    }}
                >
                    {({form,submit})=>(
                        <div style={{height:400}}>
                            <div className="box box-ac mb_20">
                                <div style={{width:100}} className="ta_r mr_10"><span className="mr_3 fc_err">*</span>班级名称：</div>
                                <Inputs style={{width:230}} required form={form} name="name" placeholder="请输入班级名称"/>
                            </div>
                            <div className="box box-ac">
                                <div style={{width:100}} className="ta_r mr_10"><span className="mr_3 fc_err">*</span>所授课程：</div>
                                <Course disabled={parent?.data?.course_uuid ? true : false} value={parent?.data?.course_uuid} form={form} ref={ref=>course=ref} required name="course_uuid" style={{width:150}} className="mr_15" params={{status: "online"}}/>
                                <span className="ml_6 fs_14 link" onClick={()=>course_modal.open('新建课程',form)}>新建课程</span>
                            </div>

                            <FixedBox>
                                <Btn onClick={submit}>下一步</Btn>
                            </FixedBox>
                        </div>
                    )}
                </Form>
                <Modals ref={ref=>course_modal=ref} width="400px">
                    {(form)=>(
                        <Form
                        action="/course/create"
                        method="post"
                        success={(res)=>{
                            course.list()
                            form.setFieldsValue({course_uuid:res.course_uuid})
                            course_modal.close()
                        }}
                        >
                        {({form,submit})=>(
                            <div>
                                <div className="box box-ac mb_10">
                                    <div className="ta_r mr_10" style={{width:120}}><span className="fc_err mr_3">*</span>课程名称：</div>
                                    <Inputs required form={form} name='name' placeholder="请输入课程名称"/>
                                </div>
                                <div className="box box-ac">
                                    <div className="ta_r mr_10" style={{width:120}}><span className="fc_err mr_3">*</span>单课时长：</div>
                                    <Inputs required style={{width:100}} form={form} name='duration'/>
                                    <span className="ml_15 fs_14">分钟/课时</span>
                                </div>
                                <div className="box box-pc mt_20">
                                    <Btn onClick={e=>submit(e)}/>
                                </div>
                            </div>
                        )}
                    </Form>
                    )}
                </Modals>
            </div>
        )
    }
    // 添加排课
    let AddLessonBox=()=>{
        return (
            <div className="pall_20" style={{paddingLeft:100}}>
                <div className="mb_15 box box-ac">
                    <div className="mr_25">请选择一个排课方式进行排课。</div>
                    <a className="mr_10 fc_blue pointer hover_line" target="_blank" href="https://www.yuque.com/zwriad/bz1d16/class_scheduling">图文教程</a>
                    <span className="fc_blue pointer hover_line" onClick={()=>video_modal.open('视频教程')}>视频教程</span>
                </div>
                <AddLesson group_uuid={b.uuid} onOver={()=>{
                    to(3)
                }} course_uuid={b.course_uuid} bottom={(props)=>{
                    let {submit}=props
                    return (
                        <FixedBox>
                            <Btn type="default" className="mr_8" onClick={()=>{
                                console.log('b:',b)
                                to(1)
                            }}>上一步</Btn>
                            <Btn onClick={submit}>下一步</Btn>
                        </FixedBox>
                    )
                }}/>
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
            <Modals onCancel={()=>{
                to(2)
            }} width="900px" ref={ref=>conflict_modal=ref}>
                {({conflicts,classroom_uuid,group_uuid })=>(
                    <div style={{minHeight:500}}>
                        <div className="box mb_15">
                            <div className="box-1">与以下课节存在冲突</div>
                            <Btn onClick={async ()=>{
                                await $.post('/banji/change/classroom',{classroom_uuid,group_uuid,force:'YES'})
                                classroom_ref.setValue(classroom_uuid)
                                conflict_modal.close()
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

    // 班级设置
    let ClassSet=()=>{
        // 设置教室
        function ClassroomBox(props){
            let {newclass_modal}={}
            let {form}=props
            return (
                <div className="box box-ac mb_15">
                    <div style={{width:130}} className="ta_r mr_30">上课教室：</div>
                    <Classroom name="classroom_uuid" ref={ref=>classroom_ref=ref} style={{width:310,marginRight:10}} form={form}/>
                    <span className="fs_14 fc_blue pointer hover_line" onClick={()=>{newclass_modal.open('创建教室')}}>+新建教室</span>
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
                                            <span className="fc_err mr_3">*</span>
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
            // 消课规则
        let XiaokeBox=(props)=>{
            let [info,setInfo]=useState(b.lesson_rules.absent_consume?b.lesson_rules:{default_lessons:1,arrived_consume:'YES',absent_consume:'NO',leave_consume:'NO'})
            let {xiaoke_modal}={}
            return (
                <div className="box box-ac" style={{marginBottom:28}}>
                    <div style={{width:130}} className="ta_r mr_30">消课规则：</div>
                    <div>
                    {
                        b.lesson_rules.absent_consume?(
                            <span className="fc_black5">
                                到课<span className="fc_err">{info.arrived_consume==='YES'?'-'+info.default_lessons:'-0'}</span>课时，请假<span className="fc_err">{info.leave_consume==='YES'?'-'+info.default_lessons:'-0'}</span>课时，缺课<span className="fc_err">{info.absent_consume==='YES'?'-'+info.default_lessons:'-0'}</span>课时
                            </span>
                        ):(
                            <span className="fc_black5">
                                到课<span className="fc_err">-0</span>课时，请假<span className="fc_err">-0</span>课时，缺课<span className="fc_err">-0</span>课时
                            </span>
                        )
                    }
                    </div>
                    <span className="fs_14 link ml_10" onClick={()=>{
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
                                    b.lesson_rules=e.values
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
        // 开课提醒
        function KaikeBox(){
            let [open,setOpen]=useState(b.notice_type&&b.notice_type!='no')
            return (
                <div className="box box-ac" style={{marginBottom:28}}>
                    <div style={{width:'130px',color:'rgba(0,0,0,.65)'}} className="ta_r fc_black2 mr_30">上课提醒：</div>
                    <div className="box box-ac pl_10">
                        <Switch onClick={async ()=>{
                            let res=await $.post('/banji/update',{group_uuid:b.uuid,notice_type:!open?'wx':'no'})
                            if(res.has_permission==='yes'){
                                setOpen(!open)
                            }else{
                                Modal.info({
                                    title:'无法开启',
                                    content:'您当前未购买微信通知，无法开启！请联系客服电话：400-766-1816',
                                })
                            }
                            
                        }} checked={open}/>
                        <span className="pl_10 fs_13" style={{color:'#FAAD14'}}>
                            * 系统会在上课前一天20:30自动给学员发送上课提醒，支持自定义设置
                        </span>
                    </div>
                </div>
            )
        }
        return (
            <Form
                action="/banji/update"
                method="post"
                params={{group_uuid:b.uuid}}
                valueReturn={val=>{
                    val.notice_type=val.notice_type?'WX':'no'
                    return val
                }}
                success={async (rs,e)=>{
                    parent.setCloseData(true)
                    b=Object.assign(b,e.values)
                    if(e.values.classroom_uuid){
                        await $.post(`/banji/change/classroom`,{classroom_uuid:e.values.classroom_uuid,group_uuid:b.uuid})
                        to(2)
                        // if(res.conflicts&&res.conflicts.length){
                        //     let conflicts=res.conflicts.map((o,i)=>{
                        //         o.key=i+1
                        //         return o
                        //     })
                        //     classroom_ref.setValue('')
                        //     conflict_modal.open('课时冲突',{classroom_uuid:e.values.classroom_uuid,group_uuid:b.uuid,conflicts})
                        // }else{
                        //     to(2)
                        // }
                    }else{
                        to(2)
                    }
                    
                }}
            >
                {({form,submit,set})=>(
                    <div className="pall_20">
                        <div className="box box-ac mb_15">
                            <div style={{width:130}} className="ta_r mr_30"><span className="mr_3 fc_err">*</span>班主任：</div>
                            <Teacher load name="teacher_uuids" mode="multiple" style={{width:400}} value={b.teacher_uuids||undefined} form={form} multiple showPhone required/>
                        </div>
                        <div className="box box-ac mb_15">
                            <div style={{width:130}} className="ta_r mr_30">助教：</div>
                            <Teacher load name="assistant_uuids" mode="multiple" style={{width:400}} value={b.assistant_uuids||undefined} form={form} multiple showPhone/>
                        </div>
                        <ClassroomBox form={form}/>
                        <XiaokeBox form={form}/>
                        {/* <div className="box box-ac mb_15">
                            <div style={{width:130,height:'100%'}} className="ta_r mr_30">开课提醒：</div>
                            {
                                set({
                                    name:"notice_type",
                                    value:b.notice_type&&b.notice_type!='no'
                                },()=>(
                                    <Switch defaultChecked={b.notice_type&&b.notice_type!='no'}/>
                                ))
                            }
                            <span className="pl_13 fs_13" style={{color:'#FAAD14'}}>*系统会在上课前一天{campus_obj.custom_time||'20:30'}自动给学员发送上课提醒，支持自定义设置</span>
                        </div> */}
                        <KaikeBox/>
                        <div className="box box-ac mb_15">
                            <div style={{width:130,height:'100%'}} className="ta_r mr_30" placeholder="默认不限人数">上限人数：</div>
                            <Inputs form={form} style={{width:400}} name="students" value={b.students!=99999?b.students:''} placeholder="默认不限人数"/>
                        </div>
                        <div className="box mb_15">
                            <div style={{width:130,height:'100%'}} className="ta_r mr_30">备注：</div>
                            <Inputs form={form} style={{width:400}} name="remark" type="textArea" value={b.remark} rows={5}/>
                        </div>
                        <div style={{height:100}}></div>
                        <FixedBox>
                            <Btn onClick={submit}>下一步</Btn>
                        </FixedBox>
                    </div>
                )}
            </Form>
        )
    }

    let FinishBox=()=>{
        let [info,setInfo]=useState(b)
        useEffect(()=>{
            (async ()=>{
                let res=await $.get("/banji/detail",{group_uuid:b.uuid})
                setInfo(res)
            })()
        },[])
        return (
            <div>
                <div className="ta_c mb_30" style={{marginTop:100}}>
                    <Icon style={{fontSize:60}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                    <div className="fs_20 fb" style={{marginTop:16}}>班级创建完成!</div>
                </div>
                <div className="box box-pc box-ac box-ver" >
                    <div style={{width:500,backgroundColor:'rgb(245, 245, 245)',padding:'15px 80px'}} className="fc_black">
                        <div className="mb_18 fs_20 fb">{info.name}</div>
                        <div className="mb_24">
                            <span className="mr_15 fs_14">
                                <span>班主任：</span>
                                <span className="fc_black5">{info.teachers_name}</span>
                            </span>
                            <span className="mr_15">
                                <span>助教：</span>
                                <span className="fc_black5">{info.assistants_name||'无'}</span>
                            </span>
                            <span>上课教室：
                                <span className="fc_black5">{info.classroom_name||'无'}</span>
                            </span>
                        </div>
                        <div>
                            <span className="mr_15">排课：
                                <span className="fc_black5">{info.classtimes||0}节</span>
                            </span>
                            <span>学员人数：
                                <span className="fc_black5">{info.member||0}人</span>
                            </span>
                        </div>
                    </div>

                    <div className="box box-pc mt_20">
                        <Btn type="default" className="mr_18" size="large" style={{width:200}} onClick={()=>{
                            detail_page.open('班级详情',{uuid:info.uuid})
                        }}>查看详情</Btn>
                        <Btn size="large" style={{width:200}} onClick={()=>{
                            parent.close(true)
                        }}>返回班级列表</Btn>
                    </div>
                </div>
            </div>
        )
    }

    // 添加学员
    let AddStuBox=()=>{
        return (
            <div>
                <AddStu onSure={async (list)=>{
                    if(!list.length)return
                    let student_uuids=list.map(s=>s.student_uuid).join(',')
                    await $.post(`/group/student/import`,{group_uuid:b.uuid,student_uuids})
                    to(4)
                }} course_uuid={b.course_uuid} bottom={({sure})=>{
                    return (
                        <FixedBox>
                            <Btn type="default" className="mr_10" onClick={()=>{
                                to(4)
                            }}>暂不添加</Btn>
                            <Btn onClick={sure}>下一步</Btn>
                        </FixedBox>
                    )
                }}/>
            </div>
        )
    }
    


    return (
        <div className="bg_white mt_24 br_3 pall_20">
            <StepsBox/>
            <Content/>
            <ConflictBox/>
            <Page ref={ref=>detail_page=ref}>
                <Detail/>
            </Page>

            <Modals width='1000px' bodyStyle={{padding:0}} ref={ref=>video_modal=ref}>
                <video style={{width:'100%'}} controls src="https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/4createclass.Ogg" autoPlay/>
            </Modals>
        </div>
    )
}