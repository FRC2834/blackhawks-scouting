<template>
  <FormPage title="Team Selection" ref="page">
    <FormGroup :label-type="LabelType.LabelTag" id="event-key-input" name="Event Key">
      <input id="event-key-input" type="text" v-model="eventKey" @keyup.enter="loadTBAData" />
      <button @click="loadTBAData">Load</button>
    </FormGroup>
    <FormGroup :label-type="LabelType.PlainText" name="Teams Loaded">{{ teamsLoadStatus }}</FormGroup>
    <FormGroup :label-type="LabelType.PlainText" name="Matches Loaded">{{ matchesLoadStatus }}</FormGroup>
    <FormGroup :label-type="LabelType.LabelTag" id="match-level-input" name="Match Level">
      <select id="match-level-input" v-model.number="matchLevel" :disabled="config.data.forceQualifiers">
        <option value="0">Qualifications</option>
        <option value="1">Quarterfinals</option>
        <option value="2">Semifinals</option>
        <option value="3">Finals</option>
      </select>
    </FormGroup>
    <FormGroup :label-type="LabelType.LabelTag" id="match-input" name="Match Number">
      <input id="match-input" type="number" v-model.lazy="matchNumber" :min="1" />
    </FormGroup>
    <FormGroup :label-type="LabelType.LabelTag" id="team-input" name="Team">
      <span v-if="currentMatch === null">&lt;No Data&gt;</span>
      <select v-else id="team-input" v-model="selectedTeam">
        <option v-for="[i, { color, index, number, name }] of teamsList.entries()" :key="i" :value="i">
          {{ color }} {{ index }}: {{ number }} ({{ name }})
        </option>
      </select>
    </FormGroup>
  </FormPage>
</template>

<script setup lang="ts">
import FormGroup from "./FormGroup.vue";
import FormPage from "./FormPage.vue";
import { get, isEmpty } from "lodash";
import { getError, getTeamName, isFailed, TBAData } from "@/common/tba";
import { LabelType } from "@/common/types";
import { computed, Ref } from "vue";
import { useConfigStore, useTBAStore, useWidgetsStore } from "@/common/stores";

interface Team {
  color: string;
  index: number;
  number: number;
  name: string;
}

const page = $ref<InstanceType<typeof FormPage>>();
defineExpose({ title: computed(() => page?.title), setShown: computed(() => page?.setShown) });

const config = useConfigStore();
const tba = useTBAStore();
const widgets = useWidgetsStore();

let eventKey = $ref("");
const matchLevel = $ref(0);
const matchNumber = $ref(1);
const selectedTeam = $ref(0);

const teamsLoadStatus = $ref("");
const matchesLoadStatus = $ref("");

const teams = $ref<unknown[]>();
const matches = $ref<unknown[]>();

// The match data based on the selected level and number
const currentMatch = $computed(() => {
  // Make sure matches are loaded
  if (!Array.isArray(matches)) return null;

  // Get the matches with the selected level
  const matchLevelCodes = ["qm", "qf", "sf", "f"];
  const matchList = matches.filter((match: unknown) => get(match, "comp_level") === matchLevelCodes[matchLevel]);

  // When ordering matches, the match number takes priority over the set number.
  // Quarterfinals and semifinals are described as: (Quarters|Semis) [X] Match [Y]
  // => [X]: Set number (Is always under 10)
  // => [Y]: Match number
  // => Example order:                      Computed index ([Y] * 10 + [X]):
  //    1. Quarters 1 Match 1               11
  //    2. Quarters 2 Match 1               12
  //    3. Quarters 1 Match 2               21
  //    4. Quarters 2 Match 2               22
  //    5. Quarters 1 Match 3 (Tiebreaker)  31
  //    ...
  //
  // Qualifiers and finals only have a match number, so the set number will always be 1 for those entries.
  // Sorting match entries by their computed indices will put them in the correct order.
  const getNumber = (matchObj: unknown, key: string) => get(matchObj, key) ?? 0;
  const getIdx = (matchObj: unknown) => (getNumber(matchObj, "match_number") * 10) + getNumber(matchObj, "set_number");

  matchList.sort((first: unknown, second: unknown) => Math.sign(getIdx(first) - getIdx(second)));
  return matchList[matchNumber - 1] ?? null;
});

// The teams playing in the selected match
const teamsList = $computed(() => {
  const result = new Array<Team>();
  if (currentMatch === null) return result; // Return empty array if current selected match is invalid

  for (const color of ["Red", "Blue"]) {
    // The list of teams playing on one alliance
    const teamKeys = get(currentMatch, `alliances.${color.toLowerCase()}.team_keys`) as unknown as string[];

    for (const [i, element] of teamKeys.entries()) {
      // Get info for each team
      const index = i + 1;
      const number = parseInt(element.substring(3));
      const name = getTeamName(number, teams);

      result.push({ color, index, number, name });
    }
  }

  return result;
});

// The exported team information
const teamData = $computed(() => teamsList[selectedTeam] ? Object.values(teamsList[selectedTeam]).join() : "");

// Add values to export
widgets.addWidgetValue("EventKey", $$(eventKey));
widgets.addWidgetValue("MatchLevel", $$(matchLevel));
widgets.addWidgetValue("MatchNumber", $$(matchNumber));
widgets.addWidgetValue("Team", $$(teamData));

// Updates the loaded status message for a variable.
// This function takes Ref objects to get a behavior similar to pass-by-reference in C++.
function updateStatus(msg: Ref<string>, saveVar: Ref<unknown>, { code, data }: TBAData) {
  // Update variables
  eventKey = code;
  saveVar.value = data;

  // Update status message
  if (isFailed(data)) msg.value = "\u274C " + getError(data);
  else if (isEmpty(data)) msg.value = "\u26A0\uFE0F No data available";
  else msg.value = "\u2705 Loaded successfully";
}

// Loads team and match data from the event key the user entered.
function loadTBAData() {
  tba.load(eventKey, "teams").then(value => updateStatus($$(teamsLoadStatus), $$(teams), value));
  tba.load(eventKey, "matches").then(value => updateStatus($$(matchesLoadStatus), $$(matches), value));
}
</script>

<style>
#team-input {
  width: 250px;
  text-overflow: ellipsis;
}
</style>
