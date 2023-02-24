# Black Hawks Scouting

## Overview

Black Hawks Scouting is an advanced, web-based, and open source scouting app made by FRC Team 2834 (The Bionic Black Hawks).

Powered by [Vue.js](https://vuejs.org) and [The Blue Alliance](https://thebluealliance.com).

[Live Demo](https://frc2834.github.io/blackhawks-scouting/#/) | [Introductory Videos](https://www.youtube.com/playlist?list=PLBRtye3iMZkFWZWo_e2GbrHIJkexl5A20) (More coming soon)

## Features

Black Hawks Scouting was created with the following goals in mind:

### Versatility

Black Hawks Scouting is based around configuration files, which allow you to quickly create forms including, but not limited to:

- Match Scouting
- Pit Scouting
- Forms for various seasons
- Something else... (Surveys, Checklists, etc.)

You can have multiple configurations side-by-side - they'll show up as separate links on the main menu and won't interfere with each other.

Black Hawks Scouting comes with stock match/pit forms for each season, so even if you can't create your own configuration files, you can still take advantage of them. Simply fork, deploy, and go!

### Flexibility

Black Hawks Scouting works in your browser and runs anywhere, no matter if you're scouting on a tablet or testing on a computer.

**No download is required on any of your scouting devices!** Once you visit the app on a device, you can bookmark it or save it to your home screen. It'll continue to work, even offline.

There are no restrictions on what you can use to analyze your data - Black Hawks Scouting exports in a standard format called Comma-Separated Values (CSV). Your team has the option to use anything from custom Python scripts to professional-grade tools like Tableau and Excel.

### Ease of Use

Even with its advanced features, Black Hawks Scouting is designed to be approachable by your team's scouters. You can easily navigate within scouting forms with a navigation menu at the bottom of each form.

Black Hawks Scouting also provides a built-in Data Inspector allowing you to view and manage your scouted data, before you download them.

### Offline Usage

With internet often being unreliable at competitions, Black Hawks Scouting has the capability to work fully offline by making use of special browser features. Once you load it with an internet connection, it remains available on your device with the same URL, even without an internet connection or download.

*Tip: You can use The Blue Alliance data offline too!* Once you load match information online from a form's Team Selection page, Black Hawks Scouting caches it in local storage. On subsequent scouting sessions, you can leave the Event Key field blank and press the Load button to use the cached data. This is faster than an online load and doesn't require internet.

### Security

Black Hawks Scouting uses standard obfuscation techniques to isolate your TBA key from the app's source code. This makes it harder for users to access your key, but because the app runs entirely in the user's browser, it cannot completely hide the key.

The app also supports the security features of your browser, working even with HTTPS, tracking protection, and cookie blocking.

## System Requirements

Black Hawks Scouting can work on Windows, macOS, and Linux. In addition, mobile devices with Android and iOS are also supported. The following browser versions are recommended:

- Google Chrome 100+
- Microsoft Edge 100+
- Mozilla Firefox 100+
- Apple Safari 15.5+

## Open Source

Licensed under the MIT License, see the [license document](/LICENSE.txt) for the full license terms.
