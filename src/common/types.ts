export interface ConfigData {
  heading?: string;
  logo?: string;
  skipTeamSelection?: boolean;
  forceQualifiers?: boolean;
  pages: PageData[];
}

export interface PageData {
  name: string;
  widgets: WidgetData[];
}

export interface WidgetData {
  // Required field
  type: string;

  // Global optional fields
  prefix?: string;
  align?: string;
  noLabel?: boolean;
  row?: number;
  col?: number;
  rowspan?: number;
  colspan?: number;
  labelColspan?: number;

  // Type-specific required fields
  name?: string;
  file?: string;
  options?: string[];

  // Type-specific optional fields
  width?: number;
  height?: number;
  allowMultiple?: boolean;
  selectRadius?: number;
  selectColor?: string;
  default?: number;
  min?: number;
  max?: number;
  allowKeyboardInput?: boolean;
  startLabel?: string;
  lapLabel?: string;
  stopLabel?: string;
  maxLaps?: number;
}

export enum LabelType {
  None,
  LabelTag,
  PlainText
}
