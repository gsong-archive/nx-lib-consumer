# Nx Monorepo Libs Consumer

A demo create-react-app ("CRA") app that consumes libraries from [an Nx
monorepo](https://github.com/gsong/monorepo).

## Working With Packages From registry.npmjs.org

Treat this like a normal CRA project, there are no changes in the workflow.

## Working With Nx Libs Locally

If you need to make changes to one or more underlying libs in the Nx repo,
you'll need to link to those libraries locally, instead of using the version
downloaded from npmjs.org.

This will allow you to see and test the changes before publishing the libraries
for external usage.

### Workflow in Brief

1. Convert this app to a pnpm workspace and reinstall the packages.
1. Increment the semver for the library to be worked on.
1. Make code changes in the library and this app.
1. Publish the updated library.
1. Convert the app back to non-workspace.
1. Upgrade to the new library version.

### Workflow Step by Step

#### Convert App to Pnpm Workspace

1. Navigate to the app project root.

1. Create the workspace file.

   ```sh
   cp pnpm-workspace.yaml.example pnpm-workspace.yaml
   ```

1. Adjust the path to the monorepo libs if needed. By default it's assumed that
   the monorepo and the app are peers in the directory structure, e.g.
   `src/monorepo` and `src/my-app`.

1. Install dependencies, linking the monorepo libs locally.

   ```sh
   npx pnpm i --no-lockfile
   ```

   The `--no-lockfile` switch ensures that we don't overwrite `pnpm-lock.yaml`.

1. Verify that the linking worked.

   ```sh
   $ ls -l node_modules/@gsong/
   lrwxr-xr-x 30 george  1 Jun  7:01 ui -> ../../../monorepo/dist/libs/ui
   ```

   You should see that the library is linked to a local directory.

#### Increment Library Semver

1. Navigate to the library directory.

   ```sh
   cd $(MONOREPO)/libs/ui
   ```

1. Upgrade the version number

   ```sh
   npm version [type]
   ```

   Where `[type]` is `major`, `minor`, `patch`, etc.

#### Make Code Changes

1. Set up the real-time development build system.

   1. In the monorepo project root:

      ```sh
      npm run build:libs:watch
      ```

   1. In the app project root:

      ```sh
      npm start
      ```

1. Make the code changes in the library.

#### Publish the Library

1. Navigate to the monorepo project root.

1. Build the library and its dependencies.

   ```sh
   nx build ui --with-deps
   ```

1. Navigate to the library dist directory.

   ```sh
   cd $(MONOREPO)/dist/libs/ui
   ```

1. Publish.

   ```sh
   npm publish --access public
   ```

#### Convert Back to Non-Workspace App

1. Quit the real-time monorepo build watchers and the CRA dev server.

1. Navigate to the app project root.

1. Remove the workspace file.

   ```sh
   rm pnpm-workspace.yaml
   ```

1. Undo the local package link and upgrade.

   ```sh
   npx pnpm i @gsong/ui@latest
   ```

1. Verify that the unlinking worked.

   ```sh
   $ ls -l node_modules/@gsong/
   lrwxr-xr-x 69 george  1 Jun  8:05 design-system -> ../.pnpm/@gsong/design-system@0.0.1/node_modules/@gsong/design-system
   lrwxr-xr-x 47 george  1 Jun  8:05 ui -> ../.pnpm/@gsong/ui@0.0.3/node_modules/@gsong/ui
   ```

   You should see that the library (and its dependency) is linked to the pnpm
   registry.

1. Verify that everything is working properly.

   ```sh
   npm run build && npx serve -s build
   ```
