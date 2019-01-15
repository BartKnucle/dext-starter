module.exports = async function database() {
  this.logger.info('Module Database Starting')

  //let ipfsExecutable = 'node_modules\\.bin\\jsipfs.cmd' //windows
  let ipfsExecutable = './node_modules/.bin/jsipfs' //linux

  let ipfsExecutableArgs = ['daemon', '--enable-pubsub-experiment']

  const spawn = require('child_process').spawn
  this.ipfsProcess = spawn(ipfsExecutable, ipfsExecutableArgs)

  this.logger.debug('Spawn: ' + ipfsExecutable + ipfsExecutableArgs)

  this.ipfsProcess.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
  })

  this.ipfsProcess.stderr.on('data', function(data) {
    console.error('stderr: ' + data)
  })

  this.ipfsProcess.on('exit', function(code) {
    console.info('child process exited with code ' + code)
  })

  this.nuxt.hook('ready', async nuxt => {
    console.log('Closing nuxt')
  })

  console.log('Node module loaded')
}
