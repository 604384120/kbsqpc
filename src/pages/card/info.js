import React, { useState, useEffect } from "react";
import { Form as Forms, Checkbox, Skeleton } from "antd";
import { Method, Form, Inputs, FixedBox, Btn } from "../comlibs";
import { Page_ChoiceCourse } from "../works";
import { Page_ChoiceTeacher } from "../works";

const col = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 }
};

export default function(props) {
  const $ = new Method();
  const Parent = props.Parent;
  let _page = Parent;
  let uuid = props.uuid || "";
  let {
    choiceCourse,
    course = [],
    setCourse,
    teacher = [],
    setTeacher,
    choiceTeacher
  } = {};
  let [data, setData] = useState({ course: [], teachers: [] });
  let [loading, setLoading] = useState(true);
  function init() {
    (async () => {
      let res = await $.get(`/lessoncard/${uuid}/detail`);
      setData(res);
      setLoading(false);
    })();
  }
  useEffect(() => {
    if (uuid) {
      init();
    }
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
      <Form
        {...col}
        onSubmit={async rs => {
          console.log(rs);
          if (rs.bymaxtimes && rs.bydate) {
            rs.combo = "comboone";
          } else if (rs.bymaxtimes && !rs.bydate) {
            rs.combo = "bymaxtimes";
          } else if (!rs.bymaxtimes && rs.bydate) {
            rs.combo = "bydate";
          } else {
            $.warning("请完善失效方式");
            return false;
          }
          if (rs.combo === "comboone" || rs.combo === "bydate") {
            if (rs.withinend) {
              if (rs.enddate === "" || rs.enddate === undefined) {
                $.warning("请设置指定时间!");
                return false;
              }
              rs.withinend = "yes";
            } else {
              if (rs.validperiod === "") {
                $.warning("请设置指定天数!");
                return false;
              }
              rs.withinend = "no";
            }
          }else{
            if(rs.maxtimes === ''){
              $.warning("请输入可预约次数!");
              return false;
            }
          }
          if (!rs.startcard) {
            if (rs.startdate === "" || rs.startdate === undefined) {
              $.warning("请设置生效时间");
              return false;
            }
            rs.startdate = rs.startdate.split(" ")[0];
            rs.startcard = "no";
          } else if (rs.startcard) {
            rs.startcard = "yes";
            rs.startdate = "";
          }
          if (uuid === "") {
            let res = await $.post(`/lessoncard/create`);
            $.msg("创建成功~");
            _page.close(true);
            return res;
          } else {
            rs.course_uuids = rs.course_uuids.toString();
            rs.teacher_uuids = rs.teacher_uuids.toString();
            $.confirm(
              "注意：此次修改只对以后的课卡发放生效，已发放的课卡请在对应的学员课卡详情里进行修改！",
              async () => {
                let res = await $.post(`/lessoncard/${uuid}/save`, rs);
                $.msg("数据更新成功~");
                _page.setCloseData(true);
                return res;
              }
            );
          }
        }}
      >
        {({ form, set, setByName }) => (
          <div className="box box-ver mt_30">
            <Inputs
              label="课卡名称"
              form={form}
              name="name"
              required={true}
              width={388}
              value={data.name}
              placeholder="请输入课卡名称"
            />
            <Inputs
              label="课卡价格"
              form={form}
              name="price"
              required={true}
              value={data.price}
              width={388}
              placeholder="课卡价格，￥1000"
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
              name="startcard"
              value={data.startcard || null}
              form={form}
              required={true}
              placeholder="请设置课卡时效~"
              radios={[
                {
                  value: true,
                  text: "发卡日期"
                },
                {
                  value: false,
                  text: (
                    <span>
                      <span className="mr_10">指定时间</span>
                      <Inputs
                        name="startdate"
                        value={data.startdate}
                        type="datePicker"
                        form={form}
                      />
                    </span>
                  )
                }
              ]}
            />
            <Forms.Item {...col} label="失效方式" required={true}>
              <div>
                {set(
                  {
                    name: "bymaxtimes",
                    value:
                      data.combo === "bymaxtimes" || data.combo === "comboone"
                        ? true
                        : false
                  },
                  valueSet => (
                    <Checkbox
                      className="pr_15"
                      checked={
                        data.combo === "bymaxtimes" || data.combo === "comboone"
                      }
                      name="bymaxtimes"
                      onChange={e => {
                        if (e.target.checked) {
                          if (data.combo === "bydate") {
                            data.combo = "comboone";
                          } else {
                            data.combo = "bymaxtimes";
                          }
                        } else {
                          if (data.combo === "comboone") {
                            data.combo = "bydate";
                          } else {
                            data.combo = "";
                          }
                        }
                      }}
                      form={form}
                    >
                      可预约次数
                    </Checkbox>
                  )
                )}
                <Inputs
                  name="maxtimes"
                  value={data.maxtimes}
                  type="number"
                  form={form}
                  width={120}
                  placeholder="输入可预约次数"
                />
              </div>
              <div>
                {set(
                  {
                    name: "bydate",
                    value:
                      data.combo === "bydate" || data.combo === "comboone"
                        ? true
                        : false
                  },
                  valueSet => (
                    <Checkbox
                      className="pr_15"
                      checked={
                        data.combo === "bydate" || data.combo === "comboone"
                      }
                      name="bydate"
                      onChange={e => {
                        if (e.target.checked) {
                          if (data.combo === "bymaxtimes") {
                            data.combo = "comboone";
                          } else {
                            data.combo = "bydate";
                          }
                        } else {
                          if (data.combo === "comboone") {
                            data.combo = "bymaxtimes";
                          } else {
                            data.combo = "";
                          }
                        }
                      }}
                      form={form}
                    >
                      失效时间
                    </Checkbox>
                  )
                )}
                <Inputs
                  name="withinend"
                  value={data.withinend}
                  form={form}
                  radios={[
                    {
                      value: false,
                      text: (
                        <span>
                          <span className="mr_10">指定天数</span>
                          <Inputs
                            width={160}
                            name="validperiod"
                            value={
                              data.validperiod === 9999 ? "" : data.validperiod
                            }
                            form={form}
                            placeholder="请输入指定天数"
                          />
                        </span>
                      )
                    },
                    {
                      value: true,
                      text: (
                        <span>
                          <span className="mr_10">指定时间</span>
                          <Inputs
                            name="enddate"
                            value={data.enddate || null}
                            type="datePicker"
                            form={form}
                          />
                        </span>
                      )
                    }
                  ]}
                />
              </div>
            </Forms.Item>
            <FixedBox>
              <Btn className="ml_10" style={{ width: 100 }} htmlType="submit">
                {uuid === "" ? "确定" : "保存"}
              </Btn>
            </FixedBox>
          </div>
        )}
      </Form>
      <Page_ChoiceCourse ref={ref => (choiceCourse = ref)} />
      <Page_ChoiceTeacher ref={ref => (choiceTeacher = ref)} />
    </Skeleton>
  );
}
