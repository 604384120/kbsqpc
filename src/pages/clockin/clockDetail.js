import React,{useState,useEffect} from 'react'
import {Btn,TablePagination,Method,Form, Inputs, Page} from '../comlibs'
import {Page_ChoiceClassStudent} from '../works'
import {Tabs,Popconfirm,Radio, Modal} from 'antd'
import Edit from './edit'
import DayDetail from './dayDetail'
import StuDetail from './stuDetail'

export default function(props){
    let parent=props.Parent
    let $=new Method()
    let {TabPane}=Tabs
    let {stu_tab,page_stu,rank_tab,cal_tab,page_edit,page_dayDetail,page_stuDetail,info,setInfo}={}
    let {uuid,type,clock}=parent.data
    if(type)parent.setCloseData(true)
    let init_tab=type==='stu'?'students':'calendar'

    let calendar_columns=[
        {
            title:'打卡日期',
            width:300,
            render(rs){
                return <span className="link" onClick={()=>{
                    page_dayDetail.open(rs.date+'打卡详情',{uuid,date:rs.date})
                }}>{rs.date}</span>
            }
        },{
            title:'提交人数',
            align:'center',
            dataIndex:'cnt_submit'
        },{
            title:'未提交人数',
            align:'center',
            dataIndex:'un_submit'
        },{
            title:'已点评',
            align:'center',
            dataIndex:'cnt_growing'
        }
    ]
    let student_columns=[
        {
            title:'学员姓名',
            width:300,
            render(rs){
                return <span className="link" onClick={()=>{
                    page_stuDetail.open('学员打卡详情',{clock_uuid:uuid,studentclock_uuid:rs.uuid})
                }}>{rs.student_name}</span>
            }
        },{
            title:'累计打卡天数',
            align:'center',
            dataIndex:'cnt_days'
        },{
            title:'未打卡天数',
            align:'center',
            dataIndex:'cnt_undays'
        },{
            title:'已点评',
            align:'center',
            dataIndex:'cnt_comments'
        },{
            title:'加入打卡时间',
            align:'center',
            dataIndex:'time_create'
        },{
            title:'操作',
            align:'center',
            render(rs){
                return <div>
                    <span className="link" onClick={()=>{
                        page_stuDetail.open('学员打卡详情',{clock_uuid:uuid,studentclock_uuid:rs.uuid})
                    }}>详情</span> |{" "}
                    {rs.cnt_days?(
                        <span className="fc_err link" onClick={()=>{
                            Modal.confirm({
                                icon:'warning',
                                title:'注意',
                                okText:'确认',
                                content: '当前学员有打卡数据，移除后所有的打卡数据都会清空。',
                                onOk:async ()=>{
                                    await $.post('/clock/remove/student',{clock_uuid:uuid,studentclock_uuid:rs.uuid})
                                    $.msg('移除成功！')
                                    refresh()
                                }
                              });
                        }}>移除</span>
                    ):(
                        <Popconfirm title={"确定移除此学员吗？"} onConfirm={async()=>{
                            await $.post('/clock/remove/student',{clock_uuid:uuid,studentclock_uuid:rs.uuid})
                            $.msg('移除成功！')
                            refresh()
                        }}>
                            <span className="fc_err link">移除</span>
                        </Popconfirm>
                    )}
                    
                </div>
            }
        }
    ]
    let rank_colums=[
        {
            title:'排名',
            dataIndex:'rank',
            width:200
        },
        {
            title:'学员姓名',
            dataIndex:'student_name',
            align:'center',
        },
        {
            title:'最大连续天数',
            dataIndex:'cnt_max',
            align:'center',
        },
        {
            title:'累计天数',
            dataIndex:'cnt_days',
            align:'center',
        }
    ]

    let refresh=()=>{
        cal_tab&&cal_tab.reload()
        rank_tab&&rank_tab.reload()
        stu_tab&&stu_tab.reload()
        init&&init()
        parent.setCloseData(true)
    }
    let init=async ()=>{
        let res=await $.get('/clock/detail',{clock_uuid:uuid})
        setInfo(res.clock)
    }

    let InfoBox=()=>{
        [info,setInfo]=useState(clock||{})
        useEffect(()=>{
            info.name||init()
        },[])

        return (
            <div className="bg_white br_2 pall_20 mt_20 mb_20">
                <div className="mb_16">
                    <span className="fb fs_24">{info.name}</span>
                    <Btn className="fl_r" onClick={()=>{
                        page_edit.open("修改打卡信息",{
                            type:'edit',
                            className:"bg_white br_2 pall_10 mt_20",
                            clock:info,
                            success:(res,edit)=>{
                                edit.close()
                                parent.setCloseData(true)
                                $.msg("修改成功!")
                                init()
                            },
                            Bottom:props=>{
                                let {submit}=props
                                return (
                                    <div className="mt_30 ta_c mb_20">
                                        <Btn onClick={(e)=>submit(e)}>确定</Btn>
                                    </div>
                                )
                            }
                        })
                    }}>修改</Btn>
                </div>
                <div className="mb_10 fs_16">
                    <span className="mr_65">打卡周期：{info.time_text}</span>
                    <span className="mr_65">补卡：{info.repair==='NO'?'不允许补打卡':'允许补打卡'}</span>
                    {info.teacher_names&&<span>打卡助教：{info.teacher_names}</span>}
                </div>
                <div className="fs_16">
                    <span className="mr_65">打卡进度：{info.already_days}天/{info.days}天</span>
                    <span>参与总人数：{info.cnt_students||0}人</span>
                </div>
            </div>
        )
    }


    return (
        <div>
            
            <InfoBox uuid={uuid} clock={clock}/>

            <div className="bg_white br_2 pall_20">
                <Tabs animated={false} defaultActiveKey={init_tab}>
                    <TabPane tab="打卡日历" key="calendar">
                        <TablePagination
                            api="/clock/calendar"
                            ref={ref=>(cal_tab=ref)}
                            params={{
                                clock_uuid:uuid
                            }}
                            columns={calendar_columns}
                            />
                    </TabPane>
                    <TabPane tab="学员列表" key="students">
                        <Form 
                            onSubmit={val=>stu_tab.search(val)}
                            >
                                {({form})=>(
                                    <div className="mb_10">
                                        <Inputs className="mr_8" style={{width:300}} placeholder="输入学员姓名、联系电话、首字母搜索" name="name" form={form}/>
                                        <Btn htmlType='submit'>搜索</Btn>
                                        <Btn className="fl_r" onClick={()=>{
                                            page_stu.open({onSure:async d=>{
                                                if(d.length>0){
                                                    await $.post('/clock/add/student',{clock_uuid:uuid,student_uuids:d.map(stu=>stu.student_uuid).join(',')})
                                                    refresh()
                                                }
                                            },course_params:{status:'online'}})
                                        }}>添加学员</Btn>
                                    </div>
                                )}
                        </Form>
                        <TablePagination
                            api="/clock/student"
                            ref={ref=>{stu_tab=ref}}
                            params={{
                                clock_uuid:uuid
                            }}
                            columns={student_columns}
                            />
                    </TabPane>
                    <TabPane tab="排行榜" key="Ranking">
                        <div className="box box-ac">
                            <Radio.Group defaultValue={'YES'} className="box pt_8" onChange={(val)=>{
                                rank_tab.search({max:val.target.value})
                            }}>
                                <Radio className="mr_8" value="YES">最大连续天数榜</Radio>
                                <Radio value="NO">累计天数榜</Radio>
                            </Radio.Group>
                        </div>

                        <TablePagination
                            api="/clock/rank"
                            ref={ref=>{rank_tab=ref}}
                            params={{
                                clock_uuid:uuid,
                                max:'YES'
                            }}
                            columns={rank_colums}
                            />
                    </TabPane>
                </Tabs>
            </div>

            <Page_ChoiceClassStudent ref={ref=>{page_stu=ref}}/>
            <Page ref={ref=>(page_edit=ref)}>
                <Edit/>
            </Page>
            <Page ref={ref=>{page_dayDetail=ref}} onClose={()=>{
                refresh()
            }}>
                <DayDetail/>
            </Page>
            <Page ref={ref=>{page_stuDetail=ref}} onClose={()=>{
                refresh()
            }}>
                <StuDetail/>
            </Page>
        </div>
    )
}