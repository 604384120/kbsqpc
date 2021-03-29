import React from "react";
import ReactDOM from "react-dom";
import Jq from "jquery";
import { Icon, message } from "antd";
import Zmage from "react-zmage";
import { $, Method, Modals, Btn, Uploadimgs, Uploadvideo } from "./comlibs";

window.Yew = {
	$,
	Jq,
	React,
	ReactDOM,
	Antd: { Icon, Message: message },
	Button: Btn,
	Modals,
	Uploadimg: Uploadimgs,
	Uploadvideo,
	Zmage,
};

export default class Yew extends React.PureComponent {
	constructor(props) {
		super(props);
		this.$ = new Method();
		this.fn = props.fn;
		this._id = "Yew_" + this.fn + "_" + this.$.guid();
	}
	async componentDidMount() {
		let fns = await import("rs-yew");
		for (let fn in fns) {
			if (fn === this.fn) {
				await import("../rust/style/" + this.fn + ".css");
				fns[fn]("#" + this._id);
				break;
			}
		}
	}
	render() {
		return <div id={this._id} />;
	}
}
