import React, { useState } from "react";
import { List, Avatar, Modal } from "antd";
import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";

import Class from "./class";

export default function (props) {
	let { Parent } = props;
	let { value = [], max, onSure, disabled, bottom } = Parent ? Parent.data : props;
	let init_value = [];
	value.forEach((o) => {
		init_value = init_value.concat(
			o.stulist.map((stu) => {
				stu._only = stu.student_uuid + "|" + stu.group_uuid;
				return stu;
			})
		);
	});
	let Bottom = bottom;

	let { ClassList } = {};
	let { tab, list, setList } = {};

	let columns = [
		{
			title: "姓名",
			dataIndex: "name",
			width: 150,
		},
		{
			title: "类型",
			render: (rs) => (
				<span>
					{rs.identity === "formal" && "正式"}
					{rs.identity === "intentional" && "意向"}
					{rs.identity === "graduated" && "毕业"}
				</span>
			),
		},
		{
			title: "联系方式",
			dataIndex: "phone",
		},
		{
			title: "绑定微信",
			render: (rs) => (
				<span>
					{rs.gzh_bind === "YES" && "已绑定"}
					{rs.gzh_bind === "NO" && "未绑定"}
				</span>
			),
		},
	];

	let Sure = (data) => {
		Parent && Parent.close(data);
		onSure && onSure(data);
	};

	let Sel = () => {
		[list, setList] = useState(value || []);
		let width = 345;
		let height = 460;

		if (max === 1 && list.length >= 1 && tab.sureType === "selectRow") {
			Sure(list[list.length - 1]);
		}

		return (
			<div style={{ width: 370, height }}>
				<div style={{ height: 46 }} className="box box-ac bb_1 bg_gray">
					<div className="box box-1">
						已选{list.reduce((total, obj) => total + obj.stulist.length, 0)}个学员
					</div>
					<div
						className="box link mr_15"
						onClick={() => {
							Modal.confirm({
								title: "提示",
								content: "确定清空吗?",
								onOk() {
									list = [];
									setList(list.concat([]));
									tab.delSelectionAll();
								},
							});
						}}
					>
						清空已选
					</div>
				</div>
				<div style={{ height }} className="oy_a CUSTOM_scroll">
					{list.map((obj, gid) => (
						<div key={obj.group_uuid} style={{ width }} className="box box-ver bb_1 bl_1">
							<div className="pl_20 fb lh_40">{obj.group_name}</div>
							{obj.stulist.length > 0 && (
								<List
									style={{ width }}
									className="choiceCourseList CUSTOM_scroll oy_a pl_20"
									itemLayout="horizontal"
									dataSource={obj.stulist}
									renderItem={(item, sid) => (
										<List.Item
											actions={[
												<span
													onClick={() => {
														tab.delSelection(item._only || item.uuid);
														list[gid].stulist.splice(sid, 1);
														if (list[gid].stulist.length === 0) list.splice(gid, 1);
														setList(list.concat([]));
													}}
													className="link"
													key="0"
												>
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
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<Form
			warning={true}
			onSubmit={async (values) => {
				if (values.group_uuid) {
					values.group_uuid = values.group_uuid.key || values.group_uuid[0].key;
				} else {
					values.group_uuid = "";
				}
				tab && tab.search(values);
			}}
		>
			{({ form }) => (
				<div className="bg_white ph_15 pt_15 mt_15" style={{ marginBottom: 100 }}>
					<div className="mb_10">
						<div className="dis_ib mr_10">
							<Class
								ref={(ref) => {
									ClassList = ref;
									console.log(ClassList)
								}}
								is_end='NO'
								width={225}
								autoSubmit={true}
								labelInValue={true}
								disabled={disabled}
								no_normal={true}
								allowClear={false}
								name="group_uuid"
								form={form}
								value="first"
							/>
						</div>
						<div className="dis_ib mr_10">
							<Inputs
								placeholder="请输入学员名称"
								style={{ width: 150 }}
								form={form}
								name="student_name"
							/>
						</div>
						<Btn htmlType="submit" iconfont="sousuo">
							搜索
						</Btn>
						{!Bottom && (
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
						)}
					</div>
					<div className="box">
						<div className="box-1">
							<TablePagination
								className="CUSTOM_choiceScroll nPointer"
								api="/v2/campusstudent/list"
								first={false}
								columns={columns}
								rowSelection={true}
								setSelection={init_value}
								onRow={true}
								keyName="_only"
								onlyGroup={["student_uuid", "group_uuid"]}
								rowType={max === 1 ? "radio" : "checkbox"}
								scroll={{ y: 460, x: "max-content"}}
								onSelection={(keys) => {
									if (!ClassList || !list) return;
									let group_uuid = ClassList.state.value.key;
									let group_name = ClassList.state.value.label;

									let stulist = Object.values(keys).filter((rs) => {
										return rs.group_uuid === group_uuid;
									});

									let isEmpty = false;
									let templist = list.map((obj) => {
										if (obj.group_uuid === group_uuid) {
											isEmpty = true;
											obj.stulist = stulist;
										}
										return obj;
									});

									if (!isEmpty) {
										templist.push({
											group_uuid,
											group_name,
											stulist,
										});
									}
									setList && setList(templist.filter((obj) => obj.stulist.length));
								}}
								ref={(ref) => (tab = ref)}

							/>
						</div>
						<Sel />
					</div>
					{Bottom && (
						<Bottom
							sure={() => {
								if (max === 1) {
									Sure(list[0] || {});
								} else {
									Sure(list);
								}
							}}
							close={() => {
								Parent && Parent.close();
							}}
						/>
					)}
				</div>
			)}
		</Form>
	);
}
