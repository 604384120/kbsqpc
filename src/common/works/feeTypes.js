import React from "react";
import Inputs from "../comlibs/inputs";
import Method from "../method";

export default class feetypes extends React.Component {
	constructor(props) {
		super();
		this.getList = this.getList.bind(this);
		this.state = {
			list: []
		};
	}
	componentDidMount() {
		this.getList();
	}
	async getList() {
		let $ = new Method();
		let res = await $.get("/reimburse/fee/type");
		let arr = res.feetypes || [];
		this.setState({
			list: arr.map(rs => ({ text: rs.feetype_name, value: rs.feetype_id }))
		});
	}

	render() {
		let { list } = this.state;
		return <Inputs select={list} {...this.props} />;
	}
}
