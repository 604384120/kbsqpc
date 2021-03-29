module.exports = [
	/*
	 * 老师端路由
	 * path: 路由浏览器地址
	 * name: 路由中文名
	 * icon: 路由图标，详情：https://ant.design/components/icon-cn/
	 * component: 根目录pages目录下路由文件地址
	 * sublist： 伪二级路由，对应为左侧主菜单的子菜单，注意：当没有子菜单时值必须为空数组
	 * type: 路由类型，暂时只支持设置index、404
	 */
	{
		name: "概览",
		icon: "icon-gailan",
		path: "/teacherPc/overview",
		component: "/other/overview",
		type: "index",
		sublist: [],
	},
	{
		name: "招生营销",
		icon: "icon-zhaosheng",
		sublist: [
			{
				path: "/teacherPc/promote",
				name: "轻地推",
				component: "/promote/index",
				hide:true
			},
			{
				path: "/teacherPc/poster",
				name: "海报传单",
				component: "/poster/index",
			},
		],
	},
	{
		name: "班级管理",
		icon: "icon-banji",
		sublist: [
			{
				path:"/teacherPc/class",
				component:'/class/list',
				name: "班级列表",
				// link: "/pc#/class2_index",
			},
			{
				path: "/teacherPc/classroom",
				name: "教室管理",
				component: "/classroom/list",
			},
		],
	},
	{
		name: "教学中心",
		icon: "icon-jiaoxue",
		sublist: [
			{
				name: "学员点名",
				path: "/teacherPc/rollcall",
				component: "/rollcall/list",
			},
			{
				path: "/teacherPc/homework",
				component: "/homework/list",
				name: "作业系统",
			},
			{
				path: "/teacherPc/homework_detail",
				component: "/homework/detail",
				name: "作业详情",
				hide:true
			},
			{
				link: "/pc#/card_index",
				name: "约课管理",
			},
			{
				link: "/pc#/abnormal_index",
				name: "缺勤记录",
			},
			{
				link: "/pc#/abnormal_makeup",
				name: "补课安排",
			},
			{
				path: "/teacherPc/scoreManage",
				name: "成绩管理",
				component: "/scoreManage/list",
			},
		],
	},
	{
		name: "家校互动",
		icon: "icon-jiaxiao",
		badge:
			"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/ec1e3c42-3b4f-11ea-ac9d-00163e04cc20.png",
		sublist: [
			{
				path: "/teacherPc/clockin",
				name: "学习打卡",
				component: "/clockin/list",
			},
		],
	},
	{
		name: "人员管理",
		icon: "icon-renyuan",
		sublist: [
			{
				path:'/teacherPc/student',
				component:'/student/index',
				name: "学员管理",
			},
		],
	},
	{
		name: "学校管理",
		icon: "icon-jigou",
		sublist: [
			{
				link: "/pc#/books_index",
				name: "图书借阅",
			},
			{
				path: "/teacherPc/album",
				name: "云相册",
				component: "/album/list",
			},
		],
	},
	{
		path: "/teacherPc/user",
		name: "个人中心",
		hide: true,
		component: "/user/index",
		sublist: [],
	},
	{
		path: "/teacherPc/chat",
		name: "在线客服",
		hide: true,
		component: "/other/chat",
		sublist: [],
	},
	{
		path: "/teacherPc/404",
		name: "页面不存在",
		type: "404",
		hide: true,
		component: "/other/404",
		sublist: [],
	},
	{
		path: "/teacherPc/test",
		name: "test",
		hide: true,
		component: "/other/test",
		sublist: [],
	},
];
