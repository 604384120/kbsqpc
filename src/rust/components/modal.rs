use std::convert::TryInto;
use stdweb::web::{Date, Node};
use stdweb::{js, Value};
use yew::html::Children;
use yew::prelude::*;
use yew::Callback;

pub enum Msg {
    Open,
    Close,
    OnClose,
    ReactEle(Value),
}

pub struct Modal {
    link: ComponentLink<Self>,
    node: Node,
    children: NodeRef,
    props: Props,
    react_ele: Value,
    id: String,
    open: bool,
}

#[derive(Clone, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub title: String,
    #[prop_or_default]
    pub width: i32,
    #[prop_or_default]
    pub hide_closable: bool,
    #[prop_or_default]
    pub hide_mask_closable: bool,
    #[prop_or_default]
    pub refs: Callback<ComponentLink<Modal>>,
    pub children: Children,
}

impl Modal {
    pub fn new() -> ComponentLink<Self> {
        ComponentLink::default()
    }
}

impl Component for Modal {
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
            children: NodeRef::default(),
            props,
            react_ele: "".into(),
            id: "Yew_modal_".to_string() + &Date::new().get_time().to_string(),
            open: false,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Open => {
                if self.open == false {
                    self.open = true;
                    let title = self.props.title.to_owned();
                    js! {
                        let children = @{self.children.get()};
                        @{&self.react_ele}.open(@{title}, "", () => {
                            children && document.getElementById(@{&self.id}).appendChild(children);
                        });
                    }
                }
                false
            }
            Msg::Close => {
                self.open = false;
                js! { @{&self.react_ele}.close() };
                false
            }
            Msg::OnClose => {
                self.open = false;
                false
            }
            Msg::ReactEle(e) => {
                self.react_ele = e;
                false
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
        let Props {
            width,
            hide_closable,
            hide_mask_closable,
            ..
        } = &self.props;
        let orig_ref: Callback<Value> = self.link.callback(|e| Msg::ReactEle(e));
        let on_close: Callback<()> = self.link.callback(|_| Msg::OnClose);

        js! {
            let {React, ReactDOM, Modals} = Yew;
            let element = React.createElement(Modals, {
                width: @{ width },
                closable: @{ hide_closable } === true? false: true,
                maskClosable: @{ hide_mask_closable } === true? false: true,
                afterClose: () => @{ move || on_close.emit(()) }(),
                ref: r => r && @{ move |e| orig_ref.emit(e) }(r),
            }, React.createElement("div", {id: @{ &self.id }}));
            ReactDOM.render(element, @{ self.node.clone() });
        }

        html! {
            <>
                <div style="display:none">
                    <div ref=self.children.clone()> {self.props.children.render()} </div>
                </div>
                {yew::virtual_dom::VNode::VRef(self.node.clone())}
            </>
        }
    }
}
