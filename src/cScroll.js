/**
*
*
* @class cScroll
* @version 0.0.2
* @license MIT
*
* @author Christian Marienfeld post@chrisand.de
*
*/


(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    module.exports = mod();
  else if (typeof define == "function" && define.amd) // AMD
    return define([], mod);
  else // Plain browser env
    (this || window).cScroll = mod();
})(function() {

  "use strict";

  function cScroll(nodeTrigger) {

    if (!(this instanceof cScroll)) return new cScroll(nodeTrigger);

    this._nodeTrigger = document.querySelector(nodeTrigger) || document;
  	if (!this._nodeTrigger) {
  		throw new Error("missing trigger container");
  		return false
  	}
    this._nodeTrigger._elms = [];

  	return this;
  }



  cScroll.prototype.on = function (query, cls, param) {

    if (!query) {
  		throw new Error("missing element query ");
  		return false;
  	}

    var data = _h.prepare(query, cls, param);
    if (!data) {
      throw new Error("missing data");
  		return false;
    }
    this._nodeTrigger._elms.push(data);

    _h.setVendor(data.elm, 'transition', 'all '+data.step+'s' );

    this._nodeTrigger._lastScrollTop = this._nodeTrigger.scrollTop;
  	this._nodeTrigger.addEventListener('scroll', _h.handler);
  };

  var _h = {

    prepare: function (query, cls, param) {

      if (!query || !cls) {

      }
      var elm = document.querySelector(query);
      if (!elm) {
    		throw new Error("missing element");
    		return false;
    	}

      if (cls && typeof cls === 'object' && cls.length > 0) {

      } else if (cls && typeof cls === 'string') {
        cls = [cls];
      } else {
        cls = ['onScroll'];
      }

      var data = {
        state: true,
        query: query,
        elm: elm,
        cls: cls,

        time: 2,
        step: 2,
        delayUp: 10,
        delayDown: 10,
        resetUp: 1,
        resetDown: 1
      };

      if (param) {
    		for (var i in param) {
    			if(param.hasOwnProperty(i)){
    				data[i] = param[i];
    			}
    		}
    	}

      data.step = data.time / data.cls.length || data.time;

      return data || false;
    },
    setVendor: function(element, property, value) {
      element.style[property] = value;
      element.style["webkit" + property] = value;
      element.style["moz" + property] = value;
      element.style["ms" + property] = value;
      element.style["o" + property] = value;
    },

    handler: function (event) {


      var root = this;

      var reset = function(delay, callback) {
        setTimeout(function(c) {
          if (c && typeof c === 'function') { c(); }
          root._lastScrollTop = root.scrollTop;
        }, delay* 1000, callback );
      };


      if (root._lastScrollTop > root.scrollTop) {

        // UP
        for (var e = 0; e < root._elms.length; e++) {

          if (root._elms[e].state == false) {
            continue;
          }
          if (root._elms[e].delayUp && root._lastScrollTop - root._elms[e].delayUp > root.scrollTop) {
            //console.log('- up', root._elms[e].query);
            root._elms[e].state = false;
            var a = 0;
            for (var i = root._elms[e].cls.length-1; i >= 0 ; i--) {
              setTimeout(function(b, elm) {
                //console.log('--- do ',  elm.cls[b]);
                elm.elm.classList.remove(elm.cls[b]);
                if (b == 0) {
                  reset(elm.resetUp, function() {
                    elm.state = true;
                  });
                }
              }, (root._elms[e].step*1000)*a, i, root._elms[e] );
              a++;
            }
          }
        }

      } else {

        // DOWN
        for (var e = 0; e < root._elms.length; e++) {
          if (root._elms[e].state == false) {
            continue;
          }
          if (root._elms[e].delayDown && root._lastScrollTop + root._elms[e].delayDown < root.scrollTop) {
            //console.log('- down', root._elms[e].query);
            root._elms[e].state = false;
            for (var i = 0; i < root._elms[e].cls.length; i++) {
              setTimeout(function(b, elm) {
                //console.log('--- do ',  elm.cls[b]);
                elm.elm.classList.add(elm.cls[b]);
                if (b == elm.cls.length -1) {
                  reset(elm.resetDown, function() {
                    elm.state = true;
                  });
                }
              }, (root._elms[e].step*1000)*i, i, root._elms[e] );
            }
          }
        }

      }

    }
  };

  return cScroll;
});
