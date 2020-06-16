const NamedMutex = require('../src/named-mutex')
const cp = require('child_process')
const path = require('path')
const assert = require('assert').strict

const cpPath = path.resolve(__dirname, '..', 'src', 'test-utils', 'cp.js')
describe('named mutex', function (){
  this.timeout(10000)
  it('mutual exclusion check', done => {
    const mutex = new NamedMutex('testMutex')
    assert(mutex.tryLock(), 'mutex initial lock failed')
    const {stdout} = cp.spawnSync('node', [cpPath])
    assert.equal(stdout.toString().trim(), 'false', 'child process lock leaked')
    mutex.unLock()
    done()
  })
  it('abandoned mutex lock', done => {
    const mutex = new NamedMutex('testMutex')
    const {stdout} = cp.spawnSync('node', [cpPath])
    assert(mutex.tryLock(), 'mutex not abandoned when process leave')
    assert.equal(stdout.toString().trim(), 'true', 'first lock failed')
    mutex.unLock()
    done()
  })
  it('unlock without owning lock', done => {
    const mutex = new NamedMutex('testMutex')
    const lockCP = cp.spawn('node', [cpPath])
    assert.throws(() => {
      mutex.unLock()
    }, 'lock leaked')
    lockCP.kill()
    done()
  })
  it('lock then', done => {
    const mutex = new NamedMutex('testMutex')
    const lockCP = cp.spawn('node', [cpPath])
    setTimeout(() => {
      const start = Date.now()
      mutex.lock().then(() => {
        const du = Date.now() - start
        assert(du > 2000, 'lock leaked')
        mutex.unLock()
        done()
      })
    }, 800)
  })
})