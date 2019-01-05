module.exports = async function node() {
  const spawn = require('child_process').spawn
  spawn('./node_modules/.bin/jsipfs', ['daemon', '--enable-pubsub-experiment'])
  console.log('Node module loaded')
}
