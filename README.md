![](https://travis-ci.org/kuzzmi/github-streak.svg?branch=master)

# github-streak

The purpose of github-streak is to monitor a GitHub repository and collect short-term information about contributions, triggering a webhook based on the event.

# Use case

Example: you have a pretty active team and you want to gamify the workflow by displaying "Double kill!" message in a connected Slack channel, when somebody makes a double commit, or "RA-A-AMPAGE" on 6 sequential commits.

# How to use

Available message replacements:
1. `%a` - author name
2. `%au` - author username
3. `%cm` - commit message
4. `%cd` - commit date

```
{
    "EVENT_TYPE": "TEMPLATE"
}
```

Example:
```
{
    "FIRST_COMMIT": "%a opened a coding day by pushing %cm",
    "DOUBLE_COMMIT": "%a got a double commit!",
    "TRIPLE_COMMIT": "%a got a triple commit!"
}
```

# To-do

* think about other use cases :)
* monitor BitBucket or other git repository
* monitor private repositories
...
