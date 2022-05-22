import { onBeforeMount, onBeforeUpdate, ref, Slot } from "vue";
// 检查相应的 slot 是否存在
export default function useSlotExist(slot?: Slot) {
  const footerVisible = ref(false);
  const handleChange = () => {
    footerVisible.value = !!slot;
  };
  onBeforeMount(handleChange);
  onBeforeUpdate(handleChange);
  return footerVisible;
}
