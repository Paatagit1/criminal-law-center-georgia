CRIMINAL LAW CENTER GEORGIA — UPDATE

Included:
- Existing website and admin files, preserved as the base.
- Facebook sharing link and TikTok/native-share fallback.
- Admin "საიტის კონსტრუქტორი" for custom sections and content blocks.
- Public renderer for published builder sections.
- supabase-setup.sql for the two new builder tables and access policies.

IMPORTANT — one-time setup:
1. Open Supabase Dashboard for project oaphygvtdayllubygjut.
2. Go to SQL Editor and run the full supabase-setup.sql file once.
3. Confirm your admin account already exists in public.admin_users and has user_id matching auth.uid().
4. Upload all site files together. Keep the existing images/ folder and any other assets; this ZIP only contains the listed source files and does not replace your image assets.
5. Test /admin.html: sign in, open "საიტის კონსტრუქტორი", add a section, then add a block. Publish it and verify it appears on the public website.

Existing cases/news/vacancies/publications tables and their forms are retained.
Facebook: opens the Facebook share dialog with the current page URL.
TikTok: uses native device sharing where supported; otherwise copies the page URL and opens TikTok. TikTok does not provide a universal web URL endpoint that directly posts a website link.

This package has been syntax/structure checked locally, but it has not been tested against your live Supabase project. Run the SQL setup before using the new builder. Do not expose admin passwords or service-role keys.


FULL SITE CONTENT EDITOR UPDATE
- The new admin menu item is "საიტის სრული რედაქტირება". It lists tagged static text, image URLs/alt text, and link destinations.
- Run the updated full supabase-setup.sql in the existing Supabase project. It preserves existing tables and adds site_content.
- Upload all files together, including admin.css and the existing images/ folder.
- Use a local web server or the deployed website; do not open index.html via file:// because the admin editor fetches index.html.
- This editor changes text leaf nodes, image URLs/alt text and link URLs. It does not change CSS/design or arbitrary layout/HTML.
