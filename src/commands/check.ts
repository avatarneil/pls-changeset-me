import type { Argv } from 'yargs'
import * as git from '@changesets/git'
import inquirer from 'inquirer'
import parseChangeset from '@changesets/parse'
import path from 'path'
import fs from 'fs-extra'

const isString = (x: unknown): x is string => typeof x === 'string'

const getConfig = async (cwd: string) => fs.readJSON(path.join(cwd, '.changeset', 'config.json'))

const getBaseBranch = async (cwd: string) => {
  try {
    const config = await getConfig(cwd)

    if (!config.baseBranch) {
      throw new Error('No base branch set in config!')
    }

    const { baseBranch } = config

    if (!isString(baseBranch)) {
      throw new Error('baseBranch must be a string!')
    }

    return baseBranch
  } catch (err) {
    console.error(err)
    throw new Error('No base branch set, or changeset config file missing!')
  }
}

const getChangedPackageNames = async (cwd: string, baseBranch: string) => {
  const changedPackages = await git.getChangedPackagesSinceRef({ cwd, ref: baseBranch })
  return changedPackages.filter(a => a).map(pkg => pkg.packageJson.name)
}

const getPackageNamesWithStagedChangesets = async (cwd: string, baseBranch: string) => {
  /**
   * Changesets that have been created since ref
   */
  const newChangesets = await git.getChangedChangesetFilesSinceRef({ cwd, ref: baseBranch })

  const changesetContents = await Promise.all(
    newChangesets.map(async file => {
      const changeset = await fs.readFile(path.join(cwd, file), 'utf-8')

      return { ...parseChangeset(changeset), id: file.replace('.md', '') }
    })
  )

  return changesetContents
    .map(x => x.releases)
    .flat()
    .flat()
    .map(x => x.name)
}

const getChangedPackagesWithoutChangeset = async () => {
  const { cwd: getCwd } = process
  const cwd = getCwd()
  const baseBranch = await getBaseBranch(cwd)

  const changedPackageNames = await getChangedPackageNames(cwd, baseBranch)

  const packageNamesWithStagedChangesets = await getPackageNamesWithStagedChangesets(cwd, baseBranch)

  return changedPackageNames.filter(x => !packageNamesWithStagedChangesets.includes(x))
}

/**
 * Prompts the user if there are any changed packages which do not yet have a changeset
 */
export default function check(yargs: Argv): Argv {
  return yargs.command(
    'check',
    'Run pnpm check',
    argv =>
      argv.parserConfiguration({ 'unknown-options-as-args': true, 'greedy-arrays': false }).options({
        // Arg parser
        // TODO: Add a fully headless mode that will always exit if there are any changesets that should be created..?
      }),
    async options => {
      const changedPackagesWithoutChangeset = await getChangedPackagesWithoutChangeset()

      if (changedPackagesWithoutChangeset.length > 0) {
        console.log(
          'It appears you may have changed packages which require a changeset! Would you like to create one? 🥺 👉👈'
        )
        console.log(
          `Changed packages without a changeset:\n ${changedPackagesWithoutChangeset.map(x => ` - ${x}`).join('\n')}`
        )

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
