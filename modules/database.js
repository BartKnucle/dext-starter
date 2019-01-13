module.exports = async function node() {
  //let ipfsExecutable = 'node_modules\\.bin\\jsipfs.cmd' //windows
  let ipfsExecutable = './node_modules/.bin/jsipfs' //linux

  let ipfsExecutableArgs = ['daemon', '--enable-pubsub-experiment']

  const spawn = require('child_process').spawn
  var ipfsProcess = spawn(ipfsExecutable, ipfsExecutableArgs)

  ipfsProcess.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
  })

  ipfsProcess.stderr.on('data', function(data) {
    console.log('stderr: ' + data)
  })

  ipfsProcess.on('exit', function(code) {
    console.log('child process exited with code ' + code)
  })
  const path = require('path')
  this.addPlugin({
    src: path.resolve(__dirname, 'database-template.js'),
    fileName: 'database.js'
  })

  console.log('Node module loaded')
}
