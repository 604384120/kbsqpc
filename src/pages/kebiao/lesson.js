import React,{useState,useEffect} from 'react'
import {$, Btn,Modals,Form,Inputs,FixedBox} from '../comlibs'
import {Page_ChoiceClassStudent,Teacher} from '../works'
import {Alert,Tabs,Table,Radio,InputNumber,Modal} from 'antd'

export default function(props){
    let {TabPane}=Tabs
    let parent=props.Parent
    let data=props.Parent.data
    // let {edit_modal}={}
    let [info,setInfo]=useState({})
    useEffect(()=>{
        load()
    },[])
    async function load(){
        let res=await $.get(`/banji/lesson/${data.uuid}/detail`)
        res.date=res.lessontime.split(' ')[0]
        res.teacher_names=res.teachers.map(rs=>rs.name).join(',')
        setInfo(res)
    }
    async function refresh(){
        let res=await $.get(`/banji/lesson/${data.uuid}/detail`)
        res.date=res.lessontime.split(' ')[0]
        res.teacher_names=res.teachers.map(rs=>rs.name).join(',')
        parent.setCloseData(true)
        setInfo(res)
    }

    function StudentBox(){
        let [uuids,setUuids]=useState('')
        let {dm_modal,daoke_modal,choiceStudent}={}
        let list=info.studentlist||[]
        list.forEach((s,i) => {
            s.key=i
        });
        let columns=[
            {
                title:'序号',
                align:'center',
                key:'i',
                render(rs,key,i){
                    return <div>{i+1}</div>
                }
            },
            {
                title:'姓名',
                dataIndex:'name',
            },
            {
                title:'点名状态',
                key:'status',
                render(rs){
                    if(rs.status==="normal"){
                        return (
                            <div className="box box-ac fc_black5">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#52C41A'}}></div>
                                <span>到课</span>
                            </div>
                        )
                    }else if(rs.status==='absent'){
                        return (
                            <div className="box box-ac fc_black5">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#F5222D'}}></div>
                                <span>缺课</span>
                            </div>
                        )
                    }else if(rs.status==='leave'){
                        return (
                            <div className="box box-ac fc_black5">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#FAAD14'}}></div>
                                <span>请假</span>
                            </div>
                        )
                    }else{
                        return (
                            <div className="box box-ac fc_black5">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#BFBFBF'}}></div>
                                <span>未点名</span>
                            </div>
                        )
                    }
                    
                }
            },
            {
                title:'消耗课时',
                key:'frozenlessons',
                align:'center',
                render(rs){
                    return (
                        <div>{rs.frozenlessons||rs.frozenlessons===0?rs.frozenlessons:'-'}</div>
                    )
                }
            },
            {
                title:'剩余课时',
                key:'remainlessons',
                align:'center',
                render(rs){
                    return (
                        <div>{rs.remainlessons||rs.remainlessons===0?rs.remainlessons:'-'}</div>
                    )
                }
            },
            {
                title:'操作',
                align:'center',
                key:'key',
                render(rs){
                    return (
                        <div className="box box-ac box-pc">
                            {(!info.is_end||info.is_end==='NO')&&rs.status&&(
                                <span className="fs_14 link" onClick={async ()=>{
                                    await $.post(`/lesson/${data.uuid}/rollcall`,{status:'goback',student_uuids:rs.student_uuid})
                                    refresh()
                                }}>取消点名</span>
                            )}
                            {!rs.status&&(
                                <span className="fs_14 link" onClick={()=>{
                                    dm_modal.open('点名',rs.student_uuid)
                                }}>点名</span>
                            )}
                            {
                                (!info.is_end||info.is_end==='NO')&&<span style={{color:'#e9e9e9'}} className="mh_8">|</span>
                            }
                            {
                                (!info.is_end||info.is_end==='NO')&&(
                                    <span className="fs_14 fc_red hover_line pointer" onClick={()=>{
                                        Modal.confirm({
                                            title: '学员移除',
                                            maskClosable:true,
                                            content:(
                                                <div>
                                                    确认从这个课节中移除[{rs.name}]吗？移除后，已扣课时将退回给学员。
                                                </div>
                                            ),
                                            okText:'确定',
                                            onOk:async ()=>{
                                                await $.get('/lesson/student/remove',{target:"lesson",lesson_uuid:info.uuid,student_uuid:rs.student_uuid})
                                                refresh()
                                            }
                                        })
                                    }}>移除</span>
                                )
                            }
                            
                        </div>
                    )
                }
            }
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              setUuids(selectedRows.map(k=>k.student_uuid).join(','))
            },
          };
        function DmBox(props){
            let {form,set}=props
            let {setFieldsValue}=form
            let [num,setNum]=useState(info.lesson_rules.default_lessons)
            return (
                <div>
                {
                    set({
                        name: "status",
                        value:'normal'
                    },()=>(
                        <Radio.Group onChange={e=>{
                            let val=e.target.value
                            if(val==='normal'){
                                setNum(info.lesson_rules.default_lessons)
                                setFieldsValue({["frozenlessons"]: info.lesson_rules.default_lessons } )
                            }else{
                                setNum(0)
                                setFieldsValue({["frozenlessons"]: 0 } )
                            }
                        }}>
                            <Radio value="normal">到课</Radio>
                            <Radio value="leave">请假</Radio>
                            <Radio value="absent">缺课</Radio>
                        </Radio.Group>
                    ))
                }
                
                <div>
                <div>
                    扣课时数：
                    <NumberBox form={form} num={num} set={set}/>
                </div>
                </div>
                <div className="ta_c mt_15">
                    <Btn htmlType='submit'>确定</Btn>
                </div>
            </div>
            )
        }
        function NumberBox(props){
            let {set,form,num=1}=props
            let [i,seti]=useState(num)
            useEffect(()=>{
                seti(num)
            },[num])
            return (
                <div className="dis_ib">
                    <Btn className="mr_3" onClick={()=>{
                        if(i>=0.5){
                            seti(i-0.5)
                            form.setFieldsValue({["frozenlessons"]: i-0.5 } )
                        }
                    }}>-</Btn>
                    {set(
                            {
                                name: "frozenlessons",
                                value:num
                            },()=>(
                                <InputNumber onChange={val=>{
                                    seti(val)
                                }} min={0} />
                            )
                        )
                    }
                    <Btn className="ml_3" onClick={()=>{
                        seti(i+0.5)
                        form.setFieldsValue({["frozenlessons"]: i+0.5 } )
                    }}>+</Btn>
                </div>
            )
        }
        return (
            <div>
                <div className="mb_16">
                {info.is_end!='YES'&&(
                    <Btn className="mr_8" onClick={()=>{
                        if(uuids){
                            daoke_modal.open('点名')
                        }else{
                            $.warning('请选择学员后操作!')
                        }
                    }}>批量到课</Btn>
                )}
                {info.is_end!='YES'&&(
                    <Btn onClick={()=>{
                        choiceStudent.open({
                            onSure: async d => {
                                let student_uuids=d.map(s=>s.student_uuid).join(',')
                                if(!student_uuids)return
                                await $.post(`/group/${info.group_uuid}/student/import`,{lesson_uuids:info.uuid,student_uuids})
                                refresh()
                            }
                        })
                    }}>添加学员</Btn>
                )}
                    
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={list}/>
                <Modals ref={ref=>dm_modal=ref} width="300px">
                    {(student_uuid)=>{
                        return (
                            <Form 
                                onSubmit={async val=>{
                                    if(!val.frozenlessons)val.frozenlessons=0
                                    await $.post(`/lesson/${data.uuid}/rollcall`,{...val,student_uuids:student_uuid})
                                    refresh()
                                    dm_modal.close()
                                    
                                }}>
                                {({form,set})=>{
                                    return (
                                        <DmBox form={form} set={set}/>
                                    )
                                }}
                            </Form>
                        )
                    }}
                </Modals>
                <Modals ref={ref=>daoke_modal=ref} width="300px">
                    {()=>(
                        <Form
                            onSubmit={async val=>{
                                if(!val.frozenlessons)val.frozenlessons=0
                                await $.post(`/lesson/${data.uuid}/rollcall`,{...val,status:'normal',student_uuids:uuids})
                                refresh()
                                daoke_modal.close()
                            }}>
                            {({form,set})=>(
                                <div>
                                    <div>
                                        扣课时数：
                                        <NumberBox form={form} set={set}/>
                                    </div>
                                    <div className="ta_c">
                                        <Btn className="mt_20" htmlType="submit">确定</Btn>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Modals>
                <Page_ChoiceClassStudent ref={ref => (choiceStudent = ref)} />
            </div>
        )
    }

    return (
        <div className="bg_white br_2 mt_10" style={{height:'calc(100% - 20px)'}}>
            <div className="box box-ac mb_18">
                <div className="fs_20 fb box-1">{info.date}({info.week}) {info.time_start}-{info.time_end}</div>
                {
                    info.is_end!='YES'?(
                        <Btn className="mr_8" style={{width:80}} onClick={async ()=>{
                            Modal.confirm({
                                title:'注意',
                                content:(
                                    <div>
                                        请确认该课节下所有的学员都已点名
                                    </div>
                                ),
                                onOk:()=>{
                                    new Promise(async function(res,rej){
                                        await $.post('/lesson/end',{lesson_uuid:info.uuid},()=>{
                                            rej()
                                        })
                                        res()
                                    }).then(()=>{
                                        $.msg("结课成功!")
                                        refresh()
                                    })
                                    
                                }
                            })
                            
                        }}>结课</Btn>
                    ):(
                        <Btn className="mr_8" style={{width:80}} onClick={async ()=>{
                            await $.post('/lesson/end/cancel',{lesson_uuid:info.uuid})
                            $.msg("已取消结课!")
                            refresh()
                        }}>取消结课</Btn>
                    )
                }
                
                {info.is_end!='YES'&&<Btn type="default" className="mr_8" style={{width:80}}
                    onClick={async ()=>{
                        Modal.confirm({
                            title: '提示',
                            content: '确定删除课节吗？删除后，学员的点名签到记录会删除，已扣课时会退回。',
                            okType: 'danger',
                            onOk:async ()=>{
                                await $.get('/lessons/remove',{lesson_uuids:info.uuid})
                                parent.close(true)
                            }
                        })
                        
                    }}
                >删除</Btn>}
            </div>
            <div className="box fs_14 mb_18">
                <div style={{width:500}}>
                    <span className="fc_black2">班级：</span>
                    <span className="fc_black5">{info.name}</span>
                </div>
                <div>
                    <span className="fc_black2">上课教室：</span>
                    <span className="fc_black5">{info.className||'无'}</span>
                </div>
            </div>
            <div className="box fs_14 mb_24">
                <span className="fc_black2">授课老师：</span>
                <span className="fc_black5">{info.teacher_names}</span>
            </div>
            <Alert className="mb_24" message={(
                <div>
                    <span className="fb mr_18">课节概览</span>
                    <span className="fs_14 fc_black5">共{info.member||0}名学员，到课<span className="fc_suc">{info.arrived||0}</span>人，请假<span style={{color:'#FAAD14'}}>{info.leave||0}</span>人，缺课<span className="fc_err">{info.absent||0}</span>人，未点名<span style={{color:'#BFBFBF'}}>{info.unknown||0}</span>人</span>
                </div>
            )} type="warning" />

            <Tabs animated={false} defaultActiveKey="student">
                <TabPane tab="课节学员" key="student">
                    <StudentBox/>
                </TabPane>
            </Tabs>
            {/* <Modals ref={ref=>edit_modal=ref}>
                {()=>(
                    <Form
                        onSubmit={async val=>{
                            // await $.post(`/lessons/delay`,)
                        }}
                    >
                        {({form})=>(
                            <div>
                                <div className="box box-ac mb_20">
                                    <div style={{width:150}} className="ta_r mr_10">上课日期</div>
                                    <Inputs style={{width:200}} name="delaydate" value={info.date} format="YYYY-MM-DD" form={form} type="datePicker" onChange={async (e,str)=>{
                                        await $.post(`/lessons/delay`,{
                                            delaymode:'bydate',
                                            delaydate:str,
                                            lesson_uuids:info.uuid,
                                            classtime:'constant',
                                            group_uuid:info.group_uuid
                                        })
                                        refresh()
                                    }}/>
                                </div>
                                <div className="box box-ac mb_20">
                                    <div style={{width:150}} className="ta_r mr_10">修改上课时间</div>
                                    <Inputs style={{width:200}} mode={["time","time"]} value={[moment(info.time_start,'HH:mm'),moment(info.time_end,'HH:mm')]} name="time" format="HH:mm" form={form} type="rangePicker" onOk={e=>{
                                    }}/>
                                </div>
                                <div className="box box-ac">
                                    <div style={{width:150}} className="ta_r mr_10">更改授课老师</div>
                                    <Teacher style={{width:200}} className="mr_10" multiple={true} form={form} />
                                    <Button htmlType="submit" icon="check"/>
                                </div>
                                
                            </div>
                        )}
                    </Form>
                )}
            </Modals> */}

            <div style={{height:62}}></div>
            <FixedBox>
                <div className="box pl_14" style={{width:'100%'}}>
                    <Btn onClick={()=>{
                        parent.close(true)
                    }}>关闭</Btn>
                </div>
            </FixedBox>

        </div>
    )
}