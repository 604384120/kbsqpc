import React from "react";
import { TablePagination } from "../comlibs";

export default function(props) {
	let columns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "项目",
			render: rs => <span>照片{rs.photos}张</span>
		},
		{
			title: "服务商",
			dataIndex: "sp_name"
		},
		{
			title: "购买数量",
			dataIndex: "amount"
		},
		{
			title: "联系人",
			dataIndex: "contact"
		},
		{
			title: "联系电话",
			dataIndex: "phone"
		},
		{
			title: "邮箱",
			dataIndex: "email"
		},
		{
			title: "提交时间",
			dataIndex: "time_create_text",
			width: 150
		}
	];

	return (
		<div
			className="bg_white bs mt_20"
			style={{ marginBottom: 30, padding: "15px 15px 0 15px" }}
		>
			<TablePagination
				{...props}
				api="/album/book/history"
				columns={columns}
			/>
		</div>
	);
}
