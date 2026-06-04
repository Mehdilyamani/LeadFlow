(function () {
  var el = document.currentScript || document.querySelector('script[src*="leadflow-widget.js"]');
  var agency = (el && el.getAttribute('data-agency')) || 'Prestige Immobilier';

  // Derive base URL from script src so it works on any domain
  var src = (el && el.getAttribute('src')) || '';
  var baseUrl = src.replace(/\/leadflow-widget\.js(\?.*)?$/, '');
  if (!baseUrl) baseUrl = window.location.origin;

  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/widget?agency=' + encodeURIComponent(agency);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('scrolling', 'no');
  iframe.style.cssText = [
    'position:fixed',
    'bottom:0',
    'right:0',
    'width:410px',
    'height:580px',
    'border:none',
    'z-index:9999',
    'background:transparent',
    'overflow:hidden',
    'pointer-events:none',   /* lets clicks pass through the empty area */
  ].join(';');

  // Re-enable pointer events only on the widget content via postMessage
  window.addEventListener('message', function (e) {
    if (e.data === 'leadflow:enable-pointer') {
      iframe.style.pointerEvents = 'auto';
    }
    if (e.data === 'leadflow:disable-pointer') {
      iframe.style.pointerEvents = 'none';
    }
  });

  document.body.appendChild(iframe);
})();
