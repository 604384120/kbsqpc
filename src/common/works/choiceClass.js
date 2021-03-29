import React, { useState } from "react";
import { List, Empty } from "antd";
import Method from "../method";

import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";

import Course from "./course";
import { FixedBox } from "../../pages/comlibs";

export default function(props) {
	let $ = new Method(props);
	let { Parent } = props;
	let { value = [], max, course_uuid, onSure,dis_course=false } = Parent.data;
	let { tab, list, setList } = {};

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
			dataIndex: "teachers_name"
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
					已选{list.length}个班级
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
										title={item.name}
										description={item.teachers_name || "暂无授课老师"}
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
				tab.search(values);
			}}
		>
			{({ form }) => (
				<div className="bg_white ph_15 pt_15 mt_15">
					<div className="mb_10">
						<div className="dis_ib mr_10">
							<span className="pr_10">选择课程:</span>
							<Course form={form} value={course_uuid} disabled={dis_course}/>
						</div>
						<div className="dis_ib mr_10">
							<span className="pr_10">班级名称:</span>
							<Inputs
								placeholder="请输入班级名称"
								style={{ width: 150 }}
								form={form}
								name="name_query"
							/>
						</div>
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
								api="/banji/normal/list"
								params={{
									join_way: "normal",
									course_uuid
								}}
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
						<Sel/>
					</div>
				</div>
			)}
		</Form>
	);
}
