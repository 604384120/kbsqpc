import React from "react";
import { Select, Form, Modal } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 班级下拉选择
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
		this.list();
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
				$.warning("班级选择不能为空！");
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

	reload(params){
		this.list(params);
	}

	async list(params) {
		let $ = this.$;
		let {form,labelInValue,no_normal,is_end,back_value='uuid'} = this.props;
		let val = this.props.value;
		let param = {
			totalnum: "YES",
			page: 1,
			limit: 9999
		};
		if(!no_normal){
			param.join_way="normal"
		}
		if(is_end){
			param.is_end=is_end
		}
		let api="/banji/list"
		// if(no_normal){
		// 	api="/banji/list"
		// }else{
		// 	api="/banji/normal/list"
		// }
		let list=await $.get(api, Object.assign("", param, params));
		list.data=list
		if(val==='first'){
			if(list.data[0]){
				if(labelInValue){
					if(back_value){
						val={key:list.data[0][back_value],label:list.data[0].name}
					}else{
						val={key:list.data[0].uuid,label:list.data[0].name}
					}
				}else{
					val={key:list.data[0].uuid,label:list.data[0].name}
				}
				if (form._handleSubmit) {
					let _set = setTimeout(() => {
						form._handleSubmit({});
						clearTimeout(_set);
					}, 50);
				}
			}else{
				val='无班级';
				if (form._handleSubmit) {
					let _set = setTimeout(() => {
						form._handleSubmit({});
						clearTimeout(_set);
					}, 50);
				}
			}
		}else if (val) {
			if(back_value){
				let has = list.data.some(l => val.indexOf(l[back_value]) > -1);
				if (!has) {
					val = undefined;
					Modal.warning({
						title: "您没有权限查看该班级或该班级已被删除！"
					});
				}
			}
		}
		this.setState({
			loading: false,
			list: list.data,
			value: val
		});
	}

	render() {
		let {
			form,
			label,
			name = "group_uuid",
			required = false,
			disabled = false,
			multiple = false,
			width = 150,
			style,
			back_value='uuid',
			className,
			autoSubmit,
			onChange,
			allowClear=true,
			labelInValue = false,
			labelCol: _labelCol,
			wrapperCol: _wrapperCol,
			placeholder='请选择班级'
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;
		let { list, value } = this.state;

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
							message: "请选择好班级后再操作!"
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
				labelInValue={labelInValue}
				onChange={e => {
					onChange && onChange(e);
					this.setState({
						value:e
					})
					if (autoSubmit && form._handleSubmit) {
						let _set = setTimeout(() => {
							form._handleSubmit({});
							clearTimeout(_set);
						}, 50);
					}
				}}
				filterOption={(input, option) =>
					option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
			>
				{list.map((obj, key) => (
					<Option key={key} value={obj[back_value]} title={obj.name}>
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
			return <span className={className}>{formDom}</span>;
		}
	}
}

