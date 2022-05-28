/* eslint-disable @typescript-eslint/no-unused-vars */

function uploadByFtp(file: string): Promise<boolean> {
  return new Promise((resolve) => resolve(true));
}
function uploadBySftp(file: string[], cb: (ret: boolean) => void): void {
  cb(true);
}
function uploadByHttp(file: string): boolean {
  return true;
}

type UploadHandler = (...args: any[]) => Promise<boolean>;
class UploadFile {
  // 存储不同类型的文件上传 handler
  private handleCache = new Map<string, UploadHandler>();

  // 获取文件后缀名
  private getExtension(file: string) {
    return file.match(/\.(\w+)$/)[1];
  }

  // 插件函数
  public use(type: string, handler: UploadHandler) {
    this.handleCache.set(type, handler);
    return this;
  }

  public async upload(files: string | string[]) {
    const fileList = [].concat(files) as string[];

    await Promise.all(
      fileList.map((file) => {
        const ext = this.getExtension(file);
        const handler = this.handleCache.get(ext);
        if (typeof handler === "function") return handler(file);
        console.warn(`暂不支持上传[${ext}]类型的文件`)
        return Promise.resolve(true);
      })
    );

    console.log("upload success.");
    return true;
  }
}

// 预处理上传函数

const uploadBySftpPromise = (file: string) => {
  return new Promise<boolean>((resolve, reject) => {
    uploadBySftp([file], (ret) => {
      ret ? resolve(true) : reject(false);
    });
  });
};
const uploadByHttpPromise = (file: string) => {
  return Promise.resolve(uploadByHttp(file));
};

const upload = new UploadFile();
upload
  .use("txt", uploadByFtp)
  .use("exe", uploadBySftpPromise)
  .use("doc", uploadByHttpPromise);
upload.upload("1.txt");
