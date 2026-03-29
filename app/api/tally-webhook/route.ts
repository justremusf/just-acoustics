import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await req.json()

    // Extract fields from Tally webhook payload
    // Tally sends: { formId, responseId, fields: [{ label, value }] }
    const fields: Array<{ label: string; value: string }> = body.data?.fields || []

    const getName = () => fields.find((f) => f.label.toLowerCase().includes('name'))?.value || 'there'
    const getEmail = () => fields.find((f) => f.label.toLowerCase().includes('email'))?.value || ''

    const name = getName()
    const email = getEmail()

    if (!email) {
      return NextResponse.json({ error: 'No email found in submission' }, { status: 400 })
    }

    // Send confirmation to the enquirer
    await resend.emails.send({
      from: 'Just Acoustics <onboarding@resend.dev>',
      to: email,
      subject: 'Thanks for reaching out — Just Acoustics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <img src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg" alt="Just Acoustics" style="width: 180px; margin-bottom: 32px;" />
          <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px; color: #010101;">Hi ${name}, we've received your enquiry!</h1>
          <p style="margin: 0 0 16px; line-height: 1.6; color: #4a4a4a;">
            Thank you for reaching out to Just Acoustics. One of our acoustic specialists will be in touch with you within 24 hours.
          </p>
          <p style="margin: 0 0 32px; line-height: 1.6; color: #4a4a4a;">
            In the meantime, you can WhatsApp us directly at <a href="https://wa.me/6589301905" style="color: #ffa500;">+65 8930 1905</a> for a quicker response.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          <p style="margin: 0; color: #6a6a6a; font-size: 13px;">
            Just Acoustics · Singapore · <a href="mailto:info@justacoustics.co" style="color: #6a6a6a;">info@justacoustics.co</a>
          </p>
        </div>
      `,
    })

    // Send internal notification to the team
    const teamEmail = 'justacousticssg@gmail.com'
    const fieldsHtml = fields
      .map((f) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;">${f.label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font-size:13px;">${f.value}</td></tr>`)
      .join('')

    await resend.emails.send({
      from: 'Just Acoustics <onboarding@resend.dev>',
      to: teamEmail,
      subject: `New enquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color:#010101;">New enquiry submitted</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            ${fieldsHtml}
          </table>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Tally webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
