let Today = function (data) {
	if (data.length === 0) {
		return false;
	}

	let campus_name = data.map((d) => {
		return {
			value: d.campus_name,
			textStyle: { color: "rgba(0,0,0,0.45)" },
		};
	});
	let banji_list = data.map((d) => d.group_count);
	let student_list = data.map((d) => d.student_count);
	let teacher_list = data.map((d) => d.teacher_count);
	let inst_list = data.map((d) => d.institution_count);
	let echarts = window.echarts;

	let myChart = echarts.init(document.getElementById("TodayChart"));
	let app = {};
	let posList = [
		"left",
		"right",
		"top",
		"bottom",
		"inside",
		"insideTop",
		"insideLeft",
		"insideRight",
		"insideBottom",
		"insideTopLeft",
		"insideTopRight",
		"insideBottomLeft",
		"insideBottomRight",
	];

	app.configParameters = {
		rotate: {
			min: -90,
			max: 90,
		},
		align: {
			options: {
				left: "left",
				center: "center",
				right: "right",
			},
		},
		verticalAlign: {
			options: {
				top: "top",
				middle: "middle",
				bottom: "bottom",
			},
		},
		position: {
			options: echarts.util.reduce(
				posList,
				function (map, pos) {
					map[pos] = pos;
					return map;
				},
				{}
			),
		},
		distance: {
			min: 0,
			max: 100,
		},
	};

	app.config = {
		rotate: 90,
		align: "left",
		verticalAlign: "middle",
		position: "insideBottom",
		distance: 15,
		onChange: function () {
			let labelOption = {
				normal: {
					rotate: app.config.rotate,
					align: app.config.align,
					verticalAlign: app.config.verticalAlign,
					position: app.config.position,
					distance: app.config.distance,
				},
			};
			myChart.setOption({
				series: [
					{
						label: labelOption,
					},
					{
						label: labelOption,
					},
					{
						label: labelOption,
					},
					{
						label: labelOption,
					},
				],
			});
		},
	};

	let option = {
		color: ["#3FADFF", "#5AD8A6", "#E8684A", "#FFD418"],
		tooltip: {
			padding: [10, 12],
			trigger: "axis",
			axisPointer: {
				type: "shadow",
			},
		},
		grid: {
			left: 60,
			right: 25,
			height: 190,
		},
		legend: {
			right: 23,
			itemWidth: 8,
			itemHeight: 8,
			icon: "rect",
			textStyle: {
				padding: [2, 0, 0, 0],
			},
			data: ["班级数", "学生数", "教师数", "机构数"],
		},
		itemStyle: {
			borderWidth: 1,
			borderColor: "#fff",
		},
		xAxis: [
			{
				type: "category",
				axisLabel: { rotate: 50, interval: 0 },
				axisTick: { show: false },
				data: campus_name,
			},
		],
		yAxis: [
			{
				type: "value",
			},
		],
		series: [
			{
				barGap: 0,
				barWidth: 8,
				name: "班级数",
				type: "bar",
				data: banji_list,
			},
			{
				barGap: 0,
				barWidth: 8,
				name: "学生数",
				type: "bar",
				data: student_list,
			},
			{
				barGap: 0,
				barWidth: 8,
				name: "教师数",
				type: "bar",
				data: teacher_list,
			},
			{
				barGap: 0,
				barWidth: 8,
				name: "机构数",
				type: "bar",
				data: inst_list,
			},
		],
	};

	myChart.setOption(option);
};

let Develops = function (data) {
	if (data.length === 0) {
		return false;
	}

	let campus_name = data.map((d) => {
		return {
			value: d.name,
			textStyle: { color: "rgba(0,0,0,0.45)" },
		};
	});
	let course_list = data.map((d) => d.courses);
	let echarts = window.echarts;

	let myChart = echarts.init(document.getElementById("Develops"));
	let app = {};
	let posList = [
		"left",
		"right",
		"top",
		"bottom",
		"inside",
		"insideTop",
		"insideLeft",
		"insideRight",
		"insideBottom",
		"insideTopLeft",
		"insideTopRight",
		"insideBottomLeft",
		"insideBottomRight",
	];

	app.configParameters = {
		rotate: {
			min: -90,
			max: 90,
		},
		align: {
			options: {
				left: "left",
				center: "center",
				right: "right",
			},
		},
		verticalAlign: {
			options: {
				top: "top",
				middle: "middle",
				bottom: "bottom",
			},
		},
		position: {
			options: echarts.util.reduce(
				posList,
				function (map, pos) {
					map[pos] = pos;
					return map;
				},
				{}
			),
		},
		distance: {
			min: 0,
			max: 100,
		},
	};

	app.config = {
		rotate: 90,
		align: "left",
		verticalAlign: "middle",
		position: "insideBottom",
		distance: 15,
		onChange: function () {
			let labelOption = {
				normal: {
					rotate: app.config.rotate,
					align: app.config.align,
					verticalAlign: app.config.verticalAlign,
					position: app.config.position,
					distance: app.config.distance,
				},
			};
			myChart.setOption({
				series: [
					{
						label: labelOption,
					},
					{
						label: labelOption,
					},
					{
						label: labelOption,
					},
					{
						label: labelOption,
					},
				],
			});
		},
	};

	let option = {
		color: ["#3FADFF"],
		tooltip: {
			padding: [10, 12],
			trigger: "axis",
			axisPointer: {
				type: "shadow",
			},
		},
		grid: {
			top: 20,
			left: 60,
			right: 25,
			height: 190,
		},
		xAxis: [
			{
				type: "category",
				axisTick: { show: false },
				axisLabel: { rotate: 50, interval: 0 },
				data: campus_name,
			},
		],
		yAxis: [
			{
				type: "value",
			},
		],
		series: [
			{
				barGap: 0,
				barWidth: 32,
				name: "课程",
				type: "bar",
				data: course_list,
			},
		],
	};

	myChart.setOption(option);
};

let CourseCategorys = function (data) {
	if (data.length === 0) {
		return false;
	}

	let echarts = window.echarts;
	let myChart = echarts.init(document.getElementById("CourseCategorys"));
	let seriesData = data.map((d) => {
		return {
			name: d.name,
			value: d.percentage,
		};
	});

	let option = {
		color: [
			"#F6BD16",
			"#5D7092",
			"#5AD8A6",
			"#3FADFF",
			"#9270CA",
			"#6DC8EC",
			"#E8684A",
			"#FF9D4D",
			"#269A99",
			"#FF99C3",
		],
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b} : {c} ({d}%)",
		},
		grid: {
			top: 50,
			height: 380,
		},
		series: [
			{
				name: "类别占比",
				type: "pie",
				radius: ["50%", "65%"],
				tooltip: {
					padding: [10, 15],
					formatter: "{b}：{d}%",
					backgroundColor: "rgba(255,255,255,1)",
					extraCssText: "box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.15);",
					textStyle: {
						color: "#000",
					},
				},
				itemStyle: {
					borderWidth: 1,
					borderColor: "#fff",
				},
				label: {
					formatter: "{b|{b}：}{d}%",
					rich: {
						a: {
							color: "#999",
							lineHeight: 22,
							align: "center",
						},
						hr: {
							borderColor: "#aaa",
							width: "100%",
							borderWidth: 0.5,
							height: 0,
						},
						b: {
							fontSize: 16,
							lineHeight: 33,
						},
					},
				},
				data: seriesData,
			},
		],
	};

	myChart.setOption(option);
};

let Teacher = function (campus_teacher, institution_teacher) {
	if (!campus_teacher && !institution_teacher) {
		return false;
	}

	let echarts = window.echarts;
	let myChart = echarts.init(document.getElementById("Teacher"));

	let option = {
		color: ["#5AD8A6", "#3FADFF"],
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b} : {c} ({d}%)",
		},
		series: [
			{
				name: "老师占比",
				type: "pie",
				radius: ["50%", "65%"],
				tooltip: {
					padding: [10, 15],
					formatter: "{b}：{d}%",
					backgroundColor: "rgba(255,255,255,1)",
					extraCssText: "box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.15);",
					textStyle: {
						color: "#000",
					},
				},
				itemStyle: {
					borderWidth: 1,
					borderColor: "#fff",
				},
				label: {
					formatter: "{b|{b}：}{d}%",
					rich: {
						a: {
							color: "#999",
							lineHeight: 22,
							align: "center",
						},
						hr: {
							borderColor: "#aaa",
							width: "100%",
							borderWidth: 0.5,
							height: 0,
						},
						b: {
							fontSize: 16,
							lineHeight: 33,
						},
					},
				},
				data: [
					{
						name: "校内老师",
						value: campus_teacher || 0,
					},
					{
						name: "机构老师",
						value: institution_teacher || 0,
					},
				],
			},
		],
	};

	myChart.setOption(option);
};

export { Today, CourseCategorys, Teacher, Develops };
