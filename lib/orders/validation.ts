import { z } from 'zod'
import { calculateShopPrice, normaliseQuantity, resolveShopSelection } from '../shopPricing'
import { getConfigurableItem, getSizeDimensionLabel, getSizeShapeLabel } from '../shopCatalogue'
import { getProductProfile, resolveProductLine } from '../shopProductProfiles'
import type { ShopItem } from '../types'

export const customerSchema = z.object({
  fullName: z.string().trim().min(1).max(160), email: z.email().max(254),
  phone: z.string().trim().min(8).max(30), company: z.string().trim().max(160).default(''),
  addressLine1: z.string().trim().min(5).max(300), addressLine2: z.string().trim().max(160).default(''),
  postalCode: z.string().regex(/^\d{6}$/, 'Enter a six-digit Singapore postal code.'),
  deliveryNotes: z.string().trim().max(2000).default(''),
})
export const selectionSchema = z.object({
  sizeId: z.string().max(100).optional(), thicknessId: z.string().max(100).optional(),
  colourId: z.string().max(100).optional(), installationId: z.string().max(100).optional(),
  packageId: z.string().max(100).optional(), quantity: z.number().int().min(1).max(500), customPrint: z.boolean(),
})
export const checkoutSchema = z.object({
  requestId: z.uuid(), customer: customerSchema,
  items: z.array(z.object({slug: z.string().min(1).max(200), quantity: z.number().int().min(1).max(500), selection: selectionSchema,
    unitPrice: z.number().nonnegative(), options: z.array(z.object({label: z.string(), value: z.string().optional()})).optional(),
  })).min(1).max(50),
})
export type Customer = z.infer<typeof customerSchema>
export type OrderItem = {slug: string; title: string; quantity: number; unitCents: number; lineCents: number; options: {label: string; value: string}[]}
export function priceOrderItem(source: ShopItem, input: z.infer<typeof checkoutSchema>['items'][number]): OrderItem {
  const item = getConfigurableItem(source)
  const profile = getProductProfile(item)
  if (profile.quoteOnly || profile.artworkReview || (resolveProductLine(item) === 'bass-trap' && input.selection.thicknessId === '300mm')) throw new Error('This configuration needs a quote. Please contact our team.')
  if (input.selection.customPrint || input.selection.packageId || (input.selection.installationId && input.selection.installationId !== 'self-install')) throw new Error('Installation and custom work require a separate enquiry.')
  if (normaliseQuantity(item, input.quantity) !== input.quantity) throw new Error('Please check the product quantity limits.')
  for (const [key, options] of [['sizeId', item.sizeOptions], ['thicknessId', item.thicknessOptions], ['colourId', item.colourOptions]] as const) {
    const available = (options || []).filter(o => o.available !== false)
    if (available.length ? !available.some(o => o.id === input.selection[key]) : Boolean(input.selection[key])) throw new Error('A selected option is no longer available. Please add the product again.')
  }
  const selection = {...input.selection, quantity: input.quantity, installationId: 'self-install'}
  const price = calculateShopPrice(item, selection)
  const unitCents = Math.round(price.total * 100 / input.quantity)
  if (unitCents <= 0 || unitCents !== Math.round(input.unitPrice * 100)) throw new Error('The product price has changed. Please remove it from your cart and add it again.')
  const resolved = resolveShopSelection(item, selection)
  const options = [
    {label: 'Shape', value: resolved.sizeOption ? getSizeShapeLabel(resolved.sizeOption) : ''},
    {label: 'Size', value: resolved.sizeOption ? getSizeDimensionLabel(resolved.sizeOption) : ''},
    {label: 'Thickness', value: resolved.thicknessOption?.label || ''},
    {label: 'Colour / fabric', value: resolved.colourOption?.name || ''},
  ].filter(o => o.value)
  return {slug: input.slug, title: item.title, quantity: input.quantity, unitCents, lineCents: unitCents * input.quantity, options}
}
