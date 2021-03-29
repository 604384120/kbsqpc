import React, { useState } from "react";
import { List, Empty, Avatar } from "antd";

import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";

export default function (props) {
	let { Parent } = props;
	let { value = [], max, onSure, act_uuid } = Parent.data;
	let { tab, list, setList } = {};
	let columns = [
		{
			title: "推广员姓名",
			dataIndex: "name",
			width: 150,
			align: "center",
		},
		{
			title: "联系电话",
			align: "center",
			dataIndex: "phone",
		},
		{
			title: "价格",
			align: "center",
			render(rs) {
				return (
					<span>
						￥{rs.price}
						<span className={rs.price_tag === "day" ? "" : "hide"}>/天</span>
						<span className={rs.price_tag === "week" ? "" : "hide"}>/周</span>
						<span className={rs.price_tag === "hour" ? "" : "hide"}>/小时</span>
					</span>
				);
			},
		},
		{
			title: "参与次数",
			dataIndex: "cnt_propartake",
			align: "center",
		},
		{
			title: "上次参与",
			dataIndex: "partake_date",
		},
		{
			title: "采集数",
			dataIndex: "cnt_student",
			align: "center",
		},
		{
			title: "创建时间",
			dataIndex: "time_create",
		},
	];

	let Sure = (data) => {
		Parent.close(data);
		onSure && onSure(data);
	};

	let Sel = () => {
		[list, setList] = useState([]);
		let height = 460;
		let width = 270;

		list = list.filter((item) => item.name);
		if (max === 1 && list.length >= 1 && tab.sureType === "selectRow") {
			Sure(list[list.length - 1]);
		}

		return (
			<div className="box box-ver">
				<div style={{ height: 46 }} className="box box-pc box-ver bb_1 bg_gray">
					已选{list.length}名推广员
				</div>
				<div style={{ height, width }} className="box box-ver bb_1 bl_1">
					{list.length > 0 ? (
						<List
							style={{ height, width }}
							className="choiceCourseList CUSTOM_scroll oy_a pl_20"
							itemLayout="horizontal"
							dataSource={list}
							renderItem={(item) => (
								<List.Item
									actions={[
										<span onClick={() => tab.delSelection(item.uuid)} className="link" key="0">
											删除
										</span>,
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
			onSubmit={(values) => {
				tab.search(values);
			}}
		>
			{({ form }) => (
				<div className="bg_white ph_15 pv_15 mt_15">
					<div className="mb_10">
						<div className="dis_ib mr_10">
							<Inputs
								name="name"
								placeholder="请输入推广员名称"
								style={{ width: 150 }}
								form={form}
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
								className="CUSTOM_choiceScroll nPointer"
								api="/groundpush/promoter/list"
								params={{ act_uuid: act_uuid }}
								columns={columns}
								keyName="uuid"
								rowSelection={true}
								setSelection={value}
								onRow={true}
								rowType={max === 1 ? "radio" : "checkbox"}
								onSelection={(keys) => {
									setList && setList(Object.values(keys));
								}}
								scroll={{ y: 460 }}
								ref={(ref) => (tab = ref)}
							/>
						</div>
						<Sel />
					</div>
				</div>
			)}
		</Form>
	);
}
