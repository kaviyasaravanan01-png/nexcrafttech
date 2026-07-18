import nodemailer from "nodemailer";

export async function POST(request) {
  const { name, email, company, service, budget, message } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nexcrafttech@gmail.com",
      pass: "fexhrqwfnspjziwh",
    },
  });

  const mailOptions = {
    from: "nexcrafttech@gmail.com",
    to: "anandanathurelangovan94@gmail.com",
    replyTo: email || undefined,
    subject: `New Inquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "—"}`,
      `Service: ${service}`,
      `Budget: ${budget || "—"}`,
      `Message: ${message}`,
    ].join("\n"),
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
