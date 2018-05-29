import React from 'react';
import { Input, Icon} from 'antd';

class InvokeItem extends React.Component{
  handleChange = (value,key) => {
    const obj = {};
    obj[key] = value
    this.setState({
      ...obj
    })
  }
  state = {
    data:''
  }
  handleRun = () => {
    const {name,args} = this.props;
    const { data } = this.state;
    const argDatas =  args.map(item => this.state[item] ? this.state[item] : "")
    this.props.handleRun(name,argDatas);
  }
  render(){
    const {name,args} = this.props;
    if(name == "init" || name.substring(0,1) == "_"){
      return null
    }
    return <div style={{lineHeight:'32px',padding:'4px 10px'}}>
      <div style={{background:'#80deea',padding:'0 10px',color:'#fff'}}>
        <span key="title">{name}({args.join(',')})</span>
        <Icon key="icon" className="run-button" onClick={this.handleRun} type="caret-right" />
      </div>
      <div>
        {args ? args.map(arg => <Input key={arg} style={{marginTop:'10px'}} onChange={(e) => this.handleChange(e.target.value,arg)} placeholder={`${arg}`}/>) : null}
      </div>
    </div>
  }
} 

export default InvokeItem