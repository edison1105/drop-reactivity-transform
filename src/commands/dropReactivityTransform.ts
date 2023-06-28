import { runCli } from '../runner'
import fg from 'fast-glob'
import { drop } from '../drop'
import path from 'path'
import c from 'kleur'

runCli(args => {
  const folder = args[0]
  const nonInjectImport = !args.includes('--nonInjectImport')

  const source = folder ? path.resolve(process.cwd(), folder) : process.cwd()
  const files = fg.sync([
    `${source}/**/*.vue`,
    `${source}/**/*.ts`,
    `${source}/**/*.js`
  ], {
    ignore: ['**/node_modules/**']
  })

  console.log(
    c.yellow(
      `${files.length} files found.`
    )
  )
  for (const file of files) {
    drop(path.resolve(process.cwd(), file), nonInjectImport)

    console.log(
      c.green(
        `[done] ${file}`
      )
    )
  }

  console.log(
    c.yellow(
      `All done!`
    )
  )
})
