import React from 'react';
import { Layout,Icon } from 'antd';
import event from './subscribe'
const { Header } = Layout;

class MainLayout extends React.Component{
  render(){
    return  <Layout>
    <Header className="header">
      <div className="logo" />
      <span>NEBULAS</span>
      <div className="right-menu"><a ><Icon type="save" onClick={() => {event.dispatch("SAVE_CODE")}} /></a></div>
    </Header>
    <Layout>
      {this.props.children}
    </Layout>
  </Layout>
  }
}

export default MainLayout;