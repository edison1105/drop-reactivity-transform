import c from 'kleur'
import { version } from '../package.json'

export type Runner = (args: string[]) => Promise<void> | void

export async function runCli(fn: Runner) {
  const args = process.argv.slice(2).filter(Boolean)
  try {
    await run(fn, args)
  } catch (error) {
    process.exit(1)
  }
}

export async function run(fn: Runner, args: string[]) {
  if (args.length === 1 && (args[0] === '--version' || args[0] === '-v')) {
    console.log(`drop-reactivity-transform v${version}`)
    return
  }

  if (args.length === 1 && ['-h', '--help'].includes(args[0])) {
    console.log(
      c.yellow(
        '\ncheck https://github.com/edison1105/drop-reactivity-transform for more documentation.'
      )
    )
    return
  }

  await fn(args)
}
