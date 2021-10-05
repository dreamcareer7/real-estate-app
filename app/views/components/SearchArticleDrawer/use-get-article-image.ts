import useAsync from '@app/hooks/use-async'

import { NO_IMAGE_URL } from './constants'
import { hasImageUrl } from './helpers'
import { getUrlMetadata } from './models'
import { RSSArticleMetadata } from './types'
import { useSearchArticleImageCache } from './use-search-article-image-cache'

interface UseGetArticleImage {
  image: Optional<string>
  getImage: () => void
  handleBrokenImage: () => void
}

export function useGetArticleImage(
  article: RSSArticleMetadata
): UseGetArticleImage {
  const { setItem, getItem } = useSearchArticleImageCache()
  const { run, reset } = useAsync<Nullable<string>>()

  const imageUrl = article.image ?? getItem(article.url)

  const handleBrokenImage = () => setItem(article.url, NO_IMAGE_URL)

  const getImage = () => {
    if (hasImageUrl(imageUrl)) {
      return
    }

    reset()

    run(async () => {
      try {
        const metadata = await getUrlMetadata(article.url)
        const image = metadata?.image ?? NO_IMAGE_URL

        setItem(article.url, image)

        return image
      } catch (_) {
        handleBrokenImage()

        return NO_IMAGE_URL
      }
    })
  }

  return { image: imageUrl, getImage, handleBrokenImage }
}
