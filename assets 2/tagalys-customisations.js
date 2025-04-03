var tagalysConfiguration = {
  api: {
    serverUrl: "https://api-r1.tagalys.com",
    credentials: {
      clientCode: "0F1C5254FFC6B748",
      apiKey: "d45e2cb0789c7bafdb8e22a97760186d"
    },
    storeId: "63601344666"
  },
  locale: "en-IN",
  currency: {
    displayFormatter: "{{currencyLabel}}{{value}}",
    code: "INR",
    label: "₹",
    fractionalDigits: 0,
    forceFractionalDigits: true
  },
  analyticsStorageConsentProvided: function() {
    // return true/false based on user's consent settings
    return true;
  },
  track: true
};

var platformConfiguration = {
  platform: "Shopify",
  countryCode: "IN",
  // replace with Shopify.country to set the shopper's chosen country
  baseCountryCode: "IN",
  useStorefrontAPIForSecondaryMarkets: true,
  waitForStorefrontAPI: true,
  storefrontAPI: {
    accessToken: "<storefront-token>",
    myShopifyDomain: "kalki-india.myshopify.com"
  },
  metafields: {
    products: []
  }
};

var TagalysCustomisations = {};

TagalysCustomisations.setTagalysConfiguration = function() {
  Tagalys.setConfiguration(tagalysConfiguration);
};

TagalysCustomisations.setPlatformConfiguration = function() {
  Tagalys.setPlatformConfiguration(platformConfiguration);
};

TagalysCustomisations.initSmartWidget = function(selector, widgetId) {
  onTagalysReady(function () {
    Tagalys.UIWidgets.SmartWidget.init(selector, {
      widgetId: widgetId,
      templates: {
header: {
render: function (html, args) {
var widgetHeading = args.props.helpers.getAPIResponse().name;
// customise the rendering of the html element for the title
return html`
<div class="widget-header">
<h2 class="widget-heading">${widgetHeading}</h2>
</div>
`;
}
}
}
    })
  })
};

TagalysCustomisations.initAllSmartWidgets = function() {
  const widgetAttribute = "data-tagalys-smart-widget"
  const widgets = document.querySelectorAll(`[${widgetAttribute}]`);
  widgets.forEach(function (widget) {
    const widgetId = widget.getAttribute(widgetAttribute);
    TagalysCustomisations.initSmartWidget(`[${widgetAttribute}='${widgetId}']`, widgetId);
  });
};

TagalysCustomisations.initProductBasedWidget = function(selector, widgetId, productId) {
  Tagalys.UIWidgets.Recommendations.init(selector, {
    recommendationId: widgetId,
    productId: productId
  });
};

TagalysCustomisations.initAllProductBasedWidgets = function() {
  const widgetAttribute = "data-tagalys-product-based-widget"
  const widgets = document.querySelectorAll(`[${widgetAttribute}]`);
  widgets.forEach(function (widget) {
    const widgetId = widget.getAttribute(widgetAttribute);
    const productId = widget.getAttribute(widgetAttribute + '-product-id');
    TagalysCustomisations.initProductBasedWidget(`[${widgetAttribute}='${widgetId}']`, widgetId, productId);
  });
};

TagalysCustomisations.initAllWidgets = function() {
  TagalysCustomisations.initAllSmartWidgets()
  TagalysCustomisations.initAllProductBasedWidgets()
}

onTagalysReady(function () {
  Tagalys.Analytics.trackPlatformEvents();
});

onTagalysReady(function () {
  TagalysCustomisations.initAllWidgets()
})