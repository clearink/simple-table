import { ColumnsType } from "../../interface";
import makeHeaderGroups from "./makeHeaderGroups";

export interface HeaderGroupType {
  title?: string;
  column: ColumnsType[number]
  headerProps: Record<string, any> & commonCellProps;
  onSort?: (a: unknown, b: unknown) => number;
  onFilter?: (a: unknown, b: unknown) => boolean;
}

export interface commonCellProps {
  key: number;
}
export type HeaderGroupResult = ReturnType<typeof makeHeaderGroups>;
