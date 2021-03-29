import React,{useEffect,useState} from 'react'
import {$,Form,Inputs,Btn,Page} from '../comlibs'
import moment from "moment";
import {Checkbox,Spin} from 'antd'
import Paikelist from './paikelist'

export default function(){
    const Iconfont = $.icon();
    let {list,setList,date,setDate,form_ref,paike_page,have,setHave }={}
    useEffect(()=>{
        (async ()=>{
            setList({data:list.data,loading:true})
            let res=await $.get('/lesson/week/days')
            setList({data:res,loading:false})
        })()
    },[])
    let today_date=$.dateFormat(new Date(),'YYYY-MM-DD')
    function Table(){
        [list,setList]=useState({data:[],loading:true})
        return (
            <Spin tip="Loading..." spinning={list.loading}>
           <div className="box bt_e1 bl_e1" style={{minWidth:1173}}>
               {list.data.map(col=>{
                   let head_fc='rgba(0, 0, 0, 0.65)'
                   let arr=col.dateseq.split('-')
                   let today=today_date===col.dateseq
                   let date=arr[1]+"-"+arr[2]
                   if(col.week==='周六'||col.week==='周日')head_fc='#3FADFF'
                   if(today)head_fc='white'
                   return (
                    <div className="box box-ver br_e1 bb_e1 box_hover pointer" style={{width:'14.285%',background:today?'#E6F7FF':''}} key={col.dateseq} onClick={()=>{
                        col.have=have
                        paike_page.open('排课信息',col)
                    }}>
                        <div style={{height:40,background:today?'#3FADFF':'#FAFAFA',color:head_fc}} className="fs_13 lh_40 ta_c bb_e1">{col.week}({date})</div>
                        <div style={{minHeight:'calc(100vh - 300px)'}} className="pt_24 ph_20">
                            {
                                col.lesson.map((l,i)=>(
                                    <div className="box br_8 b_1 pointer mb_8 item" style={{padding:'3px 0',border:today?'1px solid rgba(63, 173, 255, 0.5)':''}} key={i} 
                                        >
                                        <div>
                                            <div className="circle mh_8 mt_8 " style={{background:bgColor(l.time_part),width:6,height:6}}></div>
                                        </div>
                                        <div className="fs_14" style={{width:'calc(100% - 22px)'}}>
                                            <div>{l.date_text}</div>
                                            <div className="ellipsis pr_10" title={l.name}>{l.name}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    )
                }
               )}
           </div>
           </Spin>
        )
    }
    function bgColor(time_part){
        if(time_part==="morning"){
            return '#52C51A'
        }else if(time_part==="noon"){
            return '#FAAD14'
        }else{
            return '#FF4D50'
        } 
    }
    function WeekSelect(props){
        let {form,submit}=props
        let { setFieldsValue } = form;
        [date,setDate]=useState(moment(new Date()))
        return (
            <div className="box box-ac">
                <span className="fc_black3 box box-ac lh_30 pointer" style={{height:30}} onClick={()=>{
                    date=moment(date)
                    date.subtract(1,'w')
                    setDate(moment(date._d))
                    setFieldsValue({ ["curdate"]: moment(date._d) } )
                    setTimeout(()=>{
                        submit(date)
                    },50)
                }}>
                    <Iconfont className="fs_12" type="icon-left-arrow" />
                    <span>上周</span>
                </span>
                <Inputs className="mh_16" form={form} type="weekPicker" allowClear={false} onChange={(val)=>{
                    setDate(moment(val))
                }} autoSubmit={true} format="YYYY-MM-DD(周dd)" name="curdate" placeholder="请选择日期" value={date}/>
                <span className="mr_24 fc_black3 box box-ac lh_30 pointer" style={{height:30}} onClick={()=>{
                    date=moment(date)
                    date.add(1,'w')
                    setDate(moment(date._d))
                    setFieldsValue({ ["curdate"]: moment(date._d) } )
                    setTimeout(()=>{
                        submit(date)
                    },50)
                }}>
                    <span>下周</span>
                    <Iconfont className="fs_12" type="icon-right-arrow" />
                </span>
            </div>
        )
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
                onSubmit={async val=>{
                    setList({data:list.data,loading:true})
                    let params={}
                    if(val.curdate){
                        params.curdate=val.curdate
                    }
                    params.have_student=val.have_student?'YES':'NO'
                    let res=await $.get('/lesson/week/days',params)
                    setList({data:res,loading:false})
                }}>
                {({form,set,submit,setByName})=>(
                    <div className="mb_15 box box-ac">
                        <div className="box-1 box box-ac">
                        <WeekSelect submit={submit} form={form} setByName={setByName}/>
                        {/* {set(
                            {
                            name: "have_student"
                            },()=>(
                                <Checkbox className="fc_black5" onChange={val=>{
                                    setTimeout(()=>{
                                        submit(val)
                                    },50)
                                }}><span className="fs_14">仅看有学员课节</span></Checkbox>
                                )
                            )
                        } */}
                        <OnlyHaveBox submit={submit} set={set}/>
                        <Btn className="ml_16" onClick={async e=>{
                                await $.download("/campus/export/week/table",{curdate:date.format('YYYY-MM-DD')});
                                return e
                            }}>导出该周课表</Btn>
                        </div>
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
            <Page mask={true} background="#fff" ref={ref=>paike_page=ref} onClose={()=>{
                form_ref._form._handleSubmit({});
            }}>
                <Paikelist/>
            </Page>
        </div>
    )
}