import React, { useState } from "react";
import { Method, Form, Checks, Unlimitedfalls, Page, Btn, Img, FixedBox } from "../comlibs";
import Submit from "./submit";

export default function(props) {
	const $ = new Method(props);
	const Parent = props.Parent;
	const uuid = Parent.data;
	let { page, checked, setChecked } = {};

	let Fixed = ({ submit }) => {
		[checked, setChecked] = useState([]);
		return (
			<FixedBox>
				<Btn width={200} onClick={submit}>
					已选{checked.length}张，提交制作
				</Btn>
				<Btn
					width={200}
					className="ml_10"
					onClick={async btn => {
						btn.loading = true;
						let rs = await $.post(`/album/${uuid}/book/photos`);
						btn.loading = false;
						page.open("制作申请", {
							book_uuid: rs.uuid,
							count: "all"
						});
					}}
				>
					全部制作
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
				onSubmit={async (values, btn) => {
					let uuids = Object.values(values);
					if (uuids.length === 0) {
						$.warning("请选择好相片后再提交!");
						btn.loading = false;
						return;
					}
					let rs = await $.post("/album/book/photos", {
						photos: uuids.toString()
					});
					btn.loading = false;
					page.open("制作申请", {
						book_uuid: rs.uuid,
						count: uuids.length
					});
				}}
			>
				{({ set, submit }) => (
					<div className="bg_white bs mt_20" style={{ marginBottom: 80 }}>
						<div className="fc_black ph_15 pv_15">
							挑选照片制作精美的照片书吧！
							<a
								target="_blank"
								href="https://www.sxzapi.cn/page/b5c3080f-2df2-11ea-ac99-00163e04cc20.html"
							>
								查看精美照片书样例
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
			<Page background="#F1F1F1" ref={rs => (page = rs)}>
				<Submit />
			</Page>
		</div>
	);
}
