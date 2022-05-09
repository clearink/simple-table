import { Ref, shallowRef, watchEffect, toRaw } from "vue";

export default function useTableBody<D, L>(
  $dataSource: Ref<D[]>,
  $dataColumns: Ref<L[]>
) {
  const rows = shallowRef<any[]>([]);
  watchEffect(() => {
    const dataColumns = $dataColumns.value;
    const dataSource = $dataSource.value;
    rows.value = dataSource.map((source: any) => {
      return dataColumns.map((column: any) => {
        const { dataIndex, "data-index": $dataIndex } = column;
        const value = source[dataIndex ?? $dataIndex];
        return { ...column, value, record: toRaw(source) };
      });
    });
  });
  return rows;
}
