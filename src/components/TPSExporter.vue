<template>
  <p>This is an exporter for data in The Purple Standard (TPS).</p>
  <label for="team-number-input">Team Number</label>
  <input type="number" v-model.number="teamNumber" id="team-number-input">
  <button v-if="tpsData" @click="downloadTPSData">Download TPS Data</button>
  <p v-else>No TPS Data</p>
  <p v-show="error">Schema fetch failed: {{ error }}</p>
  <a ref="downloadLink" style="visibility: hidden"></a>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { useStorage } from "@vueuse/core";
import { zip } from "lodash";

const widgets = useWidgetsStore();
const tpsData = $computed(() => widgets.savedData.get("tps"));
const downloadLink = $ref<HTMLAnchorElement>();
const teamNumber = $ref(useStorage("tpsTeamNumber", 0));

let tpsSchema: Record<string, string>;
let error: string | undefined = undefined;

function valueToTPS(value: string, type: string) {
  switch (type) {
    case "boolean":
      return value === "1";
    case "number":
      return parseInt(value);
    case "timer":
      return Math.trunc(parseFloat(value) * 1000); // Convert s to ms
    case "string":
    default:
      return value;
  }
}

async function downloadTPSData() {
  if (tpsData === undefined) return;

  if (tpsSchema === undefined) {
    const fetchResult = await fetch(`${import.meta.env.BASE_URL}assets/tps-exporter.json`);
    if (!fetchResult.ok) error = `${fetchResult.status} (${fetchResult.statusText})`;

    tpsSchema = await fetchResult.json();
  }

  const dataOut: Record<string, Record<string, unknown>>[] = Array(tpsData.values.length).fill({
    metadata: {
      match: {}
    }
  });

  for (const [i, entry] of tpsData.values.entries()) {
    for (const [widgetName, widgetValue] of zip(tpsData.header, entry)) {
      if (widgetName === undefined || widgetValue === undefined) continue;

      // Process metadata
      if (widgetName === "EventKey") {
        dataOut[i]["metadata"]["event"] = widgetValue;
      } else if (widgetName === "MatchLevel") {
        (dataOut[i]["metadata"]["match"] as Record<string, unknown>)["level"] = ["qm", "sf", "f"][parseInt(widgetValue)];
      } else if (widgetName === "MatchNumber") {
        // Match level is guaranteed to be processed before match number
        const isPlayoffs = (dataOut[i]["metadata"]["match"] as Record<string, unknown>)["level"] === "sf";
        const matchNumber = parseInt(widgetValue);

        // For playoff matches: [TBA match number] = 1, [TBA set number] = [app match number]
        // For other matches: [TBA match number] = [app match number], [TBA set number] = 1
        (dataOut[i]["metadata"]["match"] as Record<string, unknown>)["number"] = isPlayoffs ? 1 : matchNumber;
        (dataOut[i]["metadata"]["match"] as Record<string, unknown>)["set"] = isPlayoffs ? matchNumber : 1;
      } else if (widgetName === "Team") {
        dataOut[i]["metadata"]["bot"] = parseInt(widgetValue.split(",")[2]);
      } else if (widgetName === "ScoutedTime") {
        dataOut[i]["metadata"]["timestamp"] = Date.parse(widgetValue)
      } else if (widgetName === "ScouterName") {
        dataOut[i]["metadata"]["scouter"] = {
          name: widgetValue,
          team: teamNumber,
          app: "bhs"
        }
      }

      const schemaData = tpsSchema[widgetName];
      if (schemaData === undefined) continue;

      // Each value in the schema has the format: "[iface] [prop] [type]"
      // [iface]: TPS interface that the data goes in
      // [prop]: TPS property name for the data
      // [type]: How the value should be interpreted
      const [iface, prop, type] = schemaData.split(" ");

      if (dataOut[i][iface] === undefined) dataOut[i][iface] = {};
      dataOut[i][iface][prop] = valueToTPS(widgetValue, type);
    }
  }

  if (downloadLink !== undefined) {
    const text = JSON.stringify({ entries: dataOut }, undefined, 2);
    downloadLink.href = URL.createObjectURL(new Blob([text], { type: "text/json" }));
    downloadLink.download = "tps.json";
    downloadLink.click();
  }
}
</script>
