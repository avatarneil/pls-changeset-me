import yargs from 'yargs'
import commands from './commands'

commands
  .reduce((cli, command) => command(cli), yargs)
  .check(({ _: [command] }) => {
    if (!commands.map(command => command.name).includes(`${command}`)) {
      throw Error(command ? `Unknown command "${command}"` : 'Missing command')
    }
    return true
  })
  .usage(`$0: CI commands for pnpm`)
  .showHelpOnFail(true)
  .parse()
