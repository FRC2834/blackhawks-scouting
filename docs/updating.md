# Updating Black Hawks Scouting

## Overview

Over time, Black Hawks Scouting will update with new features and bug fixes. However, these updates are not automatically applied to forks. If you have a fork of Black Hawks Scouting that you would like to update, follow this document to update your copy of the app.

## Updating Your Fork

Go to your fork on GitHub. (The URL should start with `github.com`.) Click the "Sync fork" dropdown, then the "Update branch" button. If the button is grayed out and unclickable, your fork is already up to date and requires no further action.

Details are given in the [GitHub docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork).

## Reloading Without Cache

Black Hawks Scouting uses caching extensively to support offline usage, but this may result in out-of-date files being used on your device. Caching should only take place if you are visiting your live deploy, i.e. your `github.io` URL.

To force your browser to pull in the updated files, clear the cache (or at least reload your deploy without it). You may consult your browser's documentation for this action.

## Updates and Configurations

An update of Black Hawks Scouting may include changes in the stock configurations that it ships with, i.e. `config-matches.json` and `config-pits.json`. If you have made your own changes in these files and would not like to receive updates for them, follow [these instructions](config.md#handling-updates) in the configuration documentation.
