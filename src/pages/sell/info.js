import React, { useState, useEffect, useRef } from "react";
import { Form as Forms, Checkbox, Skeleton } from "antd";
import $$ from "jquery";
import { $, Form, Inputs, Btn, TableEdit, FixedBox } from "../comlibs";
import { Cover, Page_ChoiceCourse, Page_ChoiceClass } from "../works";

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};
export default function (props) {
  let [loading, setLoading] = useState(true);
  let [Data, setData] = useState({
    extension: {},
    joinType: "Teacher",
    enableType: "",
  });
  let { Parent = {}, product_uuid = "", nextStep } = props;
  let {
    choiceCourse,
    choiceClass,
    editSpecs,
    editClass,
    course = {},
    setCourse,
  } = {};
  if (Parent.data) {
    product_uuid = Parent.data;
  }
  let get = async () => {
    if (product_uuid) {
      let data = await $.get(`/product/${product_uuid}/detail`);
      data.joinType = data.extension.join_banji_type;
      data.enableType = Data.extension.enable_type;
      data.expireType = Data.extension.expire_type;
      setData(data);
    }
    setLoading(false);
  };
  let _init = useRef({ get });
  useEffect(() => {
    _init.current.get();
  }, [product_uuid]);

  let Course = ({ data }) => {
    [course, setCourse] = useState({
      name: data.course_name,
      uuid: data.course_uuid,
    });
    let name = course.name;
    return <span className={name && "pr_10"}>{name}</span>;
  };

  let toPenny = (n, p) => $.toPenny((n *100) * (p * 100) / 10000);
  let Price = ({ data }) => {
    let { key, cnt_courselessons, original_signle_price } = data;
    let num = toPenny(cnt_courselessons, original_signle_price);
    editSpecs.setByKey(key, "original_price", num);
    return <span id={key}>{num || "-"}</span>;
  };
  let specs = [
    {
      title: "课时数",
      dataIndex: "cnt_courselessons",
      type: "integer",
      min: 1,
      required: true,
      editable: true,
    },
    {
      title: "原单价(￥)",
      dataIndex: "original_signle_price",
      type: "money",
      required: true,
      editable: true,
    },
    {
      title: "原总价(￥)",
      width: 100,
      render: (res) => <Price data={res} />,
    },
    {
      title: "优惠后总价(￥)",
      dataIndex: "actual_price",
      type: "money",
      required: true,
      editable: true,
    },
    {
      title: "赠送课时数",
      dataIndex: "gift_courselessons",
      type: "integer",
      editable: true,
    },
  ];

  let groups = Data.extension.groups || [];
  let systemClassData = groups.map((g) => ({
    name: g.group_name,
    uuid: g.group_uuid,
    group_show_names: g.show_name,
    group_cnt_limits: g.cnt_limit,
  }));
  let Class = ({ index }) => {
    let [_class, setClass] = useState({});
    let name = _class.name || editClass.getByKey(index, "name");
    let uuid = _class.uuid || editClass.getByKey(index, "uuid");
    editClass.setByKey(index, "uuid", uuid);
    editClass.setByKey(index, "required", { uuid: "请先选择好班级~" });
    editClass.setByKey(index, "only", { uuid: "该班级已存在,请更换~" });
    return (
      <span>
        <span className={name && "pr_10"}>{name}</span>
        <span
          className="link"
          onClick={() =>
            choiceClass.open({
              max: 1,
              value: [_class],
              course_uuid: course.uuid || "",
              onSure: (d) => {
                setClass(d);
                editClass.setByKey(index, "uuid", d.uuid, true);
              },
            })
          }
        >
          选择班级
        </span>
      </span>
    );
  };
  let systemClass = [
    {
      title: "班级",
      width: 250,
      render: ({ key }) => {
        return <Class index={key} />;
      },
    },
    {
      title: "展示名",
      width: 200,
      dataIndex: "group_show_names",
      required: true,
      editable: true,
    },
    {
      title: "招生人数",
      width: 100,
      dataIndex: "group_cnt_limits",
      type: "integer",
      min: 1,
      editable: true,
    },
  ];

  return (
    <Skeleton loading={loading ? true : false} paragraph={{ rows: 10 }} active>
      <div className="mb_70 pt_20 ph_10 mt_15 bg_white">
        <Form
          {...col}
          action={`/courselesson/product/${product_uuid ? "update" : "create"}`}
          method="POST"
          params={{
            product_uuid,
          }}
          success={async (res, { btn }) => {
            if (nextStep) {
              btn.loading = true;
              let product_data = await $.get(
                `/product/${res.product_uuid || product_uuid}/detail`
              );
              btn.loading = false;
              if (!res.product_uuid) {
                res.product_uuid = product_uuid;
              }
              nextStep(res, product_data);
            } else {
              Parent.setCloseData(true);
              $.msg("数据更新成功~");
            }
          }}
        >
          {({ form, set, setByName, submit }) => (
            <div>
              <Forms.Item {...col} label="商品封面" className="mt_30">
                {set(
                  {
                    name: "main_picture",
                    value: Data.main_picture,
                    required: "请上传封面~",
                  },
                  (valueSet) => (
                    <Cover
                      url={Data.main_picture}
                      describe="建议尺寸750px*460px,图片小于2M"
                      prefix="sell/cover/"
                      onSure={(d) => valueSet(d)}
                    />
                  )
                )}
              </Forms.Item>
              <Forms.Item {...col} label="关联课程">
                {set(
                  {
                    name: "course_uuid",
                    value: Data.extension.course_uuid,
                    required: "请选择课程~",
                  },
                  (valueSet) => (
                    <span>
                      <Course data={Data.extension} />
                      <a
                        disabled={Data.extension.course_name ? true : false}
                        onClick={() =>
                          choiceCourse.open({
                            max: 1,
                            value: [course],
                            onSure: (d) => {
                              setCourse(d);
                              valueSet(d.uuid);
                            },
                          })
                        }
                      >
                        选择课程
                      </a>
                    </span>
                  )
                )}
              </Forms.Item>
              <Inputs
                className="mv_16"
                width={400}
                label="商品名称"
                form={form}
                name="name"
                value={Data.name}
                required={true}
                maxLength={35}
              />
              <Forms.Item
                {...col}
                className="mv_16"
                label="售卖规格"
                required={true}
              >
                <TableEdit
                  title="课时售卖规格"
                  columns={specs}
                  data={Data.specification}
                  add
                  init={(ref) => (editSpecs = ref)}
                  onSave={async (d) => {
                    let original_price = toPenny(d.cnt_courselessons, d.original_signle_price);
                    d.original_price = original_price;
                    if (d.uuid) {
                      d.specification_uuid = d.uuid;
                      await $.post("/courselesson/specification/update", d);
                      $.msg("规格更新成功~");
                    }
                    if (!d.uuid && product_uuid) {
                      d.sort = 1;
                      d.product_uuid = product_uuid;
                      let res = await $.post(
                        "/courselesson/specification/add",
                        d
                      );
                      editSpecs.setByKey(d.key, "uuid", res.uuid);
                      $.msg("规格添加成功~");
                    }
                  }}
                  onDelete={async (d) => {
                    if (d.uuid) {
                      d.specification_uuid = d.uuid;
                      await $.post("/courselesson/specification/remove", d);
                      $.msg("规格删除成功~");
                    }
                  }}
                  onChangeInput={(val, key, name) => {
                    let cnt_courselessons = name === "cnt_courselessons"? val: ($$("#cnt_courselessons").val() || 0);
                    let original_signle_price = name === "original_signle_price"? val: ($$("#original_signle_price").val() || 0); 
                    let num = toPenny(cnt_courselessons, original_signle_price);
                    $$(`#${key}`).html(num);
                  }}
                  onChange={(d, data) => {
                    let {
                      cnt_courselessons = [],
                      original_signle_price = [],
                      actual_price = [],
                      gift_courselessons = [],
                      original_price = [],
                    } = data;
                    setByName(
                      "cnt_courselessons",
                      cnt_courselessons.toString()
                    );
                    setByName(
                      "original_signle_price",
                      original_signle_price.toString()
                    );
                    setByName("actual_price", actual_price.toString());
                    setByName(
                      "gift_courselessons",
                      gift_courselessons.toString()
                    );
                    setByName("original_price", original_price.toString());
                    setByName(
                      "sort",
                      Array.from(
                        { length: d.length },
                        (v, i) => i + 1
                      ).toString()
                    );
                  }}
                />
              </Forms.Item>
              <Forms.Item
                {...col}
                className="mv_16"
                label="课程时效"
                required={true}
              >
                <div className="box">
                  <span className="box pr_15">生效日期</span>
                  <div className="box">
                    <Inputs
                      className="va_tt dis_b"
                      name="enable_type"
                      value={Data.extension.enable_type || "BUY_DATE"}
                      form={form}
                      required={true}
                      placeholder="请设置课程时效~"
                      radios={[
                        {
                          value: "BUY_DATE",
                          text: "购买日期",
                        },
                        {
                          value: "FIX_DATE",
                          text: (
                            <span>
                              <span className="mr_10">指定日期</span>
                              <Inputs
                                className={
                                  Data.enableType === "FIX_DATE" ? "" : "hide"
                                }
                                name="enable_date"
                                value={Data.extension.enable_date}
                                type="datePicker"
                                form={form}
                              />
                            </span>
                          ),
                        },
                      ]}
                      onChange={(e) => {
                        Data.enableType = e;
                      }}
                    />
                  </div>
                </div>
                <div className="box">
                  <span className="box pt_5 pr_15">失效日期</span>
                  <div className="box">
                    <Inputs
                      className="dis_b va_tt"
                      name="expire_type"
                      value={Data.extension.expire_type || "BY_DAYS"}
                      form={form}
                      radios={[
                        {
                          value: "BY_DAYS",
                          text: (
                            <span>
                              <span className="mr_10">指定天数</span>
                              <Inputs
                                width={90}
                                name="expire_days"
                                value={Data.extension.expire_days || 30}
                                form={form}
                                placeholder="请输入"
                              />
                            </span>
                          ),
                        },
                        {
                          value: "BY_DATE",
                          text: (
                            <span>
                              <span className="mr_10">指定日期</span>
                              <Inputs
                                className={
                                  Data.expireType === "BY_DATE" ? "" : "hide"
                                }
                                name="expire_date"
                                value={Data.extension.expire_date}
                                type="datePicker"
                                form={form}
                              />
                            </span>
                          ),
                        },
                      ]}
                      onChange={(e) => {
                        Data.expireType = e;
                      }}
                    />
                  </div>
                </div>
              </Forms.Item>
              <Inputs
                label="入班方式"
                name="join_banji_type"
                value={Data.extension.join_banji_type || "TEACHER"}
                form={form}
                className="va_tt mv_16 dis_b"
                placeholder="请选择入班方式"
                radios={[
                  {
                    value: "TEACHER",
                    text: (
                      <span>
                        <span>
                          人工操作（学员报名后，需要老师自行将学员进行班级分配）
                        </span>
                        <div
                          className="mt_10 ml_25"
                          style={{ marginBottom: -15 }}
                        >
                          <span className="mr_10">招生人数</span>
                          <Inputs
                            width={90}
                            name="cnt_limit"
                            value={Data.extension.cnt_limit}
                            form={form}
                            placeholder="请输入"
                          />
                        </div>
                      </span>
                    ),
                  },
                  {
                    value: "USER",
                    text: (
                      <span>
                        <span>
                          系统入班（学员报名后，可选择适合自己时间的班级，直接入班，免去老师操作）
                        </span>
                        <div
                          className={
                            Data.joinType === "USER" ? "mt_15 ml_25" : "hide"
                          }
                          style={{ minWidth: 650 }}
                        >
                          <TableEdit
                            title="班级"
                            columns={systemClass}
                            data={systemClassData}
                            add
                            init={(ref) => (editClass = ref)}
                            onChange={(d, data) => {
                              let {
                                uuid = [],
                                group_show_names = [],
                                group_cnt_limits = [],
                              } = data;
                              setByName("group_uuids", uuid.toString());
                              setByName(
                                "group_show_names",
                                group_show_names.toString()
                              );
                              setByName(
                                "group_cnt_limits",
                                group_cnt_limits.toString()
                              );
                            }}
                          />
                        </div>
                      </span>
                    ),
                  },
                ]}
                required={true}
                onChange={(e) => {
                  Data.joinType = e;
                }}
              />
              <Inputs
                label="超额报名"
                name="allow_oversell"
                value={Data.extension.allow_oversell || "YES"}
                form={form}
                required={true}
                className="va_tt mv_16 dis_b"
                placeholder="请设置超额报名情况"
                radios={[
                  {
                    value: "YES",
                    text:
                      "允许超额报名（达到报名上限后，学员人还可以进行报名并付款，后台订单中会对学员进行标识，学校需要线下进行沟通处理）",
                  },
                  {
                    value: "NO",
                    text:
                      "不允许超额报名（达到报名上限后，学员无法继续报名并付款）",
                  },
                ]}
              />
              <Forms.Item {...col} label="课程亮点">
                {set(
                  {
                    name: "advantages",
                    value: Data.extension.advantages,
                  },
                  (valueSet) => (
                    <Checkbox.Group
                      options={[
                        { label: "一对一", value: "一对一" },
                        { label: "名师", value: "名师" },
                        { label: "寒假班", value: "寒假班" },
                        { label: "暑假班", value: "暑假班" },
                        { label: "秋季班", value: "秋季班" },
                        { label: "春季班", value: "春季班" },
                        { label: "随到随学", value: "随到随学" },
                        { label: "小班课", value: "小班课" },
                      ]}
                      onChange={(rs) => setByName("advantages", rs.toString())}
                    />
                  )
                )}
              </Forms.Item>
              <Inputs
                className="mv_16"
                label="适合人群"
                form={form}
                name="crowd"
                value={Data.extension.crowd}
              />
              <Inputs
                className="mv_16"
                label="商品详情"
                form={form}
                name="memo"
                value={Data.memo}
                type="editor"
              />
              <FixedBox>
                <Btn onClick={(e) => submit(e)}>
                  {nextStep ? "确定并下一步" : "保存"}
                </Btn>
              </FixedBox>
            </div>
          )}
        </Form>
        <Page_ChoiceCourse ref={(ref) => (choiceCourse = ref)} />
        <Page_ChoiceClass ref={(ref) => (choiceClass = ref)} />
      </div>
    </Skeleton>
  );
}
