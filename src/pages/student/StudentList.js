import React,{useState,useEffect} from 'react'
import {Tooltip,Button,Dropdown,Menu,Checkbox,Modal,Alert,Radio,Tabs,Table,Icon } from 'antd'
import {$,TablePagination,Form,Inputs,Btn,Modals,Uploadimgs,Uploadfile} from '../comlibs'
import {Grades,SelectTeam} from '../works'

export default function(props){
    let {TabPane}=Tabs
    let {type,getCount}=props
    let GlobalData = $.store().GlobalData;
    let {failue_modal,lesfailue_modal,lesson_upload,stu_upload,table,set_modal,grades_modal,show,setShow,col,setCol,add_modal,update_modal,out_modal,addTeam_modal,team_modal,campus_obj = JSON.parse(localStorage.campus_obj)}={}
    let sets=[
        {label:'就读学校',key:'school'},
        {label:'年级',key:'studygrade'},
        {label:'学号',key:'studentid'},
        {label:'身份证号',key:'identitycard'},
        {label:'英文名',key:'englishname'},
        {label:'住址',key:'address'},
        {label:'等级级别',key:'grade'},
        {label:'身高(CM)',key:'height'},
        {label:'体重(KG)',key:'weight'},
    ]
    let getCol=async ()=>{
        show=await $.get('/campusstudent/fields/user/show')
        let columns=[
            {
                title:'序号',
                dataIndex:'_key',
                fixed:false
            },
            {
                title:'学员姓名',
                key:'name',
                fixed:false,
                render:rs=>(
                    <div style={{minWidth:150}}>
                        <a className="link" target="_blank" href={`/pc#/student_detail?uuid=${rs.student_uuid}`}>{rs.name}</a>
                    </div>
                )
            },
            {
                title:'性别',
                width:'60px',
                key:'gender',
                render:rs=>{
                    if(!rs.gender){
                        return <div>-</div>
                    }
                    return (
                        <div>{rs.gender==='male'?<span style={{color:'#8BD881'}}>男</span>:<span style={{color:'#DDAD58'}}>女</span>}</div>
                    )
                }
            },
            {
                title:'出生日期',
                key:'birthday',
                width:'110px',
                render:rs=>(
                    <div>{rs.birthday||'-'}</div>
                ),
                sorter: true,
                sortDirections:['ascend', 'descend','ascend']
            },
            {
                title:()=>(
                    <div className="ta_r" style={{paddingRight:32}}>年龄</div>
                ),
                width:'100px',
                align:'right',
                key:'age',
                render:rs=>(
                    <div style={{paddingRight:32}}>{rs.age||rs.age===0?rs.age+'岁':'-'}</div>
                ),
            }
        ]
        if(show['school']==='YES'){
            columns.push({
                title:'就读学校',
                key:'school',
                render:rs=>(
                    <div style={{minWidth:200}}>{rs.school||'-'}</div>
                ),
            })
        }
        if(show['studygrade']==='YES'){
            columns.push({
                title:'年级',
                key:'studygrade',
                width:'80px',
                render:rs=>(
                    <div>{rs.studygrade_name||'-'}</div>
                ),
                sorter: true,
                sortDirections:['ascend', 'descend','ascend']
            })
        }
        if(show['studentid']==='YES'){
            columns.push({
                title:'学号',
                width:'60px',
                key:'studentid',
                render:rs=>(
                    <div>{rs.studentid||'-'}</div>
                ),
            })
        }
        if(show['identitycard']==='YES'){
            columns.push({
                title:'身份证号',
                key:'identitycard',
                width:'200px',
                render:rs=>(
                    <div>{rs.identitycard||'-'}</div>
                ),
            })
        }
        if(show['englishname']==='YES'){
            columns.push({
                title:'英文名',
                key:'englishname',
                render:rs=>(
                    <div style={{minWidth:70}}>{rs.englishname||'-'}</div>
                ),
            })
        }
        if(show['address']==='YES'){
            columns.push({
                title:'住址',
                key:'address',
                render:rs=>(
                    <div style={{minWidth:200}}>{rs.address||'-'}</div>
                ),
            })
        }
        if(show['grade']==='YES'){
            columns.push({
                title:'等级级别',
                key:'grade',
                render:rs=>(
                    <div style={{minWidth:80}}>{rs.grade||'-'}</div>
                ),
            })
        }
        if(show['height']==='YES'){
            columns.push({
                title:'身高(CM)',
                width:'80px',
                key:'height',
                render:rs=>(
                    <div>{rs.height?rs.height:'-'}</div>
                ),
            })
        }
        if(show['weight']==='YES'){
            columns.push({
                title:'体重(KG)',
                width:'80px',
                key:'weight',
                render:rs=>(
                    <div>{rs.weight?rs.weight:'-'}</div>
                ),
            })
        }
        if(type!=='intentional'){
            columns.push({
                title:(
                    <div>
                        <span className="mr_3">是否绑定微信号</span>
                        <Tooltip placement="topRight" title={(
                            <div className="fs_12">
                                学员默认联系人是否绑定机构微信公众号
                            </div>
                            )}>
                            <img style={{width:12,height:12,verticalAlign:'text-top'}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/3d75055c-6b18-11e9-9a54-00163e04cc20.png"/>
                        </Tooltip>
                    </div>
                    ),
                key:'gzh_bind',
                width:'130px',
                align:'center',
                render:rs=>(
                    <div>{rs.gzh_bind==='YES'?<span >是</span>:<span style={{color:'#999A9E'}}>否</span>}</div>
                ),
            })
        }else{
            columns.push({
                title:'最后跟进日期',
                key:'time_update',
                render:rs=>(
                    <div>{rs.time_update||'-'}</div>
                ),
            })
        }
        columns.push({
            title:'操作',
            align:'center',
            fixed:'right',
            width:80,
            key:'edit',
            render:rs=>(
                <div className={campus_obj.user_kind&&"fc_err pointer hover_line"} onClick={()=>{
                    Modal.confirm({
                        title: '注意',
                        content: `确定要删除学员 [${rs.name}]吗？`,
                        okText: '确定',
                        okType: 'primary',
                        cancelText: '取消',
                        onOk(e) {
                          return new Promise(async (resolve, reject) => {
                            setTimeout(resolve, 100);
                            await $.get(`/campusstudent/${rs.student_uuid}/remove`);
                            table.reload();
                            getCount();
                          }).catch(() => console.log('Oops errors!'));
                        },
                      });
                }}>删除</div>
            ),
        })
        setShow(show)
        setCol(columns)
    }

    let ButtonBox=()=>{
        [show,setShow]=useState({})
        return (
            <div>
             
                <div className="dis_ib">
                    <Dropdown trigger={['click']} overlay={(
                        <Menu>
                            <Menu.Item>
                                <a onClick={()=>{
                                    add_modal.open('添加学员')
                                }}>
                                    添加学员
                                </a>
                            </Menu.Item>
                                <Menu.Item>
                                    <a onClick={()=>{
                                        update_modal.open('学员导入')
                                    }}>
                                        导入学员
                                    </a>
                                </Menu.Item>
                            <Menu.Item>
                                <a onClick={()=>{
                                    out_modal.open('导出课时信息','lesson')
                                }}>
                                    导出课时信息
                                </a>
                            </Menu.Item>
                            <Menu.Item>
                                <a onClick={()=>{
                                    out_modal.open('导出基本信息','info')
                                }}>
                                    导出基本信息
                                </a>
                            </Menu.Item>
                        </Menu>
                    )}>
                        <Button className="mr_8" type="primary" style={{width:110}}>添加学员</Button>
                    </Dropdown>
                    <Dropdown trigger={['click']} overlay={(
                        <Menu>
                            <Menu.Item>
                                <a onClick={()=>{
                                    let uuids=Object.values(table.selectedRowObjs).map(o=>o.student_uuid).join(',')
                                    if(!uuids){
                                        $.warning('请选择学员后再操作!')
                                        return
                                    }
                                    Modal.confirm({
                                        title: '注意',
                                        content: `确定要删除这些学员吗？`,
                                        okText: '确定',
                                        okType: 'danger',
                                        cancelText: '取消',
                                        async onOk(){
                                            let res=await $.post('/campusstudent/batch/delete/student',{
                                                student_uuids:uuids
                                            })
                                            Modal.info({
                                                title:'结果',
                                                content:res.failue?`本次成功删除学员${res.success}名，${res.failue}名学员删除失败，请逐个进行删除。`:`成功删除学员${res.success}名!`
                                            })
                                            table.reload()
                                            table.delSelectionAll()
                                            getCount()
                                        }
                                    })
                                }}>
                                    批量删除
                                </a>
                            </Menu.Item>
                            <Menu.Item>
                                <a onClick={()=>{
                                    let uuids=Object.values(table.selectedRowObjs).map(o=>o.student_uuid).join(',')
                                    if(!uuids){
                                        $.warning('请选择学员后再操作!')
                                        return
                                    }
                                    team_modal.open('选择分组',uuids)
                                }}>
                                    批量分组
                                </a>
                            </Menu.Item>
                            <Menu.Item>
                                <a onClick={()=>{
                                    grades_modal.open('年级升级','inc')
                                }}>
                                    批量升年级
                                </a>
                            </Menu.Item>
                            <Menu.Item>
                                <a onClick={()=>{
                                    grades_modal.open('年级降级','down')
                                }}>
                                    批量降年级
                                </a>
                            </Menu.Item>
                        </Menu>
                    )} placement="bottomLeft">
                        <Button className="mr_8" type="primary">批量操作</Button>
                    </Dropdown>
                    <Btn className="mr_8" onClick={async ()=>{
                        let res=await $.get('/campusstudent/fields/display')
                        set_modal.open('设置学员基本信息字段',res)
                    }}>设置</Btn>
                </div>
            <Dropdown trigger={['click']} overlay={(
                    <Form 
                        method="post"
                        action="/campusstudent/reveal/fields"
                        valueReturn={val=>{
                            let params={}
                            sets.forEach(s=>{
                                if(val.list.some(o=>o===s.key)){
                                    params[s.key]='YES'
                                    return
                                }
                                params[s.key]='NO'
                            })
                            return params
                        }}
                        success={()=>{
                            $.msg('设置成功！')
                            getCol()
                        }}
                        >
                        {({form,submit,set})=>{
                            let options = [];
                            sets.forEach(o=>{
                                if(show[o.key])options.push({label:o.label,value:o.key,checked:show[o.key]==='YES'?true:false})
                            })
                            options=options.concat([
                                {label:'性别',value:'gender',disabled:true,checked:true},
                                {label:'出生日期',value:'birthday',disabled:true,checked:true},
                                {label:'年龄',value:'age',disabled:true,checked:true},
                            ])
                            let value=options.filter(o=>o.checked).map(o=>o.value)
                            return (
                                <div className="bg_white b_1 br_4" style={{width:150}}>
                                    <div className="pall_10 bb_1">
                                    {set(
                                    {
                                        name: "list",
                                        value
                                    },()=>(
                                        <Checkbox.Group className="box box-ver box-ps">
                                            {
                                                options.map(o=>(
                                                    <div className="mb_6" key={o.value}>
                                                        <Checkbox value={o.value} disabled={o.disabled} checked={true}>{o.label}</Checkbox>
                                                    </div>
                                                ))
                                            }
                                        </Checkbox.Group>
                                    ))}
                                    </div>
                                    <div className="box pall_10">
                                        <Btn onClick={e=>submit(e)} style={{width:'100%'}}>确定</Btn>
                                    </div>
                                </div>
                            )
                        }}
                    </Form>
                )} placement="bottomRight">
                    <Button>+显示列</Button>
                </Dropdown>
        </div>
        )
    }
    
    let TableBox=()=>{
        [col,setCol]=useState([])
        useEffect(()=>{getCol()},[])
        return (
            <TablePagination
                rowSelection={true}
                ref={ref=>table=ref}
                params={{identity:type}}
                api="/campusstudent/screen"
                columns={col}
                onSorter={(sort)=>{
                    console.log(sort)
                    if(!sort.order)return {sortfield:'',sequence:''}
                    let params={
                        sortfield:sort.columnKey,
                        sequence:sort.order==="descend"?-1:1
                    }
                    return params
                }}
            />
        )
    }
    let AvatarBox=(props)=>{
        let [avatar,setAvatar]=useState('https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/avatar.png')
        let {valSet}=props
        let {uploadimgs}={}
        return (
            <div style={{width:'40%'}} className="box box-ver box-ac box-pc">
                <div style={{marginLeft:70}}>
                    <img style={{width:100,height:100}} className="circle" src={avatar}/>
                </div>
                <div style={{marginLeft:70}} className="fs_12 link mt_10">
                    <span onClick={()=>{
                        uploadimgs.open()
                    }}>点击上传头像</span>
                </div>
                <Uploadimgs
					multiple={false}
					prefix='user/avatar/'
					ref={e => (uploadimgs = e)}
					onSure={cover => {
                        valSet(cover)
                        setAvatar(cover)
					}}
				/>
            </div>
        )
    }
    // 课时导入失败弹窗
    let LesFailueBox=()=>{
        let columns=[
            {
                title:()=><span style={{color:'#EF5E53'}}>学员名*</span>,
                dataIndex:'studentname',
                align:'center',
                render:rs=>(
                    <div style={{minWidth:80}}>{rs}</div>
                )
            },{
                title:()=><span style={{color:'#EF5E53'}}>联系电话*</span>,
                dataIndex:'phone',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'联系人',
                dataIndex:'contact',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'缴费日期',
                dataIndex:'paytime',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'支付方法',
                dataIndex:'channel',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'支付金额',
                dataIndex:'fee',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==='0'?rs:'-'}</div>
                )
            },{
                title:'购买课程',
                dataIndex:'coursename',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==='0'?rs:'-'}</div>
                )
            },{
                title:'购买总课时数',
                dataIndex:'points',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==='0'?rs:'-'}</div>
                )
            },{
                title:'赠送课时数',
                dataIndex:'giftlessons',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==='0'?rs:'-'}</div>
                )
            },{
                title:'已消课时数',
                dataIndex:'consumedlessons',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==='0'?rs:'-'}</div>
                )
            },{
                title:'新增积分',
                dataIndex:'height',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==0?rs:'-'}</div>
                )
            },{
                title:'缴费备注',
                dataIndex:'memo',
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
            <Modals width="1200px" ref={ref=>lesfailue_modal=ref}>
                {(data)=>(
                    <div>
                        <div className="box box-ac mb_15">
                            <div className="box-1 box box-ac" style={{color:'#f9af36'}}>
                                <div className="circle fc_white mr_5 box box-ac box-pc" style={{width:18,height:18,background:'#f9af36'}}>
                                    <Icon type="exclamation" />
                                </div>
                                注意：以下课时导入失败！
                            </div>
                            <Btn onClick={async ()=>{
                                await $.downloadPost('/finance/export/errormsg',{
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
    let FailueBox=()=>{
        let columns=[
            {
                title:'姓名',
                dataIndex:'name',
                align:'center',
                render:rs=>(
                    <div style={{minWidth:60}}>{rs}</div>
                )
            },{
                title:'联系电话',
                dataIndex:'phone',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'联系人',
                dataIndex:'contact',
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
                title:'就读学校',
                dataIndex:'school',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'年级',
                dataIndex:'studygrade',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'学号',
                dataIndex:'studentid',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'身份证号',
                dataIndex:'identitycard',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'住址',
                dataIndex:'address',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'身高CM',
                dataIndex:'height',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==0?rs:'-'}</div>
                )
            },{
                title:'体重KG',
                dataIndex:'weight',
                align:'center',
                render:(rs)=>(
                    <div>{rs||rs==0?rs:'-'}</div>
                )
            },{
                title:'英文名',
                dataIndex:'englishname',
                align:'center',
                render:(rs)=>(
                    <div>{rs||'-'}</div>
                )
            },{
                title:'等级级别',
                dataIndex:'grade',
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
                                注意：以下学员导入失败！
                            </div>
                            <Btn onClick={async ()=>{
                                await $.downloadPost('/campusstudent/export/errormsg',{
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
            <Tabs animated={false} defaultActiveKey='student' renderTabBar={(props, DefaultTabBar)=>
                (
                    <DefaultTabBar {...props} style={{padding:'0 20px',borderBottom:'1px solid #e6e6e6' }} />
                )
            }>
                <TabPane tab="导入基本信息" key="student" style={{padding:'15px 70px 30px',display:'flex',justifyContent:'space-between'}}>
                    <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
                        <div>下载学员基本信息模板</div>
                        <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                            <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                            <div className="mb_10">
                                <a className="link mr_5" onClick={()=>{
                                    $.download('/campusstudent/export/fields',{
                                        campus_uuid:$.campus_uuid(),
                                        token:$.token()
                                    })
                                }} download="学员基本信息模版">点击下载</a>
                                <span>学员信息模板</span>
                            </div>
                        </div>
                        <div className="ta_c fs_12 fc_black5">下载对应模板，阅读注意点后填写模板文件，模板表头不可删，学员姓名、联系电话为必填项</div>
                    </div>
                    
                    <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
                        <div>上传名单文件</div>
                        <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                            <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                            <div className="mb_10">
                                <span className="link mr_5" onClick={()=>{
                                    stu_upload.open()
                                }}>点击上传</span>
                                <span>学员基本信息名单</span>
                            </div>
                        </div>
                        <div className="ta_c fs_12 fc_black5">将学员基本信息名单按照模板格式填写，完成编辑后上传</div>
                    </div>

                </TabPane>
                <TabPane tab="导入课时信息" key="lesson" style={{padding:'15px 70px 30px',display:'flex',justifyContent:'space-between'}}>
                    <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
                        <div>下载学员课时信息模板</div>
                        <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                            <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                            <div className="mb_10">
                                <a className="link mr_5" href="https://sxzmedia.oss-cn-shanghai.aliyuncs.com/files/%E5%AD%A6%E5%91%98%E8%AF%BE%E6%97%B6%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx?v=1001">点击下载</a>
                                <span>学员课时信息模版</span>
                            </div>
                        </div>
                        <div className="ta_c fs_12 fc_black5">下载对应模板，阅读注意点后填写模板文件，模板表头不可删，学员姓名、联系电话为必填项</div>
                    </div>
                    
                    <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
                        <div>上传名单文件</div>
                        <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                            <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                            <div className="mb_10">
                                <span className="link mr_5" onClick={()=>{
                                    lesson_upload.open()
                                }}>点击上传</span>
                                <span>学员课时信息名单</span>
                            </div>
                        </div>
                        <div className="ta_c fs_12 fc_black5">将学员课时信息名单按照模板格式填写，完成编辑后上传</div>
                    </div>

                </TabPane>
            </Tabs>
        )
    }

    // 分组弹窗
    function GroupModal(){
        let {select_ref}={}
        return (
            <div>
                <Modals ref={ref=>{team_modal=ref}} bodyStyle={{padding:'20px 0px'}}>       
                    {(uuids)=>(
                        <Form 
                            action="/campusstudent/teams/add"
                            params={{student_uuids:uuids}}
                            method="post"
                            success={(res,e)=>{
                                e.btn.loading=false
                                $.msg('分组成功！')
                                team_modal.close()
                            }}>
                            {({form,submit})=>(
                                <div className="ta_c">
                                    <div className="box box-ac box-pc mb_30">
                                        <SelectTeam ref={ref=>select_ref=ref} className="mr_10" form={form}/>
                                        <span className="link" onClick={()=>addTeam_modal.open('创建新组')}>+添加新组</span>
                                    </div>
                                    <Btn onClick={(e)=>submit(e)} style={{width:70}}/>
                                </div>
                            )}
                        </Form>
                    )}                 
                </Modals>

                <Modals ref={ref=>{addTeam_modal=ref}} bodyStyle={{padding:'20px 30px'}}>                        
                    <Form
                        action="/campusstudent/teams/create"
                        method="post"
                        success={(res,e)=>{
                            e.btn.loading=false
                            select_ref.reload()
                            $.msg('新组创建成功！')
                            addTeam_modal.close()
                        }}
                        >
                        {({form,submit})=>(
                            <div className="ta_c">
                                <div className="box box-ac box-pc mb_30">
                                    <div className="mr_10">新组名称</div>
                                    <Inputs name="name" form={form} placeholder="输入组名" />
                                </div>
                                <Btn onClick={e=>submit(e)} style={{width:70}}/>
                            </div>
                        )}
                    </Form>
                </Modals>
            </div>
        )
    }

    function GradesChangeBox(){
        let list1=[
            '学龄前',
            '小班',
            '中班',
            '大班',
        ]
        let list2=[
            '一年级',
            '二年级',
            '三年级',
            '四年级',
            '五年级',
            '六年级',
        ]
        let list3=[
            '七年级',
            '八年级',
            '九年级',
        ]
        let list4=[
            "高一",
            "高二",
            "高三"
        ]
        return (
            <Modals bodyStyle={{padding:0}} ref={ref=>grades_modal=ref}>
                {(type)=>(
                    <Form
                        action="/campusstudent/studygrade/batchupdate"
                        method='post'
                        valueReturn={val=>{
                            let info={}
                            Object.keys(val).forEach(key=>{
                                if(val[key]||val[key]===0){
                                    info[key]=val[key].toString()
                                }
                            })
                            let params={
                                studygrade_info:JSON.stringify(info),
                                action:type
                            }
                            return params
                        }}
                        success={(res,e)=>{
                            e.btn.loading=false
                            $.msg(type==='inc'?'升级成功！':'降级成功！')
                            grades_modal.close()
                            table.reload()
                        }}
                    >
                    {({form,submit})=>(
                        <div>
                    <Tabs defaultActiveKey="1" tabPosition={'left'}>
                        <TabPane tab="幼儿园" className="mr_24" key="1" forceRender>
                            <div className="box box-ac ta_c" style={{height:50,lineHeight:50}}>
                                <div style={{width:'50%'}}>原年级</div>
                                <div style={{width:'50%'}}>目标年级</div>
                            </div>
                            <div>
                                {
                                    list1.map((g,i)=>{
                                        let prev=(i-1)<0?'':i-1
                                        let next=(i+1)>15?'':i+1
                                        return (
                                        <div className="box box-ac ta_c mb_10" key={i}>
                                            <div style={{width:'50%'}}>
                                                {g}
                                            </div>
                                            <div style={{width:'50%'}} title={type!=='inc'&&g==='学龄前'?'已是最低年级无法降级':''}>
                                                <Grades style={{width:100}} disabled={type!=='inc'&&g==='学龄前'} value={type==='inc'?next:prev} minNum={type==='inc'?i:undefined} maxNum={type!=='inc'?i:undefined} form={form} name={i.toString()} allText="-" allOrder={type!=='inc'?'start':'end'}/>
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="小学" className="mr_24" key="2" forceRender>
                            <div className="box box-ac ta_c" style={{height:50,lineHeight:50}}>
                                <div style={{width:'50%'}}>原年级</div>
                                <div style={{width:'50%'}}>目标年级</div>
                            </div>
                            <div>
                                {
                                    list2.map((g,i)=>{
                                        i+=4
                                        let prev=(i-1)<0?'':i-1
                                        let next=(i+1)>15?'':i+1
                                        return (
                                        <div className="box box-ac ta_c mb_10" key={i}>
                                            <div style={{width:'50%'}}>
                                                {g}
                                            </div>
                                            <div style={{width:'50%'}}>
                                                <Grades style={{width:100}} value={type==='inc'?next:prev} minNum={type==='inc'?i:undefined} maxNum={type!=='inc'?i:undefined} form={form} name={i.toString()} allText="-" allOrder={type!=='inc'?'start':'end'}/>
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="初中" className="mr_24" key="3" forceRender>
                            <div className="box box-ac ta_c" style={{height:50,lineHeight:50}}>
                                <div style={{width:'50%'}}>原年级</div>
                                <div style={{width:'50%'}}>目标年级</div>
                            </div>
                            <div>
                                {
                                    list3.map((g,i)=>{
                                        i+=10
                                        let prev=(i-1)<0?'':i-1
                                        let next=(i+1)>15?'':i+1
                                        return (
                                        <div className="box box-ac ta_c mb_10" key={i}>
                                            <div style={{width:'50%'}}>
                                                {g}
                                            </div>
                                            <div style={{width:'50%'}}>
                                                <Grades style={{width:100}} value={type==='inc'?next:prev} minNum={type==='inc'?i:undefined} maxNum={type!=='inc'?i:undefined} form={form} name={i.toString()} allText="-" allOrder={type!=='inc'?'start':'end'}/>
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="高中" className="mr_24" key="4" forceRender>
                            <div className="box box-ac ta_c" style={{height:50,lineHeight:50}}>
                                <div style={{width:'50%'}}>原年级</div>
                                <div style={{width:'50%'}}>目标年级</div>
                            </div>
                            <div>
                                {
                                    list4.map((g,i)=>{
                                        i+=13
                                        let prev=(i-1)<0?'':i-1
                                        let next=(i+1)>15?'':i+1
                                        return (
                                        <div className="box box-ac ta_c mb_10" key={i}>
                                            <div style={{width:'50%'}}>
                                                {g}
                                            </div>
                                            <div style={{width:'50%'}} title={type==='inc'&&g==='高三'?'已是最高年级无法升级':''}>
                                                <Grades style={{width:100}} disabled={type==='inc'&&g==='高三'} value={type==='inc'?next:prev} minNum={type==='inc'?i:undefined} maxNum={type!=='inc'?i:undefined} form={form} name={i.toString()} allText="-" allOrder={type!=='inc'?'start':'end'}/>
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        </TabPane>
                    </Tabs>
                        <div className="ta_c mv_20">
                            <Btn style={{width:70}} onClick={e=>submit(e)}/>
                        </div>
                        <div className="dis_t"></div>
                    </div>
                    )}
                    </Form>
                )}
            </Modals>
        )
    }


    return (
        <div>
            <div className="box mb_20">
                <div className="box-1">
                    <Form
                        onSubmit={val=>table.search(val)}>
                        {({form})=>(
                            <div>
                                <Grades multiple autoSubmit style={{width:150}} className="mr_8" placeholder="全部年级" form={form}/>
                                <Inputs name="name" style={{width:275}} className="mr_8" placeholder="姓名关键字、首字母、默认联系电话" form={form}/>
                                <Button icon="search" type="primary" style={{width:50}} htmlType="submit"></Button>
                            </div>
                        )}
                    </Form>
                </div>
                <ButtonBox/>
            </div>
            <TableBox/>
            <GradesChangeBox/>
            <LesFailueBox/>
            <Modals bodyStyle={{padding:'10px 15px'}} ref={ref=>out_modal=ref} width="590px">
                {(type)=>(
                    <Form
                        onSubmit={(val)=>{
                            let api=type==='info'?'/campus/export/campusstudent/info':'/campus/export/courselessons'
                            window.open(`${api}?campus_uuid=${$.campus_uuid()}&token=${$.token()}&verifycode=${val.verifycode}`)
                            out_modal.close()
                        }}>
                        {({form,submit})=>(
                            <div>
                                <div className="box box-ac ph_10" style={{borderLeft:"2px solid #009688",background:'#f2f2f2',height:26}}>
                                    请先获取验证码后再进行导出操作！
                                </div>
                                <div style={{padding:'50px 0'}} className="bb_1 mb_10">
                                    <div className="box box-pc">
                                        <Inputs form={form} name="verifycode" className="mr_8" placeholder="请输入验证码"/>
                                        <Button icon="mobile" type="primary" onClick={async ()=>{
                                            let res=await $.post('/approval/verifycode',{permission:'EXPORT_STUDENT'})
                                            Modal.info({
                                                title: '提示',
                                                content: (
                                                  <div>
                                                    验证码已发送至校区校长手机 [{res.phone}]，请联系校区校长获取！
                                                  </div>
                                                ),
                                              });
                                        }}>获取验证码</Button>
                                    </div>
                                    <div className="ta_c mt_10 fc_err">*如下载页提示验证码错误，请重新获取验证码</div>
                                </div>
                                <div className="ta_c">
                                    <Button icon="download" type="primary" onClick={e=>submit(e)}>开始导出</Button>
                                </div>
                            </div>
                        )}
                    </Form>
                )}
            </Modals>

            {/* 学员导入弹窗 */}
            <Modals width="950px" bodyStyle={{padding:0}} ref={ref=>update_modal=ref}>
                <UpdateBox/>
            </Modals>
            <FailueBox/>
            <GroupModal/>

            {/* 添加学员弹窗 */}
            <Modals bodyStyle={{padding:'10px 20px'}} width="600px" ref={ref=>add_modal=ref}>
                <div className="box box-ac ph_10" style={{borderLeft:'2px solid #009688',background:'#f2f2f2',height:26}}>请填写好以下信息，除备注信息外均为必填项哦~</div>
                <Form labelCol={{span:9}} wrapperCol={{span:15}}
                    action="/campusstudent/create"
                    method="post"
                    success={(res,e)=>{
                        if(e.btn.type==='add'){
                            table.reload()
                            add_modal.close()
                            getCount()
                        }else{
                            window.location.href="/pc#/student_detail?uuid="+res.uuid
                        }
                    }}
                >
                    {({form,set,submit})=>(
                        <div className="pb_10">
                            <div className="box box-ac pv_20">
                                {set({
                                    name:'avatar'
                                },(valSet)=>(
                                    <AvatarBox valSet={valSet}/>
                                ))}
                                
                                <div style={{width:'50%'}}>
                                    <Inputs name="name" form={form} required label="学员名称" className="mb_10"/>
                                    <Inputs name="contact" form={form} label="学员联系人" className="mb_10"/>
                                    <Inputs name="phone" form={form} required label="联系人电话" className="mb_10"/>
                                    <div className="box mt_10">
                                        <div className="mr_10 fc_black2 ta_r" style={{whiteSpace:'nowrap',width:'37.5%'}}>学员类型：</div>
                                        {set({
                                            name:'identity',
                                            value:'formal'
                                        },()=>(
                                            <Radio.Group>
                                                <Radio value="formal">正式</Radio>
                                                <Radio value="intentional">意向</Radio>
                                            </Radio.Group>
                                        ))}
                                    </div>
                                    <Inputs name="remark" form={form} label="备注" className="mb_10"/>
                                </div>
                            </div>
                            <div className="box box-pc pt_10" style={{borderTop:'1px solid #e6e6e6'}}>
                                <Btn onClick={e=>{
                                    e.type='detail'
                                    submit(e)
                                }} className="mr_10">添加并完善信息</Btn>
                                <Btn onClick={e=>{
                                    e.type='add'
                                    submit(e)
                                }}>直接添加</Btn>
                            </div>
                        </div>
                    )}
                </Form>
            </Modals>

            {/* 设置弹窗 */}
            <Modals bodyStyle={{padding:'10px 20px'}} width="660px" ref={ref=>set_modal=ref}>
                {(_col)=>{
                    let value=sets.filter(s=>_col[s.key]==='YES').map(s=>s.key)
                    return (
                        <div>
                            <Alert message="机构可根据实际情况进行学员资料的信息维护，系统默认无法取消勾选" type="warning" showIcon />
                            <div className="box box-ac mt_10">
                                <span>系统默认：</span>
                                <div>
                                    <Checkbox checked disabled>学员姓名</Checkbox>
                                    <Checkbox checked disabled>联系人</Checkbox>
                                    <Checkbox checked disabled>性别</Checkbox>
                                    <Checkbox checked disabled>出生日期</Checkbox>
                                    <Checkbox checked disabled>年龄</Checkbox>
                                </div>
                            </div>
                            <Form className="mt_20"
                                action="/campusstudent/message/fields"
                                method="post"
                                valueReturn={val=>{
                                    let params={}
                                    sets.forEach(s=>{
                                        if(val.list.some(o=>o===s.key)){
                                            params[s.key]='YES'
                                            return
                                        }
                                        params[s.key]='NO'
                                    })
                                    return params
                                }}
                                success={()=>{
                                    $.msg('设置成功！')
                                    getCol()
                                    set_modal.close()
                                }}
                            >
                                {({set,submit})=>(
                                    <div>
                                        <div className="box box-as mb_30" style={{marginRight:100}}>
                                            <div style={{whiteSpace:'nowrap'}}>可选字段：</div>
                                            {set({
                                                name:'list',
                                                value
                                            },()=>(
                                                <Checkbox.Group className="fs_12 dis_f f_wrap">
                                                    {sets.map(s=>(
                                                        <div className="mb_10" key={s.key}>
                                                            <Checkbox value={s.key}>{s.label}</Checkbox>
                                                        </div>
                                                    ))}
                                                    
                                                </Checkbox.Group>
                                            ))}
                                        </div>
                                        <div className="box box-pc mb_20">
                                            <Btn onClick={e=>submit(e)}></Btn>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </div>
                    )
                }}
            </Modals>

            <Uploadfile
                zIndex={1200}
                action="/campusstudent/import/fields"
                multiple={false}
                ref={ref => (stu_upload = ref)}
                onSure={rs => {
                    if(rs.status==='failure'){
                        $.warning(rs.message)
                    }else{
                        if(rs.data.failue_count){
                            failue_modal.open('注意',rs.data.failue)
                        }else{
                            $.msg('导入学员成功！')
                        }
                        if(rs.data.success_count)table.reload()
                        update_modal.close()
                    }
                }}
            />
            <Uploadfile
                    zIndex={1200}
                    action="/finance/import/paymentpoint"
                    multiple={false}
                    ref={ref => (lesson_upload = ref)}
                    onSure={rs => {
                        if(rs.status==='failure'){
                            $.warning(rs.message)
                        }else{
                            if(rs.data.failue_count){
                                lesfailue_modal.open('注意',rs.data.failue)
                            }else{
                                $.msg('导入课时成功！')
                            }
                            if(rs.data.success_count)table.reload()
                            update_modal.close()
                            
                        }
                    }}
                />
        </div>
    )
}