import React, { useState, useEffect } from "react";
import {
  Form as Forms,
  Skeleton,
  InputNumber,
  Checkbox,
  Modal,
  Radio,
} from "antd";
import { $, Form, Inputs, Btn, FixedBox } from "../comlibs";
import { Cover } from "../works";
import { Page_ChoiceTeacher } from "../works";

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
};
const { confirm } = Modal;
export default function (props) {
  const Iconfont = $.icon();
  let _page = props.Parent;
  let {
    uuid = props.uuid,
    course_show,
    setShow,
    choiceTeacher,
    teacher = [],
    setTeacher,
    selectedData,
    setSelect,
  } = {};
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState({});
  let [traits, setTra] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await $.get(`/course/detail/${uuid}`);
      setData(res);
      let rs = await $.get("/course/trait");
      setTra(rs);
      setLoading(false);
    })();
  }, [uuid]);
  let Teacher = ({ datas }) => {
    datas.length > 0 &&
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
    [selectedData, setSelect] = useState(data.trait_uuids || []);
    return (
      <Forms.Item label="课程特色" className="mt_10 va_t">
        <Checkbox.Group defaultValue={selectedData}>
          {traits.length > 0 &&
            traits.map((v, index) => {
              return (
                <Checkbox
                  disabled={
                    selectedData.length === 5 &&
                    selectedData.indexOf(v.uuid) === -1
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
  let Courseshow = () => {
    [course_show, setShow] = useState(data.course_show || "NO");
    return (
      <Forms.Item label="学员端展示">
        <Radio.Group
          onChange={async (e) => {
            if (e.target.value === "NO") {
              confirm({
                title: "确定取消对外展示吗？",
                content:
                  "取消后课程关联的班级也无法对外进行展示，学员无法进行线上报名、咨询",
                async onOk() {
                  await $.post("/course/closeshow", {
                    course_uuid: uuid,
                  });
                  setShow("NO");
                  $.msg("关闭成功!");
                },
                async onCancel() {
                  setShow("YES");
                },
              });
            } else {
              await $.post("/course/openshow", { course_uuid: uuid });
              setShow("YES");
              $.msg("开启成功!");
            }
            _page.setCloseData(true);
          }}
          value={course_show}
        >
          <Radio value="YES">是</Radio>
          <Radio value="NO">否</Radio>
        </Radio.Group>
        {/* <Inputs
          name="course_show"
          form={form}
          value={course_show || "NO"}
          radios={[
            {
              value: "YES",
              text: "是",
            },
            {
              value: "NO",
              text: "否",
            },
          ]}
          
        /> */}
      </Forms.Item>
    );
  };
  return (
    <Skeleton loading={loading ? true : false} paragraph={{ rows: 10 }} active>
      <div className="topTips mt_15">
        <Iconfont className="fs_20" type="icon-tishi" />
        <span className="ml_10">完善课程信息可用于对外进行线上报名， </span>
        <a
          href="https://www.yuque.com/zwriad/bz1d16/course_display"
          target="_blank"
          style={{ color: "#388DED", textDecoration: "underline" }}
        >
          点击了解
        </a>
      </div>
      <div className="pt_15 mt_15 pb_100 bg_white">
        <Form
          {...col}
          action={`/course/save/${data.uuid}`}
          method="POST"
          success={async (res) => {
            _page.close(true);
            $.msg("数据更新成功~");
          }}
        >
          {({ form, set, setByName, submit }) => (
            <div className="box box-ver">
              <div
                style={{ width: 120, height: 40, lineHeight: "40px" }}
                className="fc_white fs_18 ta_c bg_blue mb_20"
              >
                基本信息
              </div>
              <Forms.Item label="课程封面">
                {set(
                  {
                    name: "cover",
                    value:
                      data.cover[0] ||
                      "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/408453f6-1734-11ea-ac92-00163e04cc20.png",
                  },
                  (valueSet) => (
                    <Cover
                      url={data.cover[0]!==''?data.cover[0]:'https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/course.png'}
                      type="cover"
                      prefix="course/cover/"
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
                value={data.name}
                placeholder="请输入课程名称"
              />
              <Forms.Item label="单课时长">
                {set(
                  {
                    name: "duration",
                    value: data.duration,
                    rules: [{ required: true, message: "请输入单课时长" }],
                  },
                  (valueSet) => (
                    <InputNumber placeholder="请输入单课时长" min={1} />
                  )
                )}
                <span className="ml_10">分钟/课时</span>
              </Forms.Item>
              <Courseshow form={form} />
              <Inputs
                label="展示排序"
                form={form}
                name="sortby"
                value={data.sortby}
                width={200}
                placeholder="数字越大越靠前"
              />
              <div
                style={{ width: 120, height: 40, lineHeight: "40px" }}
                className="fc_white fs_18 ta_c bg_blue mv_20"
              >
                详细信息
              </div>
              <Checkboxgroup setByName={setByName} />
              <Inputs
                label="适合人群"
                form={form}
                name="crowd"
                width={388}
                value={data.crowd}
                placeholder="请输入适合人群"
              />
              <Forms.Item {...col} label="课程名师">
                {set(
                  {
                    name: "teacher_uuids",
                    value: data.teacher_uuids || "",
                  },
                  (valueSet) => (
                    <span>
                      <Teacher datas={data.teachers || []} />
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
                value={data.target || ""}
                rows={4}
                width={240}
                placeholder="例如：通过xx学习，让学生感受到xx的魅力，提升学员的xx能力"
              />
              <Inputs
                label="课程详情"
                form={form}
                value={data.memo}
                name="memo"
                type="editor"
              />
              <FixedBox>
                <Btn className="ml_10" onClick={(e) => submit(e)}>
                  保存
                </Btn>
              </FixedBox>
            </div>
          )}
        </Form>
      </div>
      <Page_ChoiceTeacher ref={(ref) => (choiceTeacher = ref)} />
    </Skeleton>
  );
}
