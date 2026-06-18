/*!
 * LeadFlow embed widget — single-script loader.
 *
 * Usage on a client site (paste once, just before </body>):
 *
 *   <script
 *     src="https://YOUR-LEADFLOW-DOMAIN/leadflow-widget.js"
 *     data-agency="Immo Marrakech"
 *     data-client-id="immo-marrakech"
 *     async></script>
 *
 * Optional attributes:
 *   data-agency        Display name shown in the widget header (default: "Prestige Immobilier")
 *   data-client-id     Stable id used to attribute leads to this client (recommended)
 *   data-base-url      Override the LeadFlow origin (auto-detected from this script's src otherwise)
 *   data-position      "right" (default) or "left"
 *   data-property-id   Current property id, if embedded on a single-listing page
 *   data-property-title Current property title, if embedded on a single-listing page
 */
(function () {
  // Guard against double-injection if the snippet is pasted twice.
  if (window.__leadflowLoaded) return;
  window.__leadflowLoaded = true;

  var el =
    document.currentScript ||
    document.querySelector('script[src*="leadflow-widget.js"]');

  function attr(name, fallback) {
    var v = el && el.getAttribute(name);
    return v != null && v !== '' ? v : fallback;
  }

  var agency        = attr('data-agency', 'Prestige Immobilier');
  var clientId      = attr('data-client-id', '');
  var position      = attr('data-position', 'right') === 'left' ? 'left' : 'right';
  var propertyId    = attr('data-property-id', '');
  var propertyTitle = attr('data-property-title', '');

  // Derive the LeadFlow origin from this script's own src so it works on any domain.
  var src     = (el && el.getAttribute('src')) || '';
  var baseUrl = attr('data-base-url', '').replace(/\/$/, '');
  if (!baseUrl) baseUrl = src.replace(/\/leadflow-widget\.js(\?.*)?$/, '');
  if (!baseUrl) baseUrl = window.location.origin;

  // Build the iframe URL with everything the widget needs.
  var params = ['agency=' + encodeURIComponent(agency)];
  if (clientId)      params.push('client=' + encodeURIComponent(clientId));
  if (propertyId)    params.push('pid=' + encodeURIComponent(propertyId));
  if (propertyTitle) params.push('ptitle=' + encodeURIComponent(propertyTitle));

  var iframe = document.createElement('iframe');
  iframe.title = 'LeadFlow assistant';
  iframe.src = baseUrl + '/widget?' + params.join('&');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('aria-label', 'Assistant ' + agency);

  var isMobile = window.matchMedia('(max-width: 480px)').matches;

  // The iframe is kept exactly as large as its *visible* content so the rest of
  // the host page stays fully clickable — small when collapsed (just the floating
  // bubble), large when the chat panel is open. The widget tells us which state
  // it's in via postMessage.
  var COLLAPSED = { w: '110px', h: '110px' };
  var OPEN      = { w: isMobile ? '100%' : '420px', h: isMobile ? '100%' : '660px' };

  function applySize(state) {
    var s = state === 'open' ? OPEN : COLLAPSED;
    iframe.style.width  = s.w;
    iframe.style.height = s.h;
  }

  iframe.style.cssText = [
    'position:fixed',
    'bottom:0',
    position + ':0',
    'border:none',
    'z-index:2147483000',
    'background:transparent',
    'overflow:hidden',
    'max-width:100vw',
    'max-height:100vh',
    'pointer-events:auto',         // safe: iframe is only as big as its visible content
  ].join(';');
  applySize('collapsed');

  window.addEventListener('message', function (e) {
    if (e.origin !== baseUrl) return;
    if (e.data === 'leadflow:open')  applySize('open');
    if (e.data === 'leadflow:close') applySize('collapsed');
    // Back-compat with the previous message names:
    if (e.data === 'leadflow:enable-pointer')  applySize('open');
    if (e.data === 'leadflow:disable-pointer') applySize('collapsed');
  });

  function mount() { document.body.appendChild(iframe); }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
