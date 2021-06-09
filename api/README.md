# Classifieds System
Welcome fellow developer!
This is a classifieds system that is being developed to create a new and improved classifieds experience.

## Getting Started

1. Install Dependencies:
    1. The database runs on [docker](https://www.docker.com/products/docker-desktop). In the `/data` directory you will see a `docker-compose.yml` file. This will spin up a postgres DB. Download docker and docker compose [here](https://www.docker.com/products/docker-desktop).
    2. The API is written in [Typescript](https://www.typescriptlang.org/) a superset of JavaScript. You will need to have NodeJS installed. Here are [instructions](https://nodejs.org/en/download/) to download and install NodeJs on your OS.
    3. Once node is installed. Navigate to `api` and in your command line tool, run `npm install`. This will download all the needed dependencies to run the api.
1. Start the Database (DB): Navigate to `/data` and run the following command: `docker-compose up -d`. The database should be running in the background.

1. Start the API.
    1. Compile the Typescript code by navigating to `/api` and running the following command `tsc`
    2. Then run `node dist/app.js`
    3. You should see the message: `Server has started!`
    4. To run this with hot reloading (no restart needed if code changes), then instead run `tsc -w` in one command shell and `nodemon dist/app.js` in another. Nodemon will need to be installed.


## Contribution Strategy
* Trunk based branching strategy(master) and no other long lived branches
* make small PRs even if feature is not complete
* Will employ CI/CD best practices for continual deployment of master branch when we are live
* Utilize Dependency Injection to make code more easily testable

### Testing
* Jest framework should be sufficient for most unit tests.


## TODO's

* Develop a SPA web frontend in React and Typescript
* Develop a React Native mobile client (Typescript if possible) or make it a PWA (I am leaning more installable native route)
* Create front end designs and wireframes
* Research integration and end to end testing frameworks/libraries