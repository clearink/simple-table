import type { Slot } from "vue";
import { tableColumnGroupToken, tableColumnToken } from "./token";
import {
  ColumnsType,
  ColumnType,
  HeaderGroupType,
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
    if (displayName === tableColumnToken) {
      return columns.concat(column);
    }
    if (displayName === tableColumnGroupToken && children) {
      if (isArray(children)) return columns;
      if (isString(children)) return columns;
      const $children = normalizeColumnsBySlots(children.default as Slot);
      return columns.concat({ ...column, children: $children });
    }
    return columns; // 舍弃其他类型的数据
  }, [] as ColumnsType);
}

// 收集所有的 排序 状态
export function collectSortState($columns: HeaderGroupType[]) {
  const states = $columns
    .filter(({ column }) => !!column.sortable)
    .map(({ column, columnKey }) => ({
      column,
      columnKey,
      dataIndex: column["data-index"], // 排序字段
      sortable: column.sortable, // 排序
      sortState: undefined as SortOrderType,
    }));
  return getSortedStateList(states);
}

// 获取排序后的状态列表
export function getSortedStateList(list: SortState[]) {
  const sortableNormalized = list.map((item) => {
    return {
      ...item,
      sortable: isFunction(item.sortable)
        ? { compare: item.sortable }
        : item.sortable,
    };
  });
  // 不要改变 list 原始数据
  return sortableNormalized.sort((a, b) => {
    const orderA = a.sortable?.order ?? 0;
    const orderB = b.sortable?.order ?? 0;
    return orderA - orderB;
  });
}

export const defaultSortOrder: SortOrderType[] = [
  undefined,
  "ascend",
  "descend",
];

// 循环获取某个列表的下一个值
export function getNextItem<T extends SortOrderType>(
  list: SortOrderType[],
  value: T
) {
  const currentIndex = list.findIndex((item) => item === value);
  const index = Math.max(currentIndex + 1, 0);
  return list[index % list.length];
}

// 获取排序比率
export function getSortRatio(orderType: SortOrderType) {
  if (orderType === "ascend") return 1;
  if (orderType === "descend") return -1;
  return 0;
}

export function getColumnKey(column: ColumnType, defaultKey: number) {
  const dataIndex = column["data-index"];
  if (!isNullUndefined(dataIndex)) return dataIndex;
  return defaultKey;
}
