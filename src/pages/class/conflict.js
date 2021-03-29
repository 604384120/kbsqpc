import React, { useState } from 'react'
import { FixedBox,Btn,$ } from '../comlibs'
import {Checkbox,Table,Popover,Popconfirm, Modal } from 'antd'

export default function(props){
    let parent=props.Parent
    let data=parent.data
    let arr=data.schdule
    // let arr=data.schdule.map((s,i)=>{
    //     s._key=i+1
    //     s.key=i+1
    //     return s
    // })
    let [all,setAll]=useState(arr)
    let [list,setList]=useState(arr)
    let columns=[
        {
            title:'序号',
            dataIndex:'key',
            render(rs,obj,i){
                return (
                    <span style={{color:obj.status==="finshed"?'#999999':''}}>{i+1}</span>
                )
            }
        },{
            title:'上课日期',
            key:'date_text',
            render:(rs,obj)=>(
            <div style={{color:obj.status==="finshed"?'#999999':''}}>{rs.date_text}({rs.week})</div>
            )
        },{
            title:'上课时间',
            key:'day_text',
            render:(rs,obj)=>(
                <div style={{color:obj.status==="finshed"?'#999999':''}}>{rs.day_text}</div>
            )
        },{
            title:'授课老师',
            key:'teachers',
            render:(rs,obj)=>(
                <div style={{color:obj.status==="finshed"?'#999999':''}}>
                    {rs.teachers.map((t,i)=>(
                        <span>
                            {
                                t.is_conflict==='YES'?(
                                    <Popover placement="leftTop" content={(
                                        <div>
                                            {t.conflict_lessons.map((c,i)=>(
                                                <div className="mb_15" key={i}>
                                                    <div>{c.group_name}</div>
                                                    <div className="fs_12">{c.date_text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}>
                                        <span className='fc_del'>{t.name}</span>
                                    </Popover>
                                ):(
                                    <span>{t.name}</span>
                                )
                            }
                            {i+1!==rs.teachers?.length&&'、'}
                        </span>
                    ))}
                </div>
            )
        },{
            title:'助教',
            key:'assistants',
            render:(rs,obj)=>{
                if(!rs.assistants?.length){
                    return '-'
                }
                return (
                <div style={{color:obj.status==="finshed"?'#999999':''}}>
                    {rs.assistants.map((t,i)=>(
                        <span>
                            {
                                t.is_conflict==='YES'?(
                                    <Popover placement="leftTop" content={(
                                        <div>
                                            {t.conflict_lessons.map((c,i)=>(
                                                <div className="mb_15" key={i}>
                                                    <div>{c.group_name}</div>
                                                    <div className="fs_12">{c.date_text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}>
                                        <span className='fc_del'>{t.name}</span>
                                    </Popover>
                                ):(
                                    <span>{t.name}</span>
                                )
                            }
                            {i+1!==rs.assistants?.length&&'、'}
                        </span>
                    ))}
                
                </div>
                )
            }
        },{
            title:'上课教室',
            dataIndex:'classroom_name',
            render:(rs,obj)=>{
                if(obj.classroom_conflict&&obj.classroom_conflict?.length){
                    return (
                        <Popover placement="leftTop" content={(
                            <div>
                                {obj.classroom_conflict.map((c,i)=>(
                                    <div className="mb_15" key={i}>
                                        <div>{c.group_name}</div>
                                        <div className="fs_12">{c.lesson_date.year}-{c.lesson_date.origin_date} {c.show_start_time}-{c.show_end_time}</div>
                                    </div>
                                ))}
                            </div>
                        )}>
                            <span className='fc_del'>{rs||'-'}</span>
                        </Popover>
                    )
                }
                return (
                    <span style={{color:obj.status==="finshed"?'#999999':''}}>{rs||'-'}</span>
                )
                
            }
        },{
            title:'操作',
            key:'edit',
            align:'center',
            render(rs,obj,key){
                return (
                    <Popconfirm
                        placement="topRight"
                        title="确定删除此课节吗?"
                        onConfirm={()=>{
                            list.splice(key,1)
                            let all_key=-1
                            all.some((l,i)=>{
                                if(l.uuid===rs.uuid)all_key=i
                                return l.uuid===rs.uuid
                            })
                            if(all_key!=-1){
                                all.splice(all_key,1)
                                setAll(all)
                            }
                            setList([].concat(list))
                            $.msg('删除成功！')
                        }}
                        okText="是"
                        cancelText="否"
                    >
                        <span className="fc_del hover_line pointer">删除</span>
                    </Popconfirm>
                    
                )
            }
        }
    ]
    let finished_count=all?.filter(rs=>rs.status==="finshed")?.length
    let con_count=all?.filter(rs=>rs.is_conflict==='YES')?.length

    return (
        <div className="mt_20">
            <div className="box box-ac fs_20 mb_25">
                <span>共排{all?.length}节</span>
                <span className="mh_15">|</span>
                <span>已上{finished_count}节</span>
                <span className="mh_15">|</span>
                <span>有冲突{con_count}节</span>
                <Checkbox style={{marginLeft:30}} onChange={e=>{
                    let checked=e.target.checked
                    if(checked){
                        setList(all.filter(l=>l.is_conflict==='YES'))
                    }else{
                        setList(all)
                    }
                }}>仅显示冲突课节</Checkbox>
            </div>

            <Table pagination={false} columns={columns} dataSource={list}/>
            <div style={{height:70}}></div>
            <FixedBox>
                <div style={{width:'100%'}}>
                    <Btn type="default" className="mr_10" onClick={()=>parent.close()}>取消排课</Btn>
                    <Btn onClick={()=>{
                        Modal.confirm({
                            title:'确定排课',
                            content:`共排${all?.length}节课，已上${finished_count}节课，冲突${con_count}节课`,
                            async onOk(){
                                let params=parent.data
                                params.schdule=all
                                await $.post('/lessons/conflict',{
                                    group_uuid:data.group_uuid,
                                    content:JSON.stringify(params)
                                })
                                parent.close(all.map(a=>a.uuid).join(','))
                            }
                        })
                    }}>确定排课</Btn>
                      
                    
                </div>
            </FixedBox>
        </div>
    )
}