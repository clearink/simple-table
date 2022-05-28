import { Ref, ref, computed } from "vue";
import { PaginationProps, TableBodyDataType } from "../../interface";

// 分页
export default function usePagination(
  $rows: Ref<TableBodyDataType[]>,
  $pagination: Ref<PaginationProps | undefined>
) {
  // 内部存储分页相关数据
  const state = ref($pagination.value);
  const pagination = computed(() => {
    const value = state.value;
    const dataLength = $rows.value.length;
    // 不显示分页则全量显示数据
    if (value === false) return { current: 1, pageSize: dataLength };
    const { current = 1, pageSize = 10 } = value ?? {};
    return { current, pageSize, total: dataLength };
  });

  const rows = computed(() => {
    const { current, pageSize } = pagination.value;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return $rows.value.slice(start, end);
  });
  const update = (data: PaginationProps) => {
    state.value = data;
  };
  return [rows, pagination, update] as const;
}
