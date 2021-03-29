import React from "react";
import { Typography, Divider, Anchor } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
const { Link } = Anchor;
const { Title, Paragraph } = Typography;

export default function(props) {
	let t = " [必须]";
	let f = " [非必须]";
	let s = " [需求决定]";
	return (
		<Typography className="CUSTOM_doc mt_15">
			<Title level={2}>相关资料</Title>
			<Paragraph>
				<ul>
					<li>
						<a rel="noopener noreferrer" target="_blank" href="https://zh-hans.reactjs.org/docs/getting-started.html">
							react官网文档
						</a>
					</li>
					<li>
						<a rel="noopener noreferrer" target="_blank" href="https://www.reactjscn.com/docs/hello-world.html">
							react中文文档
						</a>
					</li>
					<li>
						<a rel="noopener noreferrer" target="_blank" href="https://ant.design/docs/react/introduce-cn">
							react-ant官网文档
						</a>
					</li>
				</ul>
			</Paragraph>
			<Divider />
			<Title>组成</Title>
			<Paragraph>
				本文档组成部分为：项目路由文档、全局css类文档、工具方法库文档、基础标签文档、基础功能组件文档、通用业务组件文档
			</Paragraph>
			<Paragraph className="CUSTOM_anchor">
				<Anchor className="bs bg_white_95 zidx_9999 pv_10 CUSTOM_scroll">
					<Link href="#API" title="项目路由">
						<Link className="dis_ib" href="#_doc_Routes" title="路由类型" />
						<Link className="dis_ib" href="#_doc_Routes" title="路由配置" />
					</Link>
					<Link href="#API" title="全局css类">
						<Link className="dis_ib" href="#Anchor-Props" title="Anchor Props" />
						<Link className="dis_ib" href="#Link-Props" title="Link Props" />
					</Link>
					<Link href="#API" title="工具方法库">
						<Link className="dis_ib" href="#Anchor-Props" title="Anchor Props" />
						<Link className="dis_ib" href="#Link-Props" title="Link Props" />
					</Link>
					<Link href="#API" title="基础标签">
						<Link className="dis_ib" href="#Anchor-Props" title="Anchor Props" />
						<Link className="dis_ib" href="#Link-Props" title="Link Props" />
					</Link>
					<Link href="#API" title="基础功能组件">
						<Link className="dis_ib" href="#Anchor-Props" title="Anchor Props" />
						<Link className="dis_ib" href="#Link-Props" title="Link Props" />
					</Link>
					<Link href="#API" title="通用业务组件">
						<Link className="dis_ib" href="#Anchor-Props" title="Anchor Props" />
						<Link className="dis_ib" href="#Link-Props" title="Link Props" />
					</Link>
				</Anchor>
			</Paragraph>
			<Divider />
			<Title id="_doc_Routes">路由(Routes)</Title>
			<Paragraph>
				路由配置文件位于<code>config</code>目录下，
				目前路由分为两个端：管理员端（routes_adminPc.js）、老师端（routes_teacherPc.js），如果某个功能页面只有管理员才能操作，
				那就只在routes_adminPc.js里配置相关路由即可，<b>如果两个端都需要有则均需配置。</b>
				<br />
				<b>目前路由只支持二级菜单，分为主菜单和子菜单。</b>
			</Paragraph>
			<Title level={2}>路由配置</Title>
			<Paragraph>
				<SyntaxHighlighter language="javascript" style={dark}>
					{`
						{
							path: "/adminPc/doc",  //浏览器地址${t}
							name: "前端API文档",  //页面副标题${t}
							icon: "icon-doc", //菜单图标，一级菜单必须设置，子菜单无需设置${s}
							hide: true,  //是否在左侧主菜单里展示${f}
							component: "/other/doc",  //pages目录下页面js文件相对路径，无需加.js后缀${t}
							sublist: [ //子菜单项，当没有子菜单时值必须为空数组${s}
								{
									path: "/adminPc/cd1",
									name: "子菜单1",
									component: "/other/cd1"
								},
								{
									path: "/adminPc/cd2",
									name: "子菜单2",
									component: "/other/cd2"
								}
							] 
						}
					`}
				</SyntaxHighlighter>
			</Paragraph>
			<Divider />
			<Title id="_doc_Css">全局css类(Css)</Title>
			<Paragraph>
				全局css类文件位于<code>common/style</code>目录下，
				目前全局css类文件规划为4种：管理员端（routes_adminPc.js）、老师端（routes_teacherPc.js），如果某个功能页面只有管理员才能操作，
				那就只在routes_adminPc.js里配置相关路由即可，<b>如果两个端都需要有则均需配置。</b>
				<br />
				<b>目前路由只支持二级菜单，分为主菜单和子菜单。</b>
			</Paragraph>
		</Typography>
	);
}
