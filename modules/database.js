module.exports = async function database() {
  this.logger.info('Module Database Starting')

  let ipfsExecutable = 'node_modules\\.bin\\jsipfs.cmd' //windows
  //let ipfsExecutable = './node_modules/.bin/jsipfs' //linux

  let ipfsExecutableArgs = ['daemon', '--enable-pubsub-experiment']

  const spawn = require('child_process').spawn
  var ipfsProcess = spawn(ipfsExecutable, ipfsExecutableArgs)

  this.logger.debug('Spawn: ' + ipfsExecutable + ipfsExecutableArgs)

  ipfsProcess.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
  })

  ipfsProcess.stderr.on('data', function(data) {
    console.error('stderr: ' + data)
  })

  ipfsProcess.on('exit', function(code) {
    console.info('child process exited with code ' + code)
  })

  this.logger.debug('Add database-template plugin')

  const path = require('path')
  this.addPlugin({
    src: path.resolve(__dirname, 'database-template.js'),
    fileName: 'database.js'
  })

  console.log('Node module loaded')
}
