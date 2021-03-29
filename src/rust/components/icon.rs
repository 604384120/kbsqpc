use std::convert::TryInto;
use stdweb::web::Node;
use stdweb::{js, Value};
use yew::prelude::*;
use yew::Callback;

pub enum Msg {
    OnClick(Value),
}

pub struct Icon {
    link: ComponentLink<Self>,
    node: Node,
    props: Props,
}

#[derive(Clone, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub class: String,
    //#[prop_or_default]
    //pub style: String,
    #[prop_or_default]
    pub r#type: String,
    #[prop_or_default]
    pub theme: String,
    #[prop_or_default]
    pub onclick: Callback<Value>,
}

impl Component for Icon {
    type Message = Msg;
    type Properties = Props;

    fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            link,
            node: stdweb::web::document()
                .create_element("span")
                .unwrap()
                .try_into()
                .unwrap(),
            props,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::OnClick(t) => {
                self.props.onclick.emit(t);
                false
            }
        }
    }

    fn view(&self) -> Html {
        let Props {
            class,
            //style,
            r#type,
            theme,
            ..
        } = &self.props;
        let on_click: Callback<Value> = self.link.callback(|t| Msg::OnClick(t));

        js! {
            let {React, ReactDOM, Antd} = Yew;
            let element = React.createElement(Antd.Icon, {
                className: @{class},
                //style: @{style},
                type: @{r#type},
                theme: @{theme},
                onClick: t => t && @{move |t| on_click.emit(t)}(t)
            });
            ReactDOM.render(element, @{self.node.clone()});
        }

        yew::virtual_dom::VNode::VRef(self.node.clone())
    }
}
