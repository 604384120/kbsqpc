import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 学校年级班级下拉选择
 */
let GET_Gradesclass = "";
let GET_paygroup = "";
let GET_schoolclass = "";
export default class Gradesclass extends React.Component {
	constructor(props) {
		super();
		this.props = props;
		this.studygrade = NaN;
		this.list = this.list.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			loadingGrades: true,
			loadingClass: true,
			grades: [],
			class: []
		};
	}

	componentDidMount() {
		this.list();
	}

	async save(e) {
		let props = this.props;
		let targetval = e || "";
		let { save, value = [], required = [], store } = props;
		let valuePro =
			typeof this.valuePro === "undefined"
				? value[1] || ""
				: this.valuePro;
		if (valuePro === targetval) {
			return false;
		}
		if (save) {
			let $ = new Method(props);
			if (required[1] && !targetval) {
				$.warning("班级不能为空！");
				return false;
			}
			$.loading();
			await $[save.method || "post"](
				save.api,
				Object.assign(
					{},
					{
						studygrade: this.studygrade,
						[this.type === "payclass"
							? "group_uuid"
							: "schoolclass_uuid"]: targetval
					},
					save.params || {}
				)
			);
			this.valuePro = targetval;
			let Reload = store().Reload;
			Reload && Reload();
			$.msg("已保存");
		}
	}

	async list(index) {
		let $ = new Method(this.props);
		let get = "";
		if (GET_Gradesclass) {
			get = GET_Gradesclass;
		} else {
			get = await $.get("/campus/study/grades");
			GET_Gradesclass = get;
		}
		let grades = [];
		let gradesName = [];
		for (let i in get.grades) {
			if (i) {
				let name = get.grades[i];
				//此处年级数据超过9后转换存在隐患[0,1,2,3...]
				if (index && index.toString().indexOf(i) > -1) {
					gradesName.push(name);
				}
				grades.push({
					value: i,
					name
				});
			}
		}
		if (!index) {
			this.setState({
				loadingGrades: false,
				grades: grades
			});
			this.handleChange();
		} else {
			return gradesName.toString();
		}
	}

	async handleChange(studygrade = "") {
		let $ = new Method(this.props);
		let payclass = this.type === "payclass" ? true : false;

		this.studygrade = parseInt(studygrade);
		this.setState({
			loadingClass: true
		});

		if (payclass) {
			if (!GET_paygroup) {
				GET_paygroup = await $.get("/campus/paygroup", {
					studygrade
				});
			}
		} else {
			if (!GET_schoolclass) {
				GET_schoolclass = await $.get("/campus/school/class", {
					studygrade
				});
			}
		}
		this.setState({
			loadingClass: false,
			class: payclass ? GET_paygroup.groups : GET_schoolclass.schoolclass
		});
	}

	gradesName(index) {
		return new Promise((resolve, reject) => {
			resolve(this.list(index));
		});
	}

	render() {
		const {
			form,
			label,
			type,
			name,
			value = [],
			disabled = false,
			showClass = true,
			initClass = false,
			required = [0, 0],
			labelCol: _labelCol,
			wrapperCol: _wrapperCol
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;
		this.type = type;

		const formStudygrade = getFieldDecorator("studygrade", {
			initialValue: value[0],
			rules: required[0]
				? [
						{
							required: true,
							message: "请选择好年级后再操作!"
						}
				  ]
				: []
		})(
			<Select
				style={{ width: 120, marginRight: "10px" }}
				placeholder="请选择年级"
				allowClear
				onChange={this.handleChange}
				loading={this.state.loadingGrades}
				disabled={disabled}
			>
				{this.state.grades.map((obj, key) => (
					<Option key={key} value={obj.value}>
						{obj.name}
					</Option>
				))}
			</Select>
		);

		const formClass = getFieldDecorator(
			name
				? name
				: this.type === "payclass"
				? "group_uuid"
				: "schoolclass_uuid",
			{
				initialValue: value[1],
				rules: required[1]
					? [
							{
								required: true,
								message: "请选择好班级后再操作!"
							}
					  ]
					: []
			}
		)(
			!initClass ? (
				<Select
					style={{ width: 120 }}
					placeholder="请选择班级"
					loading={this.state.loadingClass}
					disabled={
						disabled || (this.state.class.length > 0 ? false : true)
					}
					optionLabelProp="label"
					dropdownMatchSelectWidth={false}
					allowClear
					showSearch
					onChange={this.save.bind(this)}
					filterOption={(input, option) =>
						option.props.children
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
				>
					{this.state.class.map((obj, key) => (
						<Option key={key} label={obj.name} value={obj.uuid}>
							{obj.name}
							{obj.course_name ? `[${obj.course_name}]` : ""}
						</Option>
					))}
				</Select>
			) : (
				<Select
					style={{ width: 120 }}
					placeholder="请选择班级"
					allowClear
					showSearch
				>
					<Option value="一班">一班</Option>
					<Option value="二班">二班</Option>
					<Option value="三班">三班</Option>
					<Option value="四班">四班</Option>
					<Option value="五班">五班</Option>
					<Option value="六班">六班</Option>
					<Option value="七班">七班</Option>
					<Option value="八班">八班</Option>
					<Option value="九班">九班</Option>
					<Option value="十班">十班</Option>
					<Option value="十一班">十一班</Option>
					<Option value="十二班">十二班</Option>
					<Option value="十三班">十三班</Option>
					<Option value="十四班">十四班</Option>
					<Option value="十五班">十五班</Option>
					<Option value="十六班">十六班</Option>
					<Option value="十七班">十七班</Option>
					<Option value="十八班">十八班</Option>
					<Option value="十九班">十九班</Option>
					<Option value="二十班">二十班</Option>
				</Select>
			)
		);

		if (label) {
			return (
				<Form.Item
					label={label}
					labelCol={_labelCol || labelCol}
					wrapperCol={_wrapperCol || wrapperCol}
				>
					{formStudygrade}
					{showClass && formClass}
				</Form.Item>
			);
		} else {
			return (
				<span className="pr_10">
					{formStudygrade}
					{showClass && formClass}
				</span>
			);
		}
	}
}
