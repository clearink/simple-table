import { shallowMount } from "@vue/test-utils";
import SimpleTable, {
  SimpleTableColumn,
  SimpleTableColumnGroup,
} from "@/components/SimpleTable/index.vue";

const createDataSource = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    key: i,
    age: i,
    name: `name-${i}`,
    value: `value-${i}`,
  }));
};

describe("验证Table主题样式", () => {
  it("Table边框有无", () => {
    const borderedWrapper = shallowMount(SimpleTable, {
      props: { bordered: true },
    });
    expect(borderedWrapper.classes()).toContain("s-table--bordered");

    const wrapper = shallowMount(SimpleTable, {
      props: { bordered: false },
    });
    expect(wrapper.classes()).not.toContain("s-table--bordered");
  });

  it("是否有标题", () => {
    const wrapper = shallowMount(SimpleTable, {
      slots: {
        header: `<div class='test-header-slot'>header</div>`,
      },
    });
    expect(wrapper.findAll(".test-header-slot").length).toBeGreaterThan(0);
  });

  it("是否有底部", () => {
    const wrapper = shallowMount(SimpleTable, {
      slots: {
        footer: `<div class='test-header-slot'>header</div>`,
      },
    });
    expect(wrapper.findAll(".test-header-slot").length).toBeGreaterThan(0);
  });
  it("是否有总结栏", () => {
    const wrapper = shallowMount(SimpleTable, {
      slots: {
        summary: `<div class='test-header-slot'>header</div>`,
      },
    });
    expect(wrapper.findAll(".test-header-slot").length).toBeGreaterThan(0);
  });
});

describe("验证固定列", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: [
        {
          title: "12312",
          name: "name",
        },
      ],
    },
    slots: {
      default: [
        shallowMount(SimpleTableColumn, {
          props: {
            title: "column1",
            dataIndex: "title",
            fixed: "left",
          },
        }),
      ],
    },
  });
  expect(wrapper.findAll(".s-table__column-fixed").length).toBeGreaterThan(0);
});

describe("验证分页", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
      pagination: false,
    },
  });
  expect(wrapper.findAll(".s-pagination").length).toEqual(0);

  const wrapper2 = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
    },
  });
  expect(wrapper2.findAll(".s-pagination item").length).toEqual(12);

  const wrapper3 = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(20),
    },
  });
  expect(wrapper3.findAll(".s-pagination item").length).toEqual(4);
});

describe("验证展开", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
    },
    slots: {
      default: shallowMount(SimpleTableColumn, {
        slots: {
          default: `<template #expandable="{ record}">
          <span class="test-expandable-column">{{record.value}}</span>
          </template>`,
        },
      }),
    },
  });
  wrapper.find(".s-table .expand-trigger").trigger("click");
  wrapper.vm.$nextTick(() => {
    expect(wrapper.findAll(".test-expandable-column").length).toBeGreaterThan(
      0
    );
  });
});

describe("验证多选", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
      rowSelection: true,
    },
    slots: {
      default: shallowMount(SimpleTableColumn, {
        props: {
          dataIndex: "name",
          title: "name",
        },
      }),
    },
  });
  wrapper.find(".s-table .selection-trigger").trigger("click");
  wrapper.vm.$nextTick(() => {
    expect(
      wrapper.findAll(".s-table .selection-selected").length
    ).toBeGreaterThan(0);
  });
});

describe("验证设置类名", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
      rowClassName: (row: number, col: number) => {
        return row % 2 ? "red" : "yellow";
      },
    },
    slots: {
      default: shallowMount(SimpleTableColumn, {
        props: {
          dataIndex: "name",
          title: "name",
        },
      }),
    },
  });
  wrapper.vm.$nextTick(() => {
    expect(wrapper.findAll(".s-table .red").length).toEqual(5);
    expect(wrapper.findAll(".s-table .yellow").length).toEqual(5);
  });
});

describe("验证设置rowKey", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
      rowKey: "key",
    },
    slots: {
      default: shallowMount(SimpleTableColumn, {
        props: {
          dataIndex: "name",
          title: "name",
        },
      }),
    },
  });
  wrapper.vm.$nextTick(() => {
    // ...
  });
});

describe("验证排序", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
    },
    slots: {
      default: shallowMount(SimpleTableColumn, {
        props: {
          dataIndex: "name",
          title: "name",
          onSort: (a: any, b: any) => a.age - b.age,
        },
      }),
    },
  });
  wrapper.find('.s-table .s-column["title"="name"] .sorter').trigger("click");
  wrapper.vm.$nextTick(() => {
    // ... 验证数据顺序
  });
});

describe("验证筛选", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      dataSource: createDataSource(100),
    },
    slots: {
      default: shallowMount(SimpleTableColumn, {
        props: {
          dataIndex: "name",
          title: "name",
          onSort: (a: any, b: any) => a.age - b.age,
        },
      }),
    },
  });
  wrapper.find('.s-table .s-column["title"="name"] .filter').trigger("click");
  wrapper.vm.$nextTick(() => {
    // ... 验证筛选
  });
});

describe("验证设置单元格属性", () => {
  it("数据单元格", () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        dataSource: createDataSource(100),
      },
      slots: {
        default: shallowMount(SimpleTableColumn, {
          props: {
            dataIndex: "name",
            title: "name",
            onCell: () => ({ "data-some": "some" }),
          },
        }),
      },
    });
    expect(
      wrapper.find('.s-table .s-column["data-some"="some"]').isVisible
    ).toBeTruthy();
  });
  it("头部单元格", () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        dataSource: createDataSource(100),
      },
      slots: {
        default: shallowMount(SimpleTableColumn, {
          props: {
            dataIndex: "name",
            title: "name",
            onHeaderCell: () => ({ "data-some": "some" }),
          },
        }),
      },
    });
    expect(
      wrapper.find('.s-table .s-column["data-some"="some"]').isVisible
    ).toBeTruthy();
  });
});

describe("验证对齐方式", () => {
  it("左对齐", () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        dataSource: createDataSource(100),
      },
      slots: {
        default: shallowMount(SimpleTableColumn, {
          props: {
            dataIndex: "name",
            title: "name",
            align: "left",
          },
        }),
      },
    });
    expect(
      wrapper.find('.s-table .s-column').element.getAttribute('style')
    ).toContain('text-align: left')
  });
  it("右对齐", () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        dataSource: createDataSource(100),
      },
      slots: {
        default: shallowMount(SimpleTableColumn, {
          props: {
            dataIndex: "name",
            title: "name",
            align: 'right'
          },
        }),
      },
    });
    expect(
      wrapper.find('.s-table .s-column').element.getAttribute('style')
    ).toContain('text-align: right')
  });
});
