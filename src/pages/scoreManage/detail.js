import React, { useState, useEffect } from "react";
import { Form, Inputs, Method, Uploadfile } from "../comlibs";
import { Subject, Grades, Page_ChoiceClassStudent } from "../works";
import { Button, Modal, Table, Form as Forms, InputNumber,Alert } from "antd";

export default function(props) {
	let parent = props.Parent;
	let $ = new Method();
	let {
		showEdit = false,
		setShowEdit,
		choiceStudent,
		upload,
		showUpload = false,
		setShowUpload
	} = {};
	let { uuid,close } = parent?.data||{};
	!uuid && (uuid = $.getQueryString('uuid'));
	if(close){
		parent&&parent.setCloseData(true);
	}
	let [errList, setErrList] = useState([]);
	let [detail, setDetail] = useState({});
	let [stuList, setStuList] = useState([]);
	let [succTitle, setTitle] = useState([]);
	// let [score,setScore]=useState(-1)
	// let [,setScore]=useState(-1)
	const Iconfont = $.icon();
	let gradeTxt = [
		"学龄前",
		"小班",
		"中班",
		"大班",
		"一年级",
		"二年级",
		"三年级",
		"四年级",
		"五年级",
		"六年级",
		"七年级",
		"八年级",
		"九年级",
		"高一",
		"高二",
		"高三",
		"大一",
		"大二",
		"大三",
		"大四",
		"研一",
		"研二",
		"研三"
	];
	// 获取考试详情
	function init() {
		(async () => {
			let res = await $.get("/achievement/exam/detail", { exam_uuid: uuid });
			res[0].exam_time = res[0].exam_time.split(" ")[0];
			setDetail(res[0]);
			setStuList(res[1] ? res[1] : []);
			return res;
		})();
	}
	useEffect(() => {
		init();
	}, [uuid]);

	function ErrList() {
		let err_columns = [
			{
				title: "学员姓名",
				dataIndex: "name",
				key: "name",
				align: "center"
			},
			{
				title: "分数",
				dataIndex: "exam_score",
				key: "exam_score",
				align: "center"
			},
			{
				title: "原因",
				dataIndex: "reason",
				key: "reason",
				align: "center"
			}
		];
		if (errList.length !== 0) {
			return (
				<Table
					title={() => <div className="fb fs_20 ta_c">导入失败的成绩</div>}
					pagination={false}
					dataSource={errList}
					columns={err_columns}
				/>
			);
		} else {
			return <div></div>;
		}
	}

	function editScore(obj, index) {
		const modal = Modal.confirm();
		let score = 0;
		modal.update({
			icon: "",
			width: 250,
			content: (
				<div>
					<InputNumber
						style={{ width: "100%" }}
						min={0}
						max={detail.totalscore}
						onChange={val => {
							score = val;
						}}
						defaultValue={obj.exam_score}
					/>
				</div>
			),
			async onOk() {
				await $.post("/achievement/score/update", {
					student_uuid: obj.student_uuid,
					exam_score: score ? score : 0,
					exam_uuid: detail.uuid
				});
				parent&&parent.setCloseData(true);
				init();
			},
			okText: "确定"
		});
	}

	const columns = [
		{
			title: "学员姓名",
			dataIndex: "student_name",
			key: "student_name",
			align: "center"
		},
		{
			title: "分数",
			dataIndex: "exam_score",
			key: "exam_score",
			align: "center",
			render: (res, obj, index) => {
				return (
					<div className="box box-pc">
						<div className="ta_c" style={{ width: 50 }}>
							{res || res === 0 ? res : "未填写"}
						</div>{" "}
						<Button
							size="small"
							onClick={() => {
								editScore(obj, index);
							}}
							style={{ lineHeight: "100%" }}
							type="primary"
							shape="circle"
							icon="edit"
						/>
					</div>
				);
			}
		},
		{
			title: "排名",
			align: "center",
			dataIndex: "ranking_num",
			render: res => {
				return res ? res : "未排名";
			}
		},
		{
			title: "操作",
			align: "center",
			render: (obj, all, index) => {
				return (
					<div>
						{/* <a className="link">通知</a> |  */}
						<a
							className="fc_err link"
							onClick={async () => {
								await $.post("/achievement/student/delete", {
									exam_uuid: detail.uuid,
									student_uuid: obj.student_uuid
								});
								init();
							}}
						>
							删除
						</a>
					</div>
				);
			}
		}
	];

	// 修改考试信息模态框
	function EditModal() {
		[showEdit, setShowEdit] = useState(false);
		return (
			<Modal
				title="考试基本信息"
				visible={showEdit}
				onCancel={() => {
					setShowEdit(false);
				}}
				footer={null}
			>
				<Form
					action={`/achievement/exam/update`}
					params={{
						exam_uuid: uuid
					}}
					method="POST"
					success={async res => {
						parent&&parent.setCloseData(true);
						setShowEdit(false);
						init();
					}}
				>
					{({ form, submit }) => (
						<div>
							<Inputs
								label="考试名称"
								form={form}
								name="name"
								className="w_full box"
								required={true}
								value={detail.name}
								placeholder="请输入考试名称"
								style={{ width: "370px" }}
							/>
							<div className="box">
								<Forms.Item required={true} label="试卷总分" className="box" style={{ width: 200 }}>
									{form.getFieldDecorator("totalscore", {
										initialValue: detail.totalscore,
										rules: [{ required: true, message: "请输入考试总分" }]
									})(
										<InputNumber precision={2} form={form} name="totalscore" min={1} max={10000} />
									)}
								</Forms.Item>
								<Inputs
									label="考试日期"
									labelCol={{ span: 7 }}
									wrapperCol={{ span: 17 }}
									form={form}
									required={true}
									name="exam_time"
									value={detail.exam_time}
									type="datePicker"
									style={{ width: "150px" }}
								/>
							</div>
							<div className="box">
								<div style={{ marginRight: 15 }}>
									考试年级：
									<Grades
										style={{ width: 150 }}
										value={
											detail.examgrade || detail.examgrade === 0 ? parseInt(detail.examgrade) : ""
										}
										type="compulsory"
										name="examgrade"
										form={form}
									/>
								</div>
								<div>
									考试科目：
									<Subject
										style={{ width: 150 }}
										value={detail.examsubject_uuid}
										name="examsubject_uuid"
										form={form}
									/>
								</div>
							</div>
							<div className="ta_c mt_15">
								<Button type="primary" onClick={e => submit(e)}>
									确定
								</Button>
							</div>
						</div>
					)}
				</Form>
			</Modal>
		);
	}
	// 成绩导入
	function UploadModal() {
		[showUpload, setShowUpload] = useState(false);
		return (
			<Modal
				title="成绩导入"
				visible={showUpload}
				onCancel={() => {
					setShowUpload(false);
				}}
				footer={null}
				bodyStyle={{ display: "flex", justifyContent: "space-between" }}
				width={700}
			>
				<div className="b_1 pall_10" style={{ width: 300 }}>
					<div>下载成绩模板</div>
					<div className="ta_c b_1 pt_20">
						<Iconfont style={{ fontSize: 50 }} type="icon-xiazai" />
						<p className="mb_10 mt_10">
							<a
								className="link"
								onClick={async btn => {
									await $.download("/achievement/export/fields", {
										group_uuid: detail.group_uuid
									});
								}}
							>
								点击下载
							</a>
							学员成绩模版
						</p>
					</div>
					<div className="fs_13 pt_10">下载对应模板，阅读注意点后填写模板文件，模板表头不可删</div>
				</div>
				<div className="b_1 pall_10" style={{ width: 300 }}>
					<div>上传成绩名单</div>
					<div className="b_1 ta_c pt_20">
						<Iconfont style={{ fontSize: 50 }} type="icon-shangchuan" />
						<p className="mb_10 mt_10">
							<a className="link" onClick={() => upload.open()}>
								点击上传
							</a>
							学员成绩模版
						</p>
					</div>
					<div className="fs_13 pt_10">
						将学员成绩信息按照模板格式填写，完成编辑后上传，
						<span className="fc_err">上传后会覆盖之前已有的成绩信息</span>
					</div>
				</div>
			</Modal>
		);
	}

	let uploadData = {
		group_uuid: detail.group_uuid,
		exam_time:detail.exam_time,
		exam_uuid: uuid
	};
	if (detail.examgrade||detail.examgrade===0) {
		uploadData.examgrade = detail.examgrade;
	}
	if (detail.examsubject_uuid) {
		uploadData.examsubject_uuid = detail.examsubject_uuid;
	}
	return (
		<div>
			<div className="b_1 pst_rel pt_10 ph_10 pb_10 mb_20 bg_white br_2 mt_24 pall_15">
				<div className="pst_abs mt_15" style={{ top: 0, right: 0 }}>
					<Button
						type="primary"
						className="mr_15"
						onClick={() => {
							setShowEdit(true);
						}}
					>
						修改考试信息
					</Button>
					<Button
						type="primary"
						className="mr_15"
						onClick={() => {
							setShowUpload(true);
						}}
					>
						导入成绩
					</Button>
					<Button
						type="primary"
						className="mr_15"
						onClick={() => {
							choiceStudent.open({
								group_uuid: detail.group_uuid,
								disabled:true,
								onSure: async d => {
									let datas = [];
									d.forEach(temp => {
										temp.student_name = temp.name;
										temp.exam_score = "";
										delete temp.name;
										datas.push({ student_uuid: temp.student_uuid });
									});
									let data = {
										datas: JSON.stringify(datas),
										group_uuid: detail.group_uuid,
										exam_time:detail.exam_time,
										exam_uuid: detail.uuid
									};

									if (detail.examgrade||detail.examgrade===0) {
										data.examgrade = detail.examgrade;
									}
									if (detail.examsubject_uuid) {
										data.examsubject_uuid = detail.examsubject_uuid;
									}
									await $.post("/achievement/examstudent/add", data);
									parent&&parent.setCloseData(true);
									init();
								}
							});
						}}
					>
						添加学员
					</Button>
				</div>

				<div className="fb fs_24">{detail.name}</div>

				<div className="box fc_dis lh_30">
					<div className="mr_15">班级：{detail.group_name}</div>
					<div className="mr_15">班主任：{detail.teachers_name}</div>
					<div className="mr_15">考试人数：{detail.num_count ? detail.num_count : "未开始"}</div>
				</div>
				<div className="box fc_dis lh_30">
					<div className="mr_15">
						考试科目：{detail.examsubject_name ? detail.examsubject_name : "未选择"}
					</div>
					<div className="mr_15">
						考试年级：
						{detail.examgrade || detail.examgrade === 0 ? gradeTxt[detail.examgrade] : "未选择"}
					</div>
					<div className="mr_15">考试日期：{detail.exam_time}</div>
				</div>
				<div className="box fc_dis lh_30">
					<div className="mr_15">试卷总分：{detail.totalscore}</div>
					<div className="mr_15">最高分：{detail.num_max ? detail.num_max : "---"}</div>
					<div className="mr_15">最低分：{detail.num_min ? detail.num_min : "0"}</div>
					<div className="mr_15">平均分：{detail.num_avg ? detail.num_avg : "---"}</div>
				</div>
			</div>
			<div className="bg_white mt_24 pall_15 br_2">
			<Alert message="未填写分数即表示该学员缺考" type="warning" showIcon />
				<Table
					title={() => <div className="fb fs_20 ta_c">{succTitle}</div>}
					pagination={false}
					dataSource={stuList}
					columns={columns}
				/>
				{/* <Table pagination={false} dataSource={stuList.concat(newstu)} columns={columns} /> */}
				<ErrList />
			</div>
			<div style={{ height: 100 }}></div>
			<UploadModal />
			<EditModal />
			<Page_ChoiceClassStudent  ref={ref => (choiceStudent = ref)} />
			<Uploadfile
				zIndex={1200}
				action="/achievement/import/fields"
				params={uploadData}
				multiple={false}
				ref={ref => (upload = ref)}
				onSure={rs => {
					setTitle("导入成功的成绩");
					parent&&parent.setCloseData(true);
					init();
					setErrList(rs.data.failue);
				}}
			/>
		</div>
	);
}
