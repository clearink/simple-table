import { computed, Ref } from "vue";

// 排序 仅支持 visibleColumns 的排序
export default function useTableSort(
  $dataSource: Ref<any[]>,
  $columns: Ref<any[]>
) {
  return computed(() => {
    const sorter = $columns.value
      .filter((column: any) => typeof column.onSort === "function")
      .map((column: any) => column.onSort);

    return sorter.reduce((result, sort) => {
      return result.sort(sort);
    }, $dataSource.value.slice());
  });
}
