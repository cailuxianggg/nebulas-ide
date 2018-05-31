import React from 'react';
import { Layout, notification } from 'antd';
import {callDeploy,innerDeploy, searchContract} from './util';
import { Tabs } from 'antd';
import $ from 'jquery';
import { parseContract } from './parse';
import TestForm from './testForm';
import { Console } from './console';
// import ContractEditor from './component/contractEditor';
// import CodeMirror from 'react-codemirror';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'code-mirror-themes/themes/coda.css';
import event from './subscribe';
import {addConstract,getContract, starContract,updateContract} from './ideService';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint';
import "codemirror/addon/hint/show-hint.css";


const defaultCode = `const SimpleContract = function(){
  LocalContractStorage.defineMapProperty(this, "simpleData");     
}
SimpleContract.prototype = {
 init:function(){
 },
 get:function(key){
  return this.simpleData.get(key)
 },
 set:function(key,value){
   this.simpleData.set(key,value);
 }
}
module.exports = SimpleContract;`;
const { Content, Sider, Footer } = Layout;
const TabPane = Tabs.TabPane;
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    const {query} = props.location;
    let dCode = defaultCode,render = true
    if(query && query.key){
      dCode = '';
      render = false;
      getContract(query.key,({code,txhash,from,star,chainId}) => {
        if(code){
          this.setState({code,from,star,uuid:query.key,render:true})
        }else{
          searchContract(txhash,(code) => {
            const data = JSON.parse(code);
            // this.refs.editor.codeMirror.setValue(data.Source);
            this.setState({code:data.Source,uuid:query.key,from,star,render:true})
          },chainId)
        }
        if(from === window.account){
          event.dispatch("CHANGE_OPERATE",{operate:['add','save','help','user']})
        }else{
          event.dispatch("CHANGE_OPERATE",{operate:['add','star','help','user']})  
        }
      })
    }else{
      event.dispatch("CHANGE_OPERATE",{operate:['add','save','help','user']})
    }
    this.state = {
      code: dCode,
      render
    }
    event.subscribe("SAVE_CODE",({name}) => {
      let {code,contractAddress,txhash } = this.state;
      if(contractAddress){
        code = undefined
      }
      if(query && query.key){
        updateContract({key:query.key,code,contractAddress,txhash},(d) => {
           notification.success({
            message: '更新成功',
            description: '合约更新成功',
          });
        })
      }else{
        addConstract({code,contractAddress,txhash,name},(d) => {
          notification.success({
            message: '保存成功',
            description: '合约保存成功',
          });
        })
      }
    })
    event.subscribe("STAR_CODE",({value}) => {
      starContract(value,this.state.uuid,() => {
        notification.success({
            message: '成功',
            description: '赞助成功',
          });
      })
    })
  }
  onChange = (editor, data, value) => {
    this.setState({
      code:value
    },() => {
      // editor.showHint();
    })
  }
  test = (address,netType) => {
    callDeploy(this.state.code,address,netType);
  }
  deploy = (account,current,netType) => {
    innerDeploy(this.state.code,parseInt(netType,10),(a) => {
      if(a.contract_address){
        parseContract(this.state.code,(info) => {
          this.setState({ info });
        });
        this.setState({
          contractAddress:a.contract_address,
          txhash:a.txhash
        })
      }
    },account,netType);
  }
  componentWillReceiveProps(nextProps){
    // const {query} = nextProps.location;
    // if(query.key){
    //   //this.setState({uuid:query.key})
    // }else{
    //   // this.refs.editor.codeMirror.setValue(defaultCode);
    //   this.setState({
    //     code:defaultCode
    //   })
    // }
  }
  render() {
    const {code,height, info, contractAddress,txhash, from, uuid,render } = this.state;
    if(!render){
      return null;
    }
    var options = {
      lineNumbers: true,
      mode: 'javascript',
      theme:'coda',
      extraKeys: {"Ctrl": "autocomplete"}
    };
    let canEditor = false,width = 0,bottom = 0;
    if(!uuid || from === window.account){
      canEditor = true;
      width = 300;
      bottom = 100;
    }
    return (
      <div>
        <Layout className="code-area" style={{right:width}}>
        <Content id="code-node" style={{ background: '#fff',height,position:'absolute',top:0,left:0,width:'100%',bottom:bottom, margin: 0 }}>
          <CodeMirror autoCursor={false} value={code} onChange={this.onChange} options={options} />
        </Content>
        {
          canEditor ? 
          <Footer id="console" className="console-footer">
            <Console />
          </Footer>
          :null
        }
      </Layout>
      <Sider width={width} className="code-controller">
        <div style={{width:'100%',textAlign:'center',height:'100%'}}>
          {canEditor ? 
            <Tabs defaultActiveKey="1" style={{height:'100%'}}>
              <TabPane tab="部署" key="1">
                <TestForm 
                  contractAddress={contractAddress} 
                  txhash={txhash} 
                  onTest={this.test} 
                  onDeploy={this.deploy}
                  info={info}/>
              </TabPane>
              <TabPane tab="历史" key="2">合约历史</TabPane>
            </Tabs>
            : null}
          </div>
      </Sider>
      </div>
    );
  }
  componentDidMount(){
    queryHeight(this);
  }
}

function queryHeight(component){
  setTimeout(()=>{
    const height = $('#code-node').height();
    if(height){
      $(".CodeMirror").css("height",height)
    }else{
      queryHeight(component)
    }
  },0)
}
class App extends React.Component{
  render(){
    const props = this.props;
    return <CodeEditor {...props}/>
  }
}
export default App;