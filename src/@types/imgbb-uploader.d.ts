declare module 'imgbb-uploader' {
  interface UploadOptions {
    apiKey: string | undefined
    imagePath: string
    name?: string
    expiration?: number
  }

  interface UploadResponse {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    size: number
    time: string
    expiration: string
  }

  function imgbbUploader(options: UploadOptions): Promise<UploadResponse>

  export = imgbbUploader
}
