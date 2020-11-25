# cvs-app-mobile

The app, added to DVSA mobile devices, allows assessors to check and record all aspects of a vehicle’s safety digitally
​

## Synopsis

​
This project contains the mobile app that demonstrates a business workflow for CVS Alpha.
​

## Architecture

[VTA High Level View](https://wiki.dvsacloud.uk/display/HVT/VTA+High+Level++View)

### End to end design

[All in one view](https://wiki.dvsacloud.uk/pages/viewpage.action?pageId=79254695)

### Microservices and backend

VTA uses the following AWS backend microservices:

- [Activity/Visit Microservice](https://wiki.dvsacloud.uk/pages/viewpage.action?pageId=81626518)
- [ATF Microservice](https://wiki.dvsacloud.uk/display/HVT/ATF+Microservice)
- [Defects Microservice](https://wiki.dvsacloud.uk/display/HVT/Defects+Microservice)
- [Preparers Microservice](https://wiki.dvsacloud.uk/display/HVT/Preparers+Microservice)
- [Technical Records Microservice](https://wiki.dvsacloud.uk/display/HVT/Technical+Records+Microservice)
- [Test Number Microservice](https://wiki.dvsacloud.uk/display/HVT/Test+Number+Microservice)
- [Test Results Microservice](https://wiki.dvsacloud.uk/display/HVT/Test+Results+Microservice)
- [Test Types Microservice](https://wiki.dvsacloud.uk/display/HVT/Test+Types+Microservice)

[Azure](https://docs.microsoft.com/en-us/azure/active-directory/) is used for identity management and in itegrates with [EDH](https://wiki.dvsacloud.uk/pages/viewpage.action?pageId=68583709)

## Getting Started

This project using Ionic, if you don't have ionic follow [these steps](https://ionicframework.com/docs/v1/guide/installation.html).
Please install and configure [nvm](https://github.com/nvm-sh/nvm) with this node version so it can be used during installation 10.x.
The application currently run on 10.18.1, please run `npm use` once the correct node(s) versions have been downloaded with nvm.

### Security

#### scanrepo

Please install and run the following securiy programs as part of your testing process:

[repo-security-scanner](https://github.com/UKHomeOffice/repo-security-scanner) and after installing run it with `git log -p | scanrepo`.

#### Sonarqube

In order to generate SonarQube reports on local, follow the steps (brew or docker approach is recommended):

- install sonarqube using brew - [formula](https://formulae.brew.sh/formula/sonarqube) -
- change `sonar.host.url` to point to localhost, by default, sonar runs on `http://localhost:9000`.
- run the sonar server - `sonar start` - then perform your analysis - `npm run sonar-scanner` -
- report will be available on `http://localhost:9000/dashboard?id=org.sonarqube%3Acvs-app-mobile`.

or alternatively you can manually install sonar server and its scanner:

- Download SonarQube server - [sonarqube](https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-7.6.zip)
- Download SonarQube scanner - [scanner](https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.3.0.1492-macosx.zip)
- Add sonar-scanner in environment variables -> In bash_profile add the line `export PATH=<PATH_TO_SONAR_SCANNER>/sonar-scanner-3.3.0.1492-macosx/bin:$PATH` - Add sonar-scanner in environment variables -> In bash_profile add the line `"export PATH=<PATH_TO_SONAR_SCANNER>/sonar-scanner-3.3.0.1492-macosx/bin:$PATH"`
- Start the SonarQube server -> `cd <PATH_TO_SONARQUBE_SERVER>/bin/macosx-universal-64 ./sonar.sh start` - Start the SonarQube server - `cd <PATH_TO_SONARQUBE_SERVER>/bin/macosx-universal-64 ./sonar.sh start`
- In the microservice folder run the command -> `npm run sonar-scanner` - In the microservice folder run the command - `npm run sonar-scanner`

### API Reference

​
This repo does not contain references to API endpoints, and requires them to be injected at build time using `.env` file from `scripts/config/create-config.ts` which will generate a `config/application.<appType>.ts`. Please rename your `env` file to `.env` with the appropriate values.

### Running the project

It is recommended to use 10.x to run this project (supported versions up to 12) with the relevant node version(s), please refer to the package.json meta-data to find out about the version or `.nvmrc` file in the project.

To get a working build running locally follow these steps:

1. Clone the repository.

2. Having the relevant node version.
   Run `npm install`.

// TODO NEED TO REMOVE TO CHECK

3. _(Optional)_ Set up the configuration for app's deeplinking using the following command after replacing "key", "https", "example.com" with your values:
   'ionic cordova plugin add ionic-plugin-deeplinks --variable URL_SCHEME=key --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=example.com'

// TODO NEED TO REMOVE TO CHECK

4. _(Optional)_ Run the following GIT command: "git update-index --assume-unchanged config/application.json" - [Mobile App](https://wiki.dvsacloud.uk/display/HVT/Getting+started+with+the+Mobile+App).
   You will have to remove the ios platform before you build and add ios@5.0.1
   The below command will prepare your app to be used in xCode and load the necessary platform and plugins.

Before making the Cordova build make sure you have your config files set up (`GoogleService-Info.plist` and `application.json` files)</br>

```shell
npm run prepare:ios:remove
npm run prepare:ios:add
```

### Build in xCode

The application runs on [Xcode 11](https://developer.apple.com/xcode/resources/) which will need to be installed on your machine.
Once the platform is successfully installed, you can run the following script:

```shell
npm run build:ios
```

You can then open the `platforms/ios/Vehicle Testing.xcodeproj` and build, run the app using IPhone 8 (our target device).

#### Known issues

Builds in the XCode may fail due to XCode 11 backward compatability with some outdated cordova-plugins, ionic 3.
Even if the cordova build is successful, the XCode build may sometimes fails.
Should it happen, remove the platforms (ios) and plugins and reinstall the ios platform.

```shell
npm run prepare:ios:remove
npm run prepare:ios:add

```

- Github issues:

  - Xcode backward compatibility: [Cordova.h and Info.plist missing files](https://github.com/apache/cordova-ios/issues/760).
  - Firebasex cordova plugin: will require [Cocoapods](https://guides.cocoapods.org/using/getting-started.html#sudo-less-installation) installed.
  - cordova-plugin-statusbar: [Github](https://github.com/apache/cordova-plugin-statusbar)
  - cordova-plugin-inappbrowser: [Github](https://github.com/apache/cordova-plugin-inappbrowser/issues/709)
  - cordova-plugin-ionic-webview: [Github](https://github.com/ionic-team/cordova-plugin-ionic-webview)

### Development

#### in the browser:

The following script will allow you to run the app in your browser `npm run emulate:web`.

You will require a GoogleService-Info.plis file and `@ionic-enterprise` key to install scope dependencies.

//TODO ADD preinstall script that generates the .npmrc file with auth-connect key so we can get rid of the below

If you are asked to install the missing dependencies please choose yes.
You will also require the [environment configuration steps](https://wiki.dvsacloud.uk/display/HVT/Getting+started+with+the+Mobile+App#GettingstartedwiththeMobileApp-Environmentfiles) as well as [local development mode](https://wiki.dvsacloud.uk/display/HVT/Getting+started+with+the+Mobile+App#GettingstartedwiththeMobileApp-Runningtheappindevelopmentmode) and a [test user](https://wiki.dvsacloud.uk/display/HVT/Getting+started+with+the+Mobile+App#GettingstartedwiththeMobileApp-Credentials).

#### in the emulator:

You can run the following script - `npm run emulate:ios` to run the application in the emulator with the live reload once you retrieve your IPhone emulator id.

You will first need to get your iPhone 8 Plus that you can find under `Simulator > Hardware menu > Devices > Manage devices`.
The ID will be shown on the `Identifier` key.
You can then copy paste the value in the `env` file to the following variable:

```
IPHONE8_P_ID=

```

and rename this file from `env` to `.env`.

## For testing on an iOS device:

Run `npm run build:ios` script and open your `.xcodeproj` file to build the hybrid app.

## Contributing to the project

### Code style

- Hooks are applied on pre-commit, commit-msg and prepush using [husky](https://github.com/typicode/husky).
- Code is linted with [tslint](https://palantir.github.io/tslint/) - `npm run lint`
- We format the code using [prettier](https://prettier.io/) - `npm run prettier`
- [Typescript](https://github.com/basarat/typescript-book) is used and we follow the [angular coding style](https://angular.io/guide/styleguide) with the following [clean code principles](https://github.com/ryanmcdermott/clean-code-javascript)

### Committing code

Before commiting code, please make sure [scanrepo](https://github.com/UKHomeOffice/repo-security-scanner) is configured.</br>
We use [commitlint](https://github.com/conventional-changelog/commitlint#readme) when commiting code so make sure you are familiar with [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0-beta.4/).

## Testing

### Unit testing and integration

In order to test, you need to run the following:

- `npm run test:unit:watch` for unit tests.
- `npm run test:unit:coverage` for code coverage
- `npm run sonar-scanner` for sonarqube.

Framework: [Jasmine](https://jasmine.github.io/2.0/introduction.html) with Karma runner.

### End to end

- [Automation test repository](https://github.com/dvsa/cvs-auto-mobile-app)

- [Java](https://docs.oracle.com/en/java/javase/11/)
- [Serenity Cucumber with Junit](https://serenity-bdd.github.io/theserenitybook/latest/junit-basic.html)

## Infrastructure

For the CI/CD and automation please refer to the following pages for further details:

- [Pipeline](https://wiki.dvsacloud.uk/display/HVT/CVS+Pipeline+Infrastructure)
- [Development processes](https://wiki.dvsacloud.uk/pages/viewpage.action?pageId=36870584)

## Sentry Integration and Setup for production logs

// TODO TO check with Olu

Sentry is already enabled however if you wish to create a different account you would need to follow these steps:

- Create an account in https://sentry.io/signup/ and create a default project to receive mobile app generated errors
- `npm install --save sentry-cordova` for sentry app/cordova integration
- `npm install --save-dev @sentry/wizard` to help in configuring the mobile app with Sentry.io for the first time i.e. when the app does not exist in Sentry
- `npm run build` when used locally or in the pipeline will create
  `sentry.properties` file provided that `config/application.json` already exist with required key/value pairs
  This file would have also being generated during @sentry/wizard integration setup
- `SENTRY_DNS` when set to blank in `config/application.json` will disable sentry integration with the mobile app
