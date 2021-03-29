use stdweb::traits::*;
use stdweb::unstable::TryInto;
use stdweb::web::html_element::CanvasElement;
use stdweb::web::{document, CanvasRenderingContext2d, ImageData};
use stdweb::{js, Value};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
macro_rules! println {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

pub struct Canvas {
    element: CanvasElement,
    context: CanvasRenderingContext2d,
    width: u32,
    height: u32,
}

impl Canvas {
    pub fn new(id: String) -> Self {
        let element: CanvasElement = document()
            .query_selector(&format!("#{}", id))
            .unwrap()
            .unwrap()
            .try_into()
            .unwrap();
        let context: CanvasRenderingContext2d = element.get_context().unwrap();
        let (width, height) = (
            element.offset_width() as u32,
            element.offset_height() as u32,
        );
        Self {
            element,
            context,
            width,
            height,
        }
    }

    pub fn new_image_data(&mut self) -> ImageData {
        self.context
            .create_image_data(self.height as f64, self.width as f64)
            .unwrap()
    }

    pub fn get_image_data(&mut self) -> ImageData {
        self.context
            .get_image_data(0.0, 0.0, self.width as f64, self.height as f64)
            .unwrap()
    }

    pub fn get_pixel(&mut self, image_data: &ImageData, index: Vec<u32>) -> Vec<Value> {
        (js! {
            let data = @{image_data}.data;
            return @{index}.map(v => data[v]);
        })
        .try_into()
        .unwrap()
    }

    pub fn set_pixel(&mut self, image_data: &ImageData, index: Vec<u32>, value: Vec<Value>) {
        js! {
            let data = @{image_data}.data;
            @{index}.map((v, i) => {data[v] = @{value}[i]});
        };
    }

    pub fn pixel_to_pixel(
        &mut self,
        origin: &ImageData,
        oi: Vec<u32>,
        target: &ImageData,
        ti: Vec<u32>,
    ) {
        let pixel = self.get_pixel(&origin, oi);
        self.set_pixel(&target, ti, pixel);
    }

    pub fn pixel_rotate(&mut self, clockwise: bool) {
        //原始数据
        let image_data = self.get_image_data();
        //镜像数据
        let mirror_data = self.new_image_data();
        //最终数据
        let final_data = self.new_image_data();

        //镜像处理
        let mut r_vec = vec![];
        let mut r1_vec = vec![];
        let (mut y, mut r, mut r1) = (0, 0, 0);
        while y < self.height {
            let mut x = 0;
            while x < self.width {
                r = (x + self.width * y) * 4;
                r1 = (y + self.height * x) * 4;
                r_vec.append(&mut vec![r, r + 1, r + 2, r + 3]);
                r1_vec.append(&mut vec![r1, r1 + 1, r1 + 2, r1 + 3]);
                x += 1;
            }
            y += 1;
        }
        self.pixel_to_pixel(&image_data, r_vec, &mirror_data, r1_vec);

        //旋转处理 clockwise：是否顺时针
        let mut r_vec = vec![];
        let mut r1_vec = vec![];
        let mut y = 0;
        while y < self.width {
            let mut x = 0;
            while x < self.height {
                r = (x + self.height * y) * 4;
                if clockwise {
                    r1 = (self.height - 1 - x + self.height * y) * 4;
                } else {
                    r1 = (x + self.height * (self.width - 1 - y)) * 4;
                }
                r_vec.append(&mut vec![r, r + 1, r + 2, r + 3]);
                r1_vec.append(&mut vec![r1, r1 + 1, r1 + 2, r1 + 3]);
                x += 1;
            }
            y += 1;
        }
        self.pixel_to_pixel(&mirror_data, r_vec, &final_data, r1_vec);

        self.element.set_width(self.height);
        self.element.set_height(self.width);
        self.context
            .clear_rect(0.0, 0.0, self.width as f64, self.height as f64);
        self.context.put_image_data(final_data, 0.0, 0.0).unwrap();
    }
}
