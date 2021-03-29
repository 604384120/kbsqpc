import React from "react";
import { Select, Spin, Icon } from "antd";
import debounce from "lodash/debounce";
import Method from "../method";

const { Option } = Select;
export default class searchStudent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.$ = new Method();
		this.lastFetchId = 0;
		this.onSelect = this.onSelect.bind(this);
		this.fetchUser = this.fetchUser.bind(this);
		this.fetchUser = debounce(this.fetchUser, 500);
	}

	state = {
		data: [],
		value: [],
		fetching: false
	};

	async fetchUser(name) {
		this.lastFetchId += 1;
		const $ = this.$;
		const fetchId = this.lastFetchId;
		this.setState({ data: [], fetching: true, noData: false });
		let list = await $.get("/campusstudent/screen", { name, limit: 9999 });
		if (fetchId !== this.lastFetchId) {
			return;
		}
		const data = list.map(user => ({
			text: `${user.name}`,
			value: user.student_uuid
		}));
		this.setState({ data, fetching: false, noData: true });
	}

	handleChange = value => {
		this.setState({
			value,
			data: [],
			fetching: false
		});
	};

	onSelect(v) {
		this.props.onSelect && this.props.onSelect(v.key, v);
	}

	render() {
		const { className, width } = this.props;
		const { fetching, data, noData, value } = this.state;
		let nodata = noData === true ? <span>没有搜索到相关学员哦~</span> : null;
		return (
			<Select
				labelInValue
				value={value}
				showSearch={true}
				className={`CUSTOM_searchStudent ${className}`}
				suffixIcon={<Icon type="search" />}
				placeholder="输入学员姓名、手机号搜索"
				notFoundContent={fetching ? <Spin size="small" /> : nodata}
				filterOption={false}
				onSearch={this.fetchUser}
				onChange={this.handleChange}
				onSelect={this.onSelect}
				style={{ width: width || 220 }}
			>
				{data.map(d => (
					<Option key={d.value} value={d.value}>
						{d.text}
					</Option>
				))}
			</Select>
		);
	}
}
