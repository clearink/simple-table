export interface TableColumnProps<RT = unknown> {
  title: string;
  dataIndex?: string | number;
  onSort?: (rowA: RT, rowB: RT) => number;
  onFilter?: (value: any, row: RT) => boolean;
}

export type TableColumnGroupProps<RT = unknown> = Omit<
  TableColumnProps<RT>,
  "dataIndex"
>;
