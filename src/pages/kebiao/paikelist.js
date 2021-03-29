import React, { useState, useEffect } from 'react'
import {$,Page,Btn,FixedBox} from '../comlibs'
import {} from '../works'
import {Checkbox,Table} from 'antd'
// import Lesson from './lesson'
import LessonDetail from '../class/lessondetail'

export default function(props){
    let parent=props.Parent
    let info=props.Parent.data
    let {list=[],setList,have,setHave,num,setNum,lesson_page}={}
    let columns = [
        {
            title: "上课时间",
            key:'lessontime',
            width:150,
			render(rs){
                return (
                    <div className="link" onClick={()=>{
                        lesson_page.open('课节详情',{uuid:rs.uuid},{left:310})
                    }}>{rs.date_text}</div>
                )
            }
        },
        {
			title: "班级名称",
			dataIndex:'name'
        },
        {
            title: "教室",
            key:'classroom_name',
            render(rs){
                return (
                    <div>{rs.classroom_name||'-'}</div>
                )
            }
        },
        {
            title: "授课老师",
            key:'teachers',
			render(rs){
                let name=rs.teachers.map(t=>t.name).join(',')
                return (
                    <div>{name}</div>
                )
            }
        },{
            title:'助教老师',
            key:'assistants',
            render(rs){
                let name=rs.assistants&&rs.assistants.length?rs.assistants.map(t=>t.name).join(','):'-'
                return <span>{name}</span>
            }
        },
        {
            title: "学员人数",
            align: "center",
            width:150,
            key:'member',
            render(rs){
                return (
                    <div>
                        <div>{rs.member}</div>
                        {rs.hour&&<div>消耗{rs.hour.all.cnt_frozenlessons}课时</div>}
                        {!rs.hour&&<div>消耗0课时</div>}
                    </div>
                )
            }
        },
        {
            title: "签到情况",
            key:'hour',
            width:230,
			render(rs){
                if(rs.hour){
                    return (
                        <div>
                            <div className="box box-ac">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#52C51A'}}></div>
                                <div className="fs_14">到课：{rs.hour.arrived.cnt_student}人(消耗{rs.hour.arrived.cnt_frozenlessons}课时)</div>
                            </div>
                            <div className="box box-ac">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#FAAD14'}}></div>
                                <div className="fs_14">请假：{rs.hour.leave.cnt_student}人(消耗{rs.hour.leave.cnt_frozenlessons}课时)</div>
                            </div>
                            <div className="box box-ac">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#FF4D50'}}></div>
                                <div className="fs_14">缺课：{rs.hour.absent.cnt_student}人(消耗{rs.hour.absent.cnt_frozenlessons}课时)</div>
                            </div>
                        </div>
                    )
                }else{
                    return (
                        <div>
                            <div className="box box-ac">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#52C51A'}}></div>
                                <div className="fs_14">到课：0人(消耗0课时)</div>
                            </div>
                            <div className="box box-ac">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#FAAD14'}}></div>
                                <div className="fs_14">请假：0人(消耗0课时)</div>
                            </div>
                            <div className="box box-ac">
                                <div className="circle mr_8" style={{width:6,height:6,background:'#FF4D50'}}></div>
                                <div className="fs_14">缺课：0人(消耗0课时)</div>
                            </div>
                        </div>
                    )
                }
                
            }
		},
    ]
    useEffect(()=>{
        getList(info.lesson)
    },[])

    async function getList(){
        let params={
            current_date:info.dateseq
        }
        if(info.teacher_uuid)params.teacher_uuid=info.teacher_uuid
        if(info.classroom_uuid)params.classroom_uuid=info.classroom_uuid
        let arr=await $.get('/lesson/week/current/day',params)
        let uuids=arr.map(o=>o.uuid).join(',')
        let res=await $.post('/lessons/courselesson',{lesson_uuids:uuids})
        arr=arr.map((o,i)=>{
            o.key=i
            for(let i=0;i<res.length;i++){
                if(res[i].lesson_uuid===o.uuid){
                    o.hour=res[i]
                    break;
                }
            }
            return o
        })
        let use=have?arr.filter(o=>o.member):arr
        setList({use,all:arr})
        setNum(use.length)
    }

    function TableBox(){
        [list,setList]=useState({use:[],all:[]})
        return (
            <div>
                <Table rowClassName="pointer" onRow={rec => {
                    return {
                    onClick: e => {
                        lesson_page.open('课节详情',{uuid:rec.uuid},{left:310})
                    }, // 点击行
                    };
                }} dataSource={list.use} columns={columns}/>
            </div>
        )
    }
    function CheckWrap(){
        [have,setHave]=useState(info.have)
        return (
            <Checkbox className="fc_black5 fs_14" defaultChecked={info.have} onChange={val=>{
                let {checked}=val.target
                let temp_list=checked?list.all.filter(o=>o.member):list.all
                setList({use:temp_list,all:list.all})
                setHave(checked)
                setNum(temp_list.length)
            }}><span className="fs_14">仅看有学员课节</span></Checkbox>
        )
    }
    function LessonCount(){
        [num,setNum]=useState(0)
        return <span className="fb mr_24 fs_16">共排<span className="fc_blue">{num}</span>节课</span>
    }
    return (
        <div className="pst_rel" style={{height:'calc(100% - 20px)'}}>
            <div className="bg_white br_2 mt_20">
                <div className="mb_16 mt_6 box box-ac">
                    <span className="mr_16 fb fs_16">日期：{info.dateseq}</span>
                    <LessonCount/>   
                    <CheckWrap/>
                </div>
                <TableBox/>
                
                <Page mask={true} background="#fff" ref={ref=>lesson_page=ref} onClose={()=>{
                    getList()
                    parent.setCloseData(true)
                }}>
                    <LessonDetail/>
                </Page>
            </div>
            {/* <div style={{height:52,bottom:0,left:'-24px',right:'-24px',borderTop:'1px solid rgba(0,0,0,0.09)'}} className="box box-ac pl_24 pst_abs">
                <Btn onClick={()=>{
                    parent.close(true)
                }}>关闭</Btn>
            </div> */}
            <div style={{height:62}}></div>
            <FixedBox>
                <div className="box box-ac box-pc" style={{width:'100%'}}>
                    <Btn onClick={()=>{
                        parent.close(true)
                    }}>关闭</Btn>
                </div>
            </FixedBox>
        </div>
    )
}