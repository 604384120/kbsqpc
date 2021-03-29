import React, { useState, useEffect } from 'react'
import {Form,Inputs,$,TablePagination,Modals,Btn,FixedBox,Page} from "../comlibs"
import {InputNumber,Radio,Checkbox,Button,Table, Modal} from 'antd'
import Moment from 'moment'
import Conflict from './conflict'
import AddStu from './addStu'

export default function(props){
    let parent=props.Parent
    let data=parent?parent.data:props
    let {date,course_uuid,group_uuid}=parent?parent.data:props
    if(!date){date=Moment(new Date())}
    let Bottom=data.bottom
    let {onOver}=data
    let {keys,setKeys,type='WEEK',setType,rule,setRule,times,setTimes,con_page}={}
    let [stuList,setStuList]=useState([])
    let [showStu,setShowStu]=useState(false)
    useEffect(()=>{
        (async ()=>{
            if(parent){
                let res=await $.get(`/banji/${data.group_uuid}/students`,{status:'UNWITHDRAWAL',course_uuid:data.course_uuid})
                res=res.map(s=>{
                    s.key=s.student_uuid
                    return s
                })
                setStuList(res)
            }
        })()
    },[])
    let width=80

    // 修改上课时长弹框
    function ClassTime(props){
        let {valueSet,form}=props
        let {edit_ref}={}
        let value=form.getFieldValue('classtime')||60
        let [time,setTime]=useState(value)
        
        return (
            <div>
                <div className="box-pc box box-ac br_3" style={{border:'1px solid #e6e6e6',height:30,width:100}} onClick={()=>{
                    edit_ref.open('请输入上课时长')
                }}>{time}</div>
            <Modals width="350px" ref={ref=>edit_ref=ref}>
                <Form onSubmit={(val,e)=>{
                    e.loading=false
                    if(val.classtime!=value){
                        if(rule.length!=0){
                            Modal.confirm({
                                title:'注意',
                                content:'当前修改的课时长度与之前的不一致，将会清空已添加的上课规则！',
                                onOk(){
                                    setRule([])
                                    valueSet(val.classtime||0)
                                    setTime(val.classtime||0)
                                    edit_ref.close()
                                }
                            })
                        }else{
                            valueSet(val.classtime||0)
                            setTime(val.classtime||0)
                            edit_ref.close()
                        }
                        let start_time=form.getFieldValue('start_time')
                        if(start_time){
                            form.setFieldsValue({
                                'end_time': Moment(start_time._d).add(val.classtime,'m')
                            });
                        }
                    }else{
                        edit_ref.close()
                    }
                }}>
                    {({set,submit})=>(
                        <div className="box box-pc box-ver box-ac">
                            <div>
                            {set({
                                name:'classtime',
                                value
                            },()=>(
                                <InputNumber style={{width:200}} min={0}/>
                            ))}
                            </div>
                            <div className="mt_20">
                                <Btn onClick={submit}/>
                            </div>
                        </div>
                    )}
                </Form>
            </Modals>
            </div>
        )
    }

    // 按周循环
    function WeekBox(props){
        let {form,set}=props
        return (
            <div>
                <div className="box box-ac mb_25 mt_20">
                    <div style={{width}} className="ta_r">上课时长：</div>
                    <div className="box box-ac">
                        {
                            set({
                                name:'classtime',
                                value:60
                            },(valueSet)=>(
                                <ClassTime form={form} valueSet={valueSet}/>
                            ))
                        }
                        <span className="ml_8">分钟</span>
                    </div>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">开课日期：</div>
                    <Inputs form={form} type="datePicker" value={date} name="start_date"/>
                </div>
                <div className="box mb_25">
                    <div style={{marginTop:5,width}} className="ta_r">结束方式：</div>
                    <div>
                        {
                            set({
                                name:'end_signal',
                                value:'LESSONTIMES'
                            },()=>(
                                <Radio.Group defaultValue="LESSONTIMES">
                                    <Radio className="dis_b mb_25" value="LESSONTIMES">
                                        按总课节数
                                        <Inputs className="ml_8" placeholder="不得超过200节" form={form} name="end_lessontimes" min={0} min={300}/>
                                    </Radio>
                                    <Radio className="dis_b mb_25" value="DATE">
                                        按结束日期
                                        <Inputs type="datePicker" className="ml_8" form={form} name="end_date"/>
                                    </Radio>
                                </Radio.Group>
                            ))
                        }
                    </div>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">排除：</div>
                    {
                        set({
                            name:'ignore_types'
                        },()=>(
                            <Checkbox.Group>
                                <Checkbox value="HOLIDAY">法定节假日</Checkbox>
                            </Checkbox.Group>
                        ))
                    }
                    <span className="ml_15 fs_14" style={{color:'#FAAD14'}}>*次年法定节假日未出，无法排除，请知晓</span>
                </div>
                <AddRulesBox form={form} set={set}/>
            </div>
        )
    }

    // 添加上课规则弹框
    function AddRulesBox(props){
        [rule,setRule]=useState([])
        let {form}=props
        
        let {rule_modals}={}
        let text={'Mon':'周一','Tue':'周二','Wed':'周三','Thu':'周四','Fri':'周五','Sat':'周六','Sun':'周日'}
        return (
            <div className="box mb_25">
                <div style={{width}} className="ta_r mt_8">上课规则：</div>
                <div>
                    <div className="dis_f f_wrap" style={{width:450}}>
                        {rule.map((w,i)=>{
                            return <div key={i} className="mr_8 mt_8 mb_8">{text[w.week]} {w.time}
                                <span className="fc_blue hover_line pointer ml_6" onClick={()=>{
                                    rule.splice(i,1)
                                    setRule([].concat(rule))
                                }}>删除</span>
                            </div>
                        })}
                    </div>
                    <Button onClick={()=>{
                        if(!form.getFieldValue('classtime')){
                            $.msg('请填写上课时长!')
                            return
                        }
                        rule_modals.open('添加上课规则')
                }} style={{width:157,border:'1px solid #1890FF',color:'#1890FF'}} ghost>+添加上课规则</Button>
                </div>

                <Modals width="540px" ref={ref=>rule_modals=ref}>
                     <Form onSubmit={val=>{
                        let min=form.getFieldValue('classtime');
                        let time=val.time+"-"+(Moment(val.time.split(':').map((item) => parseInt(item)), 'HH:mm').add(min,'m').format('HH:mm'));
                        // let time=val.time+"-"+(Moment('2019-2-10 '+val.time).add(min,'m').format('HH:mm'));
                        setRule(rule.concat(val.week.map(w=>({
                            week:w,
                            time
                        }))))
                        rule_modals.close()
                     }}>
                         {({form,set,submit})=>(
                             <div>
                                 <div className="box">
                                    <div style={{width:120}} className="ta_r">选择周几：</div>
                                    {set({
                                        name:'week',
                                        required:true
                                    },()=>(
                                        <Checkbox.Group className="dis_f f_wrap box-1">
                                            <div style={{width:80}} className="mb_15">
                                                <Checkbox value='Mon'>周一</Checkbox>
                                            </div>
                                            <div style={{width:80}} className="mb_15">
                                                <Checkbox value='Tue'>周二</Checkbox>
                                            </div>
                                            <div style={{width:80}} className="mb_15">
                                                <Checkbox value='Wed'>周三</Checkbox>
                                            </div>
                                            <div style={{width:80}} className="mb_15">
                                                <Checkbox value='Thu'>周四</Checkbox>
                                            </div>
                                            <div style={{width:80}} className="mb_15">
                                                <Checkbox value='Fri'>周五</Checkbox>
                                            </div>
                                            <div style={{width:80}} className="mb_15">
                                                <Checkbox value='Sat'>周六</Checkbox>
                                            </div>
                                            <div style={{width:80}} className="mb_15">
                                                <Checkbox value='Sun'>周日</Checkbox>
                                            </div>
                                        </Checkbox.Group>
                                    ))}
                                    
                                </div>
                                <div className="box box-ac">
                                    <div style={{width:120}} className="ta_r">上课开始时间：</div>
                                    <Inputs type="timePicker" value='07:30' required name="time" form={form}/>
                                </div>
                                <div className="mt_20 box box-pc">
                                    <Btn onClick={submit}/>
                                </div>
                            </div>
                         )}
                     </Form>
                </Modals>
            </div>
        )
    }
    // 添加上课时间弹窗
    function AddtimeBox(props){
        [times,setTimes]=useState([])
        let {form,set}=props
        let {rule_modals}={}
        return (
            <div className="box mb_25">
                <div style={{width}} className="ta_r mt_8">上课时间：</div>
                <div>
                    <div className="dis_f f_wrap" style={{width:450}}>
                        {times.map((t,i)=>(
                            <div key={i} className="mr_8 mt_8 mb_8">{t}
                                <span className="fc_blue hover_line pointer ml_6" onClick={()=>{
                                    times.splice(i,1)
                                    setTimes([].concat(times))
                                }}>删除</span>
                            </div>
                        ))}
                    </div>
                    <Button onClick={()=>{
                        if(!form.getFieldValue('classtime')){
                            $.msg('请填写上课时长!')
                            return
                        }
                        rule_modals.open('添加上课规则')
                }} style={{width:157,border:'1px solid #1890FF',color:'#1890FF'}} ghost>+添加上课时间</Button>
                </div>

                <Modals width="540px" ref={ref=>rule_modals=ref}>
                     <Form onSubmit={val=>{
                        let min=form.getFieldValue('classtime')
                        let time=val.time+"-"+(Moment('2019-2-10 '+val.time).add(min,'m').format('HH:mm'))
                        times.push(time)
                        setTimes([].concat(times))
                        rule_modals.close()
                     }}>
                         {({form,set,submit})=>(
                             <div>
                                <div className="box box-ac">
                                    <div style={{width:120}} className="ta_r">上课时间：</div>
                                    <Inputs type="timePicker" value='07:30' required name="time" form={form}/>
                                </div>
                                <div className="mt_20 box box-pc">
                                    <Btn onClick={submit}/>
                                </div>
                            </div>
                         )}
                     </Form>
                </Modals>
            </div>
        )
    }

    // 按天
    function DayBox(props){
        let {form,set}=props
        return (
            <div>
                <div className="box box-ac mb_25 mt_20">
                    <div style={{width}} className="ta_r">上课时长：</div>
                    <div className="box box-ac">
                        {
                            set({
                                name:'classtime',
                                value:60
                            },valueSet=>(
                                <ClassTime form={form} valueSet={valueSet}/>
                            ))
                        }
                        <span className="ml_8">分钟</span>
                    </div>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">开课日期：</div>
                    <Inputs form={form} type="datePicker" value={date} name="start_date"/>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">日期规则：</div>
                    <Inputs form={form} value="" name="next_day" select={[
                        {
                            text:'每天',
                            value:''
                        },{
                            text:'间隔1天',
                            value:1
                        },{
                            text:'间隔2天',
                            value:2
                        },{
                            text:'间隔3天',
                            value:3
                        }
                    ]}/>
                </div>
                <div className="box mb_25">
                    <div style={{marginTop:5,width}} className="ta_r">结束方式：</div>
                    <div>
                        {
                            set({
                                name:'end_signal',
                                value:'LESSONTIMES'
                            },()=>(
                                <Radio.Group defaultValue="LESSONTIMES">
                                    <Radio className="dis_b mb_25" value="LESSONTIMES">
                                        按总课节数
                                        <Inputs className="ml_8" form={form} placeholder="不得超过200节" name="end_lessontimes" min={0} min={300}/>
                                    </Radio>
                                    <Radio className="dis_b mb_25" value="DATE">
                                        按结束日期
                                        <Inputs type="datePicker" className="ml_8" form={form} name="end_date"/>
                                    </Radio>
                                </Radio.Group>
                            ))
                        }
                    </div>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">排除：</div>
                    {
                        set({
                            name:'ignore_types'
                        },()=>(
                            <Checkbox.Group className="box">
                                <Checkbox value="WEEKEND" style={{'whiteSpace': 'nowrap'}}>周六、周日</Checkbox>
                                <Checkbox value="HOLIDAY" style={{'whiteSpace': 'nowrap'}}>法定节假日</Checkbox>
                            </Checkbox.Group>
                        ))
                    }
                    <span className="ml_15 fs_14" style={{color:'#FAAD14'}}>*次年法定节假日未出，无法排除，请知晓</span>
                </div>
                <AddtimeBox form={form} set={set}/>
            </div>
        )
    }

    // 单次课节
    function OneBox(props){
        let {form,set}=props
        // let start_time=form.getFieldValue('start_time')||Moment('2020-01-01 07:30')
        // let end_time=start_time.add(classtime,'m').format('HH:mm')
        // console.log('classtime:',classtime)
        return (
            <div className="mt_20">
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">开课日期：</div>
                    <Inputs form={form} type="datePicker" value={date} name="start_date"/>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">上课时间：</div>
                    <Inputs form={form} allowClear={false} value="07:30" type="timePicker" onChange={res=>{
                        if(form.getFieldValue('classtime')){
                            form.setFieldsValue({
                                'end_time': Moment(res._d).add(form.getFieldValue('classtime'),'m'),
                            });
                        }
                    }} name="start_time"/>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">上课时长：</div>
                    {set({
                        name:"classtime",
                        value:60
                    },valueSet=>(<ClassTime form={form} valueSet={valueSet}/>))}
                    <span className="ml_8">分钟</span>
                </div>
                <div className="box box-ac mb_25">
                    <div style={{width}} className="ta_r">下课时间：</div>
                    <Inputs form={form} value='08:30' type="timePicker" allowClear={false} name="end_time"/>
                </div>
            </div>
        )
    }

    // 学员列表
    function StuTable(){
        [keys,setKeys]=useState(stuList.map(stu=>stu.student_uuid))
        let columns=[
            {
                title:()=>(
                    <div>全选（已选<span style={{color:'#3FADFF'}}>{keys.length}</span>人）</div>
                ),
                dataIndex:'name',
                width:'400px'
            },{
                title:'剩余课时',
                width:'150px',
                align:'center',
                dataIndex:'remainlessons'
            }

        ]
        return (
            <div>
                <div className="fb fs_20 mb_20">选择学员</div>
                <Table
                    columns={columns}
                    rowSelection={{
                        selectedRowKeys:keys,
                        onChange: selectedRowKeys => {
                            setKeys(selectedRowKeys)
                        },
                    }}
                    pagination={false}
                    dataSource={stuList}
                />
            </div>
        )
    }

    function Wrap(props){
        [type,setType]=useState('WEEK')
        let {form,set}=props
        return (
            <div>
                <Radio.Group onChange={e=>{
                    setType(e.target.value)   
                    form.setFieldsValue({
                        'classtime': 60
                    })              
                }} defaultValue={type}>
                    <Radio.Button value="WEEK">按周循环</Radio.Button>
                    <Radio.Button value="DAY">按天</Radio.Button>
                    <Radio.Button value="ONE">单次课节</Radio.Button>
                </Radio.Group>
                {type==='WEEK'&&<WeekBox form={form} set={set}/>}
                {type==='DAY'&&<DayBox form={form} set={set}/>}
                {type==='ONE'&&<OneBox form={form} set={set}/>}
                
            </div>
        )
    }

    return (
        <div>
        {!showStu?(
        <Form
            valueReturn={val=>{
            if(!val.start_date)return {error:true,msg:'请填写上课日期!'}
            if(type==='WEEK'){
                if(!rule.length)return {error:true,msg:'请添加上课规则!'};
                if(val.ignore_types){
                    if(val.ignore_types.some(v=>v==='WEEKEND')){
                        val.ignore_types.splice(0,1)
                    }
                    val.ignore_types=val.ignore_types.join(',')
                }
                let week={Mon:[],Tue:[],Wed:[],Thu:[],Fri:[],Sat:[],Sun:[]}
                rule.forEach(r => {
                    week[r.week].push(r.time)
                });
                week={Mon:week.Mon.join(','),Tue:week.Tue.join(','),Wed:week.Wed.join(','),Thu:week.Thu.join(','),Fri:week.Fri.join(','),Sat:week.Sat.join(','),Sun:week.Sun.join(',')}
                val=Object.assign(val,week)
            }
            if(type==='DAY'){
                if(!times.length)return {error:true,msg:'请添加上课时间!'};
                val.DAY=times.join(',')
            }
            if(type==='WEEK'||type==='DAY'){
                val.schdule_type=type
                if(val.end_signal==='LESSONTIMES'){
                    if(!val.end_lessontimes){
                        return {error:true,msg:'请填写总课节数!'}
                    }
                }else{
                    if(!val.end_date){
                        return {error:true,msg:'请填写结束日期!'}
                    }
                }
            }else{
                val.schdule_type='DAY'
                val.end_lessontimes=1
                val.end_signal='LESSONTIMES'
                val.DAY=val.start_time+'-'+val.end_time
            }
            return val
        }}
            onSubmit={async (val,btn)=>{
                if(val.error){
                    $.warning(val.msg);
                    btn.loading=false
                    return;
                }
                val.group_uuid=data.group_uuid
                let res=await $.post('/banji/insert/lessons',val,err=>{
                    btn.loading=false
                })
                res.group_uuid=data.group_uuid
                con_page.open('课节预览',res,{left:150})
                btn.loading=false
            }}
            >
            {({form,set,submit})=>(
                <div>
                    <div className={`bg_white box br_3 ${parent?'pall_24 mt_20':''}`} style={{marginBottom:70}}>
                        <div className="box-1">
                            {parent&&<div className="fb fs_20 mb_20">添加排课</div>}
                            <Wrap form={form} set={set}/>
                        </div>
                        {stuList.length?
                        <div className="box-1">
                            <StuTable/>
                        </div>:""}
                    </div>
                    
                    {Bottom?(
                        <Bottom submit={submit}/>
                    ):(
                        <FixedBox>
                            <Btn type="default" className="mr_8" onClick={()=>{
                                parent&&parent.close()
                            }}>取 消</Btn>
                            <Btn onClick={submit}>排课</Btn>
                        </FixedBox>
                    )}
                    
                    <Page background="#fff" ref={ref=>con_page=ref} onClose={async lesson_uuids=>{
                        if(Bottom){
                            onOver&&onOver()
                            return
                        }
                        if(keys&&keys.length){
                            await $.post(`/group/student/import`,{
                                student_uuids:keys.join(','),
                                lesson_uuids,
                                group_uuid:data.group_uuid
                            })
                        }else if(!keys){
                            parent.setCloseData(true)
                            setShowStu(lesson_uuids)
                            return
                        }
                        parent.close(true)
                    }}>
                        <Conflict/>
                    </Page>
                </div>
            )}
        </Form>
        ):(
            <div className="bg_white mt_20">
                <h3 className="fs_20 fb" style={{marginBottom:0,padding:'15px 0 0 15px'}}>请选择课节学员</h3>
                <AddStu onSure={async (list)=>{
                    if(!list.length)return
                    await $.post(`/group/student/import`,{group_uuid,student_uuids:list.map(l=>l.student_uuid),lesson_uuids:showStu})
                    parent.close(true)
                }} course_uuid={course_uuid} bottom={({sure})=>{
                    return (
                        <FixedBox>
                            <Btn className="mr_15" type="default" onClick={()=>{
                                parent.close(true)
                            }}>暂不添加</Btn>
                            <Btn onClick={sure}></Btn>
                        </FixedBox>
                    )
                }}/>
            </div>
        )}
        
        </div>
    )
}