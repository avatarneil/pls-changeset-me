import type { Argv } from 'yargs'
import inquirer from 'inquirer'
import { getChangedPackagesWithoutChangeset, showChangedPackagesWithoutChangeset } from './utils'

/**
 * Prompts the user if there are any changed packages which do not yet have a changeset
 */
export default function check(yargs: Argv): Argv {
  return yargs.command(
    'check',
    'Check if any staged changes should mandate a new changeset',
    argv =>
      argv.parserConfiguration({ 'unknown-options-as-args': true, 'greedy-arrays': false }).options({
        // Arg parser
        // TODO: Add a fully headless mode that will always exit if there are any changesets that should be created..?
        headless: {
          description: 'Run in headless mode (will exit without prompt if a changeset should be created)',
          type: 'boolean',
          default: false
        }
      }),
    async options => {
      const { headless } = options

      const changedPackagesWithoutChangeset = await getChangedPackagesWithoutChangeset()

      if (changedPackagesWithoutChangeset.length > 0) {
        if (headless) {
          showChangedPackagesWithoutChangeset(changedPackagesWithoutChangeset)
          console.log(
            'Exiting with error so changeset can be generated! Please try your commit again once the changeset has been generated :)'
          )

          process.exit(1)
        }

        console.log(
          'It appears you may have changed packages which require a changeset! Would you like to create one? 🥺 👉👈'
        )
        showChangedPackagesWithoutChangeset(changedPackagesWithoutChangeset)

        const { answer } = await inquirer.prompt({
          type: 'confirm',
          name: 'answer',
          message: 'Create a changeset for these packages?'
        })

        if (answer) {
          console.log('Exiting with error so changeset can be generated!')
          process.exit(1)
        }

        process.exit(0)
      }
    }
  )
}
