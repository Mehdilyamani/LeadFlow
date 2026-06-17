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
  var width    = isMobile ? '100%' : '410px';
  var height   = '580px';

  iframe.style.cssText = [
    'position:fixed',
    'bottom:0',
    position + ':0',
    'width:' + width,
    'height:' + height,
    'max-width:100vw',
    'border:none',
    'z-index:2147483000',          // sit above almost any site chrome
    'background:transparent',
    'overflow:hidden',
    'pointer-events:none',         // empty area stays click-through…
  ].join(';');

  // …only the widget content re-enables pointer events, via postMessage.
  window.addEventListener('message', function (e) {
    if (e.origin !== baseUrl) return;          // only trust our own iframe
    if (e.data === 'leadflow:enable-pointer')  iframe.style.pointerEvents = 'auto';
    if (e.data === 'leadflow:disable-pointer') iframe.style.pointerEvents = 'none';
  });

  function mount() { document.body.appendChild(iframe); }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
