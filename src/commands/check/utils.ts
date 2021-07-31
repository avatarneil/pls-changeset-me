import * as git from '@changesets/git'
import parseChangeset from '@changesets/parse'
import path from 'path'
import fs from 'fs-extra'
import { isString } from './typeguards'

/**
 * Reads changeset config
 */
const getConfig = async (cwd: string) => fs.readJSON(path.join(cwd, '.changeset', 'config.json'))

/**
 * Gets base branch from changeset config
 */
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

/**
 * Gets names of all changed packages since baseBranch
 */
const getChangedPackageNames = async (cwd: string, baseBranch: string) => {
  const changedPackages = await git.getChangedPackagesSinceRef({ cwd, ref: baseBranch })
  return changedPackages.filter(a => a).map(pkg => pkg.packageJson.name)
}

/**
 * Gets names of all packages with staged changesets (i.e. changesets in the current working branch that haven't been merged into the base branch)
 */
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

/**
 * Gets all packages which have changed that do not have a staged changeset
 */
export const getChangedPackagesWithoutChangeset = async (): Promise<string[]> => {
  const { cwd: getCwd } = process
  const cwd = getCwd()
  const baseBranch = await getBaseBranch(cwd)

  const changedPackageNames = await getChangedPackageNames(cwd, baseBranch)

  const packageNamesWithStagedChangesets = await getPackageNamesWithStagedChangesets(cwd, baseBranch)

  return changedPackageNames.filter(x => !packageNamesWithStagedChangesets.includes(x))
}

export const showChangedPackagesWithoutChangeset = (changedPackagesWithoutChangeset: string[]): void =>
  console.log(
    `Changed packages without a changeset:\n ${changedPackagesWithoutChangeset.map(x => ` - ${x}`).join('\n')}`
  )
