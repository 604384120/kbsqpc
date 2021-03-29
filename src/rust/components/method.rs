use std::cell::RefCell;
use std::clone::Clone;
use std::fmt::Debug;
use stdweb::unstable::TryFrom;
use stdweb::web::Storage;
use stdweb::{js, Value};

use anyhow::Error;
use serde::de::DeserializeOwned;
use serde::Serialize as SerdeSerialize;
use serde_derive::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use yew::callback::Callback;
use yew::format::{Format, Json, Nothing, Text};
use yew::services::fetch::{FetchService, FetchTask, Request, Response};
use yew::utils::host;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
macro_rules! println {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

pub trait PostParam: SerdeSerialize + Debug {}
pub trait FetchData: SerdeSerialize + DeserializeOwned {}

#[derive(Deserialize, Debug)]
pub struct ResData<T> {
    pub status: String,
    pub data: T,
    //pub message: String,
}

// pub trait PostParam {
//     fn new(&self) -> &Self;
// }

// impl PostParam for CreateChatData {
//     fn new(&self) -> &Self {
//         self
//     }
// }

#[derive(Debug, Clone)]
pub struct Methods {
    proxy: String,
    apiParams: ParamsData,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ParamsData {
    token: String,
    campus_uuid: String,
}

impl Methods {
    pub fn new() -> Self {
        let mut proxy = "";
        let host = host().unwrap();
        let hostProxy = "test.com";

        let storage = {
            let storage = js! {
                return window["localStorage"];
            };
            Storage::try_from(js!( return @{storage.as_ref()}; ))
        };

        let storage2 = {
            let storage = js! {
                return window["localStorage"];
            };
            Storage::try_from(js!( return @{storage.as_ref()}; ))
        };
        //这个地方到底是怎么个鸡巴回事
        let token = storage.unwrap().get("token").unwrap();
        let campus_uuid = storage2.unwrap().get("campus_uuid").unwrap();

        if host == hostProxy {
            proxy = "/local";
        }

        Self {
            proxy: proxy.to_string(),
            //fetch_service: FetchService::new(),
            apiParams: ParamsData {
                token: token.to_string(),
                campus_uuid: campus_uuid.to_string(),
            },
        }
    }

    pub fn log(&mut self, text: &str) {
        log(&text);
    }

    pub fn warning(&mut self, text: &str) {
        js! {
            let { $ } = Yew;
            $.warning(@{text})
        }
    }

    pub fn loading(&mut self, this: &Value, status: bool) {
        if this == "null" {
            js! { Yew.Antd.Message.loading("请稍等...", 1) }
        } else {
            js! {
                let This = @{this};
                if (typeof This.loading !== "undefined") {
                    This.loading = @{status};
                }
            }
        }
    }

    pub fn set_loading(&mut self, this: &Value, status: bool, time: i32) {
        js! {
            let This = @{this};
            if (typeof This.setloading !== "undefined") {
                This.setloading(@{status}, @{time});
            }
        }
    }

    pub fn _get<OUT: 'static>(&mut self, api: &str, callback: Callback<Response<OUT>>) -> FetchTask
    where
        OUT: From<Text>,
    {
        let params = serde_urlencoded::to_string(&self.apiParams).unwrap();
        let url = api.to_string() + &"?".to_string() + &params;
        let request = Request::get(self.proxy.to_owned() + &url)
            .body(Nothing)
            .unwrap();

        //self.fetch_service.fetch(request, callback).unwrap()
        let cb = Callback::from(move |response: Response<OUT>| {
            callback.emit(response);
        });
        //self.fetch_service.fetch(request, cb).unwrap()
        FetchService::new().fetch(request, cb).unwrap()
    }

    pub fn get<SUC: 'static>(&mut self, api: &str, callback: Callback<SUC>) -> FetchTask
    where
        SUC: FetchData,
    {
        let params = serde_urlencoded::to_string(&self.apiParams).unwrap();
        let url = api.to_string() + &"?".to_string() + &params;
        let request = Request::get(self.proxy.to_owned() + &url)
            .body(Nothing)
            .unwrap();
        let this = RefCell::new(self.clone());
        let cb = Callback::from(
            move |response: Response<Json<Result<ResData<SUC>, Error>>>| {
                let (meta, Json(data)) = response.into_parts();
                if meta.status.is_success() {
                    let rs_data = data.unwrap();
                    if rs_data.status == "success" {
                        callback.emit(rs_data.data);
                    } else {
                        //self.warning(&rs_data.message);
                    }
                } else {
                    this.borrow_mut().warning("网络异常，请刷新页面重试哦~");
                }
            },
        );
        FetchService::new().fetch(request, cb).unwrap()
    }

    pub fn post<OUT: 'static, DATA>(
        &mut self,
        api: &str,
        param: DATA,
        callback: Callback<Response<OUT>>,
    ) -> FetchTask
    where
        OUT: From<Text>,
        DATA: PostParam,
    {
        let preset = serde_urlencoded::to_string(&self.apiParams).unwrap();
        let params: String = preset + &"&" + &serde_urlencoded::to_string(&param).unwrap();
        //println!("{:?}!", &params);
        //.map_err(anyhow::Error::from)
        let request = Request::post(self.proxy.to_owned() + &api)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(Ok(params.to_owned()))
            .unwrap();
        FetchService::new().fetch(request, callback).unwrap()
    }
}
