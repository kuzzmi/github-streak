const slack = require('./integrations/slack.js');
const config = require('../config');

const contributions = {};
const usedHashes = {};

const multiCommits = {};
const streaks = {};

const timers = {};

const MULTI_EVENTS = {
    1: 'COMMIT',
    2: 'DOUBLE_COMMIT',
    3: 'TRIPLE_COMMIT',
    4: 'ULTRA_COMMIT',
    5: 'RAMPAGE_COMMIT'
};

const STREAK_EVENTS = {
    3: 'COMMITTING_SPREE',
    4: 'DOMINATING',
    5: 'MEGA_COMMIT',
    6: 'UNSTOPPABLE',
    7: 'WICKED_SICK',
    8: 'MONSTER_COMMIT',
    9: 'GODLIKE',
    10: 'BEYOND_GODLIKE'
};

const initTimer = commit => {
    const author = commit.author.username;
    let count = multiCommits[author] || 1;
    if (timers[author]) {
        count++;
        clearTimeout(timers[author]);
    }
    multiCommits[author] = count;
    timers[author] = setTimeout(function() {
        delete timers[author];
        slack.post({
            commit,
            type: MULTI_EVENTS[count]
        });
    }, config.multi_timeout);
};

module.exports.empty = () => {
    const authors = Object.keys(contributions);
    const hashes = Object.keys(usedHashes);
    authors.forEach(author => {
        clearTimeout(timers[author]);
        delete timers[author];
        delete streaks[author];
        delete multiCommits[author];
        delete contributions[author];
    });
    hashes.forEach(hash => {
        delete usedHashes[hash];
    });
};

module.exports.addContribution = contribution => {
    const { author, id } = contribution;

    if (!usedHashes[id]) {
        contributions[author.username] = contributions[author.username] || [];
        contributions[author.username].unshift(contribution);
        usedHashes[id] = true;
    }

    initTimer(contribution);

    slack.post({
        commit: contribution,
        type: MULTI_EVENTS[1]
    });

    return contributions;
};

// мы создаем таймер и вставляем в хеш
// {
//      author_name: timeout
// }
// затем, если таймер там уже есть - обновляем 
// multiCommits = { author_name: 4 };
// streaks = {};
// {
//      author_name: timeout
// }

module.exports.getContributions = () => {
    return contributions;
};
