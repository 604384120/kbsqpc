import React,{useEffect,useState} from 'react'
import {$,Form,Inputs,Btn,Page} from '../comlibs'
import {Teacher} from '../works'
import moment from "moment";
import {Popover,Checkbox,Empty,Spin} from 'antd'
import Paikelist from './paikelist'

export default function(){
    const Iconfont = $.icon();
    let {list,setList,date,setDate,paike_page,have,setHave,form_ref}={}
    useEffect(()=>{
        (async ()=>{
            setList({heads:list.heads,data:list.data,loading:true})
            let res=await $.get('/lesson/week/teacher')
            let weekOfday=moment(new Date(),'YYYY-MM-DD').format('E');
            let arr=[]
            for (let i = 0; i < 7; i++) {
                let dateStr=moment(new Date(),'YYYY-MM-DD').subtract(weekOfday-1,'d').add(i,'d').format('周dd(MM-DD)')
                arr.push({date:moment(new Date(),'YYYY-MM-DD').subtract(weekOfday-1,'d').add(i,'d'),dateStr})
            }
            setList({heads:arr,data:res,loading:false})
        })()
    },[])
    let today_date=$.dateFormat(new Date(),'YYYY-MM-DD')
    function Table(){
        [list,setList]=useState({heads:[],data:[],loading:true})
        return (
            <Spin tip="Loading..." spinning={list.loading}>
           <table style={{width:"100%",minWidth:1173}} className="bl_e1">
               <thead className="bt_e1">
                   <tr>
                       <td style={{width:100}} className="bg_gray fc_black5 lh_40 ta_c bb_e1 br_e1 fs_13">老师</td>
                       {list.heads.map((t,i)=>{
                           if(t.date.format('YYYY-MM-DD')===today_date){
                                return <td key={i} className={`bg_blue fc_white lh_40 ta_c bb_e1 br_e1 fs_13`}>{t.dateStr}</td>
                           }else{
                                return <td key={i} className={`bg_gray ${i>=5?'fc_blue':'fc_black5'} lh_40 ta_c bb_e1 br_e1 fs_13`} >{t.dateStr}</td>
                           }
                        })}
                   </tr>
               </thead>
               <tbody>
                   {
                       list.data.length?list.data.map((row,i)=>(
                            <tr key={i}>
                                <td className="ta_c br_e1 bb_e1">{row.name}</td>
                                {row.days.map((col,i)=>{
                                    let lessons=[]
                                    if(col.lesson.Morning){
                                        lessons=lessons.concat(col.lesson.Morning.map(o=>{
                                            o.type='morning'
                                            return o
                                        }))
                                    }
                                    if(col.lesson.Noon){
                                        lessons=lessons.concat(col.lesson.Noon.map(o=>{
                                            o.type='noon'
                                            return o
                                        }))
                                    }
                                    if(col.lesson.Night){
                                        lessons=lessons.concat(col.lesson.Night.map(o=>{
                                            o.type='night'
                                            return o
                                        }))
                                    }
                                    if(lessons.length){
                                    return (
                                        <Popover key={i}  placement="rightTop" content={(
                                            <div>
                                                <div className="fb mb_8 fs_16" style={{}}>共{lessons.length}节课</div>
                                                {lessons.map((l,i)=>(
                                                    <div className={`box box-ac fs_14 ${i!=lessons.length-1?'mb_14':''}`} key={l.uuid}>
                                                        <div style={{height:6,width:6,background:bgColor(l.type)}} className="circle mr_8"></div>
                                                        <div>{l.text}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}>
                                            <td className="br_e1 bb_e1 box_hover pointer" style={{verticalAlign:'top',background:today_date===col.weekday?'#E6F7FF':'',padding:'24px 0 16px'}}
                                                    onClick={()=>{
                                                        col.dateseq=col.weekday
                                                        col.teacher_uuid=row.teacher_uuid
                                                        col.have=have
                                                        paike_page.open('排课信息',col)
                                                    }}
                                                >
                                                <div style={{minHeight:100}}>
                                                {
                                                    lessons.map((l,i)=>(
                                                        <div className="pst_rel lh_28 mb_8 pointer" key={i} style={{height:28}}>
                                                            <div className="b_hover item pst_abs b_1 br_8 box box-ac" style={{border:today_date===col.weekday?'1px solid rgba(63, 173, 255, 0.5)':'',left:20,right:20,top:0,bottom:0}}>
                                                                <div className="circle mh_8" style={{background:bgColor(l.type),width:6,height:6}}></div>
                                                                <div className="ellipsis box-1 pr_10">{l.name}</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                </div>
                                            </td>
                                        </Popover>
                                    )
                                    }else{
                                        return (
                                            <td key={i} className="br_e1 bb_e1 box_hover pointer" style={{verticalAlign:'top',background:today_date===col.weekday?'#E6F7FF':'',padding:'24px 0 16px'}}
                                                >
                                            </td>
                                        )
                                    }
                                })}
                                
                            </tr>
                       )):(
                        <tr>
                            <td className="br_e1 bb_e1" colSpan={8}>
                                <div style={{padding:'100px 0'}}>
                                    <Empty description="本周暂无排课信息"/>
                                </div>
                            </td>
                        </tr>
                       )
                   }
               </tbody>
           </table>
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
                <Inputs className="mh_16" form={form} allowClear={false} type="weekPicker" onChange={(val)=>{
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
            <div>
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
            </div>
        )
    }
    return (
        <div>
            <Form
                ref={ref=>form_ref=ref}
                onSubmit={async val=>{
                    setList({heads:list.heads,data:list.data,loading:true})
                    let params={}
                    let arr=[]
                    if(val.curdate){
                        params.curdate=val.curdate;
                        let weekOfday=moment(new Date(val.curdate),'YYYY-MM-DD').format('E');
                        for (let i = 0; i < 7; i++) {
                            let dateStr=moment(new Date(val.curdate),'YYYY-MM-DD').subtract(weekOfday-1,'d').add(i,'d').format('周dd(MM-DD)')
                            arr.push({date:moment(new Date(val.curdate),'YYYY-MM-DD').subtract(weekOfday-1,'d').add(i,'d'),dateStr})
                        }
                    }else{
                        arr=list.heads
                    }
                    if(val.teacher_uuid)params.teacher_uuid=val.teacher_uuid
                    params.have_student=val.have_student?'YES':'NO'
                    let res=await $.get('/lesson/week/teacher',params)
                    setList({heads:arr,data:res,loading:false})
                }}>
                {({form,set,submit,setByName})=>(
                    <div className="mb_15 box box-ac">
                        <div className="box-1 box box-ac">
                        <WeekSelect submit={submit} form={form} setByName={setByName}/>
                        <Teacher showPhone={true} placeholder="全部老师" autoSubmit={true} style={{width:220}} className="mr_24" form={form} name="teacher_uuid"/>
                        <OnlyHaveBox submit={submit} set={set}/>
                        <Btn className="ml_16" onClick={async e=>{
                                await $.download("/campus/export/teacher/table",{curdate:date.format('YYYY-MM-DD')});
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