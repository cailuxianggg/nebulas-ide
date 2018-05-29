const esprima = require('esprima');
const estraverse = require('estraverse');

export const parseContract = (code,callback) => {
  const ast = esprima.parse(code);
  //查询export出来的结构
  console.log(ast);
  estraverse.traverse(ast, {
    enter: function (node) {
      if(node.left && node.left.object && node.left.object.name == "module"){
        if(node.left.property && node.left.property.name == "exports"){
          const right = node.right.name;
          console.log(right);
          estraverse.traverse(ast, {
            enter: function (n) {
              if(n.type == "AssignmentExpression"){
                if(n.left && n.left.object && n.left.object.name == right){
                  const list = n.right.properties;
                  const info = contractMethod(list);
                  callback(info)
                }
                
              }
              
            }
          });
        }
      }
        
    }
  });
}

const contractMethod = (list) => {
  if(list){
    return list.map(({key,value}) => {
      const name = key.name;
      const params = value.params;
      const args = params.map(p => p.name)
      return {
        name,
        args
      }
    })
  }
}
