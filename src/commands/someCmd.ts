import type { Argv } from 'yargs'
import { promisify } from 'util'
import { exec } from 'child_process'

// Important: Use named function
export default function someCmd(yargs: Argv): Argv {
  return yargs.command(
    'someCmd',
    'Run pnpm someCmd',
    argv =>
      argv.parserConfiguration({ 'unknown-options-as-args': true, 'greedy-arrays': false }).options({
        // Arg parser
      }),
    async options => {
      // real method which does real things!
    }
  )
}
