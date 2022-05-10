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
              <div v-if="header.onSort" class="s-table__sorter">
                <span class="s-table__th-title">{{ header.title }}</span>
                <s-sorter
                  :value="findSortState(header)"
                  @change="handleSorterChange(header, $event)"
                />
              </div>
              <template v-else>{{ header.title }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cells, i) in data" :key="i">
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
      v-if="pagination !== null"
      v-bind="paginationState"
      @change="handlePaginationChange"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, toRef } from "vue";

// component
import SPagination from "./components/SimplePagination.vue";
import SSorter from "./components/TableSorter.vue";

// hooks
import useSlotExist from "./hooks/useSlotExist";
import useTableColumns from "./hooks/useTableColumns";
import useTableBody from "./hooks/useTableBody";
import usePagination, { PaginationProps } from "./hooks/usePagination";
import useTableSort from "./hooks/useTableSort";
// ts
export default defineComponent({
  name: "SimpleTable",
  components: {
    SSorter,
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

    const handleSorterChange = (
      column: any,
      type: "ascend" | "descend" | undefined
    ) => {
      triggerSorter(column, type);
    };

    // custom hook
    const headerVisible = useSlotExist(slots.header);
    const footerVisible = useSlotExist(slots.footer);

    const [headerGroups, dataColumns, allColumns] = useTableColumns(
      slots.default
    );

    const [dataSource, triggerSorter, findSortState] = useTableSort(
      toRef(props, "dataSource"),
      allColumns
    );

    const rows = useTableBody(dataSource, dataColumns);

    const [data, paginationState, updatePagination] = usePagination(
      rows,
      $pagination
    ); // 分页

    return {
      headerVisible,
      footerVisible,
      headerGroups,
      data,
      paginationState,
      handlePaginationChange,
      handleSorterChange,
      findSortState,
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
  .s-table__sorter {
    display: flex;
    align-self: center;
    .s-table__th-title {
      flex: auto;
    }
  }

  .s-table__footer {
  }
}
</style>
