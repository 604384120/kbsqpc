import React, { useState } from "react";
import { List, Avatar, Empty } from "antd";

import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";

export default function(props) {
	let { Parent } = props;
	let { value = [], max, onSure } = Parent.data;
	let { tab, list = [], setList } = {};
	let selectRow = () => max === 1 && list.length >= 1 && tab.sureType === "selectRow";

	let columns = [
		{
			title: "课程名称",
			dataIndex: "name",
			width: 230
		},
		{
			title: "课程名师",
			dataIndex: "teachers_name"
		},
		{
			title: "开课情况",
			render: rs => (
				<span>
					普通班级:{rs.cnt_normal_groups || 0}/约课班级:{rs.cnt_appoint_groups || 0}
				</span>
			)
		}
	];

	let Data = () => {
		let data = [];
		if (selectRow()) {
			data = list[list.length - 1];
		} else if (max === 1) {
			data = list[0] || {};
		} else {
			data = list;
		}
		return data;
	};

	let Sure = () => {
		let data = Data();
		Parent.close(data);
		onSure && onSure(data);
	};

	let Sel = () => {
		[list, setList] = useState([]);
		let height = 460;
		let width = 270;

		selectRow() && Sure();

		return (
			<div className="box box-ver">
				<div style={{ height: 46 }} className="box box-pc box-ver bb_1 bg_gray">
					已选{list.length}门课程
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
										avatar={<Avatar shape="square" src={item.cover[0]} />}
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
							<span className="pr_10">课程名称:</span>
							<Inputs placeholder="请输入课程名称" style={{ width: 150 }} form={form} name="name" />
						</div>
						<Btn htmlType="submit" iconfont="sousuo">
							搜索
						</Btn>
						<Btn className="fl_r" onClick={() => Sure()} />
					</div>
					<div className="box">
						<div className="box-1">
							<TablePagination
								className="nPointer"
								api="/course/list"
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
