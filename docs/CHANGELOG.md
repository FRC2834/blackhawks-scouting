# Black Hawks Scouting Changelog

This document tracks the changes between Black Hawks Scouting versions. Dates are written in the MM/DD/YYYY format.

## 2023.2 (Unreleased)

### Additions

- Added a manual selection option to the Team Selection page that does not use The Blue Alliance data.
- Added the `rowColors` and `colColors` in the Toggle Grid widget.

### Improvements

- In TBA mode, the Team Selection page now shows a "Loading..." status to better communicate when data is loading or completed.
- JSON configuration files are now validated using a JSON schema.
  - This allows for more robust diagnostics and errors shown in the app.
  - You can also use the JSON schema for in-editor analysis and autocompletion as you edit your configurations. Support for Visual Studio Code is already set up.

## 2023.1 (03/01/2023)

### Additions

- Added [widget value validation](validation.md) to check user input in a scouting form.
- Added a `defaultOption` field in the Dropdown widget to create an initial "Select..." option.
- Added a team information heading to each page in scouting forms with a "Team Selection" page.
- Added a toggle grid widget.

### Improvements

- Updated match level selection to double elimination.
- Navigation links are now enlarged on mobile and touchscreen devices.
- The app version is now displayed on the home page.

## 2023.0 (01/09/2023)

### Additions

- Added stock match and pit scouting forms for the 2023 FRC season (Charged Up).

### Bug Fixes

- Fixed a bug where spaces from widget names would not be removed in the exported CSV if `prefix` was set in the configuration.
