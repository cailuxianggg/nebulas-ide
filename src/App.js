import React from 'react';
import { Layout } from 'antd';
import MainLayout from './layout';
import {callDeploy,innerDeploy} from './uitl';
import { Tabs } from 'antd';
import $ from 'jquery';
import { parseContract } from './parse';
import InvokeList from './invokeList';
import TestForm from './testForm';
import { Console } from './console';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'code-mirror-themes/themes/monokai-sublime.css';
import event from './subscribe';
import {addConstract} from './ideService';
require('codemirror/mode/javascript/javascript');



const { Content, Sider, Footer } = Layout;
const TabPane = Tabs.TabPane;
class App extends React.Component {
  constructor(props) {
    super(props);
    event.subscribe("SAVE_CODE",() => {
      const {code,contractAddress,txhash } = this.state;
      addConstract({code,contractAddress,txhash},(d) => {
        console.log(d)
      })
    })
    this.state = {
      code: `const SmartConstarct = function(text){
        if(text){
         //const obj = JSON.parse(text);
         const obj = text;
         this.code = obj.code;
         this.constractAddress = obj.constractAddress;
         this.txhash = obj.txhash;
        }else{
         throw new Error("text is empty");
        }
       }
       
       const Constract = function(){
        LocalContractStorage.defineMapProperty(this, "constractKey");//合约key索引
        LocalContractStorage.defineMapProperty(this, "constractMap");//合约数据
        LocalContractStorage.defineMapProperty(this, "constractStar");//合约获得的赞
        LocalContractStorage.defineProperty(this, "size");//总数据长度
       }
       Constract.prototype = {
        init: function(){
         this.size = 0;
        },
        addConstarct: function(key,text) {
         key = key.trim();
         text = text.trim();
         if (key === "" || text === "") {
          throw new Error("empty key / text");
         }
         var from = Blockchain.transaction.from;
         var constractInfo = this.constractMap.get(key);
         if (constractInfo) {
          throw new Error("value has been occupied");
         }
           constractInfo = new SmartConstarct(text);
           constractInfo.from = from;
           var index = this.size;    
           this.constractKey.set(index,key);
           this.constractMap.set(key, constractInfo);
           this.constractStar.set(key,0);
           this.size = index + 1;
           return this.size
        },
        _isBlank: function(str) {
         if(!str) return true;
         if(str.trim().length == 0) return true;
         return false;
        },
        starConstract: function(key) {
         if(this._isBlank(key)){
          throw new Error("empty key");
         }
         const star = this.constractStar.get(key) + 1;
         this.constractInfo.set(key,star);
         return star;
        },
        constractList: function(mine) {
         if(this._isBlank(mine)){
          mine = false;
         }else{
          mine = true;
         }
         const list = [],
         size = this.size,
         from = Blockchain.transaction.from;
         for(var i = size - 1;i >= 0;i--){
          const key = this.constractKey.get(i);
          const object = this.constractMap.get(key);
          if(mine){
           if(object.from == from){
            list.push(object)  
           }
          }else{
           list.push(object) 
          }
         }
         return {list,size}
        }
       }
       
       module.exports = Constract;`
    }
  }
  onChange = (newValue, e) => {
    this.setState({
      code:newValue
    })
  }
  test = () => {
    callDeploy(this.state.code);
  }
  deploy = () => {
    innerDeploy(this.state.code,1001,(a) => {
      if(a.contract_address){
        parseContract(this.state.code,(info) => {
          this.setState({ info });
        });
        this.setState({
          contractAddress:a.contract_address,
          txhash:a.txhash
        })
      }
    });
  }
  render() {
    const {code,height, info, contractAddress,txhash } = this.state;
    var options = {
      lineNumbers: true,
      mode: 'javascript',
      theme:'monokai-sublime',
      tabSize:2
    };
    return (
      <MainLayout>
        <Layout className="code-area">
        <Content id="code-node" style={{ background: '#fff',height,position:'absolute',top:0,left:0,width:'100%',bottom:100, margin: 0 }}>
          <CodeMirror defaultValue={code} onChange={this.onChange} options={options} />
        </Content>
        <Footer id="console" className="console-footer">
          <Console />
        </Footer>
      </Layout>
      <Sider width="400" className="code-controller">
        <div style={{width:'100%',textAlign:'center'}}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="测试" key="1">
              <TestForm 
                contractAddress={contractAddress} 
                txhash={txhash} 
                onTest={this.test} 
                onDeploy={this.deploy}
                info={info}/>
            </TabPane>
            <TabPane tab="查看合约" key="3">查看合约</TabPane>
          </Tabs>
          </div>
      </Sider>
      </MainLayout>
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
export default App;