import React from "react";
import { Method } from "../comlibs";

const $ = new Method();

let deliver = (carduuid, student_uuid) => {
  $.confirm(`确定要发放该课卡给这些学员吗？`, async () => {
    let res = await $.post("/lessoncard/batch/deliver", {
      lessoncard_uuid: carduuid,
      student_uuids: student_uuid
    });
    $.msg("发放成功！");
    return res;
  });
};
export { deliver };

export default function(props) {
  
  let [
    type,
    cardname,
    carduuid,
    student_name,
    studentcard_uuid,
    success
  ] = [
    props.type,
    props.cardname,
    props.carduuid,
    props.student_name,
    props.studentcard_uuid,
    props.success
  ];
  let disable = () => {
    $.confirm(
      `确定要废弃课卡[${cardname}]吗？废弃后，不影响课卡下原有学员的操作`,
      async () => {
        let res = await $.get(`/lessoncard/${carduuid}/disable`);
        $.msg("废弃成功！");
        success && success();
        return res;
      }
    );
  };
  let del = () => {
    $.confirm(
      `确定要删除学员[${student_name}]的该课卡吗？删除后学员端不会展示该课卡！`,
      async () => {
        let res = await $.get("/studentcard/remove", {
          studentcard_uuid: studentcard_uuid
        });
        $.msg("删除成功！");
        success && success();
        return res;
      }
    );
  };
  let recover = () => {
    $.confirm(`确定要收回学员[${student_name}]的该课卡吗？`, async () => {
      let res = await $.get(`/studentcard/${studentcard_uuid}/recover`);
      $.msg("收回成功！");
      success && success();
      return res;
    });
  };
  let restore = () => {
    $.confirm(`确定要恢复[${student_name}]的课卡吗？`, async () => {
      let res = await $.post("/studentcard/recover/restore", {
        studentcard_uuid: studentcard_uuid
      });
      $.msg("恢复成功！");
      success && success();
      return res;
    });
  };

  if (type === "disable")
    return (
      <span className="pointer hover fc_red" onClick={disable}>
        废弃
      </span>
    );
  if (type === "del")
    return (
      <span className="pointer hover fc_red" onClick={del}>
        删除
      </span>
    );
  if (type === "recover")
    return (
      <span onClick={recover} className="pointer hover fc_red">
        收回
      </span>
    );
  if (type === "restore")
    return (
      <span onClick={restore} className="pointer hover fc_red">
        恢复
      </span>
    );
}
