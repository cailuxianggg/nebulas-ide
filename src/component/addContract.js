import React from 'react';
import { Modal, notification, Input } from 'antd';
import event from '../subscribe'

class AddContract extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    const {name} = this.state;
    if(!name){
      notification.error({
        message: '错误',
        description: '合约名称必须填写',
      })
    }else{
      event.dispatch("SAVE_CODE",{name});
      this.props.onClose();
    }
  }
  handleCancel = (e) => {
    console.log(e);
    this.props.onClose()
  }
  render() {
    return (
      <div>
        <Modal
          title="保存合约"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <label style={{color:'red'}}>*</label>
          <Input style={{width:'90%'}} onChange={(e) => this.setState({name:e.target.value})} placeholder="请输入合约名称"/>
        </Modal>
      </div>
    );
  }
}

export default AddContract;