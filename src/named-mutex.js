const {flockSync} = require('fs-ext')
const os = require('os')
const path = require('path')
const fs = require('fs')
const poll = require('poll').default
const createFile = (path) => {
  const fd = fs.openSync(path, 'w')
  fs.closeSync(fd)
}
class NamedMutex {
  constructor(name) {
    if(!(typeof name === 'string')) 
      throw new Error('mutex name must be a string')
    this._filePath = path.resolve(os.tmpdir(), `${name}.mutex`)
    // console.log(this._filePath)
    if(!fs.existsSync(this._filePath)) {
      createFile(this._filePath)
    }
    this._fd = fs.openSync(this._filePath, 'r')
    this._locked = false
  }
  tryLock() {
    if(this._locked) return true;
    try {
      flockSync(this._fd, 'exnb')
      this._locked = true
      return true;
    } catch (err) {
      // console.log(err)
      return false;
    }
  }
  lock(interval = 100) {
    return new Promise((resolve, reject) => {
      poll(() => {
        if(this.tryLock()) {
          resolve()
        }
      }, interval, () => this._locked)
    })
  }
  unLock() {
    if(!this._locked) {
      throw new Error('not owned any lock')
    }
    flockSync(this._fd, 'un')
  }
}

module.exports = NamedMutex