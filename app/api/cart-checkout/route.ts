import { NextRequest, NextResponse, after } from 'next/server'
import { getShopItemBySlug } from '@/sanity/lib/queries'
import { checkoutSchema, priceOrderItem, type OrderItem } from '@/lib/orders/validation'
import { findRequest, publicOrder, queueEmails, requestHash, saveOrder } from '@/lib/orders/store'
import { flushEmails } from '@/lib/orders/emails'
import type { ShopItem } from '@/lib/types'

const NO_STORE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: NO_STORE })
}

// Saves the order (idempotent per requestId), queues the emails and returns the private order link.
export async function POST(req: NextRequest) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return fail('Please check your details and try again.', 400)
  const { requestId, customer } = parsed.data

  let order = await findRequest(requestId).catch(() => undefined)
  if (!order) {
    let items: OrderItem[]
    try {
      items = await Promise.all(
        parsed.data.items.map(async (input) => {
          const source = (await getShopItemBySlug(input.slug)) as ShopItem | null
          if (!source) throw new Error('A product in your cart is no longer available. Please remove it and try again.')
          return priceOrderItem(source, input)
        }),
      )
    } catch (error) {
      return fail(error instanceof Error ? error.message : 'Please check your cart and try again.', 400)
    }
    try {
      order = await saveOrder(requestId, requestHash({ customer, items }), customer, items)
    } catch (error) {
      const changed = error instanceof Error && error.message.startsWith('This checkout has changed')
      if (!changed) console.error('Order could not be saved. Check DATABASE_URL and the ja_orders table.')
      return changed ? fail(error.message, 409) : fail("We couldn't save your order just now. Please try again in a moment. Do not pay until your order is saved.", 503)
    }
  }

  const saved = order
  after(async () => {
    try {
      await queueEmails(saved)
      await flushEmails(saved.id)
    } catch {
      console.error('Order emails could not be sent yet; the reconcile job will retry.')
    }
  })

  return NextResponse.json(
    { ...publicOrder(saved), paymentReference: saved.reference, orderUrl: `/orders/access/${saved.token}` },
    { headers: NO_STORE },
  )
}
