const NamedMutex = require('../named-mutex')

const mutex = new NamedMutex('testMutex')

console.log(`${mutex.tryLock()}`)