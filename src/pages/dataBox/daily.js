import React, { useState, useEffect } from "react";
import { InputNumber, Divider, Form as Forms, Popconfirm,Tooltip } from "antd";
import { Page, Form, Modals, Inputs, Btn, TablePagination, Method } from "../comlibs";
import { Teacher, FeeTypes } from "../works";
import FeeType from "./feeType";

export default function(props) {
	let $ = new Method();
	let { tab, add_modal, page_feeType, type_modal, search, setSearch, feeType_obj } = {};
	let columns = [
		{
			title: "创建时间",
			width: 150,
			dataIndex: "time_create"
		},
		{
			title: "报销时间",
			dataIndex: "reimbursed_date",
		},
		{
			title: "申请人",
			dataIndex: "teacher_name"
		},
		{
			title: "费用发生时间",
			dataIndex: "expend_date"
		},
		{
			title: "支出金额(元)",
			dataIndex: "expend_fee"
		},
		{
			title: "支出类型",
			dataIndex: "feetype_name"
		},
		{
			title: "支出内容",
			dataIndex: "fee_detail"
		},
		{
			title: "备注",
			dataIndex: "remark"
		},
		{
			title: "结算状态",
			render(rs) {
				return (
					<span
						className="pointer"
						onClick={async () => {
							if (rs.status === "UNREIMBURS") {
								await $.post("/reimburse/apply/reimbursed", { reimburseapply_uuid: rs.uuid });
							} else {
								await $.post("/reimburse/apply/unreimburse", { reimburseapply_uuid: rs.uuid });
							}
							$.msg("结算状态修改成功");
							tab.reload();
							getRecent();
						}}
					>
						{rs.status === "UNREIMBURS" ? (
							<span className="fc_gold">未结算</span>
						) : (
							<span className="fc_gray1">已结算</span>
						)}
					</span>
				);
			}
		},
		{
			title: "操作",
			align: "center",
			render(obj) {
				if (obj.status === "UNREIMBURS") {
					return (
						<div>
							<span
								className="link"
								onClick={() => {
									add_modal.open("编辑费用记录", obj);
								}}
							>
								编辑
							</span>
							<Divider type="vertical" />
							<Popconfirm
								title="确认删除该记录吗?"
								onConfirm={async () => {
									await $.post("/reimburse/apply/remove", { reimburseapply_uuid: obj.uuid });
									$.msg("支出记录删除成功");
									tab.reload();
									getRecent();
								}}
								okText="确定"
								cancelText="取消"
							>
								<span className="fc_err pointer">删除</span>
							</Popconfirm>
						</div>
					);
				} else {
					return <div></div>;
				}
			}
		}
	];
	let [recent, setRecent] = useState(null);
	useEffect(() => {
		getRecent();
	}, []);
	async function getRecent() {
		let res = await $.get("/statistics/payment/recent");
		setRecent(res);
	}

	function ExportBtn(props) {
		[search, setSearch] = useState({});
		return (
			<Btn
				{...props}
				onClick={async btn => {
					search.totalnum = "NO";
					await $.download("/reimburse/apply/export", search);
					btn.setloading(false, 5000);
				}}
			>
				导出
			</Btn>
		);
	}

	return (
		<div className="bg_white mt_20 br_2 pall_15">
			<div className="mb_15 box">
				{recent &&
					recent.months.map((mon, index) => (
						<div key={index} className="br_2 bs ta_c box-1 mr_24">
							<div className="mv_15 fc_black1">{mon.month}月累计</div>
							<div className="mv_15">
								<Tooltip placement="rightTop" title={<span>已结算支出按处于已结算状态的费用记录里的报销时间进行统计</span>}>
									<img className="va_t pointer" style={{marginRight:3,marginTop:6}} alt="?" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/3d75055c-6b18-11e9-9a54-00163e04cc20.png"/>
								</Tooltip>
								已结算支出：
								<span className="fs_16 fb fc_err">
									¥{mon.REIMBURSED_FEE}（{parseInt(mon.REIMBURSED_NUM || 0)}笔）
								</span>
							</div>
							<div className="mv_15">
								<Tooltip placement="rightTop" title={<span>未结算支出按处于未结算状态的费用记录里的费用发生时间进行统计</span>}>
									<img className="va_t pointer" style={{marginRight:3,marginTop:6}} alt="?" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/3d75055c-6b18-11e9-9a54-00163e04cc20.png"/>
								</Tooltip>
								未结算支出：
								<span className="fs_16 fb fc_blue">
									¥{mon.UNREIMBURSE_FEE}（{parseInt(mon.UNREIMBURSE_NUM || 0)}笔）
								</span>
							</div>
						</div>
					))}
				{recent && (
					<div className="br_2 bs ta_c box-1">
						<div className="mv_15 fc_black1">本年累计</div>
						<div className="mv_15">
							<Tooltip placement="rightTop" title={<span>已结算支出按处于已结算状态的费用记录里的报销时间进行统计</span>}>
								<img className="va_t pointer" style={{marginRight:3,marginTop:6}} alt="?" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/3d75055c-6b18-11e9-9a54-00163e04cc20.png"/>
							</Tooltip>
							已结算支出：
							<span className="fs_16 fb fc_err">
								¥{recent.year.REIMBURSED_FEE}（{parseInt(recent.year.REIMBURSED_NUM || 0)}笔）
							</span>
						</div>
						<div className="mv_15">
							<Tooltip placement="rightTop" title={<span>未结算支出按处于未结算状态的费用记录里的费用发生时间进行统计</span>}>
								<img className="va_t pointer" style={{marginRight:3,marginTop:6}} alt="?" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/3d75055c-6b18-11e9-9a54-00163e04cc20.png"/>
							</Tooltip>
							未结算支出：
							<span className="fs_16 fb fc_blue">
								¥{recent.year.UNREIMBURSE_FEE}（{parseInt(recent.year.UNREIMBURSE_NUM || 0)}笔）
							</span>
						</div>
					</div>
				)}
			</div>
			<Form
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 18 }}
				valueReturn={val => {
					if (val.date) {
						val.min_reimbursed_date = val.date[0];
						val.max_reimbursed_date = val.date[1];
					}
					setSearch(val);
					return val;
				}}
				onSubmit={values => tab.search(values)}
			>
				{({ form }) => (
					<div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
						<Inputs
							className="mr_15 dis_ib"
							label="报销时间"
							placeholder="请选择报销时间"
							name="date"
							type="rangePicker"
                            form={form}
                            autoSubmit={true}
						/>
						<div className="dis_ib mr_15">
							<Forms.Item label="金额范围">
								{form.getFieldDecorator(
									"min_expend_fee",
									{}
								)(<InputNumber min={0} placeholder="最小金额" />)}
								<span className="mh_3">~</span>
								{form.getFieldDecorator(
									"max_expend_fee",
									{}
								)(<InputNumber min={0} placeholder="最大金额" />)}
							</Forms.Item>
						</div>

						<Teacher
							className="mr_15 dis_ib"
							style={{ width: "200px" }}
							placeholder="请选择申请人"
							name="apply_teacher_uuid"
							form={form}
							autoSubmit={true}
						/>
						<Inputs
							className="mr_15 dis_ib"
							style={{ width: "200px" }}
							placeholder="全部结算状态"
							name="status"
							value=""
							type="select"
							select={[
								{
									text: "全部结算状态",
									value: ""
								},
								{
									text: "已结算",
									value: "REIMBURSED"
								},
								{
									text: "未结算",
									value: "UNREIMBURS"
								}
							]}
							form={form}
							autoSubmit={true}
						/>
						<Btn className="mr_15" htmlType="submit" iconfont="sousuo">
							搜索
						</Btn>
					</div>
				)}
			</Form>
			<div className="mv_15">
				<Btn className="mr_15" onClick={() => add_modal.open("费用支出", {})}>
					+ 新增
				</Btn>
				<ExportBtn className="mb_10 fl_r" type="default" style={{ width: 100 }} />
				<Btn
					className="fl_r mr_15"
					style={{ width: 100 }}
					onClick={() => {
						page_feeType.open("支出类型");
					}}
				>
					支出类型
				</Btn>
			</div>

			<TablePagination api="/reimburse/apply/list" columns={columns} ref={ref => (tab = ref)} />

			<Page
				ref={ref => (page_feeType = ref)}
				onClose={() => {
					tab.reload();
				}}
			>
				<FeeType style={{ marginTop: 20 }} />
			</Page>

			<Modals
				onCancel={() => {
					feeType_obj.getList();
					tab.init();
				}}
				zIndex={200}
				ref={ref => (type_modal = ref)}
			>
				<FeeType />
			</Modals>
			<Modals zIndex={100} ref={ref => (add_modal = ref)}>
				{obj => (
					<Form
						action={obj.expend_fee ? "/reimburse/apply/update" : "/reimburse/apply/add"}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						params={{ reimburseapply_uuid: obj.uuid || undefined }}
						method="POST"
						success={() => {
							tab.reload();
							getRecent();
							if (obj.expend_fee) {
								$.msg("修改成功");
							} else {
								$.msg("新增成功");
							}

							add_modal.close();
						}}
					>
						{({ form }) => (
							<div>
								<div>
									<Teacher
										style={{ width: 200 }}
										placeholder="请选择申请人"
										label="申请人"
										value={obj.apply_teacher_uuid || undefined}
										required={true}
										name="apply_teacher_uuid"
										form={form}
									/>
								</div>
								<div>
									<Forms.Item label="支出金额">
										{form.getFieldDecorator("expend_fee", {
											initialValue: obj.expend_fee || null,
											rules: [{ required: true, message: "请输入支出金额" }]
										})(<InputNumber placeholder="支出金额" min={0} />)}{" "}
										元
									</Forms.Item>
								</div>
								<div className="box" style={{ marginLeft: 50 }}>
									<div style={{ width: 320 }}>
										<FeeTypes
											ref={ref => {
												feeType_obj = ref;
											}}
											required={true}
											value={obj.feetype_id || undefined}
											style={{ width: 200 }}
											label="支出类型"
											name="feetype_id"
											form={form}
										/>
									</div>
									<Btn
										style={{ marginTop: 4 }}
										onClick={() => {
											type_modal.open("支出类型");
										}}
									>
										新增
									</Btn>
								</div>
								<div>
									<Inputs
										required={true}
										value={obj.expend_date || null}
										name="expend_date"
										form={form}
										label="费用发生时间"
										type="datePicker"
									/>
								</div>
								<div>
									<Inputs
										value={obj.reimbursed_date || null}
										name="reimbursed_date"
										form={form}
										label="报销时间"
										type="datePicker"
									/>
								</div>
								<div>
									<Inputs
										required={true}
										value={obj.fee_detail || null}
										name="fee_detail"
										form={form}
										label="支出内容"
										type="textArea"
									/>
								</div>
								<div>
									<Inputs
										name="remark"
										value={obj.remark || null}
										form={form}
										maxlength={10}
										label="支出备注"
										type="textArea"
									/>
								</div>
								<div className="ta_c">
									<Btn htmlType="submit" type="primary">
										保存
									</Btn>
								</div>
							</div>
						)}
					</Form>
				)}
			</Modals>
		</div>
	);
}
