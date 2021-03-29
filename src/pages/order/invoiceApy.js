import React, { useState } from "react";
import { Form as Forms, Alert, Modal } from "antd";
import { $, Form, Inputs, Btn } from "../comlibs";

export default function(props) {
	let { data = {} } = props.Parent || {};
	let order_uuids = $.getQueryString("uuid") || data.order_uuids.toString();
	let payamount = $.getQueryString("payamount") || data.fee;
	let disabled = data.status === "CANCEL";
	let type = "add";
	let content = "技术服务费";
	if (data.order_uuids) {
		type = "update";
	}

	let [taxid, setTaxid] = [];
	let taxidFn = t => (t === "PERSON" ? false : true);
	let Taxid = ({ form }) => {
		[taxid, setTaxid] = useState(taxidFn(data.title_type));
		return taxid ? (
			<Inputs
				label="税号"
				form={form}
				name="taxid"
				value={data.taxid}
				required={true}
				disabled={disabled}
				width={230}
			/>
		) : null;
	};

	const col = {
		labelCol: { span: 3 },
		wrapperCol: { span: 18 }
	};

	return (
		<div className="bs ph_15 pv_20 mt_15 bg_white">
			<Alert message="申请开票后，3~7个工作日内将为您处理~" type="info" />
			<Form
				{...col}
				action={`/invoice/${type === "add" ? "apply" : "update"}`}
				method="POST"
				valueReturn={val => {
					if (type === "add") {
						val.order_uuids = order_uuids;
					} else {
						val.invoice_uuid = data.uuid;
					}
					val.content = content;
					return val;
				}}
				success={() => {
					Modal.success({
						content: "您的发票申请我们已经收到，3~7个工作日内将为您开出发票！",
						onOk() {
							$.loc.href = "/adminPc/invoice";
						}
					});
				}}
			>
				{({ form, submit }) => (
					<div className="mt_15">
						<div className="fs_15">发票详情</div>
						<Inputs
							label="抬头类型"
							form={form}
							name="title_type"
							value={data.title_type}
							required={true}
							radios={[
								{ text: "企业单位", value: "COMPANY" },
								{ text: "个人/非企业单位", value: "PERSON" }
							]}
							onChange={rs => setTaxid(taxidFn(rs))}
							disabled={disabled}
						/>
						<Inputs
							label="发票抬头"
							form={form}
							name="title"
							value={data.title}
							required={true}
							disabled={disabled}
							width={230}
						/>
						<Taxid form={form} />
						<Forms.Item label="发票内容">{content}</Forms.Item>
						<Forms.Item label="发票金额">{payamount}</Forms.Item>
						<div className="fs_15 mv_10">收件人信息（必填）</div>
						<Inputs
							label="收件人"
							form={form}
							name="receiver_name"
							value={data.receiver_name}
							required={true}
							disabled={disabled}
							width={230}
						/>
						<Inputs
							label="电话号码"
							form={form}
							name="receiver_phone"
							value={data.receiver_phone}
							required={true}
							disabled={disabled}
							width={230}
						/>
						<Inputs
							label="电子邮箱"
							form={form}
							name="receiver_email"
							value={data.receiver_email}
							required={true}
							disabled={disabled}
							width={230}
						/>
						<Forms.Item wrapperCol={{ offset: col.labelCol.span }}>
							<Btn className="mt_15" onClick={submit} disabled={disabled}>
								{type === "add" ? "提交" : "修改"}申请
							</Btn>
						</Forms.Item>
					</div>
				)}
			</Form>
		</div>
	);
}
