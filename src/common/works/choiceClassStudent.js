import React, { useState } from "react";
import { List, Empty, Avatar } from "antd";

import { $ } from "../method";
import { FixedBox } from "../../pages/comlibs";
import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";
import Course from "../works/course";

import Class from "./class";

export default function (props) {
  let { Parent } = props;
  let {
    value = [],
    max,
    group_uuid,
    onSure,
    disabled,
    course_params,
    getCheckboxProps,
    bottom:Bottom
  } = Parent ? Parent.data : props;

  let { ClassList } = $.useRef(["ClassList"]);
  let { tab, list, setList } = {};

  let columns = [
    {
      title: "姓名",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "类型",
      render: (rs) => (
        <span>
          {rs.identity === "formal" && "正式"}
          {rs.identity === "intentional" && "意向"}
          {rs.identity === "graduated" && "毕业"}
        </span>
      ),
    },
    {
      title: "联系方式",
      dataIndex: "phone",
			render(rs){
				return (
					<div>{rs||'-'}</div>
				)
			}
    },
    {
      title: "绑定微信",
      render: (rs) => (
        <span>
          {rs.gzh_bind === "YES" && "已绑定"}
          {rs.gzh_bind === "NO" && "未绑定"}
        </span>
      ),
    },
  ];

  let Sure = (data) => {
    Parent && Parent.close(data);
    onSure && onSure(data);
  };

  let Sel = () => {
    [list, setList] = useState([]);
    let height = 460;
    let width = 270;

    if (max === 1 && list.length >= 1 && tab.sureType === "selectRow") {
      Sure(list[list.length - 1]);
    }

    return (
      <div className="box box-ver">
        <div style={{ height: 46 }} className="box box-pc box-ver bb_1 bg_gray">
          已选{list.length}个学员
        </div>
        <div style={{ height, width }} className="box box-ver bb_1 bl_1">
          {list.length > 0 ? (
            <List
              style={{ height, width }}
              className="choiceCourseList CUSTOM_scroll oy_a pl_20"
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <span
                      onClick={() =>
                        tab.delSelection(item.student_uuid || item.uuid)
                      }
                      className="link"
                      key="0"
                    >
                      删除
                    </span>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.name}
                    description={item.phone || "暂无联系方式"}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty className="mt_30" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg_white ph_16">
      <Form
        warning={true}
        onSubmit={(values) => {
          // tab.api = `/banji/${values.group_uuid}/students`;
          tab.search(values);
        }}
      >
        {({ form }) => (
          <div className="pt_15 mt_15">
            <div className="mb_10">
              <div className="dis_ib mr_10">
                <Inputs
                  name="identity"
                  value="formal"
                  autoSubmit={true}
                  placeholder="请选择类型"
                  form={form}
                  select={[
                    { text: "全部类型", value: "" },
                    { text: "正式", value: "formal" },
                    { text: "意向", value: "intentional" },
                    { text: "毕业", value: "graduated" },
                  ]}
                />
              </div>
              <div className="dis_ib mr_10">
                <Course
                  autoSubmit={true}
                  name="course_uuid"
                  params={course_params}
                  form={form}
                  onChange={(e) => {
                    $(ClassList).reload({
                      course_uuid: e,
                    });
                  }}
                />
              </div>
              <div className="dis_ib mr_10">
							  <Class
                  ref={ClassList}
                  autoSubmit={true}
                  disabled={disabled}
                  name="group_uuid"
                  form={form}
                  value={group_uuid}
                />
              </div>
              <div className="dis_ib mr_10">
                <Inputs
                  placeholder="请输入学员名称"
                  style={{ width: 150 }}
                  form={form}
                  name="student_name"
                />
              </div>
              <Btn htmlType="submit" iconfont="sousuo">
                搜索
              </Btn>
            </div>
          </div>
        )}
      </Form>
      <div className="box mb_50">
        <div className="box-1">
          <TablePagination
            className="CUSTOM_choiceScroll nPointer"
            api="/v2/campusstudent/list"
            columns={columns}
            rowSelection={true}
            setSelection={value}
            getCheckboxProps={getCheckboxProps}
            onRow={true}
            keyName="student_uuid"
            params={{identity: "formal" }}
            rowType={max === 1 ? "radio" : "checkbox"}
            scroll={{ y: 460, x: "max-content" }}
            onSelection={(keys) => {
              setList && setList(Object.values(keys));
            }}
            ref={(ref) => (tab = ref)}
          />
        </div>
        <Sel />
      </div>
      {
        Bottom?(
          <Bottom sure={()=>{
            Sure(list);
          }} />
        ):(
          <FixedBox className="ta_l">
            <Btn style={{ background: "#ccc" }} onClick={() => Parent.close()}>
              取消
            </Btn>
            <Btn
              className="ml_20"
              onClick={() => {
                if (max === 1) {
                  Sure(list[0] || {});
                } else {
                  Sure(list);
                }
              }}
            />
          </FixedBox>
        )
      }
    </div>
  );
}
