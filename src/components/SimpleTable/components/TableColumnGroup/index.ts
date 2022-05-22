import { defineComponent, PropType } from "vue";
import { TableColumnGroupProps as GroupProps } from "../interface";

const Component = defineComponent({
  name: "TableColumnGroup",
  props: {
    title: {
      type: String as PropType<GroupProps<unknown>["title"]>,
    },
    onSort: {
      type: Function as PropType<GroupProps<unknown>["onSort"]>,
    },
    onFilter: {
      type: Function as PropType<GroupProps<unknown>["onFilter"]>,
    },
  },
  setup() {
    return () => null;
  },
});

Component.displayName = Symbol.for("TableColumnGroup");
export default Component;
