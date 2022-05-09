import { defineComponent, PropType } from "vue";
import { TableColumnGroupProps as GroupProps } from "./interface";
//  TODO: 提取 props 属性
export default defineComponent({
  name: "SimpleTableColumnGroup",
  props: {
    title: {
      type: String as PropType<GroupProps<unknown>["title"]>,
    },
    // onSort: {
    //   type: Function as PropType<GroupProps<unknown>["onSort"]>,
    // },
    // onFilter: {
    //   type: Function as PropType<GroupProps<unknown>["onFilter"]>,
    // },
  },
  setup() {
    return () => null;
  },
});
