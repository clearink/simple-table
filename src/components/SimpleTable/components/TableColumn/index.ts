import { defineComponent, PropType } from "vue";
import { ColumnType } from "../../interface";
const Component = defineComponent({
  name: "TableColumn",
  props: {
    title: {
      type: String as PropType<ColumnType["title"]>,
    },
    dataIndex: {
      type: [String, Number] as PropType<ColumnType["data-index"]>,
    },
    sortable: {
      type: Object as PropType<ColumnType["sortable"]>,
    },
  },
  setup() {
    return () => null;
  },
});
Component.displayName = Symbol.for("TableColumn");
export default Component;
