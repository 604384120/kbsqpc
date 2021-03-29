import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 学校学期下拉选择
 */
let GET_semesters = "";
export default class Semesters extends React.Component {
	constructor(props) {
		super();
		this.$ = new Method(props);
		this.list = this.list.bind(this);
		this.state = {
			loading: true,
			semesters: []
		};
	}

	componentDidMount() {
		this.list();
	}

	async list() {
		let $ = this.$;
		if (!GET_semesters) {
			GET_semesters = await $.get("/semester/list");
		}
		this.setState({
			loading: false,
			semesters: GET_semesters.semesters || []
		});
	}

	async save(value) {
		let $ = this.$;
		let { save } = this.props;
		if (save && value) {
			$.loading();
			await $[save.method || "post"](
				save.api,
				Object.assign(
					{},
					{
						semester_uuid: value
					},
					save.params || {}
				)
			);
			$.msg("已保存");
		}
	}

	render() {
		const {
			form,
			label,
			value,
			required = false,
			disabled = false,
			labelCol: _labelCol,
			wrapperCol: _wrapperCol
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;

		const Dom = () => {
			if (disabled) {
				let text = [];
				let list = this.state.semesters;
				for (let i in list) {
					if (value && value.indexOf(list[i].uuid) > -1) {
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
					style={{ width: 160 }}
					loading={this.state.loading}
					placeholder="请选择学期"
					showSearch
					allowClear
					onChange={this.save.bind(this)}
					filterOption={(input, option) =>
						option.props.children
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
				>
					{this.state.semesters.map((obj, key) => (
						<Option key={key} value={obj.uuid}>
							{obj.name}
						</Option>
					))}
				</Select>
			);
		};

		const formDom = getFieldDecorator("semester_uuid", {
			initialValue: value,
			rules: required
				? [
						{
							required: true,
							message: "请选择好学期后再操作!"
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
