# MS Reliable Repair - Official Website

A high-end, professional website designed and built for **MS Reliable Repair**, featuring master handyman solutions, animated hero section, interactive before/after transformation slider, and a working PHP contact/booking form.

---

## 🌟 Key Features

- **Modern & Trust-Building Design System**: Built with rich Slate Navy, Warm Amber highlights, subtle glassmorphism, and responsive typography.
- **Hero Section with House Painting Backdrop Video**:
  - Full-width backdrop video showing real house exterior wall painting in continuous motion.
  - Light, clean overlay with high-contrast text shadows.
- **Services Showcase**:
  - 🚰 **Plumbing & Piping Repairs** (Leaks, copper/PVC pipes, valves, fixtures, drains)
  - ⚡ **Electrical Repairs & Lighting** (Switches, outlets, fixtures, breakers, ceiling fans)
  - 🔨 **Building: Fences, Walls & Sheds** (Custom fences, sheds, partition walls, drywall hanging & repairs)
  - 🎨 **General Maintenance & Painting** (Interior/exterior painting on the side, doors, locks, assembly, caulking)
- **Interactive Before & After Slider**: Homeowners can drag to compare damaged vs flawlessly repaired rooms.
- **Dual Contact Experience**:
  - **Navigation Pop-Up Modal**: Fast 1-click Contact Us modal accessible from anywhere on the page or service cards.
  - **On-Page Contact Section**: Convenient message form with phone, email, and direct inquiry options.
- **Working PHP Form Backend (`contact.php`)**:
  - Direct mail delivery to `msreliablerepairs@gmail.com`.
  - AJAX response handling with toast feedback.
  - Input sanitization and honeypot anti-spam protection.
- **Mobile Optimized**: Includes a sticky bottom action bar for instant call and Contact Us access on mobile.

---

## 📁 File Structure

```text
site1/
├── index.html         # Main website structure & content
├── css/
│   └── style.css      # Comprehensive CSS styles, variables & animations
├── js/
│   └── main.js        # Modals, sliders, FAQ accordions & AJAX form handler
├── contact.php        # PHP email processing script
└── README.md          # Project documentation & deployment guide
```

---

## 🚀 How to Run & Deploy

### 1. Local Testing
You can preview the frontend using Python's built-in web server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### 2. Live Hosting (with PHP Email Delivery)
Upload the files (`index.html`, `contact.php`, `css/`, `js/`) to any web hosting provider supporting PHP (e.g., Apache, Nginx, cPanel, Bluehost, Hostinger, SiteGround, AWS, etc.):
- All submissions from both the modal popup and the on-page form will be sent directly to `msreliablerepairs@gmail.com`.
- No database setup is required.

---

## 📞 Company Information

- **Company Name**: MS Reliable Repair
- **Phone**: [(732) 123-4567](tel:7321234567)
- **Email**: [msreliablerepairs@gmail.com](mailto:msreliablerepairs@gmail.com)
- **Services**: Plumbing, Electrical, Drywall, General Maintenance
