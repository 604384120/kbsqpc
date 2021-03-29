import React from 'react'
import {TablePagination,Btn,$,FixedBox} from '../comlibs'
import {Page_ChoiceClassStudent } from '../works'

export default function(props){
    let parent=props.Parent
    let {uuid}=props.Parent.data
    let {stu_tab,addStu_page}={}
    let map={formal:'正式',intentional:'意向',graduated:'毕业'}
    let colors={formal:'#8BD881',intentional:'#DDAD58',graduated:'#999A9E'}
    let columns=[
        {
            title:'序号',
            dataIndex:'_key',
            align:'center'
        },
        {
            title:'姓名',
            dataIndex:'name'
        },{
            title:'联系方式',
            dataIndex:'phone',
            render(rs){
                return <div>{rs||'-'}</div>
            }
        },{
            title:'类型',
            key:'identity',
            render(rs){
                return (
                    <div style={{color:colors[rs.identity]}}>{map[rs.identity]}</div>
                )
            }
        },{
            title:'是否绑定微信',
            key:'gzh_bind',
            render(rs){
                return (
                    <div>
                        {rs.gzh_bind==='YES'?<span>是</span>:<span style={{color:'#999A9E'}}>否</span>}
                    </div>
                )
            }
        },{
            title:'操作',
            key:'edit',
            render(rs){
                return (
                    <div className="fc_err pointer hover_line" onClick={async ()=>{
                        await $.post('/campusstudent/remove/members',{
                            student_uuids:rs.student_uuid,
                            team_uuid:uuid
                        })
                        stu_tab.reload()
                        // tab.reload()
                        parent.setCloseData(true)
                    }}>
                        移除
                    </div>
                )
            }
        }
    ]
    return (
        <div className="mt_24">
            <div className="box box-pe mb_20">
                <Btn className="mr_10" onClick={async ()=>{
                    let uuids=Object.values(stu_tab.selectedRowObjs).map(o=>o.student_uuid).join(',')
                    if(!uuids){
                        $.warning('请选择学员后操作!')
                        return
                    }
                    await $.post('/campusstudent/remove/members',{
                        student_uuids:uuids,
                        team_uuid:uuid
                    })
                    stu_tab.reload()
                    parent.setCloseData(true)
                    stu_tab.delSelectionAll()
                }}>批量移除</Btn>
                <Btn onClick={()=>{
                    addStu_page.open({
                        onSure:async e=>{
                            let uuids=e.map(o=>o.student_uuid).join(',')
                            await $.post('/campusstudent/teams/add',{team_uuid:uuid,student_uuids:uuids})
                            $.msg('添加成功！')
                            stu_tab.reload()
                            parent.setCloseData(true)
                        },
                        bottom:(props)=>{
                            let {sure}=props
                            return (
                                <div>
                                    <div style={{height:100}}></div>
                                    <FixedBox>
                                        <div style={{width:'100%'}}>
                                            <Btn className="mr_10" type="default" onClick={()=>{
                                                parent.close()
                                            }}>取消</Btn>
                                            <Btn onClick={()=>{
                                                sure()
                                            }}>确定</Btn>
                                        </div>
                                    </FixedBox>
                                </div>
                            )
                        }
                    },{left:300})
                }}>添加学员</Btn>
            </div>
            <TablePagination
                ref={ref=>stu_tab=ref}
                rowSelection={true}
                api="/campusstudent/teams/members"
                params={{team_uuid:uuid}}
                columns={columns}
            />
                <Page_ChoiceClassStudent ref={ref=>addStu_page=ref}/>
            {/* <Modals width="1000px" ref={ref=>addStu_modal=ref}>
                <ChoiceClassStudent onSure={async e=>{
                    let uuids=e.map(o=>o.student_uuid).join(',')
                    await $.post('/campusstudent/teams/add',{team_uuid:uuid,student_uuids:uuids})
                    $.msg('添加成功！')
                    stu_tab.reload()
                    tab.reload()
                    addStu_modal.close()
                }}/>
            </Modals> */}
            <div style={{height:'100px'}}></div>
            <FixedBox>
                <div style={{width:'100%'}}>
                    <Btn onClick={()=>parent.close(true)}>关闭</Btn>
                </div>
            </FixedBox>
        </div>
    )

}