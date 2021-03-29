import React from "react";
import { Form, Method, Btn, Inputs, TablePagination } from "../comlibs";

export default function(props) {
  let classroom_uuid = props.Parent.data;
  let { tab } = {};
  const $ = new Method();
  let getYMD = (y, m, d) => {
    let date = new Date();
    let q = y || 0;
    let w = m || 0;
    let e = d || 0;
    return (
      date.getFullYear() + q + "-" +(date.getMonth() + w + 1) + "-" +(date.getDate() + e)
    );
  };
  let getWeekDay = dateString => {
    let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;
    if (dateString.match(dateStringReg)) {
      let presentDate = new Date(dateString),
        today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7;
      return Array.from(new Array(7), function(val, index) {
        return formatDate(
          new Date(
            presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000
          )
        );
      });
    } else {
      throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"');
    }
    function formatDate(date) {
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    }
  };
  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key"
    },
    {
      title: "日期",
      align: "center",
      render:rs=>{
        return(
          <span>{rs.lesson_date.year}-{rs.lesson_date.origin_date}({rs.lesson_date.week})</span>
        )
      }
    },
    {
      title: "时间",
      align: "center",
      render:rs=>{
        return(
          <span>{rs.show_start_time}-{rs.show_end_time}</span>
        )
      }
    },
    {
      title: "班级",
      align: "center",
      dataIndex: "banji_name"
    }
  ];
  return (
    <div className="bs ph_10 mt_15 bg_white">
      <div className="mb_15 pt_15">
        <Form onSubmit={values => {
          if(values.start_date===''||values.end_date===''){
            $.warning('请选择正确的日期！')
            return false;
          }
          if((values.start_time!==''&&values.end_time==='')||(values.start_time===''&&values.end_time!=='')){
            $.warning('请选择正确的时间区间！')
            return false;
          }
          tab.search(values)
        }}>
          {({ form }) => (
            <div className="mb_15">
              <Inputs
                name="date"
                type="rangePicker"
                form={form}
                value={[getWeekDay(getYMD())[0], getWeekDay(getYMD())[6]]}
                onChange={e => {
                  if(e[0].split(" ")[0]===''&&e[1].split(" ")[0]===''){
                    $.warning('日期为必选项！')
                    return false;
                  }
                  tab.search({
                    start_date: e[0].split(" ")[0],
                    end_date: e[1].split(" ")[0]
                  });
                }}
              />
              <Inputs name="start_time" placeholder="选择开始时间" form={form} style={{width:130}} type="timePicker" className="ml_10"/>
              <Inputs name="end_time" placeholder="选择结束时间" form={form} style={{width:130}} type="timePicker" className="ml_10"/>
              <Btn htmlType="submit" iconfont="sousuo" className="ml_10">
                搜索
              </Btn>
            </div>
          )}
        </Form>
      </div>
      <TablePagination
        api="/classroom/log/duration"
        columns={columns}
        params={{
          classroom_uuid: classroom_uuid,
          start_date:getWeekDay(getYMD())[0], 
          end_date:getWeekDay(getYMD())[6]
        }}
        ref={ref => (tab = ref)}
      />
    </div>
  );
}
