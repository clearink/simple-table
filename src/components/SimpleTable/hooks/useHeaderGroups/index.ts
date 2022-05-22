import { onBeforeUpdate, shallowRef, Slot, watchEffect } from "vue";

// utils
import makeHeaderGroups from "../../shared/makeHeaderGroups";
import { normalizeColumnsBySlots } from "../../shared/utils";

// ts
import type { HeaderGroupMatrixType } from "../../interface";

export default function useTableColumns(defaultSlot?: Slot) {
  const headerGroups = shallowRef<HeaderGroupMatrixType>([]);

  const slotRef = shallowRef<Slot | undefined>(defaultSlot);

  onBeforeUpdate(() => (slotRef.value = defaultSlot));
  // 监听变化
  watchEffect(() => {
    const columns = normalizeColumnsBySlots(slotRef.value);
    headerGroups.value = makeHeaderGroups(columns);
  });
  return headerGroups;
}
