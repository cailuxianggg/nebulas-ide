import React from 'react';
import InvokeItem from './invokeItem';
import { innerCall } from './util';

const InvokeList = ({ info, contractAddress }) => {
    const handleRun = (name,argData) => {
      innerCall(name,argData,contractAddress,(data) => {
        console.log(data);
      })
    }
    if(!info) {
      return null;
    }
    if(!contractAddress){
      return <div>无法找到合约地址，请先部署之后再进行调用</div>
    }
    const options = info.map((item) => {
      if(item.name === "init" || item.name.substring(0,1) === "_"){
        return null
      }
      return <InvokeItem {...item} handleRun={handleRun}/>
    })
    return <div>
      {options}
    </div>
}

export default InvokeList;