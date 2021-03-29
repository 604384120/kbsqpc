import React,{useState,useEffect} from 'react'
import {Form as Forms,Input,Empty } from "antd"
import { Form, Method,Voice, Video } from "../comlibs";
import Zmage from 'react-zmage'

export default function(props){
    let $ =new Method()
    let parent=props.Parent
    let uuid=parent.data
    let [detail,setDetail]=useState({})
    let formCol={
        labelCol: {
            span: 3
          },
        wrapperCol: {
            span: 21
        },
    }
    function init(){
        (async () => {
            let res = await $.get("/growing/detail", { growing_uuid: uuid,all_students:'yes'});
            res.content=JSON.parse(res.content||'[]')
            let textList=''
            let images=[]
            res.content.forEach(obj => {
                if(obj.type==='text'){
                    textList+=obj.content
                }else if(obj.type==='img'){
                    images.push(obj.content)
                }
            });
            res.students.forEach(stu=>{
                if(!stu.is_reviewed)return
                stu.comment=JSON.parse(stu.comment||'[]')
                let textList=''
                let images=[]
                stu.comment.forEach(obj=>{
                    if(obj.type==='text'){
                        textList+=obj.content
                    }else if(obj.type==='img'){
                        images.push(obj.content)
                    }
                })
                stu.images=images
                stu.textList=textList
            })
            res.images=images
            res.textList=textList
			setDetail(res)
			return res;
		})();
    }
    useEffect(()=>{init()},[uuid])

    return (
        <div className="bg_white mt_24 pall_15">
            <div className="pall_5 br_2">
                <div className="box">
                    <div className="pall_5 box-3">
                        <div className="fs_16 mb_18 fb">日常点评</div>
                        {
                            (detail.content&&detail.content.length===0)&&((!detail.audios)||(detail.audios&&detail.audios.length===0))&&((!detail.videos)||(detail.videos&&detail.videos.length===0))?(
                                <div className="box-3">
                                    <Empty style={{minHeight:300,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </div>
                            ):(
                                <Form {...formCol} style={{width:700}}>
                                    {({form})=>(
                                        <div>
                                            <Forms.Item label="主题">
                                                    <Input form={form} disabled value={detail.title} style={{width:'100%',backgroundColor:'white',color:'black'}} name="title"/>
                                            </Forms.Item>
                                            <Forms.Item label="内容">
                                                {/* <div className="pall_5 b_1"> */}
                                                    <Input.TextArea form={form} disabled value={detail.textList} rows={5}  name="content" style={{resize:'none',backgroundColor:'white',color:'black'}}/>
                                                    {/* <div className="box">
                                                        <div className="dis_f a_items mr_15 pointer">
                                                            <Iconfont
                                                                className="fc_info fs_20 mr_5"
                                                                type="icon-shipin"
                                                            />
                                                            <span>视频</span>
                                                        </div>
                                                        <div className="dis_f a_items mr_15 pointer">
                                                            <Iconfont
                                                                className="fc_info fs_20 mr_5"
                                                                type="icon-tupian"
                                                            />
                                                            <span>图片</span>
                                                        </div>
                                                        <div className="dis_f a_items pointer">
                                                            <Iconfont
                                                                className="fc_info fs_20 mr_5"
                                                                type="icon-yuyin"
                                                            />
                                                            <span>语音</span>
                                                        </div>
                                                    </div> */}
                                                {/* </div> */}
                                            </Forms.Item>
                                            {
                                                detail.audios&&detail.audios.length!==0&&(
                                                    <Forms.Item label="音频">
                                                        {
                                                            detail.audios.map((rs)=>{
                                                                return (
                                                                    <div className="mb_15" key={rs.audio_url}>
                                                                        <Voice {...rs} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </Forms.Item>
                                                )
                                            }
                                            
                                            {
                                                detail.videos&&detail.videos.length!==0&&(
                                                    <Forms.Item label="视频">
                                                        <div className="dis_f f_wrap">
                                                        {detail.videos.map((rs)=>{
                                                            return (
                                                                <div key={rs.video_url} className="mr_15 mb_15">
                                                                    <Video {...rs} />
                                                                </div>
                                                            )
                                                        })}
                                                        </div>
                                                    </Forms.Item>
                                                )
                                            }
                                            {
                                                detail.images&&detail.images.length!==0&&(
                                                    <Forms.Item label="图片">
                                                        <div className="dis_f f_wrap">
                                                            {
                                                                detail.images.map((rs,index)=>{
                                                                    return (
                                                                        <div key={rs} className="mr_15 mb_15" style={{width:100,height:100}}>
                                                                            <Zmage className="wh_full br_3" controller={{zoom: false}} backdrop="rgba(255,255,255,.9)" alt={rs} src={rs} set={
                                                                                detail.images.map((img)=>({src:img,alt:img}))
                                                                            } defaultPage={index}/>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </Forms.Item>
                                                )
                                            }
                                            
                                        </div>
                                    )}
                                </Form>    
                            )
                        }
                    
                    </div>
                    <div className="pall_10 box-2 bl_1">
                        <div className="fs_16 mb_18 fb">接收学员</div>
                        <div>
                            {
                                detail.students&&detail.students.map(rs=>{
                                    return (
                                        <div key={rs.student_uuid} className="dis_f jc_sb ai_c fs_16 pv_5">
                                            <span>{rs.name}</span>
                                            <span className="link"></span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                {/* <div className="bt_1 mh_3 ta_c pv_16"> */}
                    {/* <Button className="mr_15">删除点评</Button>
                    <Button type="primary">重新发布</Button> */}
                {/* </div> */}
            </div>

        </div>
    )
}