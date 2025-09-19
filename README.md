<div align="center">

# 🛡️ SecurePrint - Privacy-First Document Printing  
_A full-stack MERN application designed to eliminate the security risks of printing documents at public print shops._

</div>

---

## ⚠️ The Problem: A Hidden Security Risk  

Every day, people print sensitive documents like resumes, legal papers, or financial statements at local print shops.  
The standard process is risky:  

- **Emailing**: You email the document to the shop, leaving a copy in your sent folder and on their computer.  
- **USB Drives**: You use a personal USB drive on a public computer, risking malware infections.  
- **Local Copies**: In both cases, a copy of your sensitive document is downloaded and saved onto the print shop's computer, where it can be forgotten, accessed by others, or potentially stolen.  

This creates a significant **digital footprint** for your most private information.  

---

## ✨ Our Solution: A Zero-Trust Printing Workflow  

SecurePrint completely redesigns this workflow with **privacy at its core**.  
It creates a secure, temporary bridge between you and the printer, ensuring your document is **never downloaded or permanently stored** on the print shop's system.  

✅ Users upload documents to their private dashboard.  
✅ Generate a **temporary, shareable link** protected by a **One-Time Password (OTP)**.  
✅ Print shop owners access a **short-lived print session** where they can print documents directly **without saving them**.  

---



(Core Features)  

- 🔐 **Secure Authentication**: JWT-based login and registration.  
- 🗂️ **Private Document Management**: Upload, view, delete from personal dashboard.  
- 🔗 **URL Shortener**: Shareable short links for print sessions.  
- 🔑 **OTP Verification**: Session protected by email-based OTP.  
- 🚫 **Download-Free Printing**: Stream documents directly to print.  
- 💧 **Dynamic Watermarking**: Watermark in preview, removed in final print.  
- 🔍 **Live Search**: Instant filtering on dashboard & print session.  

---

## 🛠️ Tech Stack & Architecture  

This project follows the **MERN Stack Architecture**.  

| Layer           | Technology | Description |
|-----------------|------------|-------------|
| **Frontend**    | React.js   | Declarative UI library |
|                 | React Router | Client-side routing |
|                 | Tailwind CSS | Utility-first styling |
|                 | Axios       | HTTP requests |
| **Backend**     | Node.js     | JavaScript runtime |
|                 | Express.js  | Server-side framework |
|                 | MongoDB     | NoSQL database |
|                 | Mongoose    | ODM for MongoDB |
| **Authentication** | JWT & bcryptjs | Tokens + password hashing |
| **Services**    | Nodemailer  | Send OTP emails |  

---

## 🚀 Getting Started: Local Development Setup  

### Prerequisites  
- Node.js (v14 or later)  
- npm  
- MongoDB (local or Atlas)  

## ⚡ Installation & Setup  

| Step | Command / Instruction |
|------|------------------------|
| **2. Install Backend Dependencies** | ```bash<br>cd backend<br>npm install<br>``` |
| **3. Install Frontend Dependencies** | ```bash<br>cd ../frontend<br>npm install<br>``` |
| **4. Configure Environment Variables** | Create a `.env` file inside `/backend` and add:<br><br>```env<br>MONGO_URI=your_mongodb_connection_string<br>JWT_SECRET=your_super_strong_jwt_secret<br>PORT=5000<br>EMAIL_USER=your_email@gmail.com<br>EMAIL_PASS=your_gmail_app_password<br>FRONTEND_URL=http://localhost:3000<br>``` |
| **5. Run the Application** | **Backend (Terminal 1):**<br>```bash<br>cd backend<br>npm start   # or npm run dev<br>```<br><br>**Frontend (Terminal 2):**<br>```bash<br>cd frontend<br>npm start<br>```<br><br>🌐 **Frontend** → [http://localhost:3000](http://localhost:3000)<br>⚙️ **Backend** → [http://localhost:5000](http://localhost:5000) |

---

## 🔮 Future Scope  

- [ ] **QR Code Sharing** – Generate QR codes for print links.  
- [ ] **Folder Organization** – Organize documents into folders.  
- [ ] **Drag-and-Drop Uploads** – Enhance file upload UX.  
- [ ] **Manual Session Revocation** – Manually expire active links.  

---

## 📜 License  

Distributed under the **MIT License**.  
See [`LICENSE`](LICENSE) for more information.  

---

<div align="center">

💡 Made with ❤️ by **Shubham**

</div>

