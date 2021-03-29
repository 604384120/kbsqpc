import React,{useState,useEffect} from 'react'
import {Form as Forms,Rate,Input,Empty } from "antd"
import { Form, Method,Modals,Voice, Video,Btn, FixedBox } from "../comlibs";
import Zmage from 'react-zmage'

export default function(props){
    let $ =new Method()
    let {detailModal}={}
    let parent=props.Parent
    let {uuid,showBottom}  = parent?.data||{};
    !uuid && (uuid = $.getQueryString('uuid'));
    let [detail,setDetail]=useState({})
    let statusTxt={'normal':'到课','leave':'请假','absent':'缺课'}
    let statusColor={'normal':'#1EC47C','leave':'#FEBD3F','absent':'#EF5E53'}
    let formCol={
        labelCol: {
            span: 3
          },
        wrapperCol: {
            span: 21
        },
    }
    let modalCol={
        labelCol: {
            span: 5
          },
        wrapperCol: {
            span: 19
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
        <div className="pt_24">
            <div className="pall_10 br_2 bg_white">
                <div className="fs_20 mb_18 fb fc_black2">{detail.group_name}</div>
                    <div className="mb_15"><span className="fc_black2">上课时间：</span>{detail.lessontime&&detail.lessontime.year+'-'+detail.lessontime.date+" ("+detail.lessontime.week+") "+detail.lessontime.time+"-"+(detail.endtime&&detail.endtime.time)}</div>
                <div className="box">
                    <div className="mr_25"><span className="fc_black2">授课老师：</span>{detail.teacher_names}</div>
                    <div className="mr_25"><span className="fc_black2">教室：</span>{detail.classroom||'未设置教室'}</div>
                </div>
            </div>
            <div className="pall_5 mt_16 bg_white br_2">
                <div className="box">
                <div className="pall_5 box-3" style={{minHeight:300}}>
                    <div className="fs_16 mb_18"><span className="fb fc_black2">本节课统一点评</span><span className="fs_14">（统一点评的内容本节课所有的学员都可以在学员端查看）</span></div>
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
                                                    {/* {detail.textList||'无'} */}
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
                                                    <Forms.Item label="音频" >
                                                        {
                                                            detail.audios.map((rs)=>{
                                                                return (
                                                                    <div className="mb_15" key={rs.audio_url}>
                                                                        <Voice {...rs} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </Forms.Item>)
                                                }
                                                {
                                                    detail.videos&&detail.videos.length!==0&&(
                                                        <Forms.Item label="视频">
                                                            <div className="dis_f f_wrap">
                                                                {
                                                                    detail.videos&&detail.videos.map((rs)=>{
                                                                        return (
                                                                            <div key={rs.video_url} className="mb_15 mr_15">
                                                                                <Video {...rs} />
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
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
                        <div className="fs_16 mb_18 fb fc_black2">学员单独点评</div>
                        <div>
                            {
                                detail.students&&detail.students.map(rs=>{
                                    return (
                                        <div key={rs.uuid} onClick={()=>{
                                            if(rs.is_reviewed){
                                                detailModal.open('点评详情',rs)
                                            }
                                        }} className={`dis_f jc_sb ai_c fs_16 pv_5 ${rs.is_reviewed?'link':''}`}>
                                            <span>{rs.name}<span style={{color:statusColor[rs.status]||'rgba(0, 0, 0, 0.65)'}}>({statusTxt[rs.status]||'未点名'})</span></span>
                                            <span>{rs.is_reviewed?'已点评':'未点评'}</span>
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
            <div style={{height:70}}></div>
            {
                showBottom&&(<FixedBox>
                    <div style={{width:'100%'}}>
                        <Btn className="mr_15" onClick={()=>{parent.close()}}>关闭</Btn>
                    </div>
                </FixedBox>)
            }
            <Modals ref={rs=>(detailModal=rs)}>
                {(obj)=>(
                        (obj.content&&obj.content.length===0)&&((!obj.audios)||(obj.audios&&obj.audios.length===0))&&((!obj.videos)||(obj.videos&&detail.videos.length===0))?(
                            <div className="box-3">
                                <Empty style={{minHeight:300,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </div>
                        ):(
                            <Form {...modalCol}>
                                {({form})=>(
                                    <div>
                                        {obj.review_grasps.map(rs=>(
                                            <Forms.Item className="dis_f ai_c" key={rs.name} label={rs.name}>
                                                <div>
                                                    <Rate disabled defaultValue={rs.value} />
                                                    <span className="ml_10">{rs.value}分</span>
                                                </div>
                                            </Forms.Item>
                                        ))}
                                        
                                        <Forms.Item label="内容">
                                            <Input.TextArea rows={5} disabled style={{resize:'none',backgroundColor:'white',color:'black'}} value={obj.textList}/>
                                        </Forms.Item>
                                        {
                                            obj.audios&&obj.audios.length!==0&&(
                                                <Forms.Item label="音频">
                                                    {
                                                        obj.audios.map((rs)=>{
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
                                            obj.videos&&obj.videos.length!==0&&(
                                                <Forms.Item label="视频">
                                                    <div className="dis_f f_wrap">
                                                    {   
                                                        obj.videos.map((rs)=>{
                                                            return (
                                                                <div key={rs} className="mr_15 mb_15">
                                                                    <Video {...rs} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                </Forms.Item>
                                            )
                                        }
                                        {
                                            obj.images&&obj.images.length!==0&&(
                                                <Forms.Item label="图片">
                                                    <div className="dis_f f_wrap">
                                                        {
                                                            obj.images.map((rs,index)=>{
                                                                return (
                                                                    <div key={rs} className="mr_15 mb_15" style={{width:100,height:100}}>
                                                                        <Zmage className="wh_full br_3" controller={{zoom: false}} backdrop="rgba(255,255,255,.9)" alt={rs} src={rs} set={
                                                                                obj.images.map((img)=>({src:img,alt:img}))
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
                )}
            </Modals>
        </div>
    )
}