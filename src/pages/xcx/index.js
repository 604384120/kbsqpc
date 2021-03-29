import React, { useState, useEffect } from "react";
import { $, Btn } from "../comlibs";
import Content from "./setting";
export default function () {
  let [buylength, setLen] = useState([]);
  let [product, setPro] = useState([]);
  useEffect(() => {
    (async () => {
      let s = await $.get("/user/product/ext", {
        product_type: "extjson",
      });
      setLen(s);
      if (s.length === 0) {
        getpro();
      }
    })();
  }, [1]);
  async function getpro() {
    let s = await $.get("/product/list", { product_type: "extjson" });
    setPro(s);
  }
  return (
    <div className="box mt_15 pb_20 br_2 bg_white">
      {buylength.length > 0 ? (
        <Content className="box box-1" buy={buylength} />
      ) : (
        <div className="box pv_30" style={{ margin: "0 auto" }}>
          {product.map((s, i) => {
            return (
              <div
                key={s.uuid}
                className={
                  i !== 0
                    ? "box box-1 br_4 ml_30 dis_ib"
                    : "box box-1 br_4 dis_ib"
                }
                style={{
                  minHeight: "380px",
                  boxShadow: "0px 0px 35px 0px rgba(236,235,235,0.5)",
                  width: 290,
                }}
              >
                <div className="box box-1">
                  <div className="box box-1 box-ver box-allc">
                    <div
                      className="box box-allc fs_24 fc_white"
                      style={{
                        height: "65px",
                        width: "100%",
                        borderRadius: "4px 4px 0px 0px",
                        background: s.show_color.replace(/\s+/g, ""),
                      }}
                    >
                      {s.name}
                    </div>
                    <div className="box box-1 box-ver box-allc box-1 pv_20">
                      <div
                        className="box fc_gray4 fs_15 mt_30 mh_30"
                        style={{ height: 160 }}
                      >
                        {s.intr}
                      </div>
                      <div className="box box-ac fc_black1 fs_17">
                        ￥<span className="box fb fs_30">{s.actual_price}</span>
                        /年
                      </div>
                      <a
                        className="fc_white"
                        target="_blank"
                        href={
                          $.loc.origin +
                          `/product/productset.html?id=${s.uuid}&menu=xcx`
                        }
                      >
                        <Btn className="box box-allc br_18 mt_15" width={130}>
                          立即购买
                        </Btn>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
