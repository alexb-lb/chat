class Matches {
  constructor(userId){

  }

  // get non-liked pair candidate to show on dating page
  getNewCandidate(userId, profileId){
    // something like Favorites and Fans from PickBride
    // first get candidates who liked user
    // then candidates that user not saw or not liked
    // mix them and send back
  }

  // insert into Likes collection new document
  like(userId, profileId){
    // userId likes profileId
  }
}

module.exports = Matches;