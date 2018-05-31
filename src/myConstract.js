import React from 'react';
import {constractList, getMyStarContract} from './ideService';
import { Row,Col } from 'antd';

import ContractInfo from './component/contractInfo';

class ConstractInfo extends React.Component{
	state = {
		contractList:[],
		starContractList:[]
	}
	constructor(props){
		super(props)
		constractList('mine',(contractList)=>{
		  this.setState({contractList})
		})
		getMyStarContract((starContractList) => {
			this.setState({
				starContractList
			})
		})
	}
	render(){
		const { contractList,starContractList } = this.state;
		const mineCount = contractList.length;
		const options = contractList.map(item => <ContractInfo key={item.key} item={item} />)
		const starOptions = starContractList.map(item => <ContractInfo key={item.key} item={item} />)
		return <Row  style={{margin:'0 auto',width:'70%',marginTop:40}}>
			<Col span={12} key="mine">
				<h3>我的合约{mineCount === 0 ? null : <span>({mineCount})</span>}</h3>
				{options.length === 0 ? "暂时没有合约~~~" : options}
			</Col>
	  	<Col span={12} key="love">
	  		<h3>我喜欢的合约</h3>
	  		{starOptions.length === 0 ? "暂时没有喜欢合约~~~" : starOptions}
	  	</Col>
		</Row>
	}
}

export default ConstractInfo;