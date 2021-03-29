use std::convert::TryInto;
use stdweb::js;
use stdweb::web::Node;
use stdweb::Value;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use yew::callback::Callback;
use yew::html::Children;
use yew::prelude::*;

use crate::rust::components::icon::Icon;
use crate::rust::components::uploadimg::{Msg as UploadimgMsg, Uploadimg};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
macro_rules! println {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

pub enum Msg {
    Init,
    UploadimgLink(ComponentLink<Uploadimg>),
    UploadimgOnSure(Vec<String>),
    UploadimgDel(usize),
}

pub struct Photowall {
    link: ComponentLink<Self>,
    node: Node,
    props: Props,
    uploadimg_link: ComponentLink<Uploadimg>,
    uploadimg_list: Vec<String>,
}

#[derive(Clone, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub children: Children,
    #[prop_or_default]
    pub onchange: Callback<String>,
    #[prop_or_default]
    pub refs: Callback<ComponentLink<Photowall>>,
}

impl Photowall {
    pub fn new() -> ComponentLink<Self> {
        ComponentLink::default()
    }
}

impl Component for Photowall {
    type Message = Msg;
    type Properties = Props;

    fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            link,
            node: stdweb::web::document()
                .create_element("div")
                .unwrap()
                .try_into()
                .unwrap(),
            props,
            uploadimg_link: Uploadimg::new(),
            uploadimg_list: vec![],
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Init => {
                self.uploadimg_list = vec![];
                true
            }
            Msg::UploadimgLink(link) => {
                self.uploadimg_link = link;
                false
            }
            Msg::UploadimgOnSure(list) => {
                self.uploadimg_list = vec![self.uploadimg_list.clone(), list].concat();
                true
            }
            Msg::UploadimgDel(index) => {
                self.uploadimg_list.remove(index);
                true
            }
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.props = props;
        true
    }

    fn mounted(&mut self) -> ShouldRender {
        self.props.refs.emit(self.link.clone());
        false
    }

    fn view(&self) -> Html {
        let list = &self.uploadimg_list;
        // let mut change_data: String = "".to_string();
        // if list.len() > 0 {
        //     change_data = list.join(",");
        // }
        self.props.onchange.emit(list.join(","));
        html! {
            <>
                <Uploadimg
                    refs=&self.link.callback(|t| Msg::UploadimgLink(t))
                    onSure=&self.link.callback(|(list, listString)| Msg::UploadimgOnSure(list))
                />
                <div
                    style="width:80px;height:80px"
                    class="ant-upload ant-upload-select ant-upload-select-picture-card"
                    onclick=&self.uploadimg_link.callback(|_| UploadimgMsg::Open)
                >
                    <span tabindex="0" class="ant-upload" role="button">
                        <div>
                            <i aria-label="图标: plus" class="anticon anticon-plus">
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                                    <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
                                </svg>
                            </i>
                            <div class="ant-upload-text">{ "上传照片" }</div>
                        </div>
                    </span>
                </div>
                <div>
                    { for list.iter().enumerate().map(|(index, mut item)| self.img_list(item, index)) }
                </div>
            </>
        }
    }
}

impl Photowall {
    fn img_list(&self, src: &String, index: usize) -> Html {
        let style = format!("width:80px;height:80px;background-image:url({})", src);
        html! {
            <div class="dis_ib bg_spcc ta_r mr_5" style=style>
                <Icon
                    class="circle bg_white mr_5"
                    r#type="close-circle"
                    theme="filled"
                    onclick=&self.link.callback(move |_| Msg::UploadimgDel(index))
                />
            </div>
        }
    }
}
