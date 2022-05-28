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
import { computed, defineComponent, PropType } from "vue";
import { ColumnType, SortOrderType } from "../../interface";
import { defaultSortOrder, getNextItem } from "../../shared/utils";
import { isFunction } from "../../shared/validateType";

export default defineComponent({
  name: "TableSorter",
  emits: ["change"],
  props: {
    value: {
      type: [String, undefined] as PropType<SortOrderType>,
    },
    sortable: {
      type: [Object, Function] as PropType<ColumnType["sortable"]>,
    },
  },
  setup(props, { emit }) {
    // 获取排序规则
    const sortOrder = computed(() => {
      const sortable = props.sortable;
      if (isFunction(sortable)) return defaultSortOrder;
      return sortable?.sortOrder ?? defaultSortOrder;
    });

    const handleClick = () => {
      emit("change", getNextItem(sortOrder.value, props.value));
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
