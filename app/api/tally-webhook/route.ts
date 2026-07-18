import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Just Acoustics <onboarding@resend.dev>'
  const signingSecret = process.env.TALLY_WEBHOOK_SECRET
  const teamEmail = 'info@justacoustics.co'
  try {
    const rawBody = await req.text()

    if (signingSecret) {
      const receivedSignature = req.headers.get('tally-signature')

      if (!receivedSignature) {
        return NextResponse.json({ error: 'Missing Tally signature' }, { status: 401 })
      }

      const expectedSignature = createHmac('sha256', signingSecret)
        .update(rawBody)
        .digest('base64')

      const isValidSignature =
        receivedSignature.length === expectedSignature.length &&
        timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))

      if (!isValidSignature) {
        return NextResponse.json({ error: 'Invalid Tally signature' }, { status: 401 })
      }
    }

    const body = JSON.parse(rawBody)

    // Extract fields from Tally webhook payload
    // Tally sends: { formId, responseId, fields: [{ label, value }] }
    const fields: Array<{ label: string; value: string }> = body.data?.fields || []

    const normalisedFields = Object.fromEntries(
      fields.map((field) => [
        field.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
        field.value,
      ])
    )

    const responseId = String(body.data?.responseId || body.data?.response_id || body.eventId || '')
    const formId = String(body.data?.formId || body.data?.form_id || body.formId || '')
    const consentState = String(normalisedFields.consent_state || 'analytics_only')
    let attributionForwardingResult: 'not_configured' | 'succeeded' = 'not_configured'

    console.info('Tally webhook received', {
      responseId,
      formId,
      consentState,
    })

    const getName = () => fields.find((f) => f.label.toLowerCase().includes('name'))?.value || 'there'
    const getEmail = () => fields.find((f) => f.label.toLowerCase().includes('email'))?.value || ''

    const name = getName()
    const email = getEmail()

    if (!email) {
      return NextResponse.json({ error: 'No email found in submission' }, { status: 400 })
    }

    // Send confirmation to the enquirer
    const confirmationResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Thanks for reaching out — Just Acoustics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <img src="https://www.justacoustics.co/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg" alt="Just Acoustics" style="width: 180px; margin-bottom: 32px;" />
          <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px; color: #010101;">Hi ${name}, we've received your enquiry!</h1>
          <p style="margin: 0 0 16px; line-height: 1.6; color: #4a4a4a;">
            Thank you for reaching out to Just Acoustics. One of our acoustic specialists will be in touch with you within 1 hour.
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

    if (confirmationResult.error) {
      console.error('Resend confirmation email error:', confirmationResult.error)
      return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 502 })
    }

    // Send internal notification to the team
    const fieldsHtml = fields
      .map((f) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;">${f.label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font-size:13px;">${f.value}</td></tr>`)
      .join('')

    const notificationResult = await resend.emails.send({
      from: fromEmail,
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

    if (notificationResult.error) {
      console.error('Resend internal notification error:', {
        recipient: teamEmail,
        error: notificationResult.error,
      })
      return NextResponse.json({ error: 'Failed to send internal notification email' }, { status: 502 })
    }

    const makeWebhookUrl = process.env.MAKE_ATTRIBUTION_WEBHOOK_URL
    if (makeWebhookUrl) {
      const forwardingResult = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.MAKE_ATTRIBUTION_WEBHOOK_SECRET
            ? { Authorization: `Bearer ${process.env.MAKE_ATTRIBUTION_WEBHOOK_SECRET}` }
            : {}),
        },
        body: JSON.stringify({
          schema_version: '1',
          event_type: 'tally_submission',
          event_id: responseId,
          form_id: formId,
          received_at: new Date().toISOString(),
          fields: normalisedFields,
          attribution: {
            lead_ref: normalisedFields.lead_ref || '',
            gclid: normalisedFields.gclid || '',
            gbraid: normalisedFields.gbraid || '',
            wbraid: normalisedFields.wbraid || '',
            utm_source: normalisedFields.utm_source || '',
            utm_medium: normalisedFields.utm_medium || '',
            utm_campaign: normalisedFields.utm_campaign || '',
            utm_term: normalisedFields.utm_term || '',
            utm_content: normalisedFields.utm_content || '',
            campaign_id: normalisedFields.campaign_id || '',
            ad_group_id: normalisedFields.ad_group_id || '',
            ad_id: normalisedFields.ad_id || '',
            first_touch_at: normalisedFields.first_touch_at || '',
            last_touch_at: normalisedFields.last_touch_at || '',
            landing_page: normalisedFields.landing_page || '',
            first_landing_page: normalisedFields.first_landing_page || '',
            consent_state: consentState,
          },
        }),
      })
      if (!forwardingResult.ok) {
        console.error('Make attribution forwarding failed', {
          responseId,
          formId,
          consentState,
          forwardingResult: 'failed',
          status: forwardingResult.status,
        })
        return NextResponse.json({ error: 'Attribution workflow unavailable' }, { status: 502 })
      }

      attributionForwardingResult = 'succeeded'
    }

    console.info('Tally webhook processed', {
      responseId,
      formId,
      consentState,
      forwardingResult: attributionForwardingResult,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Tally webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
