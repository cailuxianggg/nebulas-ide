import NebPay from 'nebpay';
import nebulas from 'nebulas';
import uuid from 'uuid';


const Account = nebulas.Account,
      neb = new nebulas.Neb();
// neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

var nebPay = new NebPay();
let intervalQuery
const address = "n1vEZJQyRXWDaCLeNvSZ3rEeamYyRkaVVb7";
// const hash = "f9cf7bb0a4b4e971904bfa500164138812eaad9c50e80f618f811903130bad35";
function funcIntervalQuery(serialNumber,cb,count) {
  let index = ++count;
   nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
     .then(function (resp) {
       var respObject = JSON.parse(resp)
       if(respObject.msg === 'success' && respObject.code === 0 && respObject.data.status === 1){
         cb(resp);
         clearTimeout(intervalQuery)
       }else{
        if(index === 3){
         //cb(resp);
          clearTimeout(intervalQuery)
          return
        }
        setTimeout(() => {
          funcIntervalQuery(serialNumber,cb,index);
        },7000) 
      }
    });
   } 

export const addConstract = (params,callback) => {
  params.key = uuid();
  const options = {
    qrcode: {
      showQRCode: true
    },
    listener:(a) => {
      console.log(11,a)
    }
  }
  const serialNumber = nebPay.call(address,0,"addContarct",JSON.stringify([params.key,JSON.stringify(params)]),options)
  intervalQuery = setTimeout(() => {
    funcIntervalQuery(serialNumber,callback,0)
  },5000);
}
export const updateContract = ({key,contractAddress,txhash},callback) => {
  const options = {
    qrcode: {
      showQRCode: true
    }
  }
  const serialNumber = nebPay.call(address,0,"updateContract",JSON.stringify([key,contractAddress,txhash]),options)
  intervalQuery = setTimeout(() => {
    funcIntervalQuery(serialNumber,callback,0)
  },5000);
}

export const constractList = (mine,cb) => {
  getWalletInfo((account) => {
    requestNebApi("contractList",JSON.stringify([mine]),cb,account);  
  })
  
 }

export const getStar = (key,cb) => {
  requestNebApi("getStar",JSON.stringify([key]),cb);
}
export const getContract = (key,cb) => {
  requestNebApi("getContract",JSON.stringify([key]),cb);
}
export const getSize = (cb) => {
  requestNebApi("getSize",'[""]',cb);
}
export const contractByStar=(cb) => {
  requestNebApi("contractByStar",'[""]',cb);
}
export const getMyStarContract = (cb) => {
  getWalletInfo((account) => {
    requestNebApi("getMyStarContract",'[""]',cb,account);  
  })
}
export const starContract=(value,key,cb) => {
  const options = {
    qrcode: {
      showQRCode: true,

    }
  }
  const serialNumber = nebPay.call(address,value,"starContract",JSON.stringify([key]),options)
  intervalQuery = setTimeout(() => {
    funcIntervalQuery(serialNumber,cb,0)
  },5000);
}
export const getCurrentAccount = (cb) => {
  getWalletInfo(cb)
}

function requestNebApi(callFunction,args,cb,account){
  var from = account;
  if(!from){
   from = Account.NewAccount().getAddressString();
  }
   var value = "0";
   var nonce = "1000";
   var gas_price = "1000000";
   var gas_limit = "2000000";
   var contract = {
     "function": callFunction,
     "args":args
   };
   neb.api.call(from,address,value,nonce,gas_price,gas_limit,contract).then(function ({result}) {
     console.log(result)
     cb(JSON.parse(result),false)
   }).catch(function (err) {
     console.error("error:" + err.message)
   })
 }
 

 function getWalletInfo(cb) {
  let timeout;
    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");
    window.addEventListener('message', function (e) {
        if (e.data && e.data.data) {
            if (e.data.data.account) {
             cb(e.data.data.account,false)
             clearTimeout(timeout);
            }
        }
    });
    timeout = setTimeout(() => {
     cb(null,true)
    }, 10000);
}