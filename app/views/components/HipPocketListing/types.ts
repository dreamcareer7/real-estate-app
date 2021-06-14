export interface HipPocketListing {
  images: string[]
  address: string
  price: number
  sqft: number
  bedrooms: number
  full_baths: number
  half_baths: number
  url?: string
  description?: string
}

export interface HipPocketListingFields extends HipPocketListing {
  url_type: HipPocketListingUrlType
}

export interface HipPocketListingFormProps {
  saveButtonText?: string
  onImageUpload?: (files: File[]) => Promise<string[]>
  onSave: (data: HipPocketListing) => void
}

export interface HipPocketListingDrawerProps extends HipPocketListingFormProps {
  title?: string
  isOpen: boolean
  onClose: () => void
}

export interface ImageUploadProps {
  onImageUpload: (files: File[]) => Promise<void>
  onImageSelect: (imageUrl: string) => void
}

export type ImageGalleryProps = Pick<HipPocketListing, 'images'>

export type HipPocketListingUrlType = 'url' | 'email' | 'tel'
