import nodemailer from "nodemailer";

export async function POST(request) {
  const { name, email, company, service, budget, message } = await request.json();

  // Hardcoded Gmail credentials for development only
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nexcrafttech@gmail.com",
      pass: "fczb pjks neum wvdi",
    },
  });

  // Email content
  const mailOptions = {
    from: "nexcrafttech@gmail.com",
    to: "anandanathurelangovan94@gmail.com",
    subject: `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nService: ${service}\nBudget: ${budget}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
