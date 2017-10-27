const GitHub = require('./GitHub');
const { Site, User } = require('../models');

const checkGithubRepository = ({ user, owner, repository }) =>
  GitHub.getRepository(user, owner, repository).then((repo) => {
    if (!repo) {
      throw {
        message: `The repository ${owner}/${repository} does not exist.`,
        status: 400,
      };
    }
    if (!repo.permissions.push) {
      throw {
        message: 'You do not have write access to this repository',
        status: 400,
      };
    }
    return true;
  });

const paramsForExistingSite = siteParams => ({
  owner: siteParams.owner ? siteParams.owner.toLowerCase() : null,
  repository: siteParams.repository ? siteParams.repository.toLowerCase() : null,
});

const throwExistingSiteErrors = ({ site, user }) => {
  if (!site) {
    const error = new Error('The site you are trying to add does not exist');
    error.status = 404;
    throw error;
  }

  const existingUser = site.Users.find(candidate => candidate.id === user.id);
  if (existingUser) {
    const error = new Error("You've already added this site to Federalist");
    error.status = 400;
    throw error;
  }

  return checkGithubRepository({ user, owner: site.owner, repository: site.repository });
};

const createSiteMembership = ({ user, siteParams }) => {
  let site;

  return Site.findOne({ where: paramsForExistingSite(siteParams), include: [User] })
  .then((fetchedSite) => {
    site = fetchedSite;
    return throwExistingSiteErrors({ site, user });
  }).then(() =>
    site.addUser(user)
  ).then(() => site);
};

module.exports = { createSiteMembership };
