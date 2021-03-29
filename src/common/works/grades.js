import React from "react";
import { Select, Form } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 年级下拉选择
 */
let GET_Grades = "";
export default class Grades extends React.Component {
	constructor(props) {
		super();
		this.props = props;
		this.studygrade = NaN;
		this.list = this.list.bind(this);
		this.state = {
			loadingGrades: true,
			grades: []
		};
	}

	componentDidMount() {
		this.list();
	}

	async list() {
		let $ = new Method();
		let {minNum=0,maxNum=100}=this.props
		let get = "";
		if (GET_Grades) {
			get = GET_Grades;
		} else {
			get = await $.get("/campus/studygrades");
			GET_Grades = get;
		}
		let grades = [];
		let range = [];
		let type = this.props.type;
		if (type === "compulsory") {
			range = $.AryRangeIdx(4, 15);
		}
		for (let i in get) {
			if (i) {
				let name = get[i];
				if (range.indexOf(parseInt(i)) > -1) {
					grades.push({
						value: parseInt(i),
						name
					});
				}
				if (range.length === 0) {
					grades.push({
						value: parseInt(i),
						name
					});
				}
			}
		}
		grades=grades.filter((g,i)=>(i>=minNum&&i<=maxNum))
		this.setState({
			loadingGrades: false,
			grades
		});
	}

	render() {
		const {
			form,
			label,
			type,
			name = "studygrade",
			className,
			style,
			width,
			value,
			placeholder="请选择年级",
			required = false,
			disabled = false,
			multiple = false,
			allText,
			autoSubmit,
			allOrder='start',
			labelCol: _labelCol,
			wrapperCol: _wrapperCol
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;

		this.name = name;
		this.type = type;

		const Dom = () => {
			// if (disabled) {
			// 	let text = [];
			// 	let list = this.state.grades;
			// 	for (let i in list) {
			// 		if (value && value.indexOf(list[i].value) > -1) {
			// 			text.push(list[i].name);
			// 		}
			// 	}
			// 	return (
			// 		<span>
			// 			{text.toString()}
			// 			<input type="hidden" />
			// 		</span>
			// 	);
			// }
			return (
				<Select
					style={{
						width,
						...style
					}}
					placeholder={placeholder||"请选择年级"}
					mode={multiple ? "multiple" : null}
					allowClear
					disabled={disabled}
					loading={this.state.loadingGrades}
					optionLabelProp="label"
					onChange={e => {
						if (autoSubmit && form._handleSubmit) {
							let _set = setTimeout(() => {
								form._handleSubmit({});
								clearTimeout(_set);
							}, 50);
						}
					}}
				>
					{
						allText&&allOrder==='start'&&(
							<Option value='' label={allText}>
								{allText}
							</Option>
						)
					}
					
					{this.state.grades.map((obj, key) => (
						<Option key={key} value={obj.value} label={obj.name}>
							{obj.name}
						</Option>
					))}
					{
						allText&&allOrder==='end'&&(
							<Option value='' label={allText}>
								{allText}
							</Option>
						)
					}
				</Select>
			);
		};

		const formStudygrade = getFieldDecorator(name, {
			initialValue: value,
			rules: required
				? [
						{
							required: true,
							message: "请选择好年级后再操作!"
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
					{formStudygrade}
				</Form.Item>
			);
		} else {
			return <span className={className}>{formStudygrade}</span>;
		}
	}
}
