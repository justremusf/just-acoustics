import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { PAYNOW_INSTRUCTIONS, PAYNOW_REASSURANCE } from '@/lib/paymentCopy'
import { formatSgd } from '@/lib/shopPricing'

const PAYNOW_VPA = 'UEN202336944WA00#XNAP'
const PAYNOW_QR_URL = 'https://www.justacoustics.co/assets/paynow/just-acoustics-paynow-qr.png'

const cartOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().optional(),
})

const cartItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  lineTotal: z.number().min(0),
  options: z.array(cartOptionSchema).default([]),
})

const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  subtotal: z.number().min(0),
  customer: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    company: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    postalCode: z.string().min(1),
    deliveryNotes: z.string().optional(),
  }),
  paymentReference: z.string().min(1),
  timestamp: z.string().min(1),
})

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
}: z.infer<typeof checkoutSchema>) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder') {
    return { status: 'skipped' as const }
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
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;"><strong>${escapeHtml(item.title)}</strong><br/><span style="color:#666;">${escapeHtml(options)}</span></td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${item.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:right;">${formatSgd(item.lineTotal)}</td></tr>`
    })
    .join('')

  const customerRowsHtml = buildRowsHtml([
    ['Payment reference', paymentReference],
    ['PayNow VPA', PAYNOW_VPA],
    ['Amount due', formatSgd(subtotal)],
    ['Full name', customer.fullName],
    ['Email', customer.email],
    ['Phone', customer.phone],
    ['Company', customer.company],
    ['Address line 1', customer.addressLine1],
    ['Address line 2', customer.addressLine2],
    ['Postal code', customer.postalCode],
    ['Delivery notes', customer.deliveryNotes],
  ])

  const internalResult = await resend.emails.send({
    from: fromEmail,
    to: teamEmail,
    subject: `New cart order ${paymentReference} - ${formatSgd(subtotal)}`,
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

  const customerResult = await resend.emails.send({
    from: fromEmail,
    to: customer.email,
    subject: `Your Just Acoustics PayNow order details (${paymentReference})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 36px 20px; color:#333;">
        <img src="https://www.justacoustics.co/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg" alt="Just Acoustics" style="width: 180px; margin-bottom: 28px;" />
        <h1 style="font-size:24px;font-weight:600;margin:0 0 14px;color:#010101;">Thanks ${escapeHtml(customer.fullName)}, your order details were received.</h1>
        <p style="margin:0 0 16px;line-height:1.6;color:#4a4a4a;">Please complete payment by PayNow for <strong>${formatSgd(subtotal)}</strong>.</p>
        <p style="margin:0 0 8px;line-height:1.6;color:#4a4a4a;">PayNow VPA: <strong>${PAYNOW_VPA}</strong></p>
        <p style="margin:0 0 18px;line-height:1.6;color:#4a4a4a;">Payment reference: <strong>${escapeHtml(paymentReference)}</strong></p>
        <p style="margin:0 0 20px;line-height:1.6;color:#4a4a4a;">You can use the QR code shown at checkout or open this QR link: <a href="${PAYNOW_QR_URL}" style="color:#137e89;">PayNow QR</a>.</p>
        <p style="margin:0 0 20px;line-height:1.6;color:#4a4a4a;">${escapeHtml(PAYNOW_REASSURANCE)}</p>
        <table style="width:100%;border-collapse:collapse;"><thead><tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #ddd;">Item</th><th style="padding:8px 12px;text-align:center;border-bottom:1px solid #ddd;">Qty</th><th style="padding:8px 12px;text-align:right;border-bottom:1px solid #ddd;">Total</th></tr></thead><tbody>${itemRowsHtml}</tbody></table>
        <p style="margin:28px 0 0;color:#6a6a6a;font-size:13px;">Just Acoustics · Singapore · <a href="mailto:info@justacoustics.co" style="color:#6a6a6a;">info@justacoustics.co</a></p>
      </div>
    `,
  })

  if (internalResult.error || customerResult.error) {
    console.error('Resend cart checkout email error:', {
      internal: internalResult.error,
      customer: customerResult.error,
    })
    return { status: 'failed' as const }
  }

  return { status: 'sent' as const }
}

export async function POST(req: NextRequest) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json({ error: 'Please complete the required checkout details.' }, { status: 400 })
  }

  const { items, subtotal, customer, paymentReference, timestamp } = parsed.data
  const calculatedSubtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  if (Math.round(calculatedSubtotal) !== Math.round(subtotal)) {
    return NextResponse.json({ error: 'Cart subtotal does not match the submitted items.' }, { status: 400 })
  }

  const email = await sendOrderEmails(parsed.data)

  return NextResponse.json(
    {
      status: 'manual_paynow',
      message: 'Order details received. Please complete the PayNow payment below. Once payment is received, you will receive a confirmation email and our team will reach out to schedule delivery and/or installation.',
      paymentReference,
      emailStatus: email.status,
      payment: {
        method: 'PayNow QR',
        currency: 'SGD',
        amount: subtotal,
        vpa: PAYNOW_VPA,
        qrUrl: PAYNOW_QR_URL,
        instructions: PAYNOW_INSTRUCTIONS,
      },
      orderPreview: {
        items,
        subtotal,
        customer,
        paymentReference,
        timestamp,
        currency: 'SGD',
      },
    },
    { status: 200 }
  )
}
