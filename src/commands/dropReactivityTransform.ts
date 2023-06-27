import { runCli } from '../runner'
import fg from 'fast-glob'
import { drop } from '../drop'
import path from 'path'
import c from 'kleur'

runCli(async args => {
  const folder = args[0]
  const nonInjectImport = args[1] === 'nonInjectImport'
  const source = folder ? path.resolve(process.cwd(), folder) : process.cwd()
  const files = fg.sync(`${source}/**/*.vue`)

  console.log(
    c.yellow(
      `${files.length} files found.`
    )
  )
  for (const file of files) {
    console.log(
      c.green(
        `[processing] ${file}]`
      )
    )
    
    drop(path.resolve(process.cwd(), file), !nonInjectImport)

    console.log(
      c.green(
        `[done] ${file}]`
      )
    )
  }

  console.log(
    c.yellow(
      `All done!`
    )
  )
})
