import React from 'react';
import { Layout } from 'antd';
import { 
  Link
} from 'react-router';
import AddContractModal from './component/addContract';
import StarContractModal from './component/starContract';
import logo from './assign/NebulasLogoIcon.svg'
import event from './subscribe'
const { Header } = Layout;


const defaultOperation = ['add','help','user']

class MainLayout extends React.Component{
  state = {
    visible:false,
    showOperation:defaultOperation,
    operater:{
      "save": () => (<a key="save">
                <i className="icon iconfont icon-baocun1" onClick={this.handleSave} />
                <AddContractModal visible={this.state.visible} onClose={() => this.setState({visible:false})}/>
              </a>),
      "add":  () => (
                <Link key="add" to="contract"><i className="icon iconfont icon-add" /><span style={{fontSize:12}}>新建合约</span></Link>
              ),
      "help": () => (<Link to="help" key="help">
                <i className="icon iconfont icon-questionsign" />
              </Link>),
      "user": () => (<Link key="user" to="mine" >
                <i className="icon iconfont icon-icon-user-img" />
                </Link>
              ),
      "star": () => (<StarContractModal />)
    }
  }
  handleSave = () => {
    const {location} = this.props;
    if(location && location.query && location.query.key){
      event.dispatch("SAVE_CODE",{});
    }else{
      this.setState({visible:true})
    }
  }
  constructor(props) {
    super(props);
    event.subscribe("CHANGE_OPERATE",({operate}) => {
      this.setState({
        showOperation:operate
      })
    })
  }
  render(){
    const {showOperation,operater} = this.state;
    const operate = showOperation.map(o => operater[o]())
    return  <Layout>
    <Header className="header">
      <div className="logo" />
      <Link to="/">
        <img width="40px" src={logo} alt="" />
        <span style={{display:'inline-block',verticalAlign:'middle'}}>NEBULAS-IDE</span>
      </Link>
      <div className="right-menu">
        {operate} 
      </div>
    </Header>
    <Layout>
      {this.props.children}
    </Layout>
  </Layout>
  }
}

export default MainLayout;