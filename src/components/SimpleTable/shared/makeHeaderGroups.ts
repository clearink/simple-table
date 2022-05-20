import {
  ColumnGroupType,
  ColumnsType,
  ColumnType,
  HeaderGroupType,
  WithKeyProps,
} from "../interface";

// 创建唯一id
function createUid() {
  let id = 0;
  return () => id++;
}

// 向每个 column 添加 parent 数据
function normalizeColumns(columns: ColumnsType, parent?: number) {
  return columns.map((column) => ({ column, parent }));
}

// 更新头部单元格 span 属性
function updateCellSpan(
  groups: HeaderGroupType[][],
  cache: Map<string | number, number>
) {
  // 修正父级子列数量
  const amendCache = (key: number, value: number) => {
    const count = cache.get(key);
    count && cache.set(key, count + value);
  };

  const maxDepth = groups.length; // 最大深度
  return groups.reduceRight((groups, columns, depth, _) => {
    const rowSpan = maxDepth - depth;
    for (const column of columns) {
      const { key, parent, ...rest } = column.headerProps;
      const colSpan = cache.get(key);
      if (colSpan !== undefined) {
        column.headerProps = { key, colSpan, ...rest };
        amendCache(parent, colSpan - 1);
      } else if (rowSpan > 1) {
        column.headerProps = { rowSpan, key, ...rest };
      }
    }
    return [columns, ...groups];
  }, [] as HeaderGroupType[][]);
}

export default function makeHeaderGroups($columns: ColumnsType) {
  const headerGroups: HeaderGroupType[][] = [];
  const parentCache = new Map<string | number, number>();
  const allColumns: ({ column: ColumnType } & WithKeyProps)[] = [];
  const getUid = createUid();

  // dfs 遍历
  (function traverse($columns: ColumnsType, $parent?: number, depth = 0) {
    const columns = normalizeColumns($columns, $parent);
    const groups = columns.reduce((groups, { column, parent }) => {
      const { children = [] } = column as ColumnGroupType;

      const hasChildren = children.length > 0;
      const key = getUid();

      hasChildren && parentCache.set(key, children.length);
      hasChildren && traverse(children, key, depth + 1);

      allColumns.push({ column, key });
      return groups.concat({
        column,
        headerProps: { key, parent },
      });
    }, [] as HeaderGroupType[]);

    headerGroups[depth] = (headerGroups[depth] || []).concat(groups);
  })($columns, undefined);

  return {
    allColumns,
    headerGroups: updateCellSpan(headerGroups, parentCache).map((groups) => {
      return { groups, props: { key: getUid() } };
    }),
    dataColumns: allColumns.reduce((result, column) => {
      const { key } = column;
      const isLeafColumn = !parentCache.has(key);
      return result.concat(isLeafColumn ? column : []);
    }, [] as typeof allColumns),
  };
}
