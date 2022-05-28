<template>
  <component :is="renderType" class="s-table-cell">
    <slot />
  </component>
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";

export default defineComponent({
  name: "TableCell",
  props: {
    // 是否渲染出表格标题
    renderTitle: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { renderTitle } = toRefs(props);
    const renderType = computed(() => {
      return renderTitle.value ? "th" : "td";
    });
    return {
      renderType,
    };
  },
});
</script>
<style lang="scss" scoped>
.s-table-cell {
  border: 1px solid #f0f0f0;
  padding: 8px;
}
</style>
