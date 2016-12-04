const slack = require('./integrations/slack.js');

const byAuthor = {};
const usedHashes = {};

module.exports.empty = () => {
    const authors = Object.keys(byAuthor);
    const hashes = Object.keys(usedHashes);
    authors.forEach(author => {
        delete byAuthor[author];
    });
    hashes.forEach(hash => {
        delete usedHashes[hash];
    });
};

module.exports.addContribution = (contribution) => {
    const { author, id } = contribution;

    if (!usedHashes[id]) {
        byAuthor[author.username] = byAuthor[author.username] || [];
        byAuthor[author.username].unshift(contribution);
        usedHashes[id] = true;
    }

    slack.post({
        commit: contribution,
        type: 'COMMIT'
    });

    return byAuthor;
};

module.exports.getContributions = () => {
    return byAuthor;
};
