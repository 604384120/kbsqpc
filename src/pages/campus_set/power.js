import React, { useEffect, useState } from 'react'
import {$} from '../comlibs'
import {Switch} from 'antd'

export default function(props){
    let [power,setPower]=useState({})
    useEffect(()=>{
        init()
    },[])
    async function init(){
        let res=await $.get('/teacher/power/detail')
        setPower(res)
    }
    async function bindSwith(key){
        let val=power[key].status==='ON'?'OFF':'ON'
        await $.post('/teacher/power/set',{[key]:val})
        init()
    }

    return (
        <div className="pb_20 ta_c">
            <table style={{width:'100%'}}>
                <tr style={{background:'rgb(250, 250, 250)'}} className="bb_1">
                    <td>功能</td>
                    <td className="pv_10">
                        权限
                    </td>
                    <td>普通老师</td>
                </tr>
                <tr className="bb_1">
                    <td rowSpan={4} className="br_1">班级</td>
                    <td className="pv_10">允许创建&删除&编辑本班班级</td>
                    <td>
                        <Switch onClick={()=>bindSwith('edit_group')} checked={power.edit_group?.status==='ON'}/>
                    </td>
                </tr>
                <tr className="bb_1">
                    <td className="pv_10">允许添加&删除&修改本班课节</td>
                    <td>
                        <Switch onClick={()=>bindSwith('group_lesson')} checked={power.group_lesson?.status==='ON'}/>
                    </td>
                </tr>
                <tr className="bb_1">
                    <td className="pv_10">允许添加&退班&移除本班学员</td>
                    <td>
                        <Switch onClick={()=>bindSwith('edit_student')} checked={power.edit_student?.status==='ON'}/>
                    </td>
                </tr>
                {/* <tr>
                    <td className="pv_10">允许进行升班操作</td>
                    <td>
                        <Switch onClick={()=>bindSwith('edit_student')} checked={power.edit_student?.status==='ON'}/>
                    </td>
                </tr> */}
                <tr className="bb_1">
                    <td className="pv_10">允许进行结班&取消结班操作</td>
                    <td>
                        <Switch onClick={()=>bindSwith('end_group')} checked={power.end_group?.status==='ON'}/>
                    </td>
                </tr>

                <tr className="bb_1">
                    <td rowSpan={3} className="br_1">学员</td>
                    <td className="pv_10">允许查看&拨打本班学员电话号码</td>
                    <td>
                        <Switch onClick={()=>bindSwith('student_phone')} checked={power.student_phone?.status==='ON'}/>
                    </td>
                </tr>
                
                <tr className="bb_1">
                    <td className="pv_10">允许修改本班学员基本信息</td>
                    <td>
                        <Switch onClick={()=>bindSwith('student_info')} checked={power.student_info?.status==='ON'}/>
                    </td>
                </tr>
                <tr className="bb_1">
                    <td className="pv_10">允许创建&删除学员</td>
                    <td>
                        <Switch onClick={()=>bindSwith('edit_campus_student')} checked={power.edit_campus_student?.status==='ON'}/>
                    </td>
                </tr>
            </table>
        </div>
    )
}