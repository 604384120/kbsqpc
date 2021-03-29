import React,{useState,useEffect} from 'react'
import {Btn,Method,Page,Img,FixedBox} from '../comlibs'
import {ChoiceClassStudent} from '../works'
import {Steps,Icon } from 'antd'
import Detail from './clockDetail'
import Edit from './edit'

export default function(props){
    let parent=props.Parent
    let $=new Method()
    let {page_detail}={}
    const { Step } = Steps;
    function stepIcon(index) {
        if (index < step) {
            return "finish";
        }
        if (index === step) {
            return "process";
        }
        if (index > step) {
            return "wait";
        }
    }
    
    let [step,setStep]=useState(0)
    let [val,setVal]=useState({})

    
    let Step3=(props)=>{
        let {uuid}=props
        let [url,setUrl]=useState({})
        useEffect(()=>{
            (async ()=>{
                let res=await $.get('/clock/detail',{clock_uuid:uuid})
                res=res.clock
                let time=res.start_time+"至"+res.end_time
                url=`/poster/clock/share?token=${$.token()}&campus_uuid=${$.campus_uuid()}&title=${res.name}&clockdate=${time}&requirement=${res.memo||''}&scene=${res.uuid.replace(/-/g,'')}&page=pages/clock/join`
                setUrl(url)
                // setClock(res.clock)
            })()
        },[])
        return (
            <div>
                <div className="ta_c mb_15 box box-ac box-pc" style={{marginTop:100}}>
                    <Icon className="mr_15" style={{fontSize:24}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                    <div className="fs_20 fb">打卡创建完成</div>
                </div>
                <div className="box box-pc">
                    {
                        url&&(
                            <Img
                                width={300}
                                height={515}
                                cache={false}
                                src={$.getProxyIdentify+url }
                            />
                        )
                    }
                    
                </div>
                <div className="m_auto ta_c mt_24 mb_30">
                    <Btn className="mr_24" style={{width:120}} type="default" onClick={()=>{
                        parent.close(true)
                    }}>返回列表</Btn>
                    <a href={$.getProxyIdentify+url} download="海报">
                        <Btn style={{width:120}} >下载海报</Btn>
                    </a>
                </div>
            </div>
        )
    }

    
    return (
        <div className="bg_white mv_20 br_2 pall_20">
            <Steps type="navigation" current={step} style={{boxShadow: '0px -1px 0 0 #e8e8e8 inset'}}>
                <Step status={stepIcon()} title="设置打卡基本信息" />
                <Step status={stepIcon()} title="添加学员" />
                <Step status={stepIcon()} title="完成" />
            </Steps>
            {step===0&&(
                <Edit type="add" 
                success={(res)=>{
                    setStep(++step)
                    setVal(res.clock)
                    parent.setCloseData(true)
                }} Bottom={(props)=>{
                    let {submit}=props
                    return (
                        <div className="mt_30 ta_c mb_20">
                            <Btn onClick={(e)=>submit(e)}>下一步</Btn>
                        </div>
                    )
                }}/>
            )}
            {step===1&&(
                <div>
                    <ChoiceClassStudent course_params={{status:'online'}} bottom={(props)=>{
                        let {sure}=props
                        return (
                            <FixedBox className="ta_c">
                                <Btn className="mr_12" onClick={()=>{
                                    setStep(2)
                                }}>跳过</Btn>
                                <Btn onClick={()=>{sure()}}>下一步</Btn>
                            </FixedBox>
                        )
                    }} onSure={async (data)=>{
                        if(data&&data.length>0){
                            await $.post('/clock/add/student',{clock_uuid:val.uuid,student_uuids:data.map(rs=>rs.student_uuid).join(',')})
                            setStep(2)
                        }else{
                            $.warning("请选择学员!")
                        }
                        
                    }}/>
                    
                </div>
            )}
            {step===2&&(<Step3 uuid={val.uuid}/>)}

        
        <Page ref={ref=>{page_detail=ref}} onClose={()=>{
            parent.close(true)
        }}>
            <Detail/>
        </Page>
        </div>
    )
}