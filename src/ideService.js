import NebPay from 'nebpay';
import nebulas from 'nebulas';
import uuid from 'uuid';


const Account = nebulas.Account,
      neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

var nebPay = new NebPay();
let intervalQuery
const address = "n1tPbrcNUtQhWkk71AwbvJw7DMPGZSVZ3xP";

function funcIntervalQuery(serialNumber,cb,count) {
  let index = ++count;
   nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
     .then(function (resp) {
       var respObject = JSON.parse(resp)
       if(respObject.msg === 'success' && respObject.code == 0 && respObject.data.status == 1){
         cb(resp);
         clearTimeout(intervalQuery)
       }else{
        if(index == 4){
         cb(resp);
          clearTimeout(intervalQuery)
          return
        }
          setTimeout(() => {
            funcIntervalQuery(serialNumber,cb,index);
          },5000) 
        }
      });
    } 

export const addConstract = (params,callback) => {
  params.key = uuid();
  const options = {
    listener:(a) => {
      console.log(11,a)
    }
  }
  const serialNumber = nebPay.call(address,0,"addConstarct",JSON.stringify([params.key,params]),options)
  intervalQuery = setTimeout(() => {
    funcIntervalQuery(serialNumber,callback,0)
  },5000);
}

export const constractList = (cb) => {
  getWalletInfo((account) => {
    requestNebApi("constractList","[]",cb,account);  
  })
  
 }

function requestNebApi(callFunction,args,cb,account){
  var from = account;
  if(!from){
   from = Account.NewAccount().getAddressString();
  }
   var value = "0";
   var nonce = "0";
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