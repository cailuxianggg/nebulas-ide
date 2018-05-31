import React from 'react';
import {  Row, Col, Select, Button, Input, Form, notification } from 'antd';
import InvokeList from './invokeList';
import { testAddress as defaultAddress, fromAddress, getBalance } from './util';
import SelectAccount from './selectAccount';
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    style:{
      paddingRight:15
    }
  },
};
class TestForm extends React.Component{
  state = {
    accountAddress:''
  }
  unlockAccount = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { password,account,netType } = values;
        const { jsonFile } = this.state;
        try{
          const accountAddress = fromAddress(account);
          accountAddress.fromKey(jsonFile, password);
          getBalance(account,netType).then((balance) => {
            console.log(balance) 
            this.setState({
              balance,
              accountAddress
            })
          }).catch(function (e) {
            console.error(e);
          })
        }catch(e){
          console.error(e);
          notification.error({
            message: '解锁失败',
            description: '密码错误',
          });
        }
        
      }
    });
  }
  veladateLock = (accountAddress,currentAccount) => {
    if(currentAccount === defaultAddress){
      return true;
    }else{
      if(!accountAddress){
        notification.error({
            message: '钱包未解锁',
            description: '钱包未解锁，请先解锁钱包',
          });
        return false;
      }
      return true
    }
  }
  test = () => {
    const {accountAddress} = this.state;
    const { getFieldValue } = this.props.form;
    const currentAccount = getFieldValue('account')
    const netType = getFieldValue('netType')
    if(this.veladateLock(accountAddress,currentAccount)){
      this.props.onTest(currentAccount,netType);
    }
  }
  deploy = () => {
    const {accountAddress} = this.state;
    const { getFieldValue } = this.props.form;
    const currentAccount = getFieldValue('account')
    const netType = getFieldValue('netType')
    if(this.veladateLock(accountAddress,currentAccount)){
      this.props.onDeploy(accountAddress,currentAccount,netType);
    }
  }
  renderPassword = () => {
    const { getFieldValue } = this.props.form;
    const {balance} = this.state;
    const currentAccount = getFieldValue('account')
    if(currentAccount === defaultAddress){
      return null;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
      <FormItem
          label="密码:"
          {...formItemLayout}
        >
          {getFieldDecorator('password',{
             rules: [{ required: true, message: '请输入密码解锁' }],
          })(
            <Input 
            size="small" 
            type="password"
            style={{paddingRight:15}}
            placeholder="请输入钱包密码(解密过程是在前端处理的，平台不会保存用户密码)"/>
          )}
        </FormItem>
        { balance ? <FormItem label="余额" {...formItemLayout}>
          <Input value={this.state.balance} disabled/>
        </FormItem> : null}
      <Row className="form-row" key="unlock">
      <Col className="form-left" span={6}></Col>
        <Col className="form-right" span={18} style={{paddingRight:15}}>
        <Button style={{width:'100%'}} onClick={this.unlockAccount} type="primary">解锁</Button>
        </Col>
        </Row></div>)
  }
  render() {
    let { contractAddress, info } = this.props;
    const { getFieldDecorator,getFieldValue } = this.props.form;
    const netType = getFieldValue("netType")
    return <div className="test-form">
      <Form >
        <FormItem
          label="环境"
          {...formItemLayout}
        >
          {getFieldDecorator('netType',{
            initialValue:'1001'
          })(
            <Select size="small" style={{width:'100%'}}>
              <Option value="1001">TESTNET</Option>
              <Option value="1">MAINNET</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          label="钱包"
          {...formItemLayout}
        >
          {getFieldDecorator('account',{
            initialValue:netType !=="1" ? defaultAddress : ""
          })(
            <SelectAccount netType={netType} onFileChange={(jsonFile) => this.setState({jsonFile})} />
          )}
        </FormItem>
      {this.renderPassword()}
      <FormItem colon={false} label=" " {...formItemLayout}>
        <div className="button-test">
          <Button onClick={this.test} type="primary">测试</Button>
          <Button onClick={this.deploy} type="primary">部署</Button>  
        </div>
      </FormItem>
        {contractAddress ? <div style={{padding: '10px 0px',textAlign: 'left',paddingLeft: 20}}>
          <div>合约地址:</div>
          <span style={{fontSize: 12,background: '#e9ecef',padding: '5px'}}>{contractAddress}</span>
        </div>: null}
        </Form>
       <div>
        <InvokeList contractAddress={contractAddress} key={contractAddress} info={info}/>
       </div>
    </div>
  }
}

export default Form.create()(TestForm);