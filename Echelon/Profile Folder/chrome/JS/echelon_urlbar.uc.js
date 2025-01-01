// ==UserScript==
// @name			Echelon :: Favicon on Address Bar
// @description 	Adds Favicon of the current website to the UrlBar
// @author			Travis
// @include			main
// ==/UserScript==

var { BrandUtils } = ChromeUtils.import("chrome://userscripts/content/echelon_utils.uc.js");

function updateIcon()
{
	try
	{
		setTimeout(function()
		{
			let favicon = gBrowser.selectedTab.image;
				
			let style = PrefUtils.tryGetIntPref("Echelon.Appearance.Style");
			if (style < ECHELON_LAYOUT_FF14)
			{
				document.querySelector("#identity-icon").setAttribute("style", `list-style-image: url('${favicon}');`);

				if (!gBrowser.selectedTab.image || gBrowser.selectedTab.image == null)
				{
					document.querySelector("#identity-icon").setAttribute("style", `list-style-image: var(--default-favicon);`);
				}
			}
		}, 1);
	}
	catch (e) {}

	try {
		let documentURIHost = gBrowser.selectedBrowser.documentURI;
		let displayHost = null;

		if (documentURIHost.scheme == "https") {
			displayHost = documentURIHost.host.replace(/^www\./i, "");
			document.querySelector("#identity-icon-label").setAttribute("value", displayHost);
			document.querySelector("#identity-icon-label").removeAttribute("collapsed");
		}

		if (documentURIHost.scheme == "about") {
			let browserName = BrandUtils.getBrandingKey("productName");

			document.querySelector("#identity-icon-label").setAttribute("value", browserName);
		}
	}
	catch (e) {}
}

let FaviconInUrlbar = {
	init: function()
	{
		document.addEventListener("TabAttrModified", updateIcon, false);
		document.addEventListener("TabSelect", updateIcon, false);
		document.addEventListener("TabOpen", updateIcon, false);
		document.addEventListener("TabClose", updateIcon, false);
		document.addEventListener("load", updateIcon, false);
		updateIcon();
	}
};

// initiate script after DOM/browser content is loaded
document.addEventListener("DOMContentLoaded", FaviconInUrlbar.init, false);
Services.prefs.addObserver("Echelon.Option.BrowserSpoof", FaviconInUrlbar.init, false);