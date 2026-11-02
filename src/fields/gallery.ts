import type { Field } from 'payload'

/** Photos: an ordered list of media. The first photo is the main (cover) photo. */
export const galleryField: Field = {
  name: 'photos',
  label: 'Nuotraukos',
  type: 'upload',
  relationTo: 'media',
  hasMany: true,
  admin: {
    description: 'Tempkite nuotraukas, kad pakeistumėte tvarką. ★ — pagrindinė nuotrauka (rodoma kortelėje). Galite įkelti daug nuotraukų iš karto.',
    components: { Field: '@/components/admin/GalleryField#GalleryField' },
  },
}
