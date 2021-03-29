import React, { useEffect, useState } from 'react'
import {Alert,Tabs,Button,Dropdown,Menu,Checkbox} from 'antd'
import {$,TablePagination,Form,Inputs,Modals} from '../comlibs'
import StudentList from './StudentList'
import BirthdayList from './birthdayList'
import GroupList from './groupList'


export default function(){
    let {video_modal,tabs,setTabs,current,setCurrent}={}
    useEffect(()=>{
        getCount()
    },[])
    let power=$.store().GlobalData.user_power

    let getCount=async (active=0)=>{
        let res=await $.get(`/campusstudent/count/${$.campus_uuid()}`)
        let res2=await $.get(`/campusstudent/screen`,{birthday_month: 'CURRENT'})
        let count=res
        count.birthday=res2.length
        setTabs({count,active})
    }

    let TabsBox=()=>{
        [tabs,setTabs]=useState({})
        let {count={},active=0}=tabs
        return (
            <div className="bb_1 box box-ps box-ac ph_20">
                <div className="box box-ac fs_16 mr_32 pointer" style={{height:47,borderBottom:active===0?'2px solid #1BACF4':'2px solid white',color:active===0?'#1BACF4':'#000'}} onClick={()=>{
                    setTabs({count,active:0})
                    setCurrent(0)
                }}>
                    正式学员({count.formal||0})
                </div>
                <div className="box box-ac fs_16 mr_32 pointer" style={{height:47,borderBottom:active===1?'2px solid #1BACF4':'2px solid white',color:active===1?'#1BACF4':'#000'}} onClick={()=>{
                    setTabs({count,active:1})
                    setCurrent(1)
                }}>
                    意向学员({count.intentional||0})
                </div>
                <div className="box box-ac fs_16 mr_32 pointer" style={{height:47,borderBottom:active===2?'2px solid #1BACF4':'2px solid white',color:active===2?'#1BACF4':'#000'}} onClick={()=>{
                    setTabs({count,active:2})
                    setCurrent(2)
                }}>
                    毕业学员({count.graduated||0})
                </div>
                <div className="box box-ac fs_16 mr_32 pointer" style={{height:47,borderBottom:active===3?'2px solid #1BACF4':'2px solid white',color:active===3?'#1BACF4':'#000'}} onClick={()=>{
                    setTabs({count,active:3})
                    setCurrent(3)
                }}>
                    本月生日学员({count.birthday||0})
                </div>
                {power!='teacher'&&(
                    <div className="box box-ac fs_16 mr_32 pointer" style={{height:47,borderBottom:active===4?'2px solid #1BACF4':'2px solid white',color:active===4?'#1BACF4':'#000'}} onClick={()=>{
                        setTabs({count,active:4})
                        setCurrent(4)
                    }}>
                        分组管理
                    </div>
                )}
                
            </div>
        )
    }
    let TabBodyBox=()=>{
        [current,setCurrent]=useState(0)
        return (
            <div className="pall_20">
                {current===0&&<StudentList type="formal" getCount={getCount}/>}
                {current===1&&<StudentList type="intentional" getCount={getCount}/>}
                {current===2&&<StudentList type="graduated" getCount={getCount}/>}
                {current===3&&<BirthdayList getCount={getCount}/>}
                {current===4&&<GroupList/>}
            </div>
        )
    }


    return (
        <div className="mt_15">
            <Alert message={(
                <div>
                    学员关注公众号，即可接收到机构的消息通知
                    <span className="link mr_8 ml_8" onClick={()=>{
                        video_modal.open('视频教程')
                    }}>[学员管理视频教程]</span>
                    <a target="_blank" href="https://mp.weixin.qq.com/s/82mVK7L-mRRof9diFPeG6g" className="link">[学员订阅消息教程]</a>
                </div>
            )} type="warning" />
            <div className="br_3 bg_white mt_15">
                <TabsBox/>
                {/* <Tabs animated={false} defaultActiveKey="formal" renderTabBar={(props, DefaultTabBar)=>
                    (
                        <DefaultTabBar {...props} style={{padding:'0 20px',borderBottom:'1px solid #e6e6e6' }} />
                    )
                }>
                    <TabPane key="formal" tab={<FormalHead/>} className="ph_20 pb_20"> */}
                        
                    {/* </TabPane> */}
                    {/* <TabPane key="intentional" tab={<IntentionalHead/>} className="ph_20 pb_20"> */}
                        
                    {/* </TabPane> */}
                    {/* <TabPane key="graduated" tab={GraduatedHead()} className="ph_20 pb_20"> */}
                        
                    {/* </TabPane> */}
                    {/* <TabPane key="birthday" tab={BirthdayHead()} className="ph_20 pb_20"> */}
                        
                    {/* </TabPane> */}
                    {/* <TabPane key="group" tab={<span>分组管理</span>} className="ph_20 pb_20"> */}

                    {/* </TabPane> */}
                {/* </Tabs> */}
                <TabBodyBox/>

            </div>
            <Modals width="1067px" ref={ref=>video_modal=ref} bodyStyle={{padding:0}}>
                <video style={{height:600,marginBottom:'-5px',borderRadius:'0 0 4px 4px'}} autoPlay controls src="https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/1importstudents.Ogg"/>
            </Modals>
        </div>
    )
}