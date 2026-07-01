import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { getShopItemBySlug } from '@/sanity/lib/queries'
import type { ShopItem } from '@/lib/types'
import {
  calculateShopPrice,
  formatSgd,
  resolveShopSelection,
  type ShopQuoteSelection,
} from '@/lib/shopPricing'

const quoteSchema = z.object({
  slug: z.string().min(1),
  selection: z.object({
    sizeId: z.string().optional(),
    thicknessId: z.string().optional(),
    colourId: z.string().optional(),
    installationId: z.string().optional(),
    packageId: z.string().optional(),
    quantity: z.number().int().min(1),
    customPrint: z.boolean().default(false),
  }),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    roomType: z.string().optional(),
    notes: z.string().optional(),
  }),
})

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function assertOption(item: ShopItem, options: { id?: string; available?: boolean }[] | undefined, selectedId: string | undefined, label: string) {
  if (!selectedId) return
  const valid = (options || []).some((option) => option.id === selectedId && option.available !== false)
  if (!valid) throw new Error(`Invalid ${label} selected`)
}

function validateSelection(item: ShopItem, selection: ShopQuoteSelection) {
  assertOption(item, item.sizeOptions, selection.sizeId, 'size')
  assertOption(item, item.thicknessOptions, selection.thicknessId, 'thickness')
  assertOption(item, item.colourOptions, selection.colourId, 'colour')
  assertOption(item, item.installationOptions, selection.installationId, 'installation')
  assertOption(item, item.packageOptions, selection.packageId, 'package')

  const min = item.minQuantity || 1
  const max = item.maxQuantity
  if (selection.quantity < min || (max && selection.quantity > max)) {
    throw new Error(`Quantity must be between ${min} and ${max || 'the available limit'}`)
  }
  if (selection.customPrint && !item.allowCustomPrint) {
    throw new Error('Custom print is not available for this product')
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = quoteSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid quote request' }, { status: 400 })
    }

    const { slug, selection, customer } = parsed.data
    const item = await getShopItemBySlug(slug).catch(() => null) as ShopItem | null
    if (!item || item.inStock === false) {
      return NextResponse.json({ error: 'Product is not available' }, { status: 404 })
    }

    validateSelection(item, selection)

    const resolved = resolveShopSelection(item, selection)
    const price = calculateShopPrice(item, selection)
    const quoteReference = `JA-${Date.now().toString(36).toUpperCase()}`
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Just Acoustics <onboarding@resend.dev>'
    const teamEmail = 'info@justacoustics.co'
    const resend = new Resend(process.env.RESEND_API_KEY)

    const optionRows = [
      ['Product', item.title],
      ['Quote reference', quoteReference],
      ['Package', resolved.packageOption?.name || 'None'],
      ['Size', resolved.sizeOption?.label || 'Standard / not selected'],
      ['Thickness', resolved.thicknessOption?.label || 'Standard / not selected'],
      ['Colour / finish', resolved.colourOption?.name || 'Standard / not selected'],
      ['Installation', resolved.installationOption?.label || 'Not selected'],
      ['Quantity', price.quantityLabel],
      ['Panel count', price.panelCount],
      ['Custom print', selection.customPrint || item.productLine === 'custom-print-panels' ? item.customPrintLabel || 'Yes' : 'No'],
      ['Estimated total', formatSgd(price.total)],
      ['Review needed', price.requiresReview ? 'Yes' : 'No'],
      ['Lead time', item.leadTime || 'To be confirmed'],
      ['Payment status', 'Quote first. Stripe PayNow/payment link can be sent after confirmation.'],
    ]

    const customerRows = [
      ['Name', customer.name],
      ['Email', customer.email],
      ['Phone', customer.phone || '-'],
      ['Room type', customer.roomType || '-'],
      ['Notes', customer.notes || '-'],
    ]

    const rowsHtml = [...optionRows, ...customerRows]
      .map(([label, value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${escapeHtml(value)}</td></tr>`)
      .join('')

    const lineRowsHtml = price.lines
      .map((line) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;">${escapeHtml(line.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${formatSgd(line.amount)}</td></tr>`)
      .join('')

    const internalResult = await resend.emails.send({
      from: fromEmail,
      to: teamEmail,
      subject: `Shop quote ${quoteReference}: ${item.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 36px 20px;">
          <h2 style="color:#010101;margin:0 0 10px;">New configured shop quote</h2>
          <p style="margin:0 0 20px;color:#4a4a4a;line-height:1.6;">A customer configured a shop item and requested quote confirmation before payment.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rowsHtml}</table>
          <h3 style="color:#010101;margin:28px 0 8px;">Price breakdown</h3>
          <table style="width:100%;border-collapse:collapse;">${lineRowsHtml}</table>
        </div>
      `,
    })

    if (internalResult.error) {
      console.error('Resend shop quote internal email error:', internalResult.error)
      return NextResponse.json({ error: 'Failed to send quote request' }, { status: 502 })
    }

    const customerResult = await resend.emails.send({
      from: fromEmail,
      to: customer.email,
      subject: `We received your Just Acoustics quote request (${quoteReference})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 36px 20px; color:#333;">
          <img src="https://www.justacoustics.co/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg" alt="Just Acoustics" style="width: 180px; margin-bottom: 28px;" />
          <h1 style="font-size:24px;font-weight:600;margin:0 0 14px;color:#010101;">Thanks ${escapeHtml(customer.name)}, we received your configuration.</h1>
          <p style="margin:0 0 16px;line-height:1.6;color:#4a4a4a;">Your estimated total is <strong>${formatSgd(price.total)}</strong>. We will review the details, confirm installation requirements if needed, and send the final quote/payment instructions.</p>
          <p style="margin:0 0 24px;line-height:1.6;color:#4a4a4a;">Quote reference: <strong>${quoteReference}</strong></p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rowsHtml}</table>
          <p style="margin:28px 0 0;color:#6a6a6a;font-size:13px;">Just Acoustics · Singapore · <a href="mailto:info@justacoustics.co" style="color:#6a6a6a;">info@justacoustics.co</a></p>
        </div>
      `,
    })

    if (customerResult.error) {
      console.error('Resend shop quote customer email error:', customerResult.error)
      return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      quoteReference,
      estimatedTotal: price.total,
      currency: price.currency,
    })
  } catch (err) {
    console.error('Shop quote error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Quote request failed' }, { status: 500 })
  }
}
