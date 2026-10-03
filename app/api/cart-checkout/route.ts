import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { PAYNOW_INSTRUCTIONS, PAYNOW_REASSURANCE } from '@/lib/paymentCopy'
import {
  PAYNOW_QR_URL,
  PAYNOW_VPA,
  createPaymentReference,
  formatPayable,
  isValidPhone,
  isValidPostalCode,
  lineTotal,
  roundCents,
} from '@/lib/checkout'

const cartOptionSchema = z.object({
  label: z.string().min(1).max(80),
  value: z.string().max(200).optional(),
})

const cartItemSchema = z.object({
  id: z.string().min(1).max(500),
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(10000),
  unitPrice: z.number().finite().min(0),
  lineTotal: z.number().finite().min(0).optional(),
  options: z.array(cartOptionSchema).max(20).default([]),
})

const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(100),
  subtotal: z.number().finite().min(0),
  customer: z.object({
    fullName: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(1).max(40).refine(isValidPhone),
    company: z.string().trim().max(160).optional(),
    addressLine1: z.string().trim().min(1).max(240),
    addressLine2: z.string().trim().max(240).optional(),
    postalCode: z.string().trim().refine(isValidPostalCode),
    deliveryNotes: z.string().trim().max(2000).optional(),
  }),
})

type CheckoutOrder = z.infer<typeof checkoutSchema> & { paymentReference: string }

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function buildRowsHtml(rows: Array<[string, unknown]>) {
  return rows
    .map(([label, value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${escapeHtml(value || '-')}</td></tr>`)
    .join('')
}

async function sendOrderEmails({
  items,
  subtotal,
  customer,
  paymentReference,
}: CheckoutOrder) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder') {
    return { team: false, customer: false }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Just Acoustics <onboarding@resend.dev>'
  const teamEmail = 'info@justacoustics.co'

  const itemRowsHtml = items
    .map((item) => {
      const options = item.options
        .filter((option) => option.value)
        .map((option) => `${option.label}: ${option.value}`)
        .join(', ')
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;"><strong>${escapeHtml(item.title)}</strong><br/><span style="color:#666;">${escapeHtml(options)}</span></td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${item.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:right;">${formatPayable(lineTotal(item.unitPrice, item.quantity))}</td></tr>`
    })
    .join('')

  const customerRowsHtml = buildRowsHtml([
    ['Payment reference', paymentReference],
    ['PayNow VPA', PAYNOW_VPA],
    ['Amount due', formatPayable(subtotal)],
    ['Full name', customer.fullName],
    ['Email', customer.email],
    ['Phone', customer.phone],
    ['Company', customer.company],
    ['Address line 1', customer.addressLine1],
    ['Address line 2', customer.addressLine2],
    ['Postal code', customer.postalCode],
    ['Delivery notes', customer.deliveryNotes],
  ])

  const internalResult = await resend.emails
    .send({
    from: fromEmail,
    to: teamEmail,
    subject: `New cart order ${paymentReference} - ${formatPayable(subtotal)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 36px 20px;">
        <h2 style="color:#010101;margin:0 0 10px;">New manual PayNow cart order</h2>
        <p style="margin:0 0 20px;color:#4a4a4a;line-height:1.6;">Customer submitted checkout details and was shown PayNow payment instructions.</p>
        <h3 style="color:#010101;margin:24px 0 8px;">Items</h3>
        <table style="width:100%;border-collapse:collapse;"><thead><tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #ddd;">Item</th><th style="padding:8px 12px;text-align:center;border-bottom:1px solid #ddd;">Qty</th><th style="padding:8px 12px;text-align:right;border-bottom:1px solid #ddd;">Total</th></tr></thead><tbody>${itemRowsHtml}</tbody></table>
        <h3 style="color:#010101;margin:28px 0 8px;">Customer and payment</h3>
        <table style="width:100%;border-collapse:collapse;">${customerRowsHtml}</table>
      </div>
    `,
    })
    .catch((error: unknown) => ({ error }))

  const customerResult = await resend.emails
    .send({
    from: fromEmail,
    to: customer.email,
    subject: `Your Just Acoustics PayNow order details (${paymentReference})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 36px 20px; color:#333;">
        <img src="https://www.justacoustics.co/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg" alt="Just Acoustics" style="width: 180px; margin-bottom: 28px;" />
        <h1 style="font-size:24px;font-weight:600;margin:0 0 14px;color:#010101;">Thanks ${escapeHtml(customer.fullName)}, your order details were received.</h1>
        <p style="margin:0 0 16px;line-height:1.6;color:#4a4a4a;">Please complete payment by PayNow for <strong>${formatPayable(subtotal)}</strong>.</p>
        <p style="margin:0 0 8px;line-height:1.6;color:#4a4a4a;">PayNow VPA: <strong>${PAYNOW_VPA}</strong></p>
        <p style="margin:0 0 18px;line-height:1.6;color:#4a4a4a;">Payment reference: <strong>${escapeHtml(paymentReference)}</strong></p>
        <p style="margin:0 0 20px;line-height:1.6;color:#4a4a4a;">You can use the QR code shown at checkout or open this QR link: <a href="${PAYNOW_QR_URL}" style="color:#137e89;">PayNow QR</a>.</p>
        <p style="margin:0 0 20px;line-height:1.6;color:#4a4a4a;">${escapeHtml(PAYNOW_REASSURANCE)}</p>
        <table style="width:100%;border-collapse:collapse;"><thead><tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #ddd;">Item</th><th style="padding:8px 12px;text-align:center;border-bottom:1px solid #ddd;">Qty</th><th style="padding:8px 12px;text-align:right;border-bottom:1px solid #ddd;">Total</th></tr></thead><tbody>${itemRowsHtml}</tbody></table>
        <p style="margin:28px 0 0;color:#6a6a6a;font-size:13px;">Just Acoustics · Singapore · <a href="mailto:info@justacoustics.co" style="color:#6a6a6a;">info@justacoustics.co</a></p>
      </div>
    `,
    })
    .catch((error: unknown) => ({ error }))

  if (internalResult.error || customerResult.error) {
    console.error('Resend cart checkout email error:', {
      internal: internalResult.error,
      customer: customerResult.error,
    })
  }

  return { team: !internalResult.error, customer: !customerResult.error }
}

export async function POST(req: NextRequest) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Some checkout details are missing or invalid. Please check the form and try again.' },
      { status: 400 }
    )
  }

  const { items, subtotal } = parsed.data
  // Recalculate on the server; never trust the submitted subtotal.
  const amount = roundCents(items.reduce((sum, item) => sum + lineTotal(item.unitPrice, item.quantity), 0))

  if (Math.abs(amount - subtotal) > 0.01) {
    return NextResponse.json(
      { error: 'Your cart changed while checking out. Please refresh the page and try again.' },
      { status: 409 }
    )
  }

  const order: CheckoutOrder = { ...parsed.data, subtotal: amount, paymentReference: createPaymentReference() }
  const email = await sendOrderEmails(order)

  if (!email.team) {
    // Last-resort record so the order can be recovered from server logs.
    console.warn('Cart checkout order not emailed to team:', JSON.stringify(order))
  }

  return NextResponse.json({
    status: 'manual_paynow',
    paymentReference: order.paymentReference,
    teamNotified: email.team,
    customerEmailSent: email.customer,
    payment: {
      method: 'PayNow QR',
      currency: 'SGD',
      amount,
      vpa: PAYNOW_VPA,
      qrUrl: PAYNOW_QR_URL,
      instructions: PAYNOW_INSTRUCTIONS,
    },
  })
}
