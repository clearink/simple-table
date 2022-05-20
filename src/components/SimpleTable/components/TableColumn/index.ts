import { defineComponent, PropType } from "vue";
import { TableColumnProps as ColumnProps } from "../interface";
const Component = defineComponent({
  name: "TableColumn",
  props: {
    title: {
      type: String as PropType<ColumnProps<unknown>["title"]>,
    },
    dataIndex: {
      type: [String, Number] as PropType<ColumnProps<unknown>["dataIndex"]>,
    },
    onSort: {
      type: Function as PropType<ColumnProps<unknown>["onSort"]>,
    },
    onFilter: {
      type: Function as PropType<ColumnProps<unknown>["onFilter"]>,
    },
  },
  setup() {
    return () => null;
  },
});
Component.displayName = Symbol.for("TableColumn");
export default Component;
