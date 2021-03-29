import React, { useState } from "react";
import { Form as Forms, Table } from "antd";
import { Method, Page, Form, Inputs, Btn } from "../comlibs";
import Record from "./record";

export default function(props) {
	const $ = new Method();
	const Iconfont = $.icon();
	const { Parent } = props;
	const { book_uuid, count } = Parent.data;
	let [suc, setSuc] = useState(false);
	let { record } = {};

	let col = {
		labelCol: { span: 3 },
		wrapperCol: { span: 12 }
	};

	const columns = [
		{
			title: "尺寸",
			dataIndex: "size",
			key: "size",
			width: 100,
			align: "center"
		},
		{
			title: "材质",
			align: "center",
			children: [
				{
					title: "双铜纸（四色）",
					key: "fourcolor",
					width: 150,
					align: "center",
					render: rs => <span className="fc_err">{rs.fourcolor}</span>
				},
				{
					title: "双铜纸（六色）",
					key: "sixcolor",
					width: 150,
					align: "center",
					render: rs => <span className="fc_err">{rs.sixcolor}</span>
				}
			]
		},
		{
			title: "装订费",
			align: "center",
			children: [
				{
					title: "简装软皮",
					key: "soft",
					width: 150,
					align: "center",
					render: rs => <span className="fc_err">{rs.soft}</span>
				},
				{
					title: "精装硬皮",
					key: "hard",
					width: 150,
					align: "center",
					render: rs => <span className="fc_err">{rs.hard}</span>
				}
			]
		}
	];

	const data = [
		{
			key: 0,
			size: "A5(14.8cmx21cm)",
			fourcolor: "1元/页",
			sixcolor: "1.5元/页",
			soft: "18元/册",
			hard: "28元/册"
		},
		{
			key: 1,
			size: "A4(21cmx29.7cm)",
			fourcolor: "2元/页",
			sixcolor: "3元/页",
			soft: "50元/册",
			hard: "60元/册"
		}
	];

	return (
		<div style={{ marginBottom: 80 }}>
			<div className={`bg_white bs mt_20 pall_15 ${suc && "hide"}`}>
				<div className="fs_16 fc_white ta_c pv_10" style={{ background: "rgba(229,118,118,1)" }}>
					照片书价格计费标准：每册价钱=每页价钱x页数+装订费
				</div>
				<Table pagination={false} columns={columns} dataSource={data} bordered size="middle" />
			</div>
			<Form
				{...col}
				onSubmit={async (values, btn) => {
					values.uuid = book_uuid;
					await $.post("/album/book/order", values);
					btn.loading = false;
					setSuc(true);
				}}
			>
				{({ form, submit }) => (
					<div className="bg_white bs mt_15">
						<div className={`pall_15 ${suc && "hide"}`}>
							<Forms.Item {...col} label="照片总张数">
								{count === "all" ? "全部制作" : count + "张"}
							</Forms.Item>
							<Inputs label="购买数量(册)" form={form} name="amount" value={1} required={true} />
							<Inputs label="联系人" form={form} name="contact" required={true} />
							<Inputs label="联系电话" form={form} name="phone" required={true} />
							<Inputs label="收货地址" form={form} name="address" required={true} rows={3} />
							<Inputs label="微信" form={form} name="wechat" />
							<Inputs label="邮箱" form={form} name="email" />
							<Forms.Item wrapperCol={{ offset: col.labelCol.span }}>
								<Btn onClick={submit} />
							</Forms.Item>
						</div>
						<div className={`pall_15 ${!suc && "hide"}`}>
							<div className="box box-allc" style={{ height: 200 }}>
								<div className="box mr_15" style={{ marginTop: -40 }}>
									<Iconfont
										className="fc_suc"
										style={{
											fontSize: 34
										}}
										type="icon-chenggong"
									/>
								</div>
								<div className="box box-ver fs_14 fc_black">
									<div>服务商：北京小凡家</div>
									<div>我们已经收到您的需求，客服会尽快与您联系</div>
									<div className="mt_10">
										<Btn type="default" onClick={() => Parent.close()}>
											返回相册
										</Btn>
										<Btn className="ml_10" onClick={() => record.open("照片书制作记录")}>
											查看制作记录
										</Btn>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</Form>
			<Page background="#F1F1F1" ref={rs => (record = rs)}>
				<Record />
			</Page>
		</div>
	);
}
