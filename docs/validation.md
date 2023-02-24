# Widget Validation

## Overview

Black Hawks Scouting supports widget value validation. Not only does this allow you to make certain widgets required, but more advanced checks can also be used, such as "Is the number entered between 10 and 20?" and "Are at least 5 positions selected in the image?".

If a widget fails validation, it will be highlighted with a red border and you will be unable to go to the next form page until the widget passes.

Validation is controlled by the `validation` field in a widget's object. This field accepts a [validation object](config.md#validation-object).

Various comparisons can be used to validate widget values. These include inequality checks (`less`, `greaterThan`, `equal`, etc.) and range checks (`inRange` and `outOfRange`).

## Widgets Supporting Validation

The following widget types support value validation:

| Widget | What is Validated |
| --- | --- |
| Dropdown | Index of selected option |
| Multi Checkbox | Number of options selected |
| Number | Number entered |
| Positions | Number of positions selected |
| Stopwatch | Number of laps recorded (plus one for the total time) |
| Text | Length of input |
| Textarea | Length of input |

**Note:** The Checkbox, Radio, and Spinbox widgets do not support validation because they can constrain their input data. In the case of the Spinbox widget, this is done with the `min` and `max` fields.

**Note:** With a dropdown, validation can work in combination with the [`defaultOption` field](config.md#dropdown) to create a required dropdown with no initial selected value.

## Making a Widget Required

If you would simply like a widget to be required without extra validation, use the following validation object that disallows empty input:

(If using validation with a dropdown and `defaultOption`, `value` should be `-1` instead.)

```json
{
  "comparison": "greater",
  "value": 0
}
```

## Example

Five widgets are given in the JSON below:

1. Optional text input (with no validation)
2. Required text input
3. Required dropdown
4. Multi Checkbox requiring exactly two selections
5. Number input requiring a value between 10 and 20

View videos of this example on YouTube: [Initial version](https://youtu.be/vYKmJzZvk8Y) | [Updates from January 15, 2023](https://youtu.be/_mlcaQgQJNQ)

```json
{
  "skipTeamSelection": true,
  "pages": [
    {
      "name": "Validation Demo",
      "widgets": [
        {
          "name": "Optional Widget",
          "type": "text"
        },
        {
          "name": "Required Widget",
          "type": "text",
          "validation": {
            "comparison": "greater",
            "value": 0
          }
        },
        {
          "name": "Required Dropdown",
          "type": "dropdown",
          "options": ["Option 1", "Option 2", "Option 3"],
          "defaultOption": true,
          "validation": {
            "comparison": "greater",
            "value": -1
          }
        },
        {
          "name": "Select Two Options",
          "type": "multicheckbox",
          "options": ["Option 1", "Option 2", "Option 3"],
          "validation": {
            "comparison": "equal",
            "value": 2
          }
        },
        {
          "name": "Enter Between 10 And 20",
          "type": "number",
          "validation": {
            "comparison": "inRange",
            "value": [10, 20]
          }
        }
      ]
    }
  ]
}
```
