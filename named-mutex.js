const {flockSync} = require('fs-ext')
const os = require('os')
const path = require('path')
const fs = require('fs')
const poll = require('poll')
const createFile = (path) => {
  fs.openSync(path, 'w')
  fs.closeSync(path)
}
class Mutex {
  constructor(name) {
    if(!(name instanceof String)) 
      throw new Error('mutex name must be a string')
    this._filePath = path.resolve(os.tmpdir(), `${name}.mutex`)
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
    if(!this._locked) return;
    flockSync(this._fd, 'un')
  }
}

module.exports = Mutex