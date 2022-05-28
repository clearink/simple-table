import { shallowMount, mount } from "@vue/test-utils";
import SimpleTable from "@/components/SimpleTable/index.vue";
import SimpleTableColumn from "@/components/SimpleTable/components/TableColumn";
// import SimpleTable, {
//   SimpleTableColumn,
//   SimpleTableColumnGroup,
// } from "@/components/SimpleTable/index.vue";

const createDataSource = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    key: i,
    age: i,
    name: `name-${i}`,
    value: `value-${i}`,
  }));
};

describe("验证Table基本渲染", () => {
  it("是否有Title", () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        rowKey: "key",
      },
      slots: {
        title: `<div class='test-header-slot'>header</div>`,
      },
    });
    expect(wrapper.findAll(".test-header-slot").length).toBeGreaterThan(0);
  });
  it("是否有Footer", () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        rowKey: "key",
      },
      slots: {
        footer: `<div class='test-header-slot'>header</div>`,
      },
    });
    expect(wrapper.findAll(".test-header-slot").length).toBeGreaterThan(0);
  });
  it("基础渲染 6条数据", () => {
    const wrapper = mount(SimpleTable, {
      props: {
        rowKey: "key",
        dataSource: createDataSource(6),
      },
      slots: {
        default: mount(SimpleTableColumn, {
          props: { dataIndex: "name", title: "Name" },
        }),
      },
    });
    expect(wrapper.findAll(".s-table-body tr").length).toEqual(6);
  });

  it("基础渲染 12条数据", () => {
    const wrapper = mount(SimpleTable, {
      props: {
        rowKey: "key",
        dataSource: createDataSource(12),
      },
      slots: {
        default: {
          render(h: any) {
            return h(SimpleTableColumn, {
              props: { dataIndex: "name", title: "Name" },
            });
          },
        },
      },
    });
    expect(wrapper.findAll(".s-table-body tr").length).toEqual(10);
  });
});

// describe("验证分页", () => {
//   const wrapper = shallowMount(SimpleTable, {
//     props: {
//       dataSource: createDataSource(100),
//       pagination: false,
//     },
//   });
//   expect(wrapper.findAll(".s-pagination").length).toEqual(0);

//   const wrapper2 = shallowMount(SimpleTable, {
//     props: {
//       dataSource: createDataSource(100),
//     },
//   });
//   expect(wrapper2.findAll(".s-pagination item").length).toEqual(12);

//   const wrapper3 = shallowMount(SimpleTable, {
//     props: {
//       dataSource: createDataSource(20),
//     },
//   });
//   expect(wrapper3.findAll(".s-pagination item").length).toEqual(4);
// });

// describe("验证rowKey", () => {
//   const wrapper = shallowMount(SimpleTable, {
//     props: {
//       dataSource: createDataSource(100),
//       rowSelection: true,
//     },
//     slots: {
//       default: shallowMount(SimpleTableColumn, {
//         props: {
//           dataIndex: "name",
//           title: "name",
//         },
//       }),
//     },
//   });
//   wrapper.find(".s-table .selection-trigger").trigger("click");
//   wrapper.vm.$nextTick(() => {
//     expect(
//       wrapper.findAll(".s-table .selection-selected").length
//     ).toBeGreaterThan(0);
//   });
// });

// describe("验证排序", () => {
//   const wrapper = shallowMount(SimpleTable, {
//     props: {
//       dataSource: createDataSource(100),
//     },
//     slots: {
//       default: shallowMount(SimpleTableColumn, {
//         props: {
//           dataIndex: "name",
//           title: "name",
//           onSort: (a: any, b: any) => a.age - b.age,
//         },
//       }),
//     },
//   });
//   wrapper.find('.s-table .s-column["title"="name"] .sorter').trigger("click");
//   wrapper.vm.$nextTick(() => {
//     // ... 验证数据顺序
//   });
// });
