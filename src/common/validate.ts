import Ajv, { ErrorObject } from "ajv";
import * as configSchema from "./config.schema.json";
import { ConfigSchema, Page, Validation, Widget } from "@/config";
import { get, groupBy } from "lodash";
import { InvalidConfigError, validationFuncs, validationFuncsRange } from "./shared";

// Properties of a JSON object.
interface ObjectProperties {
  readonly formattedName: string; // Name of the object to show in errors
  readonly obj: unknown; // The object that is described (or its parent object if it is an array or primitive)
  readonly widgetObj: unknown; // The object's containing widget object (if any)
}

// Rules to format an object.
interface ObjectDescriptor {
  readonly desc: string; // Description
  readonly isExtraneous: boolean; // If the error message isn't relevant
}

// Formats a page or widget name.
const formatName = (obj: Page | Widget, desc: string) => obj.name ?? `[Unnamed ${desc}]`;

// Checks if a map has a given key.
const hasKey = (map: Map<string, unknown>, key: string | undefined) => key ? map.has(key) : false;

// Gets the properties of an object according to a given path in the data.
function getProperties(data: ConfigSchema, path: string): ObjectProperties {
  const pathParts = path.split("/");

  // Page and widget objects
  const pageObj = data.pages?.[parseInt(pathParts[2])];
  const widgetObj = pageObj?.widgets?.[parseInt(pathParts[4])];

  // If there is no containing page, the path refers to the document root
  if (!pageObj) return { formattedName: "[document root]", obj: undefined, widgetObj: undefined };

  // Get formatted name, include widget name if it exists
  const formattedName = formatName(pageObj, "page") + (widgetObj ? ` > ${formatName(widgetObj, "widget")}` : "");

  // Get the entity at the path; if it isn't an object, use its parent instead
  // Because the path has a leading slash, the parts array must be sliced from index 1.
  const atPath = get(data, pathParts.slice(1));
  const obj = ((typeof atPath === "object") && !Array.isArray(atPath)) ? atPath : get(data, pathParts.slice(1, -1));

  return { formattedName, obj, widgetObj };
}

// Gets the descriptor for a reference schema based on the offending object.
function getDescriptor(refSchema: string, properties: ObjectProperties): ObjectDescriptor {
  // Rules for deducing object types based on name. Lambdas are used for lazy evaluation.
  const deductions = new Map<string | undefined, () => string>([
    ["widget", () => (properties.widgetObj as Widget)?.type],
    ["validation", () => (properties.obj as Validation)?.comparison]
  ]);

  // Extract formattable object names from the reference schema
  const objsWithFormat = [...deductions.keys()].join("|");
  const nameMatches = refSchema.match(new RegExp(`#\\/\\$defs\\/(${objsWithFormat})([a-z]+)`, "i"));

  const refName = nameMatches?.[1]; // Reference schema name
  const refType = nameMatches?.[2].toLowerCase(); // Reference schema type (to be matched with object type)
  const type = deductions.get(refName)?.(); // Object type

  // Rules for checking if the reference schema type matches the object type.
  const matchers = new Map<string | undefined, () => boolean>([
    ["widget", () => refType === type],
    ["validation", () => ((refType === "inequality") && hasKey(validationFuncs, type))
      || ((refType === "range") && hasKey(validationFuncsRange, type))]
  ]);

  // Include name and type in description, if found
  const desc = refType ? `with [${refName} type] = '${refType}' (from ${refSchema}):` : `from ${refSchema}:`;

  // The reference schema is extraneous if its type does not match the widget's type, making it irrelevant
  const isExtraneous = (refType !== undefined) && !matchers.get(refName)?.();

  return { desc, isExtraneous };
}

// Formats a validation error into a string.
function errorToString(e: ErrorObject) {
  const { message, params } = e;

  // Get the instance name at the top of the path, or use the root object if the path is empty
  const instance = (e.instancePath.length > 0) ? e.instancePath.split("/").at(-1) : "[root]";

  let messageBase = `'${instance}': ${message}`;

  // Add more details based on the error keyword
  switch (e.keyword) {
    case "const":
      messageBase += `: ${params.allowedValue}`;
      break;
    case "enum":
      messageBase += `: ${params.allowedValues.join(", ")}`;
  }

  return messageBase;
}

// Validates a given JSON configuration object.
export default function validate(ajv: Ajv, data: ConfigSchema) {
  // Validate and check for success
  if (ajv.validate(configSchema, data)) return [];

  const { errors } = ajv;
  if (!Array.isArray(errors)) return [];

  // Group errors by instance (objects that failed validation)
  const errorsGrouped = groupBy(errors, "instancePath");

  const ret = new Array<InvalidConfigError>();
  for (const [objPath, objErrors] of Object.entries(errorsGrouped)) {
    // Group errors further by schema path (parts of the schema that were validated against)
    const schemaPaths = groupBy(objErrors, "schemaPath");

    // Set up properties and error message
    const properties = getProperties(data, objPath);
    const error = new InvalidConfigError(`In ${objPath} (in ${properties.formattedName}):`);

    // Loop through each reference schema and what errors were caused by each
    for (const [refSchema, refSchemaErrors] of Object.entries(schemaPaths)) {
      const { desc, isExtraneous } = getDescriptor(refSchema, properties);
      if (isExtraneous) continue;

      // Add details on indented lines
      error.addSubEntry(desc, 1);
      for (const i of refSchemaErrors) error.addSubEntry(errorToString(i), 2);
    }

    // If an error has entries (at least one of its ref schemas were relevant), add it to the return list
    if (error.hasEntries()) ret.push(error);
  }

  return ret;
}
