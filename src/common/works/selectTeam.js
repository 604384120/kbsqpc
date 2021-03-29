import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 学校分组下拉选择
 */
let GET_Team = "";
export default class Teacher extends React.Component {
	constructor(props) {
		super();
        this.reload = this.reload.bind(this);
		this.state = {
			loading: false,
			list: []
		};
		this.reload()
	}
    
    async reload(){
        let $ = new Method();
        this.setState({
            loading: true
        });
        let res = await $.get("/campusstudent/teams/list", {
            limit: 1000,
		});
        this.setState({
			loading: false,
			list: res.data
		});
		if(!res.data.length)return
		let {form,name='team_uuid'}=this.props
		form.setFieldsValue({[name]:res.data[0].uuid})
	}

	render() {
		const {
			form,
			label,
			name = "team_uuid",
			valName = "uuid",
			value,
			width,
			style={width:200},
			placeholder="请选择小组",
			className,
			required = false,
			disabled = false,
			multiple = false,
			autoSubmit,
			labelCol: _labelCol,
			wrapperCol: _wrapperCol
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;
		let {list}=this.state

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
			return (
				<Select
					style={{
						width,
						...style
                    }}
                    // onFocus={()=>{
                    //     this.list()
                    // }}
					showSearch
					placeholder={placeholder}
					mode={multiple ? "multiple" : null}
					allowClear
					onChange={e => {
						if (autoSubmit && form._handleSubmit) {
							let _set = setTimeout(() => {
								form._handleSubmit({});
								clearTimeout(_set);
							}, 50);
						}
					}}
					filterOption={(input, option) =>
						option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
					loading={this.state.loading}
				>
					{this.state.list.map((obj, key) => (
						<Option key={key} value={obj[valName]} title={obj.name}>
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
							message: "请选择好组后再操作!"
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