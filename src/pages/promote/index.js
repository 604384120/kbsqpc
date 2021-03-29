import React, { useState, useEffect } from "react";
import { Poster } from "../works";

import {
	$,
	Page,
	Form,
	Inputs,
	Modals,
	Btn,
	TablePagination,
	Dropdown,
	Img,
} from "../comlibs";
import { Tabs, Divider, Form as Forms, InputNumber, Radio } from "antd";
import Detail from "./detail";

const { TabPane } = Tabs;
export default function () {
	let {
		campus_name=JSON.parse(localStorage.campus_obj).name,
		page_detail,
		create,
		create_promoter,
		vipModal,
		poster,
		tab = { activity: {}, data: {}, promoter: {} },
		curTabKey = "activity",
	} = {};
	let [searchTag, setTag] = useState("today");
	let [statistics, setSta] = useState({});
	let status_txt = {
		ON: "进行中",
		OFF: "已结束",
	};
	let status_color = {
		ON: "#1890FF",
		OFF: "rgba(0,0,0,0.25)",
	};
	const dropdown_on = [
		{
			name: "结束",
			onClick: (rs) => {
				$.confirm("确定要结束该活动吗？", async () => {
					let res = await $.post("/groundpush/activity/status", {
						act_uuid: rs.uuid,
						status: "OFF",
					});
					$.msg("结束成功!");
					tab.activity.reload();
					return res;
				});
			},
		},
		{
			name: "删除",
			onClick: (rs) => {
				$.confirm("确定要删除该活动吗？", async () => {
					let res = await $.get("/groundpush/activity/remove", {
						act_uuid: rs.uuid,
					});
					$.msg("删除成功!");
					tab.activity.reload();
					return res;
				});
			},
		},
	];
	const dropdown_off = [
		{
			name: "删除",
			onClick: (rs) => {
				$.confirm("确定要删除该活动吗？", async () => {
					let res = await $.get("/groundpush/activity/remove", {
						act_uuid: rs.uuid,
					});
					$.msg("删除成功!");
					tab.activity.reload();
					return res;
				});
			},
		},
	];
	let activity_columns = [
		{
			title: "序号",
			align: "center",
			dataIndex: "_key",
			width: 60,
		},
		{
			title: "活动名称",
			render(rs) {
				return (
					<span
						className="link"
						onClick={() => {
							page_detail.open("活动详情", rs);
						}}
					>
						{rs.act_name}
					</span>
				);
			},
		},
		{
			title: "状态",
			dataIndex: "status",
			render(res) {
				return (
					<div className="dis_f ai_c">
						<span
							className="dis_ib mr_5"
							style={{
								width: 6,
								height: 6,
								backgroundColor: status_color[res],
								borderRadius: "50%",
							}}
						></span>{" "}
						{status_txt[res]}
					</div>
				);
			},
		},
		{
			title: "名单量",
			align: "center",
			dataIndex: "cnt_student",
		},
		{
			title: "重复名单",
			align: "center",
			dataIndex: "cnt_sturepeat",
		},
		{
			title: "推广员",
			dataIndex: "cnt_promo",
		},
		{
			title: "创建者",
			dataIndex: "creator_name",
		},
		{
			title: "创建时间",
			dataIndex: "time_create",
		},
		{
			title: "操作",
			align: "center",
			width: 250,
			render(rs) {
				return (
					<div>
						<span
							className="link"
							onClick={() => {
								page_detail.open("活动详情", rs);
							}}
						>
							下载名单
						</span>
						<Divider type="vertical" />
						<span
							className={rs.status==='OFF'?'fc_gray2':'link'}
							onClick={() => {
								if(rs.status==='OFF'){
									return false;
								}
								poster.open(
									{
										title: '邀请推广员',
										btnTitle: "下载二维码",
									},
									{
										api: "/groundpush/xcx/qrcode",
										params: {
											campus_name:campus_name,
											act_uuid: rs.uuid,
											xcx_appid: "wx512a1c73bf234c3f",
											page: "pages/index/invitation",
											campus_uuid: $.campus_uuid(),
										},
									}
								);
							}}
						>
							邀请推广员
						</span>
						<Divider type="vertical" />
						<Dropdown
							data={rs}
							list={rs.status === "ON" ? dropdown_on : dropdown_off}
							placement="bottomCenter"
						>
							<a className="ant-dropdown-link">更多</a>
						</Dropdown>
					</div>
				);
			},
		},
	];
	let data_columns = [
		{
			title: "推广员",
			render(rs) {
				return <span>{rs.admin_name || rs.promo_name || ""}</span>;
			},
		},
		{
			title: "采集时间",
			render(rs) {
				return (
					<span>
						{rs.time_format.year}-{rs.time_format.origin_date} {rs.time_format.show_time}
					</span>
				);
			},
		},
		{
			title: "姓名",
			dataIndex: "name",
		},
		{
			title: "联系人",
			dataIndex: "contact",
			render(rs){
				return <span>{rs||'-'}</span>
			}
		},
		{
			title: "联系电话",
			dataIndex: "phone",
		},
		{
			title: "线索验证",
			render(rs) {
				return (
					<span>
						{rs.is_phoneverific === "NO" && rs.is_authority === "NO" && "未验证"}
						{rs.is_authority === "YES"&&(rs.is_phoneverific === "YES"||rs.is_phoneverific === "NO")?'微信验证':''}
						{rs.is_authority === "NO"&&rs.is_phoneverific === "YES"?'短信验证':''}
					</span>
				);
			},
		},
		{
			title: "是否重复",
			render(rs) {
				return <span>{rs.is_repeat === "YES" ? "是" : "否"}</span>;
			},
		},
		{
			title: "用户位置",
			dataIndex: "address",
		},
		{
			title: "备注(推广员)",
			dataIndex: "remark",
		},
	];
	let promoter_columns = [
		{
			title: "序号",
			align: "center",
			dataIndex: "_key",
			width: 60,
		},
		{
			title: "推广员姓名",
			render(rs) {
				return (
					<span
						className="link"
						onClick={() => {
							create_promoter.open("更新推广员", rs);
						}}
					>
						{rs.name}
					</span>
				);
			},
		},
		{
			title: "联系电话",
			dataIndex: "phone",
		},
		{
			title: "价格",
			align: "center",
			render(rs) {
				return (
					<span>
						{rs.price?('￥'+rs.price):'-'}
						{rs.price?(
							<span>
								<span className={rs.price_tag === "day" ? "" : "hide"}>/天</span>
								<span className={rs.price_tag === "week" ? "" : "hide"}>/周</span>
								<span className={rs.price_tag === "hour" ? "" : "hide"}>/小时</span>
							</span>
						):''}
						
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
			title: "最近参与",
			dataIndex: "partake_date",
			render:rs=><span>{rs||'-'}</span>
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
		{
			title: "操作",
			width: 100,
			align: "center",
			render(rs) {
				return (
					<div>
						<span
							className="link"
							onClick={() => {
								create_promoter.open("更新推广员", rs);
							}}
						>
							更新
						</span>
						<Divider type="vertical" />
						<span
							className="link fc_pink"
							onClick={() => {
								$.confirm("确定要删除该推广员吗？", async () => {
									await $.get("/groundpush/promoter/remove", {
										promo_uuid: rs.uuid,
									});
									tab.promoter.reload();
									$.msg("删除成功！");
								});
							}}
						>
							删除
						</span>
					</div>
				);
			},
		},
	];
	useEffect(() => {
		(async () => {
			let d = await $.get("/groundpush/activity/statistics", {
				tag: searchTag,
			});
			setSta(d);
		})();
	}, [searchTag]);
	return (
		<div className="mt_15 br_2">
			<div className="topTips">
				<img
					src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/bd887f26-85f2-11ea-8b90-00163e04cc20.png"
					width="20"
					height="20"
					alt="null"
				/>
				<span className="ml_10">更多高级功能，限时优惠</span>
				<a
					className="ml_15"
					onClick={() => {
						vipModal.open('申请试用');
					}}
					style={{ color: "#388DED", textDecoration: "underline" }}
				>
					申请试用
				</a>
				<a className="ml_15" href="https://www.sxzapi.cn/product/productset.html?menu=xcx&id=98ff09f3-a64c-11ea-8b90-00163e04cc20&pt=groundpush" target="_blank" style={{ color: "#388DED", textDecoration: "underline" }}>
					立即购买
				</a>
			</div>
			<div className="bg_white mt_15 ph_10">
				<Tabs defaultActiveKey={curTabKey} onChange={(key) => curTabKey === key}>
					<TabPane tab="地推活动" key="activity">
						<Form onSubmit={(values) => tab.activity.search(values)}>
							{({ form }) => (
								<div className="mb_15">
									<Inputs
										className="mr_15"
										name="status"
										type="select"
										placeholder="请选择状态"
										value=""
										form={form}
										select={[
											{
												value: "",
												text: "全部状态",
											},
											{
												value: "ON",
												text: "进行中",
											},
											{
												value: "OFF",
												text: "已结束",
											},
										]}
										autoSubmit={true}
									/>
									<Inputs
										placeholder="输入活动名称查询"
										className="mr_15"
										form={form}
										name="act_name"
									/>
									<Btn htmlType="submit" iconfont="sousuo">
										搜索
									</Btn>
									<Btn
										onClick={() => {
											create.open("轻地推", {});
										}}
										className="fl_r mr_15"
									>
										新建活动
									</Btn>
								</div>
							)}
						</Form>
						<TablePagination
							api="/groundpush/activity/list"
							columns={activity_columns}
							ref={(ref) => (tab.activity = ref)}
						/>
					</TabPane>
					<TabPane tab="数据跟踪" key="data">
						<div className="mb_15">
							<Radio.Group
								value={searchTag}
								onChange={(e) => {
									setTag(e.target.value);
								}}
							>
								<Radio.Button value="today">今天</Radio.Button>
								<Radio.Button value="yesterday">昨日</Radio.Button>
								<Radio.Button value="sevenday">最近7天</Radio.Button>
								<Radio.Button value="thirtyday">最近30天</Radio.Button>
							</Radio.Group>
						</div>
						<div className="mb_15 box b_1 pv_15">
							<div className="box box-1 box-ver br_1">
								<div className="box box-pc fs_13" style={{ color: "rgba(0,0,0,0.45)" }}>
									扫码次数
								</div>
								<div className="box box-pc fs_18 fw_600" style={{ color: "#FF9800" }}>
									{statistics.cnt_sweepcode}
								</div>
							</div>
							<div className="box box-1 box-ver br_1">
								<div className="box box-pc fs_13" style={{ color: "rgba(0,0,0,0.45)" }}>
									推广员
								</div>
								<div className="box box-pc fs_18 fw_600" style={{ color: "#FF9800" }}>
									{statistics.cnt_promo}
								</div>
							</div>
							<div className="box box-1 box-ver br_1">
								<div className="box box-pc fs_13" style={{ color: "rgba(0,0,0,0.45)" }}>
									总名单
								</div>
								<div className="box box-pc fs_18 fw_600" style={{ color: "#FF9800" }}>
									{statistics.cnt_student}
								</div>
							</div>
							<div className="box box-1 box-ver br_1">
								<div className="box box-pc fs_13" style={{ color: "rgba(0,0,0,0.45)" }}>
									重复名单
								</div>
								<div className="box box-pc fs_18 fw_600" style={{ color: "#FF9800" }}>
									{statistics.cnt_sturepeat}
								</div>
							</div>
							<div className="box box-1 box-ver">
								<div className="box box-pc fs_13" style={{ color: "rgba(0,0,0,0.45)" }}>
									活动数
								</div>
								<div className="box box-pc fs_18 fw_600" style={{ color: "#FF9800" }}>
									{statistics.cnt_act}
								</div>
							</div>
						</div>
						<TablePagination
							api="/groundpush/activity/statistics/list"
							columns={data_columns}
							params={{ tag: searchTag }}
							ref={(ref) => (tab.data = ref)}
						/>
					</TabPane>
					<TabPane tab="推广员" key="promoter">
						<Form onSubmit={(values) => tab.promoter.search(values)}>
							{({ form }) => (
								<div className="mb_15">
									<Inputs placeholder="输入推广员名称" className="mr_15" form={form} name="name" />
									<Btn htmlType="submit" iconfont="sousuo">
										搜索
									</Btn>
									<Btn
										onClick={() => {
											create_promoter.open("新建推广员", {});
										}}
										className="fl_r"
									>
										新建
									</Btn>
								</div>
							)}
						</Form>
						<TablePagination
							api="/groundpush/promoter/list"
							columns={promoter_columns}
							ref={(ref) => (tab.promoter = ref)}
						/>
					</TabPane>
				</Tabs>
			</div>
			<Page
				ref={(rs) => (page_detail = rs)}
				onClose={() => {
					tab[curTabKey].reload();
				}}
			>
				<Detail />
			</Page>
			<Modals ref={(rs) => (create = rs)} style={{ width: 450, height: 430, borderRadius: 6 }}>
				<div className="box box-ver">
					<div className="box box-ver box-1 box-pc">
						<div
							className="box bg_spcc"
							style={{
								width: 270,
								height: 270,
								backgroundImage: `url("https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/fbc423ae-85f1-11ea-8b90-00163e04cc20.jpeg")`,
								margin: "auto",
							}}
						/>
						<div className="box box-allc fc_gray fs_18 mt_15">
							手机微信扫一扫，登录小程序创建活动
						</div>
					</div>
				</div>
			</Modals>
			<Modals
				ref={(rs) => (vipModal = rs)}
				className="ov_h pb_0"
				style={{ width: 400, borderRadius: 6 }}
				bodyStyle={{ padding: 0,}}
			>
				<div className="CUSTOM_scroll oy_a pr_0" style={{ width: 400,height: 530}}>
					<Img
						src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/86c2f23e-9f3b-11ea-8b90-00163e04cc20.png"
						width="100%"
					/>
				</div>
			</Modals>
			<Modals ref={(rs) => (create_promoter = rs)}>
				{({ name, phone, price, price_tag, nature, uuid }) => (
					<Form
						labelCol={{ span: 5 }}
						wrapperCol={{ span: 18 }}
						onSubmit={async (values) => {
							if (uuid) {
								values.promo_uuid = uuid;
								await $.post(`/groundpush/promoter/update`, values);
								create_promoter.close();
								tab.promoter.reload();
								$.msg("更新成功!");
							} else {
								await $.post("/groundpush/promoter/create", values);
								create_promoter.close();
								tab.promoter.reload();
								$.msg("创建成功!");
							}
						}}
					>
						{({ form }) => (
							<div>
								<Inputs
									label="姓名"
									form={form}
									name="name"
									value={name}
									required={true}
									width={300}
								/>
								<Inputs
									label="电话"
									form={form}
									name="phone"
									value={phone}
									width={300}
									required={true}
								/>
								<Forms.Item label="价格">
									<div className="box box-ac" style={{ width: 300 }}>
										{form.getFieldDecorator("price", {
											initialValue: price,
										})(
											<InputNumber placeholder="价格" className="mr_12 box-1" min={0} step={20} />
										)}
										<Inputs
											name="price_tag"
											placeholder="周/天/小时"
											value={price_tag || "hour"}
											select={[
												{ text: "周", value: "week" },
												{ text: "天", value: "day" },
												{ text: "小时", value: "hour" },
											]}
											required={true}
											form={form}
										/>
									</div>
								</Forms.Item>
								{/* <Inputs
									label="工作性质"
									name="nature"
									form={form}
									value={nature || "partime"}
									placeholder="请设置工作性质"
									radios={[
										{
											value: "fulltime",
											text: "专员",
										},
										{
											value: "partime",
											text: "兼职",
										},
									]}
								/> */}
								<div className="ta_r mt_15 bt_1 pt_20">
									<Btn
										className="cancelBtn"
										onClick={() => {
											create_promoter.close();
										}}
									>
										取消
									</Btn>
									<Btn htmlType="submit" className="ml_15" />
								</div>
							</div>
						)}
					</Form>
				)}
			</Modals>
			<Poster width={250} height={250} backgroundColor="#fff" ref={(ref) => (poster = ref)} />
		</div>
	);
}
