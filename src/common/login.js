/*
 * 公共登录窗口组件
 * 命名规则：驼峰命名
 */
import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { Form as Forms, Icon, Button, Modal, notification } from "antd";
import { Method, Inputs, Form, Btn, Img } from "../pages/comlibs";
import "./style/login";

class Login extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method();
		this.vistor_uuid = "";
		this.loginSuccess = this.loginSuccess.bind(this);
		this.captcha = this.captcha.bind(this);
		this.verifycode = this.verifycode.bind(this);
		this.VoiceBox = this.VoiceBox.bind(this);
		this.state = {
			modalVisible: false
		};
	}

	open() {
		this.$.store("LG_open", () => {
			let { collapsed = "", version = "", update = "" } = localStorage;
			localStorage.clear();
			localStorage.collapsed = collapsed;
			localStorage.version = version;
			localStorage.update = update;
			this.setModalVisible(true);
		});
	}

	setModalVisible(modalVisible) {
		this.setState({ modalVisible });
	}

	async loginSuccess(post, { btn }) {
		let $ = this.$;
		localStorage.token = post.token || "";
		localStorage.uuid = post.uuid || "";
		this.setModalVisible(false);
		if (post.status === "failure") {
			notification.open({
				message: <font color="#ed4343">帐号提醒</font>,
				description: <font color="#ed4343">{post.message}</font>,
				icon: <Icon type="frown" style={{ color: "#ed4343" }} />,
				duration: 10
			});
		} else {
			notification.open({
				message: "帐号提醒",
				description: "登录成功！请记好您的帐号和密码哦~",
				icon: <Icon type="smile" style={{ color: "#108ee9" }} />,
				duration: 3
			});
		}
		let store = $.store();
		let history = this.props.history;
		let location = history.location;
		btn.loading = false;
		await store.SMT_getUserData();
		//if (location.pathname.split("/").length < 3) {
		location.pathname = store.GlobalIndexPage;
		//}
		history.push(location);
	}
	captcha() {
		let $ = this.$;
		let [img, setImg] = useState("");
		let [disabled, setDisabled] = useState(false);
		let captchaStatus = 1;
		let get = async () => {
			setDisabled(true);
			let data = await $.get("/captcha", {
				vistor_uuid: this.vistor_uuid
			});
			this.vistor_uuid = data.vistor_uuid;
			setImg(`data:image/png;base64,${data.captcha_img}`);
			setDisabled(false);
		};
		this.captchaInit = useRef({ get });

		useEffect(() => {
			this.captchaInit.current.get();
		}, [captchaStatus]);
		return (
			<Button
				className="box box-pc"
				style={{
					width: "102px",
					padding: 0,
					marginBottom: 8,
					border: "none"
				}}
				onClick={() => get()}
				disabled={disabled}
			>
				<Img alt="" style={{ height: "30px" }} src={img} />
			</Button>
		);
	}

	verifycode(_props) {
		let $ = this.$;
		let [num, setNum] = useState(60);
		let [disabled, setDisabled] = useState(false);
		let get = () => {
			let { user: phone, captcha_code } = _props.form.getFieldsValue(["user", "captcha_code"]);
			if (!phone) {
				$.warning("请输入手机号后再获取验证码！");
				return false;
			}
			if (!captcha_code) {
				$.warning("请输入效验码后再获取验证码！");
				return false;
			}
			setDisabled(true);
			let closeInter = () => {
				setDisabled(false);
				setNum(60);
				clearInterval(inter);
			};
			let inter = setInterval(() => {
				if (num < 2) {
					closeInter();
				} else {
					num--;
					setNum(num);
				}
			}, 1000);
			(async () => {
				await $.post(
					"/verifycode/captcha",
					{
						phone,
						captcha_code,
						vistor_uuid: this.vistor_uuid
					},
					() => {
						closeInter();
						this.captchaInit.current.get();
					}
				);
				$.msg("验证码已发送，请注意查看手机！");
			})();
		};
		return (
			<Button
				className="box"
				style={{
					padding: 0,
					fontSize: 13,
					color: "#333333"
				}}
				onClick={get.bind(this)}
				disabled={disabled}
			>
				{disabled ? `请稍等${num}秒` : "获取短信验证码"}
			</Button>
		);
	}

	VoiceBox(_props){
		let $ = this.$;
		let { user: phone, captcha_code } = _props.form.getFieldsValue(["user", "captcha_code"]);
		
		return (
			<div className="ta_r fc_info">
				<span onClick={async ()=>{
					if(!phone){
						$.warning("请输入手机号后再获取验证码！");
						return false;
					}
					await $.post(
						"/verify/voice",
						{
							phone,
							captcha_code,
							vistor_uuid: this.vistor_uuid
						})
					$.msg('语音验证码已发送，请等待电话接通')

				}}>语音验证码</span>
			</div>
		)
	}
	


	render() {
		let Captcha = this.captcha;
		let Verifycode = this.verifycode;
		let VoiceBox=this.VoiceBox

		this.open();
		return (
			<Modal
				className="loginModal"
				centered
				closable={false}
				keyboard={false}
				maskClosable={false}
				visible={this.state.modalVisible}
				footer={null}
				width={740}
				bodyStyle={{ padding: 0 }}
				style={{ borderRadius: 10, overflow: "hidden" }}
			>
				{this.state.modalVisible && (
					<Form
						action="/signupandlogin"
						method="POST"
						params={{
							channel: "www"
						}}
						className="login-form"
						style={{ marginBottom: "10px" }}
						success={this.loginSuccess}
					>
						{({ form, submit }) => (
							<div className="box box-rev">
								<div className="box">
									<Img
										style={{ borderRadius: "10px 0px 0px 10px",height:'100%',width:'100%' }}
										src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/b9e9f28c-1e37-11ea-ac92-00163e04cc20.png"
									/>
								</div>
								<div className="box-1">
									<h2 className="fs_20 fc_blue ta_c pt_15" style={{ fontWeight: 600 }}>
										欢迎登录
									</h2>
									<div style={{ width: 316, boxSizing: "content-box", paddingLeft: 60 }}>
										<Inputs
											className="input_wrap"
											form={form}
											name="user"
											item={true}
											required={true}
											placeholder="请输入手机号"
										/>
										<div className="box box-ac mb_15 input_wrap flex-between">
											<Inputs
												form={form}
												name="captcha_code"
												required={true}
												placeholder="请输入图片效验码"
											/>
											<Captcha form={form} />
										</div>
										<div className="box box-ac input_wrap flex-between" style={{marginBottom:'10px'}}>
											<Inputs
												form={form}
												name="verify"
												required={true}
												placeholder="请输入验证码"
											/>
											<Verifycode form={form} />
										</div>
										<VoiceBox form={form}/>
										<Forms.Item className="input_wrap" style={{ border: "none", marginTop: 35 }}>
											<Btn width="100%" size="large" onClick={e => submit(e)}>
												登 录
											</Btn>
										</Forms.Item>
									</div>
								</div>
							</div>
						)}
					</Form>
				)}
			</Modal>
		);
	}
}

export default withRouter(Login);
