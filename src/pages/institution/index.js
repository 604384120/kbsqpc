import React, { useState, useEffect } from "react";
import {
  Form as Forms,
  Tag,
  Tabs,
  Divider,
  Checkbox,
  Icon,
  Tooltip,
  Popover
} from "antd";
import {
  $,
  Modals,
  Btn,
  Inputs,
  Page,
  Form,
  Img,
  TablePagination,
} from "../comlibs";
import { Cover } from "../works";
import Editcampus from "./editcampus";
import Addcampus from "./addcampus";
import Order from "./order";
import Principal from "./principal";

export default function () {
  const Iconfont = $.icon();
  const { TabPane } = Tabs;
  let {
    user = $.store().GlobalData.user,
    $curCampus = JSON.parse(localStorage.campus_obj) || {},
    $type = $.getQueryString("type") || "",
    uuid = localStorage.institution_uuid || undefined,
    page_editcampus,
    page_addcampus,
    modal_editins,
    modal_del,
    selectedData,
    setSelect,
    tab = {
      campus: {},
      source: {},
    },
    curTabKey = $.getQueryString("curTabKey") || "campus",
    campus,
    setCampus,
    getcode = false,
  } = {};
  let [data, setDatd] = useState({});
  let [merits, setMert] = useState([]);
  useEffect(() => {
    merit();
    if ($type === "create" || uuid === undefined) {
      if (user.phone) {
        modal_editins.open("请先创建学校");
      }
    } else {
      init();
    }
  }, [1]);
  function init() {
    (async () => {
      let d = await $.get(`/institution/detail/${uuid}`);
      if (d.merit) {
        let list = [];
        d.merit.map((v) => {
          if (v) {
            list.push(v);
          }
        });
        d.merit = list;
      }
      setDatd(d);
    })();
  }
  function merit() {
    (async () => {
      let m = await $.get(`/ins/merit`);
      m.value && setMert(m.value);
    })();
  }
  function campuslist() {
    (async () => {
      let c = await $.get("/user/ins/campus", {
        limit: 999,
        institution_uuid: uuid,
      });
      setCampus(c.campuss || []);
    })();
  }
  let columns = [
    {
      title: "序号",
      dataIndex: "_key",
      align: "center",
    },
    {
      title: "校区",
      render(rs) {
        return (
          <span
            className="link"
            onClick={() => {
              page_editcampus.open("编辑校区", {
                uuid: rs.uuid,
                shortname: data.shortname,
              });
            }}
          >
            {rs.name}
          </span>
        );
      },
    },
    {
      title: "类型",
      render(rs) {
        return (
          <span>
            {rs.belong_type && rs.belong_type === "JOIN" ? "加盟" : "直营"}
          </span>
        );
      },
    },
    {
      title: "校区校长",
      dataIndex: "owner_teaher.name",
    },
    {
      title: "校长电话",
      dataIndex: "owner_teaher.phone",
    },
    {
      title: "备注",
      dataIndex: "summary",
    },
    {
      title: "操作",
      align: "center",
      render(rs) {
        return (
          <div>
            <span
              className="pointer link"
              onClick={() => {
                page_editcampus.open("编辑校区", {
                  uuid: rs.uuid,
                  shortname: data.shortname,
                });
              }}
            >
              编辑
            </span>
            {$curCampus.ins_user_kind ? (
              <span>
                <Divider type="vertical" />
                <span
                  className="fc_err pointer"
                  onClick={async () => {
                    if (rs.students && rs.students > 0) {
                      $.warning("该校区下还有学员，无法删除！");
                    } else {
                      let d = await $.get("/ins/campus/page", {
                        limit: 999,
                        institution_uuid: uuid,
                      });
                      if (d.campus.length === 1) {
                        $.warning("必须保留一个校区！");
                        return false;
                      }
                      rs.cam_uuid = rs.uuid;
                      getcode = false;
                      modal_del.open("删除校区", rs);
                    }
                  }}
                >
                  删除
                </span>
              </span>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];
  let Checkboxgroup = () => {
    [selectedData, setSelect] = useState(data.merit || []);
    return (
      <Forms.Item label="学校特色" className="mt_10 va_t">
        <Checkbox.Group defaultValue={selectedData}>
          {merits.length > 0 &&
            merits.map((v, index) => {
              return (
                <Checkbox
                  disabled={
                    selectedData.length === 3 && selectedData.indexOf(v) === -1
                      ? true
                      : false
                  }
                  style={{ marginLeft: 0 }}
                  value={v}
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
                    setSelect(list);
                  }}
                >
                  {v}
                </Checkbox>
              );
            })}
        </Checkbox.Group>
      </Forms.Item>
    );
  };
  let Sources = () => {
    [campus, setCampus] = useState([]);
    useEffect(() => {
      campuslist();
    }, [1]);
    return (
      <div className="pb_30">
        <div
          style={{
            background:
              "url(https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/e2640ca0-fc4c-11e9-990e-00163e04cc20.png)no-repeat",
            minHeight: 330,
            backgroundSize: "100% 100%",
            textAlign: "center",
          }}
        >
          <div
            className="fc_white fs_16 lh_22 box-pc mb_20"
            style={{ paddingTop: 40 }}
          >
            <p>
              求学地图是一个培训机构与家长互联的平台，现已入驻10000+家机构，有效覆盖您周边5公里内的学员搜索！
            </p>
            <p>
              在这里展示您优质的教育资源，让家长轻松发现最值得信赖的教培机构！
            </p>
          </div>
          <Img
            width={160}
            className="mt_20"
            src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/d4c9a8ce-fc4d-11e9-990e-00163e04cc20.jpeg"
          />
        </div>
        <div className="mt_15">
          {campus.length > 0 &&
            campus.map((v, i) => {
              return (
                <div
                  className="pall_10 dis_ib mr_15 mb_10 b_1"
                  style={{ width: "32%" }}
                  key={i}
                >
                  <div className="box box-1 fs_16 fc_black">{v.name}</div>
                  <div
                    className={
                      v.certified === "sxz"
                        ? "fc_green box box-1 box-pe pointer"
                        : "fc_gold box box-1 box-pe pointer"
                    }
                    onClick={async (e) => {
                      if (!v.certified || v.certified !== "sxz") {
                        await $.post("/campus/join/qxdt", {
                          campus_uuid: v.campus_uuid,
                        });
                        $.msg("入驻成功!");
                        campuslist();
                      }
                    }}
                  >
                    {v.certified && v.certified === "sxz" ? "已入驻" : "入驻"}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  let Delcampus = ({ form, data }) => {
    let [num, setNum] = useState(60);
    let [disabled, setDisabled] = useState(false);
    return (
      <Forms.Item
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        label="验证码"
      >
        <Inputs form={form} name="verifycode" required={true} />
        <Btn
          className="ml_10 mt_5"
          onClick={async () => {
            await $.post(
              "/ins/approval/verifycode",
              {
                permission: "REMOVE_CAMPUS",
                institution_uuid: uuid,
                campus_uuid: data,
              },
              () => {
                closeInter();
              }
            );
            let closeInter = () => {
              setDisabled(false);
              setNum(60);
              clearInterval(inter);
            };
            let inter = setInterval(() => {
              if (num < 2) {
                closeInter();
              } else {
                num--;
                setNum(num);
              }
            }, 1000);
            setDisabled(true);
            getcode = true;
          }}
          disabled={disabled}
        >
          {disabled ? `请稍等${num}秒` : "获取验证码"}
        </Btn>
        <p className={!getcode ? "hide" : "fc_err mb_0"}>
          验证码已发送至总校长手机号上！
        </p>
      </Forms.Item>
    );
  };
  return (
    <div className="box box-ver mt_15">
      <div className="mb_10 box bg_white ph_16 pv_16">
        <div className="box b_1 br_2">
          <div
            className="bg_spcc"
            style={{
              width: 80,
              height: 80,
              backgroundImage: `url(${data.logo && data.logo.oss})`,
            }}
          />
        </div>
        <div className="box box-ver pt_5 pl_15">
          <div className="box box-ac">
            <div className="box fc_black5 fs_20 fb">{data.fullname}</div>
            {$curCampus.ins_user_kind ? (
              <a
                className="box box-ac ml_10"
                onClick={() => modal_editins.open("编辑学校信息", uuid)}
              >
                <Iconfont className="fc_info box fs_18" type="icon-bianji" />
              </a>
            ) : (
              ""
            )}
          </div>
          <div
            className={
              data.merit && data.merit.length > 0 ? "box box-ac mt_18" : "hide"
            }
          >
            <span className="fs_14 fc_black5">学校特色：</span>
            {data.merit &&
              data.merit.map((i) => {
                return (
                  <Tag
                    style={{ background: "#F7F7F7", color: "#999" }}
                    className="ph_10 pv_1 fs_13"
                    key={i}
                  >
                    <font>{i}</font>
                  </Tag>
                );
              })}
          </div>
        </div>
      </div>
      <div className="bg_white ph_16">
        <Tabs
          animated={false}
          defaultActiveKey={curTabKey}
          onChange={(key) => curTabKey === key}
        >
          <TabPane tab="校区" key="campus">
            {$curCampus.ins_user_kind ? (
              <div className="box box-ac mb_16">
              <Btn
                onClick={() => {
                  page_addcampus.open("新增校区", uuid);
                }}
              >
                新增校区
              </Btn>
              <span className="ml_8 fc_yellow">注：校区学员端需独立付费
                <Popover content={<div>
                  <img style={{width:150,height:150}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/7e02cf08-3b4e-11ea-ac9d-00163e04cc20.jpeg"/>
                </div>} trigger="click">
                  <span className="fc_blue underline pointer">去联系客服开通</span>
                </Popover>
              </span>
              </div>
            ) : (
              ""
            )}
            {uuid !== undefined ? (
              <TablePagination
              className="minH"
                api="/ins/campus/page"
                params={{
                  institution_uuid: uuid,
                }}
                columns={columns}
                ref={(ref) => (tab.campus = ref)}
              />
            ) : (
              ""
            )}
          </TabPane>
          {$curCampus.ins_user_kind ? (
            <TabPane tab="负责人" key="principal">
              <Principal uuid={uuid} />
            </TabPane>
          ) : (
            ""
          )}
          <TabPane tab="订单" key="order">
            <Order uuid={uuid} />
          </TabPane>
          <TabPane tab="找生源" key="source">
            <Sources />
          </TabPane>
        </Tabs>
      </div>
      <Page
        ref={(rs) => (page_editcampus = rs)}
        onClose={() => {
          tab.campus.reload();
        }}
      >
        <Editcampus />
      </Page>
      <Page
        ref={(rs) => (page_addcampus = rs)}
        onClose={() => {
          tab.campus.reload();
        }}
        datas={data}
      >
        <Addcampus />
      </Page>
      <Modals ref={(rs) => (modal_del = rs)}>
        {({ name, cam_uuid }) => {
          return (
            <Form
              onSubmit={async (values) => {
                $.confirm(`确定删除该校区吗？`, async () => {
                  await $.post("/ins/campus/remove", {
                    institution_uuid: uuid,
                    verifycode: values.verifycode,
                    campus_uuid: cam_uuid,
                  });
                  getcode = false;
                  $.msg("删除成功！");
                  modal_del.close();
                  await $.store().SMT_getUserData();
                  tab.campus.reload();
                });
              }}
            >
              {({ form }) => (
                <div>
                  <p style={{ paddingLeft: 45 }}>
                    删除【{name}】后所有内容将无法找回，请谨慎操作。
                  </p>
                  <Delcampus form={form} data={cam_uuid} />
                  <div className="ta_c mt_15">
                    <Btn htmlType="submit">删除</Btn>
                  </div>
                </div>
              )}
            </Form>
          );
        }}
      </Modals>
      <Modals
        ref={(rs) => (modal_editins = rs)}
        maskClosable={false}
        closable={false}
        width={600}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          onSubmit={async (values, btn) => {
            if (uuid !== undefined) {
              values.institution_uuid = uuid;
              values.merit = selectedData.toString();
              values.fullname = values.shortname;
              await $.post(`/institution/save/${uuid}`, values);
              modal_editins.close();
              init();
              $.msg("更新成功!");
            } else {
              btn.loading = true;
              let s = await $.post("/institution/create", values);
              localStorage.institution_uuid = s.institution_uuid;
              localStorage.campus_uuid = s.campus_uuid;
              modal_editins.close();
              $.msg("创建成功!");
              $.loc.replace("/adminPc/institution");
            }
          }}
        >
          {({ form, set, setByName, submit }) => (
            <div>
              {$type === "create" || uuid === undefined ? (
                <div>
                  <Inputs
                    label="学校名称"
                    form={form}
                    name="shortname"
                    required={true}
                    width={260}
                  />
                  <Inputs
                    label="联系人"
                    form={form}
                    name="owner"
                    required={true}
                    width={260}
                  />
                  <Inputs
                    label="联系电话"
                    form={form}
                    name="phone"
                    required={true}
                    value={user.phone}
                    width={260}
                  />
                </div>
              ) : (
                <div>
                  <Forms.Item label="学校logo">
                    {set(
                      {
                        name: "logo",
                      },
                      (valueSet) => (
                        <Cover
                          url={(data.logo && data.logo.oss) || ""}
                          type="cover"
                          prefix="institution/logo/"
                          onSure={(d) => valueSet(d)}
                          width={80}
                          height={80}
                          mark="logo"
                        />
                      )
                    )}
                  </Forms.Item>
                  <Inputs
                    label="学校名称"
                    form={form}
                    name="shortname"
                    value={data.shortname || ""}
                    required={true}
                    width={260}
                  />
                  <Checkboxgroup set={set} setByName={setByName} />
                  <div style={{ marginLeft: 120 }}>
                    <Tooltip title="没有合适的标签可联系客服">
                      <span className="fc_yellow">
                        最多支持3个标签
                        <Icon
                          type="exclamation-circle"
                          className="fc_yellow ml_5"
                        />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              )}
              <div className="ta_r mt_15 bt_1 pt_20">
                {$type === "create" || uuid === undefined ? (
                  <Btn
                    className="cancelBtn"
                    onClick={() => {
                      $.store().LG_out();
                    }}
                  >
                    退出
                  </Btn>
                ) : (
                  <Btn
                    className="cancelBtn"
                    onClick={() => {
                      modal_editins.close();
                    }}
                  >
                    取消
                  </Btn>
                )}
                <Btn onClick={(e) => submit(e)} className="ml_15" />
              </div>
            </div>
          )}
        </Form>
      </Modals>
    </div>
  );
}
