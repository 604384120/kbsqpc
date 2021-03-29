import React, { useState } from "react";
import {
  Img,
  Uploadimgs,
  Uploadvideo,
  Uploadaudio,
  Video,
  Voice,
} from "../comlibs";
import Zmage from "react-zmage";

/**
 * set : Form组件的set 传了:可编辑 不传:不可编辑
 * img_urls : 默认图片列表
 * video_list : 默认视频列表
 * audio_list : 默认音频列表
 *
 * img_ref : 上传图片组件实例的钩子
 * video_ref : 上传视频组件实例的钩子
 * audio_ref : 上传音频组件实例的钩子
 */
export default function (props) {
  let {
    set,
    img_draw,
    img_urls = [],
    video_list = [],
    audio_list = [],
    img_ref,
    video_ref,
    audio_ref,
  } = props;
  let [imgs, setImgs] = useState(img_urls);
  let [videos, setVideos] = useState(video_list);
  let [voices, setVoices] = useState(audio_list);
  let imgVal = null;
  let videoVal = null;
  let voiceVal = null;

  return (
    <div>
      <div>
        {voices.map((rs, index) => (
          <div key={rs.audio_url} className="mb_10 box box-ac">
            <Voice {...rs} />
            {set && (
              <img
				alt="xxx"
                className="pointer ml_10"
                style={{ width: 16, height: 16 }}
                onClick={async () => {
                  voices.splice(index, 1);
                  voiceVal && voiceVal(voices);
                  setVoices(voices.concat([]));
                }}
                src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png"
              />
            )}
          </div>
        ))}
      </div>

      <div className="dis_f f_wrap">
        {imgs.map((image, index) => (
          <div
            key={image}
            className="mr_15 mb_15 pst_rel"
            style={{ width: 100, height: 100 }}
          >
            {!img_draw && set && (
              <img
			  	alt="xxx"
                className="pst_abs pointer"
                style={{ width: 16, height: 16, right: 2, top: 2 }}
                onClick={async () => {
                  imgs.splice(index, 1);
                  imgVal && imgVal(imgs);
                  setImgs(imgs.concat([]));
                }}
                src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png"
              />
            )}
            {img_draw ? (
              <Img
                className="br_3 pointer 11111"
                src={image}
                width={100}
                height={100}
                onClick={() => {
                  img_draw.open(image + "?x-oss-process=style/album500");
                }}
              />
            ) : (
              <Zmage
                className="wh_full br_3"
                controller={{ zoom: false }}
                backdrop="rgba(255,255,255,.9)"
                alt={image}
                src={image}
                set={imgs.map((image) => ({
                  src: image,
                  alt: image,
                }))}
                defaultPage={index}
              />
            )}
          </div>
        ))}

        {videos.map((video, index) => (
          <div className="mr_15 mb_15 pst_rel" key={video.video_url}>
            {set && (
              <img
			  	alt="xxx"
                className="pst_abs pointer"
                style={{ width: 16, height: 16, right: 2, top: 2, zIndex: 1 }}
                onClick={async () => {
                  videos.splice(index, 1);
                  videoVal && videoVal(videos);
                  setVideos(videos.concat([]));
                }}
                src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png"
              />
            )}
            <Video isTrans={true} {...video} />
          </div>
        ))}
      </div>

      {set &&
        set(
          {
            name: "video_covers",
            value: videos.map((o) => o.video_cover).join(","),
          },
          () => <span></span>
        )}
      {set &&
        set(
          { name: "video_names", value: videos.map((o) => o.name).join(",") },
          () => <span></span>
        )}
      {set &&
        set(
          {
            name: "audio_durations",
            value: voices.map((o) => `${o.duration}`).join(","),
          },
          () => <span></span>
        )}
      {set &&
        set(
          { name: "audio_names", value: voices.map((o) => o.name).join(",") },
          () => <span></span>
        )}

      {set &&
        set(
          {
            name: "audio_urls",
            value: voices.map((o) => o.audio_url).join(","),
          },
          (valueSet) => {
            voiceVal = valueSet;
            return (
              <Uploadaudio
                ref={audio_ref}
                multiple={true}
                onSure={(rs) => {
                  let list = voices.concat(
                    rs.map((o) => ({
                      audio_url: o.url,
                      duration: o.duration + '"',
                      name: o.name,
                    }))
                  );
                  setVoices(list);
                  valueSet(list.map((o) => o.audio_url).join(","));
                }}
              ></Uploadaudio>
            );
          }
        )}

      {set &&
        set(
          {
            name: "video_urls",
            value: videos.map((o) => o.video_url).join(","),
          },
          (valueSet) => {
            videoVal = valueSet;
            return (
              <Uploadvideo
                ref={video_ref}
                multiple={true}
                onSure={(rs) => {
                  let list = videos.concat(
                    rs.map((o) => ({
                      video_url: o.url,
                      video_cover: o.cover,
                      name: o.name,
                    }))
                  );
                  setVideos(list);
                  valueSet(list.map((o) => o.video_url).join(","));
                }}
              ></Uploadvideo>
            );
          }
        )}

      {set &&
        set(
          {
            name: "img_urls",
            value: img_urls.join(","),
          },
          (valueSet) => {
            imgVal = valueSet;
            return (
              <Uploadimgs
                ref={img_ref}
                prefix={"image/homework/"}
                onSure={(rs) => {
                  setImgs(imgs.concat(rs.split(",")));
                  valueSet(imgs.concat(rs.split(",")).join(","));
                }}
              />
            );
          }
        )}
    </div>
  );
}
