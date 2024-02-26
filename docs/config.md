# Configuration Files

Prerequisite knowledge: An understanding of JSON files and syntax.

## Overview

Black Hawks Scouting has the capability to load multiple scouting configurations. This can have different use cases, such as match/pit scouting and different setups for various seasons.

Each configuration contains the pages, widgets, and layout of the scouting form. They are stored as JSON files in [`assets`](/public/assets) under the `public` directory; one form corresponds to one configuration (and thus one file).

Each configuration has a file name in the format `config-`, followed by the name of the configuration and then the file extension (`.json`). (Examples: `config-matches.json` or `config-pits-2022.json`)

**Note:** `config-tps` is a reserved name for the scouting form used for The Purple Standard (TPS). See the documentation for [TPS in Black Hawks Scouting](tps.md) for details.

## Configuration List

To make a configuration appear in Black Hawks Scouting's home page, it must be included in the configuration list at `/public/assets/configurations.txt`.

This file is a list of configuration names you want linked on the home page, separated by newlines. Leading/trailing whitespace and blank lines in the file are ignored.

Configurations that are not included in this file will still be accessible by their URLs, but they will not appear on the home page.

Given the configurations `config-matches.json` and `config-pits.json`, the configuration list would be:

```text
matches
pits
```

Notice how the `config-` and `.json` components of each file name are not included in the list.

## Handling Updates

When you update your copy of Black Hawks Scouting, GitHub will pull changes in the stock forms (`config-matches.json` and `config-pits.json`) into your fork. If you have your own changes in these files and don't want this to happen, you may do one of the following:

- Save a copy of these files before updating, then restore them after updating
- Define your configurations in new files (without modifying the stock configurations), and remove the stock forms from `configurations.txt` if desired

## Referencing Assets

Some configuration options allow referencing an asset file, such as an image. The file must be in the `assets` directory; subdirectories under `assets` are also allowed.

These configuration options take data of type `string`, which is the path of the file relative to the `assets` directory. Their descriptions in this document will list their data type as "filepath" to differentiate them from other string options.

## Specifying Colors

Some widgets allow customizing colors for visual assistance or improved visibility.

These configuration options take data of type `string`. Any valid CSS color value may be used, such as:

- `red` (Color name)
- `#3CB043` (Hex value)
- `rgb(136, 8, 8)` (RGB values)

All color configuration options will have their datatype listed as "color".

## Syntax

Configuration files are in JSON format with data contained within a top-level object.

```json
{
  "heading": "Rapid React - 2022 (Pit Scouting)",
  "logo": "logo.png",
  "skipTeamSelection": true,
  "pages": [
    {
      "name": "Team",
      "widgets": [
        {
          "name": "Team Number",
          "type": "number"
        },
        {
          "name": "Drive Coach",
          "type": "text"
        },
        {
          "name": "Driver Names",
          "type": "text"
        }
      ]
    },
    {
      "name": "Robot",
      "widgets": [
        {
          "name": "Height",
          "type": "number"
        },
        {
          "name": "Weight",
          "type": "number"
        },
        {
          "name": "Drivetrain",
          "type": "dropdown",
          "options": [
            "West Coast",
            "Swerve",
            "Butterfly",
            "Mecanum",
            "Other"
          ]
        },
        {
          "name": "Has Driver Camera",
          "type": "checkbox"
        }
      ]
    },
    {
      "name": "Match Play",
      "widgets": [
        {
          "name": "Climb Time",
          "type": "number"
        },
        {
          "name": "Climb",
          "type": "radio",
          "options": [
            "None",
            "Low",
            "Mid",
            "High",
            "Traversal"
          ]
        },
        {
          "name": "Aiming Method",
          "type": "radio",
          "options": [
            "Manual Targeting",
            "Automatic"
          ]
        },
        {
          "name": "Comments",
          "type": "textarea",
          "colspan": 3
        }
      ]
    }
  ]
}
```

The top-level object accepts the following fields:

`heading`: string, optional

The heading shown at the top of each page. If not specified, a default heading is used.

`logo`: filepath, optional

The file name of a team logo image to show under the top heading. If not specified, no image is displayed.

**Note:** The image will not be scaled; it will be displayed at actual size. If your image appears too large on your scouting form, use an image resizing tool to scale it down.

`skipTeamSelection`: boolean, optional

If `true`, the scouting form won't include an initial "Team Selection" page. Typically, this option is used in configurations that don't use a match schedule, such as pit scouting.

By default `false`.

`forceQualifiers`: boolean, optional

If `true`, the "Match Level" selector on the team selection page will be locked to "Qualifications". This option may be used when the team is only interested in scouting qualifier matches. By default `false`.

This option is only valid when `skipTeamSelection` is `false`.

`pages`: array[object], required

An array of [Page](#page-objects) objects specifying the custom pages in the scouting form.

## Page Objects

Each object in the `pages` array requires the following fields:

`name`: string

The name of the page, which displays as both a subheading on the page and a link in the navigation menu.

`widgets`: array[object]

An array of [Widget](#widget-objects) objects specifying the widgets on the page.

## Widget Objects

Each object in a Page's `widgets` array requires the following field:

`type`: string

The type of the widget. This lets the app know what the widget should display as, and how its data should be exported (if applicable). See [Widgets](widgets.md) for more information.

### Global Optional Fields

The following fields may be applied to widgets of any type:

`prefix`: string

A string prepended to the widget's name in the exported data, separated from the name with a dash.

This option may be used when multiple widgets have the same name and must be uniquely identified in the exported data.

`align`: string

How the widget is aligned in its grid cell. Can be any of `left`, `center`, or `right`; by default `left`.

This option only has an effect when the column the widget is in is wider than the widget itself.

`noLabel`: boolean

If the widget's label is hidden. By default `false`.

`row`, `col`: number

The position of the widget. See [Grid Layout](grid.md) for more information.

`rowspan`, `colspan`, `labelColspan`: number

The number of rows and columns the widget takes up. See [Grid Layout](grid.md) for more information.

### Type-Specific Required Fields

Certain widget types may also require additional fields:

#### All widgets except Picture, Spacer

`name`: string

The name of the widget, which displays as a label next to it and identifies it in the exported data.

#### Picture, Positions

`file`: filepath

The path of an image file to display.

#### Dropdown, Radio, Multi Checkbox

`options`: array[string]

The list of options to present to the user. Dropdown and Radio require exactly one selection, while Multi Checkbox allows the user to select any number of options.

#### Toggle Grid

`width`: number

The number of columns in the grid.

`height`: number

The number of rows in the grid.

`colors`: array[color]

The list of colors to cycle through in a grid cell when it is clicked.

### Type-Specific Optional Fields

Some widget types allow additional configuration options:

#### Dropdown

`defaultOption`: boolean

If the dropdown has a default "Select..." option. This will be displayed by default and can't be re-selected after choosing another option.

The default option exports a value of `-1` and can be used in combination with `validation` to make the dropdown required.

#### Picture, Positions

`width`, `height`: number

The dimensions to display the widget's image at, in pixels.

- **If none are specified:** The image is displayed at actual size.
- **If one is specified:** The image is resized to respect the dimension given, while preserving its aspect ratio.
- **If both are specified:** The image is resized to respect both dimensions. Its aspect ratio is ignored.

#### Positions

`allowMultiple`: boolean

If multiple selections are allowed. If `true`, each click on the image creates a new point to export; otherwise, only the last selected point is kept.

By default `false`.

`selectRadius`: number

The radius of the circle displayed on each selected point, in pixels.

`selectColor`: color

The color of the circle displayed on each selected point.

#### Radio

`default`: number

The index of the option in the `options` array to be selected by default. By default `0`.

**Note:** Array indices start at 0. The first string in the array is index 0, the second is index 1, etc.

#### Spacer

`width`, `height`: number

The dimensions of the spacer in pixels. The default value for each option is `0`, i.e. not occupying space in that dimension.

#### Spinbox

`min`: number

The minimum value that can be entered. By default `0`.

`max`: number

The maximum value that can be entered. By default `Number.MAX_SAFE_INTEGER`, or `9007199254740991`.

`allowKeyboardInput`: boolean

If the value of the widget can be modified using the keyboard. By default `false`.

`buttonColor`: color

The color of the increment and decrement buttons.

#### Stopwatch

`startLabel`, `lapLabel`, `stopLabel`: string

The text to display in the Start, Lap, and Stop buttons, respectively. These will override the default labels and can be used to give a stopwatch a more intuitive interface.

`maxLaps`: number

The maximum number of laps that can be recorded; use 0 to disable lapping. By default `Number.MAX_SAFE_INTEGER`.

#### Toggle Grid

`rowColors`, `colColors`: array[color]

The colors of each row/column number cell. The first color in the array corresponds to the fill color of the first row/column cell, and so on.

If there are more cells than entries in the array, the remaining cells will retain their default color.

If there are more array entries than cells, the extra entries are ignored.

### Validation

Certain widgets support value validation. Validation conditions are specified in a widget's optional `validation` field in the form of a [validation object](#validation-object).

See [Validation](validation.md) for more information.

## Validation Object

Each object associated with a widget's `validation` field requires the following fields:

`comparison`: string

How to compare a widget's value with the specified value(s) to determine if it passes validation. Can be any of:

- `less`
- `lessOrEqual`
- `greater`
- `greaterOrEqual`
- `equal`
- `inRange`
- `outOfRange`

`value`: array[number] if `comparison` is any of (`inRange`, `outOfRange`), number otherwise

The value(s) to validate the widget against.

If range validation is specified, this field should be an array of two numbers specifying the range to validate against. The two numbers may be in any order. While more numbers are valid in the array, Black Hawks Scouting will only use the greatest and least values. This range is inclusive for `inRange` and exclusive for `outOfRange`.

Otherwise, this field is a single number specifying the value to validate against.
