<template>
  <s-table row-key="key" :data-source="dataSource" @change="handleTableChange">
    <s-table-column title="Name" data-index="name" />
    <s-table-column-group title="Score" :sortable="handleSort('chinese')">
      <s-table-column
        title="Chinese"
        data-index="chinese"
        :sortable="handleSort('chinese')"
      >
        <template #default="{ value, record }">
          {{ value }}--{{ record.name }}
        </template>
        <template #title>test title slot</template>
      </s-table-column>
      <s-table-column
        title="Math"
        data-index="math"
        :sortable="{
          compare:handleSort('math'),
          order: 1
        }"
      />
      <s-table-column
        title="English"
        data-index="english"
        :sortable="handleSort('english')"
      />
    </s-table-column-group>
  </s-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import STable from "./components/SimpleTable/index.vue";
import {
  STableColumn,
  STableColumnGroup,
} from "./components/SimpleTable/index.vue";

export default defineComponent({
  name: "App",
  components: {
    STable,
    STableColumn,
    STableColumnGroup,
  },
  setup() {
    const dataSource = ref<object[]>(
      Array.from({ length: 30 }, (_, i) => ({
        key: i,
        name: `Jim Red---${i}`,
        chinese: (Math.random() * 100) | 0,
        math: (Math.random() * 100) | 0,
        english: (Math.random() * 100) | 0,
      }))
    );
    const handleTableChange = (...args: any[]) => {
      console.log("tableChange", ...args);
    };
    const handleSort = (type: string) => {
      return function (a: any, b: any) {
        return a[type] - b[type];
      };
    };
    return {
      dataSource,
      handleTableChange,
      handleSort,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
