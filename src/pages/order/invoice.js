import React from "react";
import { Form as Forms, Divider } from "antd";
import { $, Page, Btn, TablePagination } from "../comlibs";
import Detail from "./invoiceApy";

export default function(props) {
	let { tab, page } = $.useRef(["tab", "page"]);

	let columns = [
		{
			title: "序号",
			align: "center",
			dataIndex: "_key"
		},
		{
			title: "申请时间",
			dataIndex: "time_create"
		},
		{
			title: "发票抬头",
			dataIndex: "title"
		},
		{
			title: "发票金额",
			align: "right",
			dataIndex: "fee"
		},
		{
			title: "发票类型",
			dataIndex: "invoice_type"
		},
		{
			title: "发票内容",
			dataIndex: "content"
		},
		{
			title: "状态",
			dataIndex: "show_status"
		},
		{
			title: "操作",
			width: 140,
			render: rs => {
				return (
					<div>
						<a onClick={() => $(page).open("申请修改", rs)} disabled={rs.status === "INVOICE"}>
							修改
						</a>
						<Divider type="vertical" />
						<a
							onClick={() => {
								$.confirm("确定要撤销申请吗？", async () => {
									let r = await $.post("/invoice/cancel", {
										invoice_uuid: rs.uuid
									});
									$.msg("撤销成功");
									$(tab).reload();
									return r;
								});
							}}
							disabled={rs.status === "INVOICE" || rs.status === "CANCEL"}
						>
							撤销
						</a>
						<Divider type="vertical" />
						<a
							disabled={rs.invoice_url ? 0 : 1}
							target="_blank"
							download={rs.title}
							href={rs.invoice_url}
						>
							查看
						</a>
					</div>
				);
			}
		}
	];
	return (
		<div className="bs ph_10 mt_15 bg_white">
			<div className="mb_15 pt_15 ta_r">
				<a className="fc_white" href="/adminPc/institution?curTabKey=order">
					<Btn>订单管理</Btn>
				</a>
			</div>
			<TablePagination api="/invoice/query" columns={columns} ref={tab} />
			<Page ref={page}>
				<Detail />
			</Page>
		</div>
	);
}
