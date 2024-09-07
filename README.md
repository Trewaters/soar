# Soar with Happy Yoga, like a leaf on the wind.

version 1.1.0 or [version badge](https://badge.fury.io/)

App used to find and track Yoga practice. Find poses, create flows, and track progress. For beginners and experts alike. Created by a yoga instructor for yoga instructors and students.

Found yoga poses [here](https://www.pocketyoga.com/pose/)

## Getting Started

### What the app should do?

#### App Sections

**Asana Postures**

- View Yoga postures with details about the posture like name, description, etc.

**Flow**

- Series are multiple asanas done in order. Series are smaller pieces that combine to make a Full Sequences.
- View series
- View sequences
- Create series
- Create sequences

**Meditaiton**

- TBD

**Mantra**

- TBD

**Breathwork**

- TBD

**Yoga Journal**

- TBD

#### Planner page

- [in-progress] Goal: Goals (long term),
- [in-progress] Today: Today's workout (present day),
- [in-progress] History: Historical (past) practice

#### 8 Limb Path

- Reference area with definitions for the 8 limbs of yoga. Meant to be a resource for more information.

#### Users

- Login
- Logout
- View User details, profile image from social login.
- Edit User details, profile image from social login.

### Why is this app useful?

Used as an aid in anyones active yoga practice. This app won't get you started doing yoga but if you are a yogi, instructor, or student this app is for you.

## CREDIT

[Bishop Fox - Cybersecurity Style Guide - v1.1] (https://www.bishopfox.com/blog/2018/02/hello-world-introducing-the-bishop-fox-cybersecurity-style-guide/)

### Built With

- This project was generated with [NextJS](https://nextjs.org/docs) version 13.
- Material MUI
- MongoDB
- Prisma
- Auth.js v5 (Google, Github, Twitter X)

## CONTRIBUTIONS

Solo project so far. Code and graphic design contributors are welcome and encouraged to help.

**Please read** [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to me. (I will copy their instructions when I get time, but for now ditto to what they say)

### How to Contribute?

I NEED HELP WITH...

1. **Frontend design**: Designing look and feel for pages is not my strength. I would love help laying out pages better. _Make the app pretty!_
2. **Yoga Pose images**: I need images for the yoga poses. It should be a set of images.
3. **Fix Bugs**: See something wrong fix it or create an issue identifying how to reproduce the bug.

## Authors

- **Tre' Grisby** - _Initial work_ - [trewaters](https://gitconnected.com/trewaters)

See also the list of [contributors](https://github.com/) who participated in this project.

## License

This project is licensed under the _GNU Affero General Public License v3.0_ - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- "I tip my hat to anyone whose code was used!" npm gives me a lot of people to thank!
- Special thank you to my mom, wife, and my daughters! Without their love and support this would have gone nowhere.
- Gratitude is the attitude!

## Journal

- I started this in July 2023. I hope to have a MVP by the end of the year. I am working on this in my spare time, so it may take longer. I am also learning NextJS as I go, so that will slow me down as well.
- Soon I will be releasing a version 1 of the app. It snuck up on me. I have actually done what I marked as a milestone for v1! Congrats to me!

### Current Goals

- (2024-06-01 09:17:02) update `jest.config.ts` old config found here "...\Yoga\app-Soar\old code\jest.config.ts"
- **Record practice**, record personal yoga practice in app.
- **Top Navigation**, Use a component for Top Navigation.
- **Footer**, Make a footer component. Include copyright 2023 - 2024, Name (Happy Yoga), Terms of use (tldr) or licensing, etc.
- **Header**, Make a header component.

## Milestones

- [x] 1.0.0 - MVP ( 2 sections - each with material, "Flow" and "Asana Postures").
- [x] 2.0.0 - Create User Profiles (connect to db)
- [ ] 2.1.0 - Routine/Practice Planner. Allow user to track progress and goals.
- [ ] x.x.0 - Allow User Profiles to save their progress (connect to db)
- [ ] x.x.0 - User Profile Customizations (Connect "Planner" buttons)
- [ ] x.x.0 - User Profile Customizations
- [ ] x.x.0 - Users can Add more poses, etc.
- [x] x.x.0 - Users can create custom flows
- [ ] x.x.0 - Users can create journal about Meditations
- [ ] x.x.0 - Users can create custom Mantras
- [ ] x.x.0 - Add section: Meditation, Mantra, Breathwork

### Known Bugs

**TITLE (as of DATE)**

**Twitter Auth Forbidden (as of 2024-07-26 16:18:25)**

Currently setup to use v5 of Auth.js. Provider must be tested from Vercel hosting due to TwitterX terms of use. When trying to login through provider I get a 403 error in the browser. No errors showing in Vercel. Just has redirect log to Twitter auth.

```
Jul 26 16:13:09.71
POST
302
soar-pqzo6upmv-trewaters-projects.vercel.app
/auth/signin/twitter
```

What you are experiencing is a feature 😉 ! Open a [github issue](https://github.com/Trewaters/soar/issues) if you disagree.

## Branches

1. [`main`](https://soar-main.vercel.app/) – mostly stable branch. Used for production deployment (publised to Vercel).
2. [`develop`](https://soar-develop.vercel.app/) - active work that is merged into main. Use this branch to check builds and pre-production deployment issues. Any work I started is a branch created from develop.
3. [`version_stable`](https://soar-jade.vercel.app/) - stable version this is the stable build of the most current version I am working on.
4. Feature/… - features I work on that could go merge into develop when complete.
   `version_010` - release version 0.1.0.

### Current internal "feature" branches

I create branches with the name of the feature I plan to work on. This way I keep my work seperated. If I don't finish I can come back to it, but it won't interfere with any other work I want to do on the app. These have been created organically and are due to change without notice because I am currently working alone.

- _"feature/app-theme-and-style":_ Update the app theme and style. Use professional themes as influence. [Link to "Style Guide" page](http://localhost:3000/styleGuide)
- _"feature/flow":_ Flow portions of the app. Views (Practice view), edit, create Asanas, Series and Sequences.
- _"feature/auth":_ Develop authentication, user roles, general app security, etc.
- _"feature/nav":_ Application navigation elements
- _"feature/profile":_ Work on the yogi user profile. Allow view, edit and shareable link of profile data.
- _"feature/posture-cards":_ Work on asana features. Allow view, edit, and create postures.

The "version" branches are locked after release.

I follow Semantic Versioning for releases. [Read more here](https://semver.org/) ...**[TLDR](https://semver.org/#spec-item-2)**: _"A normal version number MUST take the form X.Y.Z where X, Y, and Z are non-negative integers, and MUST NOT contain leading zeroes. X is the major version, Y is the minor version, and Z is the patch version. Each element MUST increase numerically. For instance: 1.9.0 -> 1.10.0 -> 1.11.0._

## DEVELOPER SECTION

### Prerequesites

Prereqs to work on this project..._(wip)_

### Installing

#### MongoDB

Installed MongoD locally for development purposes. Use Cloud services for production.

**Details**

install location:

```bash
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="c:\data\db"
```

```bash
mongod --version
```

**Starting MongoDB for local development**

1. Start app: `npm run dev`
2. Run with replica set in config: `mongod --config C:/data/config/mongod.conf`

**mongod.conf**

details of my current config file as of 2024-07-20 06:55:53.

```
# mongod.conf

# Where and how to store data.
storage:
  dbPath: c:/data/db

# where to write logging data.
systemLog:
  destination: file
  path: C:/data/log/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1  # Listen to local interface only, comment to listen on all interfaces.

# processManagement options
processManagement:
  pidFilePath: C:/data/mongod.pid  # location of pidfile

# Replica Set Config
replication:
  replSetName: "rs0"
```

### Tests

..._(wip)_

### Style Guide (look & feel)

[Style Guide](http://localhost:3000/styleGuide) for Happy Yoga. View this page to see fonts, colors, and letter sizing across the website.

### Coding Style

..._(wip)_

1. Prettier

### Deployment

**Deployed on Vercel**

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Changelog

**Types of changes**

- `ADD`: for new features.
- `UPDATE`: for changes in existing functionality.
- `DEPRECATE`: for soon-to-be removed features.
- `REMOVE`: for now removed features.
- `FIX`: for any bug fixes.
- `SECURITY`: in case of vulnerabilities.
- `AUDIT`: code clean up. Carefully removing unnecessary files.

### Development server

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Dev tip: sometimes I need to clear my npm cache so the versions are installed correctly

```bash
npm cache clean --force
```

**Prisma Databse**

Start using Prisma Client in Node.js (See: https://pris.ly/d/client)

```js
import { PrismaClient } from './prisma/generated/client'
const prisma = new PrismaClient()
```

or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)

```js
import { PrismaClient } from './prisma/generated/client/edge'
const prisma = new PrismaClient()
```

```bash
npx prisma generate
```

```bash
npm exec prisma db push
```

This is failing for mongodb at the moment (2024-08-09 06:22:38)

```bash
npm exec prisma migrate dev
```

### Running unit tests

execute the unit tests via **Jest** [Jest](https://jestjs.io/).

### Running end-to-end tests

execute the end-to-end tests via **?Test Kit** [Protractor](http://www.protractortest.org/).

### Linting

1. Eslint rules

### "Pushing good code"

QUESTION: "Am I pushing good code?"

_If you *Answer yes* to everything on the list below then you are pushing GREAT CODE!_

1. `npm run dev` and there aren't any errors in the server terminal or client (web browser) console.
2. `npm run build` no breaking build errors. Warnings are acceptable but should be minimized. Errors are not acceptable.
3. `npm run cover` to make sure no unit test are failing. Coverage goal is (A) 100%, (B) 90%, (C) 80%.
4. Push `develop` branch to hosting. Verify that the build was Successful and show **Ready** in vercel hosting. Then check how the app works on the web. Test with desktop and mobile device. Again checking the client (web browser) console for errors. "Click things and navigate around the app" especially any features your code touches.

## TO DO

### Next

_(in order of priority top to bottom)_

- User Profile (2024-09-07 07:48:17)
  - enable share icon, allow user to share the information in that area.
  - enable favorite "heart" icon, expand functionality later when there are user roles.
- Sequence (2024-08-24 08:43:39)
  - Views change… **_Practice view_** is “wheel of fortune” scrolling view, it highlights current pose (half screen magnification) while above and below are smaller. ; **_Study view_** allows a list view of the poses in the sequence.
- Clean up & add Quality,
  - QA, Quality analysis
  - Clean up UI. Start using Lighthouse for improvements.
  - Check accessibility
  - create header based on best practices
  - create footer based on best practices
  - Add loading skeleton to yogi profile.
  - Clean up data and database objects. Remove unused data fields. Add Player Tested feedback.
- Add Google Analytics (2024-08-24 08:44:21)
- Add Google Maps (2024-08-24 08:44:25)
- Hide (unfinished/unstarted) features behind a flag (2024-08-24 08:44:29)
  - Add user roles to application. Pass with the session. (dev, admin, tester, etc)
  - Restrict Features. Allow “My” (dev) role to see the features while work on them
  - Create series (etc) MUST be restricted to certain users.

### Anytime

- Finish setting up login access restrictions on all pages that need it (user profile, any submit pages like createSeries, etc.). Restricting access to features based on signing into their user profile. (2024-08-23 07:08:21)
- Add Frontend Services to call my back end apis. (2024-07-29 17:02:20)
- Add permanent IP Address to MongoDB Atlas Cluster whitelist for access. Upon deployment of non-alpha. So at the end of alpha phase of development. (2024-07-20 06:53:15)

### Further help

#### Create Release Milestones

Here is ChatGPT instructions on how to create release milestones that will use for my changelong under the "Versions" section.

To manage releases on GitHub like the example you saw with `https://github.com/Level/level/releases/tag/0.9.0`, you'll need to use GitHub's release management features. This allows you to create, edit, and view releases that group together iterations of your project, often marking different versions or milestones with tags.

Here’s a basic guide on how to create a release for your project on GitHub:

1. **Navigate to Your Repository**: Go to the main page of your repository on GitHub.
2. **Access Releases**: Click on the "Releases" section, usually found on the right sidebar under the "Code" tab.
3. **Draft a New Release**: Click on "Draft a new release" or the "Create a new release" button at the top of the release list.
4. **Tag Your Release**: Choose a tag for your release. You can select an existing tag or create a new one. If you create a new tag, you will need to specify which branch the tag is created from.
5. **Fill Out Release Information**: Add a title and a description for your release. Here, you can include detailed information about what’s included in the release, bug fixes, or new features.
6. **Attach Binaries** (optional): If you want to include compiled programs, executables, or binary files, you can attach them to the release.
7. **Mark as Pre-release** (if applicable): If the release is not yet ready for production and is considered unstable, you can mark it as a pre-release.
8. **Publish the Release**: Once you’ve configured all the details, click on "Publish release" to make it public. Alternatively, you can save it as a draft to continue working on it later.

To see your releases, you can visit the "Releases" section of your repository. If you haven't created any releases yet, this page will guide you to make your first one. Additionally, if GitHub Discussions is enabled, you can also link a discussion to your release for community interaction.

For your specific repository, you can start creating and managing releases by visiting [your project’s release section](https://github.com/Trewaters/soar/releases).

This process not only helps in managing different versions but also allows your users to download specific snapshots of the code and associated files.

#### TIPS: Release tags

When creating a new release in GitHub, the tags you choose can reflect your project's versioning strategy. Commonly, semantic versioning (SemVer) is used, which helps manage versions by conveying meaning about the underlying changes. Here are some suggested tags you could use based on the type of updates made to your project:

1. **Major Releases (`vX.0.0`)**: Use this for major changes that may include breaking changes or significant features. For example, `v2.0.0` indicates a significant jump that might include changes not backward compatible with `v1.x.x`.

2. **Minor Releases (`vX.Y.0`)**: Employ this tag for minor feature additions or improvements that are backward-compatible. For instance, `v1.3.0` could be a release that adds new functionalities to version `1.2.x` but does not break any existing functionality.

3. **Patch Releases (`vX.Y.Z`)**: This is for small bug fixes or security patches that do not affect the API or major components of the software. For example, `v1.3.1` might include a small bug fix on top of the `v1.3.0` release.

4. **Pre-release Versions**: For beta, alpha, or release candidates, you might use tags like `v1.4.0-alpha`, `v1.4.0-beta`, or `v1.4.0-rc.1`. These tags indicate that the release is not yet in its final form and is meant for testing.

5. **Build Metadata**: Sometimes, additional build metadata can be attached to a version, such as `v1.4.0+20210901` indicating a build made on September 1, 2021.

Using clear and consistent tags helps users and contributors understand the progression of your project and the stability of each release. For a detailed understanding of versioning and to get more insights on how to effectively manage your project releases, GitHub provides a helpful guide on [semantic versioning](https://semver.org/).

Implementing a good versioning strategy with appropriate tags ensures that your project's releases are predictable, manageable, and less prone to errors.
