# Pls Changeset Me 🥺

A script that will _plead_ for you to write [changesets](https://github.com/atlassian/changesets) for your changes.

[![Codeship Status for avatarneil/pls-changeset-me](https://app.codeship.com/projects/1bbfbf3c-4875-486a-b6d9-b45bdc293726/status?branch=main)](https://app.codeship.com/projects/449901)

## Prerequisites

- Repo with [changesets](https://github.com/atlassian/changesets)
- NodeJS `v15.11+` (may work on earlier versions, but untested!)
- A burning desire to have your toolchain stop you from making mistakes

## Usage

It's as simple as: `pnpx pls-changeset-me check`

- You can use it as a pre-commit/pre-push hook with [husky](https://github.com/typicode/husky)!
  - Take a look at `.husky/pre-commit` for an example. Note the importance of including `exec < /dev/tty`, unless you want to run in headless mode (note: headless mode is _not_ recommended for pre-commit/pre-push hooks)!
- You can use it straight from your command line by invoking with `pnpx`!
- You can use it to block CI/CD (Jenkins, Codeship, Travis, you name it)! Simply supply the `-headless` (`-h`) parameter :)

### Commands

#### Check

Checks for any staged changes which do not yet have a corresponding changeset. By default, prompts the user if they'd like to generate a changeset.

##### Options

- `-headless` -- Runs in a headless mode which will force-exit without user input if there have been any changes that may require a new changeset.

## Contributing

Feel free to open issues for any desired features, and cut PRs for any desired changes! I'll do my best to keep this package reasonably maintained. If you'd like to be a maintainer, cut a couple PRs and I'll probably drop you a line :)
