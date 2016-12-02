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
    const { author, sha1 } = contribution;

    if (!usedHashes[sha1]) {
        byAuthor[author] = byAuthor[author] || [];
        byAuthor[author].unshift(contribution);
        usedHashes[sha1] = true;
    }

    return byAuthor;
};

module.exports.getContributions = () => {
    return byAuthor;
};
