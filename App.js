import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { ConfigProvider, Layout } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import Moment from "moment";
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

class App extends React.Component {
	constructor() {
		super();
		this.toggle = this.toggle.bind(this);
		this.store = this.store.bind(this);
		this.storeData = {};
		this.state = {
			collapsed: localStorage.collapsed === "true" ? 1 : 0,
		};
	}

	store(key, val) {
		if (key && val) {
			//let keyData = this.storeData[key];
			//if (!keyData && val) {
			this.storeData[key] = val;
			//}
		}
		if (key && val === "") {
			delete this.storeData[key];
		}
		if (key && typeof val === "undefined") {
			return this.storeData[key];
		}
		if (!key && !val) {
			return this.storeData;
		}
	}

	toggle() {
		localStorage.collapsed = !this.state.collapsed;
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}

	render() {
		let pathname = window.location.pathname;
		let background = pathname === "/bureau/overview" || pathname === "/bureau" ? "#F0F2F5" : "#fff";
		return (
			<ConfigProvider locale={zh_CN}>
				<Router>
					<TopProgress store={this.store} />
					<Layout>
						<SiderMenuLeft store={this.store} collapsed={this.state.collapsed} />
						<Layout>
							<SiderMenuTop
								store={this.store}
								toggle={this.toggle}
								collapsed={this.state.collapsed}
							/>
							<Layout
								style={{
									padding: 0,
									marginTop: 56,
									marginLeft: !this.state.collapsed ? 200 : 80,
								}}
							>
								<MainTitleBar store={this.store} />
								<Content
									style={{
										background,
										padding: 24,
										margin: "10px 0 0 0",
										minHeight: "80vh",
									}}
								>
									<SuspenseSwitchRoute store={this.store} />
								</Content>
							</Layout>
						</Layout>
					</Layout>
					<Login store={this.store} />
				</Router>
			</ConfigProvider>
		);
	}
}

export default App;
