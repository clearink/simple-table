import { onBeforeUpdate, ref, Slot } from "vue";
// 检查相应的 slot 是否存在
export default function useSlotExist(slot?: Slot) {
  const footerVisible = ref(false);
  onBeforeUpdate(() => {
    // 更新相关属性
    footerVisible.value = !!slot;
  });
  return footerVisible;
}
