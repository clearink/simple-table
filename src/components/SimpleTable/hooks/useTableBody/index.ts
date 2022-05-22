import { Ref, shallowRef, watchEffect, toRaw } from "vue";
import { HeaderGroupType, TableBodyDataType } from "../../interface";
import { isUndefined } from "../../shared/validateType";

export default function useTableBody<D>(
  $dataSource: Ref<D[]>,
  $dataColumns: Ref<HeaderGroupType[]>
) {
  const rows = shallowRef<TableBodyDataType[]>([]);
  watchEffect(() => {
    const dataColumns = $dataColumns.value;
    const dataSource = $dataSource.value;
    rows.value = dataSource.map((record: any) => {
      const cells = dataColumns.map(($column) => {
        const dataIndex = $column.column["data-index"];
        const value = isUndefined(dataIndex) ? undefined : record[dataIndex];
        return { ...$column, value, key: $column.headerProps.key };
      });
      return { cells, record: toRaw(record) };
    });
  });
  return rows;
}
