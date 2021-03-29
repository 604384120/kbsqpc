import React, { useEffect, useState } from 'react'
import {Tabs} from 'antd'
import {Modals,Btn,$} from '../comlibs'
import Comment from './comment'
import Point from './point'
import Leave from './leave'
import Power from './power'

export default function(props) {
    const { TabPane } = Tabs;
    let [txt,setTxt]=useState('')
    useEffect(()=>{
        (async ()=>{
            init()
        })()
    },[])
    async function init(){
        let res=await $.get('/campus/settings',{})
        setTxt(res.points_name)
    }
    
    return (
        <div className="bg_white mt_20 br_3">
             <Tabs>
                <TabPane tab="点评设置" key="comment" className="ph_15">
                    <Comment/>
                </TabPane>
                <TabPane tab="积分设置" key="point" className="ph_15">
                    <Point changeTxt={(text)=>{setTxt(text)}} txt={txt}/>
                </TabPane>
                <TabPane tab="请假设置" key="leave" className="ph_15">
                    <Leave/>
                </TabPane>
                <TabPane tab="权限设置" key="power" className="ph_15">
                    <Power/>
                </TabPane>
             </Tabs>
             
        </div>
    )
}