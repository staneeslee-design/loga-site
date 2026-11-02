import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

async function revalidateAll() {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // not running inside Next (e.g. seed script) – ignore
  }
}
export const revalidateSite: CollectionAfterChangeHook & CollectionAfterDeleteHook = (async ({ doc }: any) => {
  await revalidateAll()
  return doc
}) as any
export const revalidateSiteGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidateAll()
  return doc
}
