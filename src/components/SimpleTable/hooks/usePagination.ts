import { Ref, ref, computed, watchEffect } from "vue";

// 分页
export interface PaginationProps {
  current?: number;
  pageSize?: number;
  total?: number;
}
export default function usePagination(
  $rows: Ref<any[]>,
  $pagination: Ref<PaginationProps | null | undefined>
) {
  // 内部存储分页相关数据
  const state = ref($pagination.value);
  const pagination = computed(() => {
    const value = state.value;
    // 不显示分页则全量显示数据
    const dataLength = $rows.value.length;
    if (value === null) return { current: 1, pageSize: dataLength };
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
  // 处理过的数据 并触发事件
}
