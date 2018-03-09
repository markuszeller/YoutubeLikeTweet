// ==UserScript==
// @name        Youtube Tweet Like or Dislike
// @namespace   markuszeller.com
// @description Share on Twitter when you dislike a video on Youtube
// @include     https://www.youtube.com/*
// @version     0.4
// @grant       none
// @author      Markus Zeller - @n4cer on Twitter
// @downloadURL https://github.com/markuszeller/YoutubeLikeTweet/youtube_tweet_like.js
// @updateURL   https://github.com/markuszeller/YoutubeLikeTweet/youtube_tweet_like.js
// ==/UserScript==

"use strict";

/////////////////////////////////////////////////////////////////////
// CONFIG START
/////////////////////////////////////////////////////////////////////

// Configure your text on like or dislike

// Placeholder for Youtube-URL: %URL%
// Placeholder for Video-Title: %TITLE%
const LikeText = "Ich mag das @YouTube-Video: %URL% %TITLE%";
const DislikeText = "Ich finde das @YouTube-Video scheiße: %URL% %TITLE%";

// Like and Dislike will get a style for border-bottom when ready to use
const borderStyle = "2px solid darkgreen";

// Keep only video ID and timestamp parameters
const cleanURL = true;

/////////////////////////////////////////////////////////////////////
// PROGRAM START
/////////////////////////////////////////////////////////////////////

const twitterUrl = "https://twitter.com/intent/tweet?text=%TEXT%";

var likeButtons = [];

const getButtons = function () {
    likeButtons = document.querySelectorAll("#info button");
    if (!likeButtons.length)
    {
        window.setTimeout(getButtons, 1000);
        return;
    }
    setButtons();
};

getButtons();

function setButtons()
{
    var likeButton = likeButtons[0];
    var dislikeButton = likeButtons[1];

    likeButton.addEventListener('click', function () {
        share(LikeText);
    });
    likeButton.style.borderBottom = borderStyle;

    dislikeButton.addEventListener('click', function () {
        share(DislikeText);
    });
    dislikeButton.style.borderBottom = borderStyle;
}

function share(template)
{
    var titleElement = document.querySelector('h1.title');
    if (!titleElement)
    {
        console.warn("Could not find video title.");
        return;
    }

    var title = titleElement.textContent;
    template = template.replace('%URL%', getCleanURL());
    template = template.replace('%TITLE%', title);

    var sharerUrl = twitterUrl;
    sharerUrl = sharerUrl.replace('%TEXT%', encodeURIComponent(template));

    var body = document.getElementsByTagName("body")[0];
    var anchor = document.createElement("a");
    anchor.setAttribute("href", sharerUrl);
    anchor.setAttribute("target", "_blank");
    anchor.style.display = "none";
    var shareTrigger = body.appendChild(anchor);
    if (!shareTrigger)
    {
        console.warn("Error injection sharer.");
        return;
    }
    shareTrigger.click();
}

function keepFilter(segment)
{
    let [key, value] = segment.split("=");
    let cleanKey = key.replace("?", "");
    return (cleanKey === "v" || cleanKey === "t");
}

function getCleanURL()
{
    let url = document.createElement("a");
    url.href = document.location.href;
    if(!cleanURL) return url;

    let segments = url.search.split("&");
    if(!segments) return url;

    segments = segments.filter(keepFilter);
    url.search = segments.join("&");

    return url;
}
