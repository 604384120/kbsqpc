import React from "react";
import { Cascader, Form } from "antd";
import { $ } from "../method";

/*多级联动选择组件*/
export default class Cascaders extends React.Component {
	constructor(props) {
		super();
		this.$ = $;
		this.list = this.list.bind(this);
		this.save = this.save.bind(this);
		this.state = {
			initialValue: [],
			list: [],
			fieldNames: {}
		};
	}

	componentDidMount() {
		this.list();
	}

	async save(value) {
		let $ = this.$;
		let { form, save, name } = this.props;
		let Reload =  $.store().Reload;
		let valueIpt = this.valueReturn ? this.valueReturn(value) : value;
		if (save && value.length === this.limit) {
			$.loading();
			await $[save.method || "post"](
				save.api,
				Object.assign(
					{},
					{
						[name]: valueIpt
					},
					save.params || {}
				)
			);
			Reload && Reload();
			$.msg("已保存");
		} else {
			/*此处有BUG，未知原因，设置无效*/
			form.setFieldsValue({
				[name]: valueIpt
			});
		}
	}

	async list() {
		let $ = this.$;
		let type = this.props.type;
		let list = [];
		let initialValue = [];
		let fieldNames = {};
		if (type === "citychoice") {
			this.limit = 3;
			let get = await $.cityCode({
				code: this.props.value || ""
			});
			list = get.list;
			initialValue = get.cityCode;
			fieldNames = get.fieldNames;
			this.valueReturn = val => $.Arylast(val);
		}
		if (type === "coursecate") {
			this.limit = 2;
			let get = await $.coursecate();
			list = get.list;
			initialValue = this.props.value;
			fieldNames = get.fieldNames;
			this.valueReturn = val => val[0] + val[1];
		}
		this.setState({
			list,
			initialValue,
			fieldNames
		});
	}

	render() {
		const {
			form,
			name,
			label,
			required,
			placeholder,
			disabled = false,
			style = {}
		} = this.props;
		const { getFieldDecorator, labelCol = {}, wrapperCol = {} } = form;
		const filter = (inputValue, path) => {
			return path.some(
				option =>
					option.label
						.toLowerCase()
						.indexOf(inputValue.toLowerCase()) > -1
			);
		};
		const formDom = getFieldDecorator(name, {
			initialValue: this.state.initialValue,
			rules: required
				? [
						{
							required: true,
							message: `请选择${label}`
						}
				  ]
				: []
		})(
			<Cascader
				style={style}
				fieldNames={this.state.fieldNames}
				showSearch={filter}
				options={this.state.list}
				onChange={this.save.bind(this)}
				placeholder={placeholder ? placeholder : `请选择${label}`}
				disabled={disabled}
			/>
		);
		if (label) {
			return (
				<Form.Item
					label={label}
					labelCol={labelCol}
					wrapperCol={wrapperCol}
				>
					{formDom}
				</Form.Item>
			);
		}
		return <span>{formDom}</span>;
	}
}
