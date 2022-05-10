import { computed, Ref, ref, watchEffect } from "vue";
import { HeaderGroupType } from "./useTableColumns/interface";

// 收集所有的 排序 状态
function collectSortState($columns: any[]) {
  return $columns
    .filter((column: any) => typeof column.onSort === "function")
    .map((item) => ({
      dataIndex: item.dataIndex,
      onSort: item.onSort,
      sortOrder: undefined as any,
    }));
}

// 排序 仅支持 visibleColumns 的排序
export default function useTableSort(
  $dataSource: Ref<any[]>,
  $columns: Ref<any[]>
) {
  const sortState = ref(collectSortState($columns.value)); // 存储收集起来的状态

  const triggerSorter = (
    header: HeaderGroupType,
    type: "ascend" | "descend" | undefined
  ) => {
    const { dataIndex } = header.column;
    sortState.value = sortState.value.map((item) => {
      if (item.dataIndex === dataIndex) {
        return { ...item, sortOrder: type };
      }
      return item;
    });
  };

  const findSortState = (header: HeaderGroupType) => {
    const { dataIndex } = header.column;
    const state = sortState.value;
    return state.find((state) => state.dataIndex === dataIndex)?.sortOrder;
  };

  const dataSource = computed(() => {
    return sortState.value.reduce((result, sort) => {
      return result.sort((a, b) => {
        const result = sort.onSort(a, b);
        return (
          result *
          new Map([
            [undefined, 0],
            ["ascend", 1],
            ["descend", -1],
          ]).get(sort.sortOrder)!
        );
      });
    }, $dataSource.value.slice());
  });
  return [dataSource, triggerSorter, findSortState] as const;
}
