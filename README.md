# named-mutex-js
cross process named mutex

## Install

```cmd
>npm install --save named-mutex
```

## Usage

child.js

```js
const NamedMutex = require('named-mutex')

const mutex = new NamedMutex('testMutex')
console.log(mutex.tryLock())

setTimeout(()=>{
  console.log('process leaving')
}, 3000)
```

main.js

```js
const NamedMutex = require('../src/named-mutex')
const cp = require('child_process')

const mutex = new NamedMutex('testMutex')
console.log(mutex.tryLock()) // output: true
const {stdout} = cp.spawnSync('node', ['child.js'])
console.log(stdout.toString().trim()) // output: false
mutex.unLock() // process still release the mutex on leave, even if this line is absent
```