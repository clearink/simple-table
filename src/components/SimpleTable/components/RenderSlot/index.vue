<template>
  <template v-if="slot">
    <component :is="slot" v-bind="attrs" />
  </template>
  <slot v-else />
</template>
<script lang="ts">
/**
 * @description 渲染自定义插槽
 */
import { computed, defineComponent, PropType, Slot, toRef } from "vue";

export default defineComponent({
  name: "RenderSlot",
  props: {
    slots: {
      type: Object as PropType<Record<"title" | "default", Slot> | undefined>,
    },
    type: {
      type: String as PropType<"title" | "default">,
      default: "default",
    },
    attrs: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const slots = toRef(props, "slots");
    const slot = computed(() => {
      return slots.value?.[props.type];
    });
    return { slot };
  },
});
</script>
