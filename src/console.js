import React from 'react';
import ReactDOM from 'react-dom';

const Info = ({msg})=>{
  return <div style={{color:'#fff'}}><span style={{paddingRight:5}}>INFO:</span><span >{msg}</span></div>
}
const Error = ({msg})=>{
  return <div style={{color:'red'}}><span style={{paddingRight:5}}>ERROR:</span><span >{msg}</span></div>
}
let message;
class Console extends React.Component{
  state={
    msg:[]
  }
  constructor(props){
    super(props)
    message = this;
  }
  info = (m) => {
    const {msg} = this.state;
    msg.push(<Info msg={m} />)
    this.setState({msg})
  }
  error = (m) => {
    const {msg} = this.state;
    msg.push(<Error msg={m} />)
    this.setState({msg})
  }
  render(){
    return <div>{this.state.msg}</div>
  }
}


export { Console,message }
