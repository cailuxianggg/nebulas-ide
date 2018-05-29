const SmartConstarct = function(text){
        if(text){
         const obj = JSON.parse(text);
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
          this.constractMap.set(key,constractInfo);
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
         return list
        }
       }
       
       module.exports = Constract;