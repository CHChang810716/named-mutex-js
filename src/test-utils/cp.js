const NamedMutex = require('../named-mutex')

const mutex = new NamedMutex('testMutex')
setTimeout(()=>{}, 3000)
console.log(`${mutex.tryLock()}`)