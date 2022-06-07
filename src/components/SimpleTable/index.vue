<template>
  <div class="s-table">
    <div class="s-table__title" v-if="titleVisible">
      <slot name="title"></slot>
    </div>
    <div class="s-table__container">
      <table class="s-table__table">
        <table-header :data-source="headers" />
        <table-body :data-source="cells" :row-key="rowKey" />
      </table>
    </div>
    <div class="s-table__footer" v-if="footerVisible">
      <slot name="footer"></slot>
    </div>
    <!-- 分页区 -->
    <table-pagination
      v-if="pagination !== false"
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

// ts
import type { PaginationProps } from "./interface";

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
      type: [Object, Boolean] as PropType<PaginationProps>,
      default: undefined
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
        updatePagination(pagination); // 修改内部的数据
      }
      handleTableChange(pagination, {}, { type: "pagination" });
    };

    // custom hook
    const titleVisible = useSlotExist(slots.title);
    const footerVisible = useSlotExist(slots.footer);

    const { rows, updatePagination, ...rest } = useTableDataSource(
      toRef(props, "dataSource"),
      $pagination,
      slots.default
    );

    return {
      titleVisible,
      footerVisible,
      ...rest,
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
