## STEPS to run this program

1. Change `/public/jsconfig.js` to your own configuration.
2. Create `.env` file and add `APIKEY` and `DATABASE` based on firebase config.
3. `npm install`
4. `npm run build`
5. `firebase login`
6. `firebase init`
7. `firebase serve` for local testing
8. `firebase deploy` for online deployment

## Firebase Feature

- Storage
- AppCheck
- RealTime Database
- Hosting
- Authentication

## Concepts

- This firebase project is based on SDK method
- Since the browser doesn't support `module`, a bundler `webpack` is implemented in this project to bundle all the `.js` file
- `.env` file is used to store senstivie information for security reason, which makes google more likely not to mark your website dangerous
- Contact google via Google Cloud Console if the website is still considered dangerous by google. It usually takes 2 days to remove the dangerous mark.
-

## Demo

[LINK](https://notstatic-33718.web.app/)
