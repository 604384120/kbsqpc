import React, { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { Method, Checks, Form, Modals, Btn } from "../comlibs";

export default class Move extends React.PureComponent {
	constructor() {
		super();
		this.$ = new Method();
		this.btn = {};
		this.mod = {};
	}

	open(data) {
		this.mod.open("选择相册", data);
	}

	render() {
		let $ = this.$;
		let { uuid, success } = this.props;

		let Ablum = ({ set }) => {
			let [list, setList] = useState([]);
			let [check, setCheck] = useState(0);
			let status = 1;
			useEffect(() => {
				(async () => {
					let l = await $.get("/album/list", {
						limit: 999
					});
					setList(l.data);
				})();
			}, [status]);
			return (
				<Skeleton loading={list.length === 0} paragraph={{ rows: 5 }} active>
					<div
						className="oy_s CUSTOM_scroll"
						style={{
							maxHeight: "300px",
							padding: 0
						}}
					>
						{list.map((item, key) => (
							<div
								onClick={() => setCheck(item.uuid)}
								className="bs br_3 dis_ib pst_rel pointer"
								key={key}
								style={{
									width: 110,
									padding: 5,
									margin: 7
								}}
							>
								<Checks
									set={set}
									name="uuid"
									value={item.uuid}
									className="pst_abs t_10 r_10"
									checked={check === item.uuid}
								/>
								<div
									className="bg_spcc"
									style={{
										width: 100,
										height: 100,
										backgroundImage: `url(${item.cover})`
									}}
								/>
								<div className="ellipsis" style={{ width: 100 }}>
									{item.name}
								</div>
							</div>
						))}
					</div>
				</Skeleton>
			);
		};

		return (
			<Modals width={700} ref={rs => (this.mod = rs)}>
				{({ uuids, index, data }) => (
					<Form
						onSubmit={async (values, btn) => {
							if (uuid === values.uuid) {
								$.msg("移动成功!");
								this.mod.close();
								return;
							}
							btn.loading = true;
							await $.post(`/album/${uuid}/photo/move`, {
								new_album_uuid: values.uuid,
								photo_uuids: uuids || data.uuid
							});
							btn.loading = false;
							$.msg("移动成功!");
							this.mod.close();
							success(index);
						}}
					>
						{({ set, submit }) => (
							<div>
								<Ablum set={set} />
								<div className="ta_r mt_15">
									<Btn type="default" onClick={() => this.mod.close()}>
										取消
									</Btn>
									<Btn className="ml_10" onClick={submit}>
										移动
									</Btn>
								</div>
							</div>
						)}
					</Form>
				)}
			</Modals>
		);
	}
}
