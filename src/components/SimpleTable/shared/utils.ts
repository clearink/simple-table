import type { Slot } from "vue";
import {
  ColumnsType,
  ColumnType,
  HeaderGroupType,
  NormalizedSortable,
  SortOrderType,
  SortState,
} from "../interface";

// utils
import { isArray, isFunction, isNullUndefined, isString } from "./validateType";

// 解析 Slot 生成对应的 columns 数据
export function normalizeColumnsBySlots(slot?: Slot): ColumnsType {
  const children = isFunction(slot) ? slot() : [];
  return children.reduce((columns, child) => {
    const { type, props, children } = child;
    const column = { ...props, slots: children } as ColumnType;
    const displayName = (type as any).displayName;
    if (displayName === Symbol.for("TableColumn")) {
      return columns.concat(column);
    }
    if (displayName === Symbol.for("TableColumnGroup") && children) {
      if (isArray(children)) return columns;
      if (isString(children)) return columns;
      const $children = normalizeColumnsBySlots(children.default as Slot);
      return columns.concat({ ...column, children: $children });
    }
    return columns; // 舍弃其他类型的数据
  }, [] as ColumnsType);
}

// 收集所有的 排序 状态
export function collectSortState($columns: HeaderGroupType[]): SortState[] {
  return $columns
    .filter(({ column }) => !!column.sortable)
    .map(({ column, columnKey }) => ({
      column,
      columnKey,
      dataIndex: column["data-index"], // 排序字段
      sortable: column.sortable, // 排序
      sortState: undefined as SortOrderType,
    }));
}

export const defaultSortOrder: SortOrderType[] = [
  undefined,
  "ascend",
  "descend",
];

// 获取排序规则列表
export function normalizeSortRuleList(list: SortState[]) {
  return list
    .map((item) => {
      if (isFunction(item.sortable)) {
        return {
          sortOrder: defaultSortOrder,
          ...item,
          sortable: { compare: item.sortable! },
        };
      }
      return {
        sortOrder: defaultSortOrder,
        ...item,
      };
    })
    .slice() // 修改副本
    .sort((a, b) => {
      const orderA = (a.sortable as NormalizedSortable)?.order ?? 0;
      const orderB = (b.sortable as NormalizedSortable)?.order ?? 0;
      return orderA - orderB;
    });
}

// 循环获取某个列表的下一个值
export function getNextCycleItem<T extends SortOrderType>(
  list: SortOrderType[],
  value: T
) {
  const currentIndex = list.findIndex((item) => item === value);
  const index = Math.max(currentIndex, 0);
  return [0, 1, -1][index % list.length];
}

export function getColumnKey(column: ColumnType, defaultKey: string) {
  const dataIndex = column["data-index"];
  if (!isNullUndefined(dataIndex)) return `${dataIndex}`;
  return defaultKey;
}
