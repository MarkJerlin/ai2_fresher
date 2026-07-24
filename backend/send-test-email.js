const { sendRegistrationEmail } = require('./src/utils/mailer');

async function testEmail() {
  const targetEmail = process.argv[2] || 'markjerlin15@gmail.com';
  console.log(`🚀 Sending test registration email to: ${targetEmail}...`);
  
  const result = await sendRegistrationEmail(targetEmail, 'Mark Jerlin', 'CSE2026001', 'Computer Science and Engineering');
  if (result.previewUrl) {
    console.log(`\n✅ Email Sent! Open this URL in your web browser to view the delivered email:\n👉 ${result.previewUrl}\n`);
  } else {
    console.log(`\n✅ Email Sent directly to ${targetEmail}!\n`);
  }
}

testEmail();
