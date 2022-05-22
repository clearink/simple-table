import { computed, Ref } from "vue";
import {
  ColumnGroupType,
  HeaderGroupMatrixType,
  HeaderGroupType,
} from "../../interface";

export default function useTableColumns(
  headerGroups: Ref<HeaderGroupMatrixType>
) {
  const allColumns = computed(() => {
    const groups = headerGroups.value;
    return groups.reduce((result, { groups }) => {
      return result.concat(groups);
    }, [] as HeaderGroupType[]);
  });
  const dataColumns = computed(() => {
    return allColumns.value.filter((column) => {
      const children = (column.column as ColumnGroupType).children ?? [];
      return children.length === 0;
    });
  });

  return [dataColumns, allColumns] as const;
}
