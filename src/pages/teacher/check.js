import React from "react";
import { Form, Inputs, TablePagination,Modals,Btn,$ } from "../comlibs";
import { Checkbox } from "antd";

export default function(props) {
  let [uuid, tab] = [props.uuid];
  let {xiu_modal}={}

  let columns_check = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key"
    },
    {
      title: "日期",
      align: "center",
      render: rs => rs.date + `(${rs.week})`
    },
    {
      title: "打卡时间",
      align: "center",
      render: rs => rs.time_dates.toString()
    }
  ];
  return (
    <div>
      <Form>
        {({ form }) => (
          <div className="mb_15">
            <Inputs
              name="date"
              type="rangePicker"
              form={form}
              mode={['date','date']}
              format='YYYY-MM-DD'
              onChange={e => {
                tab.search({
                  date_start: e[0].split(" ")[0],
                  date_end: e[1].split(" ")[0]
                });
              }}
            />
            {/* <Btn className="ml_20" onClick={()=>{
              xiu_modal.open('休息时间')
            }}>设置休息时间</Btn> */}
          </div>
        )}
      </Form>
      <TablePagination
        api="/teacher/attendances"
        columns={columns_check}
        params={{
          teacher_uuid: uuid,
        }}
        ref={ref => (tab = ref)}
        keyName="date"
      />
      <Modals ref={ref=>xiu_modal=ref}>
        <Form onSubmit={async (e,btn)=>{
          let params={}
          if(!e.week){
            $.warning('请勾选休息日')
            btn.loading=false
            return
          }
          let flag=true
          e.week.forEach(w => {
            if(!e[w].starttime||!e[w].endtime){
              flag=false
              $.warning('请填入休息时间')
              return
            }
            params[w]={}
            if(e[w].starttime){
              params[w].starttime=e[w].starttime.format(e[w].starttime_format)
            }
            if(e[w].endtime){
              params[w].endtime=e[w].endtime.format(e[w].endtime_format)
            }
          });
          console.log(params)
          if(!flag){
            return
          }
          await $.post('/teacher/add/resttime',{rest_time:JSON.stringify(params)},()=>{btn.loading=false})
          $.message('设置成功!')
          btn.loading=false
        }}>
          {({form,set,submit})=>(
            <div className="box box-pc box-ac box-ver">
              <div className="box">
              {set({
                name:"week"
              },()=>(
                <Checkbox.Group>
                  <div className="box box-ac" style={{height:40}}>
                  <Checkbox value={0}>
                    <span className="mr_15">周一</span>
                  </Checkbox>
                  </div>
                  <div className="box box-ac" style={{height:40}}>
                  <Checkbox value={1}>
                    <span className="mr_15">周二</span>
                  </Checkbox>
                  </div>
                  <div className="box box-ac" style={{height:40}}>
                  <Checkbox value={2}>
                    <span className="mr_15">周三</span>
                  </Checkbox>
                  </div>
                  <div className="box box-ac" style={{height:40}}>
                  <Checkbox value={3}>
                    <span className="mr_15">周四</span>
                  </Checkbox>
                  </div>
                  <div className="box box-ac" style={{height:40}}>
                  <Checkbox value={4}>
                    <span className="mr_15">周五</span>
                  </Checkbox>
                  </div>
                  <div className="box box-ac" style={{height:40}}>
                  <Checkbox value={5}>
                    <span className="mr_15">周六</span>
                  </Checkbox>
                  </div>
                  <div className="box box-ac" style={{height:40}}>
                  <Checkbox value={6}>
                    <span className="mr_15">周日</span>
                  </Checkbox>
                  </div>
                </Checkbox.Group>
              ))}
              <div>
                <div className="box box-ac" style={{height:40}}>
                    <Inputs form={form} name="0.starttime" format="HH:MM" placeholder="开始时间" className="mr_10" type="timePicker"/>
                    <Inputs form={form} name="0.endtime" format="HH:MM" placeholder="结束时间" type="timePicker"/>
                </div>
                <div className="box box-ac" style={{height:40}}>
                    <Inputs form={form} name="1.starttime" format="HH:MM" placeholder="开始时间" className="mr_10" type="timePicker"/>
                    <Inputs form={form} name="1.endtime" format="HH:MM" placeholder="结束时间" type="timePicker"/>
                </div>
                <div className="box box-ac" style={{height:40}}>
                    <Inputs form={form} name="2.starttime" format="HH:MM" placeholder="开始时间" className="mr_10" type="timePicker"/>
                    <Inputs form={form} name="2.endtime" format="HH:MM" placeholder="结束时间" type="timePicker"/>
                </div>
                <div className="box box-ac" style={{height:40}}>
                    <Inputs form={form} name="3.starttime" format="HH:MM" placeholder="开始时间" className="mr_10" type="timePicker"/>
                    <Inputs form={form} name="3.endtime" format="HH:MM" placeholder="结束时间" type="timePicker"/>
                </div>
                <div className="box box-ac" style={{height:40}}>
                    <Inputs form={form} name="4.starttime" format="HH:MM" placeholder="开始时间" className="mr_10" type="timePicker"/>
                    <Inputs form={form} name="4.endtime" format="HH:MM" placeholder="结束时间" type="timePicker"/>
                </div>
                <div className="box box-ac" style={{height:40}}>
                    <Inputs form={form} name="5.starttime" format="HH:MM" placeholder="开始时间" className="mr_10" type="timePicker"/>
                    <Inputs form={form} name="5.endtime" format="HH:MM" placeholder="结束时间" type="timePicker"/>
                </div>
                <div className="box box-ac" style={{height:40}}>
                    <Inputs form={form} name="6.starttime" format="HH:MM" placeholder="开始时间" className="mr_10" type="timePicker"/>
                    <Inputs form={form} name="6.endtime" format="HH:MM" placeholder="结束时间" type="timePicker"/>
                </div>
              </div>
              </div>
              <div className="box box-pc box-ac mt_20">
                <Btn onClick={submit}>确定</Btn>
              </div>
            </div>
          )}
        </Form>
      </Modals>
    </div>
  );
}
