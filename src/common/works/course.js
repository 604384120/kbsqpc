import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 课程下拉选择
 */
export default class Course extends React.PureComponent {
	constructor(props) {
		super(props);
		this.$ = new Method();
		this.list = this.list.bind(this);
		this.state = {
			loading: true,
			list: []
		};
	}

	componentDidMount() {
		this.list(this.props.params);
	}

	async save(e) {
		let props = this.props;
		let targetval = e || "";
		let { save, value, required = [], store } = props;
		let valuePro = typeof this.valuePro === "undefined" ? value || "" : this.valuePro;
		if (valuePro === targetval) {
			return false;
		}
		if (save) {
			let $ = this.$;
			if (required && !targetval) {
				$.warning("课程选择不能为空！");
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

	async list(params) {
		let $ = this.$;
		let list = await $.get("/course/list", Object.assign({
			page: 1,
			limit: 9999
		},params));
		this.setState({
			loading: false,
			list
		});
	}

	render() {
		let {
			form,
			label,
			name = "course_uuid",
			value = undefined,
			required = false,
			disabled = false,
			multiple = false,
			onChange,
			autoSubmit,
			allowClear=true,
			width = 150,
			style,
			className,
			placeholder='请选择课程',
			labelCol: _labelCol,
			wrapperCol: _wrapperCol
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;
		const { list } = this.state;

		this.name = name;

		if (value && !Array.isArray(value)) {
			value = [value];
		}

		let formDom = getFieldDecorator(name, {
			initialValue: list.length > 0 ? value : undefined,
			rules: required
				? [
						{
							required: true,
							message: "请选择好课程后再操作!"
						}
				  ]
				: []
		})(
			<Select
				style={{
					width,
					...style
				}}
				placeholder={placeholder}
				mode={multiple ? "multiple" : null}
				allowClear={allowClear}
				onBlur={this.save.bind(this)}
				disabled={disabled}
				loading={this.state.loading}
				showSearch
				filterOption={(input, option) =>option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
				onChange={e => {
					onChange && onChange(e);
					if (autoSubmit && form._handleSubmit) {
						let _set = setTimeout(() => {
							form._handleSubmit({});
							clearTimeout(_set);
						}, 50);
					}
				}}
			>
				{list.map((obj, key) => (
					<Option key={key} value={obj.uuid} title={obj.name+(obj.status==='offline'?'(已下架)':'')}>
						{obj.name}{obj.status==='offline'&&'(已下架)'}
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
			return <span className={className}>{formDom}</span>;
		}
	}
}
