import React,{useState,useEffect} from 'react'
import {Divider } from 'antd'
import Zmage from 'react-zmage'
import {Method,Form,Inputs,Btn} from '../comlibs'

export default function(props){
    let $=new Method()
    let {resume,setResume,list,setList}={}
    const Iconfont = $.icon();
    let parent=props.Parent
    parent.setCloseData(true);
    async function getResume(uuid){
        let res=await $.get(`/logresume/${uuid}/detail`)
        res.arr1=[]
        if(res.work_time)res.arr1.push(res.work_time+'年工作经验')
        if(res.age)res.arr1.push(res.age+'周岁')
        if(res.graduation_school)res.arr1.push(res.graduation_school)
        if(res.education)res.arr1.push(res.education)
        if(res.major)res.arr1.push(res.major)
        if(res.edus&&res.edus[0])res.arr1.push(res.edus[0].start_date+"~"+res.edus[0].end_date)

        res.arr2=[]
        let address="现居"
        if(res.current_residence.name1)address+=res.current_residence.name1
        if(res.current_residence.name2)address+=res.current_residence.name2
        if(res.current_residence.zonename)address+=res.current_residence.zonename
        if(res.current_residence)res.arr2.push(address)

        setResume(res)
        setList([].concat(list))
    }
    function ResumeList(){
        [list,setList]=useState([])
        return (
            <div>
                {list.map(res=>(
                    <div key={res.uuid} className="pst_rel pall_15 br_2 bg_white mb_4 pointer"
                        style={{border:resume.uuid===res.uuid&&'1px solid #3fadff'}}
                        onClick={()=>{
                            if(resume.uuid!==res.uuid){
                                getResume(res.uuid)
                                
                            }
                        }}>
                        {res.read_status==='NO'&&<img className="pst_abs" style={{right:0,top:0,width:27,height:27}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/65ced30a-6cea-11ea-aca2-00163e04cc20.png" alt="null"/>}
                        
                        <div>
                            <span className="fs_15 mr_16" style={{color:'#48B0FF'}}>{res.name}</span>
                            <span className="fc_black4 fs_13">
                                {res.arr1&&res.arr1.map((rs,i)=>(
                                    <span key={i}>
                                        {rs}{i+1!==res.arr1.length&&<Divider type="vertical"/>}
                                    </span>
                                ))}
                            </span>
                        </div>
                        <div className="dis_f ai_c jc_sb">
                            <span>应聘：{res.job_name}</span>
                            {res.star==="up"&&<Iconfont className="fl_r" type="icon-xingbiao2"/>}
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    function ResumeLeft(){
        let [select,setSelect]=useState([])
        useEffect(()=>{
            init()
        },[])
        async function init(){
            let res=await $.get('/logresume/list',props.Parent.data)
            let res2=await $.get('/jobscreen/list')
            setList(res.map((rs)=>{
                rs.arr1=[]
                if(rs.age)rs.arr1.push(rs.age+'岁')
                if(rs.education)rs.arr1.push(rs.education)
                if(rs.work_time)rs.arr1.push(rs.work_time+"年")
                return rs
            }))
            setSelect(res2.map(rs=>({text:rs.name,value:JSON.stringify(rs)})))
        }
        return (
            <div className="box-1 tranall">
                <Form className="bg_white br_2 pv_13 ph_15 mb_4" style={{width:236}}
                    onSubmit={async val=>{
                        let data={}
                        if(val.select){
                            val=JSON.parse(val.select)
                            data={[val.key]:val.value}
                        }
                        let res=await $.get('/logresume/list',data)
                        setList(res.map((rs)=>{
                            rs.arr1=[]
                            if(rs.age)rs.arr1.push(rs.age+'岁')
                            if(rs.education)rs.arr1.push(rs.education)
                            if(rs.work_time)rs.arr1.push(rs.work_time+"年")
                            return rs
                        }))
                    }}>
                    {({form})=>(
                        <div>
                            筛选：
                            <Inputs style={{width:160}} name='select' select={select} value={parent.data.placeholder} autoSubmit={true} form={form}/>
                        </div>
                    )}
                </Form>
                <ResumeList/>
            </div>
        )
    }

    function ResumeBox(){
        [resume,setResume]=useState({})
        async function bindStar(){
            resume.star=resume.star==='up'?'down':'up'
            if(resume.star==='up'){
                await $.get('/logresume/favor',{job_uuid:resume.job_uuid,uuid:resume.uuid})
            }else{
                await $.get('/logresume/cancel',{job_uuid:resume.job_uuid,uuid:resume.uuid})
            }
            let rlist=list.map(rs=>{
                if(resume.uuid===rs.uuid){
                    rs.star=resume.star
                }
                return rs
            })
            let str_Resume=JSON.stringify(resume)
            setList(rlist)
            setResume(JSON.parse(str_Resume))
        }
        return (
            <div className="tranall bg_white ov_h ml_8" style={{width:resume.uuid?'90%':'0%',visibility:resume.uuid?'visible':'hidden',padding:resume.uuid?'17px 72px 100px 24px':''}}>
                <div className="bg_gray pall_24 box">
                    <div className="box-1">
                        <div className="mb_18">
                            <span className="fs_24 fb">{resume.name}</span>
                            <Iconfont className="mh_8" type={resume.gender==='male'?'icon-nan':'icon-nv'}/>
                            <span className="fs_18 fb ml_15" style={{color:'#504F4F'}}>{resume.job_name} · {resume.arrival_state} </span>
                        </div>
                        <div className="fc_black4 fs_14 fc_black4 mb_6">
                            {resume.arr1&&resume.arr1.map((rs,i)=>(
                                <span key={i}>
                                    {rs}{i+1!==resume.arr1.length&&<Divider type="vertical"/>}
                                </span>
                            ))}
                        </div>
                        <div className="mb_6">
                            {resume.arr2&&resume.arr2.map((rs,i)=>(
                                <span key={i}>
                                    {rs}{i+1!==resume.arr2.length&&<Divider type="vertical"/>}
                                </span>
                            ))}
                        </div>
                        
                        <div>
                            <Iconfont className="mr_10" type="icon-dianhua"/>{resume.phone}
                            {resume.email&&<span className="ml_20"><Iconfont className="mr_10" type="icon-youxiang"/>{resume.email}</span>}
                            
                        </div>
                    </div>
                    <div className="box box-pe" style={{width:'20%'}}>
                        {resume.star==='up'?(
                            <Btn type="default" onClick={()=>{bindStar()}} className="mr_16" style={{color:'#3FADFF',border:'1px solid #3FADFF'}} iconfont="xingbiao2">星标</Btn>
                        ):(
                            <Btn type="default" onClick={()=>{bindStar()}} className="mr_16" style={{color:'rgba(0,0,0,0.65)'}} iconfont="xingbiao1">星标</Btn>
                        )}

                        {/* <Btn iconfont="xiazai-copy">下载</Btn> */}
                    </div>
                </div>
                {resume.summary&&(
                    <div className="ml_25 pt_24 bb_1">
                        <div className="fc_black2 fs_16 mb_18 fb dis_f ai_c"><span className="dis_ib mr_6 br_2" style={{width:3,height:18,backgroundColor:'#48B0FF'}}></span>自我评价</div>
                        <div className="pb_17" style={{color:'rgba(0,0,0,0.65)'}}>
                            {resume.summary}
                        </div>
                    </div>
                )}
                {
                    resume.works&&(
                        <div className="ml_25 pt_24 bb_1">
                            <div className="fc_black2 fs_16 mb_18 fb dis_f ai_c"><span className="dis_ib mr_6 br_2" style={{width:3,height:18,backgroundColor:'#48B0FF'}}></span>工作经历</div>
                            {resume.works.map(work=>(
                                <div key={work.uuid} className="mb_24">
                                    <div className="mb_6">
                                        <span className="fs_17 fc_black1 dis_ib" style={{width:300}}>{work.name}</span>
                                        <span className="fc_gray2">{work.start_date}~{work.end_date}</span>
                                    </div>
                                    <div className="fc_black4 mb_6">{work.station}</div>
                                    <div className="fc_black4">{work.description}</div>
                                </div>
                            ))}
                        </div>
                    )
                }
                {
                    resume.edus&&(
                        <div className="ml_25 pt_24 bb_1">
                            <div className="fc_black2 fs_16 mb_18 fb dis_f ai_c"><span className="dis_ib mr_6 br_2" style={{width:3,height:18,backgroundColor:'#48B0FF'}}></span>教育经历</div>
                            {resume.edus.map(edu=>(
                                <div key={edu.uuid} className="mb_24">
                                    <div className="mb_6">
                                        <span className="fs_17 fc_black1 dis_ib" style={{width:300}}>{edu.name}</span>
                                        <span className="fc_gray2">{edu.start_date}~{edu.end_date}</span>
                                    </div>
                                    <div className="fc_black4 mb_6">{edu.education} <Divider type="vertical"/> {edu.major}</div>
                                </div>
                            ))}
                        </div>
                    )
                }
                {resume.annex&&(
                    <div className="ml_25 pt_24">
                        <div className="fc_black2 fs_16 mb_18" style={{borderLeft:'3px solid #48B0FF',paddingLeft:7}}>证书</div>
                        {
                            resume.annex.map((rs,index)=>(
                                <Zmage className="wh_full br_3 mr_5" style={{width:110}} key={rs} controller={{zoom: false}} backdrop="rgba(255,255,255,.9)" alt={rs} src={rs} set={
                                    resume.annex.map((img)=>({src:img,alt:img}))
                                } defaultPage={index}/>
                            ))
                        }
                    </div>
                )}
                
                
            </div>
        )
    }
    return (
        <div className="box mt_24">
            <ResumeLeft/>
            <ResumeBox/>
        </div>
    )
}