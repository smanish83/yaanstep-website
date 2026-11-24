/* Yaanstep visit counting: the settings (Manish, 24 Nov 2026: "Add the counter on the site ... how many users are visited,
   ... which feature is used most vs which one is least used. What age groups are using ... new accounts vs return users").
   The counting service is Umami Cloud: cookie-free, no personal data. Change these lines to change counting for the whole site.
   enabled:    false turns counting off for every visitor.
   websiteId:  the site code from Umami (Settings, Websites, Edit, Tracking code). Until it is filled in, nothing is sent.
   shareUrl:   Umami's read-only share link for the dashboard, shown on the hidden analytics page. */
window.YS_ANALYTICS_CONFIG = {
  enabled: true,
  websiteId: 'PLACEHOLDER-SITE-CODE',
  scriptSrc: 'https://cloud.umami.is/script.js',
  shareUrl: ''
};
