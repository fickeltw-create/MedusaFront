import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Validate environment variables on initialization
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Missing email environment variables: ${missingEnvVars.join(', ')}`);
}

// One.com transporter - configuration officielle pour info@modura.be
const transporter = nodemailer.createTransport({
  host: 'send.one.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // info@modura.be
    pass: process.env.EMAIL_PASSWORD, // votre mot de passe email normal
  },
  tls: {
    rejectUnauthorized: true
  },
  // Force IPv4 to fix Render.com connectivity issues
  family: 4
});

// Verify transporter connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

export async function POST(request: Request) {
  try {
    // Check if email configuration is complete
    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email service not configured',
          missingEnvVars 
        }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type, name, email, phone, model, details, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' }, 
        { status: 400 }
      );
    }

    // Format email content based on request type
    const typeLabels: Record<string, string> = {
      financing: 'financement',
      contact: 'contact',
      contact_form: 'formulaire de contact',
      distributeur: 'demande distributeur',
    };

    const requestType = typeLabels[type] || type;
    const emailSubject = `Nouvelle demande ${requestType} de ${name} | Modura`;
    
    // Enhanced HTML email template with better styling
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle demande sur Modura</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #0F172A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 12px; padding: 10px; background: white; border-radius: 6px; }
          .label { font-weight: bold; color: #64748b; font-size: 0.85em; text-transform: uppercase; }
          .value { color: #0F172A; margin-top: 4px; }
          .highlight { background: #dbeafe; border-left: 4px solid #2563EB; padding: 15px; margin: 15px 0; border-radius: 0 6px 6px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin:0; font-size: 22px;">📬 Nouvelle demande ${requestType}</h1>
          <p style="margin:5px 0 0 0; opacity:0.8;">Reçue depuis le site web Modura</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Nom complet</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">Téléphone</div>
            <div class="value">${phone || 'Non fourni'}</div>
          </div>
          ${model ? `
          <div class="field">
            <div class="label">Modèle concerné</div>
            <div class="value">${model}</div>
          </div>` : ''}
          ${details ? `
          <div class="highlight">
            <div class="label" style="color:#1d4ed8;">Détails du financement</div>
            <div class="value" style="color:#1e40af; font-size:1.1em;">${details}</div>
          </div>` : ''}
          ${message ? `
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>` : ''}
          <p style="margin-top:20px; font-size:0.8em; color:#94a3b8; text-align:center;">
            Email automatique envoyé depuis le site Modura • ${new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email to info@modura.be
    const info = await transporter.sendMail({
      from: `"Modura Website" <${process.env.EMAIL_USER}>`,
      to: 'info@modura.be',
      cc: email, // Send a copy to the submitter
      subject: emailSubject,
      html: emailHtml,
      // Plain text fallback for email clients that don't support HTML
      text: `
Nouvelle demande de ${requestType} sur le site Modura
==================================================
Nom: ${name}
Email: ${email}
Téléphone: ${phone || 'Non fourni'}
${model ? `Modèle: ${model}` : ''}
${details ? `Détails financement: ${details}` : ''}
Message: ${message}

Envoyé le ${new Date().toLocaleString('fr-FR')}
      `,
    });

    console.log(`✅ Email sent successfully: ${type} request from ${name}`, { messageId: info.messageId });
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent to info@modura.be',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('❌ Email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Add GET endpoint for testing the email service
export async function GET() {
  // Verify Outlook connection
  try {
    await transporter.verify();
    return NextResponse.json({
      status: 'ready',
      message: 'Email service is configured and ready',
      email: {
        address: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD ? '✓ configured' : '✗ missing',
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Outlook connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}