import type { Slot } from "vue";
import { ColumnsType, ColumnType } from "../interface";

// utils
import { isArray, isFunction, isString } from "./validateType";

// 解析 Slot 生成对应的 columns 数据
export function normalizeColumnsBySlots(slot?: Slot): ColumnsType {
  const children = isFunction(slot) ? slot() : [];
  return children.reduce((columns, child) => {
    const { type, props, children } = child;
    const column = {
      ...props,
      dataIndex: props?.["data-index"],
      slots: children,
    } as ColumnType;
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