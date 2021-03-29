import React, { useEffect, useState } from 'react'
import {Modals,Btn,$, Inputs,Form} from '../comlibs'
import {Switch, Table} from 'antd'

export default function(props){
    let {changeTxt,txt}=props
    let {edit_modal}={}
    let [rule,setRule]=useState({})
    useEffect(()=>{
        init()
    },[])
    async function init(){
        let res=await $.get('/campus/set/points/rule',{})
        setRule(res)
    }
    async function setSwitch(key){
        if(rule[key]){
            if(rule[key]?.status==='ON'){
                await $.post('/campus/points/rule/disable',{channel_action:key})
            }else{
                await $.post('/campus/points/rule/enable',{channel_action:key})
            }
        }else{
            let obj={LESSON_ARRIVED:true,LESSON_LEAVE:false,LESSON_ABSENT:false,HOMEWORK_COMMIT:true,HOMEWORK_REVIEW:true}
            await $.post('/campus/set/points/rule',{channel_action:key,default_points:obj[key]?1:-1})
            await $.post('/campus/points/rule/enable',{channel_action:key})
        }

        init()
    }

    return (
        <div>
            <Form onSubmit={async (rs)=>{
                await $.post('/campus/settings',{setting_name:'points_name',setting_value:rs.name})
                changeTxt(rs.name)
            }}>
                {({form,submit})=>(
                    <div className="box box-ac">
                        <span>“{txt}”更换：</span>
                        <Inputs className="mh_5" placeholder="不超过3个字" maxLength={3} name="name" form={form}/>
                        <Btn className="mr_10" onClick={submit}/>
                        <span><span style={{color:'#F9AF36'}}>*</span> “ <span style={{color:'#F9AF36'}}>{txt}</span> ” 可根据校区实际情况进行设置，例如：“ <span style={{color:'#F9AF36'}}>某某币</span> ”。</span>
                    </div>
                )}
            </Form>
            <div className="mv_20" style={{border:'1px solid #eee'}}>
                <table style={{width:'100%'}}>
                    <tr style={{background:'#FAFAFA',height:50}} className="bb_e1">
                        <th style={{width:120,padding:'8px 10px',textAlign:'left'}}>{txt}项</th>
                        <th style={{width:120,padding:'8px 10px',textAlign:'left'}}>启用状态</th>
                        <th className="box-1" style={{padding:'8px 10px',textAlign:'left'}}>说明</th>
                        <th style={{width:120,padding:'8px 10px',textAlign:'left'}}>类型</th>
                        <th style={{width:300,padding:'8px 10px',textAlign:'left'}}>规则</th>
                    </tr>

                    <tr style={{height:50}} className="bb_e1">
                        <td style={{width:120,padding:'8px 10px'}}>到课</td>
                        <td style={{width:120,padding:'8px 10px'}}>
                            <Switch onClick={()=>setSwitch('LESSON_ARRIVED')} checkedChildren="ON" unCheckedChildren="OFF" checked={rule?.LESSON_ARRIVED?.status==='ON'}/>
                        </td>
                        <td style={{padding:'8px 10px'}} className="box-1">
                            学员到课，系统自动新增{txt}
                        </td>
                        <td style={{width:120,padding:'8px 10px'}}>新增</td>
                        <td style={{width:200,padding:'8px 10px'}}>
                            <div className="box box-ac">
                                <div className="mr_6">每节课到课+{rule?.LESSON_ARRIVED?.default_points||1}{txt}</div>
                                <img onClick={()=>{
                                    edit_modal.open('规则','LESSON_ARRIVED')
                                }} className="xb pointer" width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                        </td>
                    </tr>

                    <tr style={{height:50}} className="bb_e1">
                        <td style={{width:120,padding:'8px 10px'}}>请假</td>
                        <td style={{width:120,padding:'8px 10px'}}>
                            <Switch onClick={()=>setSwitch('LESSON_LEAVE')} checkedChildren="ON" unCheckedChildren="OFF" checked={rule?.LESSON_LEAVE?.status==='ON'}/>
                        </td>
                        <td style={{padding:'8px 10px'}} className="box-1">
                            学员请假，系统自动扣除{txt}
                        </td>
                        <td style={{width:120,padding:'8px 10px'}}>扣除</td>
                        <td style={{width:200,padding:'8px 10px'}}>
                            <div className="box box-ac">
                                <div className="mr_6">每节课请假{rule?.LESSON_LEAVE?.default_points||-1}{txt}</div>
                                <img className="pointer" onClick={()=>edit_modal.open('规则','LESSON_LEAVE')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                        </td>
                    </tr>

                    <tr style={{height:50}} className="bb_e1">
                        <td style={{width:120,padding:'8px 10px'}}>缺课</td>
                        <td style={{width:120,padding:'8px 10px'}}>
                            <Switch onClick={()=>setSwitch('LESSON_ABSENT')} checkedChildren="ON" unCheckedChildren="OFF" checked={rule?.LESSON_ABSENT?.status==='ON'}/>
                        </td>
                        <td style={{padding:'8px 10px'}} className="box-1">
                            学员缺课，系统自动扣除{txt}
                        </td>
                        <td style={{width:120,padding:'8px 10px'}}>扣除</td>
                        <td style={{width:200,padding:'8px 10px'}}>
                            <div className="box box-ac">
                                <div className="mr_6">每节课缺课{rule?.LESSON_ABSENT?.default_points||-1}{txt}</div>
                                <img className="pointer" onClick={()=>edit_modal.open('规则','LESSON_ABSENT')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                        </td>
                    </tr>

                    <tr style={{height:50}} className="bb_e1">
                        <td style={{width:120,padding:'8px 10px'}}>上交作业</td>
                        <td style={{width:120,padding:'8px 10px'}}>
                            <Switch onClick={()=>setSwitch('HOMEWORK_COMMIT')} checkedChildren="ON" unCheckedChildren="OFF" checked={rule?.HOMEWORK_COMMIT?.status==='ON'}/>
                        </td>
                        <td style={{padding:'8px 10px'}} className="box-1">
                            学员上交作业，系统自动新增{txt}
                        </td>
                        <td style={{width:120,padding:'8px 10px'}}>新增</td>
                        <td style={{width:200,padding:'8px 10px'}}>
                            <div className="box box-ac">
                                <div className="mr_6">每份作业上交+{rule?.HOMEWORK_COMMIT?.default_points||1}{txt}</div>
                                <img className="pointer" onClick={()=>edit_modal.open('规则','HOMEWORK_COMMIT')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                        </td>
                    </tr>

                    <tr style={{height:50}} className="bb_e1">
                        <td style={{width:120,padding:'8px 10px'}}>批改作业</td>
                        <td style={{width:120,padding:'8px 10px'}}>
                            <Switch onClick={()=>setSwitch('HOMEWORK_REVIEW')} checkedChildren="ON" unCheckedChildren="OFF" checked={rule?.HOMEWORK_REVIEW?.status==='ON'}/>
                        </td>
                        <td style={{padding:'8px 10px'}} className="box-1">
                            老师批改作业时，可给予学员一定的{txt}
                        </td>
                        <td style={{width:120,padding:'8px 10px'}}>新增</td>
                        <td style={{width:200,padding:'8px 10px'}}>
                            <div className="box box-ac">
                                <div className="mr_6">每份作业批改新增最高不超过{rule?.HOMEWORK_REVIEW?.default_points||1}{txt}</div>
                                <img className="pointer" onClick={()=>edit_modal.open('规则','HOMEWORK_REVIEW')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <Modals ref={ref=>edit_modal=ref}>
                {(key)=>{
                    let value=rule[key].default_points<0?-rule[key].default_points:rule[key].default_points
                    let txt_obj={'LESSON_ARRIVED':'每节课到课新增','LESSON_LEAVE':'每节课请假扣除','LESSON_ABSENT':'每节课缺课扣除','HOMEWORK_COMMIT':'每份作业上交新增','HOMEWORK_REVIEW':'每份作业批改最高不超过'}
                    let opera_obj={'LESSON_ARRIVED':'+','LESSON_LEAVE':'-','LESSON_ABSENT':'-','HOMEWORK_COMMIT':'+','HOMEWORK_REVIEW':'+'}
                    return (
                        <Form action="/campus/set/points/rule" params={{channel_action:key}} valueReturn={val=>{
                            if(opera_obj[key]==='+'){
                                val.default_points=val.default_points>0?val.default_points:-val.default_points
                            }else{
                                val.default_points=val.default_points>0?-val.default_points:val.default_points
                            }
                            return val
                        }} method="post" success={()=>{
                            edit_modal.close()
                            init()
                        }}>
                            {({form,submit})=>(
                                <div className="box box-ver box-pc box-ac">
                                    <div className="mb_20">
                                        {txt_obj[key]}
                                        <Inputs required className="mh_8" value={value} style={{width:120}} name="default_points" form={form}/>
                                        {txt}
                                    </div>
                                    <Btn onClick={submit}/>
                                </div>
                            )}
                        </Form>
                    )
                }}
                
            </Modals>
        </div>
    )
}