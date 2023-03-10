# 🤔 Much Idea

Ultra simple heirarchical idea generator. [Check out the live application here](https://muchidea.web.app).

## Requirements

```
node >= v15.6.0 (npm >= v7.6.0)
firebase-tools >= v9.10.2
```

## Installation

```
git clone https://github.com/nafeu/muchidea.git
cd muchidea
npm install
```

## Setup

- Instantiate a new firebase project by clicking `+ Add project` in your [firebase console](https://console.firebase.google.com/u/1/).
- Create a new firebase webapp and save all the appropriate credentials.

Copy the example environment config like so:

```
cp .env-example .env
```

Fill in the firebase config values for your webapp in the `.env` file as specified:

```
REACT_APP_API_KEY=""
REACT_APP_AUTH_DOMAIN=""
REACT_APP_PROJECT_ID=""
REACT_APP_STORAGE_BUCKET=""
REACT_APP_MESSAGING_SENDER_ID=""
REACT_APP_APP_ID=""
REACT_APP_MEASUREMENT_ID=""
```

## Development

```
npm start
```

## Deployment

Make sure you are logged into firebase by running `firebase login` and then run the following:

```
npm run deploy
```

## Contributing

Feel free to open issues and PRs!

## License

[MIT](https://choosealicense.com/licenses/mit/)
