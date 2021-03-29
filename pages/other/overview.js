import React, { useEffect, useState, useRef } from "react";
import { Card, Alert, Table } from "antd";
import { Method } from "../comlibs";
import { Today, Develops, CourseCategorys, Teacher } from "./js/chart";

export default function (props) {
	const $ = new Method(props);
	const defaultData = {
		data_today: [],
		course_ranks: [],
		course_goods: [],
		course_categorys: [],
		course_develops: [],
	};
	let status = 1;
	let $store = $.store();
	let userData = $store.GlobalUserData;
	let [data, setData] = useState(defaultData);

	let get = async () => {
		let rs = await $.get("/campus/semester/statistics/overview/page", {});
		if (rs.status === "failure") {
			rs = defaultData;
		}
		setData(rs);
	};

	Today(data.data_today);
	CourseCategorys(data.course_categorys);
	Teacher(data.campus_teacher, data.institution_teacher);
	Develops(data.course_develops);

	useEffect(() => {
		get();
	}, [status]);

	const gridStyle = {
		width: "18%",
		textAlign: "center",
		background: "#fff",
		marginRight: "2%",
		boxShadow: "none",
	};

	const gridText = {
		fontSize: 30,
		color: "#1890FF",
	};

	let Title = () => {
		return (
			<div className="box">
				<div className="box box-1">{userData.username}，欢迎您！--课后服务教育局管理平台</div>
				<div className="box">当前学期：{data.semester_name}</div>
			</div>
		);
	};

	const columns1 = [
		{
			title: "排名",
			dataIndex: "key",
			key: "key",
		},
		{
			title: "学校",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "学生总数",
			//dataIndex: "cnt_students",
			key: "cnt_students",
			render: (r) => r.cnt_students || 0,
		},
		{
			title: "报名人数",
			//dataIndex: "students",
			key: "students",
			render: (r) => r.students || 0,
		},
		{
			title: "报名人次",
			dataIndex: "person_students",
			key: "person_students",
		},
		{
			title: "报名率",
			//dataIndex: "hand_rate",
			key: "hand_rate",
			render: (r) => r.hand_rate + "%",
		},
	];

	let data1 = data.course_ranks.map((d, k) => {
		d.key = k + 1;
		return d;
	});

	const columns2 = [
		{
			title: "排名",
			dataIndex: "key",
			key: "key",
		},
		{
			title: "课程名称",
			dataIndex: "course_name",
			key: "course_name",
		},
		{
			title: "满意率",
			//dataIndex: "satisfaction",
			key: "satisfaction",
			render: (r) => r.satisfaction + "%",
		},
	];

	let data2 = data.course_goods.map((d, k) => {
		d.key = k + 1;
		return d;
	});

	return (
		<div>
			<Alert
				className="mt_15"
				type="info"
				message={<Title />}
				style={{
					background: "rgba(255,251,230,1)",
					borderRadius: 4,
					border: "1px solid rgba(255,229,143,1)",
				}}
			/>
			<Card className="mt_20" style={{ border: 0, background: "none" }}>
				<Card.Grid style={gridStyle}>
					<div>学校总数</div>
					<div style={gridText}>{data.campus_count}</div>
				</Card.Grid>
				<Card.Grid style={gridStyle}>
					<div>教师总数</div>
					<div style={gridText}>{data.teacher_count}</div>
				</Card.Grid>
				<Card.Grid style={gridStyle}>
					<div>课程总数</div>
					<div style={gridText}>{data.group_count}</div>
				</Card.Grid>
				<Card.Grid style={gridStyle}>
					<div>合作机构总数</div>
					<div style={gridText}>{data.institution_count}</div>
				</Card.Grid>
				<Card.Grid
					style={{ width: "20%", textAlign: "center", background: "#fff", boxShadow: "none" }}
				>
					<div>学生总数</div>
					<div style={gridText}>{data.student_count}</div>
				</Card.Grid>
			</Card>

			<div className="pall_15 mt_20 bg_white">
				<div className="pt_15 pl_15 fs_16 fw_b">今日数据</div>
				<div id="TodayChart" style={{ width: "100%", height: 420 }} />
			</div>

			<div className="mv_20 last-row-brb-none">
				<div className="dis_ib bg_white" style={{ width: "60%" }}>
					<div className="pv_15 pl_15 fs_16 fw_b bb1">课程报名排行榜TOP10</div>
					<div className="ph_15 pt_15">
						<Table pagination={false} size="middle" columns={columns1} dataSource={data1} />
					</div>
				</div>
				<div
					className="dis_ib ml_15 bg_white"
					style={{ width: "38%", marginLeft: "2%", verticalAlign: "top" }}
				>
					<div className="pv_15 pl_15 fs_16 fw_b bb1">优质课程排行榜TOP10</div>
					<div className="ph_15 pt_15">
						<Table pagination={false} size="middle" columns={columns2} dataSource={data2} />
					</div>
				</div>
			</div>

			<div className="mb_20">
				<div className="dis_ib bg_white" style={{ width: "60%" }}>
					<div className="pv_15 pl_15 fs_16 fw_b">课程类别占比</div>
					<div id="CourseCategorys" style={{ width: "100%", height: 300, marginTop: 5 }}></div>
				</div>
				<div
					className="dis_ib bg_white"
					style={{ width: "38%", marginLeft: "2%", verticalAlign: "top" }}
				>
					<div className="pv_15 pl_15 fs_16 fw_b">授课老师成分组成</div>
					<div id="Teacher" style={{ width: "100%", height: 300, marginTop: 5 }}></div>
					{!data.campus_teacher && !data.institution_teacher && (
						<div
							style={{
								marginTop: -150,
							}}
						>
							当前数据都为空哦~
						</div>
					)}
				</div>
			</div>

			<div className="pall_15 mt_15 bg_white">
				<div className="pv_15 pl_15 fs_16 fw_b">学校开展情况</div>
				<div id="Develops" style={{ width: "100%", height: 380 }} />
			</div>
		</div>
	);
}
