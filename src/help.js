import React from 'react';

const Help = () => {
	return <div style={{width:'70%',margin:'0 auto'}}>
		<h2 style={{marginTop: 40}}>NEBULAS-IDE 使用帮助</h2>
		<hr style={{    marginBottom: 20}}/>
		<div style={{display:'flex'}}>
			<div style={{flexGrow:1,    marginRight: 20}}>
			<div>
			<span>NEBULAS-IDE 是一个基于星云链的智能合约调试，部署，分享平台。基于合约的开放性，平台鼓励开发者在上面分享自己的合约，分享的合约支持接受用户的赞助。
		同时用户可以在平台上对合约进行编辑。测试，部署，有任何问题或建议，欢迎通过以下方式联系我们
			</span>
			<li>527268657@qq.com</li>
			<li><a href="https://github.com/cailuxianggg/nebulas-ide">https://github.com/cailuxianggg/nebulas-ide</a></li>
			<span style={{fontSize:12}}>
				声明：星云链测试网测试部署时，我们内置了一个有测试币的钱包，避免用户经常上传钱包文件产生困扰。但是主网发布时，需要用户自己选择钱包部署
			</span>
		</div>
		<h2 style={{marginTop:20}}>基本用法</h2>
		<div>
			<span>NEBULAS-IDE只有保存编辑合约信息和点赞打赏时需要依赖钱包转账调用星云链，目前支持浏览器插件和APP的方式调用</span>
			<h3 style={{marginTop:10}}>浏览器插件</h3>
			<li>
			<span>下载安装星云链钱包插件<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>进入项目主页，下载zip压缩包。解压。</span>
			</li>
			<li><span>chrome浏览器地址栏输入 chrome://extensions/ 进入到浏览器扩展程序管理页面。</span></li>
			<li><span>点击 加载已解压到扩展程序 ，然后选择第2步下载解压的文件夹。</span></li>
			<h3 style={{marginTop:10}}>APP(<span style={{color:'red'}}>推荐</span>)</h3>
			<li>
				<span>下载<a href="https://nano.nebulas.io/index_cn.html">NASAPP</a></span>
			</li>
			<li>
				<span>导入钱包</span>
			</li>
			<li>
				<span>通过扫码确认即可</span>
			</li>
		</div>
		<h2 style={{marginTop:20}}>TODO</h2>
		<div style={{marginBottom:40}}>
			<li>合约部署历史</li>
			<li>搜索合约</li>
			<li>体验优化</li>
		</div>
		</div>
		<div>
			<h5><span style={{color: 'red'}}>如果觉得赞的话，赏杯星爸爸吧~~~</span></h5>
			<img width="200px" src="http://www.nebulas-ide.com/images/qrcode.jpg" />
		</div>
		</div>
	</div>
}

export default Help;