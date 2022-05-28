function isDev(): MethodDecorator {
  return function (_, __, descriptor: TypedPropertyDescriptor<any>) {
    const value = descriptor.value;
    descriptor.value = function (this: any, ...args: any[]) {
      if (process.env.NODE_ENV === "development") {
        return value?.apply(this, args);
      }
    };
    return descriptor;
  };
}

// 日志记录
class Logger {
  @isDev()
  public info(...data: any[]) {
    console.info(...data);
  }
  @isDev()
  public log(...data: any[]) {
    console.log(...data);
  }
  @isDev()
  public warn(...data: any[]) {
    console.warn(...data);
  }
  @isDev()
  public error(...data: any[]) {
    console.error(...data);
  }
}
const logger = new Logger();
export default logger;
