use std::convert::TryInto;
use stdweb::js;
use stdweb::web::Node;
use yew::prelude::*;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
macro_rules! println {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

pub enum Msg {}

pub struct Zmage {
    node: Node,
    props: Props,
}

#[derive(Clone, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub src: Vec<String>,
    #[prop_or_default]
    pub class: String,
    #[prop_or_default]
    pub img_class: String,
    #[prop_or_default]
    pub img_ref_class: String,
}

impl Component for Zmage {
    type Message = Msg;
    type Properties = Props;

    fn create(props: Self::Properties, _link: ComponentLink<Self>) -> Self {
        Self {
            node: stdweb::web::document()
                .create_element("span")
                .unwrap()
                .try_into()
                .unwrap(),
            props,
        }
    }

    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        false
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.props = props;
        true
    }

    fn view(&self) -> Html {
        let Props {
            src,
            class,
            img_class,
            img_ref_class,
            ..
        } = &self.props;

        js! {
            let {React, ReactDOM, Zmage} = Yew;
            let ele_box = React.createElement("div", {
                className: @{class},
            }, @{src}.map((img, index) => React.createElement("div", {
                key: img,
                className: @{img_class},
            }, React.createElement(Zmage, {
                    className: "wh_full br_3 " + @{img_ref_class},
                    controller: { zoom: false },
                    backdrop: "rgba(255,255,255,.9)",
                    alt: img,
                    src: img,
                    set: @{src}.map(src => ({
                        src: src,
                        alt: src,
                    })),
                    defaultPage: index,
                })
            )));
            ReactDOM.render(ele_box, @{self.node.clone()});
        }
        yew::virtual_dom::VNode::VRef(self.node.clone())
    }
}
