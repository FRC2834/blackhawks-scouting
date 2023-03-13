import { repeat } from "lodash";

// Possible label types for widgets in a form.
export enum LabelType {
  None,
  LabelTag,
  PlainText
}

// An exception representing malformed configuration JSON.
export class InvalidConfigError extends Error {
  private _subEntries = new Array<string>(); // Indented lines with more details

  constructor(s: string) {
    super(s);

    this.name = "InvalidConfigError";
  }

  // Adds a subentry to the error.
  public addSubEntry(s: string, levels: number) {
    // Indent with 4 spaces for each indentation level
    const newLine = repeat(" ", levels * 4) + s;
    this._subEntries.push(newLine);
    this.message += `\n${newLine}`;
  }

  // Checks if there are subentries in this error object.
  public hasEntries() {
    return this._subEntries.length > 0;
  }
}

// An exception representing a failed resource fetch.
export class FetchError extends Error {
  constructor(name: string, r: Response) {
    super(`Fetch failed (${name}): HTTP ${r.status} (${r.statusText})`);

    this.name = "FetchError";
  }
}

// Functions to validate with a single value.
export const validationFuncs = new Map<string, (n: number, val: number) => boolean>([
  ["less", (n: number, val: number) => n < val],
  ["lessOrEqual", (n: number, val: number) => n <= val],
  ["greater", (n: number, val: number) => n > val],
  ["greaterOrEqual", (n: number, val: number) => n >= val],
  ["equal", (n: number, val: number) => n === val]
]);

// Functions to validate with a range.
export const validationFuncsRange = new Map<string, (n: number, vals: number[]) => boolean>([
  ["inRange", (n: number, val: number[]) => n >= Math.min(...val) && n <= Math.max(...val)],
  ["outOfRange", (n: number, val: number[]) => n < Math.min(...val) || n > Math.max(...val)]
]);
