import React, { useState } from "react";
import { List, Empty,Select,Modal } from "antd";
import Method from "../../common/method";
import {Course} from '../works'
import {Inputs,Form,FixedBox,Btn,TablePagination } from "../../pages/comlibs";

export default function(props) {
	let $ = new Method(props);
	let { Parent } = props;
	let { value = [], course_uuid, student,old_group } = Parent.data;
    let { tab, list, setList } = {};
    let {Option}=Select

	let columns = [
		{
			title: "班级名称",
			dataIndex: "name",
			width: 230
		},
		{
			title: "课程",
			dataIndex: "course_name"
		},
		{
			title: "班主任",
            dataIndex: "teachers_name",
            width:150,
            render:(rs)=><span>{rs||'-'}</span>
        },
        {
			title: "助教",
            dataIndex: "assistants_name",
            width:150,
            render:(rs)=><span>{rs||'-'}</span>
		},{
            title: "进度",
            dataIndex: "classtimes",
            render:(obj,rs)=><span>{rs.finished_classtimes?(rs.finished_classtimes+'/'+rs.classtimes):'-'}</span>
        },
		{
			title: "学员/上限",
			render: rs => (
				<span>
					{rs.member || 0}人/{$.maxNumText(rs.students, "人")}
				</span>
			)
		}
	];


	let Sel = () => {
        [list,setList]=useState([])
		return (
			<div>
				
			</div>
		);
	};

    let TableBox=()=>{
        return (
            <TablePagination
                className="nPointer"
                api="/banji/normal/list"
                params={{
                    join_way: "normal",
                    is_end:'NO',
                    course_uuid
                }}
                columns={columns}
                rowSelection={true}
                setSelection={value}
                onRow={true}
                rowType={"radio"}
                getCheckboxProps={
                    (row)=>({
                        disabled:row.uuid===old_group.uuid,
                        disText:'不可选择当前班级!'
                    })
                }
                onSelection={(keys,obj) => {
                    if(obj.key){
                        setList([obj]);
                    }
                }}
                ref={ref => (tab = ref)}
            />
        )
    }
	return (
		<Form
			onSubmit={values => {
				tab.search(values);
			}}
		>
			{({ form }) => (
				<div className="bg_white ph_15 pt_15 mt_15">
					<div className="mb_10">
						<div className="dis_ib mr_10">
							<Course form={form} disabled value={course_uuid}/>
						</div>
                        <div className="dis_ib mr_10">
                            <Select defaultValue="NO" disabled>
                                <Option value="NO">未结班</Option>
                            </Select>
                        </div>
						<div className="dis_ib mr_10">
							<Inputs
								placeholder="输入班级名称搜索"
								style={{ width: 180 }}
								form={form}
								name="name_query"
							/>
						</div>
						<Btn htmlType="submit" iconfont="sousuo">
							搜索
						</Btn>
					</div>
					<div className="box">
						<div className="box-1">
                            <TableBox/>
						</div>
					</div>
                    <Sel/>
                    <div style={{height:70}}></div>
					<FixedBox>
						<div className="box box-as" style={{width:'100%'}}>
							<Btn type="default" className="mr_15" onClick={()=>{
								Parent.close()
							}}>取消</Btn>
							<Btn onClick={() => {
                                let d=list[0]||{}
                                if(!d.uuid){
                                    $.warning('请选择班级')
                                    return
                                }
                                Modal.confirm({
                                    title:'学员调班',
                                    content:(
                                        <div>
                                            <div className="mb_10">学员：<span className="fc_blue">{student.name}</span></div>
                                            <div className="mb_10">原班级：<span className="fc_blue">{old_group.name}</span></div>
                                            <div className="mb_10">目标班级：<span className="fc_blue">{d.name}</span></div>
                                        </div>
                                    ),
                                    async onOk(){
                                        await $.post('/banji/promotion',{
                                            old_group_uuid:old_group.uuid,
                                            new_group_uuid:d.uuid,
                                            student_uuids:student.student_uuid
                                        })
                                        Modal.confirm({
                                            title:'调班成功',
                                            content:(
                                                <div>
                                                    是否前往新班级
                                                    <span className="fc_blue">{d.name}</span>
                                                    查看
                                                </div>
                                            ),
                                            onOk(){
                                                Parent.close(d.uuid)
                                            },
                                            onCancel(){
                                                Parent.close('load')
                                            },
                                            okText:'前往',
                                            cancelText:'留在本班'
                                        })
                                    }
                                })
							}}>确定</Btn>
						</div>
					</FixedBox>
				</div>
			)}
		</Form>
	);
}
