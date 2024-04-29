export const createFileReader = (file: File): Promise<ProgressEvent<FileReader>> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onload = (fileEvent: ProgressEvent<FileReader>) => {
      resolve(fileEvent)
    }

    fileReader.onerror = reject

    fileReader.readAsArrayBuffer(file)
  })
}
