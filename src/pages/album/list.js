import React, { useState } from "react";
import { Progress } from "antd";
import { WindowScroller } from "react-virtualized";
import { Method, Form, Unlimitedfalls, Page, Inputs, Dropdown, Btn } from "../comlibs";
import Detail from "./detail";
import Record from "./record";
import Edit from "./edit";

export default function() {
	const $ = new Method();
	const Iconfont = $.icon();
	let { unlimitedfalls, page, record, add, setInfo, welcome, setWelcome } = {};

	const dropdownlist = [
		{
			name: "修改相册信息",
			icon: "icon-xiugai",
			onClick: rs => {
				add.open("修改相册信息", rs.data);
			}
		},
		{
			name: "删除",
			icon: "icon-shanchu",
			onClick: rs => {
				$.confirm("确定要删除这个相册吗？", async () => {
					let del = await $.post(`/album/remove/${rs.data.uuid}`);
					$.msg("删除成功!");
					unlimitedfalls.remove(rs.index);
					return del;
				});
			}
		}
	];

	$.hover(
		".sub_albums",
		t => t.find(".pst_abs.tranall").removeClass("lucid"),
		t => t.find(".pst_abs.tranall").addClass("lucid")
	);
	let List = ({ index, data }) => {
		let vacancy = data.vacancy;
		return (
			<div
				className={`sub_albums sub_album_${index} pointer`}
				style={{
					padding: 5,
					margin: "2px 5px 11px 5px",
					height: 190,
					boxShadow: "rgb(222, 222, 222) 0px 4px 8px 3px"
				}}
			>
				{vacancy ? (
					<div onClick={() => add.open("创建新相册", {})}>
						<div
							className="ta_c"
							style={{
								height: 150,
								width: 150
							}}
						>
							<Iconfont
								className="fc_info"
								style={{
									marginTop: 60,
									fontSize: 42
								}}
								type="icon-chuangjian"
							/>
							<div className="fc_info fs_16 mt_15">创建相册</div>
						</div>
						<div className="fc_white lh_30">-</div>
					</div>
				) : (
					<div>
						<Dropdown
							className="pst_abs t_15 r_15 tranall lucid"
							data={{
								data,
								index
							}}
							list={dropdownlist}
						>
							<Iconfont className="fs_20" type="icon-caozuo" />
						</Dropdown>
						<div onClick={e => page.open(data.name, data.uuid)}>
							<div
								className="bg_spcc"
								style={{
									width: 150,
									height: 150,
									backgroundImage: `url(${data.cover})`
								}}
							/>
							<div
								className="pst_abs ta_r fc_white pr_10"
								style={{
									right: 10,
									top: 118,
									height: 40,
									width: 150,
									fontSize: 24,
									background: "linear-gradient(rgba(255,255,255,0), rgba(26,26,26,.4))"
								}}
							>
								{data.files || 0}
							</div>
							<div className={`lh_30 sub_album_name_${index}`}>{data.name}</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	let Info = () => {
		let initial = {
			hint: {},
			data: [],
			used_text: "0.0KB",
			total_size_text: "1.0GB"
		};
		let [data, setData] = useState(initial);
		setInfo = d => {
			!d.data && (d = initial);
			d.data.length === 0 && setWelcome(true);
			setData(d);
		};
		let percent = Math.round((data.used / data.total_size) * 10000) / 100.0;
		return (
			<div className="box box-ac">
				<Progress
					percent={percent < 2 ? 2 : percent}
					status="active"
					showInfo={false}
					style={{
						width: 120
					}}
				/>
				<span className="ph_10 fs_12">{`${data.used_text}/${data.total_size_text}`}</span>
				{data.hint.title && (
					<a href={data.hint.url} target="_blank">
						{data.hint.title}
					</a>
				)}
			</div>
		);
	};

	let Content = () => {
		[welcome, setWelcome] = useState(false);
		return (
			<div className="pall_15 bg_gray">
				<div
					className={welcome ? "ta_c bg_spcc" : "hide"}
					style={{
						height: 540,
						paddingTop: 200,
						backgroundImage:
							"url(https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b50132c4-09f8-11ea-ac92-00163e04cc20.jpeg)"
					}}
				>
					<div className="fc_white" style={{ fontSize: 28 }}>
						随心存储，记录学员点点滴滴
					</div>
					<div className="fc_white fs_18">个性玩法：照片书制作、分享转载</div>
					<Btn
						className="fs_18 mt_15"
						iconfont="chuangjianxiangce"
						onClick={() => add.open("创建新相册", {})}
						width={170}
						height={36}
					>
						创建相册
					</Btn>
				</div>
				<div className={welcome ? "hide" : ""}>
					<WindowScroller>
						{scroller => (
							<Unlimitedfalls
								api="/album/list"
								imageKey="cover"
								vacancy={true}
								cache={true}
								scroller={scroller}
								width={170}
								gutter={15}
								ref={rs => (unlimitedfalls = rs)}
								init={d => setInfo(d)}
								renderList={_props => <List {..._props} />}
							/>
						)}
					</WindowScroller>
				</div>
			</div>
		);
	};

	return (
		<div className="bg_white bs mt_20">
			<div className="box ph_15 pv_10">
				<Info />
				<div className="box box-1">
					<Form
						onSubmit={(values, btn) => {
							unlimitedfalls.search(values);
							btn.loading = false;
						}}
					>
						{({ form, submit }) => (
							<span>
								<Inputs
									name="name"
									className="mh_10 no-border"
									form={form}
									placeholder="请输入相册名称搜索"
								/>
								<Btn iconfont="sousuo" onClick={submit} />
							</span>
						)}
					</Form>
				</div>
				<div className="box box-ac">
					<a onClick={() => record.open("照片书制作记录")}>照片书制作记录</a>
				</div>
			</div>
			<Content />
			<Edit
				ref={rs => (add = rs)}
				success={() => {
					welcome && setWelcome(false);
					unlimitedfalls.reload();
				}}
			/>
			<Page
				background="#F1F1F1"
				ref={rs => (page = rs)}
				onClose={rs => rs && unlimitedfalls.reload()}
			>
				<Detail />
			</Page>
			<Page background="#F1F1F1" ref={rs => (record = rs)}>
				<Record />
			</Page>
		</div>
	);
}
