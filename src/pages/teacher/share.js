import React, { useState,useEffect } from 'react'
import {Btn,Img,Method} from '../comlibs'
import {Poster} from '../works'

export default function(props){
    let $=new Method()
    let parent=props.Parent
    let job=parent.data
    let {
        uuid,
        job_name,
        experience,
        education,
    }=job
    let address=job.z_addr.name2||job.z_addr.name1
    let date = { month: "月", day: "日", hour: "小时" };
    if(experience==='不限')experience='不限经验'
    if(education==='不限')education='不限学历'
    let salary = `${job.salary_min}-${job.salary_max}/${date[job.date_tag]}`;
    let {poster}={}
    let [img,setImg]=useState('')
    parent.setCloseData(true)
    useEffect(()=>{
        (async ()=>{
            let res=await $.get('/jobs/qrcode',{url:$.loc.origin + "/h5#/teacher_jobdetail?jid=" +uuid})
            setImg('data:image/png;base64,'+res.img)
        })()
    },[])
    return (
        <div className="mt_24 ta_c mb_24 pb_30 bg_white" style={{padding:"100px 0"}}>
            <div className="mb_30">
                <img style={{width:34,marginRight:12}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/97f8be64-64f6-11ea-aca1-00163e04cc20.png" alt="图片无效"/>
                <span className="fs_20 fc_black1">职位【{job.job_name}】发布成功！</span>
            </div>
            <div className="dis_ib box-pc" style={{boxShadow:'0px 0px 6px 0px rgba(203,202,202,0.5)'}}>
                <div style={{padding:25,textAlign:'center'}}>
                    <Img width="170px" height="170px" src={img} alt="null"/>
                    <span className="mt_10 fc_gray">微信扫码查看职位详情</span>
                </div>
            </div>
            <div className="mt_30">
                <Btn className="mr_15" style={{width:'120px'}} type="default" onClick={()=>{
                    parent.close(true)
                }}>返回职位列表</Btn>

                <Btn style={{width:'120px'}} onClick={()=>{
                    poster.open('海报分享',{
                        api: "/poster/teacher",
                        params: {
                            token:$.token(),
                            campus_uuid:$.campus_uuid(),
                            job_url: $.loc.origin + "/h5#/teacher_jobdetail?jid=" +uuid,
                            job_name,
                            salary,
                            address,
                            experience,
                            education,
                            wxgzhqrcode:'YES'
                        }
                    })
                }}>去分享</Btn>
            </div>
            <Poster ref={ref => (poster = ref)} />
        </div>
    )
}