import { Method } from "../comlibs";

const $ = new Method();

let lessonEnd = async (lesson_uuid, success) => {
  let res = await $.post("/lesson/end", { lesson_uuid: lesson_uuid });
  $.msg("结课成功!");
  success && success();
  return res;
};
let cancelEnd = async lesson_uuid => {
  let res = await $.post("/lesson/end/cancel", { lesson_uuid: lesson_uuid });
  $.msg("取消结课成功!");
  return res;
};
let cancelRollcall = async (lesson_uuid, student_uuids) => {
  let res = await $.post(`/lesson/${lesson_uuid}/rollcall`, {
    student_uuids: student_uuids,
    status: "goback"
  });
  $.msg("取消结课成功!");
  return res;
};

let lessonRemove = (lesson_uuid, success) => {
  console.log(success)
  $.confirm(
    "确认删除已完课节吗？确认删除后学员已扣课时会被退回。",
    async () => {
      let res = await $.get("/lessons/remove", { lesson_uuids: lesson_uuid });
      $.msg("删除成功!");
      success && success();
      return res;
    }
  );
};

export { lessonEnd, cancelEnd, lessonRemove, cancelRollcall };
