import React from "react";
import Uploadimgs from "../comlibs/uploadimgs";
import Btn from "../comlibs/btnloading";

/*
 * 封面上传组件
 */

export default class Cover extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			_default:
				"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/408453f6-1734-11ea-ac92-00163e04cc20.png",
			cover: props.url || ""
		};
	}

	render() {
		let { onSure, type, prefix = "image/cover/", width = 250, height = 150, describe,mark='封面' } = this.props;
		let { _default, cover } = this.state;
		let shape = "square";
		let uploadimgs = "";

		if (type === "avatar") {
			mark = "头像";
			shape = "circle";
			width = 120;
			height = 120;
		}

		return (
			<div>
				<div
					className={`bg_spcc dis_ib ${shape}`}
					style={{
						width,
						height,
						backgroundImage: `url(${cover || _default})`
					}}
				/>
				<div className="dis_ib va_t ml_15">
					<Btn icon="upload" onClick={() => uploadimgs.open()}>
						上传{mark}
					</Btn>
					<p className="mt_10">{describe || `建议尺寸${width}*${height}px， 图片小于2M。`}</p>
				</div>
				<Uploadimgs
					multiple={false}
					prefix={prefix}
					ref={e => (uploadimgs = e)}
					onSure={cover => {
						this.setState({ cover });
						onSure && onSure(cover);
					}}
				/>
			</div>
		);
	}
}
