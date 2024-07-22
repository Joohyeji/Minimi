import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const uploadWallpaperToFirebase = async (file) => {
  const storage = getStorage()
  const storageRef = ref(storage, `wallpapers/${file.name}`)

  await uploadBytes(storageRef, file)

  const downloadURL = await getDownloadURL(storageRef)
  return downloadURL
}

export { uploadWallpaperToFirebase }
