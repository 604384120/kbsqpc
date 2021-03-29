import React, { useState } from "react";
import { Btn, Method } from "../comlibs";
import { Alert } from "antd";
import { Page_ChoiceTeacher } from "../works";

export default function (props) {
	const $ = new Method();
	let { choiceTeacher } = {};
	let [imgSrc, setSrc] = useState({
		src:
			"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/e5520574-7006-11ea-aca2-00163e04cc20.jpeg",
		title: "排课通知",
	});
	function save(e) {
		(async () => {
			await $.post("/notice/subscribe/teacher", e);
			$.msg("保存成功！");
		})();
	}
	return (
		<div className="ph_5 pb_20">
			<div className="mb_15">
				<a href="https://www.yuque.com/zwriad/bz1d16/teaching_notice" target="_black">
					<Alert
						message="老师关注开班神器公众号，绑定微信即可接收到以下信息，点击查看操作说明>>"
						type="warning"
						showIcon
					/>
				</a>
			</div>
			<div className="box b_1">
				<div className="box box-ver box-1">
					<div className="box box-ver pall_20 bb_1">
						<div className="box box-1">
							<div className="box box-ac box-1 mb_10">
								<span className="fs_14 fc_black1 fw_600">排课通知</span>
								<div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
							</div>
							<div className="box">
								<Btn
									onClick={() => {
										setSrc({
											src:
												"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/e5520574-7006-11ea-aca2-00163e04cc20.jpeg",
											title: "排课通知",
										});
									}}
								>
									预览
								</Btn>
							</div>
						</div>
						<div className="box fs_12 fc_dis">每天20:30会给第二天有课的老师自动发送通知</div>
					</div>
					<div className="box box-ver pall_20 bb_1">
						<div className="box box-1">
							<div className="box box-ac box-1 mb_10">
								<span className="fs_14 fc_black1 fw_600">学员请假通知</span>
								<div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
							</div>
							<div className="box">
								<Btn
									onClick={() => {
										setSrc({
											src:
												"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/c2286dfe-7006-11ea-aca2-00163e04cc20.jpeg",
											title: "学员请假通知",
										});
									}}
								>
									预览
								</Btn>
							</div>
						</div>
						<div className="box fs_12 fc_dis">学员在学员端发起请假时，课节的授课老师会收到通知</div>
					</div>
					<div className="box box-ver pall_20 bb_1">
						<div className="box box-1">
							<div className="box box-ac box-1 mb_10">
								<span className="fs_14 fc_black1 fw_600">学员发起约课提醒</span>
								<div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
							</div>
							<div className="box">
								<Btn
									onClick={() => {
										setSrc({
											src:
												"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/d9c93326-7006-11ea-aca2-00163e04cc20.jpeg",
											title: "学员发起约课提醒",
										});
									}}
								>
									预览
								</Btn>
							</div>
						</div>
						<div className="box fs_12 fc_dis">学员在学员端发起请假时，课节的授课老师会收到通知</div>
					</div>
					<div className="box box-ver pall_20 bb_1">
						<div className="box box-1">
							<div className="box box-ac box-1 mb_10">
								<span className="fs_14 fc_black1 fw_600">学员端审核通知</span>
								<div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
							</div>
							<div className="box">
								<Btn
									onClick={() => {
										setSrc({
											src:
												"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0b59808a-7007-11ea-aca2-00163e04cc20.jpeg",
											title: "学员端审核通知",
										});
									}}
								>
									预览
								</Btn>
							</div>
						</div>
						<div className="box fs_12 fc_dis">学员端通过审核后，所有的管理员可收到通知</div>
					</div>
					<div className="box box-ver pall_20 bb_1">
						<div className="box box-1">
							<div className="box box-ac box-1 mb_10">
								<span className="fs_14 fc_black1 fw_600">学员报名通知</span>
								<div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
							</div>
							<div className="box">
								<Btn
									className="mr_10"
									onClick={async () => {
										let res = await $.get("/notice/subscribed/teachers", {
											notice_code: "ACTIVITY_JOIN",
										});
										choiceTeacher.open({
											title: "设置学学员报名通知接收者",
											type: "admin",
											value: res.map((v) => {
												v.uuid = v.teacher_uuid;
												return v;
											}),
											onSure: (d) => {
												let uuids = [];
												d.map((v) => {
													uuids.push(v.teacher_uuid);
													return uuids;
												});
												save({
													notice_code: "ACTIVITY_JOIN",
													teacher_uuids: uuids,
												});
											},
										});
									}}
								>
									设置
								</Btn>
								<Btn
									onClick={() => {
										setSrc({
											src:
												"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/d2e90bb0-70d0-11ea-aca2-00163e04cc20.jpeg",
											title: "学员报名通知",
										});
									}}
								>
									预览
								</Btn>
							</div>
						</div>
						<div className="box fs_12 fc_dis">
							学员在学员端报名入班/参加活动，默认所有管理员可收到通知，可设置指定老师接收此消息。
						</div>
					</div>
					<div className="box box-ver pall_20 bb_1">
						<div className="box box-1">
							<div className="box box-ac box-1 mb_10">
								<span className="fs_14 fc_black1 fw_600">学员咨询通知</span>
								<div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
							</div>
							<div className="box">
								<Btn
									className="mr_10"
									onClick={async () => {
										let res = await $.get("/notice/subscribed/teachers", {
											notice_code: "USERASK",
										});
										choiceTeacher.open({
											title: "设置学员咨询通知接收者",
											type: "admin",
											value: res.map((v) => {
												v.uuid = v.teacher_uuid;
												return v;
											}),
											onSure: (d) => {
												let uuids = [];
												d.map((v) => {
													uuids.push(v.teacher_uuid);
													return uuids;
												});
												save({ notice_code: "USERASK", teacher_uuids: uuids });
											},
										});
									}}
								>
									设置
								</Btn>
								<Btn
									onClick={() => {
										setSrc({
											src:
												"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/f418ce4e-7006-11ea-aca2-00163e04cc20.jpeg",
											title: "学员咨询通知",
										});
									}}
								>
									预览
								</Btn>
							</div>
						</div>
						<div className="box fs_12 fc_dis">
							学员在学员端发起课程咨询，默认所有管理员可收到通知，可设置指定老师接收此消息。
						</div>
					</div>
					<div className="box box-ver pall_20">
						<div className="box box-1">
							<div className="box box-ac box-1 mb_10">
								<span className="fs_14 fc_black1 fw_600">学校经营数据</span>
								<div className="box ml_15 fs_12 fc_pink">*系统自动发送</div>
							</div>
							<div className="box">
								<Btn
									className="mr_10"
									onClick={async () => {
										let res = await $.get("/notice/subscribed/teachers", {
											notice_code: "BUSINESS",
										});
										choiceTeacher.open({
											title: "设置学校经营数据通知接收者",
											type: "admin",
											value: res.map((v) => {
												v.uuid = v.teacher_uuid;
												return v;
											}),
											onSure: (d) => {
												let uuids = [];
												d.map((v) => {
													uuids.push(v.teacher_uuid);
													return uuids;
												});
												save({ notice_code: "BUSINESS", teacher_uuids: uuids });
											},
										});
									}}
								>
									设置
								</Btn>
								<Btn
									onClick={() => {
										setSrc({
											src:
												"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/009f3626-7007-11ea-aca2-00163e04cc20.jpeg",
											title: "学校经营数据",
										});
									}}
								>
									预览
								</Btn>
							</div>
						</div>
						<div className="box fs_12 fc_dis">
							每天08:00会默认给校长发送前一天的校区经营数据，可设置指定老师接收此消息。
						</div>
					</div>
				</div>
				<div
					className="box box-ver bl_1 ph_5 pt_5"
					style={{
						width: 400,
						height: 640,
						overflowY: "scroll",
						overflowX: "hidden",
					}}
				>
					<div className="mt_10 box box-allc fc_black fs_14 fw_600">{imgSrc.title}</div>
					<div className="bg_spcc mt_10">
						<img src={imgSrc.src} width={375} />
					</div>
				</div>
			</div>
			<Page_ChoiceTeacher configs={{ width: 985 }} ref={(ref) => (choiceTeacher = ref)} />
		</div>
	);
}
