import React, { useState } from "react";
import Method from "../method";
import Modals from "../comlibs/modals";
import Img from "../comlibs/img";
import Btn from "../comlibs/btnloading";

export default class Poster extends React.PureComponent {
	constructor(props) {
        super(props);
        this.$ = new Method();
		this.mod = {};
		this.btnTitle = "";
	}
	open(obj, params) {
		let mainTitle = "";
		if(typeof obj === "object") {
			mainTitle = obj.title;
			this.btnTitle = obj.btnTitle;
		}else {
			mainTitle = obj;
		}

		this.mod.open(mainTitle || "宣传海报", params);
	}
	render() {
        let $ = this.$;
		let { children, width = 252, height = 433, backgroundColor,type } = this.props;

		const PosterCon = ({ data }) => {
			let [url, setUrl] = useState();
			data.params.token = $.token();
			return (
				<div>
					<div className="mb_20">
						{
							type==='href'?(
								<a href={url} download="海报">
									<Btn
										width={width}
										style={{height:32}}
										className="bg_blue"
										disabled={url ? false : true}
									>
										{ this.btnTitle || "下载海报" }
									</Btn>
								</a>
							):(
							<Btn
								width={width}
								style={{height:32}}
								className="bg_blue"
								disabled={url ? false : true}
								onClick={async btn => {
									btn.loading = true;
									console.log('url:',url)
									await $.download(url, {
										name: data.name,
										_type: "url"
									});
									btn.setloading(false, 5000);
								}}
							>
								{ this.btnTitle || "下载海报" }
							</Btn>
							)
						}
						
					</div>
					<Img
						width={width}
						height={height}
						backgroundColor={backgroundColor}
						cache={false}
						// src={$.getProxyIdentify + data.api}
						src={$.getProxyIdentify + data.api}
						params={data.params}
						onLoad={src => setUrl(src)}
					/>
					
				</div>
			);
		};

		return (
			<Modals ref={rs => (this.mod = rs)} width="348px">
				{params => (
					<div className="ta_c">
						{children}
						<PosterCon data={params} />
					</div>
				)}
			</Modals>
		);
	}
}
