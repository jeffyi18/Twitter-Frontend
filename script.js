// skipCount = 0, retrieveCount = 5, sort = [{createdAt: 'DESC'}], where = {type: ['tweet', 'retweet']}

// Function to fetch tweets from COMP 426 server and return them in a JSON array
export async function fetchTweets() {
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
      });
      console.log(result);
    return result.data;
}

// Function to create a new tweet
export async function createTweet(message) {
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: message,
        },
    });
    return result.data
    
}

// Function to create a new retweet
export async function createRetweet(message, parent) {
    
        const result = await axios({
            method: 'post',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
            data: {
                type: "retweet",
                parent: parent,
                body: message,
            },
        });
        return result.data
    
}

export async function createReply(message, parent) {
    
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            type: "reply",
            parent: parent,
            body: message,
        },
    });
    return result.data

}


// Function to get details about a specific Tweet
export async function readTweet(tweetID) {
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweetID,
        withCredentials: true,
    }).then(r => {return r});
    //return Promise.resolve(result.data);
}

// Function to update a Tweet
export async function updateTweet(tweetID, message) {
    const result = await axios({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweetID,
        withCredentials: true,
        data: {
          body: message
        },
      });
    return result.data;
}

// Function to permanently destroy a Tweet 
export async function destroyTweet(tweetID) {
    const result = await axios({
        method: 'delete',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweetID,
        withCredentials: true,
      });
    return result.data;
}

// Function to like a specific Tweet
export async function likeTweet(tweetID) {
    const result = await axios({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweetID + '/like',
        withCredentials: true,
      });
    return result.data;
}

// Function to unlike a specific Tweet
export async function unlikeTweet(tweetID) {
    const result = await axios({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweetID + '/unlike',
        withCredentials: true,
      });
    return result.data;
}
