import React, { useState, useEffect } from "react";
import { Divider, List, Form as Forms, Switch, Tabs, Modal } from 'antd';
import { Form, Inputs, TablePagination, Page, Btn, $, Modals } from '../comlibs';
import { Teacher } from "../works";
import SalarySet from "./SalarySet";
import SalaryInfo from "./SalaryInfo";

export default function(){
  const { TabPane } = Tabs;

  const col = {
		labelCol: { span: 7 },
		wrapperCol: { span: 16 }
  };

  const [tabKey, setTabKey]=useState('salary')

  let { tableList, page_info, modals_add } = {};

  const columns=[
    {
      title: "序号",
      dataIndex: "_key",
    },
    {
      title: "结算区间",
      dataIndex: "date_text",
      width: 220,
    },
    {
      title: "结算内容",
      dataIndex: "content",
      width: 200,
      render(text, record) {
        return <a onClick={() => page_info.open("工资详情表", record)} >{text}</a>
      }
    },
    {
      title: "结算对象",
      dataIndex: "teachers_name",
      width: 220,
      ellipsis: true,
    },
    {
      title: "结算金额",
      dataIndex: "count_wages",
      width: 220,
      render(text, record) {
        if (text) {
          return <span>{text}</span>
        } else {
          return <a onClick={() => page_info.open("工资详情表", record)} >未设置</a>
        }
      }
    },
    {
      title: "结算人",
      dataIndex: "operator_name",
      width: 100,
      render(text) {
        return text || '-'
      }
    },
    {
      title: "操作日期",
      dataIndex: "settledate",
      width: 100,
      render(text) {
        return text || '-'
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 80,
      render(text) {
        return <span>
          {text === 'NO' && '未结算'}
          {text === 'YES' && '已结算'}
        </span>
      }
    },
    {
      title: "备注",
      dataIndex: "remarks",
      width: 220,
      ellipsis: true,
      render(text) {
        return text || '-'
      }
    },
    {
      title: "操作",
      width: 100,
      render(text, record) {
        return <div>
          <span className="link" onClick={async (e) => {
            await $.download("/teacher/settlement/export", {uuid: record.uuid});
            return e
          }} >导出</span>
          {record.status === 'NO' && <Divider type="vertical" />}
          {record.status === 'NO' && <span className="fc_err pointer"
            onClick={() => {
              Modal.confirm({
                title: '确定要删除这条结算吗？',
                // content: '确定要删除这条结算吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: async () => {
                  let rs = await $.post(`/teacher/settlement/delete`, {uuid: record.uuid});
                  $.msg("删除成功!");
                  tableList.reload();
                  return rs;
                },
              });
            }}
          >
            删除
          </span>}
        </div>
      }
    },
  ];

  const ModalsSalaryAdd = () => {

    return <Modals zIndex={100} ref={ref => modals_add = ref}>
      {(pro) => {
        return <Form
          {...col}
          onSubmit={async (values, btn, ext) => {
            if (values.repair_lesson) {
              values.repair_lesson = 'ON'
            } else {
              values.repair_lesson = 'OFF'
            }
            values.startdate = values?.date[0];
            values.enddate = values?.date[1];
            let rs = await $.post("/teacher/settlement/create", values);
            modals_add.close();
            tableList.reload()
          }}
        >
        {({set, form, submit})=>(
          <div>
            <Forms.Item label='结算区间' required={true} >
              <Inputs form={form} type='rangePicker' name="date" style={{ width: 300 }} required={true} />
            </Forms.Item>
            <Forms.Item label='结算对象' required={true} >
              <Teacher placeholder="请选择结算对象" form={form} style={{ width: 300 }} mode="multiple" name="teacher_uuids" required={true} />
            </Forms.Item>
            <Forms.Item label='补课计入绩效' required={true} >
              {
                set(
                  {name: "repair_lesson", value: true, required: true},  //组件的name和初始value
                  (valueSet) => (
                    <div>
                      <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" onChange={(d) => valueSet(d)} />
                      {form.getFieldValue('repair_lesson') && <span className="fc_gray1 fs_10"> (补课数据按学员课时或到课人次计入老师绩效)</span>}
                    </div>
                  )
                )
              }
            </Forms.Item>
            <Forms.Item label='结算内容' required={true} >
              <Inputs form={form} name="content" rows={4} style={{ width: 300 }} required={true} />
            </Forms.Item>
            <Forms.Item label='备注信息'>
              <Inputs form={form} name="remarks" rows={4} style={{ width: 300 }} />
            </Forms.Item>
            <Btn onClick={e=> submit(e)} style={{width:70}} className="dis_b m_auto mt_10" />
          </div>
        )}
        </Form>
      }}
      </Modals>
  };

  return (
    <div className="mt_20 bg_white ph_32">
      <Tabs activeKey={tabKey} onChange={(activeKey) => setTabKey(activeKey)} >
        <TabPane tab="老师工资" key="salary" >
          {tabKey === "salary" && <div>
            <Form
              onSubmit={async (values, btn, ext) => {
                tableList.search(values)
                btn.loading = false;  //关闭提交按钮loading加载状态
              }}
            >
              {({set, form, submit, setByName}) => (
                <div>
                  <span>日期：</span>
                  <Inputs className="mr_30" name="settledate" type="rangePicker" form={form} autoSubmit={true} />
                  <span>结算状态：</span>
                  <Inputs className="mr_30" form={form} name="status" placeholder='全部状态' autoSubmit={true} select={[
                    {value: '', text: '全部状态'},
                    {value: 'YES', text: '已结算'},
                    {value: 'NO', text: '未结算'}
                  ]} />
                  <span>结算内容：</span>
                  <Inputs form={form} name="content" className="mr_10" placeholder="请输入结算内容" autoSubmit={true} />
                  <Btn htmlType="submit" icon="search" className="mr_10 mb_10"> 搜索 </Btn>
                  <div className='mt_15 mb_24' >
                    <Btn className="mr_10" onClick={() => modals_add.open('新增结算')} >新增结算</Btn>
                  </div>
                </div>
              )}
            </Form>
            <TablePagination
              api="/teacher/settlement/list"
              columns={columns}
              ref={(ref) => tableList = ref}
            />
            <Page ref={ref=> page_info = ref} onClose={()=> { tableList.reload() }} onCloseReload={() => 'dsf'}>
              <SalaryInfo/>
            </Page>
            <ModalsSalaryAdd />
          </div>}
        </TabPane>
        <TabPane tab="薪资设置" key="set">
          {tabKey === "set" && <SalarySet />}
        </TabPane>
      </Tabs>
    </div>
  )
}