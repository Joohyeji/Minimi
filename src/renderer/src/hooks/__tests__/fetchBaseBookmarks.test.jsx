import { describe, it, expect, vi } from 'vitest'
import { getDoc, setDoc, doc } from 'firebase/firestore'
import fetchBaseBookmarks from '../fetchBaseBookmarks'
import { USER_COLLECTION } from '../../firebase'

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    doc: vi.fn(),
    collection: vi.fn()
  }
})

vi.stubGlobal('window', {
  api: {
    getBookmarks: vi.fn()
  }
})

describe.only('fetchBaseBookmarks', () => {
  it('정상적인 .lnk 파일에서 올바른 대상 경로를 반환해야 합니다.', async () => {
    const mockUserDoc = {
      exists: vi.fn().mockReturnValue(true),
      data: vi.fn().mockReturnValue({
        bookmarks: {
          chrome: ['bookmark1', 'bookmark2']
        }
      })
    }

    vi.mocked(getDoc).mockResolvedValue(mockUserDoc)
    vi.mocked(setDoc).mockResolvedValue()

    window.api.getBookmarks.mockResolvedValue([])

    const bookmarks = await fetchBaseBookmarks('userId123', 'chrome')

    expect(bookmarks).toEqual(['bookmark1', 'bookmark2'])
    expect(getDoc).toHaveBeenCalledWith(doc(USER_COLLECTION, 'userId123'))
    expect(setDoc).not.toHaveBeenCalled()
  })

  it('Firestore에 데이터가 없거나 북마크 데이터가 없을 때, api를 통해 북마크를 가져오고 Firestore에 저장해야 합니다.', async () => {
    const mockUserDoc = {
      exists: vi.fn().mockReturnValue(true),
      data: vi.fn().mockReturnValue({
        bookmarks: {}
      })
    }

    vi.mocked(getDoc).mockResolvedValue(mockUserDoc)
    vi.mocked(setDoc).mockResolvedValue()

    const mockBookmarks = ['bookmark3', 'bookmark4']
    window.api.getBookmarks.mockResolvedValue(mockBookmarks)

    const bookmarks = await fetchBaseBookmarks('joohyeji', 'chrome')

    expect(bookmarks).toEqual(mockBookmarks)
    expect(getDoc).toHaveBeenCalledWith(doc(USER_COLLECTION, 'joohyeji'))
    expect(setDoc).toHaveBeenCalledWith(
      doc(USER_COLLECTION, 'joohyeji'),
      {
        bookmarks: {
          chrome: mockBookmarks
        }
      },
      { merge: true }
    )
  })
})
