import {createRetweet, createReply, createTweet, destroyTweet, fetchTweets, likeTweet, unlikeTweet, updateTweet, readTweet} from './script.js'

let tweets = fetchTweets();
let loadedTweets = await tweets;

//<h4 class="liked">${likedMessage(Tweet.isLiked)}</h4>

export function likedColor(isLiked) {
    if (isLiked) {
        return "#ff0000";
    } else {
        return "#ffffff";
    }
}

export function liked(isLiked) {
    if (isLiked) {
        return "Unlike";
    } else {
        return "Like";
    }
}

export const renderTweet = function(Tweet) {
    // Code to put a Tweet's message, name of user, number of likes, number of retweets,
    // whether the current user has liked the tweet, a like button, a reply button, and a retweet button
    return `<div style="border: 1px solid black; width: 30%; margin: auto; background-color: #ffffff">
        <h2>${Tweet.author}</h2>
        <h3>${Tweet.body}</h3>
        <div>
            <Button style="background-color: ${likedColor(Tweet.isLiked)}" findId=${Tweet.id} id="like" class="button like-button">${Tweet.likeCount} Likes</Button>
            <Button findId="${Tweet.id}" findAuthor="${Tweet.author}" findMessage="${Tweet.body}" class="button reply-button">${Tweet.replyCount} Replies</Button>
            <Button findId="${Tweet.id}" findAuthor="${Tweet.author}" findMessage="${Tweet.body}" class="button retweet-button">${Tweet.retweetCount} Retweets</Button>
        </div>
    </div>`
}

export const renderMyTweet = function(Tweet) {
    return `<div style="border: 1px solid black; width: 30%; margin: auto; background-color: #ffffff">
        <h2>${Tweet.author}</h2>
        <h3>${Tweet.body}</h3>
        <div>
            <Button style="background-color: ${likedColor(Tweet.isLiked)}" findId="${Tweet.id}" id="like" class="button like-button">${Tweet.likeCount} Likes</Button>
            <Button findId="${Tweet.id}" findAuthor="${Tweet.author}" findMessage="${Tweet.body}" class="button reply-button">${Tweet.replyCount} Replies</Button>
            <Button findId="${Tweet.id}" findAuthor="${Tweet.author}" findMessage="${Tweet.body}" class="button retweet-button">${Tweet.retweetCount} Retweets</Button>
        </div>
        <div>
            <Button findId="${Tweet.id}" class="button edit-button">Edit</Button>
            <Button findId="${Tweet.id}" class="button delete-button">Delete</Button>
        </div>
    </div>`
}

export const renderTweetBodyForm = function(event) {
    return `<div>
    <form action="">
        <textarea name="" class="tweet-body" id="message" cols="60" rows="10" placeholder="Type something witty here"></textarea>
        <br></br>
        <button class="button submit-tweet" type="submit">Submit</button>
        <button class="button cancel-button" type="button">Cancel</button>
    </form>
    </div>`
}

export const handleLikeButtonPress = async function (event) {
    // Call likeTweet() or unlikeTweet()
    let id = event.target.getAttribute("findId");
    //let info = readTweet(id);
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    }).then(r => {return r});
    if (!result.data.isLiked) {
        //let tweet = likeTweet(id);
        const likeResult = await axios({
            method: 'put',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id + '/like',
            withCredentials: true,
          }).then(r => {return r});
        const read = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
            withCredentials: true,
        }).then(r => {return r});
        console.log("like");
        $(event.target).replaceWith(`<Button style="background-color: ${likedColor(read.data.isLiked)}" findId="${read.data.id}" id="like" class="button like-button">${read.data.likeCount} Likes</Button>`)
    } 
    if (result.data.isLiked) {
        //let tweet = unlikeTweet(id);
        const likeResult = await axios({
            method: 'put',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id + '/unlike',
            withCredentials: true,
          }).then(r => {return r});
        const read = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
            withCredentials: true,
        }).then(r => {return r});
        console.log("unlike");
        $(event.target).replaceWith(`<Button style="background-color: ${likedColor(read.data.isLiked)}" findId="${read.data.id}" id="like" class="button like-button">${read.data.likeCount} Likes</Button>`)
    }
    
}

export const handleReplyButtonPress = function (event) {
    // Call createTweet() with type reply
    let author = event.target.getAttribute("findAuthor");
    let message = event.target.getAttribute("findMessage");
    let id = event.target.getAttribute("findId");
    $(event.target).replaceWith(`<div>
    <form action="">
        <textarea name="" class="tweet-body" id="message" cols="60" rows="10" placeholder="Type something witty here"> Replying to ${author} - </textarea>
        <br></br>
        <button tweetType="reply" findAuthor="${author}" findId="${id}" findMessage="${message}" class="button submit-button" type="submit">Submit</button>
        <button findId="${id}" class="button reply-cancel" type="button">Cancel</button>
    </form>
    </div>`)
}

export const handleRetweetButtonPress = function (event) {
    // Call createTweet() with type retweet
    let author = event.target.getAttribute("findAuthor");
    let message = event.target.getAttribute("findMessage");
    let id = event.target.getAttribute("findId");
    //createRetweet("Retweeted from " + author + " - " + message, id);
    let tweet = createRetweet("Retweeted from " + author + " - " + message, id).then(async (r) => {
        const $root = $('#root');
        $root.empty();
        // rerender all tweets
        const result = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
        }).then(t => tweets = t.data);
        loadedTweets = tweets;
        $root.append(`<button class="button tweet-button"> TWEET SOMETHING </button> <br></br>`)
        for (let i = 0; i < loadedTweets.length; i++) {
            if (loadedTweets[i].isMine) {
                $root.append(renderMyTweet(loadedTweets[i]));
            } else {
                $root.append(renderTweet(loadedTweets[i]));
            }  
            $root.append(`<br></br>`);
        }
    });
}

export const handleTweetButtonPress = function (event) {
    $(event.target).replaceWith(renderTweetBodyForm());
}

export const handleTweetSubmitButtonPress = async function(event) {
    event.preventDefault();
    console.log("tweet")
    let tweetMessage = document.getElementById("message").value;
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: tweetMessage,
        }
    }).then(async (r) => {
        const $root = $('#root');
        $root.empty();
        // rerender all tweets
        const rerender = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
        }).then(t => tweets = t.data);
        loadedTweets = tweets;
        $root.append(`<button class="button tweet-button"> TWEET SOMETHING </button> <br></br>`)
        for (let i = 0; i < loadedTweets.length; i++) {
            if (loadedTweets[i].isMine) {
                $root.append(renderMyTweet(loadedTweets[i]));
            } else {
                $root.append(renderTweet(loadedTweets[i]));
            }  
            $root.append(`<br></br>`);
        }
    });
    $(event.target.parentNode.parentNode).replaceWith(`<button class="button tweet-button"> TWEET SOMETHING </button>`);

}

export const handleSubmitButtonPress = async function (event) {
    event.preventDefault();
    let tweet;
    let tweetMessage = document.getElementById("message").value;
    let tweetType = event.target.getAttribute("tweetType");
    let id = event.target.getAttribute("findId");
    let author = event.target.getAttribute("findAuthor");
    let message = event.target.getAttribute("findMessage");
    if (tweetType == "reply") {
        const result = await axios({
            method: 'post',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
            data: {
                type: "reply",
                parent: id,
                body: tweetMessage,
            },
        }).then(r => {return r});
        const readAgain = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
            withCredentials: true,
        }).then(r => {return r});
        $(event.target.parentNode.parentNode).replaceWith(`<Button findId="${id}" findAuthor="${author}" findMessage="${message}" class="button reply-button">${readAgain.data.replyCount} Replies</Button>`);
    } else if (tweetType == "edit") {
        tweet = updateTweet(id, tweetMessage).then(async (r) => {
            const $root = $('#root');
            $root.empty();
            // rerender all tweets
            const result = await axios({
                method: 'get',
                url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
                withCredentials: true,
            }).then(t => tweets = t.data);
            loadedTweets = tweets;
            console.log(loadedTweets)
            $root.append(`<button class="button tweet-button"> TWEET SOMETHING </button> <br></br>`)
            for (let i = 0; i < loadedTweets.length; i++) {
                if (loadedTweets[i].isMine) {
                    $root.append(renderMyTweet(loadedTweets[i]));
                } else {
                    $root.append(renderTweet(loadedTweets[i]));
                }  
            $root.append(`<br></br>`);
        }
            });
        $(event.target.parentNode.parentNode).replaceWith(`<Button findId="${id}" class="button edit-button">Edit</Button>`)
    }

}
 
export const handleEditButtonPress = function (event) {
    let author = event.target.getAttribute("findAuthor");
    let message = event.target.getAttribute("findMessage");
    let id = event.target.getAttribute("findId");
    $(event.target.parentNode).replaceWith(`<div>
    <form action="">
        <textarea name="" class="tweet-body" id="message" cols="60" rows="10" placeholder="Type something witty here"></textarea>
        <br></br>
        <button tweetType="edit" findAuthor="${author}" findId="${id}" findMessage="${message}" class="button submit-button" type="submit">Submit</button>
        <button class="button reply-cancel" type="button">Cancel</button>
    </form>
    </div>`);
}

export const handleDeleteButtonPress = function (event) {
    // Call destroyTweet on id of current tweet
    let id = event.target.getAttribute("findId");
    destroyTweet(id).then(async (r) => {
    const $root = $('#root');
    $root.empty();
    // rerender all tweets
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
    }).then(t => tweets = t.data);
    loadedTweets = tweets;
    console.log(loadedTweets)
    $root.append(`<button class="button tweet-button"> TWEET SOMETHING </button> <br></br>`)
        for (let i = 0; i < loadedTweets.length; i++) {
            if (loadedTweets[i].isMine) {
                $root.append(renderMyTweet(loadedTweets[i]));
            } else {
                $root.append(renderTweet(loadedTweets[i]));
            }  
            $root.append(`<br></br>`);
        }
    });
    //location.reload();
}

export const handleCancelButtonPress = function (event) {
    // Replace tweet text area with tweet button
    $(event.target.parentNode.parentNode).replaceWith(`<button class="button tweet-button"> TWEET SOMETHING </button>`);
}

export const handleReplyCancelButtonPress = async function (event) {
    // Replace tweet text area with tweet button
    let id = event.target.getAttribute("findId");
    const read = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    }).then(r => {return r});
    $(event.target.parentNode.parentNode).replaceWith(`<Button findId="${read.data.id}" findAuthor="${read.data.author}" findMessage="${read.data.body}" class="button reply-button">${read.data.replyCount} Replies</Button>`);
}

export  const loadTweetsIntoDOM = async function(tweets) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');
    $root.append(`<button class="button tweet-button"> TWEET SOMETHING </button> <br></br>`)
    for (let i = 0; i < tweets.length; i++) {
        if (tweets[i].isMine) {
            $root.append(renderMyTweet(tweets[i]));
        } else {
            $root.append(renderTweet(tweets[i]));
        }  
        // Comment for later
        /*if (tweets[i].replyCount > 0) {
            console.log(tweets[i].replyCount)
            let id = tweets[i].id;
            const result = await axios({
                method: 'get',
                url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
                withCredentials: true,
            }).then(r => {
                console.log(r)
                for (let j = 0; j < r.data.replies.length; j++) {
                    $root.append(renderTweet(r.data.replies[j]));
                    
                }
            })
            
        }*/
        $root.append(`<br></br>`);
        
        
        
    }
    $root.on("click", ".like-button", handleLikeButtonPress);
    $root.on("click", ".reply-button", handleReplyButtonPress);
    $root.on("click", ".retweet-button", handleRetweetButtonPress);
    $root.on("click", ".tweet-button", handleTweetButtonPress);
    $root.on("click", ".submit-button", handleSubmitButtonPress);
    $root.on("click", ".cancel-button", handleCancelButtonPress);
    $root.on("click", ".reply-cancel", handleReplyCancelButtonPress)
    $root.on("click", ".edit-button", handleEditButtonPress)
    $root.on("click", ".delete-button", handleDeleteButtonPress)
    $root.on("click", ".submit-tweet", handleTweetSubmitButtonPress)
}

/**
 * Use jQuery to execute the loadTweetsIntoDOM function after the page loads
 */
 $(function() {
    loadTweetsIntoDOM(loadedTweets);
});