import React, { useEffect, useState } from 'react'
import {Switch, Table} from 'antd'
import {Modals,Btn,$,Form,Inputs} from '../comlibs'

export default function(){
    let [set,setSet]=useState({})
    let {demo,additem_modal,coupon_modal,share_modal,thumb_modal,browse_modal}={}
    let [clist,setClist]=useState([])
    useEffect(()=>{
        init();
        getClist();
    },[])
    async function init(){
        let res=await $.get('/campus/settings',{})
        setSet(res)
    }
    async function getClist(){
        let res=await $.get('/campus/markting/coupons',{})
        setClist(res)
    }
    
    /**
     * 优惠券列表
     */
    function CouponList(){
        return (
            <div>
                {clist.length?(<div style={{height:50,background:'#FAFAFA',borderBottom:'1px solid #eee',padding:'15px 20px'}} className="box fb mt_16">
                    <div style={{width:'20%'}}>优惠券名称</div>
                    <div style={{width:'15%'}}>使用范围</div>
                    <div className="box-1">
                        面额
                    </div>
                    <div style={{width:'120px'}}>操作</div>
                </div>):''}
                {clist.map((c,i)=>{
                    let arr=[]
                    if(c.deduct){
                        arr.push(`立减${c.deduct}元`)
                    }
                    if(c.exceed){
                        arr.push(`满${c.exceed}元可用`)
                    }
                    if(c.discount){
                        arr.push(`${c.discount}折优惠`)
                    }
                    if(c.max_discount){
                        arr.push(`最高可减${c.max_discount}元`)
                    }
                    return (
                    <div style={{height:50,borderBottom:'1px solid #eee',padding:'15px 20px'}} className="box">
                        <div style={{width:'20%'}}>{c.name}</div>
                        <div style={{width:'15%'}}>{c.coupon_type==='ZHEKOU'&&'部分课程'}{c.coupon_type==='MANJIAN'&&'通用券'}</div>
                        <div className="box-1">
                            {arr.join('，')}
                        </div>
                        <div style={{color:'#f07070',width:'120px'}} className="pointer" onClick={async ()=>{
                            clist.splice(i,1)
                            await $.post('/campus/markting/coupons',{coupon_uuids:clist.map(c=>c.coupon_uuid)})
                            getClist()
                        }}>取消关联</div>
                    </div>
                    )
                })}
                {clist.length<3&&(
                    <div className="box box-pc mt_15">
                        <Btn onClick={async ()=>{
                            let res=await $.get(`/campus/${$.campus_uuid()}/coupons`,{})
                            let list=res.usable.map(c=>{
                                c.key=c.uuid
                                return c
                            })
                            coupon_modal.open('选择关联的优惠券',list)
                    }}>+关联优惠券</Btn>
                    </div>
                )}
                
            </div>
        )
    }
    /**
     * 选择优惠券弹框
     */
    function ChooseCouponBox(props){
        let {list}=props
        let [keys,setkeys]=useState(clist.map(c=>c.coupon_uuid))
        let columns=[
            {
                title:'优惠券名称',
                dataIndex:'name'
            },
            {
                title:'使用范围',
                dataIndex:'name'
            },
            {
                title:'面额',
                key:'comment',
                render(rs){
                    let arr=[]
                    if(rs.deduct){
                        arr.push(`立减${rs.deduct}元`)
                    }
                    if(rs.exceed){
                        arr.push(`满${rs.exceed}元可用`)
                    }
                    if(rs.discount){
                        arr.push(`${rs.discount}折优惠`)
                    }
                    if(rs.max_discount){
                        arr.push(`最高可减${rs.max_discount}元`)
                    }
                    return <span>{arr.join('，')}</span>
                }
            }
        ]
        return (
            <div>
                {list.length?(
                    <div>
                        <div className="box box-ac mb_10">
                            <div className="box-1" style={{color:'#f9af36'}}>已选择<span className="fb box-1 fc_black mh_5">{keys.length}</span>张优惠券</div>
                            <Btn onClick={async ()=>{
                                await $.post('/campus/markting/coupons',{coupon_uuids:keys})
                                getClist()
                                coupon_modal.close()
                            }}></Btn>
                        </div>
                        <Table rowSelection={{
                            selectedRowKeys:keys,
                            onChange:(select)=>{
                                if(select.length>3){
                                    $.warning('最多只能选3张优惠券哦~')
                                    return
                                }
                                setkeys(select)
                            }
                        }} columns={columns} dataSource={list}/>
                    </div>
                ):(
                    <div className="box box-ver box-ac box-pc" style={{padding:'60px 0'}}>
                        <img style={{width:160,height:101}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/2e2a485a-0ffa-11ea-ac92-00163e04cc20.png"/>
                        <div style={{color:'#999A9E'}} className="mv_20">当前无可用的优惠券~</div>
                        <span className="link underline" onClick={()=>{
                            window.open(`/pc#/coupon_index`,"_blank")
                        }}>点击创建</span>
                    </div>
                )}
                
            </div>
        )
    }
    // 点评积分设置
    function CommentJifenBox(){
        return (
            <div>
                <hr style={{border: '0.5px dashed #D7D7D7',background: '#fff',padding:'1px 0'}} className="mv_20"/>
                <div className="mb_10">
                    <span className="fw_600 fs_16">点评积分设置</span>
                </div>
                <table style={{width:'100%'}}>
                    <tr style={{height:'48px',background:'#FAFAFA',borderBottom:'1px solid #E8E8E8'}}>
                        <th className="ph_15 pv_13" style={{width:150}}>动作</th>
                        <th className="ph_15 pv_13" style={{width:150}}>状态</th>
                        <th className="ph_15 pv_13">说明</th>
                        <th className="ph_15 pv_13">规则</th>
                    </tr>
                    <tr style={{borderBottom:'1px solid #E8E8E8'}} className="pv_13">
                        <td className="ph_15 pv_13">分享</td>
                        <td className="ph_15 pv_13"><Switch/></td>
                        <td className="ph_15 pv_13">每个点评被家长分享后可获得积分</td>
                        <td className="ph_15 pv_13">
                            <div className="box box-ac mb_5">
                                <span className="mr_6">分享好友+3积分</span>
                                <img className="pointer" onClick={()=>share_modal.open('规则')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                            <div className="box box-ac mb_5">
                                <span className="mr_6">分享海报至朋友圈+3分</span>
                                <img className="pointer" onClick={()=>share_modal.open('规则')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                            <div className="box box-ac">
                                <span className="mr_6">每日最多可获得+10分</span>
                                <img className="pointer" onClick={()=>share_modal.open('规则')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                            </div>
                        </td>
                    </tr>
                    <tr style={{borderBottom:'1px solid #E8E8E8'}} className="pv_13">
                        <td className="ph_15 pv_13">浏览</td>
                        <td className="ph_15 pv_13"><Switch/></td>
                        <td className="ph_15 pv_13">每个点评分享后被浏览后可获得积分</td>
                        <td className="ph_15 pv_13 box box-ac">
                            <span className="mr_6">每个点评，每10人浏览可获得3积分，最多获得30积分</span>
                            <img className="pointer" onClick={()=>browse_modal.open('规则')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                        </td>
                    </tr>
                    <tr style={{borderBottom:'1px solid #E8E8E8'}} className="pv_13">
                        <td className="ph_15 pv_13">点赞</td>
                        <td className="ph_15 pv_13"><Switch/></td>
                        <td className="ph_15 pv_13">每个分享的点评被赞后可获得积分</td>
                        <td className="ph_15 pv_13 box box-ac">
                            <span className="mr_6">每个点评，获得1次赞可获得1积分，最多可获得20积分</span>
                            <img className="pointer" onClick={()=>thumb_modal.open('规则')} width="16px" height="16px" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/158b349c-fedb-11e9-990e-00163e04cc20.png"/>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }


    return (
        <div style={{padding:'0 0 20px'}}>
            <div className="mb_10">
                <span className="fw_600 fs_16 mr_6">学员点评设置</span>
                <span className="fs_13 mr_6">在学员单独点评中可自定义评分项</span>
                <span className="fs_13 fc_blue pointer hover_line" onClick={()=>demo.open('示例','https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/32051f72-1fe4-11eb-a80d-00163e04cc20.png')}>查看示例</span>
            </div>
            <div className="box">
                {set.review_grasp_items?.map((c,i)=>(
                    <div style={{height:32,border:'1px solid rgba(27, 172, 244, 1)'}} className="br_3 box box-ac ph_15 mr_15">
                        <span style={{color:'rgba(27, 172, 244, 1)',lineHeight:'32px'}} className="mr_15">{c}</span>
                        <img onClick={async ()=>{
                            let temp=[].concat(set.review_grasp_items)
                            temp.splice(i,1)
                            await $.post('/campus/settings',{setting_name:'review_grasp_items',setting_value:temp})
                            init()
                        }} className="box pointer" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/e07bbe80-4d62-11ea-ac9d-00163e04cc20.jpeg"/>
                    </div>
                ))}
                <Btn style={{height:32}} onClick={()=>{
                    if(set.review_grasp_items?.length>=5){
                        $.msg('评分项不能超过五项')
                        return
                    }
                    additem_modal.open('添加评分项')
                }}>+添加评分项</Btn>
            </div>
            <hr style={{border: '0.5px dashed #D7D7D7',background: '#fff',padding:'1px 0'}} className="mv_20"/>
            <div className="mb_10">
                <span className="fw_600 fs_16 mr_6">分享营销引流设置</span>
                <span className="fs_13 mr_6">点评分享页面底部可选择表单提交或者领取优惠券，只可单选</span>
            </div>

            <div style={{"background":"rgba(250,250,250,1)","border-radius":"3px","border":"1px solid #eee"}} className="box box-1 pv_15 ph_25 mb_15">
                <div className="box box-1">
                    <div className="fw_600" style={{width:100}}>表单提交</div>
                    <span className="fc_blue pl_32 hover_line pointer"  onClick={()=>{
                        demo.open('示例','https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/218f554a-1e77-11eb-a80c-00163e04cc20.png')
                    }}>查看示例</span>
                </div>
                <Switch checkedChildren="ON" unCheckedChildren="OFF" checked={set.review_marketing==='userask'} onClick={async ()=>{
                    if(set.review_marketing==='userask'){
                        await $.post('/campus/settings',{setting_name:'review_marketing',setting_value:'no'})
                    }else{
                        await $.post('/campus/settings',{setting_name:'review_marketing',setting_value:'userask'})
                    }
                    init()

                }}/>
            </div>
            <div style={{"background":"rgba(250,250,250,1)","border-radius":"3px","border":"1px solid #eee"}} className="box box-1 pv_15 ph_25 MT-10">
                <div className="box box-1">
                    <div className="fw_600" style={{width:100}}>领取优惠券</div>
                    <span className="fc_blue pl_32 hover_line pointer"  onClick={()=>{
                        demo.open('示例','https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/822bd8b0-1e77-11eb-a80c-00163e04cc20.png')
                    }}>查看示例</span>
                </div>
                <Switch checkedChildren="ON" unCheckedChildren="OFF" checked={set.review_marketing==='coupon'} onClick={async ()=>{
                    if(set.review_marketing==='coupon'){
                        await $.post('/campus/settings',{setting_name:'review_marketing',setting_value:'no'})
                    }else{
                        await $.post('/campus/settings',{setting_name:'review_marketing',setting_value:'coupon'})
                    }
                    init()
                }}/>
            </div>
            <CouponList/>

            {/* <CommentJifenBox/> */}
            
            {/* 分享规则弹窗 */}
            <Modals ref={ref=>share_modal=ref}>
                {()=>(
                    <Form>
                        {({form})=>(
                            <div>
                                <div className="box box-ac box-pc mb_20">
                                    <div style={{width:120}} className="ta_r">分享好友获得</div>
                                    <Inputs style={{width:90}} className="mh_10" form={form} name="xx"/>
                                    <span>积分</span>
                                </div>
                                <div className="box box-ac box-pc mb_20">
                                    <div style={{width:120}} className="ta_r">分享好友至朋友圈</div>
                                    <Inputs style={{width:90}} className="mh_10" form={form} name="xx"/>
                                    <span>积分</span>
                                </div>
                                <div className="box box-ac box-pc mb_20">
                                    <div style={{width:120}} className="ta_r">每日最多可得</div>
                                    <Inputs style={{width:90}} className="mh_10" form={form} name="xx"/>
                                    <span>积分</span>
                                </div>
                                <div className="box box-pc">
                                    <Btn>确 定</Btn>
                                </div>
                            </div>
                        )}
                        
                    </Form>
                )}
            </Modals>
            {/* 点赞规则弹窗 */}
            <Modals ref={ref=>thumb_modal=ref} width={400}>
                {()=>(
                    <Form>
                        {({form})=>(
                            <div>
                                <div className="mb_20 box box-ac">
                                    <span>每个点评，获得1次赞可获得</span>
                                    <Inputs className="mh_10" form={form} style={{width:70}} name="xx"/>积分,
                                </div>
                                <div className="box box-ac">
                                    最多获得<Inputs className="mh_10" style={{width:70}} form={form} name="xx"/>积分
                                </div>
                                <div className="box box-pc mt_20"><Btn>确 定</Btn></div>
                                
                            </div>
                        )}
                    </Form>
                )}
            </Modals>
            {/* 浏览规则弹窗 */}
            <Modals ref={ref=>browse_modal=ref}>
                {()=>(
                    <Form>
                        {({form})=>(
                            <div>
                                <div className="mb_20 box box-ac">
                                    <span className="mr_6">每个点评，每</span><Inputs className="mh_10" style={{width:70}} name="num" form={form}/>人浏览可获得<Inputs className="mh_10" style={{width:70}} name="num" form={form}/>积分，
                                </div>
                                <div className="box box-ac mb_20">
                                    <span className="mr_6">做多可获得积分</span><Inputs className="mh_10 ml_5" name="num" style={{width:70}} form={form}/>
                                </div>
                                <div>
                                    <span style={{color:'#F5222D'}}>*</span>
                                    <span style={{opacity:'.45'}}>不足浏览人数时，不计分。</span>
                                </div>
                                <div className="box box-pc">
                                    <Btn>确 定</Btn>
                                </div>
                            </div>
                        )}
                        
                    </Form>
                )}
            </Modals>


            <Modals ref={ref=>additem_modal=ref} width="400px">
                <Form onSubmit={async (val,e)=>{
                    set.review_grasp_items.push(val.name)
                    await $.post('/campus/settings',{setting_name:'review_grasp_items',setting_value:set.review_grasp_items})
                    init()
                    additem_modal.close()
                }}>
                    {({form,submit})=>(
                        <div className="box box-ver box-ac">
                            <div className="box box-ac box-pc mb_20">
                                <span className="mr_10">评分项名</span>
                                <Inputs form={form} maxLength={4} placeholder="不超过4个字" name="name"/>
                            </div>
                            <Btn onClick={submit}>确 定</Btn>
                        </div>
                    )}
                </Form>
            </Modals>
            <Modals ref={ref=>demo=ref}>
                 {(url)=>(
                     <div style={{paddingBottom:'20px'}} className="box box-pc">
                        <img className="pst_abs" style={{width:'411px',zIndex:3,userSelect: 'none',pointerEvents: 'none'}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/f7f78b2a-1e77-11eb-a80c-00163e04cc20.png"/>
                        <div className="pst_rel box box-pc demo_scroll" style={{height:'757px',width:'411px',overflow: 'auto',borderRadius:'63px'}}>
                            <img className="pst_abs" style={{left:28,top:20,width:'87%',zIndex:0}} src={url}/>
                        </div>
                     </div>
                 )}
             </Modals>

             <Modals ref={ref=>coupon_modal=ref} width={800}>
                {(list)=>{
                    return (
                        <div>
                            <ChooseCouponBox list={list}/>
                        </div>
                    )
                }}
             </Modals>
        </div>
    )
}