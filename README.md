<div id="top"></div>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/stanleyclaudius/discussion-app">
    <img src="client/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Discussion App</h3>

  <p align="center">
    An awesome discussion application based on website
    <br />
    <a href="https://github.com/stanleyclaudius/discussion-app.git"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://discussme.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/stanleyclaudius/discussion-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/stanleyclaudius/discussion-app/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

**Discussion App** is a web application that allows their user to post and reply a forum that create by other user. Beside create and reply. user also can upvote or downvote a post or reply. This application also came with authentication features, such as login, register, logout, and also forget password functioanlity.

<p align="right"><a href="#top">back to top</a></p>

### Built With

Main technology used to built this application are listed below:

* [Typescript](https://www.typescriptlang.org/)
* [Next.js](https://nextjs.org/)
* [Chakra UI](https://chakra-ui.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [URQL](https://formidable.com/open-source/urql/)
* [GraphQL](https://graphql.org/)
* [TypeORM](https://typeorm.io/)
* [Redis](https://redis.com/)

<p align="right"><a href="#top">back to top</a></p>

## Getting Started

To get started with this project locally, follow below steps:

### Prerequisites

Make sure you have package manager (either npm or yarn), and also PostgreSQL on your machine.

>**FYI**: This project uses **yarn** as package manager, but you're free to use **npm** too.

* Install Yarn (Only for user who want to use **yarn**)
  ```
  npm i -g yarn
  ```
* Have PostgreSQL installed on your machine
* Have Redis installed on your machine, or use Redis Cloud credential

### Installation

Below steps will guide you through the local installation process of this application

1. Get your **Google Client ID**, **Google Client Secret**, and also **GMail Refresh Token** from [here](https://console.developers.google.com/)
2. Get your **Redis Cloud** credential from [here](https://redis.com/), if you don't have redis installed on your machine
3. Clone the repo
   ```
   git clone https://github.com/stanleyclaudius/discussion-app.git
   ```
4. Install project dependency<br />
Make sure that your terminal pointing at the root directory of this project (discussion-app folder).
   ```
   cd server && yarn install && cd client && yarn install
   ```
5. Complete the .env variable<br/>
Rename ```.env.example``` file at ```server``` directory become ```.env```, then fill the value for every key. Below is the guideline for filling the .env value:<br/>
    | Key | What To Fill | Example Value |
    | :---: | :---: | :---: |
    | PORT | Your server port | 5000 |
    | CLIENT_URL | Your client side URL | http://localhost:3000 |
    | DB_USER | Your PostgreSQL username | postgres |
    | DB_PASS | Your PostgreSQL password | root |
    | DB_NAME | Your database name | discussme |
    | GOOGLE_CLIENT_ID | Your google client ID | 3392348929324-tarur228dxxx |
    | GOOGLE_CLIENT_SECRET | Your google client secret | GOCSPX-xxxxxxx |
    | GMAIL_REFRESH_TOKEN | Your gmail refresh token | 1//028dhdjBMudu2829xxx |
    | MAIL_SENDER_ADDRESS | Email that want to be used to send mail | example@gmail.com |
    | COOKIE_NAME | Your application cookie name | qid |
    | SESSION_SECRET | Your session secret key | xy238djoIJAF_)0-_jdkfdh |
    | FORGET_PASSWORD_KEY_PREFIX | Your prefix for forget password redis key | discussme_forgetPassword_ |
    | REDIS_HOSTNAME | Your redis hostname | redis-19233.xxx |
    | REDIS_PORT | Your redis port number | 19233 |
    | REDIS_PASSWORD | Your redis password | eU82829djjfkxxx |
6. Create a database with name corresponding to your `DB_NAME` value at .env file
7. Change directory to client folder, and change your ```SERVER_URL``` (e.g. http://localhost:5000) at ```constant.js``` file
8. Lastly, spin off the application by running 2 terminal at the same time, with commands such as bellow:
    ```
    cd server && yarn dev-ts
    ```
    ```
    cd client && yarn dev
    ```

<p align="right"><a href="#top">back to top</a></p>

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right"><a href="#top">back to top</a></p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right"><a href="#top">back to top</a></p>

## Contact

LinkedIn: [Stanley Claudius](https://www.linkedin.com/in/stanley-claudius-4560b21b7)

Project Link: [https://github.com/stanleyclaudius/discussion-app](https://github.com/stanleyclaudius/discussion-app)

<p align="right"><a href="#top">back to top</a></p>

## Acknowledgments

Special thanks to:

* [Othneildrew](https://github.com/othneildrew) for providing an amazing README template.
* [React Icons](https://react-icons.github.io/react-icons/) for providing icon to be used in this application.
* [Chakra UI](https://chakra-ui.com/) for providing styled React component to be used in this application.
* [Heroku](https://herokuapp.com) for providing backend hosting service for this application.
* [Vercel](https://vercel.com) for providing frontend hosting service for this application.
* [Redis Labs](https://redis.com/) for providing cloud Redis to be used in this application


<p align="right"><a href="#top">back to top</a></p>

[forks-shield]: https://img.shields.io/github/forks/stanleyclaudius/discussion-app.svg?style=for-the-badge
[forks-url]: https://github.com/stanleyclaudius/discussion-app/network/members
[stars-shield]: https://img.shields.io/github/stars/stanleyclaudius/discussion-app.svg?style=for-the-badge
[stars-url]: https://github.com/stanleyclaudius/discussion-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/stanleyclaudius/discussion-app.svg?style=for-the-badge
[issues-url]: https://github.com/stanleyclaudius/discussion-app/issues
[license-shield]: https://img.shields.io/github/license/stanleyclaudius/discussion-app.svg?style=for-the-badge
[license-url]: https://github.com/stanleyclaudius/discussion-app/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/stanley-claudius-4560b21b7