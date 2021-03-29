#![recursion_limit = "1024"]

use std::convert::TryInto;
use stdweb::web::Node;
use stdweb::{js, Value};
use yew::html::Children;
use yew::prelude::*;
use yew::Callback;

type SureData = (Vec<String>, String);

pub enum Msg {
    Open,
    Close,
    ReactEle(Value),
    Sure(SureData),
}

pub struct Uploadimg {
    link: ComponentLink<Self>,
    node: Node,
    props: Props,
    react_ele: Value,
}

#[derive(Clone, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub refs: Callback<ComponentLink<Uploadimg>>,
    #[prop_or_default]
    pub onSure: Callback<SureData>,
    #[prop_or_default]
    pub children: Children,
}

impl Uploadimg {
    pub fn new() -> ComponentLink<Self> {
        ComponentLink::default()
    }
}

impl Component for Uploadimg {
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
            react_ele: "".into(),
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::ReactEle(e) => {
                self.react_ele = e;
                false
            }
            Msg::Sure(data) => {
                self.props.onSure.emit(data);
                false
            }
            Msg::Open => {
                js! { @{&self.react_ele}.open() };
                false
            }
            Msg::Close => {
                js! { @{&self.react_ele}.close() };
                false
            }
        }
    }

    fn mounted(&mut self) -> ShouldRender {
        self.props.refs.emit(self.link.clone());
        false
    }

    fn view(&self) -> Html {
        let orig_ref: Callback<Value> = self.link.callback(|e| Msg::ReactEle(e));
        let on_sure: Callback<SureData> = self.link.callback(|(v, s)| Msg::Sure((v, s)));
        js! {
            let {React, ReactDOM, Uploadimg} = Yew;
            let element = React.createElement(Uploadimg, {
                ref: r => r && @{move |e| orig_ref.emit(e)}(r),
                onSure: (s, v) => s && @{move |s, v| on_sure.emit((v, s))}(s, v)
            });
            ReactDOM.render(element, @{self.node.clone()});
        }
        yew::virtual_dom::VNode::VRef(self.node.clone())
    }
}
