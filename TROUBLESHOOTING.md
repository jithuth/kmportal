# 🔍 Troubleshooting Checklist

## Issue: Admin Classifieds Not Showing

### **Step 1: Verify Database Setup** ✅

Run `debug_classifieds.sql` in Supabase SQL Editor to check:
- ✅ Classifieds table has new columns
- ✅ Storage bucket exists
- ✅ RLS policies are correct

---

### **Step 2: Did You Run These SQL Scripts?** 

Check if you ran these in order:

1. ✅ **`classifieds_enhancement.sql`** - Adds new columns
2. ✅ **`storage_setup.sql`** - Creates storage bucket
3. ✅ **`fix_admin_classifieds.sql`** - Fixes admin permissions

**If you haven't run them, run them NOW in Supabase SQL Editor!**

---

### **Step 3: Restart Dev Server** 🔄

Sometimes Next.js caches routes. Restart:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

### **Step 4: Clear Browser Cache** 🧹

1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

---

### **Step 5: Check if Classifieds Exist** 📊

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **classifieds** table
4. Do you see any rows?

**If NO rows:**
- Go to `/classifieds/new`
- Create a test classified
- Submit it
- Then check `/admin/classifieds`

---

### **Step 6: Check Console for Errors** 🐛

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Visit `/admin/classifieds`
4. Look for any red errors

**Common errors:**
- "Bucket not found" → Run `storage_setup.sql`
- "Column does not exist" → Run `classifieds_enhancement.sql`
- "RLS policy" error → Run `fix_admin_classifieds.sql`

---

### **Step 7: Verify Admin Sidebar** 👀

1. Go to `/admin`
2. Look at the left sidebar
3. Do you see **"Classifieds"** menu item?

**If NO:**
- The code change didn't apply
- Restart dev server
- Hard refresh browser

---

### **Quick Test Flow** 🧪

1. **Post a classified:**
   - Go to `/classifieds/new`
   - Fill form (title, description, category, price, location, phone)
   - Upload 1-2 images
   - Check "Price is negotiable"
   - Click "Submit for Approval"
   - You should see success message

2. **Check admin panel:**
   - Go to `/admin/classifieds`
   - Click "Pending" tab
   - You should see your classified
   - Click "Approve"
   - It should move to "Approved" tab

3. **Check public view:**
   - Go to `/classifieds`
   - You should see the approved classified

---

## **Most Common Issues:**

### **Issue 1: "Classifieds" not in sidebar**
**Fix:** Restart dev server (`npm run dev`)

### **Issue 2: "No classifieds found"**
**Fix:** Create a test classified from `/classifieds/new`

### **Issue 3: "Bucket not found"**
**Fix:** Run `storage_setup.sql` in Supabase

### **Issue 4: "Column does not exist"**
**Fix:** Run `classifieds_enhancement.sql` in Supabase

### **Issue 5: Can't see pending classifieds**
**Fix:** Run `fix_admin_classifieds.sql` in Supabase

---

## **Nuclear Option** 💣

If nothing works:

1. **Stop dev server** (Ctrl+C)
2. **Run ALL SQL scripts in order:**
   - `classifieds_enhancement.sql`
   - `storage_setup.sql`
   - `fix_admin_classifieds.sql`
3. **Clear browser cache completely**
4. **Restart dev server:** `npm run dev`
5. **Create test classified:** `/classifieds/new`
6. **Check admin:** `/admin/classifieds`

---

## **Still Not Working?**

Share the output of:
1. `debug_classifieds.sql` results
2. Browser console errors (F12 → Console)
3. Terminal errors from `npm run dev`

I'll help you fix it! 🚀
