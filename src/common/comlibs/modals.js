import React from "react";
import $$ from "jquery";
import { Modal } from "antd";
import Method from "../method";

/*
 * 弹窗组件
 */
export default class Modals extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method(props);
		this.data = "";
		this.status = this.status.bind(this);
		this.showModal = this.showModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.winScrollY = 0;
		this.state = {
			title: "请填写",
			visible: false,
			confirmLoading: false,
		};
	}

	status(obj) {
		if (obj.show !== false) {
			this.winScrollY = window.scrollY;
		}
		this.setState({
			title: obj.title,
			visible: obj.show === false ? false : true,
		});
	}

	open(title, data, callback) {
		this.data = data;
		this.status({
			title,
			show: true,
		});
		let cb = setTimeout(() => {
			callback && callback();
			clearTimeout(cb);
		}, 100);
	}

	close() {
		this.status({
			show: false,
		});
	}

	showModal() {
		let index = this.props.index;
		if (index) {
			this.$.store(index, (obj) => {
				this.status(obj);
			});
		}
	}

	handleCancel() {
		let { onCancel } = this.props;
		this.setState({
			visible: false,
		});
		onCancel && onCancel();
	}

	handleOk() {
		this.setState({
			confirmLoading: true,
		});
		setTimeout(() => {
			this.setState({
				visible: false,
				confirmLoading: false,
			});
		}, 2000);
	}

	render() {
		const { title, visible, confirmLoading } = this.state;
		let {
			children,
			width,
			height,
			zIndex,
			className = "",
			style = { width: 520 },
			bodyStyle,
			maskClosable = true,
			closable = true,
			afterClose,
		} = this.props;

		this.showModal();

		return (
			<Modal
				className={className}
				title={title}
				zIndex={zIndex}
				style={style}
				bodyStyle={bodyStyle}
				width={width || style.width}
				height={height || style.height}
				visible={visible}
				onOk={this.handleOk}
				confirmLoading={confirmLoading}
				onCancel={this.handleCancel}
				maskClosable={maskClosable}
				closable={closable}
				afterClose={() => {
					afterClose && afterClose();
					$$("body,html").animate(
						{
							scrollTop: this.winScrollY,
						},
						500
					);
				}}
				footer={null}
			>
				{this.state.visible && (typeof children === "function" ? children(this.data) : children)}
			</Modal>
		);
	}
}
