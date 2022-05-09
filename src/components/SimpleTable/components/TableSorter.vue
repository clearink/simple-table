<template>
  <span class="s-sorter"></span>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";

export default defineComponent({
  name: "TableSorter",
  emits: ["change"],
});
</script>
<style lang="scss" scoped>
$default-color: #d9d9d9;
$active-color: #096dd9;
.s-sorter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-width: 16px;
  max-height: 16px;
  min-height: 16px;
  margin-left: 4px;
  cursor: pointer;
  @mixin triangle {
    width: 0;
    height: 0;
    $size: 4px;
    border-top: 0 solid $default-color;
    border-bottom: $size * 1.5 solid $default-color;
    border-right: $size solid transparent;
    border-left: $size solid transparent;
  }

  &::before {
    content: "";
    display: inline-block;
    @include triangle();
  }
  &::after {
    content: "";
    display: inline-block;
    transform: rotate(180deg);
    @include triangle();
  }
}
</style>
