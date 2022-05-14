import { defineComponent, PropType } from "vue";
import { TableColumnProps as ColumnProps } from "../interface";
export default defineComponent({
  name: "SimpleTableColumn",
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
