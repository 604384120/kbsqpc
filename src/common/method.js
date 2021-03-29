import React from "react";
import { notification as Notification, Icon, Button } from "antd";
import Method from "react-ant-comlibs";
import Moment from "moment";
import $$ from "jquery";
import dva, { connect } from 'dva';
import { Router, Route } from 'dva/router';
import { createBrowserHistory } from 'history'

let { default: Methods, Config, New } = Method;

Config({
  ApiCom: "",
  homePage: "sxzPro",
  proxyIdentify: "local",
  iconId: "font_1292940_hh5ih86ubl4",
  isLocal: window.location.href.indexOf("test.com") > -1,
  deleteNullParams: false,
});

let UpdateChecking = false;
let CityCodeData = [];
let CityCodeList = [];
let CoursecateList = "";
class comlibs extends Methods {
  constructor(props) {
    super();
    this.props = props;
    this.uuid = () => localStorage.uuid || "";
    this.token = () => localStorage.token || "";
    this.campus_uuid = () => localStorage.campus_uuid || "";
    this.institution_uuid = () => localStorage.institution_uuid || "";
    //this.CheckUpdate();

    if (props && props.current) {
      return this.ref(props);
    }
  }

  getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  timeSpace(start, end, type = "days") {
    if (typeof start === "string") {
      start = start.replace(/-/g, "/");
      end = end.replace(/-/g, "/");
    }
    start = new Date(start).getTime();
    end = new Date(end).getTime();
    let space = end - start;
    if (type === "days") {
      return parseInt(space / (24 * 60 * 60 * 1000)) + 1;
    }
    return null;
  }

  maxNumText(n, unit = "") {
    return !n || n === 99999 ? "不限" : n + unit;
  }

  toScene(uuid = "") {
    return uuid.replace(/\-/g, "");
  }

  dateFormat(date, format) {
    return Moment(Date.parse(date)).format(format || "YYYY-MM-DD");
  }

  hover(selector, mouseover, mouseout) {
    $$(document).on("mouseover mouseout", selector, function (event) {
      if (event.type === "mouseover") {
        mouseover($$(this));
      } else if (event.type === "mouseout") {
        mouseout($$(this));
      }
    });
  }

  async downloadPost(url = "", body) {
    try {
      body.token = this.token();
      body.campus_uuid = this.campus_uuid();
      const res = await fetch(this.getProxyIdentify + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: this.formatParams(body),
      });
      const blob = await res.blob();
      // 获取后端headers里面的文件名
      const filename = decodeURI(
        res.headers.get("Content-Disposition").split("filename=")[1]
      );
      // download
      const a = document.createElement("a");
      a.download = filename;
      a.style.display = "none";
      a.href = window.URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      // toast error message
    }
  }

  CheckUpdate() {
    if (!UpdateChecking) {
      UpdateChecking = true;
      if (localStorage.update === "YES") {
        localStorage.removeItem("update");
        Notification.success({
          message: <span className="fc_suc">提醒</span>,
          description: "更新完成!",
        });
      }
      setTimeout(() => {
        fetch(`${this.getHomePage}/update.json?_=${this.timestamp}`)
          .then((response) => response.text())
          .then((res) => {
            if (!res) {
              return false;
            }
            let info = this.strToJSON(res)[0];
            let version = info.version;
            let sure = () => {
              localStorage.version = version;
              localStorage.update = "YES";
              this.loc.reload();
            };
            if (localStorage.version !== version) {
              Notification.open({
                message: version + info.title,
                description: (
                  <div>
                    <div>{info.describe}</div>
                    <Button
                      onClick={sure.bind(this)}
                      style={{
                        float: "right",
                        marginTop: "10px",
                        fontSize: "12px",
                      }}
                      size="small"
                      icon="check"
                      type="primary"
                    >
                      更 新
                    </Button>
                  </div>
                ),
                icon: <Icon type="cloud-sync" style={{ color: "#108ee9" }} />,
                duration: 10,
              });
            }
          });
        setTimeout(() => {
          UpdateChecking = false;
        }, 12000);
      }, 2000);
    }
  }

  audioBuf(url) {
    return new Promise((resolve) => {
      let request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";
      request.onload = () => {
        let context = new AudioContext();
        context.decodeAudioData(request.response, (buffer) => {
          resolve(buffer);
        });
      };
      request.send();
    });
  }

  //检测视频转码状态
  async videoTransStatus(url) {
    let res = await this.get("/video/exists", {
      media_path: url,
    });
    if (res.exists === "YES") {
      return true;
    } else {
      // this.warning("抱歉，当前视频还在转码中，请稍后重试！");
      return false;
    }
  }

  //u8转base64
  u8ArytoBase64(u8Ary) {
    let CHUNK_SIZE = 0x8000;
    let index = 0;
    let length = u8Ary.length;
    let result = "";
    let slice;
    while (index < length) {
      slice = u8Ary.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return "data:image/png;base64," + btoa(result);
  }

  //base64字符串转u8
  base64toU8Ary(base64) {
    let arr = base64.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8ary = new Uint8Array(n);
    while (n--) {
      u8ary[n] = bstr.charCodeAt(n);
    }
    return { array: u8ary, mime };
  }

  //base64生成blob
  base64TransBlob(base64) {
    let { array, mime } = this.base64toU8Ary(base64);
    return new Blob([array], {
      type: mime,
    });
  }

  //base64生成oss线上图片
  async base64TransOss(base64) {
    return new Promise((resolve) => {
      let { array, mime } = this.base64toU8Ary(base64);
      let file = new File([array], "image", { type: mime });
      let formData = new FormData();
      formData.append("filename", file);
      $$.ajax({
        type: "POST",
        url: this.getProxyIdentify + "/image/upload/oss?prefix=image/base64/",
        data: formData,
        processData: false,
        contentType: false,
        success: (rs) => {
          resolve(rs.data[0]);
        },
      });
    });
  }

  //
  RenderDva(obj) {
    let namespace = obj.models.namespace;
    let history = createBrowserHistory();
    let pathname = history.location.pathname;
    let app = dva({
      history
    });
    app.model(obj.models);
    let router = connect((mod) => ({
      [namespace]: mod[namespace],
    }))(obj.component);
    app.router(({ history }) => {
      return (
        <Router history={history}>
          <Route path={pathname} component={router} />
        </Router>
      );
    });
    let App = app.start();
    return <App />
  }

  //coursecate待剥离优化
  async coursecate() {
    if (!CoursecateList) {
      let get = await this.get("/course/category");
      let cate = get.category;
      CoursecateList = cate.level1.map((obj) => {
        let children = cate.level2[obj.cat1];
        obj.name = obj.name1;
        obj.value = obj.cat1;
        if (children) {
          obj.children = children.map((_obj) => {
            _obj.name = _obj.name2;
            _obj.value = _obj.cat2;
            return _obj;
          });
        }
        return obj;
      });
    }
    return {
      list: CoursecateList,
      fieldNames: {
        label: "name",
        value: "value",
      },
    };
  }

  //cityCode待剥离优化
  async cityCode(params = {}) {
    let cityCodeText = "";
    let code = params.code || "";
    const subCode = (code = "", start, end) => {
      return code.toString().substring(start, end);
    };
    const getData = () => {
      return new Promise((resolve, reject) => {
        fetch(this.getProxyIdentify + "/city/data.json")
          .then((response) => response.json())
          .then((res) => {
            CityCodeData = res;
            resolve();
          });
      });
    };
    if (CityCodeData.length === 0) {
      await getData();
    }

    let province = "";
    let city = "";
    if (code) {
      province = subCode(code, 0, 2) + "0000";
      city = subCode(code, 0, 4) + "00";
    }

    if (CityCodeList.length === 0) {
      let _array = [];
      let provinceJson = {};
      for (let i in CityCodeData) {
        let item = CityCodeData[i];
        if (
          item.code === province ||
          item.code === city ||
          item.code === code
        ) {
          cityCodeText += item.name;
        }
        if (item.code === code) {
          //break;
        }

        let e = CityCodeData;
        e[i].text = e[i].name;
        let _code = e[i].code;
        let sheng = subCode(_code, 0, 2);
        let shi = subCode(_code, 2, 4);
        let di = subCode(_code, 4, 6);
        if (subCode(_code, 2, 6) === "0000") {
          e[i].id = sheng;
          provinceJson["s" + sheng] = e[i];
        }
        if (di === "00" && shi !== "00") {
          e[i].id = shi;
          let _sObj = provinceJson["s" + sheng];
          if (_sObj && !_sObj["s" + sheng]) _sObj["s" + sheng] = {};
          if (_sObj) _sObj["s" + sheng]["d" + shi] = e[i];

          _sObj.children = [];
          for (let i in _sObj["s" + sheng]) {
            _sObj.children.push(_sObj["s" + sheng][i]);
          }
        }
        if (di !== "00" && shi !== "00") {
          e[i].id = _code;
          let _dObj = provinceJson["s" + sheng]["s" + sheng]["d" + shi];
          if (_dObj && !_dObj["d" + shi]) _dObj["d" + shi] = [];
          if (_dObj) _dObj["d" + shi].push(e[i]);

          _dObj.children = _dObj["d" + shi];
        }
      }

      for (let i in provinceJson) {
        _array.push(provinceJson[i]);
      }
      CityCodeList = _array;
    }

    return {
      cityCodeText,
      cityCode: province ? [province, city, code] : [],
      list: CityCodeList,
      fieldNames: {
        label: "name",
        value: "code",
      },
    };
  }
}

export const $ = New(comlibs);
export default comlibs;
