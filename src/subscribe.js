const event = {
  subscribe:(EVENT,callback) => {
    this[EVENT] = callback;
  },
  dispatch:(EVENT,args) => {
    const callback = this[EVENT];
    if(callback){
      callback({...args})
    }
  }
}

export default event;