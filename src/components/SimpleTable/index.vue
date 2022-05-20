<template>
  <div class="s-table">
    <div class="s-table__header" v-if="headerVisible">
      <slot name="title"></slot>
    </div>
    <div class="s-table__container">
      <table class="s-table__table">
        <table-header :data-source="headerGroups" />
        <table-body :data-source="cellGroups" />
      </table>
    </div>
    <div class="s-table__footer" v-if="footerVisible">
      <slot name="footer"></slot>
    </div>
    <!-- 分页区 -->
    <table-pagination
      v-if="pagination !== null"
      v-bind="paginationState"
      @change="handlePaginationChange"
    />
  </div>
</template>
<script lang="ts">
// export
export { default as STableColumn } from "./components/TableColumn";
export { default as STableColumnGroup } from "./components/TableColumnGroup";

import { defineComponent, PropType, toRef } from "vue";

// component
import TableHeader from "./components/TableHeader/index.vue";
import TableBody from "./components/TableBody/index.vue";
import TablePagination from "./components/TablePagination/index.vue";

// hooks
import useTableDataSource from "./hooks/useTableDataSource";
import useSlotExist from "./hooks/useSlotExist";
import useTableColumns from "./hooks/useTableColumns";
import useTableBody from "./hooks/useTableBody";
import useTableSort from "./hooks/useTableSort";
import usePagination from "./hooks/usePagination";

// ts
import type { PaginationProps } from "./hooks/usePagination";

export default defineComponent({
  name: "SimpleTable",
  components: {
    TablePagination,
    TableHeader,
    TableBody,
  },
  props: {
    // 源数据
    dataSource: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    rowKey: {
      type: [String, Function] as PropType<string | ((record: any) => any)>,
      required: true,
    },

    // 分页
    pagination: {
      type: Object as PropType<PaginationProps | null>,
    },
  },
  emits: ["change"],
  setup(props, { slots, emit }) {
    const $pagination = toRef(props, "pagination");

    const handleTableChange = (pagination: any, sorter: any, extra: any) => {
      emit("change", pagination, sorter, extra);
    };

    const handlePaginationChange = (current: number, pageSize: number) => {
      const pagination = { current, pageSize, total: rows.value.length };
      if (props.pagination === undefined) {
        // 修改内部的数据
        updatePagination(pagination);
      } else {
        const sorter = {};
        handleTableChange(pagination, sorter, { type: "pagination" });
      }
    };

    // custom hook
    const headerVisible = useSlotExist(slots.header);
    const footerVisible = useSlotExist(slots.footer);

    useTableDataSource(toRef(props, "dataSource"));

    const [headerGroups, dataColumns, allColumns] = useTableColumns(
      slots.default
    );

    const dataSource = useTableSort(toRef(props, "dataSource"), allColumns);

    const rows = useTableBody(dataSource, dataColumns);

    const [cellGroups, paginationState, updatePagination] = usePagination(
      rows,
      $pagination
    ); // 分页
    return {
      headerVisible,
      footerVisible,
      headerGroups,
      cellGroups,
      paginationState,
      handlePaginationChange,
    };
  },
});
</script>
<style lang="scss" scoped>
.s-table {
  .s-table__title {
  }
  .s-table__container {
    .s-table__table {
      width: 100%;
      table-layout: auto;
      border-collapse: collapse;
    }
  }

  .s-table__footer {
  }
}
</style>
