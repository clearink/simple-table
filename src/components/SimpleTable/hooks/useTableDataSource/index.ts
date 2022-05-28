import { Ref, Slot } from "vue";
import useTableColumns from "../useTableColumns";
import useHeaderGroups from "../useHeaderGroups";
import useTableSort from "../useTableSort";
import useTableBody from "../useTableBody";
import usePagination from "../usePagination";

// ts
import type { PaginationProps } from "../../interface";

// 统一处理 table 内部数据操作
export default function useTableDataSource(
  $dataSource: Ref<any[]>,
  $pagination: Ref<PaginationProps | undefined>,
  defaultSlot?: Slot
) {
  const headers = useHeaderGroups(defaultSlot);
  const [dataColumns, allColumns] = useTableColumns(headers);
  const dataSource = useTableSort($dataSource, allColumns);
  const rows = useTableBody(dataSource, dataColumns);
  const [cells, paginationState, updatePagination] = usePagination(
    rows,
    $pagination
  );
  return {
    rows,
    headers,
    cells,
    paginationState,
    updatePagination,
  };
}
