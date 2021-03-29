import React, { useState, useEffect } from "react";
import { TablePagination, Form, Inputs,Btn,$,Page, FixedBox} from "../comlibs";
import { Checkbox, Modal ,Tooltip} from "antd";
import Moment from 'moment'
import Edit from './batchEditLesson'

export default function (props) {
  let parent = props.Parent;
  let {tab,edit_page}={}
  let {all,setAll,group_uuid,student_uuids,type,onSure,select,setSelect}=parent.data
  useEffect(()=>{
    getAll({
      min_date:$.dateFormat(new Date,'YYYY-MM-DD'),
      max_date:$.dateFormat(Moment(new Date).add(1,'years')._d,'YYYY-MM-DD')
    })
  },[])
  let getAll=async (val)=>{
    let res=await $.get("/lessons/batch/operation",Object.assign({
      group_uuid,
      limit:9999,   
    },val))
    setAll(res.data)
    tab.delSelectionAll()
  }
  let columns=[
      {
          title:'序号',
          dataIndex:'_key'
      },{
          title:'上课日期',
          dataIndex:'lessondate',
          render(text, rs){
            if(rs.is_end==='YES'){
              return (
                <Tooltip placement="top" title={'该课节已结课无法选择'}>
                  <div>{rs.lessondate} {rs.week}</div>
                </Tooltip>
              )
            }
            return <div>{rs.lessondate} {rs.week}</div>
        }
      },{
        title:'上课时间',
        key:'starttime',
        render(rs){
            return <div>{rs.starttime}-{rs.endtime}</div>
        }
      },{
        title:'授课老师',
        key:'teachers',
        render(rs){
            return <div>{rs.teachers&&rs.teachers.length?rs.teachers.map(t=>t.name).join(','):'-'}</div>
        }
      },{
        title:'助教',
        key:'assistants',
        render(text, rs){
            return <div>{rs.assistants&&rs.assistants.length?rs.assistants.map(t=>t.name).join(','):'-'}</div>
        }
      }
  ]
  // 全选所有课节
  let CheckAll=()=>{
    [select,setSelect]=useState([])
    return (
      <div>
        <Checkbox onChange={e=>{
            if(e.target.checked){
                tab.selectRowAll(all)
            }else{
                tab.delSelectionAll()
            }
        }}>全选所有课节</Checkbox>
        <Bottom/>
      </div>
    )
  }

  let Bottom=()=>{
    return (
      <div>
        {type==='select'?(
        <FixedBox>
          <div style={{width:'100%'}} className="box box-ac">
            <Btn className="mr_10" type="default" onClick={()=>{
                parent.close()
            }}>取消</Btn>
            <Btn className="mr_10" onClick={()=>{
              let uuids=Object.keys(tab.selectedRowObjs)
              if(!uuids.length){
                $.msg('请选择课节后操作!')
                return
              }
              Modal.confirm({
                title:'添加学员',
                content:`确定将${student_uuids.length}名学员加入到${uuids.length}节课节中吗？`,
                onOk(){
                  onSure&&onSure(uuids)
                  parent.close(true)
                }
              })
                
            }}>确定</Btn>
            <span className="fc_err">已选{select.length}节课</span>
          </div>
        </FixedBox>
      ):(
        <FixedBox>
          <Btn onClick={()=>{
            parent.close(true)
          }}>关闭</Btn>
        </FixedBox>
      )}
      </div>
    )
  }

  let TableBox=()=>{
    [all,setAll]=useState([])
    return (
      <TablePagination ref={ref=>tab=ref} onRow api="/lessons/batch/operation" list={all} params={
          {
            group_uuid,
            min_date:$.dateFormat(new Date,'YYYY-MM-DD'),
            max_date:$.dateFormat(Moment(new Date).add(1,'years')._d,'YYYY-MM-DD')
          }
        } columns={columns} rowSelection getCheckboxProps={row=>({
          disabled:row.is_end==='YES'
        })}
        onSelection={(keys)=>{
          if(Object.keys(keys).length){
            setSelect&&setSelect(Object.keys(keys))
          }else{
            setSelect&&setSelect([])
          }
        }}
      />
    )
  }
  

  return (
    <div className="mt_20 bg_white pall_20 br_3">
      <Form onSubmit={val=>{
        if(val.date){
          val.min_date=val.date[0]
          val.max_date=val.date[1]
        }
        tab.search(val)
        getAll(val)
      }}>
        {({ form }) => (
          <div>
            <div className="box">
              <Inputs
                autoSubmit
                className="mr_16"
                form={form}
                name="date"
                format="YYYY-MM-DD"
                value={[Moment(new Date()), Moment(new Date()).add(1, "years")]}
                placeholder={["不限", "不限"]}
                type="rangePicker"
              />
              <Inputs
                autoSubmit
                form={form}
                type="timePicker"
                name="start_time"
                className="mr_16"
                placeholder="开始时间"
              />
              <Inputs
                autoSubmit
                form={form}
                type="timePicker"
                name="end_time"
                placeholder="结束时间"
                className="mr_16"
              />
              <Inputs
                form={form}
                name="weeks"
                mode="multiple"
                autoSubmit
                style={{minWidth:300}}
                type="select"
                placeholder="选择周几"
                select={[
                  {
                    text: "周一",
                    value: 0,
                  },
                  {
                    text: "周二",
                    value: 1,
                  },
                  {
                    text: "周三",
                    value: 2,
                  },
                  {
                    text: "周四",
                    value: 3,
                  },
                  {
                    text: "周五",
                    value: 4,
                  },
                  {
                    text: "周六",
                    value: 5,
                  },
                  {
                    text: "周日",
                    value: 6,
                  },
                ]}
              />
            </div>
            <div className="mt_15 mb_8 box box-ac">
                <CheckAll/>
                {
                  type!=='select'&&(
                    <div>
                      <Btn className="ml_25" onClick={()=>{
                  let keys=Object.keys(tab.selectedRowObjs)
                  if(!keys.length){
                    $.warning('请选择课节后操作')
                    return
                  }
                  Modal.confirm({
                    title:'删除课节',
                    content:`删除${keys.length}节课节后，学员的点名签到记录会删除，已扣课时会退回。`,
                    async onOk(){
                      await $.post('/lessons/remove',{
                        lesson_uuids:keys.join(',')
                      })
                      tab.delSelectionAll()
                      parent.setCloseData(true)
                      tab.reload()
                    }
                  })
                }}>删除</Btn>
                <Btn className="ml_10" onClick={()=>{
                  let keys=Object.keys(tab.selectedRowObjs)
                  if(!keys.length){
                    $.warning('请选择课节后操作')
                    return
                  }
                  edit_page.open('批量修改',{lesson_uuids:keys,group_uuid},{left:700})
                }}>修改</Btn>
                    </div>
                  )
                }
            </div>
          </div>
        )}
      </Form>
      
      <TableBox/>

      <Page background="#fff" ref={ref=>edit_page=ref} onClose={()=>{
        tab.reload()
        parent.close(true)
      }}>
        <Edit/>
      </Page>

      <div style={{height:70}}></div>
      {/* <Bottom/> */}
    </div>
  );
}
