<h1 align="center">Vyaire-MDM 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
</p>

Frontend Web/Mobile App For MDM project
&nbsp;

## Getting started :raised_hands:

#### Installing and running the app
1. Run ``yarn install`` to install the NodeJS packages required for the app.
2. Make sure Expo cli tool is installed ``npm install -g expo-cli``
3. Run ``yarn run web`` 
    - for iOS ``yarn run ios``
    - for Android ``yarn run android``

&nbsp;

### Project Workflow :zap:
Use [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for working on changes

**Feature Branches**

```shell
# Create a new feature branch
$ git checkout develop
$ git checkout -b feature_branch
```

```shell
# Finishing a feature branch
$ git checkout develop
$ git merge feature_branch
```

- Working on features
  - each new feature should reside in its own branch
  - feature branches use `develop` as their parent branch


**Release Branches**

```shell
# Create new release branch
$ git checkout develop
$ git pull
$ git checkout -b release/0.1.0
```

```shell
# Finishing a release branch
$ git checkout master
$ git merge release/0.1.0 
$ git checkout develop
$ git merge release/0.1.0 
```

- Working on release branches
  - fork a release branch off of `develop` 
  - each new release should reside in its own branch
  - once it's ready to ship, the release branch gets merged into master and develop

