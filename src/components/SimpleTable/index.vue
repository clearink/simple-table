<template>
  <div class="s-table">
    <div class="s-table__header" v-if="headerVisible">
      <slot name="title"></slot>
    </div>
    <div class="s-table__container">
      <table class="s-table__table">
        <colgroup>
          <!-- 此处计算各列的宽度 -->
        </colgroup>
        <thead>
          <tr v-for="(headerGroup, i) in headerGroups" :key="i">
            <th
              v-for="header in headerGroup"
              v-bind="header.headerProps"
              :key="header.headerProps.key"
              class="s-table__th"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cells, i) in dataRows" :key="i">
            <td v-for="(cell, i) in cells" :key="i" class="s-table__td">
              {{ cell.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="s-table__footer" v-if="footerVisible">
      <slot name="title"></slot>
    </div>
    <!-- 分页区 -->
    <s-pagination
      v-if="paginationVisible"
      v-bind="paginationState"
      @change="handlePaginationChange"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, toRef } from "vue";

// component
import SPagination from "./components/SimplePagination.vue";

// hooks
import useSlotExist from "./hooks/useSlotExist";
import useTableColumns from "./hooks/useTableColumns";
import useTableBody from "./hooks/useTableBody";
import { computed } from "@vue/reactivity";
import usePagination, { PaginationProps } from "./hooks/usePagination";
import useTableSort from "./hooks/useTableSort";
// ts
export default defineComponent({
  name: "SimpleTable",
  components: {
    SPagination,
  },
  props: {
    // 源数据
    dataSource: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    // 分页
    pagination: {
      type: Object as PropType<PaginationProps | null>,
    },
  },
  emits: ["change"],
  setup(props, { slots, emit }) {
    const dataSource = toRef(props, "dataSource");
    const $pagination = toRef(props, "pagination");

    const paginationVisible = computed(() => {
      return $pagination.value !== false;
    });

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
    const handleSortChange = () => {
      // "ascend" | "descend" | undefined
      const sorter = { field: "123", order: "ascend" };
    };

    // custom hook
    const headerVisible = useSlotExist(slots.header);
    const footerVisible = useSlotExist(slots.footer);

    const [headerGroups, dataColumns] = useTableColumns(slots.default);
    const rows = useTableBody(dataSource, dataColumns);

    const [dataRows, paginationState, updatePagination] = usePagination(
      useTableSort(rows),
      $pagination
    ); // 分页

    return {
      headerVisible,
      footerVisible,
      paginationVisible,
      headerGroups,
      dataRows,
      handlePaginationChange,
      paginationState,
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
    .s-table__th,
    .s-table__td {
      border: 1px solid #f0f0f0;
      padding: 8px;
    }
  }

  .s-table__footer {
  }
}
</style>
