# CartQL

> GraphQL Shopping Cart API. The only shopping cart API designed to work with your existing frontend or backend.

## Using the API

All requests can be made to `https://api.cartql.com` or you can run your own instance.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cartql/cartql)

## Development

If you want to run this locally and contribute, you'll need the Heroku CLI, MongoDB, Node and Yarn installed to get going.

```
yarn
cp .env.sample .env # populate values
yarn dev
heroku local -f Procfile.dev
```
