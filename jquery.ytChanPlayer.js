/* jQuery Youtube Channel Player 0.1.2
 * Author: Marc Loehe (boundaryfunctions)
 * Based on jQuery.youtubeChannel by Miguel Guerreiro (dharyk)
 * Licensed under the MIT license
 */

(function ($) {
  "use strict";
	$.fn.ytChanPlayer = function (settings) {
		var $ytEl	= $(this),
			$ytPlayer,
			$ytList	= $('<ul/>', {'class': 'yt-channel-list'}),
			options	= $.extend({}, {
			  username: '',
			  query: '',
			  startIndex: 1,
			  maxResults: 10,
			  orderBy: 'published',
			  playerOpts: {
			    autohide: 1,
			    autoplay: 0,
			    egm: 1,
			    fs: 1,
			    showinfo: 0,
			    wmode: 'opaque'
			  }
			}, settings),
			videos	= [],
			// accessory functions
			buildUrl	= function () {
				var base	= 'https://gdata.youtube.com/feeds/api/videos',
					params	= [
					  'alt=json',
					  'orderby=' + options.orderBy,
					  'start-index=' + options.startIndex,
					  'max-results=' + options.maxResults
					];
				if (options.username !== '') {
					params.push('author=' + options.username);
				} else if (options.query !== '') {
					params.push('q=' + encodeURIComponent(options.query));
				}
				return base + '?' + params.join('&');
			},
			buildPlayer = function (id) {
			  if (id.length > 0) {
			    if (!$ytPlayer) {
			      $ytPlayer = $('<iframe/>', {'class': 'yt-player'});
			    }
			    var src = 'http://www.youtube-nocookie.com/embed/' + id,
			      opt;
			    if (options.playerOpts) {
            src += '?';
            for (opt in options.playerOpts) {
              if (options.playerOpts.hasOwnProperty(opt)) {
                src += opt + '=' + options.playerOpts[opt] + '&';
              }
            }
            src += '_a=b';
          }
			    $ytPlayer.attr('src', src).prependTo($ytEl);
			  }
			},
			zeroFill = function (number, width) {
        width -= number.toString().length;
        if (width > 0) {
          return [width + (/\./.test(number) ? 2 : 1) ].join('0') + number;
        }
        return (number).toString();
      },
			parseTime	= function (secs) {
				var m, s = parseInt(secs, 10);
				m = Math.floor(s / 60);
				s -= (m * 60);
				return m + ':' + zeroFill(s, 2);
			};
		// setup the html
		$ytEl.addClass('yt-channel-holder');
		$ytList.appendTo($ytEl);
		// parse the feed
		$.getJSON(buildUrl(), function (data) {
		  var i, html, vid, e;
			// add the header
			if (data.feed.entry) {
			  if (options.sticky) {
			    buildPlayer(options.sticky);
			  } else {
			    buildPlayer(data.feed.entry[0].id.$t.match('[^/]*$'));
			  }
				// add the items
				for (i = 0; i < data.feed.entry.length; i++) {
					e = data.feed.entry[i];
					vid = {
						link: (e ? e.media$group.media$player[0].url : ''),
						title: (e ? e.media$group.media$title.$t : ''),
						thumb:	(e ? e.media$group.media$thumbnail[1].url : ''),
						duration:	(e ? e.media$group.yt$duration.seconds : 0),
						views: (e && e.yt$statistics ? e.yt$statistics.viewCount : 0),
						id: (e ? e.id.$t.match('[^/]*$') : '')
					};
					html	= $('<li/>', {'class': 'yt-channel-video'})
				    .html([
					    '<a href="', vid.link, '" title="', vid.title, ' (', parseTime(vid.duration), ')" target="_blank">',
					    '<img class="vid-thumb" alt="', vid.title, '" src="', vid.thumb, '"/>',
					    '</a>'
				    ].join(''))
				    .data('id', vid.id).click(function (e) {
				      e.preventDefault();
				      options.playerOpts = $.extend(options.playerOpts, {autoplay: 1});
				      buildPlayer($(this).data('id'));
				    })
				    .css('opacity', '.7')
			      .hover(function () {
			        $(this).stop().animate({
			          opacity: '1'
			        }, 400);
			      }, function () {
			        $(this).stop().animate({
			          opacity: '.7'
			        }, 200);
			      });
					videos.push(vid);
					html.appendTo($ytList);
				}
			} else {
				$('<li/>', {'class': 'yt-channel-video'})
					.html('<a>NO RESULTS</a>').appendTo($ytList);
			}
		});
		return this;
	};
}(jQuery));
