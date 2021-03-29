import React,{useState,useEffect} from 'react'
import {Tabs,Empty,Modal } from 'antd'
import {Method,Btn,TablePagination,Form,Inputs,Page} from '../comlibs'
import Add from './add'
import ClockDetail from './clockDetail'
import { Teacher,Poster } from '../works'

export default function(){
    const $ = new Method();
    const { TabPane } = Tabs;
    let {add_page,detail_page,tab,poster}={}
    let [show,setShow]=useState(false)
    let GlobalData = $.store().GlobalData;
    let columns=[
        {
            title:'打卡名称',
            width:200,
            render(rs){
                return <span className="link" onClick={()=>{
                    detail_page.open("学习打卡详情",{uuid:rs.uuid})
                }}>{rs.name}</span>
            }
        },{
            title:'开始日期',
            align:'center',
            dataIndex:'start_time'
        },{
            title:'结束日期',
            align:'center',
            dataIndex:'end_time'
        },{
            title:'打卡进度',
            align:'center',
            render(rs){
                return (
                    <div>{rs.already_days}/{rs.days}天</div>
                )
            }
        },{
            title:'参与人数',
            align:'center',
            dataIndex:'cnt_students',
            render(rs){
                return <span>{rs||0}</span>
            }
        },{
            title:'创建者',
            align:'center',
            dataIndex:'teacher_name'
        },{
            title:'操作',
            align:'center',
            render(rs){
                let time=rs.start_time+"至"+rs.end_time
                return (
                    <div>
                        <span className="fc_blue hover_line pointer" onClick={()=>poster.open('分享海报',{
                            api:'/poster/clock/share',
                            params:{
                                token:$.token(),
                                campus_uuid:$.campus_uuid(),
                                title:rs.name,
                                clockdate:time,
                                requirement:rs.memo||'',
                                page:'pages/clock/join',
                                scene:rs.uuid.replace(/-/g,'')
                            }
                        })}>分享</span>
                        <span className="mh_5" style={{color:'#E9E9E9'}}>|</span>
                        <span className="fc_err link pointer" onClick={()=>{
                            Modal.confirm({
                                icon:'warning',
                                title:'注意',
                                okText:'确认',
                                content: '删除后，所有的打卡数据都会清空',
                                onOk:async ()=>{
                                    await $.post('/clock/remove',{clock_uuid:rs.uuid})
                                    $.msg("删除成功！")
                                    tab.reload()
                                }
                            });
                        }}>删除</span>
                    </div>
                )
            }
        },
        
    ]
    useEffect(()=>{
        (async ()=>{
            let res=await $.get('/clock/list')
            if(!res.data)return
            if(res.data.length>0){
                setShow(true)
            }else{
                setShow(false)
            }
        })()
    },[])
    
    return (
        <div className="br_2 bg_white pall_10 mt_20" style={{minHeight:'600px'}}>
            <Tabs animated={false} defaultActiveKey="clockin">
				<TabPane tab="学习打卡" key="clockin">
                    {!show?(
                        <div style={{padding:'30px 0'}}>
                            <Empty
                                description={
                                    <span style={{display:'inline-block',width:'35%',margin:"0 auto"}}>
                                        学习打卡是以“天”为单位的打卡活动。学员需要每天提交打卡内容，适用于：阅读打卡、舞蹈基础训练打卡、练字打卡等，通过持续的每日打卡养成一些比较好的行为习惯。
                                    </span>
                                }
                            >
                                <Btn style={{width:100}} onClick={async ()=>{
                                    let res=await $.get('/campus/authority',{func_id:'TASK'})
                                    if(res.status){
                                        add_page.open('创建学习打卡')
                                    }else{
                                        Modal.info({
                                            title:'提示',
                                            content:'当前校区未开通学习打卡功能，请联系客服了解详情：400-766-1816'
                                        })
                                    }
                                }}>创建</Btn>
                            </Empty>
                        </div>
                    ):(
                        <div>
                            <Form
                                onSubmit={values => tab.search(values)}>
                                {({form,submit})=>(
                                    <div className="box mb_20">
                                        <div className="box box-1">
                                            <Inputs name="status" placeholder="请选择状态" autoSubmit={true} style={{marginRight:20}} form={form} value="" select={[
                                                {text:'全部状态',value:''},
                                                {text:'未开始',value:'UNSTART'},
                                                {text:'进行中',value:'ING'},
                                                {text:'已结束',value:'FINISHED'}
                                            ]}/>
                                            {GlobalData.user_power==='admin'&&<Teacher style={{width:150,marginRight:20}} autoSubmit={true} name="user_uuid" valName="user_uuid" form={form}/>}
                                            
                                            <Inputs name="name" form={form} style={{width:200,marginRight:20}} placeholder="输入打卡名称搜索"/>
                                            <Btn htmlType="submit">搜索</Btn>
                                        </div>
                                        <Btn className="fl_r" onClick={async ()=>{
                                            let res=await $.get('/campus/authority',{func_id:'TASK'})
                                            if(res.status){
                                                add_page.open('创建学习打卡')
                                            }else{
                                                Modal.info({
                                                    title:'提示',
                                                    content:'当前校区未开通学习打卡功能，请联系客服了解详情：400-766-1816'
                                                })
                                            }
                                        }}>创建学习打卡</Btn>
                                    </div>
                                )}
                            </Form>
                            <TablePagination 
                                ref={(ref)=>{tab=ref}} api="/clock/list" columns={columns}
                            />
                        </div>
                    )} 
                </TabPane>
            </Tabs>
            <Poster type="href" ref={ref => (poster = ref)} />
            <Page ref={(ref)=>{add_page=ref}} onClose={()=>{
                if(show){
                    tab&&tab.reload()
                }else{
                    setShow(true)
                }
                
            }}>
                <Add/>
            </Page>
            <Page ref={(ref)=>{detail_page=ref}} onClose={()=>{
                tab.reload()
            }}>
                <ClockDetail/>
            </Page>
        </div>
    )
}