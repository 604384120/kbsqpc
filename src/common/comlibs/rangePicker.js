import React from 'react'
import { DatePicker } from 'antd';

export default class DateRange extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
      console.log(open)
    this.setState({ endOpen: open });
  };

  render() {
    let {value=[null,null],style={},placeholder=['',''],format=['YYYY-MM-DD','YYYY-MM-DD'],showTime=false}=this.props
    const { startValue=value[0], endValue=value[1], endOpen } = this.state;
    
    return (
      <div style={style}>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime={showTime}
          className="mr_15"
          format={format[0]}
          value={startValue}
          placeholder={placeholder[0]}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime={showTime}
          format={format[1]}
          value={endValue}
          placeholder={placeholder[1]}
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}