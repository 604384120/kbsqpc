use anyhow::Error;
use serde_derive::{Deserialize, Serialize};
use std::time::Duration;
use stdweb::{js, Value};
use yew::format::{Json, Nothing};
use yew::prelude::*;
use yew::services::fetch::{FetchService, FetchTask, Request, Response};
use yew::services::interval::IntervalService;
use yew::services::Task;

use crate::rust::components::button::Button;
use crate::rust::components::method::*;
use crate::rust::components::modal::{Modal, Msg as ModalMsg};
use crate::rust::components::photowall::{Msg as PhotowallMsg, Photowall};
use crate::rust::components::zmage::Zmage;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
macro_rules! println {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Deserialize, Serialize, Debug)]
pub struct ListData {
    pub time_update: String,
    pub content: String,
    pub uuid: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct DetailList {
    pub content: String,
    pub images: Vec<String>,
    pub user_type: String,
    pub time_create: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct DetailData {
    pub campus_name: String,
    pub content: String,
    pub time_update: String,
    pub images: Vec<String>,
    pub items: Vec<DetailList>,
}

type List = Vec<ListData>;

pub enum Msg {
    Ignore(&'static str),
    Getlist(&'static str),
    FetchListReady(List),
    FetchDetail(String, &'static str),
    FetchDetailReady(DetailData, &'static str),
    IssueLink(ComponentLink<Modal>),
    IssueLinkStart(ComponentLink<Modal>),
    Photowall(ComponentLink<Photowall>),
    ChatSubmit(Value, &'static str),
    GotInput(String, &'static str),
    ImgList(String, &'static str),
}

pub enum Status {
    Not,
    Ok,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateChatData {
    content: String,
    images: String,
}

pub struct Chat {
    met: Methods,
    link: ComponentLink<Self>,
    status: Status,
    fetch_task: Option<FetchTask>,
    intv_task: Box<dyn Task>,
    issue_link: ComponentLink<Modal>,
    issue_link_start: ComponentLink<Modal>,
    photowall_link: ComponentLink<Photowall>,
    chat_list: List,
    chat_detail: DetailData,
    chat_submit_btn: Value,
    chat_text_new: String,
    chat_text_submit: String,
    img_list_new: String,
    img_list_submit: String,
    detail_uuid: String,
}

impl PostParam for CreateChatData {}
impl FetchData for List {}
impl FetchData for DetailData {}

impl Component for Chat {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        let duration = Duration::from_secs(8);
        let callback = link.callback(|_| Msg::FetchDetail("".into(), "polling"));
        let task = IntervalService::new().spawn(duration, callback);
        Self {
            met: Methods::new(),
            link,
            status: Status::Not,
            fetch_task: None,
            intv_task: Box::new(task),
            issue_link: Modal::new(),
            issue_link_start: Modal::new(),
            photowall_link: Photowall::new(),
            chat_list: vec![],
            chat_detail: DetailData {
                campus_name: "".into(),
                content: "".into(),
                time_update: "".into(),
                images: vec![],
                items: vec![],
            },
            chat_submit_btn: "".into(),
            chat_text_new: "".into(),
            chat_text_submit: "".into(),
            img_list_new: "".into(),
            img_list_submit: "".into(),
            detail_uuid: "".into(),
        }
    }

    fn update(&mut self, msg: Msg) -> ShouldRender {
        match msg {
            Msg::Ignore(_msg) => {
                let mut message = _msg;
                if message == "" {
                    message = "网络异常，请刷新页面重试哦~";
                }
                self.met.warning(message);
                false
            }
            Msg::Getlist(status) => {
                if status == "reload" {
                    self.chat_text_new = "".into();
                    self.img_list_new = "".into();
                    self.met.loading(&self.chat_submit_btn, false);
                    //textarea value reset bug....
                    js! { Yew.Jq(".chat_textarea_content").val("")};
                    self.photowall_link.send_message(PhotowallMsg::Init);
                    self.issue_link.send_message(ModalMsg::Close);
                    self.issue_link_start.send_message(ModalMsg::Close);
                }
                let callback = self.link.callback(|data: List| Msg::FetchListReady(data));
                let task = self.met.get("/feedback/list", callback);
                self.fetch_task = Some(task);
                false
            }
            Msg::FetchListReady(list) => {
                self.chat_list = list;
                self.status = Status::Ok;
                self.link.send_message(Msg::FetchDetail("".to_string(), ""));
                true
            }
            Msg::FetchDetailReady(detail, status) => {
                self.chat_detail = detail;
                if status != "polling" {
                    js! {
                        setTimeout(() => {
                            let $ = Yew.Jq;
                            $(".chat_detail_list").scrollTop($(".chat_detail_list")[0].scrollHeight + 500);
                        }, 500)
                    }
                }
                if status == "submit" {
                    self.chat_text_submit = "".into();
                    self.img_list_submit = "".into();
                    js! { Yew.Jq(".chat_textarea_content").val("")};
                    self.photowall_link.send_message(PhotowallMsg::Init);
                }
                true
            }
            Msg::FetchDetail(uuid, status) => {
                if status == "click" {
                    self.met.loading(&"null".into(), true);
                }
                if uuid == "" && self.detail_uuid == "" {
                    if self.chat_list.len() > 0 {
                        self.detail_uuid = self.chat_list[0].uuid.to_owned();
                    } else {
                        self.issue_link_start.send_message(ModalMsg::Open);
                    }
                }
                if uuid != "" {
                    self.detail_uuid = uuid.to_string();
                }
                self.met.loading(&self.chat_submit_btn, false);
                if self.detail_uuid != "" {
                    let callback = self
                        .link
                        .callback(move |data: DetailData| Msg::FetchDetailReady(data, status));
                    let task = self
                        .met
                        .get(&format!("/feedback/detail/{}", self.detail_uuid), callback);
                    self.fetch_task = Some(task);
                }
                false
            }
            Msg::Photowall(link) => {
                self.photowall_link = link;
                false
            }
            Msg::IssueLink(link) => {
                self.issue_link = link;
                false
            }
            Msg::IssueLinkStart(link) => {
                self.issue_link_start = link;
                false
            }
            Msg::ChatSubmit(t, status) => {
                self.chat_submit_btn = t.clone();
                self.met.loading(&t, true);

                let mut chat_text = self.chat_text_submit.to_owned();
                let mut img_list = self.img_list_submit.to_owned();
                let mut api: &str = &format!("/feedback/reply/{}", self.detail_uuid);
                if status == "new" {
                    api = "/feedback/create";
                    chat_text = self.chat_text_new.to_owned();
                    img_list = self.img_list_new.to_owned();
                }

                if chat_text == "" {
                    self.met.warning("请填好问题内容后再操作哦~");
                    self.met.loading(&t, false);
                } else {
                    let callback = self.link.callback(
                        move |response: Response<Json<Result<ResData<List>, Error>>>| {
                            let (meta, Json(data)) = response.into_parts();
                            if meta.status.is_success() {
                                if status == "new" {
                                    Msg::Getlist("reload")
                                } else {
                                    Msg::FetchDetail("".to_string(), status)
                                }
                            } else {
                                Msg::Ignore("")
                            }
                        },
                    );
                    let task = self.met.post(
                        api,
                        CreateChatData {
                            content: chat_text,
                            images: img_list,
                        },
                        callback,
                    );
                    self.fetch_task = Some(task);
                }
                false
            }
            Msg::GotInput(value, status) => {
                if status == "new" {
                    self.chat_text_new = value;
                } else {
                    self.chat_text_submit = value;
                }
                false
            }
            Msg::ImgList(list, status) => {
                if status == "new" {
                    self.img_list_new = list;
                } else {
                    self.img_list_submit = list;
                }
                false
            }
        }
    }

    fn view(&self) -> Html {
        html! {
            <>
                <Modal
                    refs=&self.link.callback(|t| Msg::IssueLink(t))
                    title="新的问题"
                    width=620
                >
                    { self.modal_new() }
                </Modal>
                <Modal
                    refs=&self.link.callback(|t| Msg::IssueLinkStart(t))
                    title="新的问题"
                    width=620
                    hide_closable=true
                    hide_mask_closable=true
                >
                    { self.modal_new() }
                </Modal>
                <div class="box bs chat-box">
                    { self.record_box() }
                </div>
            </>
        }
    }
}

impl Chat {
    fn modal_new(&self) -> Html {
        html! {
            <>
                { self.entering("new") }
                <div class="bt_1 ta_r mt_10">
                    <Button
                        class="mt_10"
                        title="确 定"
                        onclick=&self.link.callback(|t| Msg::ChatSubmit(t, "new"))
                    />
                </div>
            </>
        }
    }

    fn record_box(&self) -> Html {
        match &self.status {
            Status::Not => {
                self.link.send_message(Msg::Getlist("init"));
                html! {
                    <div class="box-1 mt_30 ta_c">
                        {"数据加载中，请稍等..."}
                    </div>
                }
            }
            Status::Ok => {
                let detail = &self.chat_detail;
                html! {
                    <>
                        <div class="box box-ver bg_white chat-box-list">
                            <div class="bb_1 ta_c pv_15">
                                <Button
                                    title="发起新的问题"
                                    icon="plus"
                                    onclick=&self.issue_link.callback(|_| ModalMsg::Open)
                                />
                            </div>
                            <div style="height:100%" class="box box-ver oy_a CUSTOM_scroll pr_0 mb_15">
                                { for self.chat_list.iter().map(|i| self.record_list(i)) }
                            </div>
                        </div>
                        <div class="box box-1 box-ver">
                            <div class="chat_detail_list oy_a CUSTOM_scroll">
                                { self.first_content(detail) }
                                { for detail.items.iter().map(|i| self.detail_list(i)) }
                            </div>
                            <div class="dis_t w_full chat_detail_enter">
                                { self.entering("submit") }
                                <Button
                                    class="mt_15"
                                    title="提 交"
                                    onclick=&self.link.callback(|t| Msg::ChatSubmit(t, "submit"))
                                />
                            </div>
                        </div>
                    </>
                }
            }
        }
    }

    fn record_list(&self, item: &ListData) -> Html {
        let uuid = item.uuid.to_string();
        let mut cls: String = "box box-ver pv_15 bb_1 pointer".to_owned();
        if uuid == self.detail_uuid {
            cls = format!("list-item-checked {}", &cls);
        }
        html! {
            <div
                class=cls
                onclick=&self.link.callback(move |t| Msg::FetchDetail(uuid.clone(), "click"))
            >
                <div class="fc_gray">{ &item.time_update }</div>
                <div class="ellipsis fc_black mt_10">{ &item.content }</div>
            </div>
        }
    }

    fn first_content(&self, detail: &DetailData) -> Html {
        if detail.content == "" {
            html! { "" }
        } else {
            html! {
                <div class="ta_r chat_detail_list_r">
                    <div class="fs_12 chat_detail_list_title">
                        <span class="mr_10">{&detail.time_update}</span>
                        {&detail.campus_name}
                    </div>
                    <div class="br_6 fs_15 ta_l chat_detail_list_con">
                        <div class="chat_detail_list_text">{ &detail.content }</div>
                        <Zmage class="chat_detail_list_img" src=&detail.images />
                    </div>
                </div>
            }
        }
    }

    fn detail_list(&self, item: &DetailList) -> Html {
        if item.user_type == "user" {
            html! {
                <div class="ta_r chat_detail_list_r">
                    <div class="fs_12 chat_detail_list_title">
                        <span class="mr_10">{ &item.time_create }</span>
                        { &self.chat_detail.campus_name }
                    </div>
                    <div class="br_6 fs_15 ta_l chat_detail_list_con">
                        <div class="chat_detail_list_text">{ &item.content }</div>
                        <Zmage class="chat_detail_list_img" src=&item.images />
                    </div>
                </div>
            }
        } else {
            html! {
                <div class="ta_l chat_detail_list_l">
                    <div class="fs_12 chat_detail_list_title">
                        <span class="mr_10">{ "客服回复" }</span>
                        { &item.time_create }
                    </div>
                    <div class="br_6 fs_15 b_1 chat_detail_list_con">
                        <div class="chat_detail_list_text">{ &item.content }</div>
                    </div>
                </div>
            }
        }
    }

    fn entering(&self, status: &'static str) -> Html {
        let mut value = &self.chat_text_new;
        if status == "submit" {
            value = &self.chat_text_submit;
        }
        html! {
            <div class="dis_t w_full">
                <textarea
                    class="chat_textarea_content ant-input"
                    rows=3
                    value=value
                    oninput=&self.link.callback(move |e: InputData| Msg::GotInput(e.value, status))
                    placeholder="请输入"
                />
                <div class="mt_15">
                    <Photowall
                        refs=&self.link.callback(|t| Msg::Photowall(t))
                        onchange=&self.link.callback(move |list| Msg::ImgList(list, status))
                    />
                </div>
            </div>
        }
    }
}
