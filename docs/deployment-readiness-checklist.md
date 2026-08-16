# Deployment Readiness Checklist

## 1. Deployment Decision Gate

### Hard Stop Rules
- If any P0 or P1 issue exists, do not deploy.
- If any critical flow fails in live smoke test, do not deploy.
- If rollback is not verified, do not deploy.
- If auth, permission, CRUD, or upload path is broken in the live host, do not deploy.

### Decision Result
- Pre-prod / staging: Conditional Go only if all checks below pass.
- Production HostingAtom: Go only after live smoke test and rollback proof are completed.

---

## 2. Pre-Deploy Technical Readiness

### Environment and Config
- Confirm .env production values are correct:
  - APP_ENV = production
  - APP_DEBUG = false
  - APP_URL
  - DB credentials
  - CACHE driver
  - QUEUE driver
  - MAIL config
  - FILESYSTEM config
- Confirm domain, SSL certificate, redirect rules, and CORS settings are valid.
- Confirm timezone and locale settings match business expectations.
- Confirm php extensions are installed and active.
- Confirm Node build toolchain is available for production asset generation.
- Confirm storage symlink exists and permissions are valid.
- Confirm writable folders have correct ownership and mode.

### Framework and Deployment Steps
- Run composer install with production dependencies only.
- Run npm install and production build.
- Run migrations only after backup and release validation.
- Clear config, route, and view cache.
- Warm cache after deployment.
- Verify app boots successfully after artifact deployment.

### Database and Migration Safety
- Backup database before migration.
- Confirm migration status matches the code release.
- Verify no destructive schema changes without explicit approval.
- Ensure rollback SQL or backup is ready before migration starts.

---

## 3. Authentication and Authorization Checks

### Required Checks
- Login works with valid credentials.
- Logout clears session and invalidates auth state.
- Reset password flow works.
- Change password works.
- Remember me behaves correctly.
- Session timeout is enforced.
- Protected routes reject unauthenticated access.
- Unauthorized users cannot hit admin or backoffice routes directly.
- Role-specific access is correct for each permission profile.

### Pass Criteria
- No access bypass.
- No route leakage to protected pages.
- No permission mismatch between roles.

---

## 4. Critical CRUD Modules

Test at least the core business modules used in production.

### Minimum Required Modules
- Members / user management
- Products
- Categories
- Brands
- Banners
- Job postings
- Job applications
- Dashboard / analytics as relevant

### For Each Module
- Create succeeds with valid data.
- Validation failure shows correct error messages.
- Read/list page loads the expected rows.
- Update persists changed data correctly.
- Delete removes the record according to the business rule.
- Search, filter, sort, and pagination work.
- Concurrency check: multiple tabs editing the same record do not corrupt state.

### Pass Criteria
- No data loss.
- No stale or inconsistent data after update.
- No incorrect soft or hard delete behavior.

---

## 5. File Upload and Media Checks

### Required Checks
- Valid file upload succeeds.
- Invalid file type is rejected.
- Oversized file is rejected with clean message.
- Replace image works without leaving stale references.
- Delete image works without broken page data.
- Preview and thumbnail render correctly.
- Thai names, long names, and spaces in file names are handled safely.
- Orphan files are not left behind after replace and delete.

### Pass Criteria
- No upload 500s.
- No broken image references.
- No orphaned files after update/delete.

---

## 6. Frontend UX and Responsive Checks

### Required Breakpoints
- 320
- 390
- 768
- 1024
- 1366
- 1920

### Required Checks
- No text overlap or clipped layout.
- No missing buttons or broken navigation.
- Loading, empty, and error states render correctly.
- Toasts and validation messages are readable.
- Thai text renders correctly without broken glyphs or missing vowels.
- Home, product, careers, about, contact pages render correctly.

### Pass Criteria
- No broken layout on key breakpoints.
- No black or blank page crash in live traffic.

---

## 7. Error and Log Review

### Required Checks
- Review application logs after deployment.
- Review queued jobs and failure logs.
- Review PHP error logs, Laravel logs, and host logs.
- Verify no repeated 500 errors in core flows.
- Verify no crash loops after first traffic wave.

### Pass Criteria
- No new P0 or P1 level errors.
- No repeated failures in the main business flow.

---

## 8. Security Baseline

### Required Checks
- CSRF protection is active.
- Important forms reject malicious payloads cleanly.
- Basic XSS payload attempts are neutralized.
- Basic SQL injection attempt pattern does not compromise the app.
- Sensitive endpoints are protected against abuse.
- Stack traces are hidden in production.
- Rate limiting is present where relevant.

### Pass Criteria
- No security regression introduced by release.

---

## 9. Background Jobs, Email, and Notifications

### Required Checks
- Queue jobs execute successfully.
- Retry and failure handling works.
- Email template renders and sends to the correct destination.
- In-app or external notifications fire only when expected.

### Pass Criteria
- No silent queue failure.
- No broken email flow for critical user actions.

---

## 10. PDF and Export Checks

Only if applicable to the live system.

### Required Checks
- Export or PDF generation succeeds.
- Data matches on-screen values.
- Page layout remains correct.
- Thai fonts render correctly.
- No broken pagination or truncated data.

### Pass Criteria
- Export matches the source data without corruption.

---

## 11. Production Smoke Test Checklist

Run this immediately after deployment and after the first traffic wave.

### Required Smoke Test
- Website loads correctly.
- Login works.
- Logout works.
- One critical CRUD create flow works.
- One critical CRUD update flow works.
- One critical CRUD delete flow works.
- One upload flow works.
- One export or PDF flow works, if applicable.
- No critical error spike in logs.
- Monitoring dashboards show normal health.

### Pass Criteria
- No P0 or P1 issues.
- No functional regressions in the main user journeys.

---

## 12. Rollback Plan

### Required before deployment
- Confirm database backup is available.
- Confirm application artifact backup is available.
- Confirm file backup is available.
- Confirm rollback command sequence is documented.
- Confirm release tag is recorded.
- Confirm the previous version is still available for redeploy.

### Rollback Trigger
- Any P0 or P1 issue after deployment.
- Critical route or auth failure.
- Data integrity issue after migration.
- Persistent production crash on main pages.

### Rollback Procedure
1. Stop traffic or enable maintenance mode if needed.
2. Restore previous app build.
3. Restore prior config values if required.
4. Restore database backup if migration caused data issue.
5. Clear cache and restart services.
6. Re-run smoke test on restored version.
7. Record cause and recovery outcome.

---

## 13. Sign-Off Matrix

### Required Sign-Offs
- Dev Lead: confirm code quality, migration safety, rollback readiness
- QA Lead: confirm smoke test result and severity classification
- Ops / Infra: confirm hosting health, service status, logs, and monitoring
- Product Owner / Business: accept risk if a Conditional Go is used

### Final Rule
- If all critical flows pass and rollback is verified, go.
- If any critical flow fails, no-go.
- If no P0 or P1 exists but there are several P2 items, conditional go only with explicit owners and ETA.

---

## 14. Release Summary Template

### Release Summary
- Version / tag:
- Date:
- Deployer:
- Backup completed:
- Migration completed:
- Smoke test result:
- Rollback tested:
- Final status: Go / Conditional Go / No-Go
- Notes:

---

## 15. Recommended Status for This Project

Current codebase status in the working environment:
- Local backend tests passed.
- Frontend build passed.
- Route smoke checks passed.

However, final HostingAtom production sign-off still requires:
- live deployment rehearsal on the actual host,
- live smoke test on the real environment,
- real rollback verification,
- monitoring and log review.

Therefore, this project is not final production Go yet. It is ready for staging / pre-prod conditional validation, and it is ready to run the live HostingAtom deployment gate with the checklist above.
