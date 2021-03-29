import React,{ useEffect,useState } from 'react'
import {$,Btn, TablePagination,Modals,Num,Form,Inputs,Page} from '../comlibs'
import {Teacher} from '../works'
import {Tabs, Table,Radio,Modal,Menu,Dropdown,Button } from 'antd'
import Conflict from './conflict'
import BukeStu from './bukeStu'
import AddStu from './addStu'

export default function(props){
	let {TabPane}=Tabs
	let {clock_modal,student_page,edit_modal,info,setInfo,bukestu,con_page,data_tab,bkclock_modal}={}
	let parent=props.Parent
  parent.setCloseData(true)
  // let { uuid } = parent?.data||{};
  let uuid = parent?.data?.uuid || parent?.data?.lessonuuid;
	!uuid && (uuid = $.getQueryString('uuid'));
	async function getInfo(){
		let res=await $.get(`/banji/lesson/${uuid}/detail`)
		res.title=`${res.lessontime.split(' ')[0]} ${res.week} ${res.time_start}-${res.time_end}`		
		res.assistant_names=res.assistants?res.assistants.map(t=>t.name).join(','):''
		res.teacher_names=res.teachers?res.teachers.map(t=>t.name).join(','):''
		res.teacher_uuids=res.teachers?res.teachers.map(t=>t.teacher_uuid):[]
		res.assistant_uuids=res.assistants?res.assistants.map(t=>t.teacher_uuid):[]
		setInfo(res)
	}

	// 基本信息
	function InfoBox(){
		return (
			<div className="bg_white br_3 pall_20 b_1 pst_rel">
				{info.is_end==='YES'&&<img style={{right:0,bottom:0,width:70}} className="pst_abs" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1f8d26d2-cd78-11ea-8b99-00163e04cc20.png"/>}
				
				<div className="box box-ac mb_15">
					<div className="box-1 fb fs_20">
						{info.title}
					</div>
					
					<div>
						{info.is_end==='YES'?(
							<div>
								<Btn onClick={()=>{
									Modal.confirm({
                                        title:'注意',
                                        content:'确定取消结课状态吗？',
                                        async onOk(){
											await $.post(`/lesson/end/cancel`,{lesson_uuid:info.uuid})
											$.msg('取消结课成功！')
											getInfo()
										}
									})
                                }}>取消结课</Btn>
							</div>
						):(
							<div>
								<Btn className="mr_12" onClick={()=>{
									edit_modal.open('修改课节')
								}}>编 辑</Btn>
								<Button className="mr_12" type="primary" ghost onClick={async ()=>{
									await $.post(`/lesson/end`,{lesson_uuid:info.uuid})
									getInfo()
									$.msg('结课成功！')
								}}>结 课</Button>
								<Button type='danger' ghost onClick={()=>{
									Modal.confirm({
										title:'注意',
										content:'确定删除课节吗？删除后，学员的点名签到记录会删除，已扣课时会退回。',
										async onOk(){
											await $.get('/lessons/remove',{
												lesson_uuids:info.uuid
											})
											parent.close(true)
										}
									})
								}}>删 除</Button>
							</div>
						)}
					</div>
				</div>
				<div className="mb_15">班级：{info.name}</div>
				<div className="mb_15 box">
					<div className="mr_35">授课老师：{info.teacher_names}</div>
					<div>
						助教：
						{info.assistant_names||'无'}
					</div>
				</div>
				<div>上课教室：{info.classroom_name||'无'}</div>
			</div>
		)
	}

	function StudentBox(){
		let list=info.studentlist||[]
		let {batch_modal}={}
		let [keys,setKeys]=useState([])
		list=list.map((l,i)=>{
			l._key=i+1
			l.key=l.student_uuid
			return l
		})
		let onSelectChange = selectedRowKeys => {
			setKeys(selectedRowKeys);
		  };
		// 点名窗口
		function ClockBox(){
			return (
				<Modals ref={ref=>clock_modal=ref} width="320px">
					{(student_uuid)=>(
						<Form
							action="/lesson/student/rollcall"
							method='post'
							params={{
								student_uuids:student_uuid,
								lesson_uuid:info.uuid
							}}
							success={()=>{
								clock_modal.close()
								getInfo()
							}}
						>
							{({form,set,submit})=>(
								<div className="box box-pc box-ver">
									<div className="box box-pc">
										{set(
											{
												name:'status',
												value:'normal'
											},()=>(
												<Radio.Group onChange={e=>{
													let count=0
													let obj={'normal':'arrived_consume','leave':'leave_consume','absent':'absent_consume'}
													
													if(info.lesson_rules[obj[e.target.value]]==='YES'){
														count=info.lesson_rules.default_lessons
													}
													form.setFieldsValue({'frozenlessons':count})
												}}>
													<Radio value='normal'>
														到课
													</Radio>
													<Radio value='leave'>
														请假
													</Radio>
													<Radio value='absent'>
														缺课
													</Radio>
												</Radio.Group>
											)
										)}
										
									</div>
									<div className="box box-ac box-pc">
										<span className="mr_15">扣课时数</span>
										<Num form={form} name="frozenlessons" value={info.lesson_rules.default_lessons} set={set}/>
									</div>
									<div className="mt_20 ta_c">
										<Btn onClick={submit}></Btn>
									</div>
								</div>
							)}
						</Form>
					)}
				</Modals>
			)
		}

		// 补课点名窗口
		function BkClockBox(){
			return (
				<Modals ref={ref=>bkclock_modal=ref} width="320px">
					{(student_uuid)=>(
						<Form
							action="/lesson/student/rollcall"
							method='post'
							params={{
								student_uuids:student_uuid,
								lesson_uuid:info.uuid
							}}
							success={()=>{
								clock_modal.close()
								getInfo()
							}}
						>
							{({form,set,submit})=>(
								<div className="box box-pc box-ver">
									<div className="box box-pc">
										{set(
											{
												name:'status',
												value:'normal'
											},()=>(
												<Radio.Group onChange={e=>{
													let count=0
													let obj={'normal':'arrived_consume','leave':'leave_consume','absent':'absent_consume'}
													
													if(info.lesson_rules[obj[e.target.value]]==='YES'){
														count=info.lesson_rules.default_lessons
													}
													form.setFieldsValue({'frozenlessons':count})
												}}>
													<Radio value='normal'>
														补课完成
													</Radio>
												</Radio.Group>
											)
										)}
										
									</div>
									<div className="box box-ac box-pc">
										<span className="mr_15">扣课时数</span>
										<Num form={form} name="frozenlessons" value={info.lesson_rules.default_lessons} set={set}/>
									</div>
									<div className="mt_20 ta_c">
										<Btn onClick={submit}></Btn>
									</div>
								</div>
							)}
						</Form>
					)}
				</Modals>
			)
		}

		let columns=[
			{
				title:'序号',
				align:'center',
				width:90,
				dataIndex:'_key'
			},
			{
				title:'学员姓名',
				dataIndex:'name',
				render:(rs,obj)=>(
					<div className="box box-ac">
						<a className="link" target="_blank" href={"/pc#/student_detail?uuid="+obj.student_uuid}>{rs}</a>
						{obj.is_remedy&&(
							<img className="ml_5 xb" style={{width:14,height:14}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/09c4f8c4-c63b-11e9-81f9-00163e04cc20.png"/>
						)}
					</div>
				)
			},
			{
				title:'点名状态',
				key:'status',
				align:'center',
				render:(rs,obj)=>{
					let status={'absent':'缺课','leave':'请假','normal':'到课'}
					let color={'absent':'#EF5E53','leave':'#FEBD3F','normal':'#1EC47C'}
					if(rs.status){
						return (
							<div style={{color:color[rs.status]}}>{status[rs.status]}</div>
						)
					}else{
						return (
							<div className="fc_dis">未点名</div>
						)
					}
					
				}
			},
			{
				title:'消耗课时',
				key:'frozenlessons',
				align:'center',
				render:(rs)=>(
					<div>{rs.frozenlessons||rs.frozenlessons==='0'?rs.frozenlessons:(rs.status === 'absent' || rs.status === 'leave' ? '0' : '-')}</div>
				)
			},
			{
				title:'剩余课时',
				key:'remainlessons',
				align:'center',
				render:(rs)=>(
					<div>{rs.remainlessons||rs.remainlessons===0?rs.remainlessons:'-'}</div>
				)
			}
		]
		if(info.is_end!=='YES'){
			columns.push({
				title:'操作',
				key:'edit',
				render:(rs)=>{
					if(rs.is_remedy==='YES'){
						return (
							<div>
								{rs.status?(
									<span className="fc_blue pointer" onClick={async ()=>{
										await $.post('/lesson/student/rollcall',{lesson_uuid:info.uuid,student_uuids:rs.student_uuid,status:'goback'})
										getInfo()
									}}>取消点名</span>
								):(
									<span className="fc_blue pointer" onClick={()=>{
										bkclock_modal.open('点名',rs.student_uuid)
									}}>点名</span>
								)}						
								<span className="mh_5">|</span>
								<span className="fc_err hover_line pointer" style={{color: "#FFA39E"}} onClick={()=>{
									Modal.confirm({
										title:'取消补课',
										content:`取消补课后，学员会从该课时中移除，并退回已扣课时数。`,
										async onOk(){
											await $.post('/lesson/student/remedy/cancel',{
												remedial_lesson_uuid:info.uuid,
												student_uuid:rs.student_uuid,
											})
											data_tab&&data_tab.reload()
											getInfo()
										}
									})
									
								}}>取消补课</span>
							</div>
						)
					}
					return (
					<div>
						{rs.status?(
							<span className="fc_blue pointer" onClick={async ()=>{
								await $.post('/lesson/student/rollcall',{lesson_uuid:info.uuid,student_uuids:rs.student_uuid,status:'goback'})
								getInfo()
							}}>取消点名</span>
						):(
							<span className="fc_blue pointer" onClick={()=>{
								clock_modal.open('点名',rs.student_uuid)
							}}>点名</span>
						)}						
						<span className="mh_5">|</span>
						<span className="fc_err hover_line pointer" style={{color: "#FFA39E"}} onClick={()=>{
							Modal.confirm({
								title:'学员移除',
								content:`确认从这个课节中移除[${rs.name}]吗？移除后，已扣课时将退回给学员。`,
								async onOk(){
									await $.get('/lesson/student/remove',{
										lesson_uuid:info.uuid,
										student_uuid:rs.student_uuid,
										target:'lesson'
									})
									data_tab&&data_tab.reload()
									getInfo()
								}
							})
							
						}}>移除</span>
					</div>
				)}
			})
		}
		function BatchClockBox(){
			return (
				<Modals ref={ref=>batch_modal=ref} width="300px">
					{(student_uuid)=>(
					<Form
						action="/lesson/student/rollcall"
						method='post'
						params={{
							student_uuids:student_uuid,
							lesson_uuid:info.uuid,
							status:'normal'
						}}
						success={()=>{
							$.msg('点名成功！')
							batch_modal.close()
							getInfo()
						}}
					>
						{({form,set,submit})=>(
							<div className="box box-pc box-ver">
								<div className="box box-ac">
									<div className="mr_15">扣课时数</div>
									<Num set={set} form={form} name="frozenlessons" value={info.lesson_rules.default_lessons}/>
								</div>
								<div className="box box-pc mt_20">
									<Btn onClick={submit}></Btn>
								</div>
							</div>
						)}
					</Form>
					)}
				</Modals>
			)
		}

		return (
			<div>
				<ClockBox/>
				<BkClockBox/>
				<BatchClockBox/>
				{!info.is_end && info.is_end != "YES" && <div className="box box-ac mb_15">
					<Btn className="mr_15" onClick={()=>{
						let student_uuids=keys.join(',')
						if(student_uuids){
							batch_modal.open('点名',student_uuids)
						}else{
							$.msg('请选择学员后再进行操作！')
						}
					}}>批量到课</Btn>
					<Dropdown overlay={(
						<Menu>
							<Menu.Item onClick={()=>{
								student_page.open('添加学员',{
									lesson_uuid:info.uuid,
									group_uuid:info.group_uuid,
									onSure:(list)=>{
										let student_uuids=list.map(s=>s.student_uuid).join(',')
										if(student_uuids){
											getInfo()
										}
									}
								})
							}}>
								系统中学员
							</Menu.Item>
							<Menu.Item onClick={()=>bukestu.open('请选择补课学员',{lesson_uuid:uuid,course_uuid:info.course_uuid},{left:200})}>
								补课学员
							</Menu.Item>
						</Menu>
					)} className="mr_15" placement="topCenter">
						<Button type="primary">添加学员</Button>
					</Dropdown>
				</div>}
				<Table rowSelection={{
					selectedRowKeys:keys,
					onChange:onSelectChange
				}} columns={columns} pagination={false} dataSource={list}/>
			</div>
		)
	}
	function DataBox(){
		let columns=[
			{
				title:'序号',
				width:90,
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
				dataIndex:'log_memo'
			}
		]
		return (
			<div>
				<TablePagination
					ref={ref=>data_tab=ref}
					columns={columns}
					api="/banji/lesson/logs/list"
					params={{
						lesson_uuid:info.uuid
					}}
				/>
			</div>
		)
	}

	function Content(){
		return (
			<div className="br_3 b_1 pb_20 ph_20 bg_white mb_20">
				<Tabs defaultActiveKey="student">
					<TabPane tab="课节学员" key="student">
						<StudentBox/>
					</TabPane>
					<TabPane tab="操作日志" key="data">
						<DataBox/>
					</TabPane>
				</Tabs>
			</div>
		)
	}


	// 修改课节弹框
	function EditBox(){
		return (
			<Modals ref={ref=>edit_modal=ref}>
				{()=>{
					let lessontime=info.lessontime.split(' ')[0]
					return (
				<Form action="/lessons/delay/changeteacher" method="post" params={{
					delaymode:'bydate',
					classtime:'unite',
					group_uuid:info.group_uuid,
					lesson_uuids:info.uuid
				}} valueReturn={rs=>{
					rs.hour=rs.start_time.split(':')[0]
					rs.minute=rs.start_time.split(':')[1]
					rs.end_hour=rs.end_time.split(':')[0]
					rs.end_minute=rs.end_time.split(':')[1]
					return rs
				}} success={async rs=>{
					if(rs.conflict_count){
						edit_modal.close()
						rs.group_uuid=info.group_uuid
						con_page.open('课节预览',rs,{left:150})
						edit_modal.close()
						return
					}
					await $.post('/lessons/conflict',{
						group_uuid:info.group_uuid,
						content:JSON.stringify(rs)
					})
					$.msg('修改成功！')
					getInfo()
					edit_modal.close()
				}}>
					{({form,submit})=>{
						let start=new Date($.dateFormat(new Date(),'YYYY-MM-DD ')+info.time_start)
						let end=new Date($.dateFormat(new Date(),'YYYY-MM-DD ')+info.time_end)
						return (
						<div>
							<div className="box box-ac mb_15">
								<div style={{width:130}} className="ta_r mr_10">上课日期：</div>
								<Inputs allowClear={false} form={form} style={{width:200}} name="delaydate" type="datePicker" value={lessontime}/>
							</div>
							<div className="box box-ac mb_15">
								<div style={{width:130}} className="ta_r mr_10">上课时间：</div>
								<div>
									<Inputs form={form} value={start} name="start_time" allowClear={false} type="timePicker" format="HH:mm"/>
									<span className="mh_5">-</span>
									<Inputs form={form} value={end} name="end_time" allowClear={false} type="timePicker" format="HH:mm"/>
								</div>
							</div>
							<div className="box box-ac mb_15">
								<div style={{width:130}} className="ta_r mr_10">授课老师：</div>
								<Teacher allowClear={false} mode="multiple" required form={form} name="teacher_uuids" load form={form} style={{width:200}} multiple value={info.teacher_uuids} name="teacher_uuids"/>
							</div>
							<div className="box box-ac mb_15">
								<div style={{width:130}} className="ta_r mr_10">助教：</div>
								<Teacher load form={form} mode="multiple" name="assistant_uuids" multiple style={{width:200}} value={info.assistant_uuids||undefined} name="assistant_uuids"/>
							</div>

							<div className="box box-ac box-pc mt_15">
								<Btn onClick={submit}></Btn>
							</div>
						</div>
					)}}
				</Form>
				)
			}}
			</Modals>
		)
	}

	function PageBody(){
		[info,setInfo]=useState({})
		useEffect(()=>{
			getInfo()
		},[])
		return (
			<div>
				<InfoBox/>
				<div className="mv_20 b_1 pv_18 pl_24 br_3 bg_white box box-ac" style={{height:60}}>
					<span className="fc_black2 fb mr_30 fs_18" >课节概览</span>
					<span className="fs_14 fc_dis">
						共{info.member||0}名学员，到课<span className="fc_suc">{info.arrived||0}</span>人，
						请假<span style={{color:'#FEBD3F'}}>{info.leave||0}</span>人，缺课<span className="fc_err">{info.absent||0}</span>人，未点名{info.unknown||0}人
					</span>
				</div>
				<Content/>
			</div>
		)
	}

	return (
		<div className="mt_24">
			<PageBody/>

			<EditBox/>
			<Page background="#fff" ref={ref=>con_page=ref} onClose={()=>{
				getInfo()
			}}>
				<Conflict/>
			</Page>
			<Page ref={ref=>student_page=ref}>
				<AddStu/>
			</Page>
			<Page background="#fff" ref={ref=>bukestu=ref} onClose={()=>{
				getInfo()
			}}>
				<BukeStu/>
			</Page>
		</div>
	)
}