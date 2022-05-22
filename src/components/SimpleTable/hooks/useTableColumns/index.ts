import { onBeforeUpdate, shallowRef, Slot, watchEffect } from "vue";

// utils
import makeHeaderGroups from "../../shared/makeHeaderGroups";
import { normalizeColumnsBySlots } from "../../shared/utils";

// ts
import type {
  HeaderGroupMatrixType,
  NormalizedColumnsType,
} from "../../interface";

export default function useTableColumns(defaultSlot?: Slot) {
  // 生成表格头部列数据，是否应当不在此处处理？
  const headerGroups = shallowRef<HeaderGroupMatrixType>([]);
  // 生成表格主体列数据，是否应当不在此处处理？
  const dataColumns = shallowRef<NormalizedColumnsType[]>([]);
  // flattenedColumns，是否有必要？//
  const allColumns = shallowRef<NormalizedColumnsType[]>([]);

  const slotRef = shallowRef<Slot | undefined>(defaultSlot);

  onBeforeUpdate(() => (slotRef.value = defaultSlot));
  // 监听变化
  watchEffect(() => {
    const columns = normalizeColumnsBySlots(slotRef.value);
    const makeResult = makeHeaderGroups(columns);
    headerGroups.value = makeResult.headerGroups;
    dataColumns.value = makeResult.dataColumns;
    allColumns.value = makeResult.allColumns;
  });
  return [headerGroups, dataColumns, allColumns] as const;
}
