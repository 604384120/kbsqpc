import $$ from "jquery";
import React, { forwardRef } from "react";
import { Button, Checks } from "react-ant-comlibs";
import Method, { $ } from "../common/method";
import Img from "../common/comlibs/img";
import Inputs from "../common/comlibs/inputs";
import Upload from "../common/comlibs/upload";
import Uploadfile from "../common/comlibs/uploadfile";
import Uploadimgs from "../common/comlibs/uploadimgs";
import Uploadaudio from "../common/comlibs/uploadaudio";
import Uploadvideo from "../common/comlibs/uploadvideo";
import Modals from "../common/comlibs/modals";
import Form from "../common/comlibs/createForm";
import TableEdit from "../common/comlibs/tableEdit";
import TablePagination from "../common/comlibs/tablePagination";
import DrawerTop from "../common/comlibs/drawerTop";
import Page from "../common/comlibs/drawerRight";
import Unlimitedload from "../common/comlibs/unlimitedload";
import Unlimitedfalls from "../common/comlibs/unlimitedfalls";
import Dropdown from "../common/comlibs/dropdown";
import Voice from "../common/comlibs/voice";
import Video from "../common/comlibs/video";
import Num from "../common/comlibs/num";
import RangePicker from "../common/comlibs/rangePicker";

let RenderDva = $.RenderDva;
const Btn = forwardRef((props, ref) => <Button ref={ref} iconId={$.iconId} {...props} />);

class FixedBox extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			width: 0,
		}
	}
	render() {
		let { children } = this.props;
		let { width } = this.state;
		return (
			<div
				className="bs bg_white_90 zidx_999 _on_drawerWidth"
				ref={e => {
					let node = $$(e).closest(".CUSTOM_detailslayer .ant-drawer-content-wrapper");
					this.setState({
						width: node.width()
					})
				}}
				style={{
					position: "fixed",
					right: 0,
					bottom: 0,
					width: width || $.drawerWidth(false),
				}}
			>
				<div className="box box-allc pall_10">{children}</div>
			</div>
		);
	}
}

export {
	Method,
	$,
	RenderDva,
	Img,
	Btn,
	Checks,
	Inputs,
	Upload,
	Uploadfile,
	Uploadimgs,
	Uploadaudio,
	Uploadvideo,
	Modals,
	Form,
	TableEdit,
	TablePagination,
	DrawerTop,
	Page,
	Unlimitedload,
	Unlimitedfalls,
	Dropdown,
	FixedBox,
	Voice,
	Video,
	Num,
	RangePicker
};
