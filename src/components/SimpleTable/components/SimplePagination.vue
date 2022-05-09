<template>
  <ul class="s-pagination">
    <li
      :class="[
        's-pagination__item s-pagination__prev',
        current === 1 && 'is-disabled',
      ]"
      @click="handlePrevClick"
    >
      prev
    </li>
    <!-- 循环这里 -->
    <li
      :class="['s-pagination__item', current === num && 'is-active']"
      v-for="num in range"
      :key="num"
      @click="handleClickChange(num)"
    >
      {{ num }}
    </li>
    <li
      :class="[
        's-pagination__item s-pagination__next',
        current === range && 'is-disabled',
      ]"
      @click="handleNextClick"
    >
      next
    </li>
    <div v-if="showQuickJumper" class="s-pagination__jumper">
      <span>跳至</span>
      <input
      class="s-pagination__jumper-input"
        v-model="value"
        @blur="handleInputChange"
        @keyup.enter="handleInputChange"
      />
      <span>页</span>
    </div>
  </ul>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";

export default defineComponent({
  name: "SimplePagination",
  emits: ["change"],
  props: {
    current: {
      type: Number as PropType<number>,
      default: 1,
    },
    pageSize: {
      type: Number as PropType<number>,
      default: 10,
    },
    total: {
      type: Number as PropType<number>,
      default: 10,
    },
    showQuickJumper: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props, { emit }) {
    const { current, pageSize, total } = toRefs(props);
    const value = ref<number>();
    const range = computed(() => {
      return Math.max(Math.floor(total.value / pageSize.value), 1);
    });

    const handleInputChange = () => {
      const inputNumber = Number(value.value);
      let nextCurrent = isNaN(inputNumber) ? current.value : inputNumber;

      nextCurrent = Math.max(Math.min(range.value, nextCurrent), 1);
      emit("change", nextCurrent, pageSize.value);
      value.value = undefined; // 清空输入框
    };

    const handleClickChange = (page: number) => {
      if (page !== current.value) emit("change", page, pageSize.value);
    };
    const handlePrevClick = () => {
      if (current.value === 1) return;
      emit("change", current.value - 1, pageSize.value);
    };
    const handleNextClick = () => {
      if (current.value === range.value) return;
      emit("change", current.value + 1, pageSize.value);
    };
    return {
      value,
      range,
      handleInputChange,
      handleClickChange,
      handlePrevClick,
      handleNextClick,
    };
  },
});
</script>
<style lang="scss" scoped>
.s-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0;
  padding: 16px 8px;
  list-style: none;

  .s-pagination__item {
    cursor: pointer;
    user-select: none;
    color: rgba($color: #000000, $alpha: 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    width: 32px;
    height: 32px;
    border: 1px solid #d9d9d9;
    margin-right: 8px;
    border-radius: 2px;
    &.is-active,
    &:hover {
      color: #096dd9;
      border-color: #096dd9;
    }
  }
  .s-pagination__prev,
  .s-pagination__next {
    &.is-disabled {
      cursor: not-allowed;
      color: #d9d9d9;
      border-color: #d9d9d9;
    }
  }
  .s-pagination__jumper{
    .s-pagination__jumper-input{
      margin: 0 8px;
      width: 48px;
      line-height: 32px;
    }
  }
}
</style>
