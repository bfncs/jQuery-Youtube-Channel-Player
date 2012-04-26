# jQuery Youtube Channel Player

## Widget to show videos from a Youtube channel with a player
* Author: Marc Loehe (boundaryfunctions)
* Based on [jQuery.youtubeChannel](https://github.com/dharyk/jQuery.youtubeChannel) by Miguel Guerreiro (dharyk)
* Licensed under the MIT license (see MIT-LICENSE.txt)

## Demo

You can find a demo here: http://boundaryfunctions.github.com/jQuery-Youtube-Channel-Player/

## Usage

### Basic

    $('#ytChanPlayer').ytChanPlayer({
      username: 'youtube',
    });

### Options


* `username` - username to show channel for
* `query` - query to limit which channel videos should be played
* `startIndex: 1` - index of the first matching result that should be included in the result set
* `maxResults: 10` - maximum number of results that should be included in the result set
* `orderBy: published` - method that will be used to order entries (valid for this parameter: published, relevance, viewCount, rating)
* `sticky` - Youtube ID for a video always shown first
* `playerOpts` - an object with options for the embedded player
  * `autohide: 1` - whether the video controls will automatically hide after a video begins playing
  * `autoplay: 0` - whether or not the initial video will autoplay when the player loads
  * `egm: 1` - whether the the genie menu (if present) will appear when the user's mouse enters the video display area, as opposed to only appearing when the menu button is pressed
  * `fs: 1` - whether the fullscreen button in the embedded player is enabled
  * `showinfo: 0` - whether information like the video title and uploader should be displayed before the video starts playing
  * Additionally all [documented API options](https://developers.google.com/youtube/player_parameters) will work.

## Changelog


### v 0.1.1

  * Added sticky option

### v 0.1

  * Initial commit
