import { onBeforeUpdate, shallowRef, Slot, watchEffect } from "vue";
// component
import Column from "../../components/TableColumn";
import Group from "../../components/TableColumnGroup";
// utils
import makeHeaderGroups from "./makeHeaderGroups";
// ts
import type { HeaderGroupType } from "./interface";

export default function useTableColumns(defaultSlot?: Slot) {
  // 生成表格头部数据
  const headerGroups = shallowRef<HeaderGroupType[][]>([]);
  const dataColumns = shallowRef<object[]>([]);
  const allColumns = shallowRef<object[]>([]);

  // 解析 vNode 生成对应的 columns 数据
  const makeColumns = (slot?: Slot): any[] => {
    const children = slot && typeof slot === "function" ? slot() : [];
    return children.reduce((columns, child) => {
      const type = child.type;

      const {
        title,
        "data-index": dataIndex,
        onSort,
        onFilter,
      } = (child.props ?? {}) as any;
      const column = { title, dataIndex, onSort, onFilter };

      if (Column === type) return columns.concat(column);
      if (Group === type && child.children) {
        if (Array.isArray(child.children)) return columns;
        if (typeof child.children === "string") return columns;
        const children = makeColumns(child.children.default as any);

        return columns.concat({ ...column, children });
      }
      return columns;
    }, [] as any[]);
  };

  const slotRef = shallowRef<Slot | undefined>(defaultSlot);

  onBeforeUpdate(() => (slotRef.value = defaultSlot));
  // 监听变化
  watchEffect(() => {
    const columns = makeColumns(slotRef.value);
    const makeResult = makeHeaderGroups(columns);
    headerGroups.value = makeResult.headerGroups;
    dataColumns.value = makeResult.dataColumns;
    allColumns.value = makeResult.allColumns;
  });
  return [headerGroups, dataColumns, allColumns] as const;
}
