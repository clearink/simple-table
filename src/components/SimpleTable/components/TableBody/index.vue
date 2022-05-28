<template>
  <tbody class="s-table-body">
    <tr v-for="{ cells, record } in dataSource" :key="handleGetRowKey(record)">
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
import { defineComponent, PropType, toRefs } from "vue";

// components
import TableCell from "../TableCell/index.vue";
import RenderSlot from "../RenderSlot/index.vue";
// ts
import type { TableBodyDataType } from "../../interface";
import { isFunction } from "../../shared/validateType";
import logger from "../../shared/logger";

export default defineComponent({
  name: "TableBody",
  components: { TableCell, RenderSlot },
  props: {
    dataSource: {
      type: Array as PropType<TableBodyDataType[]>,
      default: () => [],
    },
    rowKey: {
      type: [String, Function] as PropType<string | ((record: any) => any)>,
      required: true,
    },
  },
  setup(props) {
    const { rowKey } = toRefs(props);
    const handleGetRowKey = (record: any) => {
      if (isFunction(rowKey.value)) return rowKey.value(record);
      else if (rowKey.value) return record[rowKey.value];
      else logger.error("[rowKey] 为必须的属性");
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
