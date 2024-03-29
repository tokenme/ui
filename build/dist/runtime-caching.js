// global.toolbox is defined in a different script, sw-toolbox.js, which is part of the
// GoogleChrome/sw-toolbox project.
// That sw-toolbox.js script must be executed first, so it needs to be listed before this in the
// importScripts() call that the parent service worker makes.
(function (global) {
  // See GoogleChrome/sw-toolbox
  // and https://github.com/GoogleChrome/sw-toolbox/blob/6e8242dc328d1f1cfba624269653724b26fa94f1/README.md#toolboxfastest
  // for more details on how this handler is defined and what the toolbox.fastest strategy does.
  global.toolbox.router.get('/(.*)', global.toolbox.fastest, {
    origin: /\.(?:googleapis|cloudfront|gstatic|firebaseio|appspot)\.com$/,
  });
  //global.toolbox.router.get('/*', global.toolbox.fastest);
}(self));