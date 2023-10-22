const path = require('path')
const shell = require('shelljs')
shell.config.fatal = true

const cwd = process.cwd()

try {
	console.log('copy static files')
	shell.cp('-r', `${path.join(cwd, 'dist')}`, path.join(cwd, '../server/'))
} catch (error) {
	console.log('-->> cp static', error)
	process.exit(1)
}
