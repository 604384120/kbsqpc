import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 学校老师下拉选择
 */
let GET_Teacher = "";
export default class Teacher extends React.Component {
	constructor(props) {
		super();
		this.list = this.list.bind(this);
		this.load = this.load.bind(this);
		this.state = {
			loading: true,
			list: []
		};
		setTimeout(()=>{
			this.load()
		},50)
	
	}

	async list() {
		let $ = new Method();
		if (!GET_Teacher) {
			this.setState({
				loading: true
			});
			GET_Teacher = await $.get("/teacher/list", {
				limit: 1000,
				status: "INSERVICE"
			});
		}
		this.setState({
			loading: false,
			list: GET_Teacher
		});
	}
	async load(){
		let $ = new Method();
		this.setState({
			loading: true
		});
		let res = await $.get("/teacher/list", {
			limit: 1000,
			status: "INSERVICE"
		});
		this.setState({
			loading: false,
			list: res
		});
	}

	render() {
		const {
			form,
			label,
			name = "teacher_uuids",
			valName = "teacher_uuid",
			value,
			width,
			style,
			placeholder="请选择老师",
			className,
			required = false,
			disabled = false,
			mode,
			autoSubmit,
			onFocus,
			showPhone=false,
			labelCol: _labelCol,
			wrapperCol: _wrapperCol,
			onChange
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;
		this.name = name;

		const Dom = () => {
			if (disabled) {
				let text = [];
				let list = this.state.list;
				for (let i in list) {
					if (value.indexOf(list[i][valName]) > -1) {
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
			if(this.state.loading){
				return (
					<span></span>
				)
			}
			return (
				<Select
					style={{
						width,
						...style
					}}
					showSearch
					onFocus={(e)=>{
						onFocus&&onFocus(e)
					}}
					placeholder={placeholder}
					mode={mode}
					allowClear
					onChange={e => {
						if (autoSubmit && form._handleSubmit) {
							let _set = setTimeout(() => {
								form._handleSubmit({});
								clearTimeout(_set);
							}, 50);
						}
						onChange&&onChange(e)
					}}
					filterOption={(input, option) =>
						option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
					optionLabelProp="label"
					loading={this.state.loading}
				>
					{this.state.list.map((obj, key) => (
						<Option key={key} value={obj[valName]} title={showPhone?obj.name+'('+obj.phone+')':obj.name} label={obj.name}>
							{obj.name}{showPhone?'('+obj.phone+')':''}
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
			return <span className={className}>{formDom}</span>;
		}
	}
}
