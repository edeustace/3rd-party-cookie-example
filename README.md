# 3rd party cookie example app

This is an example app that illustrates the proble of setting 3rd party cookies in some browsers.

It also shows some solutions.

It simulates 2 applications: consumer and provider. The consumer wants to load the provider app in an iframe. The provider wants to set a session cookie when the iframe is loaded, so it knows who the user is.

Expected: The cookie is set and all subsequent calls to the provider pass the cookie

Actual:
- Safari: cookie isn't set
- IE: cookie isn't set
- Chrome Mac: cookie is set
- Chrome Win: ??
- Firefox: cookie is set

# Running

For this to work you need to simulate 2 domains - the consumer can be localhost but the provider needs to be another domain.


    node consumer.js custom_domain
    node provider.js

    Then go to localhost:5000 - the provider will be loaded in an iframe and will try and set the cookie