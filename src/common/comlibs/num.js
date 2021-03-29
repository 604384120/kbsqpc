import React from 'react'
import { Button,InputNumber  } from 'antd'

export default function(props){
    let {form,set,name="",value=0,min=0,max=99999,step=0.5,style={width:50}}=props
    return (
        <div>
            <Button className="mr_3" type="primary" onClick={()=>{
                if(form.getFieldValue(name)-step>=min){
                    form.setFieldsValue({[name]:form.getFieldValue(name)-step})
                }
            }}>-</Button>
            {
                set({
                    name,
                    value
                },()=>(
                    <InputNumber style={style} min={min} max={max}/>
                ))
            }
            
            <Button className="ml_3" type="primary" onClick={()=>{
                if(form.getFieldValue(name)+step<=max){
                    form.setFieldsValue({[name]:form.getFieldValue(name)+step})
                }
            }}>+</Button>
        </div>
    )
}
