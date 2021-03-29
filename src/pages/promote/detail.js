import React, { useState, useEffect } from "react";
import { Btn, Method, TablePagination, Img } from "../comlibs";
import { Tabs,Empty } from "antd";
import { Page_ChoicePromoter, Poster } from "../works";
import Zmage from "react-zmage";
const { TabPane } = Tabs;
export default function (props) {
	const $ = new Method();
	const Parent = props.Parent;
	let { tab, curTabKey = "clue", choicePromoter, data = Parent.data, poster } = {};
	let [pro_img, setProimg] = useState([]);
	let [columns, setColumns] = useState([]);
	let [promoters, setPromoter] = useState([]);
	let [clocks,setClocks]=useState([])
	useEffect(() => {
		(async () => {
			Parent.setCloseData(true);
			getOnload();
		})();
	}, [1]);
	let columns_push = [
		{
			title: "用户位置",
			dataIndex: "address",
		},
		{
			title: "推广员备注",
			dataIndex: "remark",
		},
	];
	useEffect(() => {
		(() => {
			let list = [
				{
					title: "序号",
					align: "center",
					dataIndex: "_key",
					width: 60,
				},
				{
					title: "推广员",
					render(rs) {
						return <span>{rs.admin_name || rs.promo_name || ""}</span>;
					},
				},
				{
					title: "采集时间",
					dataIndex: "time_create",
				},
				{
					title: "姓名",
					dataIndex: "name",
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
			];
			if(data.contact){
				list.splice(3,0,{
					title: "联系人",
					dataIndex: "contact",
					render(rs){
						return <span>{rs||'-'}</span>
					}
				})
			}

			for (let i = 1; i < Object.keys(data).length; i++) {
				for (let t in data) {
					if ("exp" + i === t) {
						list.push({
							title: data[t].name,
							dataIndex: t + ".value",
						});
					}
				}
			}
			setColumns(list);
			
		})();
	}, [1]);
	function getOnload() {
		(async () => {
			let rs = await $.get("/groundpush/activity/detail", {
				act_uuid: data.uuid,
			});
			setPromoter([]);
			setProimg([]);
			if (rs.promo_uuids && rs.promo_uuids.length > 0) {
				let datas = [];
				rs.promo_uuids.map((v) => {
					datas.push({ uuid: v });
					return v;
				});
				setPromoter(datas);
				let r = await $.get("/groundpush/activity/qrcode", {
					act_uuid: data.uuid,
					promo_uuids: rs.promo_uuids.toString(),
				});
				setProimg(r);
			}
			let res=await $.get('/groundpush/promoter/signin/list',{
				act_uuid: data.uuid,
				limit:9999
			})
			setClocks(res.data)
		})();
	}
	return (
		<div className="bg_white mt_15 ph_10 br_2">
			<div className="pt_15">
				<div className="box">
					<span className="box fw_600 ph_15 fs_20 fc_black">{data.act_name}</span>
					<div className="box box-1 box-pe">
						<Btn
							onClick={async () => {
								await $.download("/groundpush/students/export/fields", {
									act_uuid: data.uuid,
								});
								$.msg("下载成功！");
							}}
						>
							下载名单
						</Btn>
					</div>
				</div>
				<Tabs defaultActiveKey={curTabKey} onChange={(key) => curTabKey === key}>
					<TabPane tab="线索" key="clue">
						<div className={columns.length === 0 ? "hide" : ""}>
							<TablePagination
								api="/groundpush/activity/student/detail"
								params={{ act_uuid: data.uuid }}
								columns={columns.concat(columns_push)}
								ref={(ref) => (tab = ref)}
							/>
						</div>
					</TabPane>
					<TabPane tab="推广员" key="promoter" className="pl_15">
						<Btn
							className="mb_15"
							onClick={() => {
								choicePromoter.open({
									act_uuid: data.uuid,
									value: promoters,
									onSure: async (d) => {
										let uuids = [];
										d.map((v) => {
											uuids.push(v.uuid);
											return uuids;
										});
										await $.post("/groundpush/activity/promoter/add", {
											act_uuid: data.uuid,
											promo_uuids: uuids.toString(),
										});
										getOnload();
										$.msg("添加成功！");
									},
								});
							}}
						>
							添加推广员
						</Btn>
						<div className="box">
							<div
								style={{
									overflow: "hidden",
								}}
								className={pro_img.length > 1 ? "" : "ml_10"}
							>
								{pro_img.map((item, index) => {
									return (
										<div
											className="mr_15 pall_10 mb_15 fl_l"
											style={{
												borderRadius: "8px",
												background: "#fff",
												border: "1px solid rgba(234,234,234,1)",
											}}
											key={index}
										>
											<div style={{ position: "relative" }}>
												<Img
													width="160px"
													height="160px"
													src={$.loc.origin +`/groundpush/xcx/qrcode?act_uuid=${data.uuid}&xcx_appid=wx512a1c73bf234c3f&page=pages/data/form&campus_uuid=${$.campus_uuid()}&promo_uuid=${item.uuid}&token=${$.token()}&promo_kind=promoter`}
													alt="null"
													style={{ borderRadius: "8px" }}
												/>
											</div>
											<div className="box box-allc fs_16 ta_c pb_10">
												<span
													style={{
														color: "rgba(0,0,0,0.65)",
														fontWeight: "bold",
													}}
												>
													{item.name}
												</span>
												<span
													style={{
														color: "#C6C6C6",
														textDecoration: "underline",
														marginLeft: "5px",
													}}
													className="fs_12 pointer"
													onClick={() => {
														$.confirm("确定要删除该推广员吗？", async () => {
															await $.get("/groundpush/activity/promo/remove", {
																promo_uuid: item.uuid,
																act_uuid: data.uuid,
															});
															getOnload();
														});
													}}
												>
													删除
												</span>
											</div>
										</div>
									);
								})}
							</div>
						</div>
						<div className="fs_16 fc_black5 fb mv_10" style={{fontFamily:'PingFang-SC-Bold,PingFang-SC'}}>纸质传单参考样例</div>
						<div >
							<img
								src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/79881fc2-85d2-11ea-8b90-00163e04cc20.png"
								style={{ width: "100%" }}
							/>
						</div>
					</TabPane>
					
					<TabPane tab="签到打卡" key="clock" className="pl_15">
						{clocks.map(clock=>(
							<div className="bb_1">
								<div className="mb_10 fs_20">
									<span className="mr_30">{clock.promo_name}</span>
									<span className="mr_30">{clock.time_create}</span>
									<span>{clock.address}</span>
								</div>
								<div className="pb_10">
									{
										clock.cover.map((c,index)=>(
											<Zmage
												className="wh_full br_3 mr_15 mb_15"
												controller={{ zoom: false }}
												backdrop="rgba(255,255,255,.9)"
												style={{width:150,height:150}}
												alt={c}
												src={c}
												set={clock.cover.map(c => ({
													src: c,
													alt: c
												}))}
												defaultPage={index}
											/>
										))
									}
								</div>
							</div>
						))}
						{clocks.length===0&&(
							<div>
								<Empty description="暂无签到记录"/>
							</div>
						)}
						<div style={{height:20}}></div>
					</TabPane>
				</Tabs>
			</div>
			<Poster width={250} height={250} backgroundColor="#fff" ref={(ref) => (poster = ref)} />
			<Page_ChoicePromoter ref={(ref) => (choicePromoter = ref)} />
		</div>
	);
}
