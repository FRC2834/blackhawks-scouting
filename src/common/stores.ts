import Ajv from "ajv";
import { ConfigSchema, Widget } from "@/config";
import { defineStore } from "pinia";
import { isFailed, TBAData } from "./tba";
import { Ref } from "vue";
import { useStorage } from "@vueuse/core";
import validate from "./validate";

interface WidgetValue {
  readonly name: string;
  readonly value: Ref;
}

export interface SavedData {
  header: string[]; // Each element is a value in the CSV header
  values: string[][]; // Each element is a CSV record, each element in a record is a widget value
}

// Store to contain configuration data for the scouting form
export const useConfigStore = defineStore("config", () => {
  const name = $ref("");
  const data = $ref({} as ConfigSchema);

  const ajv = new Ajv({ allErrors: true });

  const validateSchema = () => validate(ajv, data);

  return $$({ name, data, validateSchema });
});

// Store to contain widget information and saved records
export const useWidgetsStore = defineStore("widgets", () => {
  // Temporary array for widgets in the current loaded form (stored in RAM)
  const values = $ref(new Array<WidgetValue>());

  // All saved data (config names in the map correspond to form data for that config, stored on disk)
  const savedData = $ref(useStorage("widgetsSavedData", new Map<string, SavedData>()));

  const lastWidgetRowEnd = $ref(1);
  const config = useConfigStore();

  // Download link for the current configuration
  const downloadLink = $computed(() => {
    const data = savedData.get(config.name);
    return (data === undefined) ? null : makeDownloadLink(data);
  });

  // Returns the current form's widget data.
  function getWidgetsAsCSV(): SavedData {
    // Turns a value into a string. Arrays are space-delimited to minimize collision with the CSV format.
    const stringify = (value: unknown) => Array.isArray(value) ? value.join(" ") : String(value);

    // Get header and record from the data (`name` is already a string so it does not need stringification)
    // Then add the current timestamp as the last field in the record
    const header = values.map(i => i.name).concat("ScoutedTime");
    const record = values.map(i => stringify(i.value)).concat(new Date().toString());
    return { header, values: [record] };
  }

  // Turns to given data object into a CSV string.
  function toCSVString(data: SavedData, excludeHeaders?: boolean): string {
    // Transforms an array of strings into valid CSV by escaping quotes, then joining each value.
    // https://en.wikipedia.org/wiki/Comma-separated_values
    const escape = (s: string[]) => s.map(i => `"${i.replaceAll('"', '""')}"`).join();

    // Escape the header and list of records, then put them together into a blob for downloading
    const header = escape(data.header);
    const records = data.values.map(escape);
    return (excludeHeaders ? records : [header, ...records]).join("\n");
  }

  // Creates a download link for a given data object.
  function makeDownloadLink(data: SavedData): string {
    return URL.createObjectURL(new Blob([toCSVString(data)], { type: "text/csv" }));
  }

  // Adds a widget and its reactive value to a temporary array.
  function addWidgetValue(key: string | Widget, value: Ref) {
    let name = null;

    if (typeof key === "string") {
      // String key provided, use it as the name
      name = key;
    } else if (key.name !== undefined) {
      // Data object key provided, use its name field if it's defined
      name = (key.prefix ? `${key.prefix}-${key.name}` : key.name).replaceAll(/\s/g, "");
    } else {
      // Invalid argument
      return -1;
    }

    return values.push({ name, value }) - 1;
  }

  // Saves the temporary array of widget data to a record in local storage.
  function save() {
    const csv = getWidgetsAsCSV();

    // Add to saved local storage
    const entry = savedData.get(config.name);
    if (entry === undefined) {
      // The entry for the current configuration name does not exist, create it
      savedData.set(config.name, csv);
    } else {
      // The entry exists, overwrite the header and append the record
      entry.header = csv.header;
      entry.values.push(csv.values[0]);
    }
  }

  return $$({
    values, savedData, lastWidgetRowEnd, downloadLink, getWidgetsAsCSV, toCSVString, makeDownloadLink, addWidgetValue, save
  });
});

// Store to contain widget validation status flags
export const useValidationStore = defineStore("validation", () => {
  const triggerPages = $ref(new Array<number>()); // Array of pages to validate
  const failedPage = $ref(-1); // Index of page that failed validation (-1 indicates success)

  return $$({ triggerPages, failedPage });
});

// Store to contain data fetched from The Blue Alliance
export const useTBAStore = defineStore("tba", () => {
  let eventCode = $ref(useStorage("tbaEventCode", ""));
  const savedData = $ref(useStorage("tbaSavedData", new Map<string, object>()));

  // Loads TBA data using cache if specified.
  async function load(code: string, name: string): Promise<TBAData> {
    // If an empty code is given, use the cached data in local storage (if it exists)
    if (code === "") {
      const localData = savedData.get(name);
      const promise = await Promise.resolve(localData ?? {});
      return { code: eventCode, data: promise };
    }

    // Otherwise, fetch the data from the API, passing the API key (must be set in env)
    const fetchData = await fetch(`https://www.thebluealliance.com/api/v3/event/${code}/${name}/simple`, {
      headers: { "X-TBA-Auth-Key": import.meta.env.VITE_TBA_API_KEY }
    });

    // Parse the data as a JSON object
    const data = await fetchData.json();

    // If the fetch succeeded, cache the results
    if (!isFailed(data)) {
      savedData.set(name, data);
      eventCode = code;
    }

    return { code, data };
  }

  return $$({ eventCode, savedData, load });
});
