import { defineComponent, PropType } from "vue";
import { ColumnType } from "../../interface";

const Component = defineComponent({
  name: "TableColumnGroup",
  props: {
    title: {
      type: String as PropType<ColumnType["title"]>,
    },
    sortable: {
      type: Object as PropType<ColumnType["sortable"]>,
    },
  },
  setup() {
    return () => null;
  },
});

Component.displayName = Symbol.for("TableColumnGroup");
export default Component;
