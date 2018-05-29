import React from 'react';
import {  Row, Col, Select, Button } from 'antd';
import InvokeList from './invokeList';

const Option = Select.Option;
class TestForm extends React.Component{
  render() {
    const { contractAddress, info } = this.props;
    return <div>
      <div>
      <Row className="form-row">
        <Col className="form-left" span={6}> <label>环境:</label></Col>
        <Col className="form-right" span={18} >
        <Select defaultValue="1001">
                <Select.Option value="1001">测试网</Select.Option>
                <Select.Option value="1">主网</Select.Option>
              </Select>
        </Col>
      </Row>
        </div>
        <div className="button-test">
          <Button onClick={this.props.onTest} type="primary">测试</Button>
          <Button onClick={this.props.onDeploy} type="primary">部署</Button>
        </div>
        {contractAddress ? <div style={{padding: '10px 0px'}}>
          <span style={{fontSize: 12,background: '#c0c0c0',padding: '5px'}}>{contractAddress}</span>
        </div>: null}
       <div>
        <InvokeList contractAddress={contractAddress} key={contractAddress} info={info}/>
       </div>
             
    </div>
  }
}

export default TestForm;