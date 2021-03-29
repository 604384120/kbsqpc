import React, { useState } from "react";
import { Steps, Icon } from "antd";
import { $, Btn, Img } from "../comlibs";
import { WorksData } from "../works";
import Info from "./info";

const { Step } = Steps;

let appid = "";
let product_uuid = "";
let product_data = {};
export default function (props) {
  let [current, setCurrent] = useState(0);
  let { Parent } = props;
  let { params = {} } = {};
  let [push, setPush] = useState({
    is_push: false,
    url: "",
  });
  let scene = $.toScene(product_uuid);
  let path = "pages/course/productdetail";

  (async () => {
    let campus = await WorksData.campus();
    appid = campus.enable.xcx_appid();
  })();

  const steps = [
    {
      title: "编辑商品信息",
      content: (
        <Info
          product_uuid={Parent.data !== "create" ? product_uuid : ""}
          nextStep={(res, data) => {
            Parent.data = "";
            product_uuid = res.product_uuid;
            product_data = data;
            setCurrent(1);
          }}
        />
      ),
    },
    {
      title: "预览",
      content: (
        <div className="box box-ver minH">
          <div className="box box-allc mt_30">
            <Img
              width={200}
              height={200}
              src={`/wechat/xcx/${appid}/qrcode`}
              params={{
                scene,
                page: path,
              }}
            />
          </div>
          <div className="box box-allc mv_15">打开微信，扫描上方二维码预览</div>
          <div className="box box-allc">
            <Btn type="default" onClick={() => setCurrent(0)}>
              返回修改
            </Btn>
            <Btn className="ml_10" onClick={() => setCurrent(2)}>
              下一步
            </Btn>
          </div>
        </div>
      ),
    },
    {
      title: "完成",
      content: (
        <div className="box box-ver minH">
          {!push.is_push ? (
            <div>
              <div className="box box-allc">
                <Icon
                  className="fc_suc"
                  type="check-circle"
                  theme="filled"
                  style={{
                    fontSize: 56,
                    margin: "50px 0 30px 0",
                  }}
                />
              </div>
              <div className="box box-allc mb_15">
                售卖课程创建成功，您可以立即上架进行招生报名。
              </div>
              <div className="box box-allc">
                <Btn type="default" onClick={() => Parent.close(true)}>
                  返回商品列表
                </Btn>
                <Btn
                  className="ml_10"
                  onClick={async (btn) => {
                    btn.loading = true;
                    $.post("/product/onsell", { product_uuid });
                    btn.loading = false;
                    setPush({
                      is_push: true,
                      url: "",
                    });
                    Parent.setCloseData(true);
                    $.msg("上架成功！");
                  }}
                >
                  立即上架
                </Btn>
              </div>
            </div>
          ) : (
            <div className="pt_20">
              <Img
                width={340}
                height={584}
                src={$.loc.origin+ "/poster/product/courselesson"}
                params={{
                  token: $.token(),
                  original_price: product_data.original_price,
                  discount_price: product_data.actual_price,
                  xcx_appid: appid,
                  scene,
                  page: path,
                  title: product_data.name,
                  cover: product_data.main_picture,
                  campus_uuid: $.campus_uuid(),
                }}
                onLoad={(src) =>
                  setPush({
                    is_push: true,
                    url: src,
                  })
                }
              />
              <div className="ta_c mt_20">
                <Btn
                  width={120}
                  type="default"
                  onClick={() => Parent.close(true)}
                >
                  返回商品列表
                </Btn>
                <Btn
                  width={120}
                  className="ml_15"
                  disabled={push.url ? false : true}
                  onClick={async (btn) => {
                    btn.loading = true;
                    await $.download(push.url, {
                      name: product_data.name,
                      _type: "url",
                    });
                    btn.setloading(false, 5000);
                  }}
                >
                  下载海报
                </Btn>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bs ph_10 pb_20 mt_15 bg_white">
      <Steps type="navigation" current={current} className="bb_i1">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </div>
  );
}
