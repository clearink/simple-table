export type DataIndex = string | number | readonly (string | number)[];
export interface ColumnType<RecordType> {
  title?: string;
  'data-index'?: DataIndex;
  colSpan?: number;
  rowSpan?: number;
  data?: RecordType; // 暂时这样吧
  onSort?: (a: unknown, b: unknown) => number;
  onFilter?: (a: unknown, b: unknown) => boolean;
}

export interface ColumnGroupType<RecordType>
  extends Omit<ColumnType<RecordType>, "data-index"> {
  children: ColumnsType<RecordType>;
}

export type ColumnsType<RecordType = unknown> = (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];
