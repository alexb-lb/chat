/**
 * Created by alex on 04.02.18.
 */
const Matches = require('../classes/class_matches');
const matches = new Matches();

module.exports = {
  // get non-liked pair candidate to show on dating page
  getCandidate(send, userId, profileId){
    matches.getNewCandidate(userId, profileId);
  },

  // user likes candidate from slider
  setCandidateLike(send, userId, profileId){
    matches.like(userId, profileId);
  }
};