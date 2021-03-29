import React, { useState } from "react";
import { List, Empty } from "antd";

import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";

export default function(props) {
	let { Parent } = props;
	let { value = [], max, onSure, course_uuids = "" } = Parent.data;
	let { tab, list, setList } = {};
	let params = {
		is_arrangement: "NO"
	};
	course_uuids && (params.course_uuids = course_uuids);

	let columns = [
		{
			title: "上课日期",
			width: 150,
			render: rs => `${rs.year}-${rs.date}(${rs.week})`
		},
		{
			title: "上课时间",
			width: 100,
			render: rs => `${rs.starttime.time}-${rs.endtime.time}`
		},
		{
			title: "学员姓名",
			dataIndex: "student_name"
		},
		{
			title: "班级名称",
			dataIndex: "banji_name"
		},
		{
			title: "状态",
			render: rs => (
				<span>
					{rs.status === "leave" && "请假"}
					{rs.status === "absent" && "缺课"}
				</span>
			)
		},
		{
			title: "扣课时数",
			render: rs => `${rs.frozenlessons || 0}课时`
		}
	];

	let Sure = data => {
		Parent.close(data);
		onSure && onSure(data);
	};

	let Sel = () => {
		[list, setList] = useState([]);
		let height = 460;
		let width = 270;

		if (max === 1 && list.length >= 1 && tab.sureType === "selectRow") {
			Sure(list[list.length - 1]);
		}

		return (
			<div className="box box-ver">
				<div style={{ height: 46 }} className="box box-pc box-ver bb_1 bg_gray">
					已选{list.length}个学员
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
										title={item.student_name}
										description={item.banji_name || "暂无关联班级"}
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
			onSubmit={val => {
				val.date_start = val.date[0];
				val.date_end = val.date[1];
				tab.search(val);
			}}
		>
			{({ form }) => (
				<div className="bg_white ph_15 pt_15 mt_15">
					<div className="mb_10">
						<Inputs
							name="status"
							className="mr_10"
							placeholder="考勤状态"
							form={form}
							select={[
								{
									text: "请假",
									value: "leave"
								},
								{
									text: "缺课",
									value: "absent"
								}
							]}
						/>
						<Inputs name="date" className="mr_10" type="rangePicker" form={form} />
						<Inputs
							name="name"
							className="mr_10"
							placeholder="输入班级名称或学员名字搜索"
							width={200}
							form={form}
						/>
						<Btn htmlType="submit" iconfont="sousuo">
							搜索
						</Btn>
						<Btn
							className="fl_r"
							onClick={() => {
								if (max === 1) {
									Sure(list[0] || {});
								} else {
									Sure(list);
								}
							}}
						/>
					</div>
					<div className="box">
						<div className="box-1">
							<TablePagination
								className="nPointer"
								api="/campus/lessonstudent/abnormal"
								params={params}
								columns={columns}
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
				</div>
			)}
		</Form>
	);
}
