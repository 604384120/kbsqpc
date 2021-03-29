module.exports = [
  /*
   * 管理员端路由
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
    path: "/adminPc/overview",
    component: "/other/overview",
    type: "index",
    sublist: [],
  },
  {
    name: "招生营销",
    icon: "icon-zhaosheng",
    sublist: [
      {
        link: "/pc#/activity_create",
        name: "营销活动",
      },
      // {
      //   path: "/adminPc/activity",
      //   name: "营销活动",
      //   component: "/activity/index",
      // },
      {
        path: "/adminPc/promote",
        name: "轻地推",
        component: "/promote/index",
      },
      {
        path: "/adminPc/poster",
        name: "海报传单",
        component: "/poster/index",
      },
      {
        link: "/pc#/survey_index",
        name: "调查问卷",
      },
      {
        link: "/pc#/coupon_index",
        name: "优惠券",
      },
      {
        link:
          "/pc#/temporary?title=分销转介绍&step=【我的】-【招生营销】-【转介绍】&des=通过设置对应的课程与奖励，可让用户主动参与课程的转介绍，帮助机构招生引流",
        name: "转介绍",
      },
      {
        link:
          "/pc#/temporary?title=学员跟进&step=【首页】-【用户学员跟进】&des=对当前咨询，报名，参与活动的学员进行跟进与转化",
        name: "学员跟进",
      },
      {
        link: "/pc#/payment_index",
        name: "报名缴费",
      },
    ],
  },
  {
    name: "课程管理",
    icon: "icon-kecheng",
    sublist: [
      {
        name: "课程列表",
        path: "/adminPc/course",
        component: "/course/list",
      },
      {
        path: "/adminPc/sell",
        name: "课程售卖",
        component: "/sell/list",
      },
    ],
  },
  {
    name: "班级管理",
    icon: "icon-banji",
    sublist: [
      {
        name: "班级列表",
        path:"/adminPc/class",
        component:'/class/list'
      },
      {
        name: "课节详情",
        path:"/adminPc/lesson_detail",
        component:'/class/lessondetail',
        hide:true
      },
      {
        path: "/adminPc/classroom",
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
        name: "课表管理",
        path: "/adminPc/kebiao",
        component: "/kebiao/index",
      },
      {
        name: "学员点名",
        path: "/adminPc/rollcall",
        component: "/rollcall/list",
      },
      {
        path: "/adminPc/comment",
        name: "学员点评",
        component: "/comment/list",
      },
      {
        path: "/adminPc/comment_class_detail",
        name: "点评详情",
        component: "/comment/class_detail",
        hide:true
      },
      {
        path: "/adminPc/homework",
        component: "/homework/list",
        name: "作业系统",
      },
      {
        path: "/adminPc/homework_detail",
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
        path: "/adminPc/scoreManage",
        name: "成绩管理",
        component: "/scoreManage/list",
      },
      {
        path: "/adminPc/scoreManage_detail",
        name: "成绩详情",
        component: "/scoreManage/detail",
        hide:true
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
        path: "/adminPc/notice",
        name: "消息通知",
        component: "/notice/index",
      },
      {
        path: "/adminPc/xcx",
        name: "享学(学员端)",
        component: "/xcx/index",
      },
      {
        path: "/adminPc/clockin",
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
        name: "学员管理",
        path: '/adminPc/student',
        component: '/student/index'
        // link: "/pc#/student_index",
      },
      {
        path: "/adminPc/teacher",
        name: "教师管理",
        component: "/teacher/list",
      },
    ],
  },
  {
    name: "学校管理",
    icon: "icon-jigou",
    sublist: [
      {
        path: "/adminPc/institution",
        name: "学校信息",
        component: "/institution/index",
      },
      {
        path: "/adminPc/mailbox",
        name: "校长信箱",
        component: "/institution/mailbox",
      },
      {
        path: "/adminPc/dynamic",
        name: "校区动态",
        component: "/institution/dynamic",
      },
      // {
      // 	link: "/pc#/inst_index",
      // 	name: "基本信息",
      // },
      {
        link: "/pc#/books_index",
        name: "图书借阅",
      },
      {
        link: "/pc#/inventory_index",
        name: "课材管理",
      },
      {
        path: "/adminPc/campus_set",
        name: "校区设置",
        component: "/campus_set/index",
      },
      // {
      //   link: "/pc#/campus_set",
      //   name: "校区设置",
      // },
      {
        path: "/adminPc/album",
        name: "云相册",
        component: "/album/list",
      },
      {
        path: "/adminPc/invoice",
        name: "发票申请记录",
        hide: true,
        component: "/order/invoice",
      },
      {
        path: "/adminPc/invoiceApply",
        name: "发票申请",
        hide: true,
        component: "/order/invoiceApy",
      },
    ],
  },
  {
    name: "数据魔方",
    icon: "icon-shuju",
    badge:
      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/f83061ae-3b4f-11ea-ac9d-00163e04cc20.png",
    sublist: [
      {
        link: "/pc#/data_cube",
        name: "考勤日报",
      },
      {
        link: "/pc#/points_index",
        name: "积分管理",
      },
      {
        link: "/pc#/data_payrefund",
        name: "缴退费统计",
      },
      {
        link: "/pc#/data_course",
        name: "课消考勤",
      },
      {
        path: "/adminPc/daily",
        name: "日常支出管理",
        component: "/dataBox/daily",
      },
      {
        path: "/adminPc/teacherSalary",
        name: "老师工资",
        component: "/teacherSalary/index",
      },
    ],
  },
  {
    path: "/adminPc/user",
    name: "个人中心",
    hide: true,
    component: "/user/index",
    sublist: [],
  },
  {
    path: "/adminPc/chat",
    name: "在线客服",
    hide: true,
    component: "/other/chat",
    sublist: [],
  },
  {
    path: "/adminPc/404",
    name: "页面不存在",
    type: "404",
    hide: true,
    component: "/other/404",
    sublist: [],
  },
  {
    path: "/adminPc/doc",
    name: "前端API文档",
    hide: true,
    component: "/other/doc",
    sublist: [],
  },
  {
    path: "/adminPc/dva",
    name: "dva",
    hide: true,
    component: "/other/dva",
    sublist: [],
  },
  {
    path: "/adminPc/test",
    name: "test",
    hide: true,
    component: "/other/test",
    sublist: [],
  },
];
