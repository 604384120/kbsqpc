import { Switch } from 'antd'
import {$, Inputs,Modals,Form,Btn} from '../comlibs'
import React, { useEffect, useState } from 'react'


export default function(props){
    let [rule,setRule]=useState({})
    let {rule_modal }={}
    useEffect(()=>{
        init()
    },[])
    async function init(){
        let res=await $.get('/campus/set/leave/rule')
        setRule(res)
    }
    async function bindSwitch(key){
        if(rule[key]){
            if(rule[key].status==='ON'){
                await $.post('/campus/leave/rule/disable',{channel_action:key})
            }else{
                await $.post('/campus/leave/rule/enable',{channel_action:key})
            }
        }else{
            await $.post('/campus/set/leave/rule',{channel_action:key,default_rule:1})
            await $.post('/campus/leave/rule/enable',{channel_action:key})
        }
        init()
    }
    return (
        <div className="pb_20">
            <div className="mb_20">*仅对普通班学员有效，预约课的学员暂未开放在线请假功能</div>
            <table style={{width:'100%'}} className="bb_e1">
                <tr style={{height:50,background:'#FAFAFA'}} className="fb bb_e1">
                    <th style={{padding:'8px 10px',width:120,textAlign:'left'}}>内容</th>
                    <th style={{padding:'8px 10px',width:120,textAlign:'left'}}>启用状态</th>
                    <th style={{padding:'8px 10px',width:450,textAlign:'left'}}>规则</th>
                    <th style={{padding:'8px 10px',textAlign:'left'}}>说明</th>
                </tr>
                <tr style={{height:50}} className="bb_e1">
                    <td style={{padding:'8px 10px',width:120}} className="br_e1" rowSpan={3}>限制请假时间</td>
                    <td style={{padding:'8px 10px',width:120}} className="bb_e1">
                        <Switch onClick={()=>{bindSwitch('LEAVE_BEFORE')}} checkedChildren="ON" unCheckedChildren="OFF" checked={rule.LEAVE_BEFORE?.status==='ON'}/>
                    </td>
                    <td style={{padding:'8px 10px',width:450}} className="bb_e1">开课前1天不允许请假</td>
                    <td style={{padding:'8px 10px'}}>若上课时间是5月4日 16:00 则 5月3日 0点起无法进行请假</td>
                </tr>

                <tr style={{height:50}} className="bb_e1">
                    <td style={{padding:'8px 10px',width:120}}>
                        <Switch onClick={()=>{bindSwitch('LEAVE_SAMEDAY')}} checkedChildren="ON" unCheckedChildren="OFF" checked={rule.LEAVE_SAMEDAY?.status==='ON'}/>
                    </td>
                    <td style={{padding:'8px 10px',width:450}}>开课当天不允许请假</td>
                    <td style={{padding:'8px 10px'}}>若上课时间是5月4日 16:00 则 5月4日 0点起无法进行请假</td>
                </tr>

                <tr style={{height:50}}>
                    <td style={{padding:'8px 10px',width:120}}>
                        <Switch onClick={()=>{bindSwitch('LEAVE_HOUR')}} checkedChildren="ON" unCheckedChildren="OFF" checked={rule.LEAVE_HOUR?.status==='ON'}/>
                    </td>
                    <td style={{padding:'8px 10px',width:450}}>
                        <div className="box box-ac">
                            <div className="mr_6">开课前{rule.LEAVE_HOUR?.default_rule||1}小时不允许请假</div>
                            <img onClick={()=>rule_modal.open('规则')} className="pointer" style={{width:16,height:16}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                        </div>
                    </td>
                    <td style={{padding:'8px 10px'}}>若上课时间是5月4日 16:00 则16:00往前的设定小时内无法请假</td>
                </tr>
            </table>

            <Modals ref={ref=>rule_modal=ref}>
                <Form action="/campus/set/leave/rule" params={{channel_action:'LEAVE_HOUR'}} method="post" success={()=>{
                    init()
                    rule_modal.close()
                }}>
                    {({form,submit})=>(
                      <div className="box box-ver box-ac">
                        <div className="box box-pc box-ac">
                            <span>开课前</span> <Inputs value={rule.LEAVE_HOUR?.default_rule} className="mh_5" style={{width:100}} name="default_rule" form={form}/><span>小时不允许请假</span>
                        </div>
                        <div style={{color:'#EF5E53'}} className="mv_20">最多不得超过72小时</div>
                        <Btn onClick={submit}/>
                    </div>  
                    )}
                </Form>
            </Modals>
        </div>
    )
}