import React, { useState, useEffect } from "react";
import $$ from "jquery";
import { Method, Form, Inputs, Btn } from "../comlibs";

let _data;
export default function(props) {
	const $ = new Method();
	const Iconfont = $.icon();
	const { Parent } = props;
	let { uuid, index, img_uuid } = Parent.data;
	let { switcher, current = index - 1, addBtn, setData, summary, setSummary, setSummaryFn } = {};
	let [initNum, initWidth] = [10, 84];

	let List = () => {
		let [list, setList] = useState([]);
		let [check, setCheck] = useState(0);
		let [init, setInit] = useState(0);
		let status = 1;
		let width = initNum * initWidth;
		let widths = list.length * initWidth;
		useEffect(() => {
			(async () => {
				let data = await $.get(`/album/${uuid}/photo/list`, {
					limit: 999
				});
				_data = data.data;
				setCheck(img_uuid);
				setList(_data);
			})();
		}, [status]);

		setData = d => {
			setList(d);
		};

		let move = px => {
			let lists = $$(".photo_lists");
			let left = parseInt(lists.css("margin-left") || 0);
			if (px > 0 && left >= 0) {
				return;
			}
			if (px < 0 && -left + width >= widths) {
				return;
			}
			lists.css("margin-left", left + px);
		};

		switcher = (key, type) => {
			if (key < 0) {
				current = 0;
				$.msg("已经到头啦~");
				return;
			}
			if (key >= list.length) {
				current = list.length - 1;
				$.msg("后面没有啦~");
				return;
			}
			if (key > current || type === "right") {
				move(-initWidth);
			} else {
				move(initWidth);
			}
			current = key;
			let item = list[key];
			setInit(1);
			setCheck(item.uuid);
			img_uuid = item.uuid;
			setSummaryFn(item.summary);
		};

		return (
			<div className="box mt_30">
				<div onClick={() => move(width)} className="box box-allc mr_10 pointer">
					<Iconfont className="fs_20 fc_gray" type="icon-zuo" />
				</div>
				<div
					className="box ov_h"
					style={{
						width,
						height: 80
					}}
				>
					<div
						className="photo_lists"
						style={{
							fontSize: 0,
							transition: "all 0.3s",
							width: widths
						}}
					>
						{list.map((item, key) => {
							if (check === item.uuid) {
								$$(".img_full").css("background-image", `url(${item.oss_path}?t=${$.timestamp})`);
								setSummaryFn(item.summary);
								let lists = $$(".photo_lists");
								let _left = key * -initWidth;
								!init && -_left > width && lists.css("margin-left", _left);
							}
							return (
								<div
									onClick={() => {
										switcher(key);
									}}
									className={`bs br_3 dis_ib pointer ${
										check === item.uuid ? "bg_blue" : "bg_white"
									}`}
									key={key}
									style={{
										padding: 3,
										margin: 5
									}}
								>
									<div
										className="bg_spcc"
										style={{
											width: 68,
											height: 68,
											backgroundImage: `url(${item.thumb}&t=${$.timestamp})`
										}}
									/>
								</div>
							);
						})}
					</div>
				</div>
				<div onClick={() => move(-width)} className="box box-allc ml_10 pointer">
					<Iconfont className="fs_20 fc_gray" type="icon-you" />
				</div>
			</div>
		);
	};

	let Summary = () => {
		let [status, setStatus] = useState(false);
		[summary, setSummary] = useState();
		return (
			<div
				className="box bg_white pv_10 br_3"
				style={{
					width: 268
				}}
			>
				<Iconfont
					className="pst_abs fs_26"
					style={{
						top: -12,
						right: -12
					}}
					type="icon-quxiao"
					onClick={() => Parent.close()}
				/>
				<Form
					onSubmit={async values => {
						if (!values.summary) {
							return;
						}
						addBtn.setloading(true);
						await $.post(`/album/${uuid}/photo/${img_uuid}/save`, values);
						addBtn.setloading(false);
						_data.map(v => {
							if (v.uuid === img_uuid) {
								v.summary = values.summary;
							}
							return v;
						});
						setData(_data);
						setSummaryFn(values.summary);
						$.msg("保存成功!");
					}}
				>
					{({ form }) => {
						setSummaryFn = (summary = "") => {
							form.setFieldsValue({
								summary
							});
							setSummary(summary);
							if (summary) {
								setStatus(true);
							} else {
								setStatus(false);
							}
						};
						return (
							<div className={typeof summary === "undefined" ? "hide" : ""}>
								{status ? (
									<div className="ph_15">
										{summary}
										<span
											className="link pl_10"
											onClick={() => setStatus(false)}
											style={{
												textDecoration: "underline"
											}}
										>
											编辑
										</span>
									</div>
								) : (
									<div className="ph_15 mt_5">
										<Inputs
											form={form}
											name="summary"
											value={summary}
											rows={4}
											placeholder="编写照片备注，记录精彩瞬间吧~"
											style={{
												width: 238,
												background: "#fff"
											}}
										/>
										<div className="ta_r mt_5">
											<Btn width={80} htmlType="submit" ref={res => (addBtn = res)}>
												保存
											</Btn>
										</div>
									</div>
								)}
							</div>
						);
					}}
				</Form>
			</div>
		);
	};

	return (
		<div className="mt_20">
			<div className="box m_auto" style={{ width: 1200 }}>
				<div className="box box-ver box-1 mr_30">
					<div
						className="img_full box bg_spnc"
						style={{
							height: $.drawerHeight() - 230,
							transition: "all 0.3s"
						}}
					>
						<div
							onClick={() => {
								current--;
								switcher(current, "left");
							}}
							className="pointer"
							style={{
								position: "absolute",
								top: "50%",
								left: 0,
								marginTop: -18
							}}
						>
							<Iconfont
								className="fc_white"
								type="icon-zuo"
								style={{
									fontSize: 36
								}}
							/>
						</div>
						<div
							onClick={() => {
								current++;
								switcher(current, "right");
							}}
							className="pointer"
							style={{
								position: "absolute",
								top: "50%",
								right: 0,
								marginTop: -18
							}}
						>
							<Iconfont
								className="fc_white"
								type="icon-you"
								style={{
									fontSize: 36
								}}
							/>
						</div>
					</div>
					<div className="box box-allc">
						<List />
					</div>
				</div>
				<Summary />
			</div>
		</div>
	);
}
