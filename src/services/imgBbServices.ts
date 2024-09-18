import imgbbUploader from 'imgbb-uploader'

export const uploadImage = async (imagePath: string) => {
  const apiKey = process.env.IMGBB_API_KEY || ''
  try {
    const response = await imgbbUploader({
      apiKey,
      imagePath,
    })
    return response.url
  } catch (error) {
    throw new Error('Failed to upload image: ' + (error as Error).message)
  }
}
