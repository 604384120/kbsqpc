import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { ConfigProvider, Layout } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import Moment from "moment";
import Method from "./common/method";
import {
	TopProgress,
	MainTitleBar,
	SuspenseSwitchRoute,
	SiderMenuLeft,
	SiderMenuTop,
} from "./common/base";
import Login from "./common/login";
import "moment/locale/zh-cn";
import "./App.css";

Moment.locale("zh-cn");

const { Content } = Layout;
const Methods = new Method();
const Single = Methods.getQueryString("single") === "yes";

class App extends React.PureComponent {
	constructor() {
		super();
		this.toggle = this.toggle.bind(this);
		this.state = {
			collapsed: localStorage.collapsed === "true" ? 1 : 0,
		};
	}

	toggle() {
		localStorage.collapsed = !this.state.collapsed;
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}

	render() {
		let left = this.state.collapsed ? 80 : 200;
		return (
			<ConfigProvider locale={zh_CN}>
				<Router>
					<TopProgress />
					<Layout style={{ height: "100%" }}>
						<SiderMenuLeft collapsed={this.state.collapsed} />
						<Layout>
							<SiderMenuTop toggle={this.toggle} collapsed={this.state.collapsed} />
							<Layout
								style={{
									padding: 0,
									marginTop: Single ? 0 : 56,
									marginLeft: Single ? 0 : left,
								}}
							>
								<MainTitleBar />
								<Content
									style={{
										padding: 24,
										margin: Single ? 0 : "10px 0 0 0",
										minHeight: "86vh",
									}}
								>
									<SuspenseSwitchRoute />
								</Content>
							</Layout>
						</Layout>
					</Layout>
					<Login />
				</Router>
			</ConfigProvider>
		);
	}
}

export default App;
