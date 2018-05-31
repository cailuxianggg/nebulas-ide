import React from 'react';
import moment from 'moment';
import { Icon } from 'antd';
import { Link } from 'react-router';

const ContractInfo = ({item,hasTime = true}) => {
	const {createTime,key,name,star} = item;
	let date;
	if(createTime){
		date = moment(createTime * 1000).format("YYYY-MM-DD");
	}
	return (
		<div>
			<span className="my-contract" ><Link to={`contract?key=${key}`}>{name}</Link></span>
			{hasTime ? <span className="my-date" >{date}</span> : null}
			<span ><Icon style={{color:'red',margin:'0 5px'}} type="heart-o" />{star}</span>
		</div>)
}

export default ContractInfo;