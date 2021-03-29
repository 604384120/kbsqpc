import React, { useState } from "react";
import $$ from "jquery";
import { Method, Unlimitedfalls, Page, Dropdown, Uploadimgs, Img, Btn } from "../comlibs";
import { Poster } from "../works";
import Detail from "./photo";
import Choice from "./choice";
import Batch from "./batch";
import Edit from "./edit";
import Move from "./move";

export default function(props) {
	const $ = new Method(props);
	const Parent = props.Parent;
	const Iconfont = $.icon();

	let uuid = Parent.data;

	let { unlimitedfalls, page, edit, choice, batch, uploadimgs, info, setInfo, move, poster } = {};

	const dropdownlist = [
		{
			name: "向左转",
			icon: "icon-zuozhuan",
			onClick: async rs => {
				await $.post(`/album/${uuid}/photo/${rs.data.uuid}/turnleft`);
				let img = $$(`.sub_album_${rs.index} img`);
				$.rotate(img, -90);
			}
		},
		{
			name: "向右转",
			icon: "icon-youzhuan",
			onClick: async rs => {
				await $.post(`/album/${uuid}/photo/${rs.data.uuid}/turnright`);
				let img = $$(`.sub_album_${rs.index} img`);
				$.rotate(img, 90);
			}
		},
		{
			name: "设为封面",
			icon: "icon-fengmian",
			onClick: async rs => {
				let ossobj = rs.data.oss_path;
				await $.post(`/album/${uuid}/photo/setcover`, {
					ossobj
				});
				Parent.setCloseData(true);
				$.msg("设置成功!");
				setInfo({
					...info,
					cover: ossobj
				});
			}
		},
		{
			name: "移动到相册",
			icon: "icon-yidongxiangce",
			onClick: rs => {
				move.open(rs);
			}
		},
		{
			name: "删除",
			icon: "icon-shanchu",
			onClick: rs => {
				$.confirm("确定要删除这张照片吗？", async () => {
					let del = await $.post(`/album/${uuid}/photo/remove`, {
						photo_uuids: rs.data.uuid
					});
					$.msg("删除成功!");
					Parent.setCloseData(true);
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
	let List = ({ index, data, width, height }) => {
		let vacancy = data.vacancy;
		return (
			<div className={`ov_h sub_albums sub_album_${index} pointer`}>
				{vacancy ? (
					<div className="b_1" onClick={() => uploadimgs.open()}>
						<div
							className="ta_c"
							style={{
								height: 168,
								width: width - 2
							}}
						>
							<Iconfont
								className="fc_info"
								style={{
									marginTop: 46,
									fontSize: 42
								}}
								type="icon-chuangjian"
							/>
							<div className="fc_info fs_16 mt_15">导入照片</div>
						</div>
					</div>
				) : (
					<div style={{ background: "#e7e7e7" }}>
						<Img
							width={width}
							height={height}
							src={data.thumb}
							onClick={e => page.open("相册", { uuid, index, img_uuid: data.uuid })}
						/>
						<Dropdown
							className="pst_abs t_10 r_10 tranall lucid"
							data={{ index, data }}
							list={dropdownlist}
						>
							<Iconfont className="fs_24" type="icon-caozuo" />
						</Dropdown>
					</div>
				)}
			</div>
		);
	};

	let Info = () => {
		[info, setInfo] = useState({});
		return (
			<div className="box ph_15 pb_10 pt_20">
				<div className="box pall_5 br_3 bs">
					<div
						className="info_cover bg_spcc"
						style={{
							width: 80,
							height: 80,
							backgroundImage: `url(${$.addOssProcess(info.cover, 150)})`
						}}
					/>
				</div>
				<div className="box box-1 box-ver ph_15">
					<div className="fs_18 fc_black fb">
						<span className="mr_5">{info.name}</span>
						<a className="va_tt" onClick={() => edit.open("修改相册信息", info)}>
							<Iconfont className="fc_info" type="icon-bianji" />
						</a>
					</div>
					<div className="fs_13 mt_15">{info.summary}</div>
				</div>
				<div className="box">
					<Btn
						type="default"
						iconfont="piliangguanli"
						onClick={() => {
							if (unlimitedfalls.state.list.length > 1) {
								batch.open("批量操作", {
									uuid,
									name: info.name
								});
							} else {
								$.warning("请上传了照片后再操作哦~");
							}
						}}
					>
						批量管理
					</Btn>
					<Btn
						className="mh_10"
						iconfont="zhaopianshu"
						onClick={() => {
							if (unlimitedfalls.state.list.length > 1) {
								choice.open("选择照片", uuid);
							} else {
								$.warning("请上传了照片后再操作哦~");
							}
						}}
					>
						制作照片书
					</Btn>
					<Btn
						iconfont="fenxiang"
						onClick={() => {
							poster.open("分享相册", {
								api: "/poster/album",
								params: {
									title: info.name,
									page: "pages/album/index",
									campus_uuid: $.campus_uuid(),
									scene: $.toScene(uuid),
									cover: $.addOssProcess(info.cover, 150)
								}
							});
						}}
					>
						分享相册
					</Btn>
				</div>
			</div>
		);
	};

	return (
		<div className="bg_white bs mt_20" style={{ marginBottom: 80 }}>
			<Info />
			<div className="pall_15 bg_gray">
				<Unlimitedfalls
					api={`/album/${uuid}/photo/list`}
					imageKey="thumb"
					vacancy={true}
					width={225}
					gutter={15}
					renderList={_props => <List {..._props} />}
					ref={rs => (unlimitedfalls = rs)}
					init={d => setInfo(d)}
				/>
			</div>
			<Uploadimgs
				prefix={`album/${$.campus_uuid()}/`}
				ref={e => (uploadimgs = e)}
				onSure={async rs => {
					await $.post(`/album/${uuid}/photo/upload`, {
						imgfile: rs
					});
					$.msg("导入成功!");
					Parent.setCloseData(true);
					unlimitedfalls.reload();
				}}
			/>
			<Move
				uuid={uuid}
				ref={rs => (move = rs)}
				success={index => {
					Parent.setCloseData(true);
					unlimitedfalls.remove(index);
				}}
			/>
			<Edit
				ref={rs => (edit = rs)}
				success={() => {
					Parent.setCloseData(true);
					unlimitedfalls.reload();
				}}
			/>
			<Poster ref={ref => (poster = ref)} />
			<Page background="rgb(0,0,0,0.95)" full={true} ref={rs => (page = rs)}>
				<Detail />
			</Page>
			<Page background="#F1F1F1" ref={rs => (choice = rs)}>
				<Choice />
			</Page>
			<Page
				background="#F1F1F1"
				onClose={() => {
					Parent.setCloseData(true);
					unlimitedfalls.reload();
				}}
				ref={rs => (batch = rs)}
			>
				<Batch />
			</Page>
		</div>
	);
}
