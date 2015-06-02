/* jQuery Youtube Channel Player 0.2.0
 * Author: Marc Löhe <marc@marcloehe.de>
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  $.fn.ytChanPlayer = function (settings) {
    var $ytEl = $(this),
      $ytList = $('<ul/>', {'class': 'yt-channel-list'}),
      $ytPlayer,
      $ytPlayerWrapper,
      options = $.extend({}, $.fn.ytChanPlayer.defaults, settings),
      playerInitialized = false,
      videos = [],

    // Utility functions
      buildYoutubeEmbedUrl = function (videoId) {
        var url = 'http://www.youtube.com/embed/' + videoId;
        if (options.playerOpts) {
          url += '?' + $.param(options.playerOpts);
        }
        return url;
      },

      buildPlayer = function (videoId) {
        if (videoId.length > 0) {
          if (!$ytPlayer) {
            $ytPlayerWrapper = $('<div/>', {class: 'yt-player-wrapper'});
            $ytPlayer = $('<iframe/>', {class: 'yt-player'}).prependTo($ytPlayerWrapper);
            $ytPlayerWrapper.prependTo($ytEl);
          }
          $ytPlayer.attr('src', buildYoutubeEmbedUrl(videoId));
          playerInitialized = true;
        }
      },

      insertIntoPlaylist = function (videoObject) {
        var $listItem, $anchor;
        $listItem = $('<li/>', {'class': 'yt-channel-video'});

        $anchor = $('<a/>', {
          href: videoObject.embedUrl,
          title: videoObject.title,
          target: '_blank',
          'data-id': videoObject.videoId
        }).appendTo($listItem);

        $('<img/>', {
          class: 'vid-thumb',
          alt: videoObject.title,
          src: videoObject.thumbnail
        }).appendTo($anchor);

        $listItem.appendTo($ytList);
        videos.push(videoObject);
      },

      hasNested = function (obj /*, level1, level2, ... levelN*/) {
        var args = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < args.length; i++) {
          if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
          }
          obj = obj[args[i]];
        }
        return true;
      };

    // DOM Setup
    $ytEl.addClass('yt-channel-holder');
    $ytList.on('click', '.yt-channel-video a',function (e) {
      e.preventDefault();
      options.playerOpts = $.extend(options.playerOpts, {autoplay: 1});
      buildPlayer($(this).data('id'));
    }).appendTo($ytEl);

    // Get channel data
    $.get('https://www.googleapis.com/youtube/v3/channels', {
      part: 'contentDetails',
      key: options.apiKey,
      forUsername: options.username
    })
      .then(function (res, textStatus, jqXHR) {
        var req;
        if (res.items && res.items[0] && hasNested(res.items[0], 'contentDetails', 'relatedPlaylists', 'uploads')) {
          req = {
            part: 'snippet',
            key: options.apiKey,
            playlistId: res.items[0].contentDetails.relatedPlaylists.uploads,
            maxResults: options.maxResults
          };
          return $.get('https://www.googleapis.com/youtube/v3/playlistItems', req);
        } else {
          return $.Deferred().reject(res, 'Unable to fetch playlist items.', jqXHR).promise();
        }
      })
      .then(function (res, textStatus, jqXHR) {
        if (res.items && res.items.length) {
          $.each(res.items, function (i, item) {
            var video;
            if (!hasNested(item, 'snippet', 'resourceId', 'videoId')) {
              return true; // Skip to next item
            }

            video = {
              videoId: item.snippet.resourceId.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.default.url
            };
            video.embedUrl = buildYoutubeEmbedUrl(video.id);

            if (!playerInitialized) {
              buildPlayer(options.sticky || item.snippet.resourceId.videoId);
            }

            insertIntoPlaylist(video);
          });
        } else {
          return $.Deferred().reject(res, 'Unable to fetch playlist items.', jqXHR).promise();
        }
      })
      .fail(function (res, textStatus, jqXHR) {
        if (options.debug) {
          console.log('Error: ' + textStatus);
        }
      });

    return this;
  };

  $.fn.ytChanPlayer.defaults = {
    apiKey: '',
    username: '',
    maxResults: 10,
    debug: false,
    playerOpts: {
      autohide: 1,
      autoplay: 0,
      fs: 1,
      showinfo: 0
    }
  };

}(jQuery));