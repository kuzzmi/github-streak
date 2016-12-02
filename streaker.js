const contributions = {};

module.exports.addContribution = (contribution) => {
    const { author } = contribution;
    contributions[author] = contribution;
};
module.exports.getContributions = () => {
    return contributions;
};
