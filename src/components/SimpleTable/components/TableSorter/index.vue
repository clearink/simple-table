<template>
  <span
    :class="[
      's-sorter',
      value === 'ascend' && 'is-ascend',
      value === 'descend' && 'is-descend',
    ]"
    @click="handleClick"
  ></span>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableSorter",
  emits: ["change"],
  props: ["value"],
  setup(props, { emit }) {
    const handleClick = () => {
      const map = new Map([
        [undefined, "ascend"],
        ["ascend", "descend"],
        ["descend", undefined],
      ]);
      emit("change", map.get(props.value));
    };
    return {
      handleClick,
    };
  },
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
  @mixin triangle($color: $default-color) {
    width: 0;
    height: 0;
    $size: 4px;
    border-top: 0 solid $color;
    border-bottom: $size * 1.5 solid $color;
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
  &.is-ascend {
    &::before {
      @include triangle($active-color);
    }
  }
  &.is-descend {
    &::after {
      @include triangle($active-color);
    }
  }
}
</style>
