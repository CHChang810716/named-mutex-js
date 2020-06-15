const NamedMutex = require('../named-mutex')
const cp = require('child_process')
const path = require('path')
describe('try lock', () => {
  it('should lock the mutex', done => {
    const mutex = new NamedMutex('testMutex')
    console.log(mutex.tryLock())
    const {stdout} = cp.spawnSync('node', [
      path.resolve(__dirname, 'cp.js')
    ])
    // console.log(stdout.toString())
    mutex.unLock()
    done()
  })
})