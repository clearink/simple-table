<template>
  <thead class="s-table-header">
    <tr v-for="{ groups, props } in dataSource" v-bind="props" :key="props.key">
      <table-cell
        v-for="{ column, headerProps, columnKey } in groups"
        v-bind="headerProps"
        :key="headerProps.key"
        render-title
      >
        <div v-if="column.sortable" class="s-table__sorter">
          <span class="s-table__title">
            <render-slot
              :slots="column.slots"
              type="title"
              :attrs="{ title: column.title, column }"
            >
              {{ column.title }}
            </render-slot>
          </span>
          <table-sorter
            :value="findSortState(columnKey)"
            @change="triggerSorter(columnKey, $event)"
          />
        </div>
        <render-slot v-else :slots="column.slots" type="title">
          {{ column.title }}
        </render-slot>
      </table-cell>
    </tr>
  </thead>
</template>
<script lang="ts">
import { defineComponent, inject, PropType } from "vue";

import TableCell from "../TableCell/index.vue";
import TableSorter from "../TableSorter/index.vue";
import RenderSlot from "../RenderSlot/index.vue";

import { HeaderGroupMatrixType } from "../../interface";

export default defineComponent({
  name: "TableHeader",
  components: {
    TableCell,
    TableSorter,
    RenderSlot,
  },
  props: {
    dataSource: {
      type: Array as PropType<HeaderGroupMatrixType>,
      default: () => [],
    },
  },
  setup() {
    const triggerSorter = inject<any>("triggerSorter", () => {});
    const findSortState = inject<any>("findSortState", () => {});

    return {
      findSortState,
      triggerSorter,
    };
  },
});
</script>
<style lang="scss" scoped>
.s-table-header {
  .s-table__sorter {
    display: flex;
    align-self: center;
    .s-table__title {
      flex: auto;
    }
  }
}
</style>
