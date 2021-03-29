import React from "react";
import { Method, Page } from "./comlibs";

import Campus from "../common/works/campus";
import Semesters from "../common/works/semesters";
import Gradesclass from "../common/works/gradesclass";
import Cascaders from "../common/works/cascaders";
import Classlevel from "../common/works/classlevel";
import Student from "../common/works/student";
import Teacher from "../common/works/teacher";
import Course from "../common/works/course";
import CourseTeacher from "../common/works/courseTeacher";
//new
import WorksData from "../common/works/data";
import Grades from "../common/works/grades";
import Cover from "../common/works/cover";
import Poster from "../common/works/poster";
import ChoiceCourse from "../common/works/choiceCourse";
import ChoiceClass from "../common/works/choiceClass";
import ChoiceStudent from "../common/works/choiceStudent";
import ChoiceTeacher from "../common/works/choiceTeacher";
import ChoiceReplesStudent from "../common/works/choiceReplesStudent";
import ChoiceClassStudents from "../common/works/choiceClassStudents";
import ChoiceClassStudent from "../common/works/choiceClassStudent";
import SearchStudent from "../common/works/searchStudent";
import Subject from "../common/works/subject";
import FeeTypes from "../common/works/feeTypes";
import Class from '../common/works/class';
import ChoiceAdmin from "../common/works/choiceAdmin";
import ChoicePromoter from "../common/works/choicePromoter";
import Classroom from "../common/works/classroom";
import SelectTeam from "../common/works/selectTeam";

const $ = new Method();

class Page_ChoiceCourse extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
	}
	open(params) {
		this.Page.open("选择课程", params);
	}
	render() {
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)}>
				<ChoiceCourse />
			</Page>
		);
	}
}

class Page_ChoiceClass extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
	}
	open(params,setting={}) {
		if (typeof params.course_uuid !== "undefined" && !params.course_uuid) {
			$.warning("请选择好课程后再操作~");
			return;
		}
		this.Page.open("选择班级", params,setting);
	}
	render() {
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)}>
				<ChoiceClass />
			</Page>
		);
	}
}

class Page_ChoiceStudent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
		this.type = props.type || "normal";
	}
	open(params) {
		this.Page.open("选择学员", params);
	}
	render() {
		let Content = ChoiceStudent;
		if (this.type === "reples") {
			Content = ChoiceReplesStudent;
		}
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)}>
				<Content />
			</Page>
		);
	}
}

class Page_ChoiceTeacher extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
		this.cfgs = props.configs || {};
	}
	open(params) {
		this.Page.open(params.title || "选择老师", params, this.cfgs);
	}
	render() {
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)}>
				<ChoiceTeacher />
			</Page>
		);
	}
}

class Page_ChoicePromoter extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
	}
	open(params) {
		this.Page.open(params.title || "选择推广员", params);
	}
	render() {
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)}>
				<ChoicePromoter />
			</Page>
		);
	}
}

class Page_ChoiceAdmin extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
		this.cfgs = props.configs || {};
	}
	open(params) {
		this.Page.open(params.title || "选择校区校长",params, this.cfgs);
	}
	render() {
		return (
			<Page {...this.props} mask={true} ref={(ref) => (this.Page = ref)}>
				<ChoiceAdmin />
			</Page>
		);
	}
}

class Page_ChoiceClassStudent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
	}
	open(params, ele) {
		// if (!params.group_uuid) {
		// 	console.error("ChoiceClassStudent组件必须传递group_uuid参数");
		// 	return;
		// }
		this.Page.open("选择班级学员", params, ele);
	}
	render() {
		return (
			<Page {...this.props} mask={true} ref={(ref) => (this.Page = ref)}>
				<ChoiceClassStudent />
			</Page>
		);
	}
}

export {
	Campus,
	Semesters,
	Gradesclass,
	Cascaders,
	Classlevel,
	Student,
	Teacher,
	Course,
	CourseTeacher,
	//new
	WorksData,
	Grades,
	Cover,
	Poster,
	ChoiceCourse,
	ChoiceClass,
	ChoiceClassStudent,
	ChoiceClassStudents,
	Page_ChoiceClass,
	Page_ChoiceStudent,
	Page_ChoiceTeacher,
	Page_ChoicePromoter,
	Page_ChoiceClassStudent,
	Page_ChoiceCourse,
	Page_ChoiceAdmin,
	SearchStudent,
	Subject,
	FeeTypes,
  Class,
	Classroom,
	SelectTeam
};
