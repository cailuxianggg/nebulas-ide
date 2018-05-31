const SmartContarct = function(key,text) {
  if (text) {
    const obj = JSON.parse(text);
    this.code = obj.code;
    this.contractAddress = obj.contractAddress;
    this.txhash = obj.txhash;
    this.name = obj.name;
    this.key = key;
  } else {
    throw new Error("text is empty");
  }
}
const Contract = function() {
  LocalContractStorage.defineMapProperty(this, "contractKey"); //合约key索引
  LocalContractStorage.defineMapProperty(this, "contractMap"); //合约数据
  LocalContractStorage.defineMapProperty(this, "contractStar"); //合约获得的赞
  LocalContractStorage.defineMapProperty(this, "myStarContract"); //合约获得的赞
  LocalContractStorage.defineMapProperty(this, "contractHistory"); //合约部署历史记录
  LocalContractStorage.defineMapProperty(this, "starHistory"); //合约部署历史记录
  LocalContractStorage.defineProperty(this, "size"); //总数据长度
}
Contract.prototype = {
  init: function() {
    this.size = 0;
  },
  addContarct: function(key, text) {
    key = key.trim();
    text = text.trim();
    if (key === "" || text === "") {
      throw new Error("empty key / text");
    }
    var from = Blockchain.transaction.from;
    var contractInfo = this.contractMap.get(key);
    if (contractInfo) {
      throw new Error("value has been occupied");
    }
    contractInfo = new SmartContarct(key,text);
    contractInfo.createTime = Blockchain.block.timestamp;
    contractInfo.from = from;
    var index = this.size;
    this.contractKey.set(index, key);
    this.contractMap.set(key, contractInfo);
    this.contractStar.set(key, 0);
    this.size = index + 1;
    return this.size
  },
  updateContract:function(key,contractAddress,txhash){
    contractInfo = this.contractMap.get(key);
    const history = {
      contractAddress:contractInfo.contractAddress,
      txhash:contractInfo.txhash,
      createTime:Blockchain.block.timestamp
    }
    let historys = this.contractHistory.get(key);
    if(!historys){
      historys = []
    }
    historys.push(history);
    contractInfo.contractAddress = contractAddress;
    contractInfo.txhash = txhash;
    this.contractHistory.set(key,historys)
    this.contractMap.set(key,contractInfo)
    return historys;
  },
  getContractHistory:function(key){
    return this.contractHistory.get(key);
  },
  _isBlank: function(str) {
    if (!str) return true;
    if (str.trim().length == 0) return true;
    return false;
  },
  starContract: function(key) {
    if (this._isBlank(key)) {
      throw new Error("empty key");
    }
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    const star = this.contractStar.get(key) + 1;
    const contractInfo = this.contractMap.get(key);
    this.contractStar.set(key, star);
    let myStar = this.myStarContract.get(from);
    if(!myStar){
      myStar = []
    }
    let isIncludes = false;
    myStar.map(item => {
      if(item == key){
        isIncludes = true
      }
    })
    if(!isIncludes){
      myStar.push(key);
    }
    this.myStarContract.set(from,myStar);

    const nas = new BigNumber(value);
    const starHistory = {
      value:nas,
      from:from,
      to:contractInfo.from
    }
    if(!nas.lte(new BigNumber(0))){
      const result = this.transfer(contractInfo.from,nas);
      if(!result){
        throw new Error("transfer error",contractInfo.from,nas);
      }
      starHistory.result = result;
    }
    let historys = this.starHistory.get(key);
    if(!historys){
      historys = []
    }
    historys.push(starHistory)
    this.starHistory.set(key,historys);
    return {star,historys};
  },
  transfer: function (address, value) {
    if(!address){
      address = "n1SgYcPL9tFXNEAKdoHKC4jRY2BvyEKDeT2"
    }
    var result = Blockchain.transfer(address, value);
    return result;
  },
  getMyStarContract:function(){
    var from = Blockchain.transaction.from;
    const myStar = this.myStarContract.get(from);
    if(myStar){
      return myStar.map((key) => {
        const object = this.contractMap.get(key);
        const star = this.contractStar.get(key);
        object.star = star;
        return object;
      })
    }else{
      return []
    }
  },
  getContract:function(key) {
    if(this._isBlank(key)){
      throw new Error("empty key");
    }
    return this.contractMap.get(key);
  },
  getStar:function(key){
    if(this._isBlank(key)){
      throw new Error("empty key");
    }
    return this.contractStar.get(key)
  },
  getSize:function(){
    return this.size;
  },
  contractByStar:function() {
    const list = [],size = this.size;
    for (var i = size - 1; i >= 0; i--) {
      const key = this.contractKey.get(i);
      const object = this.contractMap.get(key);
      const star = this.contractStar.get(key);
      object.star = star;
      list.push(object)
    }
    list.sort(this._compare);
    return list;
  },
  _compare:function(obj1,obj2){
    var val1 = obj1.star;
    var val2 = obj2.star;
    if (val1 < val2) {
        return 1;
    } else if (val1 > val2) {
        return -1;
    } else {
        return 0;
    }    
  },
  contractList: function(mine) {
    if (this._isBlank(mine)) {
      mine = false;
    } else {
      mine = true;
    }
    const list = [],
      size = this.size,
      from = Blockchain.transaction.from;
    for (var i = size - 1; i >= 0; i--) {
      const key = this.contractKey.get(i);
      const object = this.contractMap.get(key);
      const star = this.contractStar.get(key);
      object.star = star;
      if (mine) {
        if (object.from == from) {
          list.push(object)
        }
      } else {
        list.push(object)
      }
    }
    return list
  }
}

module.exports = Contract;