import { get, has } from "lodash";

export interface TBAData {
  readonly code: string;
  readonly data: unknown;
}

export const isFailed = (data: unknown) => has(data, "Error");

export const getError = (data: unknown) => get(data, "Error");

export const getTeamName = (num: number, teamsList?: unknown[]): string =>
	get(teamsList?.filter(team => get(team, "key") === `frc${num}`)[0], "nickname") ?? "No name available";
