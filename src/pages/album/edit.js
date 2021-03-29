import React from "react";
import { Method, Form, Modals, Inputs, Btn } from "../comlibs";

export default class Edit extends React.PureComponent {
	constructor() {
		super();
		this.$ = new Method();
		this.btn = {};
		this.modal = {};
	}

	open(title, data) {
		this.modal.open(title, data);
	}

	render() {
		let $ = this.$;
		let success = this.props.success;
		return (
			<Modals ref={rs => (this.modal = rs)}>
				{({ name, summary, uuid }) => (
					<Form
						labelCol={{ span: 5 }}
						wrapperCol={{ span: 19 }}
						onSubmit={async values => {
							this.btn.loading = true;
							if (name) {
								await $.post(`/album/save/${uuid}`, values);
								$.msg("修改成功!");
							} else {
								await $.post("/album/create", values);
								$.msg("创建成功!");
							}
							this.btn.loading = false;
							this.modal.status({
								show: false
							});
							success();
						}}
					>
						{({ form }) => (
							<div>
								<Inputs label="相册名称" form={form} name="name" value={name} required={true} />
								<Inputs
									label="相册描述"
									form={form}
									name="summary"
									value={summary}
									required={true}
									rows={3}
								/>
								<div className="ta_r mt_15">
									<Btn htmlType="submit" ref={res => (this.btn = res)} />
								</div>
							</div>
						)}
					</Form>
				)}
			</Modals>
		);
	}
}
