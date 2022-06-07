import { defineComponent, PropType } from "vue";
import { tableColumnGroupToken } from "../../shared/token";
import { ColumnType } from "../../interface";

const Component = defineComponent({
  name: "TableColumnGroup",
  props: {
    title: {
      type: String as PropType<ColumnType["title"]>,
    },
    sortable: {
      type: [Object, Function] as PropType<ColumnType["sortable"]>,
    },
  },
  setup() {
    return () => null;
  },
});

Component.displayName = tableColumnGroupToken;
export default Component;
