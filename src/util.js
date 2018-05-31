import nebulas from 'nebulas';
import {message} from './console';
import { notification } from 'antd';

const Account = nebulas.Account,
      neb = new nebulas.Neb(),
      mainNeb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
mainNeb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

const testAddress = 'n1WHL6j5RS2ufBrKCDUjBhRAb8YaAjuPbHd';
const testAccount = Account.fromAddress(testAddress);
const fileJson = JSON.parse('{"version":4,"id":"7e447c71-95f4-4d48-baff-e2c006feab53","address":"n1WHL6j5RS2ufBrKCDUjBhRAb8YaAjuPbHd","crypto":{"ciphertext":"87293e269e8dd5ed7252ae3db7c0fba01c48642a22939b4ee5fde8460544420d","cipherparams":{"iv":"a61d8b7923d42c9607cf16bbe0960cfe"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"7299015de265b3256465b3ef464a597ce6e98dc2e54d50cc3edb7825ca4114e9","n":4096,"r":8,"p":1},"mac":"1b3b3669d0d07fc4fd9324491b84cb1d63e73bf19ad04173e3c853e129c0e350","machash":"sha3256"}}');
testAccount.fromKey(fileJson,'clxlovexml')

const notify = (resp) => {
  if(resp.execute_err){
    message.error(resp.execute_err);
  }else{
    for(const info in resp){
      if(resp[info]){
        message.info(`${info}:${resp[info]}`);
      }
    }
  }
}

function getNeb(netType){
  if(netType && netType === "1"){
    return mainNeb;
  }
  return neb;
}

export const callDeploy = (source,accountAddress,netType) => {
  if(!accountAddress){
    accountAddress = testAddress;
  }
  
  getNeb(netType).api.call({
    from: accountAddress,
    to: accountAddress,
    value: "0",
    nonce: "12",
    gasPrice: "1000000",
    gasLimit: "2000000",
    contract: {
      "source": source,
      "sourceType": "js",
      "args": ""
    }
  }).then(function (resp) {
      notify(resp)
  }).catch(function (err) {
    console.error(err.message);
     message.error(err.message);
  });
}
export const innerCall = (name,args,toAddr,callback,account,netType) => {
  const params = {};
  if(account){
    params.from = account.getAddressString();
  }else{
    params.from = testAccount.getAddressString();
  }
  params.to = toAddr;
  params.gasLimit = "2000000"
  params.gasPrice = "1000000"
  params.value = "0";
  params.contract = {
      "function": name,
      "args": JSON.stringify(args)
  };
  getNeb(netType).api.getAccountState(params.from).then((resp) => {
      // var balance = nebulas.Unit.fromBasic(resp.balance, "nas");
      params.nonce = parseInt(resp.nonce,10) + 1;
      // neb.api._sendRequest("post", "/call", params,(a) => {
      //   console.log(a)
      // })
      getNeb(netType).api.call(params)
      .then(function (resp) {
        if(resp.execute_err){
          message.error(resp.execute_err);
        }else{
          callback(params);
          // message.info(JSON.stringify(params))
          message.info("success")
        }
      })
      .catch(function (err) {
        console.error(err);
        message.error(err.message)
      });
  }).catch(function (err) {
     console.log(err)
  });
}
export const innerDeploy = (code,chainID,callback,account,netType) => {
  let params = {};
  if(account){
    params.from = account.getAddressString();
  }else{
    params.from = testAddress;  
  }
  params.to = params.from;

  params.gasLimit = 20000000;
  params.gasPrice = 1000000
  params.value = 5;
  params.contract = {
      "source": code,
      "sourceType": "js",
      "args": ""
  };

  const currentAccount = account || testAccount
  // prepare nonce
  getNeb(netType).api.getAccountState(params.from)
      .then(function (resp) {
        const nonce = parseInt(resp.nonce,10) + 1;
        var gTx = new nebulas.Transaction({chainID,...params,from:currentAccount,nonce});
        gTx.signTransaction();
        getNeb(netType).api.sendRawTransaction(gTx.toProtoString())
          .then(function (resp) {
             callback(resp)
             notify(resp)
          })
          .catch(function (err) {
             console.error(err)
             message.error(err.message);
          });    
      })
      .catch(function (err) {
          console.error(err)
          message.error(err.message);
      });
}

export const fromAddress = (address) => {
  return Account.fromAddress(address)
}
export const getBalance = (fromAddr,netType) => {
  return getNeb(netType).api.gasPrice().then((resp) => {
    return getNeb(netType).api.getAccountState(fromAddr);
  }).then((resp) => {
    return nebulas.Unit.fromBasic(resp.balance, "nas");
  });
}

export const searchContract = (txhash,cb,netType) => {
  if(!txhash || txhash.length !== 64){
    notification.error({
            message: '错误',
            description: '非法的交易hash',
          });
  }
  getNeb(netType).api.getTransactionReceipt(txhash).then((resp) => {
    if (!resp.contract_address || resp.contract_address === "") {
      notification.error({
            message: '错误',
            description: '合约没找到',
          });
    } else {
      if (resp.data) {
        const data = window.atob(resp.data);
        cb(data)
      }
    }
  })
}

export {
  testAddress
}