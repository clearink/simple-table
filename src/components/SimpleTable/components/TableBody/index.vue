<template>
  <tbody class="s-table-body">
    <tr
      v-for="({ cells, record }, i) in dataSource"
      :key="handleGetRowKey(record, i)"
    >
      <table-cell v-for="{ column, value, key } in cells" :key="key">
        <render-slot
          :slots="column.slots"
          type="default"
          :attrs="{ value, column, record }"
        >
          {{ value }}
        </render-slot>
      </table-cell>
    </tr>
  </tbody>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

// components
import TableCell from "../TableCell/index.vue";
import RenderSlot from "../RenderSlot/index.vue";
// ts
import type { TableBodyDataType } from "../../interface";

export default defineComponent({
  name: "TableBody",
  components: { TableCell, RenderSlot },
  props: {
    dataSource: {
      type: Array as PropType<TableBodyDataType[]>,
      default: () => [],
    },
  },
  setup() {
    const handleGetRowKey = (record: any, i: number) => {
      const rowKey = "key";
      if (rowKey) return record[rowKey];
      return i;
    };
    return {
      handleGetRowKey,
    };
  },
});
</script>
<style lang="scss" scoped>
.s-table-body {
}
</style>
