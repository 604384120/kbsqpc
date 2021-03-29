import React, { useState, useEffect } from "react";
import { Icon, Divider, Empty, Carousel } from "antd";
import { Method, Video, Form, Inputs, TablePagination, Page, Img } from "../comlibs";
import Lessondetail from "../class/lessondetail";
import { lessonEnd } from "../class/classBtn";
import G2 from "@antv/g2";
export default function () {
	let $ = new Method();
	let kind = $.store().GlobalData.user_power
  const Iconfont = $.icon();
	let {
		GlobalData = $.store().GlobalData,
		quickStart = [
			{
				title: "1.创建老师",
				video_url: "https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/2addteacher.Ogg",
			},
			{
				title: "2.创建课程",
				video_url: "https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/3addcourse.Ogg",
			},
			{
				title: "3.导入学员",
				video_url: "https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/1importstudents.Ogg",
			},
			{
				title: "4.建班排课",
				video_url: "https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/4createclass.Ogg",
			},
			{
				title: "5.学员入班",
				video_url: "https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/5classandstudents.Ogg",
			},
			{
				title: "6.上课点名",
				video_url: "https://sxzvideo.oss-cn-shanghai.aliyuncs.com/guide/6signin.Ogg",
			},
		],
		showList = [
			{
				title: "学员端",
				url: "https://www.sxzapi.cn/page/74713dbd-2b6f-11e8-b7b9-00163e04cc20.html?menu=xcx",
				img:
					"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/2066ea06-2140-11e9-9a54-00163e04cc20.png",
				tips: "",
				content:
					"家长查收课时课表，课堂点评、作业、在线请假等，随时了解学员在校动态，服务贴心！家长满意！",
			},
			{
				title: "消息通知",
				url: "https://mp.weixin.qq.com/s/wu422EeaObP7G6Q2b0mxPw",
				img:
					"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/0827d274-2141-11e9-9a54-00163e04cc20.png",
				tips: "",
				content:
					"上课提醒，到离校通知，活动通知、续费提醒等各种消息精准发送。树立品牌形象，节省机构人力成本。",
			},
			{
				title: "入驻求学地图",
				url: "/pc#/campus_detail?tabChange=4&uuid=" + $.campus_uuid(),
				img:
					"https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/6ff39344-320b-11ea-ac9c-00163e04cc20.png",
				tips: "教培机构的专业引流推广平台。",
				content: "有效覆盖周边5公里内资源，让您影响力倍增，生源无忧！10000+家机构已入驻。 ",
			},
		],
		showquick,
		setQuick,
		tab,
		paramObj,
		setParam,
		lessondetail,
		status = 1,
		campus_uuid = $.campus_uuid(),
	} = {};
  let [quickLink, setQuicklink] = useState([])
  let [bannerList, setBannerList] = useState([])
	useEffect(() => {
		let list = [{
			title: "报名缴费",
			url: "/pc#/payment_index",
			background: "#9276B2",
			iconName: "icon-baomingfei",
			fontsize: 42,
		},
		{
			title: "添加学员",
			url: "/pc#/student_index",
			background: "#57B284",
			iconName: "icon-tianjiaxueyuan",
			fontsize: 38,
		},
		{
			title: "排班排课",
			url: "/adminPc/class",
			background: "#E69853",
			iconName: "icon-paibanpaike",
			fontsize: 30,
		},
		{
			title: "总课表",
			url: "/adminPc/kebiao",
			background: "#5FA9DC",
			iconName: "icon-kebiao",
			fontsize: 30,
		},
		{
			title: "宣传海报",
			url: "/pc#/poster_index",
			background: "#E3546D",
			iconName: "icon-haibao",
			fontsize: 30,
    }];
		if (GlobalData.user_power !== 'admin') {
      list.splice(0, 1)
			list.splice(2, 1)
			setQuicklink(list);
		} else {
			setQuicklink(list);
    };
    (async () => {
      let bannerData = await $.get("/banner/PCOVERVIEW");
      setBannerList(bannerData);
    })();
  }, [1]);
	let Quick = () => {
		[showquick, setQuick] = useState(localStorage.showquick === "false" ? false : true);
		return (
			<div>
				<div
					className={showquick ? "hide" : "pst_fix r_0 z_999 pointer"}
					style={{ top: "45%" }}
					onClick={() => {
						setQuick(true);
						localStorage.showquick = true;
					}}
				>
					<Img
						width={53}
						style={{
							backgroundColor: "none",
						}}
						src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/e698cd7c-344d-11ea-ac9d-00163e04cc20.png"
					/>
				</div>
				<div
					className={showquick ? "box box-1 box-ver pv_15 pl_32 pr_15 bg_white mb_24 br_2" : "hide"}
				>
					<div className="box mb_20">
						<div className="box box-1 fs_16 fw_600 fc_black">新手快速入门</div>
						<div
							onClick={() => {
								setQuick(false);
								localStorage.showquick = false;
							}}
							className="box pointer box-pe"
							style={{ width: 50 }}
						>
							<Icon type="close" />
						</div>
					</div>
					<div className="box mb_18">
						{quickStart.map((rs, index) => {
							return (
								<div className="box box-1" key={rs.title}>
									<div className="box box-ac" style={{ width: 150 }}>
										<Video {...rs} className="box box-1" />
									</div>
									<div className={index === 5 ? "hide" : "box box-allc box-1"}>
										<Iconfont type="icon-you" />
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	};
	let AttendanceClass = () => {
		let chart = {};
		let [lessonData, setlessonData] = useState({});
		useEffect(() => {
			(async () => {
				let r = await $.get("/campus/summary/daily");
				if (!r.students) {
					r.students = 0;
				}
				r.unin = r.students - r.arrived - r.leave - r.absent || 0;
				setlessonData(r);
			})();
		}, [status]);
		useEffect(() => {
			let r = lessonData;
			if (typeof r.students === "undefined") return;
			chart = new G2.Chart({
				container: "canvas",
				forceFit: true,
				height: 130,
				padding: 6,
			});
			const data = [
				{ name: "到课学员", value: r.arrived },
				{ name: "请假学员", value: r.leave },
				{ name: "缺课学员", value: r.absent },
				{
					name: "未处理",
					value: r.unin,
				},
			];
			if (r.students === 0) {
				data.push({ name: "其他", value: 10 });
			}
			const bgcolors = ["#92DD99", "#F0C45C", "#EA7D76", "#92CCF1", "#92CCF1"];
			chart.source(data);
			chart.coord("theta", {
				innerRadius: 0.85,
			});
			chart.intervalStack().position("value").color("name", bgcolors).shape("sliceShape");
			chart.tooltip(false);
			chart.legend(false);

			chart.guide().html({
				position: ["50%", "55%"],
				html: `<div style="color:#333;font-size: 14px;text-align: center;position: relative;width: 45px;">总人数<br><span style="color:#333;font-size:20px">${r.students}</span></div>`,
				alignX: "middle",
				alignY: "middle",
			});
			chart.render();
		}, [lessonData]);

		return (
			<div className="box mt_24">
				<div className="box box-1 box-ver mr_12 ph_24 pv_15 bg_white br_2" style={{ width: "50%" }}>
					<div className="box fs_16 fw_600 fc_black1">昨日学员出勤情况</div>
					<div className="box box-1">
						<div id="canvas" className="mt_24" style={{ width: 200, height: 160 }}></div>
						<div className="box box-pe box-1 mt_30">
							<div className="box box-ver">
								<div className="box box-ac" style={{ height: 18 }}>
									<div
										className="box"
										style={{ background: "#92DD99", width: 10, height: 10 }}
									></div>
								</div>
								<div className="box box-ac mt_15" style={{ height: 18 }}>
									<div
										className="box lh_18"
										style={{ background: "#F0C45C", width: 10, height: 10 }}
									></div>
								</div>
								<div className="box box-ac mt_15" style={{ height: 18 }}>
									<div
										className="box lh_18"
										style={{ background: "#EA7D76", width: 10, height: 10 }}
									></div>
								</div>
								<div className="box box-ac mt_15" style={{ height: 18 }}>
									<div
										className="box lh_18"
										style={{ background: "#92CCF1", width: 10, height: 10 }}
									></div>
								</div>
							</div>
							<div className="box box-ver mh_10">
								<div className="box fs_12 fc_black1 lh_18">到课学员</div>
								<div className="box fs_12 mt_15 fc_black1 lh_18">请假学员</div>
								<div className="box fs_12 mt_15 fc_black1 lh_18">缺课学员</div>
								<div className="ta_l fs_12 mt_15 fc_black1 lh_18" style={{ width: 48 }}>
									未处理
								</div>
							</div>
							<div className="box box-ver">
								<div className="box lh_18" style={{ color: "#92DD99" }}>
									{lessonData.arrived || 0}
								</div>
								<div className="box mt_15 lh_18" style={{ color: "#F0C45C" }}>
									{lessonData.leave || 0}
								</div>
								<div className="box mt_15 lh_18" style={{ color: "#EA7D76" }}>
									{lessonData.absent || 0}
								</div>
								<div className="box mt_15 lh_18" style={{ color: "#92CCF1" }}>
									{lessonData.unin || 0}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="box box-1 box-ver ml_12 ph_24 pv_15 bg_white br_2" style={{ width: "50%" }}>
					<div className="box fs_16 fw_600 fc_black1">昨日课务情况</div>
					<div className="box box-1 box-ver">
						<div className="box box-1 mt_15">
							<div className="box fs_14 fc_gray">开课班级数</div>
							<div className="box box-1 fc_blue box-pe">{lessonData.cnt_groups || 0}</div>
						</div>
						<div className="box box-1 mt_25">
							<div className="box fs_14 fc_gray">应消耗课时数</div>
							<div className="box box-1 fc_blue box-pe">
								{lessonData.cnt_should_courselessons || 0}
							</div>
						</div>
						<div className="box box-1 mt_25">
							<div className="box fs_14 fc_gray">实际消耗课时数</div>
							<div className="box box-1 fc_blue box-pe">
								{lessonData.cnt_actual_courselessons || 0}
							</div>
						</div>
						<div className="box box-1 mt_25 mb_15">
							<div className="box fs_14 fc_gray">有课老师</div>
							<div className="box box-1 fc_blue box-pe">{lessonData.cnt_teachers || 0}</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	let Upcoming = () => {
		let [data, setData] = useState({ leave: 0, birthday: 0 });
		useEffect(() => {
			(async () => {
				let l = await $.get("/campus/lessonstudent", {
					status: "leave",
					just_today: "YES",
				});
				let b = await $.get("/campusstudent/list", {
					birthday_month: "CURRENT",
					limit: 100,
				});
				setData({ leave: l.length, birthday: b.length });
			})();
		}, [campus_uuid]);
		return (
			<div className="box mt_24 bg_white box-ver">
				<div className="box ph_24 pv_15 fs_16 fw_600 fc_black1 bb_1">今日待办</div>
				<div className="box pv_15 mh_24 bb_1">
					<div className="box fs_14 fc_gray">今日请假学员</div>
					<div className="box box-1 fc_blue box-pe">{data.leave || 0}</div>
				</div>
				<div className="box mv_15 ph_24">
					<a className="box box-1" href="/pc#/student_index?tabChange=4">
						<div className="box fs_14 fc_gray hover">本月生日学员</div>
						<div className="box box-1 fc_blue box-pe">{data.birthday || 0}</div>
					</a>
				</div>
			</div>
		);
	};
	let Classschedule = () => {
		let [lesson, setLesson] = useState([]);
		useEffect(() => {
			(async () => {
				let r = await $.get("/lesson/bydate");
				setLesson(r.lessons || []);
				return r;
			})();
		}, [campus_uuid]);
		return (
			<div className="box mt_24 bg_white box-ver">
				<div className="box fs_16 ph_24 pv_15 fw_600 fc_black1 bb_1">今日课程安排</div>
				{lesson.length > 0 ? (
					lesson.map((rs, index) => {
						return (
							<div
								index={index}
								key={rs.uuid}
								className={index + 1 === lesson.length ? "box pv_15 mh_24" : "box pv_15 mh_24 bb_1"}
							>
								<div className="box fs_14 fc_gray">{rs.name}</div>
								<div className="box box-1 fc_gray box-pe">
									{rs.starttime} - {rs.endtime}
								</div>
							</div>
						);
					})
				) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					)}
			</div>
		);
	};
	let Lesson = () => {
		[paramObj, setParam] = useState({ limitations: "", lesson_status: "not_rocalled" });
		let columns = [
			{
				title: "上课日期",
				width: 140,
				align: "center",
				render: (rs) => (
					<span>
						{rs.lessontime.split(" ")[0]} {rs.week}
					</span>
				),
			},
			{
				title: "上课时间",
				align: "center",
				render: (rs) => (
					<span>
						{rs.time_start} - {rs.time_end}
					</span>
				),
			},
			{
				title: "班级名称",
				align: "center",
				render: (rs) => <span>{rs.name}</span>,
			},
			{
				title: "授课老师",
				align: "center",
				render: (rs) => (
					<span>
						{rs.teachers
							.map((v) => {
								return v.name;
							})
							.toString()}
					</span>
				),
			},
			{
				title: "操作",
				align: "center",
				render: (rs) => (
					<div>
						<a
							onClick={() => {
								lessondetail.open("课节详情", {
									lessonuuid: rs.uuid,
									groupuuid: rs.group_uuid,
								});
							}}
						>
							点名
						</a>
						<span className={!paramObj.lesson_status ? "" : "hide"}>
							<Divider type="vertical" />
							<a
								onClick={() => {
									lessonEnd(rs.uuid, () => {
										tab.reload();
									});
								}}
							>
								结课
							</a>
						</span>
					</div>
				),
			},
		];
		return (
			<TablePagination
				api="/teacher/staylesson"
				columns={columns}
				params={paramObj}
				ref={(ref) => (tab = ref)}
			/>
		);
	};
	let Releasenote = () => {
		let [info, setInfo] = useState({});
		useEffect(() => {
			(async () => {
				let r = await $.get("/releasenote/random");
				setInfo(r);
				return r;
			})();
		}, [status]);
		return (
			<a href={info.article_url} target="_blank" className="box box-ver bg_white br_2">
				<Img className="box box-1" src={info.image_url} height={140} width="100%" />
				<div className={info.title ? "" : "hide"}>
					<div className="ph_16 fs_16 fc_black ellipsis mb_4">{info.title}</div>
					<div className="ph_16 fs_14 fc_gray lh_22 pb_10">{info.comment}</div>
				</div>
			</a>
		);
  };

  let BannerList = () => {
    let [src, setSrc] = useState(bannerList[0]?.url);
    if (bannerList.length > 0) {
      return <a target="_blank" href={src}><Carousel dots={true} beforeChange={(from, to) => {
        setSrc(bannerList[to].url);
      }}>
      {bannerList.map((rs, index) => {
        return (
          <div key={index} className="slick-slide"
          onClick={(e) => {
            //e.StopPropagation
            console.log('sdfsdfdsdfs')
            window.open(`${rs.url}?campus_uuid=${$.campus_uuid()}&token=${$.token()}`)
          }}>
            <Img
              src={rs.imgurl}
              style={{ height: 175, width: "100%", display: "block" }}
              onClick={() => console.log('sdf')}
            />
          </div>
        )
      })}
    </Carousel></a>
    } else {
     return <div></div>;
    }
  }
	return (
		<div className="box box-ver mt_24">
			<Quick />
			<div className="box">
				<div className="box box-ver box-1 mr_24">
					<div className="box ph_32 bg_white pv_40 br_2">
						{quickLink.map((rs, index) => {
							return (
								<div
									key={index}
									className={
										quickLink.length === 5 ? (index === 1 || index === 3 ? "box box-1 box-ver box-allc"
											: "box box-ver box-allc") : ("box box-1 box-ver box-allc")
									}
								>
									<a
										href={rs.url}
										style={{ width: 56, height: 56, background: rs.background }}
										className="br_8 fc_white box box-allc pointer"
									>
										<Iconfont
											style={{ fontSize: rs.fontsize }}
											type={rs.iconName}
											className="fc_white"
										/>
									</a>
									<div className="box fs_14 mt_18" style={{ color: "#4B4A4A" }}>
										{rs.title}
									</div>
								</div>
							);
						})}
					</div>
					{GlobalData.user_power !== 'teacher' && <AttendanceClass />}
					<Upcoming />
					{GlobalData.user_power === 'admin' ? (<Classschedule />) : ""}
					<div className="box mt_24 bg_white box-ver">
						<div className="box fs_16 ph_24 pv_15 fw_600 fc_black1 bb_1">待办课节</div>
						<div className="box box-ver ph_24 mt_15">
							<div className="box mb_10">
								<Form>
									{({ form }) => (
										<Inputs
											name="lessonstatus"
											form={form}
											value="not_rocalled"
											radios={[
												{
													value: "not_rocalled",
													text: "未完成点名",
												},
												{
													value: "unfinished",
													text: "未结课",
												},
											]}
											onChange={(e) => {
												if (e === "not_rocalled") {
													setParam({ limitations: "", lesson_status: "not_rocalled" });
												} else {
													setParam({ limitations: "" });
												}
											}}
										/>
									)}
								</Form>
							</div>
							{campus_uuid !== "" ? <Lesson /> : ""}
						</div>
					</div>
				</div>
				<div className="box box-ver" style={{ width: 328 }}>
					<div className="box mb_24 bg_white br_2">
            <BannerList />
					</div>
					<div className="box box-ver mb_24 bg_white br_2">
						{showList.map((rs, index) => {
							return (
								<a href={rs.url} target={index !== 2 ? "_blank" : ""} key={rs.title}>
									<div
										className={index !== 2 ? "box pt_17 pb_30 mh_14 bb_1" : "box pt_17 pb_20 mh_14"}
									>
										<div className="box">
											<Img
												className="box"
												src={rs.img}
												style={{
													height: 88,
													width: 88,
												}}
											/>
										</div>
										<div className={`box box-1 box-ver ml_13`}>
											<div className="box mb_5 fs_16 fw_600 fc_black1">{rs.title}</div>
											<div className="box box-ver fs_13 fc_gray lh_18">
												<span style={{ color: "#F47017" }}>{rs.tips}</span>
												{rs.content}
											</div>
										</div>
									</div>
								</a>
							);
						})}
					</div>
					<Releasenote />
				</div>
			</div>
			<Page ref={(rs) => (lessondetail = rs)} onClose={() => tab.reload()}>
				<Lessondetail />
			</Page>
		</div>
	);
}
