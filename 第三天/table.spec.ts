import { mount } from "@vue/test-utils";
import SimpleTable from "@/components/SimpleTable/index.vue";
import SimpleTableColumn from "@/components/SimpleTable/components/TableColumn";
import { h } from "vue";
// import SimpleTable, {
//   SimpleTableColumn,1
//   SimpleTableColumnGroup,
// } from "@/components/SimpleTable/index.vue";

const createDataSource = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    key: i,
    name: `name-${i}`,
    age: (Math.random() * 100) | 0,
    value: (Math.random() * 100) | 0,
  }));
};

const tableMount = (dataSource: any[], props?: any, slots?: any) => {
  return mount(SimpleTable, {
    props: {
      rowKey: "key",
      dataSource,
      ...props,
    },
    slots,
  });
};

describe("验证Table基本渲染", () => {
  it("是否有Title", () => {
    const wrapper = tableMount(createDataSource(10), undefined, {
      title: `<div class='test-header-slot'>header</div>`,
    });
    expect(wrapper.findAll(".test-header-slot").length).toBeGreaterThan(0);
  });
  it("是否有Footer", () => {
    const wrapper = tableMount(createDataSource(10), undefined, {
      footer: `<div class='test-header-slot'>header</div>`,
    });
    expect(wrapper.findAll(".test-header-slot").length).toBeGreaterThan(0);
  });
  it("基础渲染 6条数据", () => {
    const wrapper = tableMount(createDataSource(6), undefined, {
      default: h(SimpleTableColumn, {
        props: { dataIndex: "name", title: "Name" },
      }),
    });
    expect(wrapper.findAll(".s-table-body tr").length).toEqual(6);
  });

  it("基础渲染 12条数据", () => {
    const wrapper = tableMount(createDataSource(12), undefined, {
      default: h(SimpleTableColumn, {
        props: { dataIndex: "name", title: "Name" },
      }),
    });
    expect(wrapper.findAll(".s-table-body tr").length).toEqual(10);
  });
});

describe("验证分页", () => {
  it("无分页", () => {
    const wrapper = tableMount(createDataSource(10), {
      pagination: false,
    });
    expect(wrapper.find(".s-pagination").exists()).toBeFalsy();
  });
  it("有3页", () => {
    const wrapper = tableMount(createDataSource(30));
    expect(wrapper.findAll(".s-pagination__item ").length).toEqual(5);
  });
  it("分页切换-点击按钮", async () => {
    const tableData = createDataSource(30);
    const wrapper = tableMount(tableData);
    await wrapper.find(".s-pagination__next").trigger("click");
    let currentDataSource = wrapper.vm.cells.map((item: any) => item.record);
    expect(currentDataSource).toEqual(tableData.slice(10, 20));
    await wrapper.find(".s-pagination__next").trigger("click");
    currentDataSource = wrapper.vm.cells.map((item: any) => item.record);
    expect(currentDataSource).toEqual(tableData.slice(20, 30));
    expect(wrapper.find(".s-pagination__next").classes()).toContain(
      "is-disabled"
    );
  });
});
describe("分页切换-手动输入", () => {
  const tableData = createDataSource(30);
  const wrapper = tableMount(tableData);
  const $input = wrapper.find(".s-pagination__jumper-input");
  it("触发条件:blur", async () => {
    await $input.setValue(2);
    await $input.trigger("blur");
    const currentDataSource = wrapper.vm.cells.map((item: any) => item.record);
    expect(currentDataSource).toEqual(tableData.slice(10, 20));
  });

  it("触发条件:keyup", async () => {
    await $input.setValue(3);
    await $input.trigger("keyup.enter");
    const currentDataSource = wrapper.vm.cells.map((item: any) => item.record);
    expect(currentDataSource).toEqual(tableData.slice(20, 30));
  });
  // 边界条件
  it("边界条件:最小值", async () => {
    await $input.setValue(-10);
    await $input.trigger("blur");
    const currentDataSource = wrapper.vm.cells.map((item: any) => item.record);
    expect(currentDataSource).toEqual(tableData.slice(0, 10));
  });

  it("边界条件:最大值", async () => {
    await $input.setValue(100);
    await $input.trigger("blur");
    const currentDataSource = wrapper.vm.cells.map((item: any) => item.record);
    expect(currentDataSource).toEqual(tableData.slice(20, 30));
  });
});

describe("验证排序", () => {
  it("升序", async () => {
    const wrapper = tableMount(createDataSource(10), undefined, {
      default: h(SimpleTableColumn, {
        "data-index": "age",
        title: "Name",
        sortable: (a: any, b: any) => a.age - b.age,
      }),
    });
    const beforeArray = wrapper
      .findAll(".s-table-body td")
      .map((ele) => +ele.text());

    await wrapper.find(".s-sorter").trigger("click");
    const afterArray = wrapper
      .findAll(".s-table-body td")
      .map((ele) => +ele.text());
    expect(beforeArray.sort((a, b) => a - b)).toEqual(afterArray);
  });

  it("降序", async () => {
    const wrapper = tableMount(createDataSource(10), undefined, {
      default: h(SimpleTableColumn, {
        "data-index": "age",
        title: "Name",
        sortable: (a: any, b: any) => a.age - b.age,
      }),
    });
    const beforeArray = wrapper
      .findAll(".s-table-body td")
      .map((ele) => +ele.text());

    await wrapper.find(".s-sorter").trigger("click");
    await wrapper.find(".s-sorter").trigger("click");
    const afterArray = wrapper
      .findAll(".s-table-body td")
      .map((ele) => +ele.text());
    expect(beforeArray.sort((a, b) => b - a)).toEqual(afterArray);
  });

  it("多列排序", async () => {
    const tableData = createDataSource(20);
    const wrapper = tableMount(
      tableData,
      {
        pagination: false,
      },
      {
        default: [
          h(SimpleTableColumn, {
            "data-index": "age",
            title: "Age",
            sortable: {
              compare: (a: any, b: any) => a.age - b.age,
              order: 1,
            },
          }),
          h(SimpleTableColumn, {
            "data-index": "value",
            title: "Value",
            sortable: {
              compare: (a: any, b: any) => a.value - b.value,
              order: 2,
            },
          }),
        ],
      }
    );
    const getList = () =>
      wrapper
        .find("tbody")
        .findAll("td")
        .reduce(
          (result, element, index) => {
            result[index % 2].push(+element.text());
            return result;
          },
          [[], []] as [number[], number[]]
        );
    const [beforeAgeArray, beforeValueArray] = getList();
    const sortTriggers = wrapper.findAll(".s-sorter");
    await sortTriggers[0].trigger("click"); // 排序 age
    const [afterAgeArray, afterValueArray] = getList();
    // age 是否排序
    expect(beforeAgeArray.sort((a, b) => a - b)).toEqual(afterAgeArray);
    //
    await sortTriggers[1].trigger("click");
    // age sort + value sort
    const sortedDataSource = [
      {
        compare: (a: any, b: any) => a.age - b.age,
        ratio: 1,
      },
      {
        compare: (a: any, b: any) => a.value - b.value,
        ratio: 1,
      },
    ].reduce((result, { ratio, compare }) => {
      return result.sort((a, b) => ratio * compare(a, b));
    }, tableData.slice());
    const [ages, values] = getList();
    const [originAges, originValues] = sortedDataSource.reduce(
      (result, item) => {
        result[0].push(item.age);
        result[1].push(item.value);
        return result;
      },
      [[], []] as [number[], number[]]
    );
    expect(ages).toEqual(originAges);
    expect(values).toEqual(originValues);
  });
});
