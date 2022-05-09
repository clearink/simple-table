import { computed, Ref } from "vue";

// 排序 仅支持 visibleColumns 的排序
export default function useTableSort($rows: Ref<any[]>) {
  return computed(() => {
    const rows = $rows.value.slice();
    if (rows.length === 0) return rows;
    // 拿到所有 onSort 的 dataIndex
    return rows.sort()
  });
}
