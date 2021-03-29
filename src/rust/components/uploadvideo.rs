#![recursion_limit = "1024"]

use std::collections::HashMap;
use std::convert::TryInto;
use stdweb::web::Node;
use stdweb::{js, Object, Value};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use yew::html::Children;
use yew::prelude::*;
use yew::Callback;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
macro_rules! console {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

pub enum Msg {
    Hidden,
    ReactEle(Value),
    Sure(Vec<Object>),
}

pub struct Uploadvideo {
    link: ComponentLink<Self>,
    node: Node,
    props: Props,
    reactEle: Value,
    show: bool,
}

#[derive(Clone, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub show: bool,
    #[prop_or_default]
    pub children: Children,
}

impl Component for Uploadvideo {
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
            reactEle: "".into(),
            show: false,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Hidden => {
                self.show = false;
                false
            }
            Msg::ReactEle(e) => {
                self.reactEle = e;
                false
            }
            Msg::Sure(v) => {
                let mut list = vec![];
                for item in v.iter() {
                    let object: HashMap<String, Value> = item.into();
                    list.push(object);
                }
                console!("{:?}!", &list);
                false
            }
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.show = props.show;
        if self.show {
            js! {
                @{&self.reactEle}.open();
            }
        }
        false
    }

    fn view(&self) -> Html {
        let orig_ref: Callback<Value> = self.link.callback(|e| Msg::ReactEle(e));
        let on_sure: Callback<Vec<Object>> = self.link.callback(|v| Msg::Sure(v));
        js! {
            let {React, ReactDOM, Uploadvideo} = Yew;
            let element = React.createElement(Uploadvideo, {
                ref: r => r && @{move |e| orig_ref.emit(e)}(r),
                onSure: v => v && @{move |v| on_sure.emit(v)}(v),
            });
            ReactDOM.render(element, @{self.node.clone()});
        }
        yew::virtual_dom::VNode::VRef(self.node.clone())
    }
}
