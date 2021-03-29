import React from "react";
import { Select } from "antd";
import Method from "../method";

const { Option } = Select;

/*
 * 适合等级
 */
let GET_classlevel = "";
export default class Classlevel extends React.Component {
	constructor(props) {
		super();
		this.$ = new Method(props);
		this.list = this.list.bind(this);
		this.state = {
			loading: true,
			list: []
		};
	}

	componentDidMount() {
		this.list();
	}

	async list() {
		let $ = this.$;
		if (!GET_classlevel) {
			GET_classlevel = await $.get("/campus/paygroup/classlevel");
		}
		this.setState({
			loading: false,
			list: GET_classlevel || []
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
						[this.name]: value
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
			name = "level_uuid",
			value,
			required = false,
			disabled = false
		} = this.props;
		const { getFieldDecorator } = form;
		this.name = name;

		const Dom = () => {
			if (disabled) {
				let text = [];
				let list = this.state.list;
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
					style={{ width: 120, marginRight: "10px" }}
					loading={this.state.loading}
					showSearch
					onChange={this.save.bind(this)}
					filterOption={(input, option) =>
						option.props.children
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
				>
					<Option value="">请选择等级</Option>
					{this.state.list.map((obj, key) => (
						<Option key={key} value={obj.uuid}>
							{obj.name}
						</Option>
					))}
				</Select>
			);
		};

		return (
			<span>
				{getFieldDecorator(name, {
					initialValue: value || "",
					rules: required
						? [
								{
									required: true,
									message: "请选择好等级后再操作!"
								}
						  ]
						: []
				})(Dom())}
			</span>
		);
	}
}
