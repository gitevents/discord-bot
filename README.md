# GitEvents Discord Bot

GitEvents is a set of automation tools and actions inspired by "Issue Ops". Events, talks, proposals etc. are powered by GitHub issues. This bot automatically creates the events on Discord.

The bot is triggered by [GitEvents Broadcast](https://github.com/gitevents/broadcast).

## Add the GitEvents Bot to your server

[Add Bot](https://discord.com/api/oauth2/authorize?client_id=989117237619208233&scope=bot&permissions=8589953024)

## Development

For your convenience, this bot is already deployed on Cloudflare Workers. If you'd like to run your own worker, please follow the instructions below.

- Install `wrangler` from Cloudflare: `npm i -g wrangler`
- Create an application and bot on the [Discord Developer Portal](https://discord.com/developers)
- Add the token, app id and public key to your Worker:
  ```
      wrangler secret put DISCORD_TOKEN
      wrangler secret put DISCORD_PUBLIC_KEY
      wrangler secret put DISCORD_APPLICATION_ID
  ```
- Run locally: `npm start`
- Deploy the worker: `npm run deploy`

## License

Licensed under [MIT](./LICENSE).
