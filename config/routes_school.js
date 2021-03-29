module.exports = [
	/*
	 * 学校端路由
	 * path: 路由浏览器地址
	 * name: 路由中文名
	 * icon: 路由图标，详情：https://ant.design/components/icon-cn/
	 * component: 根目录pages目录下路由文件地址
	 * sublist： 伪二级路由，对应为左侧主菜单的子菜单，注意：当没有子菜单时值必须为空数组
	 * type: 路由类型，暂时只支持设置index、404
	 */
	{
		name: "学校管理",
		icon: "home",
		sublist: [
			{
				path: "/school/detail",
				name: "基本信息",
				type: "index",
				title: "课袋学校端管理后台",
				component: "/school/detail",
			},
			{
				path: "/school/teacher",
				name: "教师管理",
				component: "/teacher/list",
			},
			// {
			// 	path: "/school/admTeacher",
			// 	name: "行政班教师",
			// 	component: "/teacher/admList",
			// },
			{
				path: "/school/report",
				name: "报表下载",
				component: "/school/report",
			},
		],
	},
	{
		name: "学员管理",
		icon: "team",
		sublist: [
			{
				path: "/school/studentlist",
				name: "学员列表",
				component: "/student/lists",
			},
			{
				path: "/school/admclass",
				name: "行政班管理",
				component: "/admclass/list",
			},
		],
	},
	{
		name: "课程管理",
		icon: "book",
		sublist: [
			{
				path: "/school/courseschool",
				name: "校内课程",
				component: "/course/school",
			},
			{
				path: "/school/courseclass",
				name: "校内课程班",
				component: "/courseclass/list",
			},
			{
				path: "/school/courseenroll",
				name: "报名管理",
				component: "/course/enroll",
			},
			// {
			// 	path: "/school/coursedepot",
			// 	name: "课程库",
			// 	component: "/course/depot",
			// },
			// {
			// 	path: "/school/courseadopt",
			// 	name: "预采购课程",
			// 	component: "/course/adopt"
			// }
		],
	},
	{
		name: "运营相关",
		icon: "monitor",
		sublist: [
			{
				path: "/school/operaterollcall",
				name: "上课点名",
				component: "/operate/rollcall",
			},
			{
				path: "/school/operatecomment",
				name: "点评学员",
				component: "/operate/comment",
			},
			{
				path: "/school/operateevateacher",
				name: "评价老师",
				component: "/operate/evateacher",
			},
			{
				path: "/school/group",
				name: "校园圈子",
				component: "/school/group",
			},
			// {
			// 	path: "/school/clock",
			// 	name: "健康打卡",
			// 	component: "/clock/list"
			// }
		],
	},
	{
		path: "/school/404",
		name: "页面不存在",
		type: "404",
		hide: true,
		component: "/other/404",
		sublist: [],
	},
];
