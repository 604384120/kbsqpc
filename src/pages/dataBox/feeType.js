import React, { useState, useEffect } from "react";
import { Btn, Method, Form, Inputs, Modals } from "../comlibs";
import { Button, Table, Divider, Popconfirm } from "antd";

export default function(props) {
	let $ = new Method();
	let parent = props.Parent;
	let { edit_modal } = {};
	let [list, setList] = useState([]);
	let [isAdd, setIsAdd] = useState(false);
	let columns = [
		{
			title: "支出类型",
			dataIndex: "feetype_name"
		},
		{
			title: "操作",
			width: 250,
			key: "edit",
			align: "center",
			render: rs => {
				return (
					<div>
						<span
							className="link"
							onClick={() => {
								edit_modal.open("修改类型名称", rs);
							}}
						>
							编辑
						</span>{" "}
						<Divider type="vertical" />
						<Popconfirm
							title="确认删除该类型吗?"
							onConfirm={async () => {
								await $.post("/reimburse/fee/type/remove", { feetype_id: rs.feetype_id });
								$.msg("删除成功");
								parent && parent.setCloseData(true);
								init();
							}}
							okText="确定"
							cancelText="取消"
						>
							<span className="fc_err pointer">删除</span>
						</Popconfirm>
					</div>
				);
			}
		}
	];

	useEffect(() => {
		init();
	}, []);
	async function init() {
		let res = await $.get("/reimburse/fee/type");
		setList(
			res.feetypes
				? res.feetypes.map(fee => {
						fee.key = fee.feetype_id;
						return fee;
				  })
				: []
		);
	}

	function showAddInput() {
		setIsAdd(true);
	}
	return (
		<div className="bg_white br_2 pall_15" style={props.style || {}}>
			{isAdd && (
				<Form
					action="/reimburse/fee/type/add"
					method="POST"
					success={async () => {
						init();
						setIsAdd(false);
					}}
				>
					{({ form }) => (
						<div className="box mv_15 box-pe">
							<Inputs
								className="mr_15"
								required={true}
								placeholder="请输入类型"
								name="feetype_name"
								form={form}
							/>
							<Btn htmlType="submit">添加</Btn>
						</div>
					)}
				</Form>
			)}
			{!isAdd && (
				<div className="mv_15 ta_r">
					<Button
						type="primary"
						onClick={() => {
							showAddInput();
						}}
					>
						{" "}
						+ 新增
					</Button>
				</div>
			)}

			<Table dataSource={list} columns={columns} pagination={false} />

			<Modals
				style={{ width: 350 }}
				ref={ref => {
					edit_modal = ref;
				}}
			>
				{rs => (
					<Form
						action="/reimburse/fee/type/update"
						params={{ feetype_id: rs.feetype_id }}
						method="POST"
						success={() => {
							init();
							parent && parent.setCloseData(true);
							edit_modal.close();
						}}
					>
						{({ form }) => (
							<div className="ta_c">
								<Inputs className="mr_15" name="feetype_name" value={rs.feetype_name} form={form} />
								<Btn htmlType="submit">确定</Btn>
							</div>
						)}
					</Form>
				)}
			</Modals>
		</div>
	);
}
