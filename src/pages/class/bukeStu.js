import React from 'react'
import {Btn,TablePagination,Form,Inputs, FixedBox,$} from '../comlibs'

export default function(props){
    let parent=props.Parent
    let {lesson_uuid,course_uuid}=parent.data
    let {tab}={}
    let columns=[
        {
            title:'上课日期',
            dataIndex:'starttime',
            width:200,
            render(rs){
                return <div>{rs.year}-{rs.origin_date}({rs.week})</div>
            }
        },{
            title:'上课时间',
            dataIndex:'endtime',
            render(rs,obj){
                return <span>{obj.starttime.time}-{obj.endtime.time}</span>
            }
        },{
            title:'学员姓名',
            dataIndex:'student_name',
            render:(rs)=>rs
        },{
            title:'班级名称',
            dataIndex:'banji_name'
        },{
            title:'状态',
            dataIndex:'status',
            render(rs){
                if(rs==="leave"){
                    return <span style={{color:'#FEC03C'}}>请假</span>
                }else if(rs==="absent"){
                    return <span className="fc_err">缺课</span>
                }
                
            }
        },{
            title:'扣课时数',
            dataIndex:'frozenlessons',
            render(rs){
                return rs+'课时'
            }
        }
    ]
    return (
        <div className="mt_20">
            <Form className="mb_20" onSubmit={(val)=>{
                if(val.date&&val.date[0]&&val.date[1]){
                    val.date_start=val.date[0]
                    val.date_end=val.date[1]
                }else{
                    val.date_start=''
                    val.date_end=''
                }
                tab.search(val)
            }}>
                {({form})=>(
                    <div>
                        <Inputs autoSubmit className="mr_15" type="select" form={form} name="status" placeholder="考勤状态" select={[
                            {text:'请假',value:'leave'},
                            {text:'缺课',value:'absent'}
                        ]}/>
                        <Inputs autoSubmit form={form} className="mr_15" type="rangePicker" name="date" placeholder={['开始日期','结束日期']}/>
                        <Inputs form={form} name="name" style={{width:260}} className="mr_15" placeholder="输入班级名称或学员名字搜索"/>
                        <Btn htmlType="submit">搜索</Btn>
                    </div>
                )}
                
            </Form>
            <TablePagination
                rowSelection
                ref={ref=>tab=ref}
                params={{course_uuids:course_uuid}}
                columns={columns}
                api="/campus/lessonstudent/abnormal"
            />
            <div style={{height:70}}></div>
            <FixedBox>
                <div style={{width:'100%'}}>
                    <Btn type="default" className="mr_15" onClick={()=>{
                        parent.close()
                    }}>取消</Btn>
                    <Btn onClick={async ()=>{
                        let student_uuids=[]
                        let lesson_uuids=[]
                        Object.values(tab.selectedRowObjs).forEach(stu=>{
                            student_uuids.push(stu.student_uuid)
                            lesson_uuids.push(stu.lesson_uuid)
                        })
                        await $.post('/lesson/student/batch/remedy',{student_uuids,lesson_uuids,remedial_lesson_uuid:lesson_uuid})
                        $.msg('添加成功')
                        parent.close(true)
                    }}></Btn>
                </div>
            </FixedBox>
        </div>
    )
}