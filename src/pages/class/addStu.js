import React, { useState } from "react";
import { List, Empty, Avatar,Radio, Modal } from "antd";
import {Btn,Form,Inputs,TablePagination, FixedBox,Modals,Uploadimgs,Page,$  } from "../comlibs";
import {Course} from '../works'
import BatchLesson from './batchLesson'

export default function(props) {
	let { Parent,add_modal} = props;
	let { value = [], max, onSure,bottom,group_uuid,lesson_uuid,course_uuid,havelesson} = Parent?Parent.data:props;
	let { tab, list, setList,batch_page} = {};
	let Bottom=bottom

	let columns = [
		{
			title: "姓名",
			dataIndex: "name",
			width: 150
		},
		{
            title: "类型",
            dataIndex:'identity',
			render: rs => {
                let text={formal:'正式',intentional:'意向',graduated:'毕业'}
                let color={formal:'#52C41A',intentional:'#FAAD14',graduated:'#999A9E'}
                return (
                    <div className="box box-ac">
                        <div className="circle mr_8" style={{background:color[rs],width:6,height:6}}></div>
                        {text[rs]}
                    </div>
                )	
            }
		},
		{
			title: "默认联系方式",
            dataIndex: "phone",
            render:(rs)=>(rs||'-')
		},
		{
			title: "绑定微信",
			render: rs => <span>{rs.gzh_bind === "YES" ? "已绑定" : "未绑定"}</span>
		},{
            title:'剩余课时',
            align:'center',
			dataIndex:'remainlessons',
			render(rs){
				return <span>{rs||'0'}</span>
			}
        }
	];

	let Sure = data => {
		Parent&&Parent.close(data);
		onSure && onSure(data);
    };
    let AvatarBox=(props)=>{
        let [avatar,setAvatar]=useState('https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/avatar.png')
        let {valSet}=props
        let {uploadimgs}={}
        return (
            <div style={{width:'40%'}} className="box box-ver box-ac box-pc">
                <div style={{marginLeft:70}}>
                    <img style={{width:100,height:100}} className="circle" src={avatar}/>
                </div>
                <div style={{marginLeft:70}} className="fs_12 link mt_10">
                    <span onClick={()=>{
                        uploadimgs.open()
                    }}>点击上传头像</span>
                </div>
                <Uploadimgs
					multiple={false}
					prefix='user/avatar/'
					ref={e => (uploadimgs = e)}
					onSure={cover => {
                        valSet(cover)
                        setAvatar(cover)
					}}
				/>
            </div>
        )
    }

	let Sel = () => {
		[list, setList] = useState([]);
		let height = 460;
		let width = 270;

		if (max === 1 && list.length >= 1 && tab.sureType === "selectRow") {
			Sure(list[list.length - 1]);
		}

		return (
			<div className="box box-ver">
				<div style={{ height: 46 }} className="box box-pc box-ac pr_10 bb_1 bg_gray">
					<div className="box-1">已选{list.length}个学员</div>
                    <div className="fc_blue pointer hover_line" onClick={()=>{
                        tab.delSelectionAll()
                    }}>清空已选</div>
				</div>
				<div style={{ height, width }} className="box box-ver bb_1 bl_1">
					{list.length > 0 ? (
						<List
							style={{ height, width }}
							className="choiceCourseList CUSTOM_scroll oy_a pl_20"
							itemLayout="horizontal"
							dataSource={list}
							renderItem={item => (
								<List.Item
									actions={[
										<span onClick={() => tab.delSelection(item.uuid)} className="link" key="0">
											删除
										</span>
									]}
								>
									<List.Item.Meta
										avatar={<Avatar src={item.avatar} />}
										title={item.name}
										description={item.phone || "暂无联系方式"}
									/>
								</List.Item>
							)}
						/>
					) : (
						<Empty className="mt_30" />
					)}
				</div>
			</div>
		);
	};

	return (
		<Form
			onSubmit={values => {
				values.original_course_uuid=course_uuid
				tab.search(values);
            }}
            style={{marginBottom:70}}
		>
			{({ form }) => (
				<div className="bg_white ph_15 pt_15 mt_15">
					<div className="mb_10 box">
                    <div className="box box-1">
							<Inputs form={form} name="identity" autoSubmit placeholder="全部类型" type="select" select={[
                                {
                                    text:'全部类型',
                                    value:''
                                },
								{
									text:'意向学员',
									value:'intentional'
								},{
									text:'正式学员',
									value:'formal'
								},{
									text:'毕业学员',
									value:'graduated'
								}
							]} className="mr_8"/>
							<Course form={form} placeholder='全部课程' autoSubmit className="mr_8"/>
							<Inputs className="mr_8" name="student_name" placeholder="输入姓名关键字、首字母、默认联系方式查询" style={{ width: 330 }} form={form} />
							<Btn htmlType="submit" iconfont="sousuo">
								搜索
							</Btn>
						</div>
						<div>
                            <Btn onClick={()=>{
                                add_modal.open('添加学员')
                            }}>新建学员</Btn>
						</div>
					</div>
					<div className="box">
						<div className="box-1">
							<TablePagination
								className="nPointer"
								api="/v2/campusstudent/list"
                                columns={columns}
                                params={{original_course_uuid:course_uuid}}
								rowSelection={true}
								setSelection={value}
								onRow={true}
								rowType={max === 1 ? "radio" : "checkbox"}
								onSelection={keys => {
									setList && setList(Object.values(keys));
								}}
								ref={ref => (tab = ref)}
							/>
						</div>
						<Sel />
					</div>
					{Bottom?(
						<Bottom sure={()=>{
							let student_uuids=list.map(o=>o.student_uuid).join(',')
							if(!student_uuids){
								$.warning('您还未添加学员，请添加相应的学员')
								return
							}
							if (max === 1) {
								Sure(list[0] || {});
							} else {
								Sure(list);
							}
						}}/>
					):(
						<FixedBox>
							<Btn type="default" className="mr_8" onClick={()=>{
								Parent.close()
							}}>取消</Btn>
							<Btn onClick={async ()=>{
								let student_uuids=list.map(o=>o.student_uuid).join(',')
								if(!student_uuids){
									$.warning('您还未添加学员，请添加相应的学员')
									return
								}
								if(lesson_uuid){
									await $.post('/group/student/import',{group_uuid,student_uuids,lesson_uuids:lesson_uuid})
									if (max === 1) {
										Sure(list[0] || {});
									} else {
										Sure(list);
									}
									return
								}
								if(havelesson){
									batch_page.open('请选择需要加入的课节',{student_uuids:list,group_uuid,type:'select',async onSure(l_uuids){
										await $.post('/group/student/import',{group_uuid,student_uuids,lesson_uuids:l_uuids})
										if (max === 1) {
											Sure(list[0] || {});
										} else {
											Sure(list);
										}
									}},{left:300})
								}else{
									
									await $.post('/group/student/import',{group_uuid,student_uuids})
										if (max === 1) {
											Sure(list[0] || {});
										} else {
											Sure(list);
										}
									}
							}}/>
						</FixedBox>
					)}
                    


            {/* 添加学员弹窗 */}
            <Modals bodyStyle={{padding:'10px 20px'}} width="600px" ref={ref=>add_modal=ref}>
                <div className="box box-ac ph_10" style={{borderLeft:'2px solid #009688',background:'#f2f2f2',height:26}}>请填写好以下信息，除备注信息外均为必填项哦~</div>
                <Form labelCol={{span:9}} wrapperCol={{span:15}}
                    action="/campusstudent/create"
                    method="post"
                    success={(res,e)=>{
                        tab.first()
                        add_modal.close()
                    }}
                >
                    {({form,set,submit})=>(
                        <div className="pb_10">
                            <div className="box box-ac pv_20">
                                {set({
                                    name:'avatar'
                                },(valSet)=>(
                                    <AvatarBox valSet={valSet}/>
                                ))}
                                
                                <div style={{width:'50%'}}>
                                    <Inputs name="name" form={form} required label="学员名称" className="mb_10"/>
                                    <Inputs name="contact" form={form} label="学员联系人" className="mb_10"/>
                                    <Inputs name="phone" form={form} required label="联系人电话" className="mb_10"/>
                                    <div className="box mt_10">
                                        <div className="mr_10 fc_black2 ta_r" style={{whiteSpace:'nowrap',width:'37.5%'}}>学员类型：</div>
                                        {set({
                                            name:'identity',
                                            value:'formal'
                                        },()=>(
                                            <Radio.Group>
                                                <Radio value="formal">正式</Radio>
                                                <Radio value="intentional">意向</Radio>
                                            </Radio.Group>
                                        ))}
                                    </div>
                                    <Inputs name="remark" form={form} label="备注" className="mb_10"/>
                                </div>
                            </div>
                            <div className="box box-pc pt_10" style={{borderTop:'1px solid #e6e6e6'}}>
                                <Btn onClick={e=>{
                                    e.type='add'
                                    submit(e)
                                }}>直接添加</Btn>
                            </div>
                        </div>
                    )}
                </Form>
            </Modals>
			<Page ref={ref=>batch_page=ref}>
				<BatchLesson/>
			</Page>
				</div>
			)}
		</Form>
	);
}