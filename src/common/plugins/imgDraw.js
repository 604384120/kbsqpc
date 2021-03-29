import Method from "../method";
import "./imgDraw.css";

let ImgDraw = function (obj, cb) {
	let This = this;
	let $ = new Method();
	let ImageRotate = new Function();

	(async () => {
		let { canvas_pixel_rotate } = await import("rs-yew");
		ImageRotate = canvas_pixel_rotate;
	})();

	function init(src) {
		This.lineWidth = 0;
		let penColor = "#ff0000";

		let _html =
			'<div id="_imgDraw_Box">' +
			'<div id="_imgDraw_Bg"></div>' +
			'<div id="_imgDraw_Con">' +
			'<div id="_imgDraw_canvas_box" class="box box-ver box-allc">' +
			'<canvas id="_imgDraw_canvas"></canvas>' +
			'<div id="_imgDraw_loading"><div class="cssload-spin-box-bg">请稍等...</div></div>' +
			"</div>" +
			'<div id="_imgDraw_Bar">' +
			'<div id="_imgDraw_Bar_cLine" class="_imgDraw_Bar_btn" style="font-size: 12px;">' +
			'<div id="_imgDraw_Bar_cLine_t">•</div>画笔大小' +
			"</div>" +
			'<div class="_imgDraw_Bar_btn" style="padding: 4px 10px;font-size: 12px;">' +
			'<input id="_imgDraw_Bar_sColor" type="color" value="' +
			penColor +
			'" />颜色' +
			"</div>" +
			'<div class="_imgDraw_Bar_btn" id="_imgDraw_canvasUndo"><img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/09ec6398-9690-11ea-8b90-00163e04cc20.png" />撤销</div>' +
			'<div class="_imgDraw_Bar_btn" id="_imgDraw_canvasRedo"><img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0737c20a-9690-11ea-8b90-00163e04cc20.png" /> 反撤销</div>' +
			'<div class="_imgDraw_Bar_btn" id="_imgDraw_canvasRotate"><img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/c8dcf216-968d-11ea-8b90-00163e04cc20.png" />旋转</div>' +
			'<div class="_imgDraw_Bar_halving"></div>' +
			'<div class="_imgDraw_Bar_btn" id="_imgDraw_clearb"><img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/aa0f4046-968d-11ea-8b90-00163e04cc20.png" />重新批改</div>' +
			'<div class="_imgDraw_Bar_btn" id="_imgDraw_close"><img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/42411692-968d-11ea-8b90-00163e04cc20.png" />关闭</div>' +
			'<div class="_imgDraw_Bar_btn" id="_imgDraw_saveAsLocalImage"><img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/8de80b1e-968d-11ea-8b90-00163e04cc20.png" />完成</div>' +
			"</div>" +
			"</div>" +
			"</div>";

		document.getElementById(obj.id).innerHTML = _html;
		document.getElementById("_imgDraw_Box").style.display = "block";

		let canvas = document.getElementById("_imgDraw_canvas");
		let cvs = canvas.getContext("2d");
		let drawing = false;
		let canvasHistory = [];
		let step = -1;
		let img = new Image();

		img.setAttribute("crossOrigin", "Anonymous");
		img.src = src;
		img.onload = function () {
			This.width = this.width;
			This.height = this.height;
			canvas.setAttribute("width", this.width + "px");
			canvas.setAttribute("height", this.height + "px");

			let longer = This.width > This.height ? This.width : This.height;
			document.getElementById("_imgDraw_canvas_box").style.width = longer + "px";
			document.getElementById("_imgDraw_canvas_box").style.height = longer + "px";
			document.getElementById("_imgDraw_Bar").style.top = longer + 50 + "px";
			cvs.drawImage(img, 0, 0);
		};

		document.getElementById("_imgDraw_clearb").onclick = function () {
			This.clearb();
		};
		document.getElementById("_imgDraw_canvasUndo").onclick = function () {
			This.canvasUndo();
		};
		document.getElementById("_imgDraw_canvasRedo").onclick = function () {
			This.canvasRedo();
		};
		document.getElementById("_imgDraw_canvasRotate").onclick = function () {
			document.getElementById("_imgDraw_loading").style.display = "block";
			setTimeout(() => {
				ImageRotate("_imgDraw_canvas", true);
				document.getElementById("_imgDraw_loading").style.display = "none";
			}, 10);
		};
		document.getElementById("_imgDraw_saveAsLocalImage").onclick = function () {
			This.saveAsLocalImage();
		};
		document.getElementById("_imgDraw_close").onclick = function () {
			This.close();
		};

		This.canvasUndo = function () {
			if (step >= 0) {
				step--;
				cvs.clearRect(0, 0, This.width, This.height);
				let canvasPic = new Image();
				if (canvasHistory[step]) {
					let { d, w, h } = canvasHistory[step];
					canvasPic.src = d;
					canvasPic.addEventListener("load", () => {
						canvas.width = w;
						canvas.height = h;
						cvs.drawImage(canvasPic, 0, 0);
					});
				}
			} else {
				$.warning("不能再继续撤销了~");
			}
			if (step < 0) {
				cvs.drawImage(img, 0, 0);
			}
		};

		This.canvasRedo = function () {
			if (step < canvasHistory.length - 1) {
				step++;
				let canvasPic = new Image();
				let { d, w, h } = canvasHistory[step];
				canvasPic.src = d;
				canvasPic.addEventListener("load", () => {
					canvas.width = w;
					canvas.height = h;
					cvs.clearRect(0, 0, This.width, This.height);
					cvs.drawImage(canvasPic, 0, 0);
				});
			} else {
				$.warning("已还原到最新的记录了~");
			}
		};

		This.checkpen = function (width) {
			cvs.lineWidth = width;
		};

		document.getElementById("_imgDraw_Bar_cLine").onclick = function () {
			if (This.lineWidth == 4) {
				cvs.lineWidth = 1;
				This.lineWidth = 1;
				document.getElementById("_imgDraw_Bar_cLine_t").innerHTML = "•";
			} else {
				cvs.lineWidth = 4;
				This.lineWidth = 4;
				document.getElementById("_imgDraw_Bar_cLine_t").innerHTML = "●";
			}
		};

		This.changecolor = function (pencolor) {
			cvs.strokeStyle = pencolor;
			penColor = pencolor;
		};

		document.getElementById("_imgDraw_Bar_sColor").onchange = function () {
			This.changecolor(this.value);
		};

		function checkeraser() {
			//橡皮擦
			document.getElementById("eraser").value = "正在使用...";
			cvs.lineWidth = 20;
			cvs.globalCompositeOperation = "destination-out";

			function getBoundingClientRect(x, y) {
				let box = canvas.getBoundingClientRect();
				return {
					x: x - box.left,
					y: y - box.top,
				};
			}
			canvas.onmousedown = function (e) {
				let first = getBoundingClientRect(e.clientX, e.clientY);
				cvs.save();
				cvs.beginPath();
				cvs.moveTo(first.x, first.y);
				drawing = true;
			};
			canvas.onmousemove = function (e) {
				if (drawing) {
					let move = getBoundingClientRect(e.clientX, e.clientY);
					cvs.save();
					cvs.lineTo(move.x, move.y);
					cvs.stroke();
					cvs.restore();
				}
			};
			canvas.onmouseup = function () {
				drawing = false;
			};
			canvas.onmouseleave = function () {
				drawing = false;
				canvas.onmouseup();
			};
		}

		This.clearb = function () {
			cvs.clearRect(0, 0, This.width, This.height);
			cvs.drawImage(img, 0, 0);
			step = -1;
			canvasHistory = [];
		};

		canvas.onmousedown = function (e) {
			step++;
			if (step < canvasHistory.length) {
				canvasHistory.length = step;
			}

			let height =
				(parseInt(document.getElementById("_imgDraw_canvas_box").style.height) - canvas.height) / 2;
			let left = document.body.scrollWidth / 2 - canvas.width / 2;
			let top = height + 50;
			let start_x = e.clientX - left;
			let start_y = e.clientY - top;

			cvs.beginPath();
			cvs.moveTo(start_x, start_y);

			cvs.lineCap = "round";
			cvs.lineJoin = "round";
			cvs.strokeStyle = penColor;
			cvs.lineWidth = This.lineWidth;
			canvas.onmousemove = function (e) {
				let move_x = e.clientX - left;
				let move_y = e.clientY - top;
				cvs.lineTo(move_x, move_y);
				cvs.stroke();
			};
			canvas.onmouseup = function (e) {
				cvs.closePath();
				canvas.onmousemove = null;
				canvas.onmouseup = null;
				canvasHistory.push({ d: canvas.toDataURL(), w: canvas.width, h: canvas.height });
			};
			canvas.onmouseleave = function () {
				cvs.closePath();
				canvas.onmousemove = null;
				canvas.onmouseup = null;
				canvasHistory.push({ d: canvas.toDataURL(), w: canvas.width, h: canvas.height });
			};
		};

		This.close = function () {
			document.getElementById("_imgDraw_Box").style.display = "none";
		};

		This.saveAsLocalImage = function () {
			let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			//window.location.href = image;
			cb && cb(image);
			This.close();
		};
	}

	let open = function (src) {
		init(src);
		document.getElementById("_imgDraw_Box").style.display = "block";
	};

	return {
		checkpen: This.checkpen,
		changecolor: This.changecolor,
		clearb: This.clearb,
		canvasUndo: This.canvasUndo,
		canvasRedo: This.canvasRedo,
		saveAsLocalImage: This.saveAsLocalImage,
		open: open,
	};
};

export default ImgDraw;
