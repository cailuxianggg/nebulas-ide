import React from 'react';
import { Modal, Input } from 'antd';
import event from '../subscribe'

class StarContract extends React.Component {
  state = { 
  	visible: false
  }
  showModal = () => {
    this.setState({
      visible: true,
      value:(Math.random()/10).toFixed(2)
    });
  }
  handleOk = (e) => {
    let {value} = this.state;
    if(!value){
      value = 0;
    }else{
    	event.dispatch("STAR_CODE",{value})
      this.handleCancel();
    }
  }
  handleCancel = (e) => {
    this.setState({
    	visible:false
    })
  }
  render() {
  	const { value } = this.state;
    return (
    	<a>
     		<a key="star" onClick={this.showModal}>
          <i className="icon iconfont icon-yidiandiantubiao09" />
        </a>
        <Modal
        	key="modal"
          title="赞助作者"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <label style={{color:'red'}}>*</label>
          <Input style={{width:'90%'}} value={value} onChange={(e) => this.setState({value:e.target.value})} placeholder="请输入赞助金额"/>
          <div style={{fontSize:12}}><span>赞助合约作者是为了鼓励合约共享者能分享更多优质合约，系统会随机在生成0～0.1之间的NAS</span></div>
        </Modal>
        </a>
    );
  }
}

export default StarContract;