import React,{useState,useEffect} from 'react'
import {$,Btn,Form,Inputs, TablePagination,Page,Modals} from '../comlibs'
import {Modal,Switch,Dropdown,Menu,Button,Tabs,Radio,Tooltip,Icon,Spin,Table,Popover } from 'antd'
import {Subject,Grades} from '../works'
import Moment from 'moment'
import LessonDetail from './lessondetail'
import Edit from './edit'
import AddStu from './addStu'
import AddLesson from './addLesson'
import BatchLesson from './batchLesson'
import UpGroup from './upGroup'
import ChangeClass from './changeClass'
import CommentDetail from '../comment/class_detail'

export default function(props){
    let {TabPane}=Tabs
    let parent=props.Parent
    parent.setCloseData(true)
    // let identity=$.store().GlobalData.user_power
    let { uuid } = parent?.data||{};
	!uuid && (uuid = $.getQueryString('uuid'));
    let {choiceClass,edit_page,data_tab,lessonDetail_page,addlesson_page,stu_page,info,up_page,setInfo,out_modal,stu_tab,tab1,buy_modal,batch_page,kebiao_form, myDate = new Date(),comment_page}={}
    let power={}
    useEffect(()=>{
        (async ()=>{
            let res1=await $.get('/user/power/detail',{})
            power=res1
            let res2=await $.get('/banji/detail',{group_uuid:uuid})
            data_tab&&data_tab.reload()
            setInfo(res2)
        })()
    },[])

    async function getInfo(buuid){
        buuid&&(uuid=buuid)
        let res2=await $.get('/banji/detail',{group_uuid:uuid})
        data_tab&&data_tab.reload()
        setInfo(res2)
    }

    let InfoBox=()=>{
        return (
            <div className="bg_white ph_24 pb_4 pt_10 mt_20 b_1 pst_rel">
                {info.is_end==='YES'&&<img style={{right:0,bottom:0,width:70}} className="pst_abs" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/8f60a918-ce43-11ea-8b99-00163e04cc20.png"/>}
                <div className="box box-ac mb_14">
                    <div className="box-1 box box-ac">
                        {
                            info.join_way&&(<div>
                                {info.join_way==='normal'?(
                                    <div className="br_4 ph_10 pv_3 mr_10" style={{background:'#FFF9EC',color:'#FFA92D'}}>普通班</div>
                                ):(
                                    <div className="br_4 ph_10 pv_3 mr_10" style={{background:'#F3FFE7',color:'#52C41A'}}>约课班</div>
                                )}
                            </div>)
                        }
                        <div className="fs_20 fc_black fb">{info.name}</div>
                    </div>
                    {info.is_end==='YES'?(
                        <div>
                            <Btn onClick={async ()=>{
                                await $.post("/banji/end/cancel", { group_uuid: uuid });
                                getInfo()
                                $.msg('取消结班成功！')
                            }}>取消结班</Btn>
                        </div>
                    ):(
                    <div>
                        <Btn className="mr_8" onClick={()=>{
                            let left=(document.body.clientWidth-200)/2
                            edit_page.open('编辑班级信息',info,{left})
                        }}>编 辑</Btn>
                        <Button type="primary" ghost className="mr_8" onClick={()=>{
                            up_page.open('升班',{old_group_uuid:uuid,course_name:info.course_name,course_uuid:info.course_uuid,up_status:'up'},{left:500})
                        }}>升 班</Button>
                        <Dropdown overlay={(
                            <Menu>
                                <Menu.Item onClick={async ()=>{
                                    await $.post("/banji/end",{ group_uuid: uuid });
                                    getInfo()
                                }}>
                                    <span>
                                        结班
                                    </span>
                                </Menu.Item>
                                <Menu.Item onClick={async ()=>{
                                    Modal.confirm({
                                        title: "提示",
                                        content:"确定删除该班级吗？删除后无法恢复，学员已扣课时将退回。",
                                        async onOk() {
                                          await $.get("/banji/remove", { group_uuid: uuid });
                                          parent.close(true)
                                        },
                                      });
                                }}>
                                    <span>
                                        删除
                                    </span>
                                </Menu.Item>
                            </Menu>
                        )} placement="bottomRight">
                            <Button type="primary" ghost>更多</Button>
                        </Dropdown>
                    </div>
                    )}
                </div>
                <div className="box fs_14">
                    <div style={{width:400}}>
                        <div className="mb_18 box">
                            <div className="fc_black">班主任：</div>
                            <div className="fc_black5">{info.teachers_name||'无'}</div>
                        </div>
                        <div className="mb_18">
                            <span className="fc_black">课程：</span>
                            <span className="fc_black5">{info.course_name}</span>
                        </div>
                        <div className="mb_18">
                            <span className="fc_black">消课规则：</span>
                            {
                                info.lesson_rules&&(
                                    <span className="fc_black5">
                                        到课<span className="fc_err">{info.lesson_rules.arrived_consume==='YES'?'-'+info.lesson_rules.default_lessons:'-0'}</span>课时，请假<span className="fc_err">{info.lesson_rules.leave_consume==='YES'?'-'+info.lesson_rules.default_lessons:'-0'}</span>课时，缺课<span className="fc_err">{info.lesson_rules.absent_consume==='YES'?'-'+info.lesson_rules.default_lessons:'-0'}</span>课时
                                    </span>
                                )
                            }
                            
                        </div>
                    </div>
                    <div style={{width:300}}>
                        <div className="mb_18 box">
                            <div className="fc_black" style={{whiteSpace:'nowrap'}}>助教：</div>
                            <div className="fc_black5">{info.assistants_name||'无'}</div>
                        </div>
                        <div className="mb_18">
                            <span className="fc_black">上限人数：</span>
                            <span className="fc_black5">{info.students===99999?'不限':info.students}</span>
                        </div>
                        <div className="mb_18">
                            <span className="fc_black">备注：</span>
                            <span className="fc_black5">{info.remark||'无'}</span>
                        </div>
                    </div>
                    <div style={{width:400}}>
                        <div className="mb_18">
                            <span className="fc_black">上课教室：</span>
                            <span className="fc_black5">{info.classroom_name||'无'}</span>
                        </div>
                        <div className="mb_18">
                            <span className="fc_black">排序：</span>
                            <span className="fc_black5">{info.sortby||0}</span>
                        </div>
                        <div className="mb_18 box">
                            <span className="fc_black">上课提醒：</span>
                            <Switch disabled={info.is_end==='YES'} checked={info.notice_type!='no'} onChange={async e=>{
                                let res=await $.post('/banji/update',{notice_type:e?'WX':'no',group_uuid:uuid})
                                if(res.has_permission==='yes'){
                                    $.msg('修改成功！')
                                }else{
                                    Modal.info({
                                        title:'无法开启',
                                        content:'您当前未购买微信通知，无法开启！请联系客服电话：400-766-1816',
                                    })
                                }
                                getInfo()
                            }}/>
                        </div>
                    </div>
                </div>
                <Page background="#fff" ref={ref=>edit_page=ref} onClose={()=>{
                    getInfo()
                }}>
                    <Edit/>
                </Page>
            </div>
        )
    }
    let Overview=()=>{
        return (
            <div className="mv_20 b_1 pv_18 pl_24 pr_16 bg_white box box-ac" style={{height:60}}>
                <div className="box box-1 box-ac">
                    <span className="fc_black2 fb pr_24 fs_16">班级概览</span>
                    <span className="fs_14">
                        已上<span className="fc_suc">{info.finished_classtimes||0}</span>节/总{info.classtimes||0}节，
                        <span className="fc_err">{info.cnt_unfinished||0}</span>节课未结课；
                        <span style={{color:'#1890FF'}}>{info.cnt_withdrawal||0}</span>人在读，<span style={{color:'#FAAD14'}}>{info.cnt_unwithdrawal||0}</span>人退班，
                        {/* <span className="fc_suc">{info.finished_students||0}</span>人已完课， */}
                        <span className="fc_suc">{info.cnt_frozenlessons||0}</span>人课时不足
                        {/* ，<span className="fc_err">??</span>人课时不足 */}
                    </span>
                </div>
                {power!='teacher'&&(
                    <div className="pr_24">
                        
                            <Btn className="mr_8" onClick={()=>{
                                if(info.teachers_name){
                                    addlesson_page.open('添加排课',{group_uuid:uuid,course_uuid:info.course_uuid})
                                    return
                                }
                                Modal.confirm({
                                    title:'提示',
                                    content:'当前班级未设置班主任，无法排课',
                                    okText:'去设置',
                                    onOk(){
                                        let left=(document.body.clientWidth-200)/2
                                        edit_page.open('编辑班级信息',info,{left})
                                    }
                                })
                            }}>添加排课</Btn>
                            <Btn onClick={()=>{
                                stu_page.open('添加学员',{async onSure(list){
                                    if(!list.length)return
                                    $.msg('学员添加成功！')
                                    getInfo()
                                    tab1&&tab1.reload()
                                    stu_tab&&stu_tab.reload()
                                },group_uuid:uuid,course_uuid:info.course_uuid,havelesson:info.cnt_unfinished})
                            }}>添加学员</Btn>
                    </div>
                )}
                
                <Page ref={ref=>addlesson_page=ref} onClose={()=>{
                    getInfo()
                    tab1&&tab1.reload()
                    stu_tab&&stu_tab.reload()
                    kebiao_form&&kebiao_form._form._handleSubmit({});
                }}>
                    <AddLesson/>
                </Page>
                <Page ref={ref=>stu_page=ref}>
                    <AddStu/>
                </Page>
            </div>
        )
    }

    let TabsBox=()=>{
        let columns1=[
            {
                title:'序号',
                dataIndex:'_key'
            },
            {
                title:'上课日期',
                key:'lessondate',
                render(rs,obj){
                    return <div className="link" onClick={()=>{
                        lessonDetail_page.open('课节详情',{uuid:rs.uuid})
                    }}>{rs.lessondate} {rs.week}</div>
                }
            },
            {
                title:'上课时间',
                key:'starttime',
                render(rs){
                    return <div>{rs.starttime}-{rs.endtime}</div>
                }
            },
            {
                title:'授课老师',
                key:'teachers',
                render(rs){
                    return <div>{rs.teachers&&rs.teachers.length?rs.teachers.map(t=>t.name).join(','):'-'}</div>
                }
            },
            {
                title:'助教老师',
                key:'assistants',
                render(rs){
                    return <div>{rs.assistants&&rs.assistants.length?rs.assistants.map(t=>t.name).join(','):'-'}</div>
                }
            },
            {
                title:'实到/请假/缺课/应到',
                key:'student',
                render(rs){
                    return (
                        <div>{rs.arrived||0}/{rs.leave||0}/{rs.absent||0}/{rs.member||0}</div>
                    )
                }
            }
        ]
        columns1.push(
                {
                    title:'操作',
                    key:'edit',
                    render(rs){
                        if(info.is_end==='YES'){
                            return (
                                <div className="box box-ac">
                                    {
                                        rs.is_end==='YES'?(
                                            <span style={{color:'rgba(0,0,0,0.2)'}}>
                                                <span>取消结课</span>
                                                <span className="mh_3">|</span>
                                                <span>删除</span>
                                            </span>
                                        ):(
                                            <span style={{color:'rgba(0,0,0,0.2)'}}>
                                                <span>结课</span>
                                                <span className="mh_3">|</span>
                                                <span>删除</span>
                                            </span>
                                        )
                                    }
                                </div>
                            )
                        }
                        
                        return (
                            <div className="box box-ac">
                                {rs.is_end==='YES'?(
                                    <span className="fc_blue pointer hover_line" onClick={async ()=>{
                                        await $.post(`/lesson/end/cancel`,{lesson_uuid:rs.uuid})
                                        getInfo()
                                        tab1.reload()
                                        $.msg('取消结课成功！')
                                    }}>取消结课</span>
                                ):(
                                    <span className="fc_blue pointer hover_line" onClick={async ()=>{
                                        await $.post(`/lesson/end`,{lesson_uuid:rs.uuid})
                                        getInfo()
                                        tab1.reload()
                                        $.msg('结课成功！')
                                    }}>结课</span>
                                )}
                                <span className="mh_3">|</span>
                                <span className="fc_del pointer hover_line" onClick={()=>{
                                    Modal.confirm({
                                        title:'注意',
                                        content:'确定删除课节吗？删除后，学员的点名签到记录会删除，已扣课时会退回。',
                                        async onOk(){
                                            await $.get('/lessons/remove',{
                                                lesson_uuids:rs.uuid
                                            })
                                            getInfo()
                                            tab1.reload()
                                        }
                                    })
                                }}>删除</span>
                            </div>
                        )
                    }
                }
            )
    

        return (
            <div className="mv_20 b_1 pb_18 bg_white">
            <Tabs animated={false} defaultActiveKey="lesson" onChange={key=>{
                if(key==='student'){stu_tab&&stu_tab.reload()}
            }} renderTabBar={(props, DefaultTabBar)=>(
                <div>
                    <DefaultTabBar {...props} style={{padding:'0 23px',boxShadow:'0px -1px 0px 0px rgba(0,0,0,0.09)'}} />
                </div>
            )}>
                <TabPane tab="课节列表" key="lesson" className="ph_32">
                    <Form 
                        valueReturn={val=>{
                            if(val.date){
                                val.min_date=val.date[0]
                                val.max_date=val.date[1]
                            }
                            return val
                        }}
                        onSubmit={val=>{
                          if (val.lesson_status === "finished") {
                            val.is_end = "YES"
                          }
                          if (val.lesson_status === "unfinished") {
                            val.is_end = "NO";
                          }
                          tab1.search(val)
                        }}>
                        {({form})=>(
                            <div className="mb_15 box box-ac">
                                {/* <Inputs autoSubmit className="mr_16" form={form} name="date" format="YYYY-MM-DD" value={[Moment(new Date()),Moment(new Date()).add(1, 'years')]} placeholder={['不限','不限']} type="rangePicker"/> */}
                                <div>
                                <Inputs autoSubmit className="mr_16" form={form} name="date" format="YYYY-MM-DD" value={[Moment(new Date()), Moment(myDate.getFullYear() + 1 + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate())]} type="rangePicker" 
                                  onChange={e => {
                                    tab1.search({
                                      min_date: e[0].split(" ")[0],
                                      max_date: e[1].split(" ")[0]
                                    });
                                  }}/>
                                <Inputs autoSubmit className="mr_16" style={{width:150}} form={form} name="is_end" type='select' placeholder="全部课节状态" select={[
                                    {
                                        text:'全部课节状态',
                                        value:''
                                    },
                                    {
                                        text:'未结课',
                                        value:'NO'
                                    },
                                    {
                                        text:'已结课',
                                        value:'YES'
                                    }
                                ]}/>
                                </div>
                                {
                                    info.is_end!=='YES'&&(
                                        <Btn style={{width:90}} onClick={()=>{
                                            batch_page.open('批量操作',{group_uuid:uuid})
                                        }}>批量操作</Btn>
                                    )
                                }
                                
                            </div>
                        )}
                    </Form>
                    <TablePagination
                        ref={ref=>tab1=ref}
                        api="/v2/lessons"
                        columns={columns1}
                        params={{
                            group_uuid:uuid,
                            min_date:$.dateFormat(new Date,'YYYY-MM-DD'),
                            max_date:$.dateFormat(Moment(new Date).add(1,'years')._d,'YYYY-MM-DD')
                        }}
                    />
                </TabPane>
                <TabPane tab="班级学员" key="student">
                    <StudentBox/>
                </TabPane>
                <TabPane tab="课表" key="kebiao">
                    <KebiaoBox/>
                </TabPane>
                <TabPane tab="作业" key="homework">
                    <HomeWork/>
                </TabPane>
                <TabPane tab="课后点评" key="comment">
                    <CommentBox/>
                </TabPane>
                <TabPane tab="成绩" key="score">
                    <ScoreBox/>
                </TabPane>
                <TabPane tab="线上报名申请" key="baomin">
                    <BaominBox/>
                </TabPane>
                <TabPane tab="操作日志" key="data">
                    <DataBox/>
                </TabPane>
            </Tabs>
            </div>
        )
    }
    // 操作日志
    function DataBox(){
		let columns=[
			{
				title:'序号',
				dataIndex:'_key'
			},{
				title:'日期',
				dataIndex:'date'
			},{
				title:'时间',
				dataIndex:'time'
			},{
				title:'操作人员',
				dataIndex:'teacher_name'
			},{
				title:'动作',
				dataIndex:'action_name'
			},{
				title:'内容',
                key:'log_memo',
                render(rs){
                    if(rs.type==='delete'){
                        return (
                        <div>删除
                            <Popover content={rs.date_text.replace(',','，')} trigger="click">
                                <span className="fc_blue pointer hover_line">{rs.lessons.length}节课</span>
                            </Popover>
                        </div>
                        )
                    }else{
                        return rs.log_memo
                    }
                }
			}
		]
		return (
			<div className="pl_20 pr_20 pb_20">
                <div className="mb_15 fc_err">点名日志需要在对应的课节中查看</div>
				<TablePagination
                    ref={ref=>data_tab=ref}
					columns={columns}
					api="/banji/lesson/logs/list"
					params={{
                        group_uuid:uuid
					}}
				/>
			</div>
		)
	}
    // 班级学员
    function StudentBox(){
        let [status,setStatus]=useState('UNWITHDRAWAL')
        // 在读学员列表
        let columns=[
            {
                title:'序号',
                dataIndex:'_key'
            },
            {
                title:'学员姓名',
                dataIndex:'name',
                render(rs,obj){
                    return <a className="link" target="_blank" href={"/pc#/student_detail?uuid="+obj.student_uuid}>{rs}</a>
                }
            },{
                title:()=>(
                    <div className="box box-ac box-pc">
                        <span className="mr_5">已排课节</span>
                        <Tooltip arrowPointAtCenter placement="topRight" title="学员在该班级中，加入了多少课节">
                            <Icon type="exclamation-circle" className="poninter"/>
                        </Tooltip>
                    </div>
                ),
                align:'center',
                dataIndex:'group_lessons',
            },{
                title:()=>(
                    <div className="box box-ac box-pc">
                        <span className="mr_5">待上课节</span>
                        <Tooltip arrowPointAtCenter placement="topRight" title="上课时间还未开始的课节">
                            <Icon type="exclamation-circle" className="poninter"/>
                        </Tooltip>
                    </div>
                ),
                align:'center',
                dataIndex:'wait_lessons',
                render(text, rs){
                  return <span style={rs.wait_lessons <= 0 ? {color: "red"} : undefined}>{text}</span>
                }
            },{
                title:()=>(
                    <div className="box box-ac box-pc">
                        <span className="mr_5">本班消耗课时</span>
                        <Tooltip arrowPointAtCenter placement="topRight" title="学员在本班扣除的课时数">
                            <Icon type="exclamation-circle" className="poninter"/>
                        </Tooltip>
                    </div>
                ),
                align:'center',
                dataIndex:'frozenlessons',
                render:(rs)=><span>{rs||0}</span>
            },{
                title:()=>(
                    <div className="box box-ac box-pc">
                        <span className="mr_5">剩余课时</span>
                        <Tooltip arrowPointAtCenter placement="topRight" title="学员在本班对应的课程中剩余的课时">
                            <Icon type="exclamation-circle" className="poninter"/>
                        </Tooltip>
                    </div>
                ),
                align:'center',
                dataIndex:'remainlessons',
                render(text, rs){
                  return <span style={rs.remainlessons <= 0 ? {color: "red"} : undefined}>{text}</span>
                }
            },{
                title:'微信是否绑定',
                dataIndex:'gzh_bind',
                align:'center',
                render(rs){
                    return <span>{rs==='YES'?'是':'否'}</span>
                }
            },{
                title:'入班日期',
                dataIndex:'inclass_time'
            }
        ]
        columns.push({
                title:'操作',
                render(rs){
                    if(info.is_end==='YES'){
                        return (
                            <div className="box box-ac" style={{color:'rgba(0, 0, 0, 0.2)'}}>
                                <span>续费</span>
                                <span className="mh_8">|</span>
                                <span>调班</span>
                            </div>
                        )
                    }
                    return (
                        <div className="box box-ac">
                            <span className="fc_blue pointer hover_line" onClick={()=>{
                                buy_modal.open('购买课时',rs)
                            }}>续费</span>
                            <span className="mh_8">|</span>
                            <span className="fc_blue hover_line pointer" onClick={()=>{
                                choiceClass.open('学员调班',{
                                    course_uuid:info.course_uuid,
                                    student:rs,
                                    old_group:info
                                  },{left:300})
                            }}>调班</span>
                        </div>
                    )
                }
            })
        // 已退班学员
        let tui_column=[
            {
                title:'序号',
                align:'center',
                dataIndex:'_key'
            },
            {
                title:'学员姓名',
                dataIndex:'name',
                render(rs,obj){
                    return <a className="link" target="_blank" href={"/pc#/student_detail?uuid="+obj.student_uuid}>{rs}</a>
                }
            },{
                title:'已上课课节',
                align:'center',
                dataIndex:'aleady_lessons'
                
            },{
                title:'本班消耗课时',
                align:'center',
                dataIndex:'frozenlessons',
                render:(rs)=><span>{rs||0}</span>
            },{
                title:'入班日期',
                dataIndex:'inclass_time'
            },{
                title:'退班日期',
                dataIndex:'outclass_time'
            }
        ]
            tui_column.push({
                title:'操作',
                key:'edit',
                render(rs){
                    return (
                        <div className="box box-ac">
                            <span className="link" onClick={()=>{
                                Modal.confirm({
                                    title:'提示',
                                    content:`确定将学员${rs.name}重新加入班级吗？`,
                                    async onOk(){
                                        await $.post('/group/student/import',{group_uuid:uuid,student_uuids:rs.student_uuid})
                                        $.msg('重新入班成功！')
                                        getInfo()
                                        stu_tab.reload()
                                    }
                                })
                            }}>重新入班</span>
                            <span className="mh_8">|</span>
                            <span className="fc_err hover_line pointer" onClick={()=>{
                                Modal.confirm({
                                    title:'提示',
                                    content:`确定将学员${rs.name}移除此班吗？`,
                                    async onOk(){
                                        await $.post(`/banji/student/batch/delete`,{group_uuid:uuid,student_uuids:rs.student_uuid})
                                        $.msg('移除成功！')
                                        getInfo()
                                        stu_tab.reload()
                                        }
                                })
                            }}>移除</span>
                        </div>
                    )
                }
            })

        return (
            <div className="ph_20">
                <div className="box box-ac mb_20">
                    <Radio.Group style={{marginRight:40}} className="box box-ac mt_10" defaultValue='UNWITHDRAWAL' onChange={e=>{
                        setStatus(e.target.value)
                    }}>
                        <Radio value='UNWITHDRAWAL'>在读学员</Radio>
                        <Radio value='WITHDRAWAL'>已退班学员</Radio>
                    </Radio.Group>
                    {power!='teacher'&&(<div>
                        {info.uuid&&info.is_end!=='YES'&&status==='UNWITHDRAWAL'&&(
                            <Btn className="mr_15" onClick={()=>{
                                let student_uuids=Object.keys(stu_tab.selectedRowObjs).join(',')
                                if(!student_uuids){
                                    $.msg('请选择学员后再操作!')
                                    return
                                }
                                Modal.confirm({
                                    title:'退班提示',
                                    content:'确定批量退班所选学员吗？退班后系统保留学员已上课信息与已扣课时信息。',
                                    async onOk(){
                                        await $.post(`/banji/student/batch/remove`,{group_uuid:uuid,student_uuids,lesson_status:'unfinished'})
                                        getInfo()
                                        stu_tab.delSelectionAll()
                                        stu_tab.reload()
                                    }
                                })
                            }}>退 班</Btn>
                        )}
                        
                        <Button type="primary" className="mr_15" ghost style={{background:'#fff',color:'#3fadff',border:'1px solid #3fadff'}} onClick={()=>{
                            out_modal.open('班级学员导出')
                        }}>导出学员</Button>
                    </div>)
                    }
                    {(info.uuid&&info.is_end!=='YES')&&(
                        <Button type="danger" ghost onClick={()=>{
                            let student_uuids=Object.keys(stu_tab.selectedRowObjs).join(',')
                            if(!student_uuids){
                                $.msg('请选择学员后再操作!')
                                return
                            }
                            Modal.confirm({
                                title:'移除提示',
                                content:'确定批量移除所选学员吗？移除后系统不保留学员的上课信息，并退回已扣除课时。',
                                async onOk(){
                                    await $.post(`/banji/student/batch/delete`,{group_uuid:uuid,student_uuids})
                                    getInfo()
                                    stu_tab.delSelectionAll()
                                    stu_tab&&stu_tab.reload()
                                }
                            })
                        }}>移 除</Button>
                        )}
                </div>
                {status==='UNWITHDRAWAL'?(
                    <TablePagination ref={ref=>stu_tab=ref} keyName="student_uuid" rowSelection columns={columns} api={`/banji/${uuid}/students`} params={{status:'UNWITHDRAWAL'}}/>
                ):(
                    <TablePagination ref={ref=>stu_tab=ref} keyName="student_uuid" rowSelection columns={tui_column} api={`/banji/${uuid}/students`} params={{status:'WITHDRAWAL'}}/>
                )}
                
                
            </div>
        )
    }

    function Wrap(){
        [info,setInfo]=useState({})
        return (
            <div>
                <InfoBox/>
                {info.is_end!='YES'&&<Overview/>}
                {info.uuid&&<TabsBox/>}
            </div>
        )
    }
    // 续费
    function BuyLessonBox(){
        return (
            <Modals width="700px" ref={ref=>buy_modal=ref}>
                {(stu)=>(
                    <Form
                        valueReturn={val=>{
                            if(!val.consumedlessons)val.consumedlessons=0
                            if(!val.giftlessons)val.giftlessons=0
                            return val
                        }}
                        action="/courselessons/add"
                        params={{course_uuid:info.course_uuid,student_uuid:stu.student_uuid}}
                        method="post"
                        success={res=>{
                            stu_tab.reload()
                            buy_modal.close()
                        }}
                    >
                        {({form,submit})=>(
                            <div>
                                <div className="box">
                                    <div style={{width:'50%'}}>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r">学员姓名</div>
                                            <div>{stu.name}</div>
                                        </div>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r"><span className="mr_3 fc_err">*</span>缴费金额</div>
                                            <Inputs form={form} name="fee" required style={{width:180}} placeholder="请输入金额"/>
                                        </div>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r"><span className="mr_3 fc_err">*</span>缴费方式</div>
                                            <Inputs form={form} value="alipay" name="channel" type="select" required style={{width:180}} select={[
                                                {
                                                    value:'alipay',
                                                    text:'支付宝'
                                                },{
                                                    value:'wxpay',
                                                    text:'微信支付'
                                                },{
                                                    value:'bankpay',
                                                    text:'银行转账'
                                                },{
                                                    value:'cash',
                                                    text:'现金支付'
                                                },{
                                                    value:'other',
                                                    text:'其他渠道'
                                                }
                                            ]}/>
                                        </div>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r">赠送课时数</div>
                                            <Inputs placeholder="选填" name="giftlessons" style={{width:180}} form={form}/>
                                        </div>
                                    </div>


                                    <div style={{width:'50%'}}>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r">购买课程</div>
                                            <div>{info.course_name}</div>
                                        </div>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r"><span className="mr_3 fc_err">*</span>缴费日期</div>
                                            <Inputs form={form} name="paytime" style={{width:180}} required type="datePicker"/>
                                        </div>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r"><span className="mr_3 fc_err">*</span>购买课时数</div>
                                            <Inputs form={form} name="buylessons" style={{width:180}} required placeholder="输入购买课时数"/>
                                        </div>
                                        <div className="box box-ac mb_15">
                                            <div style={{width:80}} className="mr_15 ta_r">历史消课数</div>
                                            <Inputs form={form} name="consumedlessons" style={{width:180}} placeholder="选填"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="box mb_15">
                                        <div style={{width:80}} className="mr_15 ta_r">备注信息</div>
                                        <Inputs style={{width:'500px'}} form={form} name="comment" type="textArea" rows={3} placeholder="请输入备注信息"/>
                                    </div>
                                </div>

                                <div className="box box-ac box-pc mt_20">
                                    <Btn onClick={submit}/>
                                </div>
                            </div>
                        )}
                    </Form>
                )}
            </Modals>
        )
    }

    // 课表
    function KebiaoBox(){
        let {list,setList}={}
        let today_date=$.dateFormat(new Date(),'YYYY/MM')
        function bgColor(time_part){
            if(time_part==="morning"){
                return '#52C51A'
            }else if(time_part==="noon"){
                return '#FAAD14'
            }else{
                return '#FF4D50'
            }
        }
        
        // 课节列表
        function LessonBox(props){
            let {lesson,today}=props
            return (
                <div>
                {lesson.map(l=>(
                    <div className="pst_rel mv_8" style={{height:27.7}} key={l.uuid}>
                        <div className="b_1 br_8 box box-ac item pst_abs" style={{border:today?'1px solid rgba(63,173,255,0.5)':'',height:27.7,lineHeight:'27.7px',left:0,right:0}}>
                            <div style={{height:6,width:6,background:bgColor(l.time_part)}} className="circle mh_8"></div>
                            <div className="fs_14 fc_black5 pst_rel box-1 pointer" onClick={()=>{
                                lessonDetail_page.open('课节详情',{uuid:l.uuid})
                            }} style={{height:'100%'}}>
                                <span className="pst_abs ellipsis" style={{left:0,right:10}}>{l.starttime}-{l.endtime}</span>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )
        }
        // 课表
        function KebiaoTable(){
            [list,setList]=useState({data:[],loading:true})
            useEffect(()=>{
                (async ()=>{
                    let res=await $.get(`/banji/calendar`,{group_uuid:uuid,year:today_date.split('/')[0],month:today_date.split('/')[1]})
                    setList({data:res,loading:false})
                })()
            },[])
            return (
                <Spin spinning={list.loading}>
                <div style={{height:40,background:'#FAFAFA'}} className="box bt_e1 bl_e1 fs_13 lh_40 ta_c bb_e1">
                    <div className="br_e1 box-1">周一</div>
                    <div className="br_e1 box-1">周二</div>
                    <div className="br_e1 box-1">周三</div>
                    <div className="br_e1 box-1">周四</div>
                    <div className="br_e1 box-1">周五</div>
                    <div className="br_e1 box-1" style={{color:'#F3A723'}}>周六</div>
                    <div className="br_e1 box-1" style={{color:'#F3A723'}}>周日</div>
                </div>
                <table style={{width:'100%',minWidth:1173}} className="bl_e1">
                    <tbody>
                        {list.data.length&&list.data.map((row,index)=>(
                            <tr key={index}>
                                {row.map((col,index)=>{
                                    let date=parseInt(col.dateseq.split('-')[2])
                                    let today=col.dateseq==$.dateFormat(new Date(),'YYYY-MM-DD')
                                    if(col.current_month==='YES'){
                                        return (
                                            <td key={index} style={{verticalAlign:'top',background:today?'#E6F7FF':''}} className={`show_p pst_rel br_e1 bb_e1`}>
                                                <div className={`ph_20 pst_rel pv_8`} style={{minHeight:150}}>
                                                    {
                                                        info.is_end!=='YES'&&(
                                                            <img style={{right:0,top:0,width:36,height:36}} className="pst_abs show pointer" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/f2193368-cd8a-11ea-8b99-00163e04cc20.png" onClick={()=>{
                                                                addlesson_page.open('添加排课',{group_uuid:uuid,course_uuid:info.course_uuid,date:col.dateseq})
                                                            }}/>
                                                        )
                                                    }
                                                    
                                                    <div className="lh_22">
                                                        {
                                                            col.week==='六'||col.week==='日'?(
                                                                <span className="fb fs_14" style={{color:'#FEB75C'}}>{date}</span>
                                                            ):(
                                                                <span className="fb fs_14" style={{color:today?'#3FADFF':col.current_month==='NO'?'rgba(0,0,0,.25)':'rgba(0,0,0,.85)'}}>{date}</span>
                                                            )
                                                        }
                                                        
                                                        <span className="fs_10 ml_8 pst_abs" style={{color:'#FEB75C'}}>{col.holiday}</span>
                                                    </div>
                                                    <LessonBox lesson={col.lesson} today={today}/>
                                                </div>
                                            </td>
                                        )
                                    }else{
                                        return (
                                        <td key={index} style={{verticalAlign:'top',background:today?'#E6F7FF':''}} className={`br_e1 bb_e1`}>
                                            <div className={`ph_20 pst_rel pv_8`} style={{minHeight:150}}>
                                                <div className="lh_22">
                                                    <span className="fb fs_14" style={{color:today?'#3FADFF':col.current_month==='NO'?'rgba(0,0,0,.25)':'#000000'}}>{date}</span>
                                                </div>
                                                <div className="pst_abs" style={{left:25,right:25}}>
                                                </div>
                                            </div>
                                        </td>
                                        )
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                </Spin>
            )
        }

        return (
            <div className="pl_20 pb_20 pr_20">
                <Form className="mb_15" ref={ref=>kebiao_form=ref} onSubmit={async val => {
                setList({data:list.data,loading:true})
                let date=today_date
                if(val.date){date=val.date}
                if(date.indexOf('-')>-1){
                    let arr=date.split('-')
                    date=arr[0]+'/'+arr[1]
                }
                let res=await $.get(`/banji/calendar`,{group_uuid:uuid,year:date.split('/')[0],month:date.split('/')[1]})
                setList({data:res,loading:false})
            }}>
                    {({form})=>(
                        <div className="box box-ac">
                            <div className="box-1">
                            <Inputs autoSubmit form={form} type="monthPicker" value={Moment(today_date, 'YYYY/MM')} format="YYYY/MM" placeholder="请选择日期" name="date"/>
                            <Btn className="ml_25" onClick={async ()=>{
                                let date=today_date
                                let val=form.getFieldsValue(['date'])
                                if(val.date){date=val.date.format('YYYY-MM-DD')}
                                if(date.indexOf('-')>-1){
                                    let arr=date.split('-')
                                    date=arr[0]+'/'+arr[1]
                                }
                                await $.download('/campus/export/group/calendar',{group_uuid:uuid,year:date.split('/')[0],month:date.split('/')[1]})
                            }}>导出本月课表</Btn>
                            </div>

                            <div className="fl_r dis_f ai_e">
                                <div className="box box-ac mr_6">
                                    <div className="circle" style={{background:bgColor('morning'),width:6,height:6}}></div>
                                    <span className="ml_8 mr_16">上午</span>
                                    <div className="circle" style={{background:bgColor('noon'),width:6,height:6}}></div>
                                    <span className="ml_8 mr_16">下午</span>
                                    <div className="circle" style={{background:bgColor('night'),width:6,height:6}}></div>
                                    <span className="ml_8 mr_16">晚上</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
                <KebiaoTable/>
            </div>
        )
    }
    // 作业
    function HomeWork(){
        let {hw_tab}={}
        let columns=[
            {
                title:'序号',
                dataIndex:'_key',
                align:'center'
            },
            {
                title:'标题',
                width:400,
                render(rs){
                    if(power==='teacher'){
                        return <a className="link" href={"/teacherPc/homework_detail?uuid="+rs.uuid} target="_blank">{rs.title}</a>
                    }
                    return <a className="link" href={"/adminPc/homework_detail?uuid="+rs.uuid} target="_blank">{rs.title}</a>
                }
            },
            {
                title:'布置老师',
                dataIndex:'teacher_name',
                render(rs,obj){
                    return <span>{rs||obj.oper.name}</span>
                }
            },
            {
                title:'布置人数',
                dataIndex:'cnt_assign',
                align:'center',
                render(rs){
                    return rs||'-'
                }
            },
            {
                title:'提交人数',
                dataIndex:'cnt_commit',
                align:'center',
                render(rs){
                    return rs||'-'
                }
            },
            {
                title:'已批改',
                dataIndex:'cnt_review',
                align:'center',
                render(rs){
                    return rs||'-'
                }
            },
            {
                title:'状态',
                dataIndex:'date',
                render(rs){
                    return rs?<span style={{color:'#8BD881'}}>已发布</span>:<span style={{color:'#DDAD58'}}>草稿</span>
                }
            },
            {
                title:'布置日期',
                align:'center',
                render(rs){
                    return rs.date?<span>{rs.date}({rs.week})</span>:'-'
                }
            }
        ]
        return (
            <div className="pl_20 pb_20 pr_20">
                <Form className="mb_15" onSubmit={(val,btn)=>{
                    hw_tab.search(val)
                    btn.loading=false
                }}>
                    {({form,submit})=>(
                        <div>
                            <Inputs form={form} name="testpaper_title" placeholder="输入作业名称搜索"/>
                            <Btn className="ml_10" onClick={submit}>搜 索</Btn>
                        </div>
                    )}
                </Form>
                <TablePagination
                    ref={ref=>hw_tab=ref}
                    columns={columns}
                    api="/testpaper/list"
                    params={{
                        group_uuid:uuid
                    }}
                />
            </div>
        )
    }
    // 课后点评
    function CommentBox(){
        let {act_tab}={}
        let status_color = {
            published: "#52C41A",
            unpublish: "#1890FF",
            ignored: "rgba(0,0,0,0.25)"
          };
        let status_txt = {
            published: "已发布",
            unpublish: "待发布",
            ignored: "忽略"
        };
        let columns=[
            {
                title:'序号',
                dataIndex:'_key'
            },{
                title:'上课日期',
                key:'lessontime',
                render(rs){
                    if(power==='teacher'){
                        return (
                            <span className="link" onClick={()=>{
                                comment_page.open('点评详情',{uuid:rs.uuid,showBottom:true},{left:300})
                            }}>{rs.lessontime.year}-{rs.lessontime.origin_date} {rs.lessontime.week}</span>
                        )
                    }
                    return (
                        <a className="link" href={"/adminPc/comment_class_detail?uuid="+rs.uuid} target="_blank">
                           {rs.lessontime.year}-{rs.lessontime.origin_date} {rs.lessontime.week}
                        </a>
                    )
                }
            },{
                title:'上课时间',
                key:'endtime',
                render(rs){
                    return (
                        <div>
                           {rs.lessontime.time}-{rs.endtime.time}
                        </div>
                    )
                }
            },{
                title: "状态",
                dataIndex: "status",
                render(res) {
                  return <div className="dis_f ai_c">
                      <span className="dis_ib mr_5" style={{width:6,height:6,backgroundColor:status_color[res],borderRadius:'50%'}}></span>    {status_txt[res]}
                  </div>;
                }
              },{
                title:'创建者',
                dataIndex:'create_teacher_name'
            },{
                title:'发布时间',
                dataIndex:'time_publish_text',
                render:(rs)=>(
                    <span>{rs||'-'}</span>
                )
            },{
                title:'最后更新',
                dataIndex: "time_update",
                render(rs) {
                    return (
                      <span>
                        {rs.year}-{rs.origin_date} {rs.time}
                      </span>
                    );
                  }
            }
        ]
        return (
            <div className="pl_20 pr_20 pb_20">
                <Form className="mb_15" onSubmit={e=>act_tab.search(e)}>
                    {({form})=>(
                        <div>
                            <Inputs
                                className="mr_15"
                                name="status"
                                type="select"
                                placeholder="请选择状态"
                                value=''
                                form={form}
                                select={[
                                    {
                                    value: "",
                                    text: "全部状态"
                                    },
                                    {
                                    value: "published",
                                    text: "已发布"
                                    },
                                    {
                                    value: "unpublish",
                                    text: "待发布"
                                    }
                                ]}
                                autoSubmit={true}
                                />
                        </div>
                    )}
                </Form>
                <TablePagination
                    columns={columns}
                    params={{review_type:'CLASS', group_uuids:info?.uuid}}
                    ref={ref=>act_tab=ref}
                    api="/growing/edited/all"
                />
                <Page ref={ref=>comment_page=ref}>
                    <CommentDetail/>
                </Page>
            </div>
        )
    }
    // 成绩
    function ScoreBox(){
        let {act_tab}={}
        let gradeTxt = [
            "学龄前",
            "小班",
            "中班",
            "大班",
            "一年级",
            "二年级",
            "三年级",
            "四年级",
            "五年级",
            "六年级",
            "七年级",
            "八年级",
            "九年级",
            "高一",
            "高二",
            "高三",
            "大一",
            "大二",
            "大三",
            "大四",
            "研一",
            "研二",
            "研三"
        ];
        let columns = [
            {
                title: "序号",
                dataIndex: "_key"
            },
            {
                title: "考试名称",
                render: res => {
                    return (
                        <a
                            className="link"
                            href={"/adminPc/scoreManage_detail?uuid="+res.uuid}
                            target="_blank"
                        >
                            {res.name}
                        </a>
                    );
                }
            },
            {
                title: "考试年级",
                dataIndex: "examgrade",
                width:250,
                render: res => {
                    return res||res===0 ? gradeTxt[res] : "-";
                }
            },
            {
                title: "考试科目",
                dataIndex: "examsubject_name",
                width:250,
                render: res => {
                    return res ? res : "-";
                }
            },
            {
                title: "考试人数",
                width:80,
                dataIndex: "num_count",
                render: res => {
                    return res||res===0 ? res : "-";
                }
            },
            {
                title: "试卷总分",
                width:80,
                dataIndex: "totalscore"
            },
            {
                title: "最高分",
                dataIndex: "num_max",
                width:70,
                render: res => {
                    return res||res===0 ? res : "-";
                }
            },
            {
                title: "最低分",
                dataIndex: "num_min",
                width:70,
                render: res => {
                    return res||res===0 ? res : "-";
                }
            },
            {
                title: "平均分",
                width:70,
                dataIndex: "num_avg",
                render: res => {
                    return res||res===0 ? res : "-";
                }
            },
            {
                title: "考试日期",
                dataIndex: "exam_time",
                width:120,
                render: res => {
                    return res.split(" ")[0];
                }
            },
        ];
        return (
            <div className="pl_20 pr_20 pb_20">
                <Form onSubmit={(e,btn)=>{
                    if(e.date){
                        e.date_start=e.date[0]
                        e.date_end=e.date[1]
                    }
                    act_tab.search(e)
                    btn.loading=false
                }}>
                    {({form,submit})=>(
                        <div className="box mb_15">
                            <Inputs form={form} format="YYYY-MM-DD" type='rangePicker' name="date" className="mr_10" onChange={e => {
                                    act_tab.search({
                                        date_start: e[0].split(" ")[0],
                                        date_end: e[1].split(" ")[0]
                                    });
                                }}/>
                            <Grades style={{width:130}} autoSubmit form={form} name="examgrade" className="mr_10"/>
                            <Subject style={{width:130}} autoSubmit form={form} name="examsubject_uuid" className="mr_10"/>
                            <Inputs form ={form} name="exam_name" onPressEnter={()=>{
                                submit({})
                            }} placeholder="输入考试名称搜索" className="mr_10"/>
                            <Btn onClick={submit}>搜 索</Btn>
                        </div>
                    )}
                </Form>
                <TablePagination columns={columns} params={{group_uuid:uuid}} api="/achievement/exam/list" ref={ref=>act_tab=ref}/>
            </div>
        )
    }
    // 线上报名申请
    function BaominBox(){
        let [keys,setKeys]=useState([])
        let [list,setList]=useState(info.applications?.map((s)=>{
            s.key=s.student_uuid
            return s
        })||[])
        async function getList(){
            let res=await $.get('/banji/detail',{group_uuid:uuid})
            setList(res.applications?.map((s)=>{
                s.key=s.uuid
                return s
            })||[])
        }
        let columns=[
            {
                title:'序号',
                dataIndex:'key',
                render:(rs,obj,i)=>i+1,
                align:'center',
                width:100
            },{
                title:'学员姓名',
                dataIndex:'student',
                render(rs,obj){
                    return (
                        <a href={"/pc#/student_detail?uuid="+obj.student_uuid} target="_blank">{rs}</a>
                    )
                }
            },{
                title:'报名时间',
                dataIndex:'time_create'
            },{
                title:'操作',
                key:"edit",
                render(rs){
                    return (
                        <div>
                            <span className="fc_blue pointer hover_line" onClick={()=>{
                                batch_page.open('请选择需要加人的课节',{group_uuid:uuid,type:'select',async onSure(uuids){
                                    await $.post('/group/student/import',{group_uuid:uuid,lesson_uuids:uuids.join(','),student_uuids:rs.student_uuid})
                                    getInfo()
                                    stu_tab&&stu_tab.reload()
                                }},{left:300})
                            }}>同意</span>
                            <span className="mh_5">|</span>
                            <span className="fc_err hover_line pointer" onClick={()=>{
                                Modal.confirm({
                                    title:'注意',
                                    content:`确定要忽略学员${rs.student}的申请吗?`,
                                    async onOk(){
                                        await $.post('/userask/save/'+rs.uuid,{status:'processed'})
                                        getInfo()
                                    }
                                })
                            }}>拒绝</span>
                        </div>
                    )
                }
            }
        ]

        return (
            <div className="pl_20 pr_20 pb_20">
                <Btn className="mb_15" onClick={()=>{
                    if(!keys.length){
                        $.msg('请选择学员后操作！')
                        return
                    }
                    batch_page.open('请选择需要加人的课节',{group_uuid:uuid,type:'select',async onSure(uuids){
                        await $.post('/group/student/import',{group_uuid:uuid,lesson_uuids:uuids.join(','),student_uuids:keys.join(',')})
                        getInfo()
                        stu_tab&&stu_tab.reload()
                    }},{left:300})
                }}>批量处理</Btn>
                <Table pagination={false} columns={columns}
                 rowSelection={{
                    selectedRowKeys:keys,
                    onChange(selectedRowKeys){
                        setKeys(selectedRowKeys)
                    }
                }} dataSource={list||[]}/>
            </div>
        )
    }
    let time=null
    // 获取验证码按钮
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
              let res = await $.post('/approval/verifycode',{permission:'EXPORT_BANJIS'});
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

    return (
        <div>
            <Wrap/>
            <Page ref={ref=>lessonDetail_page=ref} onClose={()=>{
                getInfo()
                tab1.reload()
            }}>
                <LessonDetail/>
            </Page>
            <BuyLessonBox/>
            <Page ref={ref=>batch_page=ref} onClose={()=>{
                getInfo()
                tab1.reload()
            }}>
                <BatchLesson/>
            </Page>

            <Page ref={ref=>up_page=ref} background="#fff" onClose={(b_uuid)=>{
                parent.close(b_uuid)
            }}>
                <UpGroup/>
            </Page>
            <Page background="#fff" onClose={(buuid)=>{
                if(buuid==='load'){
                    getInfo()
                    stu_tab.reload()
                }else{
                    parent.close(buuid)
                }
            }} ref={ref => (choiceClass = ref)}>
                <ChangeClass/>
            </Page>

            <Modals bodyStyle={{padding:'10px 15px'}} ref={ref=>out_modal=ref} width="590px">
                    <Form
                        onSubmit={(val)=>{
                            let api=$.getProxyIdentify+`/campus/export/banjis`
                            window.open(`${api}?verifycode=${val.verifycode}&campus_uuid=${$.campus_uuid()}&token=${$.token()}&banji_uuids=${uuid}`)
                            // out_modal.close()
                        }}>
                        {({form,submit})=>(
                            <div>
                                <div className="box box-ac ph_10" style={{borderLeft:"2px solid #009688",background:'#f2f2f2',height:26}}>
                                    请先获取验证码后再进行导出操作！
                                </div>
                                <div style={{padding:'50px 0'}} className="bb_1 mb_10">
                                    <div className="box box-pc">
                                        <Inputs form={form} name="verifycode" className="mr_8" placeholder="请输入验证码"/>
                                        <GetVerBtn/>
                                    </div>
                                    <div className="ta_c mt_10 fc_err">*如下载页提示验证码错误，请重新获取验证码</div>
                                </div>
                                <div className="ta_c">
                                    <Button icon="download" type="primary" onClick={e=>submit(e)}>开始导出</Button>
                                </div>
                            </div>
                        )}
                    </Form>
            </Modals>
            
        </div>
    )
}