// 如果某个 props 是一个对象，里面的每个值都有一个默认值
// 此时我们设置了某一个默认值，那么就会丢失其他的默认值
// 该 hooks 就是为了解决此问题的

// export default function useProps<T extends any>(
//   props: T,
//   $default: Partial<T>
// ): T {
//   const defaultProps = useRef($default);
//   return useMemo(() => {
//     return {
//       ...$default,
//       ...props,
//     };
//   }, [props]);
// }
