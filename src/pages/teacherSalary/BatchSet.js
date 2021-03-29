import React from 'react';
import { Form as Forms, Divider } from 'antd';
import { $, Form, Inputs, Btn, TableEdit, FixedBox } from "../comlibs";

export default function(props){
  const Parent = props.Parent;
  let { infoData=Parent?.data, exportExcel, edit_set } = {};

  const getColumn = (form, setByName) => {
    return [
      {
        title: "基本工资(元)",
        align: "center",
        render: () => <Inputs type="inputNumber" value={infoData.bese_salary} min={0} defaultValue={0} placeholder="请输入" form={form} name="bese_salary" width={100} onChange={(value) => setByName("bese_salary", value)} />,
      },
      {
        title: "奖金(元)",
        align: "center",
        render: (res) => {
          return <Inputs type="inputNumber" value={infoData.bonus} min={0} defaultValue={0} placeholder="请输入" form={form} name="bonus" width={100} onChange={(value) => setByName("bonus", value)} />;
        },
      },
    ];
  }

  const getColumns = (form, setByName) => {
    return [
      {
        title: "计算方式",
        align: "center",
        colSpan: 2,
        render: ({ key }) => {
          return <div>
            <Inputs width={190} placeholder="请选择" form={form} name="calctype" placeholder="请选择" style={{marginRight: '5%'}} value={infoData?.calmethod && infoData?.calmethod[0]?.calctype} select={[
              {text: '按老师课时', value: 'TEACHINGHOURS'},
              {text: '按学员课时', value: 'STUDENTHOURS'},
              {text: '按到课人次', value: 'ATTENDANCE'},
            ]} onChange={() => form.setFieldsValue({instsalary: 0})} />
            <Inputs type="inputNumber" width={118} min={0} placeholder="0" value={infoData?.calmethod && infoData?.calmethod[0]?.instsalary || 0} form={form} name="instsalary" value={infoData?.calmethod && infoData?.calmethod[0]?.instsalary} onChange={(value) => setByName("instsalary", value)} />
            <span style={{display: 'inline-block', width: '70px'}}>
              {form.getFieldValue('calctype') ? (form.getFieldValue('calctype') === 'ATTENDANCE' ? '元/人' : '元/课时') :
              (infoData?.calmethod && infoData?.calmethod[0]?.calctype === 'ATTENDANCE' ? '元/人' : '元/课时')}
            </span>
          </div>;
        },
      },
    ];
  };

  return (
      <div className="mt_20 bg_white ph_24 ph_24">
        <Form
          onSubmit={async (values, btn, ext) => {
            if (values.calctype) {
              let calmethod = [{}];
              calmethod[0].calctype = values.calctype;
              calmethod[0].instsalary = values.instsalary || 0;
              values.calmethod = JSON.stringify(calmethod);
            }
            values.settletype = 'UNIFIEDSETTING'; //  统一设置
            if (Parent.state.title === '批量设置') {
              let rs = await $.post("/teacher/wages/batchset", values);
            } else {
              values.teacher_uuid = Parent.data.teacher_uuid;
              let rs = await $.post("/teacher/wages/setup", values);
            }
            btn.loading = false;  //关闭提交按钮loading加载状态
            Parent.close(true)
          }}
        >
        {({set, form, submit, setByName}) => (
          <div>
            <p className="fs_16 fb" >{`${infoData?.name || ''}固定工资数据设置`}</p>
            <TableEdit
              title={`固定工资数据设置`}
              columns={getColumn(form, setByName)}
              data={[{index: 1}]}
              bordered={true}
              action={true}
              init={(ref) => (edit_set = ref)}
              onChange={(d, data) => {
                // console.log(d, data)
                // let { bese_salary = '', bonus = '' } = data;
                // setByName("bese_salary", bese_salary);
                // setByName("bonus", bonus);
              }}
            />
            <p className="fs_16 fb mt_30 mb_20" >{`${infoData?.name || ''}绩效工资设置`}</p>
            {/* <p>计算方式: 统一设置</p> */}
            <TableEdit
              title={`绩效工资设置`}
              columns={getColumns(form, setByName)}
              data={[{index: 1}]}
              bordered={true}
              action={true}
              init={(ref) => (edit_set = ref)}
              onChange={(d, data) => {
                // let { bese_salary = '', bonus = '' } = data;
                // setByName("bese_salary", bese_salary.toString());
                // setByName("bonus", bonus.toString());
              }}
            />
            <FixedBox>
              <Btn style={{float: "left"}} className="mr_10" type='default' onClick={() => Parent.close()} >取消</Btn>
              <Btn onClick={(e) => {
                Parent.setCloseData(true);
                submit(e)
              }}>保存</Btn>
            </FixedBox>
          </div>
        )}
      </Form>
    </div>
  )
}