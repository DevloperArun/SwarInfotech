<%@ Page Title="Sanskrit Scholarship" Language="C#" AutoEventWireup="true" CodeFile="ChatCopy.aspx.cs" Inherits="Chat" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
 <style>
body {
  font-family: Arial, sans-serif;
  background: #f5f7fa;
  padding: 40px;
}
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;   /* ✅ default light gray border */
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 🔥 SAME hover effect for all cards */
.card:hover {
  border: 1px solid #6366f1;   /* common hover border */
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.18); /* premium soft glow */
  transform: translateY(-4px); /* slight lift effect */
}

/* Icon */
.icon {
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 24px;
  color: #fff;
  margin-bottom: 15px;
  background: var(--main-color);
}

/* Progress Bar */
.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: var(--main-color);
  transition: width 0.4s ease;
}

.card:hover .progress {
  width: 100%;
}

/* Different icon colors */
.card-1 { --main-color: #ff4d6d; }
.card-2 { --main-color: #2d9cff; }
.card-3 { --main-color: #7b61ff; }
.card-4 { --main-color: #ff8c00; }
.card-5 { --main-color: #22c55e; }
.card-6 { --main-color: #14b8a6; }
.card-7 { --main-color: #f43f5e; }
.card-8 { --main-color: #8b5cf6; }

    </style>
<div class="card-container">

  <div class="card card-1">
    <div class="icon">🤰</div>
    <h3>Compassion First</h3>
    <p>Caring for every expecting mother with empathy.</p>
    <div class="progress"></div>
  </div>

  <div class="card card-2">
    <div class="icon">🤖</div>
    <h3>AI & IoT Innovation</h3>
    <p>Smart pregnancy monitoring system.</p>
    <div class="progress"></div>
  </div>

  <div class="card card-3">
    <div class="icon">📅</div>
    <h3>9-Month Journey Care</h3>
    <p>End-to-end maternal support.</p>
    <div class="progress"></div>
  </div>

  <div class="card card-4">
    <div class="icon">⏰</div>
    <h3>24×7 Availability</h3>
    <p>Access anytime, anywhere.</p>
    <div class="progress"></div>
  </div>

  <div class="card card-5">
    <div class="icon">👩‍⚕️</div>
    <h3>Verified Experts</h3>
    <p>Certified gynecologists support.</p>
    <div class="progress"></div>
  </div>

  <div class="card card-6">
    <div class="icon">🏠</div>
    <h3>Home Monitoring</h3>
    <p>Track vitals from home.</p>
    <div class="progress"></div>
  </div>

  <div class="card card-7">
    <div class="icon">🔒</div>
    <h3>Privacy First</h3>
    <p>Top-level data protection.</p>
    <div class="progress"></div>
  </div>

  <div class="card card-8">
    <div class="icon">💬</div>
    <h3>Community Support</h3>
    <p>Connect & grow together.</p>
    <div class="progress"></div>
  </div>

</div>


</asp:Content>

