import React, { useState, useEffect } from "react";
import { $, Btn, Inputs, Form, FixedBox, Page } from "../comlibs";
import { Subject, ChoiceClassStudents } from "../works";
import Moment from "moment";
import { Form as Forms } from "antd";
import FileBox from "./fileBox";
import StuDetail from "./stu_detail";

export default function (props) {
	let parent = props.Parent;
	let { uuid } = parent?.data||{};
	!uuid && (uuid = $.getQueryString('uuid'));
	let { groups, setGroups, uploadimgs, page_students, page_stuDetail, video_ref, audio_ref } = {};
	let [work, setWork] = useState({ date: "-" });
	useEffect(() => {
		init();
	}, []);
	let init = async () => {
		let rs = await $.get(`/testpaper/${uuid}/detail`);
		if (rs.date && rs.rem_time) {
			let arr = rs.rem_time.split("-");
			rs.rem_time_txt = arr[1] + "-" + arr[2];
		}
		setWork(rs);
	};
	let getStuList = async () => {
		let rs = await $.get(`/testpaper/${uuid}/detail`);
		parent&&parent.setCloseData(true);
		setGroups({ list: rs.groups || [], cnt_assign: rs.cnt_assign });
	};

	let StudentList = () => {
		[groups, setGroups] = useState({ list: [] });
		useEffect(() => {
			setGroups({ list: work.groups || [], cnt_assign: work.cnt_assign });
		}, [work]);
		return (
			<div style={{ width: 300, height: "75vh" }} className="br_2 bg_white box box-ver">
				<div className="box pall_10 bb_1">
					<div className="box-1">
						{work.date ? (
							<div className="box box-1 fb fs_15">布置学员</div>
						) : (
							<div className="box box-1 fb fs_15">作业接收者</div>
						)}
						{work.date ? (
							<div className="fc_gray">共布置{groups.cnt_assign || 0}人</div>
						) : (
							<div className="fc_gray">
								已选学员（
								{groups.list && groups.list.reduce((total, obj) => total + obj.students.length, 0)}
								）
							</div>
						)}
					</div>
					<div className="box box-ac">
						{work.date ? (
							<Btn
								onClick={async (e) => {
									e.loading = true;
									await $.post("/homework/warning", {
										testpaper_uuid: work.uuid,
									});
									e.loading = false;
									$.msg("提醒成功！");
								}}
							>
								微信提醒未交学员
							</Btn>
						) : (
							<Btn
								onClick={() => {
									page_students.open("选择学员", {
										value: groups.list.map((rs) => ({
											group_name: rs.banji_name,
											group_uuid: rs.group_uuid,
											stulist: rs.students,
										})),
										bottom: (props) => {
											let { sure, close } = props;
											return (
												<FixedBox>
													<Btn type="default" className="mr_12" onClick={close}>
														取消
													</Btn>
													<Btn onClick={sure}>确定</Btn>
												</FixedBox>
											);
										},
										onSure: async (data) => {
											setGroups({
												cnt_assign: 0,
												list: data.map((rs) => ({
													banji_name: rs.group_name,
													cnt_assign: rs.stulist.length,
													group_uuid: rs.group_uuid,
													students: rs.stulist,
												})),
											});
										},
									});
								}}
							>
								选择学员
							</Btn>
						)}
					</div>
				</div>
				<div className="CUSTOM_scroll oy_a box-1">
					{groups.list &&
						groups.list.map((group, gid) => (
							<div key={group.group_uuid}>
								<div className="fb lh_32 bb_1 ph_10">
									{group.banji_name || "该班级已被删除"}({group.cnt_assign}人)
								</div>
								{group.students.map((stu, sid) => (
									<div
										className={`box pall_10 ${work.date && "pointer"}`}
										key={stu.student_uuid}
										onClick={() => {
											if (!work.date) return;
											page_stuDetail.open(
												stu.name + "作业详情",
												{
													gid,
													sid,
													testpaper_uuid: uuid,
													student_uuid: stu.student_uuid,
													group_uuid: stu.group_uuid,
												},
												{
													left: 338,
												}
											);
										}}
									>
										<div className="box-1">{stu.name}</div>
										<div className="box box-ac pointer">
											{work.date ? (
												<div>
													{stu.is_reviewed === "YES" ? (
														<span className="fc_gray1 hover_line">已批改</span>
													) : stu.status === "UNCOMMIT" ? (
														<span className="hover_line" style={{ color: "#DDAD58" }}>
															未提交
														</span>
													) : (
														<span className="hover_line" style={{ color: "#DD7758" }}>
															未批改
														</span>
													)}
												</div>
											) : (
												<img
													style={{ width: 16, height: 16 }}
													alt="xxx"
													onClick={async () => {
														groups.list[gid].students.splice(sid, 1);
														groups.list[gid].cnt_assign -= 1;
														if (groups.list[gid].students.length === 0) groups.list.splice(gid, 1);
														setGroups(Object.assign("", groups));
													}}
													src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png"
												/>
											)}
										</div>
									</div>
								))}
							</div>
						))}
				</div>

				<Page ref={(ref) => (page_students = ref)}>
					<ChoiceClassStudents />
				</Page>
				<Page
					ref={(ref) => (page_stuDetail = ref)}
					onClose={() => {
						getStuList();
					}}
				>
					<StuDetail />
				</Page>
			</div>
		);
	};

	// 作业详情
	let WorkBox = () => {
		return (
			<div className="bg_white br_2 ml_15 box-1 pall_20 ">
				<Form
					wrapperCol={{ span: 21 }}
					labelCol={{ span: 3 }}
					onSubmit={async (val, btn) => {
						if (groups.list.length === 0 && btn.props.api === "/testpaper/batch/assign") {
							$.warning("请添加学员再进行布置作业哦");
							btn.loading = false;
							return;
						}
						val.testpaper_uuid = work.uuid;
						val.group_uuids = groups.list.map((o) => o.group_uuid).join(",");
						groups.list.forEach((rs) => {
							val[rs.group_uuid] = rs.students.map((o) => o.student_uuid).join(",");
						});

						if (btn.props.api === "/testpaper/batch/assign") {
							await $.post(`/testpaper/${work.uuid}/save`, val);
							await $.post(btn.props.api, val);
						} else {
							await $.post(btn.props.api, val);
						}

						parent&&parent.setCloseData(true);
						btn.loading = false;
						$.msg(btn.props.api === "/testpaper/batch/assign" ? "发布成功！" : "保存成功!");
						parent.close(true);
					}}
				>
					{({ set, form, submit }) => (
						<div>
							{!work.date && (
								<div className="ta_r mb_10">
									<Btn
										className="mr_8"
										api={`/testpaper/${work.uuid}/save`}
										onClick={submit}
										type="default"
									>
										保存草稿
									</Btn>
									<Btn className="ph_10" api={`/testpaper/batch/assign`} onClick={submit}>
										布置作业
									</Btn>
								</div>
							)}

							<div className="mb_10">
								<Inputs
									label="作业名称"
									disabled={work.date ? true : false}
									style={{ width: "100%" }}
									required={true}
									form={form}
									value={work.title}
									name="title"
								/>
							</div>
							{!work.date || (work.date && work.examsubject_uuid) ? (
								<div className="mb_10">
									<Forms.Item label="科目">
										{work.date ? (
											work.examsubject_name
										) : (
											<Subject
												style={{ width: 130 }}
												value={work.examsubject_uuid}
												form={form}
												name="examsubject_uuid"
											/>
										)}
									</Forms.Item>
								</div>
							) : (
								""
							)}
							<div className="mb_10">
								{!work.date || (work.date && work.memo) ? (
									<Forms.Item label="作业内容" required={true}>
										{
											work.date?(
												<span style={{whiteSpace:'pre-line'}}>{work.memo}</span>
											):(
												<Inputs
													rows={7}
													required={true}
													placeholder="请输入作业内容"
													value={work.memo}
													type="textArea"
													form={form}
													name="memo"
												/>
											)
										}
										
									</Forms.Item>
								) : (
									""
								)}

								{!work.date && (
									<div className="box">
										<div style={{ width: "12.5%" }}></div>
										<div className="box pl_10 pv_8">
											<div
												className="mr_24 dis_f ai_c pointer"
												onClick={() => {
													!work.date && video_ref.open();
												}}
											>
												<img
													style={{ width: 23 }}
													alt="图片走丢了"
													src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/ace5ae92-ce18-11e9-8203-00163e04cc20.png"
												/>
												<span className="ml_8">视频</span>
											</div>
											<div
												className="mr_24 dis_f ai_c pointer"
												onClick={() => {
													!work.date && uploadimgs.open();
												}}
											>
												<img
													style={{ width: 18 }}
													alt="图片走丢了"
													src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b01e91fa-ce18-11e9-8203-00163e04cc20.png"
												/>
												<span className="ml_8">图片</span>
											</div>
											<div
												className="dis_f ai_c pointer"
												onClick={() => {
													!work.date && audio_ref.open();
												}}
											>
												<img
													style={{ width: 15 }}
													alt="图片走丢了"
													src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/622fbfbe-ce18-11e9-8203-00163e04cc20.png"
												/>
												<span className="ml_8">语音</span>
											</div>
										</div>
									</div>
								)}
							</div>
							<div className="box">
								<div style={{ width: "12.5%" }}></div>
								<div className="pl_10" style={{ maxWidth: 700 }}>
									<FileBox
										set={work.date ? false : set}
										img_urls={work.img_urls}
										video_list={work.videos}
										audio_list={work.audios}
										img_ref={(ref) => (uploadimgs = ref)}
										video_ref={(ref) => (video_ref = ref)}
										audio_ref={(ref) => {
											audio_ref = ref;
										}}
									/>
								</div>
							</div>
							{!work.date || (work.date && work.rem_time) ? (
								<div className="mb_10">
									<Forms.Item label="作业未交提醒">
										<div>
											{work.date ? (
												work.rem_time_txt
											) : (
												<Inputs
													placeholder="选择时间"
													showToday={false}
													type="dateTimePicker"
													form={form}
													format={["MM-DD HH:mm", "YYYY-MM-DD HH:mm"]}
													value={work.rem_time}
													showtime={{
														format: "HH:mm",
														minuteStep: 30,
														defaultValue: Moment("00:00", "HH:mm"),
													}}
													name="rem_time"
												/>
											)}
										</div>
									</Forms.Item>
								</div>
							) : (
								""
							)}
						</div>
					)}
				</Form>
			</div>
		);
	};
	return (
		<div className="br_3 mt_20 mb_20 box fc_black">
			<StudentList />
			<WorkBox />
		</div>
	);
}
