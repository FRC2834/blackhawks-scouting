# The Purple Standard

## Overview

[**The Purple Standard (TPS)**](https://github.com/HarkerRobo/the-purple-standard) "is a unified, community-driven standard for FRC scouting data." Since v2024.1, Black Hawks Scouting supports exporting data in the TPS format through a separate `config-tps.json` configuration and an integrated TPS Exporter tool.

## Enabling

By default, the `tps` configuration is hidden from the home page. Add it to the [configurations list](config.md#configuration-list) to show it.

## Exporting

The "TPS Exporter" link on the home page brings you to a page where you can download TPS data as a JSON file from your scouted matches. You can also set your team number which will appear in the downloaded file.

**Note:** Attempting to download data from the TPS config the "normal" way (data inspector, QR code, etc.) will result in a file that is in Black Hawks Scouting's own CSV format. The TPS Exporter tool must be used if you want data in the TPS JSON format.

## Configuration

The information below is intended for developers and those who want to modify Black Hawks Scouting or how it exports TPS data. For the end-user, no modification is needed other than the configurations list.

Black Hawks Scouting has a configuration for TPS data called `config-tps.json`. Because the TPS Exporter tool only reads from this configuration, this is a reserved config name and cannot be used for other forms. This form is specifically set up with the data that TPS includes, so it generally does not need to be modified within the season.

The `tps-exporter.json` file in `/public/assets` dictates how data from Black Hawks Scouting's internal format is converted to TPS JSON. Keys in the JSON object are widget names exported by the form, and the values are in the format `[iface] [prop] [type]`:

- `[iface]`: TPS interface containing the data
- `[prop]`: Name of the TPS property
- `[type]`: How the data should be interpreted
