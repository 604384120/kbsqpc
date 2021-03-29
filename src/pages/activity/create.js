import React from "react";
import { Tabs, Tag, Divider } from "antd";
import "./index.css";
const { CheckableTag } = Tag;
class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityType: [
        "全部",
        "拼团",
        "砍价",
        "报名",
        "阶梯拼团",
        "集赞",
        "抽奖",
        "投票",
      ],
      templateType: [
        "全部",
        "推荐",
        "节假日",
        "春季班",
        "阶梯拼团",
        "集赞",
        "抽奖",
        "投票",
      ],
      selectedActivity: "全部",
      selectedTemlate: "全部",
    };
  }
  tagChage(item, type) {
    if (type == "activity") {
      this.setState({
        selectedActivity: item,
      });
    } else {
      this.setState({
        selectedTemlate: item,
      });
    }
  }
  render() {
    return (
      <div>
        <div>
          <span>类型：</span>
          {this.state.activityType.map((item) => {
            return (
              <CheckableTag
                key={item}
                checked={this.state.selectedActivity === item}
                className="fs_14 br_4 lh_22 ta_c pointer"
                style={{ minWidth: 44 }}
                onChange={this.tagChage.bind(this, item, "activity")}
              >
                {item}
              </CheckableTag>
            );
          })}
        </div>
        <Divider dashed style={{ margin: "10px 0" }} />
        <div>
          <span>类型：</span>
          {this.state.templateType.map((item) => {
            return (
              <CheckableTag
                key={item}
                checked={this.state.selectedTemlate === item}
                className="fs_14 br_4 lh_22 ta_c pointer"
                style={{ minWidth: 44 }}
                onChange={this.tagChage.bind(this, item, "templateType")}
              >
                {item}
              </CheckableTag>
            );
          })}
        </div>
        <div className="createList">
          <div>
            <div className="cLi_img">
              <img src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/92525c74-2588-11eb-a80f-00163e04cc20.jpeg" />
            </div>
            <div>夏令营体验生活</div>
            <button>立即创建</button>
          </div>
        </div>
      </div>
    );
  }
}
export default Create;
