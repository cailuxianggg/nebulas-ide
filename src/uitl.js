import NebPay from 'nebpay';
import nebulas from 'nebulas';
import {message} from './console';

const Account = nebulas.Account,
      neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

window.nebulas = nebulas;
window.Account = Account;
const address = 'n1mbWnJDWcbfi4pYeeMW5e9CQ5J1HEENQwh';
const testAddress = 'n1WHL6j5RS2ufBrKCDUjBhRAb8YaAjuPbHd';
const testAccount = Account.fromAddress(testAddress);
const fileJson = JSON.parse('{"version":4,"id":"7e447c71-95f4-4d48-baff-e2c006feab53","address":"n1WHL6j5RS2ufBrKCDUjBhRAb8YaAjuPbHd","crypto":{"ciphertext":"87293e269e8dd5ed7252ae3db7c0fba01c48642a22939b4ee5fde8460544420d","cipherparams":{"iv":"a61d8b7923d42c9607cf16bbe0960cfe"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"7299015de265b3256465b3ef464a597ce6e98dc2e54d50cc3edb7825ca4114e9","n":4096,"r":8,"p":1},"mac":"1b3b3669d0d07fc4fd9324491b84cb1d63e73bf19ad04173e3c853e129c0e350","machash":"sha3256"}}');
testAccount.fromKey(fileJson,'clxlovexml')

var nebPay = new NebPay();

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
var intervalQuery

function funcIntervalQuery(serialNumber,cb,count,key) {
  nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
    .then(function (resp) {
      var respObject = JSON.parse(resp)
      if(respObject.msg == 'success'){
        cb(key);
        if(count == 4){
          clearTimeout(intervalQuery)
        }
      }else{
        setTimeout(() => {
          funcIntervalQuery(serialNumber,cb,count++,key);
        },5000)
      }
    })
    .catch(function (err) {
      message.error(err);
    });
}

function callNebulas(callFunction,args,callback){
  var from = Account.NewAccount().getAddressString();
  var value = "0";
  var nonce = "0";
  var gas_price = "1000000";
  var gas_limit = "2000000";
  var contract = {
    "function": callFunction,
    "args":args
  };
  neb.api.call(from,address,value,nonce,gas_price,gas_limit,contract).then(function ({result}) {
    notify(result)
    callback(JSON.parse(result))
  }).catch(function (err) {
    message.error(err.message);
    console.log("error:" + err.message)
  })
}

export const callDeploy = (source) => {
  var from = testAddress;
  neb.api.call({
    from: from,
    to: from,
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
export const innerCall = (name,args,toAddr,callback) => {
  const params = {};
  params.from = testAccount.getAddressString();
  params.to = toAddr;
  params.gasLimit = "2000000"
  params.gasPrice = "1000000"
  params.value = "0";
  params.contract = {
      "function": name,
      "args": JSON.stringify(args)
  };
  neb.api.getAccountState(params.from).then((resp) => {
      // var balance = nebulas.Unit.fromBasic(resp.balance, "nas");
      params.nonce = parseInt(resp.nonce) + 1;
      neb.api._sendRequest("post", "/call", params,(a) => {
        console.log(a)
      })
      // neb.api.call(params)
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
export const innerDeploy = (code,chainID,callback) => {
  let params = {};
  params.from = testAddress;
  params.to = params.from;

  params.gasLimit = 20000000;
  params.gasPrice = 1000000
  params.value = 5;
  params.contract = {
      "source": code,
      "sourceType": "js",
      "args": ""
  };


  // prepare nonce
  neb.api.getAccountState(params.from)
      .then(function (resp) {
        const nonce = parseInt(resp.nonce) + 1;
        var gTx = new nebulas.Transaction({chainID,...params,from:testAccount,nonce});
        gTx.signTransaction();
        neb.api.sendRawTransaction(gTx.toProtoString())
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