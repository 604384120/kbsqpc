import React, { useEffect } from "react";
import { Empty, Tooltip, Form as Forms, Divider } from "antd";
import {
  $,
  Page,
  Form,
  FixedBox,
  Inputs,
  Modals,
  Btn,
  TablePagination,
  Img,
} from "../comlibs";
import Service from "../other/service";
import { Cover } from "../works";

export default function () {
  let { tab, page_add, modal_add, modal_create } = {};
  useEffect(() => {
    (async () => {})();
  }, [1]);

  let columns = [
    {
      title: "序号",
      align: "center",
      dataIndex: "_key",
    },
    {
      title: "主题",
      dataIndex: "title",
      width: 400,
    },
    {
      title: "时间",
      dataIndex: "time_publish",
    },
    {
      title: "发布人",
      render: (rs) => {
        return <span>{rs.teacher_name}</span>;
      },
    },
    {
      title: "操作",
      width: 140,
      render: (rs) => {
        return (
          <div>
            <a
              onClick={() => {
                if (rs.dynamic_type === "WX") {
                  modal_add.open(rs.title, rs);
                } else {
                  page_add.open(rs.title, rs, { left: 290 });
                }
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                $.confirm("确定删除吗?", async () => {
                  await $.post("/campus/dynamic/remove", {
                    dynamic_uuid: rs.uuid,
                  });
                  $.msg("删除成功");
                  tab.reload();
                });
              }}
              style={{ color: "#f07070" }}
            >
              删除
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt_15">
      <div className="bs mt_15 ph_10 bg_white minH">
        <div className="pt_20">
          <Form onSubmit={(values) => tab.search(values)}>
            {({ form }) => (
              <div className="mb_15">
                {/* <Inputs
                  width={120}
                  name="status"
                  placeholder="全部状态"
                  form={form}
                  select={[
                    { text: "全部状态", value: "" },
                    { text: "已发布", value: "PUBLISH" },
                    { text: "未发布", value: "UNPUBLISH" },
                  ]}
                  autoSubmit={true}
                /> */}
                <Btn onClick={() => modal_create.open("发布动态", {})}>
                  发布动态
                </Btn>
              </div>
            )}
          </Form>
          <TablePagination
            api="/campus/dynamic/list"
            columns={columns}
            ref={(ref) => (tab = ref)}
            emptyText={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    <Tooltip title={() => <Service />}>
                      <span>
                        老师可以在这里发布关于校区最近的活动文章、行业动态文
                        <br />
                        章、报考信息等。方便学员在学员端进行查看。该功能仅
                        <br />
                        支持旗舰版，您可以<span className="link">联系客服</span>
                        进行了解。
                      </span>
                    </Tooltip>
                  </span>
                }
              ></Empty>
            }
          />
        </div>
      </div>
      <Modals ref={(rs) => (modal_create = rs)}>
        <div
          className="box mv_20"
          style={{ paddingLeft: 30, paddingRight: 30 }}
        >
          <div
            className="box box-ver br_3 box-allc mr_10 pointer"
            style={{
              boxShadow: "0px 0px 19px 0px rgba(220,220,220,0.5)",
              width: 160,
              height: 150,
              marginRight: 64,
            }}
            onClick={() => {
              modal_create.close();
              modal_add.open("新建动态", {});
            }}
          >
            <Img
              src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/46a9474c-a6f3-11ea-8b90-00163e04cc20.png"
              style={{ width: 50, height: 50, margin: 0, background: "#fff" }}
              className="box mb_18"
            />

            <div className="box">微信公众号文章</div>
          </div>
          <div
            className="box box-ver br_3 box-allc ml_10 pointer"
            style={{
              boxShadow: "0px 0px 19px 0px rgba(220,220,220,0.5)",
              width: 160,
              height: 150,
            }}
            onClick={() => {
              modal_create.close();
              page_add.open("新建动态", {});
            }}
          >
            <Img
              src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/44ba63e4-a6f3-11ea-8b90-00163e04cc20.png"
              style={{ width: 50, height: 50, margin: 0, background: "#fff" }}
              className="box mb_18"
            />
            <div className="box">新建动态</div>
          </div>
        </div>
      </Modals>
      <Modals ref={(rs) => (modal_add = rs)} width={740}>
        {({ cover, title, content, uuid }) => (
          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
            onSubmit={async (values) => {
              if (values.cover === "") {
                delete values.cover;
              }
              if (uuid) {
                values.dynamic_uuid = uuid;
                await $.post(`/campus/dynamic/update`, values);
                modal_add.close();
                tab.reload();
                $.msg("更新成功!");
              } else {
                values.dynamic_type = "WX";
                await $.post("/campus/dynamic/add", values);
                modal_add.close();
                tab.reload();
                $.msg("创建成功!");
              }
            }}
          >
            {({ form, set }) => (
              <div>
                <Forms.Item label="封面">
                  {set(
                    {
                      name: "cover",
                      value: cover || "",
                    },
                    (valueSet) => (
                      <Cover
                        width={150}
                        height={150}
                        url={cover || ""}
                        type="cover"
                        prefix="dynamic/cover/"
                        max={1}
                        onSure={(d) => valueSet(d)}
                      />
                    )
                  )}
                </Forms.Item>
                <Inputs
                  label="标题"
                  form={form}
                  name="title"
                  value={title || ""}
                  required={true}
                  width={260}
                />
                <Inputs
                  label="文章链接"
                  form={form}
                  name="content"
                  value={content || ""}
                  width={260}
                  required={true}
                  placeholder="仅支持微信公众号文章链接"
                />
                <div className="ta_r mt_15 bt_1 pt_20">
                  <Btn
                    className="cancelBtn"
                    onClick={() => {
                      modal_add.close();
                    }}
                  >
                    取消
                  </Btn>
                  <Btn htmlType="submit" className="ml_15" />
                </div>
              </div>
            )}
          </Form>
        )}
      </Modals>
      <Page ref={(rs) => (page_add = rs)}>
        {({ cover, title, content, uuid }) => (
          <Form
            className="bs mt_15 ph_10 bg_white pt_15 pb_30"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onSubmit={async (values) => {
              if (values.cover === "") {
                delete values.cover;
              }
              if (uuid) {
                values.dynamic_uuid = uuid;
                await $.post(`/campus/dynamic/update`, values);
                page_add.close();
                tab.reload();
                $.msg("更新成功!");
              } else {
                values.dynamic_type = "CUSTOM";
                await $.post("/campus/dynamic/add", values);
                page_add.close();
                tab.reload();
                $.msg("创建成功!");
              }
            }}
          >
            {({ form, set }) => (
              <div>
                <Forms.Item label="封面">
                  {set(
                    {
                      name: "cover",
                      value: cover || "",
                    },
                    (valueSet) => (
                      <Cover
                        width={150}
                        height={150}
                        url={cover || ""}
                        type="cover"
                        prefix="dynamic/cover/"
                        max={1}
                        onSure={(d) => valueSet(d)}
                      />
                    )
                  )}
                </Forms.Item>
                <Inputs
                  label="标题"
                  form={form}
                  name="title"
                  value={title || ""}
                  required={true}
                  width={400}
                />
                <Inputs
                  label="内容"
                  form={form}
                  name="content"
                  type="editor"
                  value={content || ""}
                  required={true}
                  placeholder="请输入"
                />
                <FixedBox>
                  <Btn htmlType="submit" className="ml_15" />
                </FixedBox>
              </div>
            )}
          </Form>
        )}
      </Page>
    </div>
  );
}
