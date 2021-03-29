import React from "react";
import { Tabs, Divider,Modal } from "antd";
import {
  $,
  Page,
  Form,
  Inputs,
  Btn,
  TablePagination,
  Dropdown,
} from "../comlibs";
import { Course, WorksData, Poster } from "../works";
import Add from "./add";
import Info from "./info";
import Order from "./order";

let appid = "";
const { TabPane } = Tabs;
export default function () {
  let {
    Page_add,
    Page_detail,
    Page_order,
    tab = { tab_on: {}, tab_off: {} },
    tab_key = "tab_on",
    poster,
  } = {};

  (async () => {
    let campus = await WorksData.campus();
    appid = campus.enable.xcx_appid();
  })();

  const dropdown = [
    {
      name: (rs) => `对外${rs.public === "YES" ? "隐藏" : "展示"}`,
      onClick: (rs) => {
        let on = rs.public === "YES";
        let text = on ? "隐藏" : "展示";
        $.confirm(`确定要对外${text}该商品吗？`, async () => {
          let res = await $.post("/courselesson/product/update", {
            product_uuid: rs.uuid,
            public: on ? "NO" : "YES",
          });
          $.msg(`对外${text}成功!`);
          tab[tab_key].reload();
          return res;
        });
      },
    },
    {
      name: (rs) => (rs.status === "on_sell" ? "下架" : "上架"),
      onClick: (rs) => {
        let on = rs.status === "on_sell";
        let text = on ? "下架" : "上架";
        $.confirm(`确定要${text}该商品吗？`, async () => {
          let res = await $.post(`/product/${on ? "offsell" : "onsell"}`, {
            product_uuid: rs.uuid,
          });
          $.msg(`${text}成功!`);
		  tab.tab_on.reload();
		  tab.tab_off.api&&tab.tab_off.reload();
          return res;
        });
      },
    },
    {
      name: "删除",
      onClick: (rs) => {
        $.confirm("确定要删除该商品吗？", async () => {
          let res = await $.post("/product/remove", {
            product_uuid: rs.uuid,
          });
          $.msg("删除成功!");
          tab[tab_key].reload();
          return res;
        });
      },
    },
  ];

  let columns = [
    {
      title: "序号",
      dataIndex: "_key",
    },
    {
      title: "商品名称",
      render: (rs) => (
        <span
          onClick={() => Page_detail.open(rs.name, rs.uuid)}
          className="link"
        >
          {rs.name}
        </span>
      ),
    },
    {
      title: "关联课程",
      dataIndex: "extension.course_name",
    },
    {
      title: "售卖方式",
      render: (rs) => (
        <span>
          {rs.extension && rs.extension.specification_type === "LESSONTIMES"
            ? "按课时"
            : "按时段"}
        </span>
      ),
    },
    {
      title: "招生人数",
      dataIndex: "extension.cnt_limit",
    },
    {
      title: "已招人数",
      render: (rs) => rs.cnt_orders || 0,
    },
    {
      title: "操作",
      width: 150,
      render: (rs) => (
        <span>
          <span
            className="link"
            onClick={() =>
              poster.open("分享海报", {
                api: "/poster/product/courselesson",
                params: {
                  original_price: rs.original_price,
                  discount_price: rs.actual_price,
                  xcx_appid: appid,
                  scene: $.toScene(rs.uuid),
                  page: "pages/course/productdetail",
                  title: rs.name,
                  cover: rs.main_picture,
                  campus_uuid: $.campus_uuid(),
                },
              })
            }
          >
            分享
          </span>
          <Divider type="vertical" />
          <span
            className="link"
            onClick={() => Page_order.open("订单列表", rs.name)}
          >
            订单
          </span>
          <Divider type="vertical" />
          <Dropdown data={rs} list={dropdown}>
            <span className="link">更多</span>
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <div className="bs ph_10 mt_15 bg_white">
      <Tabs
        defaultActiveKey="tab_on"
        onChange={(key) => {
          tab_key = key;
        }}
      >
        <TabPane tab="上架中" key="tab_on">
          <Form onSubmit={(values) => tab.tab_on.search(values)}>
            {({ form }) => (
              <div className="mb_10">
                <Course className="mr_10" form={form} />
                <Inputs
                  form={form}
                  name="product_name"
                  className="mr_10"
                  placeholder="请输入商品名称"
                />
                <Btn htmlType="submit" iconfont="sousuo">
                  搜索
                </Btn>
                <Btn
                  className="fl_r"
                  onClick={async (rs) => {
                    let res=await $.get('/campus/authority',{func_id:'SHOP'})
                    if(res.status){
                        Page_add.open("创建商品", "create")
                    }else{
                        Modal.info({
                            title:'提示',
                            content:'当前校区未开通商城功能，请联系客服了解详情：400-766-1816'
                        })
                    }
                  }}
                >
                  售卖课程
                </Btn>
              </div>
            )}
          </Form>
          <TablePagination
            api="/product/list"
            params={{
              product_type: "courselesson",
              status: "on_sell",
              public: "all",
            }}
            columns={columns}
            ref={(ref) => (tab.tab_on = ref)}
          />
        </TabPane>
        <TabPane tab="已下架" key="tab_off">
          <Form onSubmit={(values) => tab.tab_off.search(values)}>
            {({ form }) => (
              <div className="mb_10">
                <Course className="mr_10" form={form} />
                <Inputs
                  form={form}
                  name="product_name"
                  className="mr_10"
                  placeholder="请输入商品名称"
                />
                <Btn htmlType="submit" iconfont="sousuo">
                  搜索
                </Btn>
              </div>
            )}
          </Form>
          <TablePagination
            api="/product/list"
            params={{
              product_type: "courselesson",
              status: "off_sell",
              public: "all",
            }}
            columns={columns}
            ref={(ref) => (tab.tab_off = ref)}
          />
        </TabPane>
      </Tabs>
      <Poster ref={(ref) => (poster = ref)} />
      <Page ref={(rs) => (Page_add = rs)} onClose={() => tab[tab_key].init()}>
        <Add />
      </Page>
      <Page
        ref={(rs) => (Page_detail = rs)}
        onClose={() => tab[tab_key].reload()}
      >
        <Info />
      </Page>
      <Page ref={(rs) => (Page_order = rs)}>
        <Order />
      </Page>
    </div>
  );
}
