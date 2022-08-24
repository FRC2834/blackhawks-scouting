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
      <input id="match-input" type="number" v-model.lazy="matchNumber" />
    </FormGroup>
    <FormGroup :label-type="LabelType.LabelTag" id="team-input" name="Team">
      <span v-if="currentMatch === null" value="0" disabled>&lt;No Data&gt;</span>
      <select v-else id="team-input" v-model="selectedTeam">
        <option v-for="[i, { color, alliance, number, name }] of teamsList.entries()" :key="i" :value="i">
          {{ color }} {{ alliance }}: {{ number }} ({{ name }})
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
import { ref, Ref } from "vue";
import { useConfigStore, useTBAStore, useWidgetsStore } from "@/common/stores";

interface Team {
  color: string;
  alliance: number;
  number: number;
  name: string;
}

const page = ref<InstanceType<typeof FormPage>>();
defineExpose(page);

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

const currentMatch = $computed(() => {
  if (!Array.isArray(matches)) return null;

  const matchLevelCodes = ["qm", "qf", "sf", "f"];
  const matchList = matches.filter((match: unknown) => get(match, "comp_level") === matchLevelCodes[matchLevel]);

  const getNumber = (matchObj: unknown) => (get(matchObj, "match_number") * 10) + get(matchObj, "set_number");

  matchList.sort((first: unknown, second: unknown) => Math.sign(getNumber(first) - getNumber(second)));
  return matchList[matchNumber - 1] ?? null;
});

const teamsList = $computed(() => {
  const result = new Array<Team>();
  if (currentMatch === null) return result;

  for (const color of ["Red", "Blue"]) {
    const teamKeys: string[] = get(currentMatch, `alliances.${color.toLowerCase()}.team_keys`);

    for (const [i, element] of teamKeys.entries()) {
      const alliance = i + 1;
      const number = parseInt(element.substring(3));
      const name = getTeamName(number, teams);

      result.push({ color, alliance, number, name });
    }
  }

  return result;
});

const teamData = $computed(() => teamsList[selectedTeam] ? Object.values(teamsList[selectedTeam]).join() : "");

widgets.addWidgetValue("EventKey", $$(eventKey));
widgets.addWidgetValue("MatchLevel", $$(matchLevel));
widgets.addWidgetValue("MatchNumber", $$(matchNumber));
widgets.addWidgetValue("Team", $$(teamData));

function updateStatus(msg: Ref<string>, saveVar: Ref<unknown>, { code, data }: TBAData) {
  eventKey = code;
  saveVar.value = data;

  if (isFailed(data)) msg.value = "\u274C " + getError(data);
  else if (isEmpty(data)) msg.value = "\u26A0\uFE0F No data available";
  else msg.value = "\u2705 Loaded successfully";
}

function loadTBAData() {
  tba.load(eventKey, "teams").then(value => updateStatus($$(teamsLoadStatus), $$(teams), value));
  tba.load(eventKey, "matches").then(value => updateStatus($$(matchesLoadStatus), $$(matches), value));
}
</script>
