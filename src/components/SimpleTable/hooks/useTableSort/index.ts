import { computed, provide, Ref, ref } from "vue";
import { ColumnType, NormalizedColumnsType } from "../../interface";

// 收集所有的 排序 状态
function collectSortState($columns: NormalizedColumnsType[]) {
  return $columns
    .filter(({ column }) => typeof column.onSort === "function")
    .map(({ column }) => ({
      dataIndex: column.dataIndex,
      onSort: column.onSort,
      sortOrder: undefined as "ascend" | "descend" | undefined,
    }));
}

// 排序 仅支持 visibleColumns 的排序
export default function useTableSort(
  $dataSource: Ref<any[]>,
  $columns: Ref<NormalizedColumnsType[]>
) {
  const sortState = ref(collectSortState($columns.value)); // 存储收集起来的状态

  const triggerSorter = (
    column: ColumnType,
    type: "ascend" | "descend" | undefined
  ) => {
    const { dataIndex } = column;
    sortState.value = sortState.value.map((item) => {
      if (item.dataIndex === dataIndex) {
        return { ...item, sortOrder: type };
      }
      return item;
    });
  };

  const findSortState = (column: ColumnType) => {
    const { dataIndex } = column;
    const state = sortState.value;
    return state.find((state) => state.dataIndex === dataIndex)?.sortOrder;
  };

  const dataSource = computed(() => {
    return sortState.value.reduce((result, { onSort, sortOrder }) => {
      return result.sort((a, b) => {
        const result = onSort?.(a, b) ?? 0;
        return (
          result *
          new Map([
            [undefined, 0],
            ["ascend", 1],
            ["descend", -1],
          ]).get(sortOrder)!
        );
      });
    }, $dataSource.value.slice());
  });

  provide("triggerSorter", triggerSorter);
  provide("findSortState", findSortState);

  return dataSource;
}
