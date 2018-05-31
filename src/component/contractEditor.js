import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

function onChange(newValue) {
  console.log('change',newValue);
}

// Render editor
const ContractEditor = ({value,onChange}) => {
  return <AceEditor
    mode="javascript"
    theme="github"
    onChange={onChange}
    value={value}
    setOptions={{
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 2,
    }}
  />
}
  

export default ContractEditor;