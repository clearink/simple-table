import { computed, provide, Ref, shallowRef } from "vue";
import {
  HeaderGroupType,
  NormalizedSortable,
  SortOrderType,
} from "../../interface";
import logger from "../../shared/logger";

import {
  collectSortState,
  getNextCycleItem,
  normalizeSortRuleList,
} from "../../shared/utils";
import { isFunction, isNumber, isUndefined } from "../../shared/validateType";

// 排序
export default function useTableSort(
  $dataSource: Ref<any[]>,
  $columns: Ref<HeaderGroupType[]>
) {
  const states = shallowRef(
    normalizeSortRuleList(collectSortState($columns.value))
  );

  // 是否为多列排序
  const multipleSort = computed(() => {
    const orderSet = states.value.reduce((set, { sortable }) => {
      const order = (sortable as NormalizedSortable)?.order;
      !isUndefined(order) && set.add(order);
      return set;
    }, new Set<number>());
    return orderSet.size > 1;
  });

  const dataSource = computed(() => {
    return states.value.reduce((result, rules) => {
      const { sortable, sortOrder, sortState } = rules;
      const compare = (sortable as NormalizedSortable)?.compare;
      return result.sort((a, b) => {
        if (isFunction(compare)) {
          const result = compare(a, b);
          if (!isNumber(result, false)) {
            logger.warn("[sortable.compare] 返回值必须是number");
          }
          return result * getNextCycleItem(sortOrder!, sortState);
        } else {
          logger.error("[sortable.compare] 必须是函数");
          return 0;
        }
      });
    }, $dataSource.value.slice());
  });

  // 改变排序状态
  type Key = string | number;
  const triggerSorter = (columnKey: Key, sortState: SortOrderType) => {
    states.value = states.value.map((item) => {
      if (item.columnKey === columnKey) return { ...item, sortState };
      if (multipleSort.value) return item;
      return { ...item, sortState: undefined };
    });
  };

  // 获取排序状态
  const findSortState = (columnKey: Key) => {
    const rules = states.value.find((rules) => {
      return rules.columnKey === columnKey;
    });
    return rules?.sortState;
  };
  provide("triggerSorter", triggerSorter);
  provide("findSortState", findSortState);

  return dataSource;
}
