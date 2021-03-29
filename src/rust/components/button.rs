use std::convert::TryInto;
use stdweb::web::Node;
use stdweb::{js, Value};
use yew::prelude::*;
use yew::Callback;

pub enum Msg {
    ReactEle(Value),
    OnClick(Value),
}

pub struct Button {
    link: ComponentLink<Self>,
    node: Node,
    props: Props,
    reactEle: Value,
}

#[derive(Clone, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub width: String,
    #[prop_or_default]
    pub title: String,
    #[prop_or_default]
    pub icon: String,
    #[prop_or_default]
    pub class: String,
    pub onclick: Callback<Value>,
}

impl Component for Button {
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
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::ReactEle(e) => {
                self.reactEle = e;
                false
            }
            Msg::OnClick(t) => {
                self.props.onclick.emit(t);
                false
            }
        }
    }

    fn view(&self) -> Html {
        let orig_ref: Callback<Value> = self.link.callback(|e| Msg::ReactEle(e));
        let on_click: Callback<Value> = self.link.callback(|t| Msg::OnClick(t));
        let class = self.props.class.to_owned();
        let title = self.props.title.to_owned();
        let icon = self.props.icon.to_owned();
        js! {
            let {React, ReactDOM, Button} = Yew;
            let element = React.createElement(Button, {
                ref: r => r && @{move |e| orig_ref.emit(e)}(r),
                className: @{class},
                icon: @{icon},
                onClick: t => t && @{move |t| on_click.emit(t)}(t)
            }, @{title});
            ReactDOM.render(element, @{self.node.clone()});
        }

        yew::virtual_dom::VNode::VRef(self.node.clone())
    }
}
