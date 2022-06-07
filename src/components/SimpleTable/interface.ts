import { Slot } from "vue";

type SortableHandler = (a: any, b: any) => number;

// 解析slot 生成的 columns 类型
export interface ColumnType {
  title?: string;
  "data-index"?: string | number;
  colSpan?: number;
  rowSpan?: number;
  slots?: Record<"title" | "default", Slot>;
  sortable?:
    | SortableHandler
    | {
        compare?: SortableHandler;
        order?: number; // 多列排序优先级, 越大优先级越高
        sortOrder?: SortOrderType[];
      };
}

export interface ColumnGroupType extends Omit<ColumnType, "dataIndex"> {
  children: ColumnsType;
}

export type ColumnsType = (ColumnGroupType | ColumnType)[];

// 头部数据相关类型
export type WithKeyProps = { key: string | number };
export interface HeaderGroupType {
  column: ColumnType;
  columnKey: string | number;
  headerProps: Record<string, any> & WithKeyProps;
}
export type HeaderGroupMatrixType = {
  groups: HeaderGroupType[];
  props: object & WithKeyProps;
}[];

// 表格主体相关类型
export type TableBodyDataType = {
  cells: ({
    column: ColumnType;
    value: any;
  } & WithKeyProps)[];
  record: Record<string, any>;
};

export type SortOrderType = "ascend" | "descend" | undefined;
export interface SortState
  extends Pick<ColumnType, "data-index" | "sortable">,
    Pick<HeaderGroupType, "column" | "columnKey"> {
  sortState: SortOrderType;
}

export type PaginationProps = false | {
  current?: number;
  pageSize?: number;
  total?: number;
};
