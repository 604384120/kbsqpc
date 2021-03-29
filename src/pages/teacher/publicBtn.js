import React from "react";
import { Method, Btn } from "../comlibs";
const $ = new Method();
let del = (name, uuid,userkind ,success) => {
  if(userkind ==='owner'){
    $.warning("校区校长不能删除！");
    return false;
  }
  $.confirm(`确定要删除${name}吗`, async () => {
    let res = await $.get(`/teacher/remove/${uuid}`);
    $.msg("删除成功！");
    success && success();
    return res;
  });
};
let sus = (name, uuid,userkind, success) => {
  if(userkind ==='owner'){
    $.warning("校区校长不能离职！");
    return false;
  }
  $.confirm(
    // `确定要将${name}设成离职吗?离职后${name}无法登录校区进行操作，历史上课数据会保留。`,
    `确认操作离职吗？在操作后系统会自动将该老师待上课节、关联课程及约课课卡数据进行清除处理`,
    async () => {
      let res = await $.post("/campus/teacher/suspend", {
        teacher_uuid: uuid
      });
      $.msg("离职成功！");
      success && success();
      return res;
    }
  );
};
let rei = (name, uuid, success) => {
  $.confirm(`确定要${name}复职吗？`, async () => {
    let res = await $.post("/campus/teacher/reinstate", {
      teacher_uuid: uuid
    });
    $.msg("复职成功！");
    success && success();
    return res;
  });
};
export { del, sus, rei };
export default function(props) {
  let [type, name, uuid, userkind,success] = [
    props.type,
    props.name,
    props.uuid,
    props.userkind,
    props.success
  ];

  if (type === "del")
    return (
      <Btn className="ml_10" onClick={() => del(name, uuid, success)}>
        删除
      </Btn>
    );
  if (type === "suspend")
    return <Btn onClick={() => sus(name, uuid, success)}>离职</Btn>;
  if (type === "reinstate")
    return <Btn onClick={() => rei(name, uuid, success)}>复职</Btn>;
  if (type === "delA")
    return (
      <a onClick={() => del(name, uuid,userkind, success)} style={{ color: "#f07070" }}>
        删除
      </a>
    );
  if (type === "suspendA")
    return <a onClick={() => sus(name, uuid, userkind,success)}>离职</a>;
  if (type === "reinstateA")
    return <a onClick={() => rei(name, uuid, success)}>复职</a>;
}
