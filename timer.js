(function () {
  var timers = {}, id = 0, w = new Worker(URL.createObjectURL(new Blob(['var ids={};onmessage=function(e){if(e.data.length===1){clearTimeout(ids[e.data[0]]);delete ids[e.data[0]]}else{ids[e.data[1]]=self[e.data[0]](function(){postMessage(e.data[1])},e.data[2])}}'])));
  window.setTimeout = function (f, delay) {
    timers[++id] = arguments;
    w.postMessage(['setTimeout', id, delay]);
    return id;
  };
  window.setInterval = function (f, delay) {
    timers[++id] = arguments;
    w.postMessage(['setInterval', id, delay]);
    return id;
  };
  window.clearTimeout = window.clearInterval = function (id) {
    delete timers[id];
    w.postMessage([id]);
  };
  w.onmessage = function (event) {
    var args = timers[event.data];
    if (!args)
      return;
    if (typeof args[0] === 'function')
      args[0].apply(window, Array.prototype.slice.call(args, 2));
    else
      eval(args[0]);
  };
})();
