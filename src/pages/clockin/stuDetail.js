import React, { useState, useEffect } from "react";
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
  let { studentclock_uuid } = parent.data;
  let { tab } = $.useRef(["tab"]);
  let [info,setInfo]=useState({})
  let [showUuids, setShowUuids] = useState([]);
  let status = { NORMAL: "已打卡", REPAIR: "补打卡", WITHOUT: "未打卡" };
  let columns = [
    {
      title: "打卡日期",
      width: 200,
      dataIndex: "date"
    },
    {
      title: "提交时间",
      dataIndex: "time_update",
      align: "center",
      render(rs) {
        return <span>{rs || "-"}</span>;
      }
    },
    {
      title: "打卡状态",
      dataIndex: "status",
      align: "center",
      render(rs) {
        return <span>{status[rs]}</span>;
      }
    },
    {
      title: "点评状态",
      dataIndex: "time_growing",
      align: "center",
      render(rs) {
        return <span>{rs ? "已点评" : "未点评"}</span>;
      }
    },
    {
      title: "操作",
      render(rs) {
        if (rs.status === "WITHOUT") return <span className="fc_dis pointer" title="未打卡不可展开">展开</span>;
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
  async function init(){
    let res=await $.get('/clock/detail/student/info',{studentclock_uuid})
    setInfo(res)
  }
  useEffect(()=>{
    init()
  },[])
  return (
    <div className="mt_20">
      <div className="bg_white pall_20 br_2 mb_20">
        <div className="mb_20">
          <span className="fs_20 mr_24">{info.student_name}</span>
          <span>加入时间：{info.time_create}</span>
        </div>
        <div>
          <span className="mr_24">累计天数：{info.cnt_days}</span>
          <span className="mr_24">未打卡天数：{info.cnt_undays}</span>
          <span>已点评：{info.cnt_comments}</span>
        </div>
      </div>
      <div className="bg_white pall_20">
        <TablePagination
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
          ref={tab}
          api="/clock/detail/student"
          params={{
            studentclock_uuid
          }}
          expandedRowKeys={showUuids}
          expandRowByClick={true}
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
                    init()
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
      </div>
    </div>
  );
}
