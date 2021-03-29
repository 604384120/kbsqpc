import React, { useState, useEffect } from "react";
import { Empty, Modal, InputNumber } from "antd";
import { $, Btn, Inputs, Form, FixedBox } from "../comlibs";
import { ImgDraw } from "../plugins";
import FileBox from "./fileBox";

export default function (props) {
	let parent = props.Parent;
	let { testpaper_uuid, student_uuid, group_uuid } = parent.data;
	let { form_ref, img_ref, audio_ref, video_ref } = {};
	let [work, setWork] = useState({});
	let [info, setInfo] = useState({});
	let [score, setScore] = useState({});

	useEffect(() => {
		(async () => {
			let res = await $.get("/homework/answer/detail", {
				testpaper_uuid,
				student_uuid,
				group_uuid,
			});
			setInfo(res.testpaper);
			setWork(res.homework);
			if (res?.homework?.status === "COMMIT" && !res.homework.is_reviewed) {
				let setting = await $.get(`/campus/set/points/rule`);
				setScore(setting.HOMEWORK_REVIEW);
			}
		})();
	}, [student_uuid]);

	const Draw = new ImgDraw(
		{
			id: "imgDrawCanvas",
		},
		async (img) => {
			$.loading();
			let data = await $.post("/image/base64/upload/oss?prefix=teacher/correct/", {
				filename: img,
			});
			let works = { ...work };
			!works.review_img_urls && (works.review_img_urls = []);
			works.review_img_urls = works.review_img_urls.concat(data);
			let form = form_ref._form;
			form.setFieldsValue({ img_urls: works.review_img_urls.toString() });
			$.msg("批改成功！");
			setWork(works);
		}
	);

	return (
		<div className="mt_20 mb_70 bg_white br_3 pall_20">
			{work?.status !== "UNCOMMIT" ? (
				// 学员作业详情
				<div>
					<div className="mb_10">{work.answer}</div>
					{work.uuid && (
						<FileBox
							form_ref={() => form_ref}
							img_draw={Draw}
							audio_list={work.audios}
							video_list={work.videos}
							img_urls={work.img_urls}
						/>
					)}
				</div>
			) : (
				// 学员未提交作业
				<div className="pv_20">
					<Empty
						description={
							<span style={{ color: "#C2C2C2" }} className="mb_10">
								学员还未提交作业~
							</span>
						}
					/>
					<div className="ta_c mt_10">
						<Btn
							onClick={async (e) => {
								e.loading = true;
								await $.post("/homework/warning", {
									testpaper_uuid,
									student_uuids: student_uuid,
								});
								e.loading = false;
								$.msg("提醒成功！");
							}}
						>
							提醒学员
						</Btn>
					</div>
				</div>
			)}
			{/* 批改详情 */}
			<div className="bt_1 mt_10">
				<div className="dis_f ai_c jc_sb pb_14 pt_10">
					<div className="dis_f ai_c">
						<img
							alt="xxx"
							style={{ width: 20, height: 20 }}
							src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/f19601a6-cee3-11e9-8203-00163e04cc20.png"
						/>
						<span className="ml_10">我的批改</span>
					</div>

					{work.revteacher_name && <span className="fc_red">最后操作：{work.revteacher_name}</span>}
				</div>
				<Form
					ref={(r) => (form_ref = r)}
					action={`/homework/review`}
					method="post"
					onSubmit={async (val, e) => {
						if (
							!val.review &&
							(!val.img_urls || val.img_urls.length === 0) &&
							(!val.video_urls || val.video_urls.length === 0) &&
							(!val.audio_urls || val.audio_urls.length === 0)
						) {
							$.warning("请填写批改内容");
							e.loading = false;
						} else {
							await $.post(
								"/homework/review",
								Object.assign(val, {
									student_uuid,
									testpaper_uuid,
									group_uuid,
								})
							);
							parent.close(true);
							$.msg(work.revteacher_name ? "修改成功！" : "批改成功！");
						}
					}}
				>
					{({ form, submit, set }) => {
						return (
							<div>
								<Inputs
									name="review"
									placeholder="请输入批改内容"
									value={work.review}
									form={form}
									rows={5}
									type="textArea"
								/>
								<div className="box">
									<div className="box pv_8">
										<div
											className="mr_24 dis_f ai_c pointer"
											onClick={() => {
												video_ref.open();
											}}
										>
											<img
												style={{ width: 23 }}
												alt="图片走丢了"
												className="pointer"
												src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/ace5ae92-ce18-11e9-8203-00163e04cc20.png"
											/>
											<span className="ml_8">视频</span>
										</div>
										<div
											className="mr_24 dis_f ai_c pointer"
											onClick={() => {
												img_ref.open();
											}}
										>
											<img
												style={{ width: 18 }}
												alt="图片走丢了"
												className="pointer"
												src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b01e91fa-ce18-11e9-8203-00163e04cc20.png"
											/>
											<span className="ml_8">图片</span>
										</div>
										<div
											className="dis_f ai_c pointer"
											onClick={() => {
												audio_ref.open();
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
								{info.uuid && (
									<FileBox
										set={set}
										img_urls={work.review_img_urls}
										video_list={work.review_videos}
										audio_list={work.review_audios}
										video_ref={(ref) => (video_ref = ref)}
										audio_ref={(ref) => (audio_ref = ref)}
										img_ref={(ref) => (img_ref = ref)}
									/>
								)}
								{score?.status === "ON" && !work.points && (
									<div>
										<div className="box box-ac mb_15">
											<div style={{ width: 70 }}>积分奖励：</div>
											<div>
												{set(
													{
														name: "points",
													},
													() => (
														<InputNumber
															style={{ width: 150 }}
															className="mr_8"
															label="积分奖励"
															name="points"
															min={score.min_points}
															max={score.max_points}
															placeholder="请输入鼓励积分"
															form={form}
														/>
													)
												)}
												积分
											</div>
										</div>
										<div className="box box-ac">
											<div style={{ width: 70 }}></div>
											<div>*最高可给予学员{score.default_points}积分奖励</div>
										</div>
									</div>
								)}
								{work.points && (
									<div>
										<div className="box box-ac mb_15">
											<div style={{ width: 70 }}>积分奖励：</div>
											<div>{work.points}积分</div>
										</div>
									</div>
								)}

								<FixedBox>
									<Btn
										type="default"
										className="mr_10"
										style={{ width: 100 }}
										onClick={() => {
											parent.close();
										}}
									>
										取消
									</Btn>
									<Btn
										className="mr_10"
										type="info"
										style={{ width: 100 }}
										onClick={async () => {
											Modal.confirm({
												title: "删除作业",
												content: "确定删除作业吗？删除后学员端无法进行查看",
												async onOk() {
													await $.get(`/testpaper/${testpaper_uuid}/revoke`, {
														student_uuids: student_uuid,
														group_uuid,
													});
													parent.close(true);
													$.msg("删除成功！");
												},
											});
										}}
									>
										删除作业
									</Btn>
									{work?.status === "COMMIT" && !work.revteacher_name && (
										<Btn onClick={submit}>批改</Btn>
									)}

									{work.revteacher_name && (
										<span className="fc_red">
											<Btn
												onClick={(e) => {
													Modal.confirm({
														title: "修改批改内容",
														content: "修改后会覆盖之前的批改结果。",
														onOk() {
															submit(e);
														},
													});
												}}
											>
												修改
											</Btn>
										</span>
									)}
								</FixedBox>
							</div>
						);
					}}
				</Form>
			</div>
		</div>
	);
}
