#!/usr/bin/env node

/**
 * Email Configuration Test Script
 *
 * This script tests your email configuration to ensure
 * the feedback system can send emails properly.
 */

const nodemailer = require('nodemailer')
require('dotenv').config({ path: '.env.local' })

async function testEmailConfig() {
  console.log('📧 Testing Email Configuration...')
  console.log('=' * 50)

  // Test both configurations
  const configs = []

  // Primary SMTP configuration
  if (process.env.EMAIL_SERVER_HOST) {
    configs.push({
      name: 'Custom SMTP',
      config: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: process.env.EMAIL_SERVER_PORT === '465',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
    })
  }

  // Gmail fallback configuration
  if (process.env.GMAIL_USER) {
    configs.push({
      name: 'Gmail',
      config: {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
    })
  }

  if (configs.length === 0) {
    console.error('❌ No email configuration found!')
    console.log('Please set up either:')
    console.log(
      '1. Custom SMTP: EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD'
    )
    console.log('2. Gmail: GMAIL_USER, GMAIL_APP_PASSWORD')
    return
  }

  // Test each configuration
  for (const { name, config } of configs) {
    console.log(`\n🧪 Testing ${name} Configuration...`)

    try {
      const transporter = nodemailer.createTransporter(config)

      // Verify connection
      console.log('🔍 Verifying connection...')
      await transporter.verify()
      console.log('✅ Connection verified!')

      // Send test email
      const testEmail = {
        from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
        to: process.env.DEVELOPER_EMAIL || 'your-email@example.com',
        subject: 'Test Email from SOAR Feedback System',
        html: `
          <h2>🧪 Email Configuration Test</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p><strong>Configuration:</strong> ${name}</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p>If you received this email, your feedback system is ready to use! 🎉</p>
        `,
        text: `
Email Configuration Test

This is a test email to verify your email configuration is working correctly.
Configuration: ${name}
Sent at: ${new Date().toISOString()}

If you received this email, your feedback system is ready to use!
        `,
      }

      console.log('📤 Sending test email...')
      await transporter.sendMail(testEmail)
      console.log(`✅ Test email sent successfully using ${name}!`)
      console.log(`📧 Check your email: ${process.env.DEVELOPER_EMAIL}`)
    } catch (error) {
      console.error(`❌ ${name} configuration failed:`, error.message)

      // Provide specific error guidance
      if (error.code === 'EAUTH') {
        console.log('💡 Authentication failed. Check your credentials.')
      } else if (error.code === 'ENOTFOUND') {
        console.log('💡 SMTP server not found. Check your host configuration.')
      } else if (error.code === 'ECONNECTION') {
        console.log('💡 Connection failed. Check your host and port settings.')
      }
    }
  }

  console.log('\n🎯 Configuration Summary:')
  console.log(
    'EMAIL_FROM:',
    process.env.EMAIL_FROM || process.env.GMAIL_USER || 'Not set'
  )
  console.log('DEVELOPER_EMAIL:', process.env.DEVELOPER_EMAIL || 'Not set')
  console.log('EMAIL_SERVER_HOST:', process.env.EMAIL_SERVER_HOST || 'Not set')
  console.log('GMAIL_USER:', process.env.GMAIL_USER || 'Not set')
}

// Run the test
testEmailConfig()
  .then(() => {
    console.log('\n✅ Email configuration test completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Email configuration test failed:', error)
    process.exit(1)
  })
