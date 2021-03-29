import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 学校老师下拉选择
 */
let GET_Student = "";
export default class Student extends React.Component {
	constructor(props) {
		super();
		this.list = this.list.bind(this);
		this.state = {
			loading: true,
			list: []
		};
	}

	componentDidMount() {
		this.list();
	}

	async save(e) {
		let props = this.props;
		let targetval = e || "";
		let { save, value, required = [], store } = props;
		let valuePro =
			typeof this.valuePro === "undefined" ? value || "" : this.valuePro;
		if (valuePro === targetval) {
			return false;
		}
		if (save) {
			let $ = new Method(props);
			if (required && !targetval) {
				$.warning("学员选择不能为空！");
				return false;
			}
			$.loading();
			await $[save.method || "post"](
				save.api,
				Object.assign(
					{},
					{
						[this.name]: targetval.toString()
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

	async list() {
		let $ = new Method(this.props);
		//if (!GET_Student || this.studygrades) {
		GET_Student = await $.get("/campus/student", {
			studygrade: this.studygrades.toString()
		});
		//}
		this.setState({
			loading: false,
			list: GET_Student.students || []
		});
	}

	render() {
		const {
			form,
			label,
			name = "student_uuid",
			studygrades = "",
			value,
			required = false,
			disabled = false,
			multiple = false,
			labelCol: _labelCol,
			wrapperCol: _wrapperCol
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;

		this.name = name;
		this.studygrades = studygrades;

		const formDom = getFieldDecorator(name, {
			initialValue: value,
			rules: required
				? [
						{
							required: true,
							message: "请选择好学员后再操作!"
						}
				  ]
				: []
		})(
			<Select
				style={{ width: multiple ? 300 : 120 }}
				placeholder="请选择学员"
				mode={multiple ? "multiple" : null}
				allowClear
				onBlur={this.save.bind(this)}
				disabled={disabled}
				loading={this.state.loading}
			>
				{this.state.list.map((obj, key) => (
					<Option key={key} value={obj.student_uuid}>
						{obj.name}
					</Option>
				))}
			</Select>
		);

		if (label) {
			return (
				<Form.Item
					label={label}
					labelCol={_labelCol || labelCol}
					wrapperCol={_wrapperCol || wrapperCol}
				>
					{formDom}
				</Form.Item>
			);
		} else {
			return <span className="pr_10">{formDom}</span>;
		}
	}
}
