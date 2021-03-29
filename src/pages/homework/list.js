import React,{useState,useEffect} from 'react'
import {$,Btn,Form,Inputs,TablePagination,Page} from '../comlibs'
import {Teacher,Subject,Class} from '../works'
import {Tabs,Empty,Tooltip,Modal} from 'antd'
import Add from './add'
import Detail from './detail'
import Service from "../other/service"

export default function(){
    const { user_power } = $.store().GlobalData;
    const { TabPane } = Tabs;
    let {add_page,detail_page,tab}={}
    let [isEmpty,setIsEmpty]=useState(true)
    let init=async ()=>{
        let res=await $.get('/testpaper/list')
        if(!res.data)return
        setIsEmpty(res.data.length===0?true:false)
    }

    let columns=[
        {
            title:'序号',
            dataIndex:'_key',
            align:'center'
        },
        {
            title:'标题',
            width:400,
            render(rs){
                return <span className="link" onClick={()=>{detail_page.open('作业详情',{uuid:rs.uuid})}}>{rs.title}</span>
            }
        },
        {
            title:'布置老师',
            dataIndex:'oper.name',
        },
        {
            title:'布置人数',
            dataIndex:'cnt_assign',
            align:'center',
            render(rs){
                return rs||'-'
            }
        },
        {
            title:'提交人数',
            dataIndex:'cnt_commit',
            align:'center',
            render(rs){
                return rs||'-'
            }
        },
        {
            title:'已批改',
            dataIndex:'cnt_review',
            align:'center',
            render(rs){
                return rs||'-'
            }
        },
        {
            title:'状态',
            dataIndex:'date',
            render(rs){
                return rs?<span style={{color:'#8BD881'}}>已发布</span>:<span style={{color:'#DDAD58'}}>草稿</span>
            }
        },
        {
            title:'日期',
            align:'center',
            render(rs){
                return rs.date?<span>{rs.date}({rs.week})</span>:'-'
            }
        },
        {
            title:'操作',
            render(rs){
                return (
                    <div>
                        <span className="fc_err pointer" onClick={()=>{
                            Modal.confirm({
                                title:'提示',
                                content:'确定删除此作业吗?',
                                async onOk(){
                                    await $.get(`/testpaper/${rs.uuid}/remove`)
                                    $.msg('删除成功！')
                                    tab.reload()
                                }
                            })
                        }}>删除</span>
                    </div>
                )
            }
        }
    ]
    useEffect(()=>{
        init()
    },[])
    return (
        <div className="ph_10 pb_20 mt_20 bg_white br_3 minH">
            <Tabs defaultActiveKey="0">
                <TabPane tab="日常作业" key="0">
                    {isEmpty?(
                        <div className="mt_30">
                            <Empty 
                                description={
                                    <span className="ta_c mt_20 fc_black2">
                                        <span className="mb_15 fs_17 dis_b">通过图片、语音、文字发布和批改作业，进行一对一指导，了解学员课程掌握程度</span>
                                        <Btn className="mb_15" onClick={async ()=>{
                                            let res=await $.get('/campus/authority',{func_id:'HOMEWORK'})
                                            if(res.status){
                                                add_page.open('发布作业')
                                            }else{
                                                Modal.info({
                                                    title:'提示',
                                                    content:'当前校区未开通布置作业功能，请联系客服了解详情：400-766-1816'
                                                })
                                            }
                                        }}>布置作业</Btn>
                                        <Tooltip title={()=>(
                                           <Service />
                                        )}>
                                            <span className="dis_b">（此功能需要购买学员端进行使用，您可以<span className="link">联系客服</span>进行了解。）</span>
                                        </Tooltip>,
                                        
                                    </span>
                                }
                            />
                        </div>
                    ):(
                        <div>
                            <Form
                                onSubmit={(val, btn)=>{
                                    tab.search(val);
                                    btn.loading = false;
                                }}
                                >
                                {({form,submit})=>(
                                    <div className="mb_15">
                                        <Class
                                            width={160}
                                            autoSubmit={true}
                                            no_normal={true}
                                            className="mr_8"
                                            is_end="NO"
                                            placeholder="选择布置的班级"
                                            name="group_uuid"
                                            form={form}
                                        />
                                        {user_power!='teacher'?<Teacher showPhone={true} autoSubmit={true} style={{width:160}}  placeholder="请选择布置老师" className="mr_8" form={form} name="teacher_uuid"/>:<span></span>}
                                        
                                        <Subject autoSubmit={true} style={{width:120}} placeholder="作业科目" className="mr_8" form={form} name="examsubject_uuid"/>
                                        <Inputs style={{width:170}} placeholder="输入作业标题搜索" className="mr_8" form={form} name="testpaper_title"/>
                                        <Btn iconfont="sousuo" onClick={submit}>搜索</Btn>
                                        <Btn className="fl_r" onClick={async ()=>{
                                            let res=await $.get('/campus/authority',{func_id:'HOMEWORK'})
                                            if(res.status){
                                                add_page.open('发布作业')
                                            }else{
                                                Modal.info({
                                                    title:'提示',
                                                    content:'当前校区未开通布置作业功能，请联系客服了解详情：400-766-1816'
                                                })
                                            }
                                        }}>布置作业</Btn>
                                    </div>
                                )}
                            </Form>
                            <TablePagination
                                ref={ref=>{tab=ref}}
                                api="/testpaper/list"
                                columns={columns}
                            />

                        </div>
                    )}
                    

                </TabPane>
                <TabPane tab="打卡作业" key="1">
                    <div style={{marginTop:80}}>
                        <Empty
                            description={
                                <span className="ta_c fc_black2">
                                    <Tooltip title={()=>(
                                        <Service />
                                    )}>
                                        <span className="dis_b">打卡作业功能即将上线，您可以<span className="link">联系客服</span>了解相关信息。</span>
                                    </Tooltip>
                                </span>
                            }
                        />
                    </div>
                </TabPane>
            </Tabs>

            <Page ref={ref=>(add_page=ref)} onClose={()=>{
                setIsEmpty(false)
                tab&&tab.reload()
            }}>
                <Add/>
            </Page>
            <Page ref={ref=>{detail_page=ref}} onClose={()=>{
                tab&&tab.reload()
            }}>
                <Detail/>
            </Page>
        </div>
    )
}