import React from 'react'
import {Alert } from 'antd'
import {Form,Inputs,TablePagination,Page} from '../comlibs'
import LessonDetail from '../class/lessondetail'

export default function(){
    let {detail_page,tab}={}
    let columns=[
        {
            title:'序号',
            dataIndex:'_index'
        },{
            title:'班级名称',
            dataIndex:'name',
            render(rs){
                return <span className="link">{rs}</span>
            }
        },{
            title:'上课时间',
            key:'time_start',
            render(rs){
                return (
                    <div>{rs.time_start}-{rs.time_end}</div>
                )
            }
        },{
            title:'点名情况',
            key:'arrived',
            render(rs){
                if(rs.arrived){
                    return (
                        <div className="fc_green">已点名</div>
                    )
                }
                return (
                    <div>未点名</div>
                )
            }
        },{
            title:'到课情况',
            key:'member',
            render(rs){
                return (
                    <div>实到/应到({rs.arrived||0}/{rs.member||0})</div>
                )
            }
        },{
            title:'操作',
            key:'edit',
            render(rs){
                return (
                    <span className="link" onClick={()=>{detail_page.open('课节详情',{uuid:rs.uuid},{left:300})}}>点名</span>
                )
            }
        }
    ]
    return (
        <div className="mt_20">
            <Alert message="查看当日上课课程的班级点名情况" type="warning" />
            <div className="mt_20 bg_white br_3 pall_20">
                {/* 筛选表单 */}
                <Form onSubmit={(val)=>{
                  tab.search(val)
                }}>
                    {({form})=>(
                        <div className="box box-ac mb_20">
                            <div>查看类型：</div>
                            <Inputs autoSubmit form={form} name="limitations" type="select" value="HAS_STUDENTS" allowClear={false} select={[
                                {value:'HAS_STUDENTS',text:'有学员课节'},
                                {value:'',text:'全部课节'}
                            ]}/>
                        </div>
                    )}
                </Form>
                {/* 列表 */}
                <TablePagination
                    ref={ref=>tab=ref}
                    columns={columns}
                    onRow={
                        rec => ({
                            onClick:rs=>{
                                detail_page.open('课节详情',{uuid:rec.uuid},{left:300})
                            },
                            className:'pointer'
                        })
                    }
                    api="/teacher/lesson"
                    params={{
                        status: 'today',
                        limitations: 'HAS_STUDENTS'
                    }}
                />
            </div>

            <Page ref={ref=>detail_page=ref} onClose={()=>{tab.reload()}}>
                <LessonDetail/>
            </Page>
        </div>
    )
}