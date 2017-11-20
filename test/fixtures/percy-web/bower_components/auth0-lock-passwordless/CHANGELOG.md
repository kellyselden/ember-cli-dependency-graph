## [2.2.3] - 2016-03-28

### Fixed

- Fix bug that prevented the widget to show up when a property was added to `String.prototype` ([#105](https://github.com/auth0/lock-passwordless/pull/105))


## [2.2.2] - 2016-01-29

### Fixed

- Fix webpack bundling.
- Dependencies on the `0.14.x` range of React packages. Otherwise we are forcing users to use a specific version of React.

## [2.2.1] - 2016-01-18

### Changed

- Some font alternatives are provided instead of defaulting to sans-serif immediately on systems without Avenir.

### Fixed

- Pass `authParams` option in a social login.

## [2.2.0] - 2016-01-14

### Changed

- Make it easy to bundle the module with [browserify](https://browserify.org) or [webpack](https://webpack.github.io/). Custom transforms or loaders are no longer needed. **Please review your bundling process when upgrading to this version**.

## [2.1.1] - 2016-01-07

### Fixed

- Namespace style normalization rules inside .auth0-lock.

## [2.1.0] - 2016-01-06

### Changed

- Allow spaces and hyphens in phone numbers.
- Upgrade to React v0.14.5.
- Upgrade to Auth0.js v6.8.0.

### Added

- Add a back button when selecting a country code.

### Fixed

- Force all characters to lower-case when creating the Gravatar's md5 hash.
- Fix resend magic link button in applications using [page.js](https://github.com/visionmedia/page.js).

## [2.0.1] - 2015-12-04

### Fixed

- Ensure Facebook page looks fine in the popup.

## [2.0.0] - 2015-12-03

### Changed

- The Lock can now be reopened after it is closed.
- When a `defaultLocation` option is not provided the country code will be derived from the user's geo-location. If it can't be obtained before the Lock is shown, it will default to _+1 (US)_.
- Some dictionary keys, used for confirmation screens have been renamed:
  - `emailcode.confirmation` was changed to `emailcode.signedIn`.
  - `magiclink.confirmation` was changed to `magiclink.emailSent`.
  - `sms.confirmation` was changed to `sms.signedIn`.
- Upgraded to React v0.14.3. Thanks @joelburget.
- Upgraded to Auth0.js 6.7.7.

### Added

- A warning will be shown when a `scope="openid profile"` is used. Can be avoided with the `disableWarnings` option.
- Now the Lock allows to authenticate with social providers by calling the `social` method. The behavior can be controlled with the new `connections` and `socialBigButtons` options.
- It is possible to mix social authentication with all the previously provided passwordless alternatives by calling `socialOrMagiclink`, `socialOrEmailcode` or `socialOrSms`.
- A `destroy` method has been added since calling `close` no longer frees the Lock's resources.

### Fixed

- Some styling tweaks in the Lock's header.
- Footer text was displayed incorrectly in small screens.

## [1.0.2] - 2015-09-30

### Changed

- Make phone number and verification code inputs bring up a numeric keyboard on mobile devices.

### Fixed

- Debounce Gravatar requests.
- Use always the same height for the header icon.
- Ensure the title always shows up always in the same place.
- Fix close and back buttons on some old IE versions, they weren't responding to the click event.
- Ensure the Lock is displayed correctly in pages with z-ordered elements (as long as their values are less than 10.000.00).
- Use colors taken from the Gravatar for the header background.

## [1.0.1] - 2015-09-30

### Added

- Specific error message for invalid phone numbers.

### Fixed

- Playground styling.

## [1.0.0] - 2015-09-30

- First public release.

## [0.9.0] - 2015-09-30

- First public pre-release.
