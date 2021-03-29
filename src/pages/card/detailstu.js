import React, { useState, useEffect } from "react";
import { Form as Forms,  Alert , Skeleton } from "antd";
import { Method, Form, Inputs, FixedBox, Btn } from "../comlibs";
import { Page_ChoiceCourse } from "../works";
import { Page_ChoiceTeacher } from "../works";
const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 }
};

export default function(props) {
  const $ = new Method();
  let Parent = props.Parent;
  let uuid = Parent.data;
  let {
    choiceCourse,
    course = [],
    setCourse,
    teacher = [],
    setTeacher,
    choiceTeacher
  } = {};
  let [data, setData] = useState({});
  let [loading, setLoading] = useState(true);
  function init() {
    (async () => {
      let res = await $.get(`/studentcard/${uuid}/detail`);
      setData(res);
      setLoading(false);
    })();
  }
  useEffect(() => {
    init();
  }, [uuid]);

  let Course = ({ datas }) => {
    datas.map(v => {
      v.uuid = v.course_uuid;
      return v;
    });
    [course, setCourse] = useState(datas);
    let name = course
      .map(v => {
        return v.name;
      })
      .join("，");
    return <span className={name && "pr_10"}>{name || ""}</span>;
  };

  let Teacher = ({ datas }) => {
    datas.map(v => {
      v.uuid = v.teacher_uuid;
      return v;
    });
    [teacher, setTeacher] = useState(datas);
    let name = teacher
      .map(v => {
        return v.name;
      })
      .join("，");
    return <span className={name && "pr_10"}>{name || ""}</span>;
  };

  return (
    <Skeleton loading={loading ? true : false} paragraph={{ rows: 10 }} active>
      <Alert className="mt_15" message="此课卡信息为学员的个人课卡信息" type="info" />
      <div className="bs ph_10 pv_10 bg_white mt_15">
        <Form
          {...col}
          onSubmit={async rs => {
            rs.startdate = rs.startdate.split(' ')[0]
            if(rs.enddate!==''&&rs.enddate!==null){
              rs.enddate = rs.enddate.split(' ')[0]
            }else{
              rs.enddate = ''
            }
            let res = await $.post(`/studentcard/${uuid}/save`, rs);
            $.msg("数据更新成功~");
            Parent.close(true)
            return res;
          }}
        >
          {({ form, set }) => (
            <div className="box box-ver">
              <Inputs
                label="剩余可预约次数"
                form={form}
                name="remain"
                width={388}
                value={(data.remain&&data.remain >9000)?'不限':data.remain||0}
                disabled
              />
              <Inputs
                label="可用课时数"
                form={form}
                name="maxtimes"
                width={388}
                value={data.maxtimes}
                placeholder="请输入可用课时数"
              />
              <Inputs
                label="实收金额"
                form={form}
                name="income"
                width={388}
                value={data.income}
                placeholder="请输入实收金额"
              />
              <Forms.Item {...col} label="可用课程">
                {set(
                  {
                    name: "course_uuids",
                    value: data.course_uuids
                  },
                  valueSet => (
                    <span>
                      <Course datas={data.courses} />
                      <a
                        onClick={() =>
                          choiceCourse.open({
                            value: course,
                            onSure: d => {
                              setCourse(d);
                              let uuids = [];
                              d.map(v => {
                                uuids.push(v.uuid);
                                return uuids;
                              });
                              valueSet(uuids);
                            }
                          })
                        }
                      >
                        选择课程
                      </a>
                    </span>
                  )
                )}
              </Forms.Item>
              <Forms.Item {...col} label="授课老师">
                {set(
                  {
                    name: "teacher_uuids",
                    value: data.teacher_uuids
                  },
                  valueSet => (
                    <span>
                      <Teacher datas={data.teachers} />
                      <a
                        onClick={() => {
                          choiceTeacher.open({
                            value: teacher,
                            onSure: d => {
                              setTeacher(d);
                              let uuids = [];
                              d.map(v => {
                                uuids.push(v.teacher_uuid);
                                return uuids;
                              });
                              valueSet(uuids);
                            }
                          });
                        }}
                      >
                        选择老师
                      </a>
                    </span>
                  )
                )}
              </Forms.Item>
              <Inputs
                label="生效日期"
                name="startdate"
                value={data.startdate}
                type="datePicker"
                form={form}
              />
              <Inputs
                label="失效时间"
                name="enddate"
                value={data.enddate || null}
                type="datePicker"
                form={form}
              />
              <FixedBox>
                <Btn className="ml_10" style={{ width: 100 }} htmlType="submit">
                  保存
                </Btn>
              </FixedBox>
            </div>
          )}
        </Form>
        <Page_ChoiceCourse ref={ref => (choiceCourse = ref)} />
        <Page_ChoiceTeacher ref={ref => (choiceTeacher = ref)} />
      </div>
    </Skeleton>
  );
}
