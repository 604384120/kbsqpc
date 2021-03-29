import React, { useState } from "react";
import { Page, Form, Inputs, Btn, TablePagination, Method } from "../comlibs";
import { Tabs } from "antd";
import { Teacher, Subject, Grades } from "../works";
import Detail from "./detail";
import Create from "./create";

const { TabPane } = Tabs;
export default function() {
	let $ = new Method();
	let { page_create, page_detail } = {};
	let [tab_on, setTab_on] = useState({});
	let [tab_off, setTab_off] = useState({});
	// 删除考试

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
	let on_columns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "考试名称",
			render: res => {
				return (
					<span
						className="link"
						onClick={() => {
							page_detail.open("考试详情", {uuid:res.uuid});
						}}
					>
						{res.name}
					</span>
				);
			}
		},
		{
			title: "考试年级",
			dataIndex: "examgrade",
			render: res => {
				return res||res===0 ? gradeTxt[res] : "---";
			}
		},
		{
			title: "考试科目",
			dataIndex: "examsubject_name",
			render: res => {
				return res ? res : "未选择";
			}
		},
		{
			title: "考试班级",
			dataIndex: "group_name"
		},
		{
			title: "班主任",
			
			dataIndex: "teachers_name"
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
		{
			title: "操作",
			width:70,
			render: res => {
				return (
					<div>
						<span className="fc_err link" onClick={() => {
							$.confirm("确定删除该次考试的成绩吗？删除后，学员端将无法查看", async () => {
								let rs = await $.post("/achievement/exam/delete", { exam_uuid: res.uuid });
								if (rs.status === "success") {
									$.msg("删除成功!");
									tab_on.reload();
								}
			                    return rs;
			                });
						}}>删除</span> {" "}
						{/* <span className="link">通知</span> */}
					</div>
				);
			}
		}
	];
	let off_columns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "学员姓名",
			dataIndex: "student_name"
		},
		{
			title: "考试班级",
			dataIndex: "group_name"
		},
		{
			title: "考试名称",
			dataIndex: "exam_name",
			render: (res,obj)=> {
				return <span className="link"
					onClick={() => {
						page_detail.open("考试详情", {uuid:obj.exam_uuid});
					}}
				>{res}</span>;
			}
		},
		{
			title: "考试日期",
			dataIndex: "exam_time",
			render: res => {
				return res?res.split(" ")[0]:'字段缺失';
			}
		},
		{
			title: "考试年级",
			dataIndex: "examgrade",
			render: res => {
				return res||res===0 ? gradeTxt[res] : "---";
			}
		},
		{
			title: "考试科目",
			dataIndex: "examsubject_name",
			render: res => {
				return res ? res : "未选择";
			}
		},
		{
			title: "分数",
			dataIndex: "exam_score",
			render(rs){
				return rs||rs===0?rs:'未填写'
			}
		},
		{
			title: "班级排名",
			dataIndex: "ranking_num"
		}
	];

	return (
		<div className="bg_white mt_15 br_2 ph_10">
			<Tabs defaultActiveKey="tab_on">
				<TabPane tab="考试列表" key="tab_on">
					<div className="mv_15">
						<Form
							onSubmit={values => tab_on.search(values)}
						>
							{({ form }) => (
								<div style={{display:'flex',flexWrap:'wrap'}}>
									<Inputs 
										className="dis_b mr_15 mb_15" 
										form={form}
										name="date"
										type="rangePicker" 
										onChange={e => {
											tab_on.search({
											  date_start: e[0].split(" ")[0],
											  date_end: e[1].split(" ")[0]
											});
										}}
									/>
									<Teacher
										form={form}
										className="mr_15"
										name="teacher_uuid"
										style={{ width: 200 }}
										autoSubmit={true}
									/>
									<Grades name="examgrade" type="compulsory" autoSubmit={true} className="dis_b mr_15 mb_15" style={{ width: 200 }} form={form} />
									<Subject
										name="examsubject_uuid"
										className="mr_15 mb_15"
										style={{ width: 200 }}
										form={form}
										autoSubmit={true}
									/>
									<Inputs
										className="dis_b mr_15 mb_15"
										form={form}
										name="exam_name"
										placeholder="输入考试名称搜索"
									/>
									<Inputs
										className="dis_b mr_15 mb_15"
										form={form}
										name="group_name"
										placeholder="输入考试班级名称搜索"
									/>
									<Btn htmlType="submit" iconfont="sousuo">
										搜索
									</Btn>
								</div>
							)}
						</Form>
					</div>

					<div>
						<button
							className="bg_blue fc_white br_3 pointer mb_15"
							style={{ border: "none", padding: "7px 10px" }}
							onClick={() => page_create.open("新增考试成绩")}
						>
							新增考试成绩
						</button>
					</div>
					<TablePagination
						api="/achievement/exam/list"
						columns={on_columns}
						ref={ref => setTab_on(ref)}
					/>
				</TabPane>
				<TabPane tab="学员明细" key="tab_off">
					<Form
						onSubmit={values => tab_off.search(values)}
						className="mb_10"
					>
						{({ form }) => (
							<div style={{display:'flex',flexWrap:'wrap'}}>
								<Inputs 
									className="mr_15 mb_15" 
									form={form} 
									name="date" 
									type="rangePicker" 
									onChange={e => {
										tab_on.search({
										  date_start: e[0].split(" ")[0],
										  date_end: e[1].split(" ")[0]
										});
									}}
								/>
								<Grades name="examgrade" className="mr_15 mb_15" autoSubmit={true} style={{ width: 200 }} form={form} />
								<Subject
									name="examsubject_uuid"
									className="mr_15 mb_15"
									style={{ width: 200 }}
									form={form}
									autoSubmit={true}
								/>
								<Inputs
									className="mr_15 mb_15"
									form={form}
									name="name"
									placeholder="姓名关键字、首字母、默认联系电话"
								/>

								<Btn htmlType="submit" iconfont="sousuo">
									搜索
								</Btn>
							</div>
						)}
					</Form>
					<TablePagination
						api="/achievement/examstudent/list"
						columns={off_columns}
						ref={ref => setTab_off(ref)}
					/>
				</TabPane>
			</Tabs>

			<Page 
				ref={rs => (page_detail = rs)}
				onClose={() => {
					tab_off.reload&&tab_off.reload();
					tab_on.init&&tab_on.init();
				}}
			>
				<Detail />
			</Page>
			<Page
				ref={rs => (page_create = rs)}
				onClose={() => {
					tab_on.init&&tab_on.init();
					tab_off.reload&&tab_off.reload();
				}}
			>
				<Create />
			</Page>
		</div>
	);
}
