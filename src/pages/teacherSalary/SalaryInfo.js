import React, { useState, useEffect } from "react";
import { Row, Col, Tooltip, Icon } from 'antd';
import { Form, Inputs, TablePagination, Page, Btn, $ } from '../comlibs';
import BatchSet from "./BatchSet";
import PerfInfo from "./PerfInfo";
import "./index.css";

export default function(props){
  let Parent = props?.Parent;

  let [infoData, setInfoData] = useState();

  let { tableList, page_info, page_Set } = {};

  useEffect(() => { getInfo() }, [1]);

  const getInfo = async () => {
    let res = await $.get(`/teacher/settlement/detail`, {uuid: props?.Parent?.data?.uuid});
    if (!res) return;
    setInfoData(res)
  };

  const columns=[
    {
      title: "序号",
      dataIndex: "_key",
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "基本工资",
      dataIndex: "bese_salary",
      render(text, record) {
        if (text === 0 || text) {
          return text
        } else {
          return <a onClick={() => page_Set.open(`${record.name}薪资设置`, record, {width: 700})} >未设置</a>
        }
      }
    },
    {
      title: "奖金",
      dataIndex: "bonus",
      render(text, record) {
        if (text === 0 || text) {
          return text
        } else {
          return <a onClick={() => page_Set.open(`${record.name}薪资设置`, record, {width: 700})} >未设置</a>
        }
      }
    },
    {
      title: "绩效",
      dataIndex: "merits",
      render(text, record) {
        if (text === 0) {
          return <span>{text}</span>
        } else if (text) {
          return <a onClick={() => page_info.open(`绩效详情`, {...record, uuid: props?.Parent?.data?.uuid})} >{text}</a>
        } else {
          return <a onClick={() => page_Set.open(`${record.name}薪资设置`, record, {width: 700})} >未设置</a>
        }
      }
    },
    {
      title: "绩效规则",
      dataIndex: "calmethod",
      render(text, record) {
        if (!text) {
          return '-'
        }
        return <span>
          {text[0]?.calctype === 'STUDENTHOURS' && '按学员课时'}
          {text[0]?.calctype === 'TEACHINGHOURS' && '按老师课时'}
          {text[0]?.calctype === 'ATTENDANCE' && '按到课人次'}
        </span>
      }
    },
    {
      title: [<Tooltip
				placement="top"
				title="应发工资=基本工资+奖金+绩效"
			>
				应发工资 <Icon type="question-circle" theme="outlined" />
			</Tooltip>],
      dataIndex: "wages",
    },
  ];

  return (
    <div className="pt_24">
      <div className="bg_white mb_24 pv_25 ph_32" >
        <div className="boxTitle" >
          <span className="fb" >结算区间：{props?.Parent?.data?.date_text}</span>
          <Btn disabled={Parent?.data?.status === 'YES'} onClick={async () => {
            if (Parent?.data?.status === 'YES') {
              $.warning("请勿重复结算");
              return
            }
            let res = await $.post(`/teacher/settlement/update`, {uuid: props?.Parent?.data?.uuid});
            Parent.setCloseData(true);
            $.msg("结算成功~");
            tableList.reload()
          }} >完成结算</Btn>
        </div>
        <Row className="boxBanner" >
          <Col span={4} offset={2} className="bannerItem" >
            <span className="fc_dis fs_14" >人数</span><br/>
            {infoData?.count_len}人
          </Col>
          <Col span={4} className="bannerItem" >
            <span className="fc_dis fs_14" >基本工资</span><br/>
            {infoData?.count_bese_salary}元
          </Col>
          <Col span={4} className="bannerItem" >
            <span className="fc_dis fs_14" >奖金</span><br/>
            {infoData?.count_bonus}元
          </Col>
          <Col span={4} className="bannerItem" >
            <span className="fc_dis fs_14" >绩效</span><br/>
            {infoData?.count_merits}元
          </Col>
          <Col span={4} className="bannerItem" >
            <span className="fc_dis fs_14" >应发工资</span><br/>
            {infoData?.count_wages}元
          </Col>
        </Row>
        {infoData?.remarks && <div className="mt_10" >备注信息：{infoData?.remarks}</div>}
      </div>
      <div className="bg_white pv_25 ph_32" >
        <TablePagination
          api="/teacher/settlement/detail"
          params={{
            uuid: props?.Parent?.data?.uuid,
          }}
          columns={columns}
          ref={(ref) => tableList = ref}
        />
        <Page ref={ref=> page_Set = ref} onClose={() => {
          getInfo();
          tableList.reload();
          Parent.setCloseData(true);
        }} background="#fff" >
          <BatchSet/>
        </Page>
        <Page ref={ref => page_info = ref} onClose={() => {
          getInfo();
          tableList.reload();
          Parent.setCloseData(true);
        }}>
          <PerfInfo/>
        </Page>
      </div>
    </div>
  )
}