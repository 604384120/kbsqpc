import React, { useState, useReducer } from "react";
import { Form, $, Uploadfile, Uploadaudio, Uploadvideo, Inputs, Btn } from "../comlibs";
import {
	Grades,
	Course,
	Cover,
	Page_ChoiceStudent,
	Page_ChoiceCourse,
	Page_ChoiceTeacher,
	SearchStudent,
} from "../works";

import countReducer from "./test_exp";

export default function (props) {
	//let $ = new Method();
	let [classStudent, setClassStudent] = useState([]);
	let [course, setCourse] = useState([]);

	let { Ref_1, Ref_2 } = $.useRef(2);
	let { video, audio, upload, choiceCourse, choiceStudent, choiceTeacher } = $.useRef([
		"video",
		"audio",
		"upload",
		"choiceCourse",
		"choiceStudent",
		"choiceTeacher",
	]);

	// let GlobalData = $.store().GlobalData;
	// console.log(GlobalData.user);
	// console.log(GlobalData.user_power);

	(async () => {
		// let url = await $.base64TransOss(
		// 	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfgCgMJFhn1tyD1AAABUklEQVQ4y5WTv0sCYRzGn+sPEBsECeWoKQhsuJuiIWgS+x+azClobG+LNptFcC1qSyeRloZrOYcEN38RuogO1fRpyMO7407tmd73+T4fvt/3fXkN+YSlI1mylZUrR46axkhxYpsaYc0pxcXzDIEpZc45IMExVzwD0CATFQeoh0vkGQA9EuFhhsB1ZOckLaASNGtAPfZsJjOg4LsZYBox5zJRBLrL7SVQ1koxBlJ/6y1ZkpzVgN4lWR5gbwA4kmwPyErqrwH6kkwPcCXl1gA5SR0P8LWLlS2p7QdOVt5RUoeSXG+7wxzIrwCqwKPfKAEDkjHxM+CHvaDZAFqYkfEJcBe2M/SAGcXg7FQX/8L13nlZTFABYMwLN1xwzxtfwDe3fEQiEgW6oR/3wK5E2o8YISglS7ZMddSWa3wu3LSa2ldbp8ZEmynY5T/Iq7ExIdJ60ugXI5QM06Tg8WEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMTAtMDNUMDk6MjI6MjUrMDI6MDAlPwm+AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTEwLTAzVDA5OjIyOjI1KzAyOjAwVGKxAgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
		// );
		//console.log(url);
		//await $.get("/222", {});
	})();

	let { count, dispatch } = {};
	const CountExp = () => {
		[count, dispatch] = useReducer(countReducer, 0);
		return (
			<div>
				<span>{count}</span>
				<button onClick={() => dispatch('add')}>+1</button>
				<button onClick={() => dispatch('del')}>-1</button>
			</div>
		)
	}

	let textReducer = (text, action) => {
		if (action === "change") {
			return "233333";
		}
	}

	const CountExp2 = () => {
		const [text, dispatch1] = useReducer(textReducer, "123");
		const [count1, dispatch2] = useReducer(countReducer, 0);
		return (
			<div>
				<div onClick={() => dispatch1("change")}>CountExp2: {text} --- {count1}</div>
				<button onClick={() => dispatch2('add')}> CountExp-del</button>
				<button onClick={() => dispatch2('del')}> CountExp-del</button>
			</div>
		)
	}

	return (
		<div>
			<CountExp />
			<CountExp2 />
			<Form
				ref={Ref_1}
				action="/test/api"
				valueReturn={(val) => {
					console.log(val);
					return val;
				}}
			>
				{({ form }) => (
					<div>
						<Inputs
							name="lesson_statuss"
							form={form}
							value="unfinished"
							radios={[
								{
									value: "unfinished",
									text: "待上课节",
								},
								{
									value: "finished",
									text: "已完课节",
								},
							]}
							onChange={(res) => {
								console.log(res);
							}}
						/>
						<Inputs name="test_time" form={form} type="timePicker" />
						<Inputs name="test1" form={form} type="dateTimePicker" />
						<Inputs name="test2" form={form} type="datePicker" />
						<Inputs
							name="test3"
							form={form}
							type="rangeTimePicker"
							onSure={(res) => {
								console.log(res);
							}}
						/>
						<Inputs
							name="test"
							form={form}
							type="rangePicker"
							onChange={(res) => {
								console.log(res);
								console.log($.timeSpace(res[0], res[1]));
							}}
						/>
						<Inputs form={form} name="test8" value="技术的恢复金卡时候" />
						<Inputs form={form} name="test9" value="技术的恢复金卡时候" maxLength={10} rows={3} />
						<Cover type="avatar" />
						<Course form={form} />
						<Grades type="compulsory" form={form} />
						<Grades form={form} />
						<Btn ref={Ref_2} htmlType="submit" iconfont="sousuo">
							搜索
						</Btn>
					</div>
				)}
			</Form>
			<SearchStudent
				onSelect={(uuid) => {
					window.open("/pc#/student_detail?uuid=" + uuid, "_blank");
				}}
			/>
			<Btn
				onClick={(btn) => {
					btn.loading = true;
					console.log($(Ref_1));
					$(Ref_2).loading = true;
					$(Ref_2).setloading(false, 3000);
					btn.setloading(false, 2000);
				}}
			/>
			<a onClick={() => $(upload).open()}>上传测试[/teacher/import/fields]</a>
			<Uploadfile
				//action="/achievement/import/fields"
				action="/teacher/import/fields"
				params={{
					aa: 1,
				}}
				multiple={false}
				ref={upload}
				onSure={(rs) => console.log(rs)}
			/>
			<Uploadvideo
				ref={video}
				multiple={true}
				onSure={async (rs) => {
					console.log(rs);
					let isOk = await $.videoTransStatus(rs[0].url);
					console.log(isOk);
				}}
			/>
			<Btn onClick={(e) => $(video).open()}>视频上传</Btn>
			<Uploadaudio
				ref={audio}
				multiple={true}
				onSure={(ary) => {
					console.log(ary);
				}}
			/>
			<Btn onClick={(e) => $(audio).open()}>音频上传</Btn>
			<a
				onClick={() =>
					$(choiceStudent).open({
						value: classStudent,
						group_uuid: "2a8201b0-6df2-11e7-b6b9-001696e50eef",
						onSure: (d) => {
							setClassStudent(d);
							console.log(d);
						},
					})
				}
			>
				选择学员
			</a>
			<Page_ChoiceStudent type="reples" ref={choiceStudent} />

			<a
				onClick={() =>
					$(choiceCourse).open({
						value: course,
						max: 1,
						onSure: (d) => {
							setCourse(d);
							console.log(d);
							//console.log($.valStrByKey(d, "name"));
						},
					})
				}
			>
				选择课程
			</a>
			<Page_ChoiceCourse ref={choiceCourse} />

			<a
				onClick={() =>
					$(choiceTeacher).open({
						value: [],
						onSure: (d) => {
							//setCourse(d);
							console.log(d);
						},
					})
				}
			>
				选择老师
			</a>
			<Page_ChoiceTeacher ref={choiceTeacher} />
			<div>
				<Btn
					onClick={async () => {
						let base64 = await $.get("/teacher/qrcode", {
							teacher_uuid: "f025f02e-9e91-11e7-b652-001696e50eef",
						});
						$.download(base64.img, {
							name: "老师二维码",
							_type: "base64",
						});
					}}
				>
					下载
				</Btn>
			</div>

			{/* <div>
				<wasm-user>
					<span slot="person-name">
						1112233
						<div onClick={() => console.log(888)} style={{ color: "red" }}>
							借口还是健康法
						</div>
					</span>
				</wasm-user>
				<Wasm template="user" />
			</div> */}
		</div>
	);
}
