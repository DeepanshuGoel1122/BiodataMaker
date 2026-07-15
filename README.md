<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layout-template.svg" width="80" height="80" alt="BioData Maker Logo" />
  <br/>
  <h1>BioData Maker</h1>
  <p><strong>A modern, premium, and highly customizable biodata generator built for the web.</strong></p>
</div>

<br/>

BioData Maker is a full-stack Next.js application designed to help users create stunning, professional, and matrimonial biodatas in minutes. With a dynamic drag-and-drop form builder, live previews, and instantaneous color theming, it provides a seamless user experience from data entry to PDF generation.

---

## ✨ Key Features

- **Live Dynamic Preview**: See your biodata update in real-time as you type, upload images, or rearrange fields.
- **Dynamic Form Builder**: Add custom fields, reorder them using intuitive up/down controls, and create brand new sections on the fly.
- **6 Premium Templates**: 
  - *Classic*: A clean, minimal, and elegant layout.
  - *Royal*: A rich, traditional layout with decorative borders and serif typography.
  - *Elegant*: A sophisticated design featuring subtle watercolor elements and stylized initials.
  - *Modern*: A bold, geometric design with high-contrast elements.
  - *Executive*: A sleek, dual-column corporate style layout.
  - *Minimalist*: A highly refined, whitespace-heavy editorial aesthetic.
- **Dynamic Color Themes**: Swap between 10 meticulously curated color palettes (Gold, Maroon, Emerald, Navy, etc.). Every template instantly adapts to the selected theme via dynamic CSS variables.
- **High-Quality PDF Export**: Generates pixel-perfect PDFs customized for A4 printing using `react-to-print` and `html2canvas`.
- **Integrated Payment Gateway**: Seamless integration with Razorpay to unlock premium templates. 
- **Smart Fingerprinting**: Intelligent state hashing ensures users who pay for a premium download don't have to pay again if they retry the exact same configuration.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database / Backend**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Payments**: [Razorpay SDK](https://razorpay.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), Lucide Icons, Framer Motion
- **PDF Generation**: `react-to-print`

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed on your machine.

### 2. Clone and Install
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of your project based on the provided `.env.example`. You will need to supply your own keys for Supabase and Razorpay:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Run the Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action. Navigate to `/create` to test the builder!

---

## 🎨 Architecture & Theming

The application utilizes a highly scalable theming system. Instead of hardcoding colors, templates use CSS variables (`var(--theme-primary)`, `var(--theme-secondary)`, etc.). The `TemplatePreview` component dynamically injects these variables into the DOM based on the user's selection from `useBiodataStore`. This allows new templates to be added seamlessly without needing to redefine color logic!

---

## 📜 License
This project is proprietary and confidential. All rights reserved.
