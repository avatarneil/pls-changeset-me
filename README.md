# Pls Changeset Me 🥺

A script that will _plead_ for you to write [changesets](https://github.com/atlassian/changesets) for your changes.

## Prerequisites

- Repo with [changesets](https://github.com/atlassian/changesets)
- NodeJS `v15.11+` (may work on earlier versions, but untested!)
- A burning desire to have your toolchain stop you from making mistakes

## Usage

It's as simple as: `pnpx pls-changeset-me check`

- You can use it as a pre-commit hook with [husky](https://github.com/typicode/husky)!
- You can use it straight from your command line by invoking with `pnpx`!
- You can use it to block CI/CD (Jenkins, Codeship, Travis, you name it)! Simply supply the `-headless` (`-h`) parameter :)

## Contributing

Feel free to open issues for any desired features, and cut PRs for any desired changes! I'll do my best to keep this package reasonably maintained. If you'd like to be a maintainer, cut a couple PRs and I'll probably drop you a line :)
