import React, { useState } from "react";
import { Method, Form, Checks, Unlimitedfalls, Btn, Img, FixedBox } from "../comlibs";
import Move from "./move";

export default function(props) {
	const $ = new Method(props);
	const Parent = props.Parent;
	const { uuid, name } = Parent.data;
	let { move, checked, setChecked } = {};

	let Fixed = ({ submit }) => {
		[checked, setChecked] = useState([]);
		return (
			<FixedBox>
				<span className="box">已选择 {checked.length} 张</span>
				<Btn className="mh_10" width={110} onClick={e => submit(e, "mov")}>
					移动到相册
				</Btn>
				<Btn type="default" width={110} onClick={e => submit(e, "del")}>
					删除
				</Btn>
			</FixedBox>
		);
	};

	let List = ({ set, index, list, data, width, height }) => {
		return (
			<div className={`ov_h sub_album_${index} bg_black pointer`}>
				<Img
					width={width}
					height={height}
					src={data.thumb}
					onClick={e => {
						let checked = [];
						data.checked ? (data.checked = false) : (data.checked = true);
						data.Checks.checked = data.checked;
						list.forEach(i => i.item.checked && checked.push(i.item));
						setChecked(checked);
					}}
				/>
				<Checks
					set={set}
					name={`uuid_${index}`}
					value={data.uuid}
					checked={data.checked}
					className="pst_abs t_10 r_10"
					ref={rs => (data.Checks = rs)}
				/>
			</div>
		);
	};

	return (
		<div>
			<Form
				onSubmit={async (values, btn, type) => {
					btn.loading = false;
					let uuids = Object.values(values);
					if (uuids.length === 0) {
						$.warning("请选择好相片后再操作!");
						return;
					}
					if (type === "del") {
						$.confirm("确定要删除这些照片吗？", async () => {
							let rs = await $.post(`/album/${uuid}/photo/remove`, {
								photo_uuids: uuids.toString()
							});
							$.msg("删除成功!");
							Parent.close(true);
							return rs;
						});
					}
					if (type === "mov") {
						move.open({
							uuids,
							index: Object.keys(values).map(i => i.split("uuid_")[1])
						});
					}
				}}
			>
				{({ set, submit }) => (
					<div className="bg_white bs mt_20" style={{ marginBottom: 80 }}>
						<div className="box fc_black ph_15 pt_15">
							<span className="box box-1 fs_18">{name}</span>
							<a className="box box-allc" onClick={() => Parent.close()}>
								完成管理
							</a>
						</div>
						<div className="pall_15 bg_gray">
							<Unlimitedfalls
								api={`/album/${uuid}/photo/list`}
								imageKey="thumb"
								width={225}
								gutter={15}
								renderList={_props => <List set={set} {..._props} />}
							/>
						</div>
						<Fixed submit={submit} />
					</div>
				)}
			</Form>
			<Move
				uuid={uuid}
				ref={rs => (move = rs)}
				success={index => {
					Parent.close(true);
				}}
			/>
		</div>
	);
}
