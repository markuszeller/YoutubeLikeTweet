// ==UserScript==
// @name        Youtube Tweet Like or Dislike
// @namespace   markuszeller.com
// @description Share on Twitter when you dislike a video on Youtube
// @include     https://www.youtube.com/*
// @version     0.2
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

/////////////////////////////////////////////////////////////////////
// PROGRAM START
/////////////////////////////////////////////////////////////////////

const twitterUrl = "https://twitter.com/intent/tweet?text=%TEXT%";

var likeButtons = [];

const getButtons = function () {
    likeButtons = document.querySelectorAll("#top-level-buttons button");
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
    template = template.replace('%URL%', document.location.href);
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
