import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 课程老师下拉选择
 */
let GET_Teacher = "";
export default class Teacher extends React.Component {
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
				$.warning("老师选择不能为空！");
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
		if (!GET_Teacher) {
			GET_Teacher = await $.get("/campus/course/usable/teachers", {
				course_uuid: this.props.course_uuid
			});
		}
		this.setState({
			loading: false,
			list: GET_Teacher.teachers
		});
	}

	render() {
		const {
			form,
			label,
			name = "teacher_uuids",
			value,
			required = false,
			disabled = false,
			multiple = false,
			labelCol: _labelCol,
			wrapperCol: _wrapperCol
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;

		this.name = name;

		const Dom = () => {
			if (disabled) {
				let text = [];
				let list = this.state.list;
				for (let i in list) {
					if (value && value.indexOf(list[i].teacher_uuid) > -1) {
						text.push(list[i].name);
					}
				}
				return (
					<span>
						{text.toString()}
						<input type="hidden" />
					</span>
				);
			}
			return (
				<Select
					style={{ width: multiple ? 300 : 120 }}
					placeholder="请选择老师"
					mode={multiple ? "multiple" : null}
					allowClear
					onBlur={this.save.bind(this)}
					loading={this.state.loading}
				>
					{this.state.list.map((obj, key) => (
						<Option key={key} value={obj.teacher_uuid}>
							{obj.name}
						</Option>
					))}
				</Select>
			);
		};

		const formDom = getFieldDecorator(name, {
			initialValue: value,
			rules: required
				? [
						{
							required: true,
							message: "请选择好老师后再操作!"
						}
				  ]
				: []
		})(Dom());

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
