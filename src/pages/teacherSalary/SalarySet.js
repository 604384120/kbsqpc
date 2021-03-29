import React from 'react';
import { Form as Forms } from 'antd';
import { Form, Inputs, TablePagination, Page, Btn, $ } from '../comlibs';
import BatchSet from "./BatchSet";

export default function(props){
  let { tableList, exportExcel, page_Set } = {};

  const columns=[
    {
      title: "序号",
      dataIndex: "_key",
    },
    {
      title: "老师名称",
      dataIndex: "name",
      key: 'name',
      render (text, record) {
        return <span className="link" onClick={() => page_Set.open(`${record.name}薪资设置`, record, {width: 700})} >{text}</span>
      }
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: 'phone',
    },
    {
      title: "状态",
      dataIndex: "status",
      key: 'status',
      render(text) {
        return <span className={text === 'SUSPENDED' ? "fc_err" : "" }>{text === 'SUSPENDED' ? '离职' : '在职'}</span>
      }
    },
    {
      title: "工作方式",
      dataIndex: "fulltime",
      key: 'fulltime',
      render(text) {
        return <span>
          {text === 'fulltime' && '全职'}
          {text === 'partime' && '兼职'}
        </span>
      }
    },
    {
      title: "基本工资(元)",
      dataIndex: "bese_salary",
      key: 'bese_salary',
      render(text, record) {
        if (text) {
          return text
        } else {
          return <span className="link" onClick={() => page_Set.open(`${record.name}薪资设置`, record, {width: 700})} >未设置</span>
        }
      }
    },
    {
      title: "奖金(元)",
      dataIndex: "bonus",
      key: 'bonus',
      render(text, record) {
        if (text) {
          return text
        } else {
          return <span className="link" onClick={() => page_Set.open(`${record.name}薪资设置`, record, {width: 700})} >未设置</span>
        }
      }
    },
    {
      title: "绩效规则",
      dataIndex: "calmethod",
      key: 'calmethod',
      render(text, record) {
        if (text) {
          return <span>
            {text[0].calctype === 'STUDENTHOURS' && '按学员课时'}
            {text[0].calctype === 'TEACHINGHOURS' && '按老师课时'}
            {text[0].calctype === 'ATTENDANCE' && '按到课人次'}
          </span>
        } else {
          return <span className="link" onClick={() => page_Set.open(`${record.name}薪资设置`, record, {width: 700})} >未设置</span>
        }
      }
    },
  ];

  return (
    <div>
      <Form
        className="mb_14"
        onSubmit={async (values, btn, ext) => {
          tableList.search(values)
          btn.loading = false;  //关闭提交按钮loading加载状态
        }}
      >
        {({set, form, submit, setByName}) => (
          <div>
            <Inputs className="mr_10" form={form} name="status" placeholder='全部' autoSubmit={true} select={[
              {value: '', text: '全部'},
              {value: 'INSERVICE', text: '在职'},
              {value: 'SUSPENDED', text: '离职'}
            ]} />
            <Inputs form={form} name="name" className="mr_10" placeholder="输入老师名称" autoSubmit={true} />
            <Btn htmlType="submit" icon="search" className="mr_10 mb_10"> 搜索 </Btn>
            <Btn className="mr_10" onClick={() => page_Set.open("批量设置", {}, {width: 700})}>批量设置</Btn>
          </div>
        )}
      </Form>
      <TablePagination
        api="/teacher/list"
        columns={columns}
        params={{
          limit: 1000,
          totalnum: "NO"
        }}
        ref={(ref) => tableList = ref}
      />
      <Page ref={ref=> page_Set = ref} onClose={()=>{ tableList.reload() }} background="#fff" >
        <BatchSet/>
      </Page>
    </div>
  )
}