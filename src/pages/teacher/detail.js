import React from "react";
import { Tabs, Popconfirm } from "antd";
import { Method, TablePagination } from "../comlibs";
import Booking from "./booking";
import Schedule from "./schedule";
import Class from "./class";
import Cheek from "./check";
import Basic from "./basic";

export default function(props) {
	const $ = new Method();
	const Parent = props.Parent;
	const { TabPane } = Tabs;
	let uuid = Parent.data;
	let {
		tab = {
			course: {}
		},
		curTabKey = "lesson"
	} = {};

	let columns_course = [
		{
			title: "序号",
			align: "center",
			dataIndex: "_key"
		},
		{
			title: "课程名称",
			align: "center",
			dataIndex: "name"
		},
		{
			title: "课程名师",
			align: "center",
			dataIndex: "teacher_name"
		},
		{
			title: "开课情况",
			align: "center",
			render: rs => (
				<span className="fc_gray">
					<span className="fc_green">普通班级{rs.cnt_normal_groups || 0}</span>/
					<span className="fc_gold">约课班级{rs.cnt_appoint_groups || 0}</span>
				</span>
			)
		},
		{
			title: "课程状态",
			align: "center",
			render: rs => (
				<span className={rs.status === "online" ? "fc_black1" : "fc_gray1"}>
					{rs.status === "online" ? "上架中" : "已下架"}
				</span>
			)
		},
		{
			title: "操作",
			align: "center",
			render: rs => (
				<div>
					<Popconfirm
						title={`确定要取消吗?`}
						onConfirm={async () => {
							await $.get("/teacher/courses/remove", {
								teacher_uuid: uuid,
								course_uuid: rs.uuid
							});
							$.msg("取消成功！");
							tab.course.reload();
						}}
						className="fc_blue pointer"
					>
						取消名师
					</Popconfirm>
				</div>
			)
		}
	];

	return (
		<div className="box box-ver">
			<div className="mb_10">
				<Basic data={Parent} />
			</div>
			<div className="bg_white">
				<Tabs animated={false} defaultActiveKey={curTabKey} onChange={key => curTabKey === key}>
					<TabPane tab="教学安排" key="lesson" className="ph_16">
						<Schedule uuid={uuid} />
					</TabPane>
					<TabPane tab="管理班级" key="banji" className="ph_16">
						<Class uuid={uuid} />
					</TabPane>
					<TabPane tab="关联课程" key="course" className="ph_16">
						<TablePagination
							{...props}
							api="/teacher/courses/list"
							columns={columns_course}
							params={{
								teacher_uuid: uuid
							}}
							ref={ref => (tab.course = ref)}
						/>
					</TabPane>
					<TabPane tab="预约课" key="appoint" className="ph_16">
						<Booking uuid={uuid} />
					</TabPane>
					<TabPane tab="考勤打卡记录" key="check" className="ph_16">
						<Cheek uuid={uuid} />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
}
