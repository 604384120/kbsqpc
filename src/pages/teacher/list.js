import React from "react";
import { Form as Forms, Divider, Tabs, Tooltip, Icon, Table } from "antd";
import { Method, Page, Form, Inputs, Modals, Btn, TablePagination, Uploadfile } from "../comlibs";
import Add from "./add";
import Detail from "./detail";
import Recruit from "./recruit";
import Notice from "./notice";
import PublicBtn from "./publicBtn";

export default function(props) {
	const $ = new Method();
	const { TabPane } = Tabs;
	let {
		Page_add,
		Page_detail,
		exports,
		tab = { inservice: {}, suspended: {},recruit: {},notice: {} },
    curTabKey = "inservice",
    update_modal,
    stu_upload,
    failue_modal
	} = {};
	const userkindlist = [
		{ text: "全部", value: "" },
		{ text: "普通老师", value: "teacher" },
		{ text: "管理员", value: "admin" }
	];
	const fulltimelist = [
		{ text: "全部", value: "" },
		{ text: "全职", value: "fulltime" },
		{ text: "兼职", value: "partime" }
	];
	const wxuserlist = [
		{ text: "全部", value: "" },
		{ text: "是", value: "YES" },
		{ text: "否", value: "NO" }
	];
	function Toptips() {
		return (
			<Tooltip
				placement="top"
				title="老师是否绑定开班神器微信公众号，绑定后普通老师可接收相关的上课提醒、学员请假提醒，管理员可接收学员报名提醒、课程咨询提醒、活动参与提醒。"
			>
				<Icon type="question-circle" theme="outlined" />
			</Tooltip>
		);
	}

	let columns_ins = [
		{
			title: "序号",
			align: "center",
			dataIndex: "_key"
		},
		{
			title: "姓名",
			align: "center",
			render: rs => (
				<span className="link" onClick={() => Page_detail.open(rs.name, rs.teacher_uuid)}>
					{rs.name}
				</span>
			)
		},
		{
			title: "权限",
			align: "center",
			render: rs => (
				<span>
					<font style={{ color: "#8BD881" }}>{rs.user_kind === "owner" ? "校区校长" : ""}</font>
					<font style={{ color: "#DDAD58" }}>{rs.user_kind === "admin" ? "管理员" : ""}</font>
					<font style={{ color: "#646567" }}>{rs.user_kind === "teacher" ? "普通老师" : ""}</font>
				</span>
			)
		},
		{
			title: "绑定微信",
			align: "left",
			width: 100,
			filterDropdown: true,
			filterIcon: Toptips(),
			render: rs => (
				<span className={rs.wxuser === "YES" ? "fc_green pl_5" : "pl_5"}>
					{rs.wxuser === "YES" ? "已绑定" : "未绑定"}
				</span>
			)
		},
		{
			title: "岗位性质",
			align: "center",
			render: rs => <span>{rs.fulltime === "fulltime" ? "全职" : "兼职"}</span>
		},
		{
			title: "操作",
			align: "center",
			render: (text, rs) => (
				<div>
					<PublicBtn
						type="suspendA"
						name={rs.name}
						uuid={rs.teacher_uuid}
						userkind={rs.user_kind}
						success={() => {
							tab.inservice.reload();
							tab.suspended.api && tab.suspended.reload();
						}}
					/>
					<Divider type="vertical" />
					<PublicBtn
						type="delA"
						name={rs.name}
						uuid={rs.teacher_uuid}
						userkind={rs.user_kind}
						success={() => {
							tab.inservice.reload();
						}}
					/>
				</div>
			)
		}
	];
	let columns_sub = [
		{
			title: "序号",
			align: "center",
			dataIndex: "_key"
		},
		{
			title: "姓名",
			align: "center",
			render: rs => (
				<span className="link" onClick={() => Page_detail.open(rs.name, rs.teacher_uuid)}>
					{rs.name}
				</span>
			)
		},
		{
			title: "绑定微信",
			align: "left",
			width: 100,
			filterDropdown: true,
			filterIcon: Toptips(),
			render: rs => (
				<span className={rs.wxuser === "YES" ? "fc_green pl_5" : "pl_5"}>
					{rs.wxuser === "YES" ? "已绑定" : "未绑定"}
				</span>
			)
		},
		{
			title: "岗位性质",
			align: "center",
			render: rs => <span>{rs.fulltime === "fulltime" ? "全职" : "兼职"}</span>
		},
		{
			title: "操作",
			align: "center",
			render: (text, rs) => (
				<div>
					<PublicBtn
						type="reinstateA"
						name={rs.name}
						uuid={rs.teacher_uuid}
						success={() => {
							tab.inservice.reload();
							tab.suspended.reload();
						}}
					/>
					<Divider type="vertical" />
					<PublicBtn
						type="delA"
						name={rs.name}
						uuid={rs.teacher_uuid}
						success={() => {
							tab.suspended.reload();
						}}
					/>
				</div>
			)
		}
  ];

  let FailueBox=()=>{
    let columns=[
        {
            title:'老师姓名',
            dataIndex:'name',
            align:'center',
            render:rs=>(
                <div style={{minWidth:60}}>{rs}</div>
            )
        },{
            title:'手机号(账号)',
            dataIndex:'phone',
            align:'center',
            render:(rs)=>(
                <div>{rs||'-'}</div>
            )
        },{
          title:'权限',
          dataIndex:'user_kind',
          align:'center',
          render:(rs)=>(
              <div>{rs||'-'}</div>
          )
        },{
            title:'岗位性质',
            dataIndex:'fulltime',
            align:'center',
            render:(rs)=>(
                <div>{rs||'-'}</div>
            )
        },{
          title:'性别',
          dataIndex:'gender',
          align:'center',
          render:(rs)=>(
              <div>{rs||'-'}</div>
          )
        },{
            title:'出生日期',
            dataIndex:'birthday',
            align:'center',
            render:(rs)=>(
                <div>{rs||'-'}</div>
            )
        },{
            title:'入职日期',
            dataIndex:'entryday',
            align:'center',
            render:(rs)=>(
                <div>{rs||'-'}</div>
            )
        },{
            title:'教龄',
            dataIndex:'teachage',
            align:'center',
            render:(rs)=>(
                <div>{rs||'-'}</div>
            )
        },{
            title:'失败原因',
            dataIndex:'reason',
            align:'center',
            render:rs=>(
                <div style={{color:'#EF5E53'}}>{rs}</div>
            )
        }
    ]
    return (
        <Modals width="1200px" ref={ref=>failue_modal=ref}>
            {(data)=>(
                <div>
                    <div className="box box-ac mb_15">
                        <div className="box-1 box box-ac" style={{color:'#f9af36'}}>
                            <div className="circle fc_white mr_5 box box-ac box-pc" style={{width:18,height:18,background:'#f9af36'}}>
                                <Icon type="exclamation" />
                            </div>
                            注意：以下老师导入失败！
                        </div>
                        <Btn onClick={async ()=>{
                            await $.downloadPost('/teacher/import/error',{
                                failue:JSON.stringify(data)
                            })
                        }}>导出失败数据</Btn>
                    </div>
                    <Table dataSource={data} columns={columns}/>
                </div>
            )}
        </Modals>
    )
}
  
  let UpdateBox=()=>{
    return (
      <div style={{padding:'15px 70px 30px',display:'flex',justifyContent:'space-between'}}>
        <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
            <div>下载老师基本信息模板</div>
            <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                <div className="mb_10">
                    <a className="link mr_5" onClick={()=>{
                        $.download('/teacher/export/fields',{
                            campus_uuid:$.campus_uuid(),
                            token:$.token()
                        })
                    }} download="学员基本信息模版">点击下载</a>
                    <span>老师信息模板</span>
                </div>
            </div>
            <div className="ta_c fs_12 fc_black5">下载对应模板，阅读注意点后填写模板文件，模板表头不可删，老师姓名、联系电话、权限和岗位性质为必填项</div>
        </div>
        
        <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
            <div>上传名单文件</div>
            <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                <div className="mb_10">
                    <span className="link mr_5" onClick={()=>{
                        stu_upload.open()
                    }}>点击上传</span>
                    <span>老师基本信息名单</span>
                </div>
            </div>
            <div className="ta_c fs_12 fc_black5">将老师基本信息名单按照模板格式填写，完成编辑后上传</div>
        </div>
      </div>
    )
}

	return (
		<div className="bs ph_10 mt_15 bg_white">
			<Tabs defaultActiveKey={curTabKey} onChange={key => curTabKey === key}>
				<TabPane tab="在职老师" key="inservice">
					<Form onSubmit={values => tab.inservice.search(values)}>
						{({ form }) => (
							<div className="mb_15">
								<Inputs
									width={120}
									className="mr_10"
									name="user_kind"
									placeholder="全部权限"
									form={form}
									select={userkindlist}
									autoSubmit={true}
								/>
								<Inputs
									width={120}
									className="mr_10"
									name="fulltime"
									placeholder="全部岗位"
									form={form}
									select={fulltimelist}
									autoSubmit={true}
								/>
								<Inputs
									width={120}
									className="mr_10"
									name="wxuser"
									placeholder="绑定微信"
									form={form}
									select={wxuserlist}
									autoSubmit={true}
								/>
								<Inputs form={form} name="name" className="mr_10" placeholder="请输入老师名称" />
								<Btn htmlType="submit" icon="search">
									搜索
								</Btn>
								<div className="fl_r">
									<Btn className="mr_10" onClick={rs => Page_add.open("添加老师")}>
										添加老师
									</Btn>
                  <Btn className="mr_10" onClick={() => update_modal.open("导入老师")}>导入老师</Btn>
									<Btn onClick={() => exports.open("导出老师", {})}>导出老师</Btn>
								</div>
							</div>
						)}
					</Form>
					<TablePagination
						api="/teacher/list"
						columns={columns_ins}
						params={{
							status: "INSERVICE",
							limit: 1000,
							totalnum: "NO"
						}}
						ref={ref => (tab.inservice = ref)}
					/>
				</TabPane>
				<TabPane tab="离职老师" key="suspended">
					<Form onSubmit={values => tab.suspended.search(values)}>
						{({ form }) => (
							<div className="mb_15">
								<Inputs form={form} name="name" className="mr_10" placeholder="请输入老师名称" />
								<Btn htmlType="submit" icon="search">
									搜索
								</Btn>
							</div>
						)}
					</Form>
					<TablePagination
						api="/teacher/list"
						columns={columns_sub}
						params={{
							status: "SUSPENDED",
							limit: 1000,
							totalnum: "NO"
						}}
						ref={ref => (tab.suspended = ref)}
					/>
				</TabPane>
				<TabPane tab="老师招聘" key="recruit">
					<Recruit />
				</TabPane>
				<TabPane tab="老师消息通知" key="notice">
					<Notice />
				</TabPane>
			</Tabs>
			<Page ref={rs => (Page_add = rs)} onClose={() => tab[curTabKey].init()}>
				<Add />
			</Page>
			<Page
				ref={rs => (Page_detail = rs)}
				onClose={() => {
					tab.inservice.reload();
					tab.suspended.api && tab.suspended.reload();
				}}
			>
				<Detail />
			</Page>
			<Modals {...props} ref={rs => (exports = rs)}>
				<Form
					onSubmit={async values => {
						let r = await $.download("/campus/export/teacher", {
							verifycode: values.verifycode
						});
						exports.close();
						return r;
					}}
				>
					{({ form, set }) => (
						<div>
							<Forms.Item labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="验证码">
								<Inputs form={form} name="verifycode" required={true} />
								<Btn
									className="ml_10 mt_5"
									onClick={async rs => {
										let r = await $.post("/approval/verifycode", {
											permission: "EXPORT_TEACHER"
										});
										$.confirm(
											`验证码已发送至校区校长手机 [${r.phone}]，请联系校区校长索取！`,
											async () => {}
										);
										return r;
									}}
								>
									获取验证码
								</Btn>
							</Forms.Item>
							<div className="ta_c mt_15">
								<Btn htmlType="submit">开始导出</Btn>
							</div>
						</div>
					)}
				</Form>
			</Modals>
      <Modals width="950px" bodyStyle={{padding:0}} ref={ref=>update_modal=ref}>
        <UpdateBox/>
      </Modals>
      <FailueBox/>
      <Uploadfile
        zIndex={1200}
        action="/teacher/import/fields"
        multiple={false}
        ref={ref => (stu_upload = ref)}
        onSure={rs => {
          if(rs.status==='failure'){
              $.warning(rs.message)
          }else{
            if(rs.data.failue_count){
              failue_modal.open('注意',rs.data.failue)
            }else{
              $.msg('导入老师成功！')
            }
            if(rs.data.success_count)tab.inservice.reload()
            update_modal.close()
          }
        }}
      />
		</div>
	);
}
