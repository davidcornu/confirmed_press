// confirmed_press.js
// https://github.com/davidcornu/confirmed_press
// May be freely distributed under the MIT license

(function(){

  var plugin = function($){
    $.fn.confirmedPress = function(callback){

      var isCanvasSupported = (function(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
      })();

      this.each(function(){
        $(this).on('mousedown touchstart', function(e){
          var that    = this;
          var $target = $(e.currentTarget);
          var width   = e.currentTarget.offsetWidth;
          var height  = e.currentTarget.offsetHeight;
          var bgImage = $target.css('background-image');

          $target.css('background-repeat', 'repeat-y');
          $target.css('background-position', 'center');
          $target.css('webkit-tap-highlight-color', 'rgba(0,0,0,0)');

          if(isCanvasSupported){
            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', 1);
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          }

          var resetState = function(){
            clearInterval(renderer);
            $target.css('background-image', bgImage);
          };

          $(e.currentTarget).one('mouseup touchend mouseout', resetState);

          var totalTime = 1 * 1000;
          var startTime = new Date().getTime();
          var now, timeSinceStart, lineWidth, bgValue;

          var runLoop = function(){
            timeSinceStart = (new Date().getTime()) - startTime;
            lineWidth = Math.floor((width / totalTime) * timeSinceStart);

            if(isCanvasSupported){
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillRect (0, 0, lineWidth, 1);

              bgValue = 'url(' + canvas.toDataURL('image/png') + ')';
              if(bgImage != 'none'){ bgValue += (', ' + bgImage); }
              $target.css('background-image', bgValue);
            }

            if(timeSinceStart >= totalTime){
              resetState();
              $target.trigger('confirmedPress');
              if(typeof(callback) === 'function'){ callback.call(that); }
            }
          };

          var renderer = setInterval(runLoop, 1000/30);
        });
      });
      return this;
    };
  };

  if(typeof(jQuery) !== 'undefined'){ plugin(jQuery); }
  if(typeof(Zepto)  !== 'undefined'){ plugin(Zepto);  }

})();