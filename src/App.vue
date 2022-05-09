<template>
  <s-table :data-source="dataSource" @change="handleTableChange">
    <s-column-group title="Name">
      <s-column title="First Name" data-index="firstName" />
      <s-column title="Last Name" data-index="lastName" />
    </s-column-group>
    <s-column-group title="Info">
      <s-column title="Age" data-index="age" :onSort="handleSortByAge" />
      <s-column title="Score" data-index="score" :onSort="handleSortByScore" />
    </s-column-group>
  </s-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import STable from "./components/SimpleTable/index.vue";
import SColumn from "./components/SimpleTable/components/TableColumn";
import SColumnGroup from "./components/SimpleTable/components/TableColumnGroup";

export default defineComponent({
  name: "App",
  components: {
    STable,
    SColumn,
    SColumnGroup,
  },
  setup() {
    const dataSource = ref<object[]>(
      Array.from({ length: 50 }, (_, i) => ({
        key: i,
        firstName: `John--${i}`,
        lastName: "Brown",
        age: ~~(Math.random() * 80) + 20,
        score: ~~(Math.random() * 110) + 40,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
      }))
    );
    const handleTableChange = () => {
      console.log("change");
    };
    const handleSortByAge = (a: any, b: any) => {
      return a.age - b.age;
    };
    const handleSortByScore = (a: any, b: any) => {
      return a.score - b.score;
    };
    return {
      dataSource,
      handleTableChange,
      handleSortByAge,
      handleSortByScore,
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
