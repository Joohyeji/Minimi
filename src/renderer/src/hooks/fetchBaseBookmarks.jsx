import { getDoc, setDoc, doc } from 'firebase/firestore'
import { USER_COLLECTION } from '../firebase'

async function fetchBaseBookmarks(userId, selectedBrowser) {
  try {
    const userDocRef = doc(USER_COLLECTION, userId)
    const userDoc = await getDoc(userDocRef)

    let bookmarks
    if (userDoc.exists()) {
      const userData = userDoc.data()
      if (userData.bookmarks && userData.bookmarks[selectedBrowser]) {
        bookmarks = userData.bookmarks[selectedBrowser]
      } else {
        bookmarks = await window.api.getBookmarks(selectedBrowser)

        await setDoc(
          userDocRef,
          {
            bookmarks: {
              ...userData.bookmarks,
              [selectedBrowser]: bookmarks
            }
          },
          { merge: true }
        )
      }
    } else {
      bookmarks = await window.api.getBookmarks(selectedBrowser)

      await setDoc(userDocRef, { bookmarks: { [selectedBrowser]: bookmarks } })
    }

    return bookmarks
  } catch (error) {
    throw new Error('북마크를 불러오거나 저장하는 중 오류가 발생했습니다.')
  }
}

export default fetchBaseBookmarks
