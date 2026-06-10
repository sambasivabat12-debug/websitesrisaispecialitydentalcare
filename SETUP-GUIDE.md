# 📋 Netlify CMS Setup Guide
## Sri Sai Speciality Dental Care — Blog Integration

---

## 📁 FILES YOU RECEIVED

```
admin/
  ├── index.html        ← CMS editor panel
  └── config.yml        ← CMS settings & fields

blog/
  ├── index.html        ← Blog listing page (/blog/)
  ├── post-template.html ← Single post page
  ├── posts-index.json  ← Post list for blog page
  └── _posts/
      └── 2026-06-10-5-signs-you-need-dentist.md  ← Sample post

netlify.toml           ← Add redirects for blog URLs
SETUP-GUIDE.md         ← This file
```

---

## ✅ STEP 1: Upload Files to Your Website

Drag-and-drop these folders to your website root in GitHub / file system:

- **`admin/`** → upload as-is
- **`blog/`** → upload as-is
- **`netlify.toml`** → merge with your existing one (or replace)

Your final folder structure should look like:
```
/ (root)
├── index.html
├── style.css
├── netlify.toml      ← updated
├── admin/
│   ├── index.html
│   └── config.yml
├── blog/
│   ├── index.html
│   ├── post-template.html
│   ├── posts-index.json
│   └── _posts/
│       └── *.md
├── images/
│   ├── blog/         ← create this folder (CMS uploads go here)
│   └── ...existing images
```

---

## ✅ STEP 2: Enable Netlify Identity (One-Time Setup)

1. Go to → **app.netlify.com** → Your site → **Site settings**
2. Click **Identity** → Click **"Enable Identity"**
3. Under **Registration** → Select **"Invite only"** ✅ (so only you can log in)
4. Scroll to **Git Gateway** → Click **"Enable Git Gateway"** ✅

---

## ✅ STEP 3: Invite Yourself as Admin

1. Still in **Identity** tab → Click **"Invite users"**
2. Enter your email: `sssdentalcare24@gmail.com`
3. Check your email → Click the invite link → Set a password

---

## ✅ STEP 4: Deploy to Netlify

Push/upload all files. Then visit:
```
https://www.srisaispecialitydentalcare.in/admin/
```

Log in with your email and the password you set. You'll see the CMS!

---

## ✅ STEP 5: Write Your First Blog Post

1. Go to `https://www.srisaispecialitydentalcare.in/admin/`
2. Click **"Blog Posts"** → **"New Blog Post"**
3. Fill in: Title, Category, Description, Body (use the rich editor)
4. Upload a featured image
5. Toggle **"Published"** to ON
6. Click **"Publish"** → Done! ✅

The post will appear at: `/blog/2026-06-10-your-post-title/`

---

## ✅ STEP 6: Add Blog Link to Your Navigation

In your `index.html`, add this to your `<nav>` menu:
```html
<a href="/blog/">Blog</a>
```

---

## 📝 UPDATING posts-index.json (Important!)

Every time you publish a new post via CMS, also add it to `/blog/posts-index.json` manually so it shows on the blog listing page:

```json
{
  "title": "Your Post Title",
  "date": "2026-06-15T10:00:00.000Z",
  "author": "Dr. T. Venkat Rao",
  "category": "Dental Tips",
  "thumbnail": "/images/blog/your-image.jpg",
  "description": "Short description here (1-2 lines).",
  "url": "/blog/2026-06-15-your-post-slug",
  "tags": "tag1, tag2"
}
```

---

## 🔒 Security Notes

- Your CMS is at `/admin/` — only invited users can log in
- Netlify Identity handles authentication securely
- No plugins or databases needed — everything is files

---

## 📞 Support

For help: Visit Netlify CMS docs at https://decapcms.org/docs/
Or contact your web developer.

**Sri Sai Speciality Dental Care**
TKR College Road, Karmanghat, Hyderabad
📞 86880 33072
