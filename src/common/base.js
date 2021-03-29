/*
 * 公共基础类
 * 命名规则：驼峰命名
 */
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import {
	Layout,
	Menu,
	Icon,
	Skeleton,
	Progress,
	Modal,
	Avatar,
	Dropdown,
} from "antd";
import $$ from "jquery";
import Method from "./method";

import SearchStudent from "./works/searchStudent";

const $ = new Method({ checkUpdate: false });
const history = createBrowserHistory();
const GlobalIdentity = history.location.pathname.split("/")[1];

if ($.isLocal) {
	if (GlobalIdentity === "pc") {
		let href = $.loc.href.replace(/.com/g, ".com:20010");
		window.location.replace(href);
	} else if ($.loc.href.indexOf(":20010") > -1) {
		let href = $.loc.href.replace(/.com:20010/g, ".com");
		window.location.replace(href);
	}
}

const routes = require(`../config/routes_${GlobalIdentity}`);

const { SubMenu } = Menu;
const { Header, Sider } = Layout;
const Confirm = Modal.confirm;

const Single = $.getQueryString("single") === "yes";
const Sghide = Single ? "hide" : "";
const Iconfont = $.icon();

/*
 * 路由按需加载
 */
export class SuspenseSwitchRoute extends React.PureComponent {
	constructor() {
		super();
		$$(document).on("click", '.link', function () {
			$$(this).css('color','rgba(23,173,246,.65)')
		})
		this.$ = new Method();
		this.router = Router;
		this.routeWithSubRoutes = this.routeWithSubRoutes.bind(this);
	}

	routeWithSubRoutes(props) {
		let { component, path, store, name, params = {} } = props;
		let $store = this.$.store();

		let ComponentContext = lazy(async () => {
			if (!$store.GlobalFetchParams) {
				await $store.SMT_getUserData();
			}
			return import(`../pages${component}`);
		});

		useEffect(() => {
			window.wasm_templates = [];
			$store.MTB_setTitleText(name);
			$store.SML_renderCurrent(path);
			$$("body").removeClass("oy_h");
		});

		return (
			<Route
				path={path}
				render={(_props) => (
					<ComponentContext store={store} {..._props} {...params} />
				)}
			/>
		);
	}

	render() {
		let [RouteWithSubRoutes, IndexPage, ErrorPage, $routes = []] = [
			this.routeWithSubRoutes,
		];
		let $store = this.$.store;
		$store("GlobalIdentity", GlobalIdentity);
		let routeType = (route) => {
			if (route.type === "index") {
				route.title && (document.title = route.title);
				$store("GlobalIndexPage", route.path);
				IndexPage = lazy(async () => {
					$store().MTB_setTitleText(route.name);
					$store().SML_renderCurrent(route.path);
					if (!$store().GlobalFetchParams) {
						await $store().SMT_getUserData();
					}
					return import(`../pages${route.component}`);
				});
			}
			if (route.type === "404") {
				ErrorPage = lazy(() => import(`../pages${route.component}`));
			}
		};
		routes.map((route) => {
			if (route.component) {
				$routes.push(route);
			}
			if (route.sublist.length > 0) {
				route.sublist.map((_route) => {
					_route.component && $routes.push(_route);
					routeType(_route);
					return _route;
				});
			}
			routeType(route);
			return route;
		});
		if (!IndexPage) {
			IndexPage = ErrorPage;
		}
		return (
			<Suspense fallback={<Skeleton paragraph={{ rows: 10 }} active />}>
				<Switch>
					<Route
						exact
						path={`/${GlobalIdentity}`}
						render={(props) => <IndexPage store={$store} {...props} />}
					/>
					{$routes.map((route, i) => (
						<RouteWithSubRoutes store={$store} key={i} {...route} />
					))}
					<Route render={(props) => <ErrorPage store={$store} {...props} />} />
				</Switch>
			</Suspense>
		);
	}
}

/*
 * 顶部进度条
 */
export class TopProgress extends React.PureComponent {
	constructor() {
		super();
		this.$ = new Method();
		this.setProgress = this.setProgress.bind(this);
		this.top = -13;
		this.state = {
			top: this.top,
			progressPercent: 0,
		};
	}

	setProgress() {
		this.$.store("APP_setProgress", (status) => {
			if (status) {
				clearInterval(this.setIntvProgress);
				clearTimeout(this.setIimProgress);
				this.setState({
					progressPercent: 100,
				});
				this.setIimProgress = setTimeout(() => {
					this.setState({
						progressPercent: 0,
						top: this.top - 4,
					});
				}, 500);
			} else {
				clearInterval(this.setIntvProgress);
				clearTimeout(this.setIimProgress);
				let percent = this.state.progressPercent;
				this.setState({
					progressPercent:
						percent === 0 ? parseInt(Math.random() * 20) : percent,
					top: this.top,
				});
				this.setIntvProgress = setInterval(() => {
					if (this.state.progressPercent >= 70) {
						clearInterval(this.setIntvProgress);
					} else {
						this.setState({
							progressPercent:
								this.state.progressPercent + parseInt(Math.random() * 15),
						});
					}
				}, 200);
			}
		});
	}

	render() {
		this.setProgress();
		return (
			<Progress
				className="TopProgress"
				strokeLinecap="square"
				strokeWidth={4}
				showInfo={false}
				style={{
					top: this.state.top,
				}}
				strokeColor={{
					from: "#108ee9",
					to: "#87d068",
				}}
				percent={this.state.progressPercent}
			/>
		);
	}
}

/*
 * 主界面顶部主菜单栏
 */
export class SiderMenuTop extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method();
		this.store = this.$.store;
		this.toggle = this.toggle.bind(this);
		this.logout = this.logout.bind(this);
		this.getUserData = this.getUserData.bind(this);
		this.campusPower = this.campusPower.bind(this);
		this.changeCampus = this.changeCampus.bind(this);
		this.state = {
			user: {
				username: "未登录",
			},
			campus: {},
			campus_list: [],
		};
		this.store("LG_out", () => this.logout());
	}

	componentDidMount() {
		//this.getUser();
	}

	toggle() {
		this.props.toggle();
	}

	campusPower(campus_uuid, campus_list) {
		let $store = this.store;
		let GlobalData = $store().GlobalData || {};
		let campuss = campus_list || GlobalData.user.campus;
		let power = "admin";
		let campus_cur = {};
		if (campus_uuid) {
			for (let i in campuss) {
				let campus = campuss[i];
				if (campus.campus_uuid === campus_uuid) {
					let kind = ["admin", "owner", "OWNER", 'ADMIN'];
					power =
						kind.indexOf(campus.user_kind) > -1 ||
							kind.indexOf(campus.ins_user_kind) > -1
							? "admin"
							: "teacher";
					campus_cur = campus;
					localStorage.campus_obj = JSON.stringify(campus);
					localStorage.campus_uuid = campus_uuid;
					localStorage.institution_uuid = campus.institution_uuid;
					break;
				}
			}
		}
		return { power, campus: campus_cur };
	}

	async changeCampus(campus_uuid) {
		this.$.loading("校区切换中...");
		await $.post('/manage/lastcampus', { campus_uuid: campus_uuid });
		let $store = this.store;
		let GlobalData = $store().GlobalData || {};
		GlobalData.user_power = this.campusPower(campus_uuid).power;
		$store("GlobalData", GlobalData);
		setTimeout(() => {
			this.$.loc.reload();
		}, 300);
	}

	async getUser() {
		let $ = this.$;
		let $store = this.store;
		let params = $store().GlobalFetchParams || {};
		params.orgtype = GlobalIdentity.toUpperCase();
		let noInsCreate = $.loc.href.indexOf("institution?type=create") === -1;
		let user = await $.get(`/user/my/${$.uuid()}`, {}, (e) => {
			if (
				e.action === "login" &&
				noInsCreate &&
				$.loc.href.indexOf("/overview") === -1
			) {
				$.loc.replace("/adminPc/overview");
			}
		});
		let GlobalData = $store().GlobalData || {};
		let campus_uuid = $.campus_uuid();
		let institution_uuid = $.institution_uuid();
		if (!institution_uuid) {
			let user_ins = await $.get("/user/ins");
			if (user_ins && user_ins.institutions && user_ins.institutions.length > 0) {
				user.institutions = user_ins.institutions;
				institution_uuid = user.institutions[0].institution_uuid;
				user.institutions.map((i) => {
					if (i.last_institution && i.last_institution === 'YES') {
						// 最后操作的学校
						institution_uuid = i.institution_uuid
					}
				})
			}
		}
		if (!institution_uuid && noInsCreate) {
			$.token() && $.loc.replace("/adminPc/institution?type=create");
		}
		localStorage.institution_uuid = institution_uuid;
		localStorage.campus_obj = "{}";
		let campus_list = await $.get("/user/ins/campus", {
			institution_uuid,
		});
		user.campus = campus_list.campuss || [];
		if (!campus_uuid) {
			let campus = user.campus ? user.campus[0] : {};
			campus_uuid = campus?.campus_uuid || "";
			user.campus.map((i) => {
				if (i.last_campus && i.last_campus === 'YES') {
					// 最后操作的校区
					campus_uuid = i.campus_uuid
				}
			})
		}
		let { power, campus } = this.campusPower(campus_uuid, user.campus);
		GlobalData.user = user;
		GlobalData.user_power = power;
		params.campus_uuid = campus_uuid;
		$store("GlobalData", GlobalData);
		$store("GlobalFetchParams", params);
		this.setState({
			user,
			campus,
			campus_list: user.campus,
		});
		let PowerIdentity = `${power}Pc`;
		if (PowerIdentity !== GlobalIdentity) {
			$.loc.replace(`/${PowerIdentity}`);
		}
		return user;
	}

	getUserData() {
		this.store("SMT_getUserData", async (callback) => {
			return await this.getUser();
		});
	}

	logout() {
		Confirm({
			title: "确定要退出当前帐号吗?",
			okText: "确定",
			cancelText: "取消",
			onOk: () => {
				return new Promise(async (resolve, reject) => {
					let $store = this.store;
					await this.$.post("/logout");
					$store("GlobalFetchParams", {
						orgtype: GlobalIdentity.toUpperCase(),
					});
					$store().LG_open();
					return resolve();
				});
			},
		});
	}

	render() {
		const props = this.props;
		const collapsed = props.collapsed;
		const { campus, campus_list } = this.state;
		const { user_power } = this.store().GlobalData || {};
		this.getUserData();
		let menu = (
			<Menu>
				{campus_list.map((e, key) => (
					<Menu.Item key={key}>
						<div
							style={{
								minWidth: 160,
							}}
							onClick={() => this.changeCampus(e.campus_uuid)}
						>
							{e.name}
						</div>
					</Menu.Item>
				))}
			</Menu>
		);

		return (
			<Header
				className={Sghide}
				style={{
					position: "fixed",
					zIndex: 998,
					width: "100%",
					padding: 0,
				}}
			>
				<div className="box siderMenuTop">
					<div
						style={{
							width: collapsed ? 80 : 200,
						}}
					/>
					<div>
						<Icon
							type={collapsed ? "menu-unfold" : "menu-fold"}
							onClick={this.toggle.bind(this)}
							style={{
								color: "#fff",
								padding: "15px",
							}}
						/>
						<span className="fs_16 fc_white">
							<Dropdown overlay={menu} placement="bottomLeft">
								<span className="pointer">{campus.name}</span>
							</Dropdown>
							<Icon type="caret-down" />
						</span>
						<SearchStudent
							className="ml_15"
							onSelect={(uuid) => {
								window.open("/pc#/student_detail?uuid=" + uuid, "_blank");
							}}
						/>
					</div>
					<div className="box-1">
						<Menu
							theme="dark"
							mode="horizontal"
							style={{
								height: "56px",
								lineHeight: "56px",
								textAlign: "right",
							}}
						>
							<SubMenu
								title={
									<span>
										<Iconfont className="fs_20 va_tt" type="icon-shoujiduan" />
										<font>手机端管理</font>
									</span>
								}
								popupClassName="bg_white"
							>
								<Menu.Item
									key="1"
									style={{
										width: "180px",
										height: "205px",
										margin: 0,
										padding: 0,
									}}
								>
									<img
										alt=""
										style={{
											cursor: "alias",
											width: "100%",
										}}
										src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/f8237670-d18a-11ea-8b9b-00163e04cc20.png"
									/>
								</Menu.Item>
							</SubMenu>
							<SubMenu
								title={
									<span>
										<Iconfont className="fs_20 va_tt" type="icon-kefu" />
										<font>客服</font>
									</span>
								}
							>
								<Menu.Item key="1">
									<a
										href={`/${GlobalIdentity}/chat?single=yes`}
										title="点击即可进行在线客服咨询哦"
										target="_blank"
										rel="noopener noreferrer"
									>
										在线客服咨询
                  </a>
								</Menu.Item>
								<Menu.Item key="2">
									<a
										href="http://wpa.qq.com/msgrd?v=3&amp;uin=3307483314&amp;site=qq&amp;menu=yes"
										title="点击即可进行客服咨询哦"
										target="_blank"
										rel="noopener noreferrer"
									>
										QQ咨询客服
                  </a>
								</Menu.Item>
								<Menu.Item key="3">
									<span
										style={{
											cursor: "default",
										}}
									>
										热线：400-766-1816
                  </span>
								</Menu.Item>
								<Menu.Item
									key="4"
									style={{
										height: "165px",
										margin: 0,
										padding: 0,
										textAlign: "center",
									}}
								>
									<img
										alt=""
										width="130"
										src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/7e02cf08-3b4e-11ea-ac9d-00163e04cc20.jpeg"
									/>
									<div
										style={{
											cursor: "default",
										}}
									>
										扫码添加客服微信
                  </div>
								</Menu.Item>
							</SubMenu>
							<SubMenu
								title={
									<span>
										<Iconfont className="fs_20 va_tt" type="icon-bangzhu" />
										<font>帮助中心</font>
									</span>
								}
							>
								<Menu.Item key="1">
									<a target="_blank" href="https://www.yuque.com/zwriad/bz1d16">
										帮助文档
                  </a>
								</Menu.Item>
								<Menu.Item key="2">
									<a
										href="https://sxzstatic.oss-cn-shanghai.aliyuncs.com/%E5%BC%80%E7%8F%AD%E7%A5%9E%E5%99%A8.url"
										download="开班神器"
									>
										桌面快捷方式
                  </a>
								</Menu.Item>
							</SubMenu>
							<SubMenu
								title={
									<span>
										<Avatar src={this.state.user.avatar} />
										<span className="pl_10 va_m">
											{this.state.user.nickname}
										</span>
									</span>
								}
							>
								<Menu.Item key="1">
									<a
										href={
											user_power === "teacher"
												? "/teacherPc/user"
												: "/adminPc/user"
										}
									>
										个人中心
                  </a>
								</Menu.Item>
								<Menu.Item key="3">
									<a href="/pc#/coupon_list">优惠券</a>
								</Menu.Item>
								<Menu.Item key="4" onClick={this.logout.bind(this)}>
									退出
                </Menu.Item>
							</SubMenu>
						</Menu>
					</div>
				</div>
			</Header>
		);
	}
}

/*
 * 主界面主标题栏
 */
export class MainTitleBar extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method();
		this.info = this.info.bind(this);
		this.onClick = this.onClick.bind(this);
		this.setTitleText = this.setTitleText.bind(this);
		this.state = {
			name: "",
		};
	}

	onClick() {
		let layer = $$(".CUSTOM_detailslayer.ant-drawer-open");
		let len = layer.length;
		if (len === 1) {
			$$(".mainTitleBar_back").addClass("w_0");
			$$(".mainTitleBar_text").text(this.state.name);
		}
		if (len - 2 > -1) {
			let text = $$(layer[len - 2])
				.find(".ant-drawer-title")
				.text();
			$$(".mainTitleBar_text").text(text);
		}
		if (len > 0) {
			$$(layer[len - 1])
				.find(".ant-drawer-close")
				.trigger("click");
		}
	}

	//设置标题栏标题文本内容
	setTitleText() {
		this.$.store("MTB_setTitleText", (name) => {
			$$(".mainTitleBar_text").text(name);
			this.setState({
				name,
			});
		});
	}

	info() {
		let $ = this.$;
		let [info, setInfo] = useState({});
		let status = 1;
		let get = async () => {
			let info = await $.get("/releasenote/random");
			setInfo(info);
		};
		this._init = useRef({ get });
		useEffect(() => {
			this._init.current.get();
		}, [status]);
		return (
			<s>
				{info.title && (
					<span
						style={{
							float: "right",
							marginRight: $.leftWidth() + 24,
						}}
					>
						<Iconfont
							style={{
								height: "19px",
							}}
							className="fs_16 va_m"
							type="icon-tongzhi"
						/>
						<a
							className="fc_black pl_5"
							target="_blank"
							rel="noopener noreferrer"
							href={info.article_url}
						>
							{info.title}
						</a>
					</span>
				)}
			</s>
		);
	}

	render() {
		let Info = this.info;
		this.setTitleText();

		this.$.store("Page_close", () => {
			this.onClick();
		});

		return (
			<div
				className={`bs ${Sghide}`}
				style={{
					position: "fixed",
					height: 32,
					lineHeight: "32px",
					width: "100%",
					top: 56,
					zIndex: 997,
					background:
						"-webkit-gradient(linear, 0 0, 0 100%, from(#fff), to(rgba(255, 255, 255, 0.8)))",
				}}
			>
				<div
					className="mainTitleBar_back pointer dis_ib w_0 ov_h va_t"
					style={{
						width: "65px",
						height: "32px",
						transition: "width 0.3s",
					}}
					onClick={this.onClick}
				>
					<Icon
						style={{
							margin: "0 5px 0 15px",
						}}
						type="arrow-left"
					/>
					<span>返回</span>
				</div>
				<span
					style={{
						color: "#1890ff",
						fontSize: "12px",
						padding: "0 5px",
					}}
				>
					丨
        </span>
				<span className="mainTitleBar_text">{this.state.name}</span>
				<Info />
			</div>
		);
	}
}

/*
 * 主界面左侧主菜单栏
 */
export class SiderMenuLeft extends React.PureComponent {
	constructor() {
		super();
		this.$ = new Method();
		this.renderCurrent = this.renderCurrent.bind(this);
		this.state = {
			current: "",
		};
	}

	renderCurrent(e) {
		this.setState({
			current: e.key || this.state.current,
		});
	}

	renderCurrentProps() {
		this.$.store("SML_renderCurrent", (key) => {
			this.renderCurrent({
				key: `submenuitem_${key}`,
			});
		});
	}

	render() {
		let { collapsed } = this.props;
		let logo_url = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/campus/cover/0cf5cc7e-e5f2-11e7-8880-00163e1c3c19.jpg?x-oss-process=style/logo_2x"
		let campus_current = JSON.parse(localStorage.campus_obj || "{}") || {};
		let campus_logo = campus_current.logo ? campus_current.logo.oss != 'https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/campuslogo.png' ? campus_current.logo.oss : logo_url : logo_url
		this.renderCurrentProps();
		let MenuItem = (_route, TopMenu) => {
			if (_route.hide) {
				return null;
			}
			return (
				<Menu.Item
					className="ant-menu-singlemenu"
					title={_route.name}
					key={`submenuitem_${_route.path || _route.link}`}
				>
					{_route.link ? (
						<div
							className={`mlink ${TopMenu}`}
							onClick={() => {
								window.location.href = _route.link;
							}}
						>
							{_route.icon && (
								<Iconfont
									style={{
										fontSize: 18,
									}}
									type={_route.icon}
								/>
							)}
							{!collapsed || !TopMenu ? _route.name : ""}
						</div>
					) : (
							<Link
								className={TopMenu}
								style={{ color: "#fff" }}
								to={_route.path}
							>
								{_route.icon && (
									<Iconfont
										style={{
											fontSize: 18,
										}}
										type={_route.icon}
									/>
								)}
								{!collapsed || !TopMenu ? _route.name : ""}
							</Link>
						)}
				</Menu.Item>
			);
		};
		return (
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				width={200}
				className={Sghide}
				style={{
					overflow: "auto",
					height: "100vh",
					position: "fixed",
					left: 0,
					top: 0,
					zIndex: 999,
					boxShadow: "0 0 3px 1px rgb(27, 27, 27)",
				}}
			>
				<Menu
					theme="dark"
					mode="vertical"
					onClick={this.renderCurrent}
					selectedKeys={[this.state.current]}
					style={{ height: "100%", borderRight: 0 }}
				>
					<div
						style={{
							background: "#fff",
							borderRadius: 6,
							boxShadow: "0 0 0 1px #333",
							margin: "20px auto 15px auto",
							overflow: "hidden",
							height: 45,
							width: 45,
							textAlign: "center",
						}}
					>
						<img
							alt="logo"
							style={{
								width: 45,
								height: 45,
							}}
							src={campus_logo}
						/>
					</div>
					{routes.map((route, i) => {
						if (route.hide === true) {
							return null;
						}
						if (route.sublist.length === 0) {
							return MenuItem(route, "TopMenu");
						}
						let badge = route.badge ? (
							<img
								alt=""
								className="va_tt"
								style={{ marginLeft: 5 }}
								src={route.badge}
							/>
						) : (
								""
							);
						return (
							<SubMenu
								key={`submenu_${i}`}
								title={
									<span>
										<Iconfont
											style={{
												fontSize: 18,
											}}
											type={route.icon}
										/>
										{!collapsed && route.name} {!collapsed && badge}
									</span>
								}
							>
								{route.sublist.map((_route) => MenuItem(_route))}
							</SubMenu>
						);
					})}
				</Menu>
			</Sider>
		);
	}
}
