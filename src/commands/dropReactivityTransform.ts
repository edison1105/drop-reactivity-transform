import { runCli } from '../runner'
import fg from 'fast-glob'
import { drop } from '../drop'
import path from 'path'
import c from 'kleur'

runCli(args => {
  const folder = args[0]
  const injectImport = !args.includes('--nonInjectImport')

  const source = folder ? path.resolve(process.cwd(), folder) : process.cwd()
  const files = fg.sync(
    [fg.convertPathToPattern(source) + '/**/*.{vue,ts,js}'], 
    {ignore: ['**/node_modules/**']}
  )

  console.log(
    c.yellow(
      `${files.length} files found.`
    )
  )
  for (const file of files) {
    drop(path.resolve(process.cwd(), file), injectImport)
  }

  console.log(
    c.yellow(
      `All done!`
    )
  )
})
