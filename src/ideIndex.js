import React from 'react';
import {constractList, getSize,contractByStar} from './ideService';
import ContractInfo from './component/contractInfo';

class ConstractInfo extends React.Component{
	state={
		contractList:[],
		size:0,
		hotContract:[]
	}
	constructor(props){
		super(props)
		constractList('',(contractList)=>{
		  this.setState({contractList})
		})
		getSize((size) => {
			this.setState({
				size
			})
		})
		contractByStar((hotContract) =>{
			this.setState({hotContract})
		})

	}
	render(){
		const {contractList,size,hotContract} = this.state;
		const contractOption = contractList.map(item => <ContractInfo key={item.key} item={item} />)
    const hotOption = hotContract.map(item => <ContractInfo key={item.key} item={item} hasTime={false}/>)

		return (
			<div style={{padding: '0 200px',    width: '100%'}}>
				<div className="index-title-parent" >
					<div className="index-title">
						<span>调试</span>
						<span>·</span>
						<span>部署</span>
						<span>·</span>
						<span>分享</span>
					</div>
					<div className="index-sub-title">
						<span>当前在NEBULAS-IDE上共创建了{size}个合约</span>
					</div>
				</div>
				<hr/>
				<div className="contrat-board">
					<div className="board-new">
					<h3>最新合约</h3>
					<div>
						{contractOption}
					</div>
					</div>
					<div className="board-love">
					<h3>最多打赏</h3>
					<div>
						{hotOption}
					</div>
					</div>
				</div>
		</div>)
	}
}

export default ConstractInfo;