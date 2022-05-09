import makeHeaderGroups from "./makeHeaderGroups";

export interface HeaderGroupType {
  title?: string;
  headerProps: Record<string, any> & commonCellProps;
  onSort?: (a: unknown, b: unknown) => number;
}

export interface commonCellProps {
  key: number;
}
export type HeaderGroupResult = ReturnType<typeof makeHeaderGroups>;
