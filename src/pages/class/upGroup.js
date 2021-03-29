import React,{useState,useEffect} from 'react'
import {Form,Inputs,FixedBox,Btn,$} from '../comlibs'
import {Table, Modal} from 'antd'

export default function(props){
    let parent=props.Parent
    let {keys,setKeys}={}
    let {course_name,old_group_uuid,course_uuid}=parent.data
    let [list,setList]=useState([])
    
    useEffect(()=>{
        (async ()=>{
            let res=await $.get(`/banji/${old_group_uuid}/students`,{status:'UNWITHDRAWAL',limit:9999})
            let arr=res.map(s=>{
                s.key=s.student_uuid
                return s
            })
            setList(arr)
        })()
    },[])

    function TableBox(){
        [keys,setKeys]=useState(list.map(s=>s.key))
        let columns=[
            {
                title:()=>(`全选(已选${keys.length}人)`),
                dataIndex:'name'
            },{
                title:'剩余课时',
                align:'center',
                dataIndex:'remainlessons',
                render:(rs)=>(
                    <div>{rs>0?rs:<span className="fc_err">{rs}</span>}</div>
                )
            }
        ]
        return (
            <Table rowSelection={{
                selectedRowKeys:keys,
                onChange:(uuids)=>{
                    setKeys(uuids)
                }
            }} columns={columns} dataSource={list}/>
        )
    }

    
    return (
        <div className="pall_40">
            <Form 
                action="/banji/promotion"
                params={{
                    up_status:'up',
                    old_group_uuid,
                    course_uuid
                }}
                valueReturn={val=>{
                    val.student_uuids=keys.join(',')
                    return val
                }}
                success={rs=>{
                    $.msg('学员升班成功！')
                    parent.close(rs.uuid)
                }}
                method="post"
            >
                {({form,submit})=>(
                    <div style={{paddingTop:30}}>
                        <div className="box box-ac mb_20">
                            <div>
                                班级名称：
                            </div>
                            <Inputs form={form} name="name" required/>
                        </div>
                        <div className="box box-ac mb_20">
                            所授课程：{course_name}
                        </div>
                        <div className="mb_15">
                            选择升班学员
                        </div>
                        <TableBox/>
                        <div style={{height:50}}></div>
                        <FixedBox>
                            <div style={{width:'100%'}}>
                                <Btn className="mr_15" type="default" onClick={()=>{
                                    parent.close()
                                }}>取消</Btn>
                                <Btn onClick={(e)=>{
                                    Modal.confirm({
                                        title:'升班',
                                        content:'本班您选中的在读学员都会从当前班级待上课节中移除，并加入到新的班级中！',
                                        onOk(){
                                            submit(e)
                                        }
                                    })
                                    
                                }}></Btn>
                            </div>
                        </FixedBox>
                    </div>
                )}
            </Form>
        </div>
    )
}