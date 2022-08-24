import { Ref } from "vue";
import { ConfigData, WidgetData } from "./types";
import { defineStore } from "pinia";
import { isFailed, TBAData } from "./tba";
import { useStorage } from "@vueuse/core";

interface WidgetValue {
  readonly name: string;
  readonly value: Ref;
}

export interface SavedData {
  header: string[];
  values: string[][];
}

export const useConfigStore = defineStore("config", () => {
  const name = $ref("");
  const data = $ref({} as ConfigData);

  return $$({ name, data });
});

export const useWidgetsStore = defineStore("widgets", () => {
  const values = $ref(new Array<WidgetValue>());
  const savedData = $ref(useStorage("widgetsSavedData", new Map<string, SavedData>()));
  const lastWidgetRowEnd = $ref(1);

  const config = useConfigStore();

  const downloadLink = $computed(() => {
    const data = savedData.get(config.name);
    return (data === undefined) ? null : makeDownloadLink(data);
  });

  function makeDownloadLink(data: SavedData): string {
    const escape = (s: string[]) => s.map(i => `"${i.replaceAll('"', '""')}"`).join();

    const header = escape(data.header);
    const records = data.values.map(escape);
    return URL.createObjectURL(new Blob([[header, ...records].join("\n")], { type: "text/csv" }));
  }

  function addWidgetValue(key: string | WidgetData, value: Ref) {
    let name = null;

    if (typeof key === "string") {
      name = key;
    } else if (key.name !== undefined) {
      name = key.prefix ? `${key.prefix}-${key.name}`.replaceAll(/\s/g, "") : key.name;
    } else {
      return;
    }

    name = name.replaceAll(/\s/g, "");
    values.push({ name, value });
  }

  function save() {
    const stringify = (value: unknown) => Array.isArray(value) ? value.join(" ") : String(value);

    const header = values.map(i => i.name).concat("ScoutedTime");
    const record = values.map(i => stringify(i.value)).concat(new Date().toString());

    const entry = savedData.get(config.name);
    if (entry === undefined) {
      savedData.set(config.name, { header, values: [record] });
    } else {
      entry.header = header;
      entry.values.push(record);
    }
  }

  return $$({ values, savedData, lastWidgetRowEnd, downloadLink, makeDownloadLink, addWidgetValue, save });
});

export const useTBAStore = defineStore("tba", () => {
  let eventCode = $ref(useStorage("tbaEventCode", ""));
  const savedData = $ref(useStorage("tbaSavedData", new Map<string, object>()));

  async function load(code: string, name: string): Promise<TBAData> {
    if (code === "") {
      const localData = savedData.get(name);
      const promise = await Promise.resolve(localData ?? {});
      return { code: eventCode, data: promise };
    }

    const fetchData = await fetch(`https://www.thebluealliance.com/api/v3/event/${code}/${name}/simple`, {
      headers: { "X-TBA-Auth-Key": import.meta.env.VITE_TBA_API_KEY }
    });

    const data = await fetchData.json();
    if (!isFailed(data)) {
      savedData.set(name, data);
      eventCode = code;
    }

    return { code, data };
  }

  return $$({ eventCode, savedData, load });
});
