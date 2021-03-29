import React, { useState, useEffect } from "react";
import { Form as Forms, Steps, Icon, InputNumber, Checkbox } from "antd";
import { $, Page, Form, Inputs, Btn, FixedBox, Modals } from "../comlibs";
import { Cover } from "../works";
import { Page_ChoiceTeacher } from "../works";
import Detail from "./detail";
import Createclass from "../class/createClass";
import AddClass from "../class/addClass"
const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
};
export default function (props) {
  const { Step } = Steps;
  let {
    createclass,
    Parent = props.Parent,
    choiceTeacher,
    page_detail,
    teacher = [],
    setTeacher,
    selectedData,
    setSelect,
    page_addClass
  } = {};
  let [current, setCurrent] = useState(0);
  let [course_uuid, setUuid] = useState("");
  let [traits, setTra] = useState([]);
  useEffect(() => {
    (async () => {
      let rs = await $.get("/course/trait");
      setTra(rs);
    })();
  }, [1]);
  let Teacher = ({ datas }) => {
    datas.map((v) => {
      v.uuid = v.teacher_uuid;
      return v;
    });
    [teacher, setTeacher] = useState(datas);
    let name = teacher
      .map((v) => {
        return v.name;
      })
      .join("，");
    return <span>{name || ""}</span>;
  };
  let Checkboxgroup = ({ setByName }) => {
    [selectedData, setSelect] = useState([]);
    return (
      <Forms.Item label="课程特色" className="mt_10 va_t">
        <Checkbox.Group defaultValue={selectedData}>
          {traits.length > 0 &&
            traits.map((v, index) => {
              return (
                <Checkbox
                  disabled={
                    selectedData.length === 5 && selectedData.indexOf(v.uuid) === -1
                      ? true
                      : false
                  }
                  style={{ marginLeft: 0 }}
                  value={v.uuid}
                  key={index}
                  onChange={(e) => {
                    let list = [...selectedData];
                    if (!list.includes(e.target.value) && e.target.checked) {
                      list.push(e.target.value);
                    } else if (
                      list.includes(e.target.value) &&
                      !e.target.checked
                    ) {
                      let index = list.indexOf(e.target.value);
                      if (index > -1) {
                        list.splice(index, 1);
                      }
                    }
                    setByName("trait_uuids", list.toString());
                    setSelect(list);
                  }}
                >
                  {v.trait_name}
                </Checkbox>
              );
            })}
        </Checkbox.Group>
      </Forms.Item>
    );
  };
  const steps = [
    {
      title: "基本信息",
      content: (
        <div className="mt_30">
          <Form
            {...col}
            onSubmit={async (values) => {
              values.cover = values.cover + "";
              let res = await $.post("/course/create", values);
              await $.post("/course/openshow", {
                course_uuid: res.course_uuid,
              });
              setUuid(res.course_uuid);
              setCurrent(1);
              Parent.setCloseData(true);
            }}
          >
            {({ form, set }) => (
              <div className="box box-ver mt_30">
                <Forms.Item label="课程封面">
                  {set(
                    {
                      name: "cover",
                      value:"",
                    },
                    (valueSet) => (
                      <Cover
                        type="cover"
                        prefix="course/cover/"
                        describe="建议上传尺寸：750*480，小于4M"
                        onSure={(d) => valueSet(d)}
                      />
                    )
                  )}
                </Forms.Item>
                <Inputs
                  label="课程名称"
                  form={form}
                  name="name"
                  required={true}
                  width={388}
                  placeholder="请输入课程名称"
                />
                <Forms.Item label="单课时长">
                  {set(
                    {
                      name: "duration",
                      value: "90",
                      rules: [{ required: true, message: "请输入单课时长" }],
                    },
                    (valueSet) => (
                      <InputNumber placeholder="请输入单课时长" min={1} />
                    )
                  )}
                  <span className="ml_10">分钟/课时</span>
                </Forms.Item>
                <FixedBox>
                  <Btn className="ml_10" htmlType="submit">
                    下一步
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "详细信息",
      content: (
        <div>
          <Form
            {...col}
            onSubmit={async (values) => {
              let data = await $.post(`/course/save/${course_uuid}`, values);
              setCurrent(2);
              return data;
            }}
          >
            {({ form, set, setByName }) => (
              <div className="box box-ver mt_30">
                <Checkboxgroup setByName={setByName} />
                <Inputs
                  label="适合人群"
                  form={form}
                  name="crowd"
                  value="不限人群"
                  width={388}
                  placeholder="请输入适合人群"
                />
                <Forms.Item {...col} label="课程名师">
                  {set(
                    {
                      name: "teacher_uuids",
                      value: "",
                    },
                    (valueSet) => (
                      <span>
                        <Teacher datas={[]} />
                        <a
                          className="ml_10"
                          onClick={() => {
                            choiceTeacher.open({
                              value: teacher,
                              onSure: (d) => {
                                setTeacher(d);
                                let uuids = [];
                                d.map((v) => {
                                  uuids.push(v.teacher_uuid);
                                  return v;
                                });
                                valueSet(uuids);
                              },
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
                  className="mv_10"
                  form={form}
                  label="课程学习目标"
                  name="target"
                  rows={4}
                  width={240}
                  placeholder="例如：通过xx学习，让学生感受到xx的魅力，提升学员的xx能力"
                />
                <Inputs
                  label="详细介绍"
                  form={form}
                  value=""
                  name="memo"
                  type="editor"
                />
                <FixedBox>
                  <Btn className="ml_10" htmlType="submit">
                    下一步
                  </Btn>
                </FixedBox>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "完成",
      content: (
        <div className="box box-ver">
          <div className="box box-allc">
            <Icon
              className="fc_suc"
              type="check-circle"
              theme="filled"
              style={{
                fontSize: 60,
                margin: "120px 0 30px 0",
              }}
            />
          </div>
          <div className="box box-allc fc_black mb_15 fs_20 fw_600">
            课程创建成功
          </div>
          <div className="box box-allc mb_15 fc_gray">
            您可以对课程进行建班排课，学员入班后即可开始正常教学任务
          </div>
          <div className="ta_c mt_30">
            <Btn type="default" onClick={() => Parent.close(true)}>
              返回课程列表
            </Btn>
            <Btn
              className="default ml_10"
              onClick={() => {
                page_detail.open("课程详情", course_uuid);
              }}
            >
              查看课程详情
            </Btn>
            <Btn
              className="default ml_10"
              onClick={async () => {
                // let res = await $.get(`/course/detail/${course_uuid}`);
                page_addClass.open('建班排课',{course_uuid})
                // createclass.open("创建班级", {
                //   coursename: res.name,
                //   uuid: course_uuid,
                // });
              }}
            >
              建班排课
            </Btn>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="bg_white ph_10 mt_15" style={{ minHeight: 800 }}>
      <Steps type="navigation" current={current} className="bb_i1">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <Modals ref={(rs) => (createclass = rs)} style={{ width: 360 }}>
        {({ coursename, uuid }) => {
          return (
            <Createclass
              data={{
                coursename: coursename,
                uuid: uuid,
              }}
              success={() => {
                createclass.close();
              }}
            />
          );
        }}
      </Modals>
      <Page_ChoiceTeacher ref={(ref) => (choiceTeacher = ref)} />
      <Page ref={(rs) => (page_detail = rs)}>
        <Detail />
      </Page>
      <Page ref={(ref) => (page_addClass = ref)}>
        <AddClass/>
      </Page>
    </div>
  );
}
