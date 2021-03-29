import React, { useState } from "react";
import {
  $,
  Form,
  Inputs,
  TablePagination,
  Btn,
  Video,
  Voice
} from "../comlibs";
import Zmage from "react-zmage";

export default function(props) {
  let parent = props.Parent;
  let { uuid, date } = parent.data;
  let { tab } = $.useRef(["tab"]);
  let status = { NORMAL: "已打卡", REPAIR: "补打卡", WITHOUT: "未打卡" };
  let TableBox = () => {
    let [showUuids, setShowUuids] = useState([]);
    let columns = [
      {
        title: "姓名",
        dataIndex: "student_name",
        width: 300
      },
      {
        title: "提交时间",
        dataIndex: "time_update"
      },
      {
        title: "打卡状态",
        dataIndex: "status",
        align: "center",
        render(rs) {
          return <span>{status[rs] || "未打卡"}</span>;
        }
      },
      {
        title: "点评状态",
        dataIndex: "time_growing",
        render(rs) {
          return <span>{rs ? "已点评" : "未点评"}</span>;
        }
      },
      {
        title: "操作",
        render(rs) {
          if (!rs.status) return <span className="fc_dis pointer" title="未打卡不可展开">展开</span>;
          if (showUuids.some(uuid => uuid === rs.key)) {
            return (
              <span
                className="link"
                onClick={e => {
                  showUuids.splice(showUuids.indexOf(rs.key), 1);
                  setShowUuids(showUuids.concat([]));
                  e.stopPropagation()
                }}
              >
                收起
              </span>
            );
          }
          return (
            <span
              className="link"
              onClick={e => {
                setShowUuids(showUuids.concat([rs.key]));
                e.stopPropagation()
              }}
            >
              展开
            </span>
          );
        }
      }
    ];

    return (
      <TablePagination
        api="/clock/detail/days"
        ref={tab}
        params={{
          clock_uuid: uuid,
          date
        }}
        expandedRowKeys={showUuids}
        onRow={rs => ({
          onClick: e => {
            if (!rs.status) return;
            if (showUuids.indexOf(rs.key) >= 0) {
              showUuids.splice(showUuids.indexOf(rs.key), 1);
              setShowUuids(showUuids.concat([]));
              return;
            }
            setShowUuids(showUuids.concat([rs.key]));
          }
        })}
        columns={columns}
        expandIcon={() => <span></span>}
        expandedRowRender={rs => (
          <div className="dis_f jc_sb">
              <div className="box-1">
                <div className="mb_15" style={{maxWidth:600}}>{rs.content}</div>
                {rs.audios && rs.audios.length > 0 && (
                  <div className="box mb_15">
                    <div className="dis_f f_wrap" style={{maxWidth:600}}>
                      {rs.audios.map(item => (
                        <div key={item.audio_url} className="mr_8">
                          <Voice
                            audio_url={item.audio_url}
                            duration={item.duration}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                  <div className="box mb_20">
                    <div className="dis_f f_wrap" style={{maxWidth:'600px'}}>
                      {rs.img_urls && rs.img_urls.length > 0&&rs.img_urls.map((img, index) => {
                        return (
                          <div
                            key={img}
                            className="mr_15 mb_15"
                            style={{ width: 100, height: 100 }}
                          >
                            <Zmage
                              className="wh_full br_3"
                              controller={{ zoom: false }}
                              backdrop="rgba(255,255,255,.9)"
                              alt={img}
                              src={img}
                              set={rs.img_urls.map(img => ({
                                src: img,
                                alt: img
                              }))}
                              defaultPage={index}
                            />
                          </div>
                        );
                      })}
                      {rs.videos && rs.videos.length > 0&&rs.videos.map(item => (
                        <div key={item.video_cover} className="mr_8 mb_6">
                          <Video
                            video_cover={item.video_cover}
                            title={item.name}
                            video_url={item.video_url}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
              </div>

              <div style={{minWidth:'300px'}} className="box">
                <Form
                  className="box box-1"
                  action="/clock/teacher/growing"
                  params={{
                    clockday_uuid: rs.uuid
                  }}
                  success={() => {
                    $(tab).reload();
                    parent.setCloseData(true)
                    $.msg('点评成功!')
                  }}
                  method="POST"
                >
                  {({ form, submit }) => (
                    <div className="box box-1 box-ver pst_rel">
                      <Inputs
                        name="content"
                        placeholder="请输入您的点评内容"
                        value={rs.growing_content}
                        rows={4}
                        form={form}
                        type="textArea"
                      />
                      {rs.teacher_name && (
                        <div>最后操作：{rs.teacher_name}</div>
                      )}
                      <div className="ta_c mt_20">
                        <Btn onClick={submit}>确定</Btn>
                      </div>
                    </div>
                  )}
                </Form>
              </div>
            </div>
        )}
      />
    );
  };

  return (
    <div className="bg_white mt_20 pall_20">
      <Form onSubmit={val => $(tab).search(val)}>
        {({ form }) => (
          <div className="mb_20">
            <Inputs
              name="growing"
              className="mr_8"
              placeholder="点评状态"
              form={form}
              select={[
                { text: "点评状态", value: "" },
                { text: "已点评", value: "YES" },
                { text: "未点评", value: "NO" }
              ]}
            />
            <Inputs
              name="status"
              className="mr_8"
              placeholder="打卡状态"
              form={form}
              select={[
                { text: "打卡状态", value: "" },
                { text: "已打卡", value: "YES" },
                { text: "未打卡", value: "NO" }
              ]}
            />
            <Inputs
              name="name"
              form={form}
              className="mr_8"
              style={{ width: 300 }}
              placeholder="输入学员姓名、联系电话、首字母搜索"
            />
            <Btn htmlType="submit">搜索</Btn>
          </div>
        )}
      </Form>
      <TableBox/>
    </div>
  );
}
