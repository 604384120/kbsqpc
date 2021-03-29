import React from 'react'
import {TablePagination,$} from '../comlibs'
import {Tooltip,Modal} from 'antd'

export default function(props){
    let {getCount}=props
    let {tab}={}
    let columns=[
        {
            title:'序号',
            dataIndex:'_key'
        },
        {
            title:'学员姓名',
            key:'name',
            render(rs){
                return (
                    <a className="link" href={`/pc#/student_detail?uuid=${rs.student_uuid}`}>{rs.name}</a>
                )
            }
        },
        {
            title:'类型',
            key:'type',
            render(rs){
                let map={formal:'正式',intentional:'意向',graduated:'毕业'}
                let colors={formal:'#8BD881',intentional:'#DDAD58',graduated:'#999A9E'}
                return (
                <div style={{color:colors[rs.identity]}}>{map[rs.identity]}</div>
                )
            }
        },{
            title:'出生日期',
            key:'birthday',
            render(rs){
                return (
                    <div>{rs.birthday||'-'}</div>
                )
            }
        },{
            title:'年龄',
            key:'age',
            render(rs){
                return (
                    <div>{rs.age||rs.age===0?rs.age+"岁":'-'}</div>
                )
            }
        },{
            title:(
                <div>
                    <span className="mr_3">是否绑定微信号</span>
                    <Tooltip placement="topRight" title={(
                        <div className="fs_12">
                            学员默认联系人是否绑定机构微信公众号
                        </div>
                        )}>
                        <img style={{width:12,height:12,verticalAlign:'text-top'}} src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/3d75055c-6b18-11e9-9a54-00163e04cc20.png"/>
                    </Tooltip>
                </div>
                ),
            key:'gzh_bind',
            render:rs=>(
                <div>{rs.gzh_bind==='YES'?<span >是</span>:<span style={{color:'#999A9E'}}>否</span>}</div>
            )
        },{
            title:'操作',
            key:'edit',
            render(rs){
                return (
                    <div className="fc_err pointer hover_line" onClick={()=>{
                        Modal.confirm({
                            title: '注意',
                            content: `确定要删除学员 [${rs.name}]吗？`,
                            okText: '确定',
                            okType: 'danger',
                            cancelText: '取消',
                            async onOk() {
                                await $.get(`/campusstudent/${rs.student_uuid}/remove`)
                                tab.reload()
                                getCount()
                            },
                          });
                    }}>删除</div>
                )
            }
        }
    ]
    return (
        <div>
            <TablePagination
                ref={ref=>tab=ref}
                columns={columns}
                api="/campusstudent/screen"
                params={{birthday_month:'CURRENT'}}
            />
        </div>
    )
}