#![recursion_limit = "1024"]
#![allow(clippy::large_enum_variant)]
#![allow(clippy::eval_order_dependence)]

use stdweb::traits::*;
use stdweb::web::document;
use wasm_bindgen::prelude::*;
use yew::prelude::*;

pub mod rust;
use rust::chat::Chat;
use rust::components::canvas::Canvas;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
macro_rules! println {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn chat(id: String) -> Result<(), JsValue> {
    yew::initialize();
    let element = document().query_selector(&id).unwrap().unwrap();
    App::<Chat>::new().mount(element);
    Ok(())
}

#[wasm_bindgen]
pub fn canvas_pixel_rotate(id: String, clockwise: bool) {
    Canvas::new(id).pixel_rotate(clockwise);
}
