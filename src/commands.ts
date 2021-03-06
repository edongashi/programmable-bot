import fs from 'fs'
import path from 'path'
import { Command } from './types'
import { toArray } from './utils'

function findInDir(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const fileStat = fs.lstatSync(filePath)

    if (fileStat.isDirectory()) {
      findInDir(filePath, filter, fileList)
    } else if (filter.test(filePath)) {
      fileList.push(filePath)
    }
  })

  return fileList
}

const commandsDir = path.resolve(__dirname, 'commands')
const files = findInDir(commandsDir, /\.[tj]s$/i)
const commands = files
  .map(f => {
    const module = require(f)
    return (module.command || module.commands) as Command | Command[]
  })
  .flatMap(toArray)
  .filter(c => typeof c.name === 'string' && c.name)

export default commands as Command[]
