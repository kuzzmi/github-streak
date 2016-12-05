![](https://travis-ci.org/kuzzmi/github-streak.svg?branch=master)

# github-streak

The purpose of github-streak is to monitor a GitHub repository and collect short-term information about contributions, triggering a webhook based on the event.

# Use case

Example: you have a pretty active team and you want to gamify the workflow by displaying "Double kill!" message in a connected Slack channel, when somebody makes a double commit, or "RA-A-AMPAGE" on 6 sequential commits.

# What is done now

Currently it works only by posting a formatted message about each commit to a given Slack webhook URL.

More integrations and event types will come soon.

# How to use

NOTE: Usually it's good to have this running on a free Heroku server, or a local Raspberry Pi.

1. Define an environmental variable `SLACK_WEBHOOK_URL` with an address of your Slack Webhook.
2. Run `npm start` on a remote always working machine (e.g. Heroku app)
3. Add a webhook to your GitHub repository to post `push` events to `.../webhooks/push` endpoint.
4. Flexible configuration is comming, but for now to change event message templates you need to fork a repo and update `config.json`.

# Configuration

Templates are defined in `config.json` file in `events` in a following way:
```
"EVENT_TYPE": "TEMPLATE"
```

Available message replacements in templates:
1. `%an` - author name
2. `%au` - author username
3. `%ae` - author email
4. `%cm` - commit message

Example (see `config.json`):
```
{
    "events": {
        "COMMIT": "%an made a commit: %cm",
    }
}
```

# To-do

* think about other use cases :)
* monitor BitBucket or other git repository
* monitor private repositories
* add more event types and replacers:
```
"FIRST_COMMIT": "%an opened a coding day by pushing his first commit at %cd: %cm",
"DOUBLE_COMMIT": "%an got a double commit!",
"TRIPLE_COMMIT": "%an got a triple commit!"
```
* moar
...

# Contributions

...are always welcome.

Tests can be found in `/tests` folder and be run by `npm test` or `npm run test:watch` to continuously run tests on a file change.

# Credits

[Igor Kuzmenko](https://kuzzmi.com)
