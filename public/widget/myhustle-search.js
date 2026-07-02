(function() {
  'use strict';

  var container = document.getElementById('myhustle-widget');
  if (!container) return;

  var baseUrl = 'https://myhustle.space';

  container.innerHTML = '<div style="background:linear-gradient(135deg,#059669 0%,#047857 100%);border-radius:12px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;max-width:400px;margin:0 auto;">' +
    '<div style="text-align:center;margin-bottom:12px;">' +
      '<a href="' + baseUrl + '" target="_blank" rel="noopener" style="color:white;text-decoration:none;font-size:18px;font-weight:700;">\ud83c\udfe2 MyHustle</a>' +
      '<p style="color:rgba(255,255,255,0.85);font-size:13px;margin:4px 0 0;">Find businesses across Nigeria</p>' +
    '</div>' +
    '<form id="mh-search-form" style="display:flex;gap:8px;">' +
      '<input id="mh-search-input" type="text" placeholder="Search businesses..." style="flex:1;padding:10px 14px;border:none;border-radius:8px;font-size:14px;outline:none;background:white;color:#1f2937;" />' +
      '<button type="submit" style="background:#fbbf24;color:#1f2937;border:none;border-radius:8px;padding:10px 16px;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap;">Search</button>' +
    '</form>' +
    '<div style="text-align:center;margin-top:8px;">' +
      '<a href="' + baseUrl + '/list-your-business" target="_blank" rel="noopener" style="color:rgba(255,255,255,0.7);font-size:11px;text-decoration:none;">List your business free \u2192</a>' +
    '</div>' +
  '</div>';

  document.getElementById('mh-search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var query = document.getElementById('mh-search-input').value.trim();
    if (query) {
      window.open(baseUrl + '/search?q=' + encodeURIComponent(query), '_blank');
    }
  });
})();
