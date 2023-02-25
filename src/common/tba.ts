import { get, has } from "lodash";

export interface TBAData {
  readonly code: string; // The event code
  readonly data: unknown; // The data received from the TBA API
}

// Checks if a TBA data object contains an error message.
export const isFailed = (data: unknown) => has(data, "Error");

// Gets the error message from a TBA data object.
export const getError = (data: unknown) => get(data, "Error");

// Gets a team's name given their number and a list of teams.
export const getTeamName = (num: number, teamsList?: unknown[]): string =>
	get(teamsList?.filter(team => get(team, "key") === `frc${num}`)[0], "nickname") ?? "No name available";
