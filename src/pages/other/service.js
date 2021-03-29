import React from "react";
import { Img } from "../comlibs";
export default function () {
  return (
    <span className="ta_c fc_white">
      <div className="mb_5 ta_l">
        <a
          href="http://wpa.qq.com/msgrd?v=3&amp;uin=3307483314&amp;site=qq&amp;menu=yes"
          title="点击即可进行客服咨询哦"
          target="_blank"
          className="fc_white"
        >
          QQ咨询客服
        </a>
      </div>
      <div className="mb_5">热线：400-766-1816</div>
      <Img
        className="mb_5"
        style={{ width: 130, height: 130 }}
        src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/7e02cf08-3b4e-11ea-ac9d-00163e04cc20.jpeg"
      />
      <div>扫码添加客服微信</div>
    </span>
  );
}
