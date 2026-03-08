import React from "react";

export default function Map() {
  return (
    <section
      className="relative flex flex-col items-center justify-center py-6 px-4"
      style={{ background: "rgba(17,17,20,0.7)", borderRadius: 14, margin: "1.5rem auto", maxWidth: "600px", boxShadow: "0 4px 16px rgba(201,169,110,0.06)" }}
    >
      <h2 className="text-xl font-semibold mb-2 text-[#c9a96e]">Our Location</h2>
      <p className="mb-4 text-white/70 text-center" style={{ fontSize: "1rem" }}>
        No 17 Bharathiyar Street, MGR Nagar, Chennai 600078
      </p>
      <div style={{ width: "100%", maxWidth: 480, height: 220, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(201,169,110,0.10)" }}>
        <iframe
          title="NexCraftTech Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.324964964543!2d80.2076243152607!3d13.044857990800998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267e2e2e2e2e2%3A0x2e2e2e2e2e2e2e2e!2sNo%2017%20Bharathiyar%20Street%2C%20MGR%20Nagar%2C%20Chennai%20600078!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
          width="100%"
          height="220"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
