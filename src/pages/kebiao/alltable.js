import React,{useEffect,useState} from 'react'
import {$,Form,Inputs,Btn,Page} from '../comlibs'
import {Course} from '../works'
import moment from "moment";
import {Popover,Checkbox,Spin} from 'antd'
import Paikelist from './paikelist'

export default function(){
    let {list,setList,ct,setCt,page,have,setHave,form_ref}={}
    useEffect(()=>{
        load()
    },[])
    function bgColor(time_part){
        if(time_part==="morning"){
            return '#52C51A'
        }else if(time_part==="noon"){
            return '#FAAD14'
        }else{
            return '#FF4D50'
        } 
    }
    let today_date=$.dateFormat(new Date(),'YYYY/MM')

    async function load(){
        setList({data:list.data,loading:true})
        let res=await $.get(`/lesson/calendar/${today_date}`)
        setList({data:res,loading:false})
    }
    function Table(){
        [list,setList]=useState({data:[],loading:true})
        return (
            <Spin spinning={list.loading}>
            <div style={{height:40,background:'#FAFAFA'}} className="box bt_e1 bl_e1 fs_13 lh_40 ta_c bb_e1">
                <div className="br_e1 box-1">周一</div>
                <div className="br_e1 box-1">周二</div>
                <div className="br_e1 box-1">周三</div>
                <div className="br_e1 box-1">周四</div>
                <div className="br_e1 box-1">周五</div>
                <div className="br_e1 fc_blue box-1">周六</div>
                <div className="br_e1 fc_blue box-1">周日</div>
            </div>
            <table style={{width:'100%',minWidth:1173}} className="bl_e1">
                <tbody>
                    {list.data.length&&list.data.map((row,index)=>(
                        <tr key={index}>
                            {row.map((col,index)=>{
                                let date=parseInt(col.dateseq.split('-')[2])
                                let today=col.dateseq==$.dateFormat(new Date(),'YYYY-MM-DD')
                                if(col.lesson.length&&col.current_month==='YES'){
                                    return (
                                        <Popover key={index} placement="rightTop" content={(
                                            <div>
                                                <div className="fb mb_8 fs_16" style={{}}>共{col.lesson.length}节课</div>
                                                {col.lesson.map((l,i)=>(
                                                    <div className={`box box-ac fs_14 ${i!=col.lesson.length-1?'mb_14':''}`} key={l.uuid}>
                                                        <div style={{height:6,width:6,background:bgColor(l.time_part)}} className="circle mr_8"></div>
                                                        <div className="mr_8">{l.lessontime}-{l.endtime}</div>
                                                        <div>{l.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}>
                                        <td style={{verticalAlign:'top',background:today?'#E6F7FF':''}} className={`br_e1 bb_e1 ${col.current_month==='YES'?'box_hover':''}`} onClick={()=>{
                                            col.have=have
                                            page.open("排课信息", col)
                                        }}>
                                            <div className={`ph_20 pst_rel pv_8`} style={{minHeight:150}}>
                                                <div className="lh_22">
                                                    <span className="fb fs_14" style={{color:today?'#3FADFF':col.current_month==='NO'?'rgba(0,0,0,.25)':'rgba(0,0,0,.85)'}}>{date}</span>
                                                    <span className="fs_10 ml_8 pst_abs" style={{color:'#FF4D50'}}>{col.holiday}</span>
                                                </div>
                                                <div>
                                                {col.lesson.map(l=>(
                                                    <div className="pst_rel mv_8" style={{height:27.7,}} key={l.uuid}>
                                                        <div className="b_1 br_8 box box-ac item pst_abs" style={{border:today?'1px solid rgba(63,173,255,0.5)':'',height:27.7,lineHeight:'27.7px',left:0,right:0}}>
                                                            <div style={{height:6,width:6,background:bgColor(l.time_part)}} className="circle mh_8"></div>
                                                            <div className="fs_14 fc_black5 pst_rel box-1" style={{height:'100%'}}>
                                                                <span className="pst_abs ellipsis" style={{left:0,right:10}}>{l.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                        </td>
                                        </Popover>
                                    )
                                }else{
                                    return (
                                    <td key={index} style={{verticalAlign:'top',background:today?'#E6F7FF':''}} className={`br_e1 bb_e1`}>
                                        <div className={`ph_20 pst_rel pv_8`} style={{minHeight:150}}>
                                            <div className="lh_22">
                                                <span className="fb fs_14" style={{color:today?'#3FADFF':col.current_month==='NO'?'rgba(0,0,0,.25)':'#000000'}}>{date}</span>
                                            </div>
                                            <div className="pst_abs" style={{left:25,right:25}}>
                                            </div>
                                        </div>
                                    </td>
                                    )
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            </Spin>
        )
    }
    function DateBox({form}){
        [ct,setCt]=useState(moment(today_date,'YYYY/MM'))
        return <Inputs allowClear={false} style={{width:158}} onChange={(val,date)=>{
            if(date)setCt(moment(date))
        }} className="mr_8" name="date" value={moment(today_date, 'YYYY/MM')} format="YYYY-MM" type="monthPicker" placeholder="请选择日期" autoSubmit={true} style={{marginRight:20}} form={form}/>
    }

    function OnlyHaveBox(props){
        [have,setHave]=useState(false)
        let {submit,set}=props
        return (
            <span>
                {set(
                    {
                        name: "have_student"
                    },()=>(
                            <Checkbox className="fc_black5" onChange={e=>{
                                setTimeout(()=>{
                                    submit(e)
                                    setHave(e.target.checked)
                                },50)
                            }}><span className="fs_14">仅看有学员课节</span></Checkbox>
                        )
                    )
                }
            </span>
        )
    }

    return (
        <div>
        <Form
            ref={ref=>form_ref=ref}
            onSubmit={async val => {
                setList({data:list.data,loading:true})
                let date=today_date
                if(val.date){date=val.date}
                if(date.indexOf('-')>-1){
                    let arr=date.split('-')
                    date=arr[0]+'/'+arr[1]
                }
                let res=await $.get(`/lesson/calendar/${date}`,{course_uuid:val.course_uuid,have_student:val.have_student?'YES':'NO'})
                setList({data:res,loading:false})
            }}>
            {({form,set,submit})=>(
                <div className="mb_15">
                    <DateBox form={form}/>
                    <Course autoSubmit={true} style={{width:220}} className="mr_24" name="course_uuid" form={form}/>
                    <OnlyHaveBox submit={submit} set={set} />
                    <Btn className="ml_16" onClick={async e=>{
                            let arr=ct.format('YYYY-MM').split('-')
                            await $.download("/campus/export/group/table",{year:arr[0],month:arr[1]});
                            return e
                        }}>导出该月课表</Btn>
                    <div className="fl_r dis_f ai_e">
                        <div className="box box-ac mr_6">
                            <div className="circle" style={{background:bgColor('morning'),width:6,height:6}}></div>
                            <span className="ml_8 mr_16">上午</span>
                            <div className="circle" style={{background:bgColor('noon'),width:6,height:6}}></div>
                            <span className="ml_8 mr_16">下午</span>
                            <div className="circle" style={{background:bgColor('night'),width:6,height:6}}></div>
                            <span className="ml_8 mr_16">晚上</span>
                        </div>
                    </div>
                    
                </div>
            )}
        </Form>
        <Table/>
        <Page mask={true} background="#fff" ref={ref=>page=ref} onClose={()=>{
                form_ref._form._handleSubmit({});
            }}>
            <Paikelist/>
        </Page>
        </div>
    )
}