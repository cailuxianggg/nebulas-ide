import React from 'react';
import { Select,Upload } from 'antd';
import { testAddress as defaultAddress} from './util';

const Option = Select.Option;
class SelectAccount extends React.Component{
	state = {
    accounts:[defaultAddress],
    currentAccount:defaultAddress
  }
	selectAccount = (value) => {
    if(this.props.onChange){
    	this.props.onChange(value)
    }
  }
  handleAccountChange = ({file}) => {
    if(file){
      const fr = new FileReader();
      fr.readAsText(file.originFileObj);
      fr.onload = (e) => {
        const jsonFile = JSON.parse(e.currentTarget.result);
        const accounts = [defaultAddress];
        const currentAccount = jsonFile.address;
        accounts.push(currentAccount);
        if(this.props.onChange){
        	this.props.onChange(currentAccount);
        }
        if(this.props.onFileChange){
        	this.props.onFileChange(jsonFile);
        }
        this.setState({accounts})
      }
    }
  }
	render(){
		let { accounts } = this.state;
		const { value, netType } = this.props;
		if(netType === "1"){
      accounts = accounts.filter(item => {
        if(item === defaultAddress){
          return false;
        }
        return true;
      })
    }
		const accountOptions = accounts.map( account => <Option key={account}>{account}</Option>)
		return (
			<div style={{position:'relative'}}>
				<Select defaultValue={defaultAddress} value={value} size="small" onChange={this.selectAccount} style={{width:'100%',paddingRight:25}}>
					{accountOptions}
	      </Select>
	      <Upload 
	        onChange={this.handleAccountChange}
	        customRequest={() => {}} 
					showUploadList={false}
					style={{position:'absolute',right:10,width:10,top:0,cursor:'pointer',lineHeight:'38px'}}>+</Upload>
				</div>
				)
	}
}
export default SelectAccount;