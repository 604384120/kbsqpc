import React, { useState } from "react";
import { Divider } from "antd";
import { Method, Form, Inputs, TablePagination, Page } from "../comlibs";
import Lessondetail from "../class/lessondetail";

export default function (props) {
	const $ = new Method();
	let [uuid, tab, lessondetail] = [props.uuid];
	let [lessonStatus, setlessonStatus] = useState("unfinished");
	let Btnlesson = ({ index }) => {
		return (
			<div>
				<a
					onClick={() => {
						$.confirm(`取消授课后，请确保已通知授课老师上课的调整。`, async () => {
							let res = await $.get("/teacher/lesson/remove", {
								teacher_uuid: uuid,
								lesson_uuid: index.lessonuuid,
							});
							$.msg("取消成功！");
							tab.reload();
							return res;
						});
					}}
				>
					取消授课
				</a>
				<span className={lessonStatus === "unfinished" ? "" : "hide"}>
					<Divider type="vertical" />
					<a
						onClick={() => {
							lessondetail.open(
								"课节详情",
								{
									lessonuuid: index.lessonuuid,
									groupuuid: index.groupuuid,
								},
								{
									left: 290,
								}
							);
						}}
					>
						修改
					</a>
				</span>
			</div>
		);
	};
	let columns_lesson = [
		{
			title: "序号",
			align: "center",
			dataIndex: "_key",
		},
		{
			title: "上课日期",
			align: "center",
			render: (rs) => (
				<span
					className="fc_blue pointer"
					onClick={() => {
						lessondetail.open(
							"课节详情",
							{ lessonuuid: rs.uuid, groupuuid: rs.group_uuid },
							{
								left: 290,
							}
						);
					}}
				>
					{rs.lessondate}({rs.week})
				</span>
			),
		},
		{
			title: "上课时间",
			align: "center",
			render: (rs) => (
				<span>
					{rs.starttime}-{rs.endtime}
				</span>
			),
		},
		{
			title: "班级名称",
			align: "center",
			dataIndex: "name",
		},
		{
			title: "授课老师",
			align: "center",
			dataIndex: "teacher_name",
		},
		{
			title: "考勤情况",
			align: "center",
			render: (rs) => (
				<span className="fc_gray">
					<span className="fc_green">到课:{rs.arrived || 0}</span>/
					<span className="fc_yellow">请假:{rs.leave || 0}</span>/
					<span className="fc_pink">缺课:{rs.absent || 0}</span>
					/总人数:{rs.member || 0}
				</span>
			),
		},
		{
			title: "操作",
			align: "center",
			render: (rs) => {
				return <Btnlesson index={{ lessonuuid: rs.uuid, groupuuid: rs.group_uuid }} />;
			},
		},
	];
	return (
		<div>
			<Form>
				{({ form }) => (
					<div className="mb_10">
						<Inputs
							name="lesson_status"
							form={form}
							value={lessonStatus}
							radios={[
								{
									value: "unfinished",
									text: "待上课节",
								},
								{
									value: "finished",
									text: "已完课节",
								},
							]}
							onChange={(res) => {
								tab.search({
									lesson_status: res,
								});
								setlessonStatus(res);
							}}
						/>
					</div>
				)}
			</Form>
			<TablePagination
				api="/teacher/lesson/list"
				columns={columns_lesson}
				params={{
					lesson_status: "unfinished",
					teacher_uuid: uuid,
				}}
				ref={(ref) => (tab = ref)}
			/>
			<Page ref={(rs) => (lessondetail = rs)} onClose={() => tab.reload()}>
				<Lessondetail />
			</Page>
		</div>
	);
}
