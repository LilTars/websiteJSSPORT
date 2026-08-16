# HostingAtom Live Smoke Test Script

## Purpose
This is the deployment-day smoke test for the production host. It is designed to validate the critical flows before final GO.

## Strict decision rule
- If any critical flow fails, result = NO-GO.
- If rollback proof is incomplete, result = NO-GO.
- If all critical flows pass and rollback test passes, result = GO.

## Required environment variables
Set these before running the checks:

```bash
export BASE_URL="https://your-domain.com"
export ADMIN_EMAIL="admin@yourdomain.com"
export ADMIN_PASSWORD="your-password"
export TEST_PRODUCT_NAME="Smoke Test Product"
export TEST_PRODUCT_UPDATE_NAME="Smoke Test Product Updated"
```

## Step 1 — Pre-flight checks
Run:

```bash
curl -I "$BASE_URL" -sS -o /tmp/home_headers.txt -w "HTTP %{http_code}\n"
curl -I "$BASE_URL/login" -sS -o /tmp/login_headers.txt -w "HTTP %{http_code}\n"
curl -I "$BASE_URL/products" -sS -o /tmp/products_headers.txt -w "HTTP %{http_code}\n"
```

Expected result:
- Home page returns HTTP 200.
- Login page returns HTTP 200.
- Products page returns HTTP 200.

Evidence to record:
- Timestamp.
- Command output.
- Screenshot of homepage and login page.

---

## Step 2 — Authentication smoke test
Run:

```bash
curl -c /tmp/hostingatom_cookies.txt -sS -L "$BASE_URL/login" -o /tmp/login_page.html
# If CSRF token exists in login page, extract it and post login form
# Example pattern:
CSRF_TOKEN=$(grep -o 'name="_token" value="[^"]*"' /tmp/login_page.html | head -1 | sed 's/.*value="\([^"]*\)"/\1/')

curl -b /tmp/hostingatom_cookies.txt -c /tmp/hostingatom_cookies.txt \
  -X POST "$BASE_URL/login" \
  -d "_token=$CSRF_TOKEN&email=$ADMIN_EMAIL&password=$ADMIN_PASSWORD&_method=POST" \
  -sS -D /tmp/login_response_headers.txt -o /tmp/login_result.html

curl -b /tmp/hostingatom_cookies.txt -sS -L "$BASE_URL" -o /tmp/after_login_home.html
```

Expected result:
- Login succeeds.
- Redirect lands on a valid authenticated page.
- No 500 or login loop.

Evidence to record:
- Response headers.
- Result page content.
- Screenshot after login.

---

## Step 3 — RBAC / permission smoke test
Open the following URLs with the admin session and a non-admin session if available:

```bash
curl -b /tmp/hostingatom_cookies.txt -I "$BASE_URL/{team-slug}/backoffice/members" -sS
curl -b /tmp/hostingatom_cookies.txt -I "$BASE_URL/{team-slug}/backoffice/products" -sS
curl -b /tmp/hostingatom_cookies.txt -I "$BASE_URL/{team-slug}/backoffice/job-postings" -sS
```

Expected result:
- Admin can access protected pages.
- Unauthorized user is redirected or denied.
- No route bypass.

Evidence to record:
- HTTP status for each route.
- Screenshot of allowed and denied views.

---

## Step 4 — Critical CRUD smoke test (Products)
### Create
```bash
curl -b /tmp/hostingatom_cookies.txt -sS -L "$BASE_URL/{team-slug}/backoffice/products" -o /tmp/products_index.html
# Use the UI or correct API route to create the product.
# Capture the create form submission result and response status.
```

Expected result:
- Product is created successfully.
- Validation passes for required fields.

### Update
Edit the created product and change its name.

```bash
curl -b /tmp/hostingatom_cookies.txt -sS -L "$BASE_URL/{team-slug}/backoffice/products" -o /tmp/products_index_after_create.html
```

Expected result:
- Updated values persist.
- No stale or duplicate record.

### Delete
Delete the created product.

Expected result:
- The record disappears from the list.
- No broken page after delete.

Evidence to record:
- Screenshot before/after create + update + delete.
- Server response headers.
- Log snippet showing no error.

---

## Step 5 — File upload smoke test
Upload a valid image and then replace/delete it.

```bash
# Example command pattern
# curl -b /tmp/hostingatom_cookies.txt -F "image=@/path/to/test-image.jpg" "$BASE_URL/{team-slug}/backoffice/products"
```

Expected result:
- Valid upload succeeds.
- Invalid upload is rejected.
- Replaced file is referenced correctly.
- Deleted file is removed from filesystem and DB reference.

Evidence to record:
- Upload success response.
- Screenshot of preview/thumbnail.
- File path in storage after delete.

---

## Step 6 — Dialog / PDF / export smoke test (if applicable)
If the production system includes dialogs or export functions, run one case.

Examples:
- Careers contact dialog opens and links to valid channels.
- PDF export generates successfully.
- Download file contains the correct page data.

Expected result:
- No script error.
- No blank frame.
- Export file is downloadable and non-empty.

---

## Step 7 — Production error log review
Run:

```bash
# Example depending on host log location
# tail -n 200 /path/to/laravel.log
# tail -n 200 /var/log/nginx/error.log
# tail -n 200 /var/log/php-fpm/error.log
```

Expected result:
- No new critical exception in the first 15–30 minutes after deployment.
- No repeated 500s in protected routes.

Evidence to record:
- Log snippet showing no critical exception.
- Error count summary.

---

## Step 8 — Final sign-off decision
Use the result sheet below:

- If all critical flows pass and rollback test passes => GO
- If any critical flow fails or rollback proof is incomplete => NO-GO

---

## Result sheet template

```text
Date:
Deploy version:
Environment: HostingAtom production

Flow | Result | Evidence | Notes
Authentication | PASS/FAIL | screenshot + headers | ...
RBAC | PASS/FAIL | screenshot + status | ...
CRUD - Create | PASS/FAIL | screenshot + response | ...
CRUD - Update | PASS/FAIL | screenshot + response | ...
CRUD - Delete | PASS/FAIL | screenshot + response | ...
File Upload | PASS/FAIL | screenshot + storage path | ...
Dialog / Print / PDF | PASS/FAIL | screenshot / file | ...
Logs | PASS/FAIL | log snippet | ...
Rollback Proof | PASS/FAIL | command + timestamp + result | ...
Final Decision | GO / NO-GO | based on above | ...
```
