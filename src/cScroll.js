/**
*
*
* @class cScroll
* @version 0.0.1
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

  function cScroll(nodeTrigger, nodeSwitch) {

    if (!(this instanceof cScroll)) return new cScroll(nodeTrigger, nodeSwitch);

    //this._state = false;

    this._nodeTrigger = nodeTrigger || document;
    this._nodeSwitch = nodeSwitch;

  	if (!this._nodeTrigger) {
  		throw new Error("missing trigger container");
  		return false
  	}
    if (!this._nodeSwitch) {
  		throw new Error("missing switch container");
  		return false
  	}

  	return this;
  }



  cScroll.prototype.on = function (cls, time) {

    this._nodeSwitch.style.transition = 'all '+time+'s';

    this._nodeTrigger.cScrollParam = {
      that: this,
      sl: this._nodeTrigger.scrollTop,
      cls: cls || 'onScroll',
      time: time || 2
    }
  	this._nodeTrigger.addEventListener('scroll', _h.handler);
  };

  var _h = {

    handler: function (e) {

      var that = e.target.cScrollParam.that;
      var sl = parseInt(e.target.cScrollParam.sl);
      var cls = e.target.cScrollParam.cls;
      var time = e.target.cScrollParam.time;

      if (!that || !cls || !time) {
        return false;
      }
      if (sl > that._nodeTrigger.scrollTop){

        console.log(' -up');

        that._nodeTrigger.removeEventListener('scroll', _h.handler);
        that._nodeSwitch.classList.remove(cls);
        setTimeout(function() {
          console.log('--up return!');
          e.target.cScrollParam.sl = that._nodeTrigger.scrollTop;
          that._nodeTrigger.addEventListener('scroll', _h.handler);
        }, (parseInt(time/2) *1000) );


      } else {

        console.log(' -down');

        that._nodeTrigger.removeEventListener('scroll', _h.handler);
        that._nodeSwitch.classList.add(cls);
        setTimeout(function() {
          console.log('--down return!');
          that._nodeTrigger.addEventListener('scroll', _h.handler);
          //that._state = false;
          e.target.cScrollParam.sl = that._nodeTrigger.scrollTop;

        }, (parseInt(time) *1000) +1000 );


      }


    }

  };

  return cScroll;
});
