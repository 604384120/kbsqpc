import React, { useState, useEffect } from "react";
import { Alert, Divider, Tooltip, Icon } from 'antd';
import { Form, Inputs, TablePagination, Page, Btn, $ } from '../comlibs';
import "./index.css";

export default function(props){

  let [infoData, setInfoData] = useState();

  let { tableList, calctype= props?.Parent?.data?.calmethod && props?.Parent?.data?.calmethod[0].calctype} = {};

  useEffect(() => {
    (async () => {
      let res = await $.get(`/teacher/merits/detail`, {teacher_uuid: props?.Parent?.data?.teacher_uuid, uuid: props?.Parent?.data?.uuid});
      if (!res) return;
      setInfoData(res)
    })();
  }, [1]);

  const columns=[
    {
      title: "序号",
      dataIndex: "_key",
    },
    {
      title: "课程",
      dataIndex: "course_name",
    },
    {
      title: "班级",
      dataIndex: "name",
    },
    {
      title: "上课日期",
      dataIndex: "lessontime",
    },
    {
      title: "上课时间",
      dataIndex: "time_text",
    }];
    if (calctype === 'STUDENTHOURS') {
      columns.push({
        title: "学员课消总课时",
        dataIndex: "frozenlessons",
      })
    }
    if (calctype === 'TEACHINGHOURS') {
      columns.push({
        title: "点名状态",
        dataIndex: "roll_status",
        render(text) {
          return <span>
            {text === 'YES' && '已点名'}
            {text === 'NO' && '未点名'}
          </span>
        }
      })
      columns.push({
        title: "老师课时",
        dataIndex: "teacherlessons",
      })
    }
    if (calctype === 'ATTENDANCE') {
      columns.push({
        title: "总到课学员人数",
        dataIndex: "arrived",
      })
    }
    columns.push({
      title: [<Tooltip
				placement="top"
				title={(calctype === 'STUDENTHOURS' && '每扣学员一个课时需支付给老师的费用') ||
        (calctype === 'TEACHINGHOURS' && '老师上一次课的课时费用') ||
        (calctype === 'ATTENDANCE' && '每节课单个学员到课需支付给老师的费用')}
			>
				老师课时单价(元/课时) <Icon type="question-circle" theme="outlined" />
			</Tooltip>],
      dataIndex: "instsalary",
    })
    columns.push({
      title: [<Tooltip
				placement="top"
        title={(calctype === 'STUDENTHOURS' && '老师绩效=老师课时单价*学员课消课时') ||
        (calctype === 'TEACHINGHOURS' && '老师绩效=老师课时单价*老师课时') ||
        (calctype === 'ATTENDANCE' && '老师绩效=到课学员人数*老师课时单价')}
			>
				老师绩效(元) <Icon type="question-circle" theme="outlined" />
			</Tooltip>],
      dataIndex: "merits",
    })

  return (
    <div className="pt_24">
      <p className="bg_white mb_24 pv_25 ph_32" ><span className="fs_20 fb mr_35" >{props?.Parent?.data?.name}</span>结算区间：{infoData?.date_text}</p>
      <div className="bg_white pv_25 ph_32" >
        <Alert type="warning" showIcon className="mb_24" message={
          <p className="mb_0" >绩效：
            <span style={{color: '#faad14'}}>{props?.Parent?.data?.merits}</span>元 
            <span className="mh_24" >
              {calctype === 'STUDENTHOURS' && `绩效规则(按学员课时)：老师绩效（元）= 老师课时单价*学员课消课时`}
              {calctype === 'TEACHINGHOURS' && `绩效规则(按老师课时)：老师绩效（元）= 老师课时单价*老师课时`}
              {calctype === 'ATTENDANCE' && `绩效规则(按到课人次)：老师绩效（元）= 到课学员人数*老师课时单价`}
            </span>
          </p>}
        />
        <TablePagination
          api="/teacher/merits/detail"
          params={{
            uuid: props?.Parent?.data?.uuid,
            teacher_uuid: props?.Parent?.data?.teacher_uuid
          }}
          columns={columns}
          ref={(ref) => tableList = ref}
        />
      </div>
    </div>
  )
}