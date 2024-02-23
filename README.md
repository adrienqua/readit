This is a [Symfony 5.3](https://symfony.com/) and [React](https://fr.react.dev/) project.

## About
Readit is a content feed single page application inspired by Reddit with publications, vote and like feature, infinite nested comments and more.

## Requirements
Node 16+ [Node](https://nodejs.org/en)

PHP 8.0 [PHP](https://www.php.net/)

Symfony cli [Symfony](https://symfony.com/download)

## Getting Started
Run the commands:
```bash
composer install
npm install
```

Add your database informations in the .env file.
Then run the command:
```bash
php bin/console doctrine:schema:create
```

Run the development server:
```bash
symfony serve
npm run dev-server
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

