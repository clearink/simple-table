import { Slot } from "vue";

// 解析slot 生成的 columns 类型
export interface ColumnType {
  title?: string;
  dataIndex?: string | number;
  colSpan?: number;
  rowSpan?: number;
  slots?: Record<"title" | "default", Slot>;
  onSort?: (a: unknown, b: unknown) => number;
  onFilter?: (a: unknown, b: unknown) => boolean;
}

export interface ColumnGroupType extends Omit<ColumnType, "dataIndex"> {
  children: ColumnsType;
}

export type ColumnsType = (ColumnGroupType | ColumnType)[];

// 头部数据相关类型
export type WithKeyProps = { key: string | number };
export interface HeaderGroupType {
  column: ColumnType;
  headerProps: Record<string, any> & WithKeyProps;
}
export type HeaderGroupMatrixType = {
  groups: HeaderGroupType[];
  props: object & WithKeyProps;
}[];

export type NormalizedColumnsType = { column: ColumnType } & WithKeyProps;

export type SortOrderType = "ascend" | "descend" | undefined;

// 表格主体相关类型
export type TableBodyDataType = {
  cells: ({
    column: ColumnType;
    value: any;
  } & WithKeyProps)[];
  record: Record<string, any>;
};
