import React from 'react'
import {Form,Inputs,Btn,TablePagination,Modals,$, Page} from '../comlibs'
import {Button,Modal} from 'antd'
import GroupStu from './groupStu'

export default function(){
    let {tab,addTeam_modal,edit_modal,stu_page}={}
    let columns=[
        {
            title:'序号',
            dataIndex:'_key',
        },{
            title:'组名',
            dataIndex:'name',
        },{
            title:'学员人数',
            dataIndex:'cnt_students',
            fixed:'right',
            align:'center',
            width:300
        },{
            title:'操作',
            key:'edit',
            fixed:'right',
            align:'center',
            width:300,
            render(rs){
                return (
                    <div className="box box-ac box-pc">
                        <span className="link" onClick={()=>{
                            edit_modal.open('修改分组名',rs)
                        }}>改名</span>
                        <span style={{color:'#D2EBFD'}} className="mh_8">|</span>
                        <span className="link" onClick={()=>{
                            stu_page.open('群组成员',{uuid:rs.uuid},{left:300})
                        }}>成员</span>
                        <span style={{color:'#D2EBFD'}} className="mh_8">|</span>
                        <span className="fc_err pointer hover_line" onClick={()=>{
                            Modal.confirm({
                                title:'提示',
                                content:'确定删除该分组吗?',
                                okType:'danger',
                                async onOk(){
                                    await $.post('/campusstudent/teams/delete',{team_uuid:rs.uuid})
                                    $.msg('删除成功！')
                                    tab.reload()
                                }
                            })
                        }}>删除</span>
                    </div>
                )
            }
        }
    ]
    return (
        <div>
            <div className="box">
                <div className="box-1 mb_10">
                    <Form
                        onSubmit={val=>tab.search(val)}
                    >
                        {({form})=>(
                            <div>
                                <Inputs name="name" className="mr_8" form={form} placeholder="输入分组名称"/>
                                <Button icon="search" type="primary" style={{width:40}} htmlType="submit"/>
                            </div>
                        )}
                    </Form>
                </div>
                <Btn onClick={()=>{
                    addTeam_modal.open('创建新组')
                }}>创建新组</Btn>
            </div>


            <Modals ref={ref=>{addTeam_modal=ref}} bodyStyle={{padding:'20px 30px'}}>                        
                <Form
                    action="/campusstudent/teams/create"
                    method="post"
                    success={(res,e)=>{
                        e.btn.loading=false
                        $.msg('新组创建成功！')
                        tab.reload()
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

            <Modals width="400px" ref={ref=>edit_modal=ref}>
                {(obj)=>(
                    <Form 
                        params={{team_uuid:obj.uuid}}
                        action="/campusstudent/teams/update"
                        method="post"
                        success={res=>{
                            tab.reload()
                            edit_modal.close()
                        }}>
                        {({form,submit})=>(
                            <div className="box box-ac box-pc box-ver">
                                <Inputs form={form} value={obj.name} name="name"/>
                                <Btn style={{width:70}} onClick={e=>submit(e)} className="mt_30"></Btn>
                            </div>
                        )}
                    </Form>
                )}
            </Modals>

            <TablePagination
                ref={ref=>tab=ref}
                api="/campusstudent/teams/list"
                columns={columns}
            />
            <Page ref={ref=>stu_page=ref} background='#fff' onClose={()=>{
                tab.reload()
            }}>
                <GroupStu/>
            </Page>
            {/* <Modals width="800px" bodyStyle={{padding:10}} ref={ref=>stu_modal=ref}>
                {(uuid)=>{
                       
               }}
            </Modals> */}
        </div>
    )
}