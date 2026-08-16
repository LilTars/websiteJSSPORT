# Rollback Proof Checklist

## Objective
Provide clear evidence that rollback can be executed correctly and quickly if a deployment issue is found.

## Required rollback evidence
Each rollback step must have:
- start timestamp
- command used
- expected result
- end timestamp
- final verification result
- operator name

## Rollback checklist

### 1. Backup captured before deployment
- [ ] Database backup was created before migration.
- [ ] Application build artifact was saved.
- [ ] Relevant config files were backed up.
- [ ] Storage files were backed up if required.
- [ ] Backup file names and timestamps recorded.

Evidence format:
```text
Start: 2026-08-16 10:00:00
Command: mysqldump ... > backup.sql
Expected: database backup created successfully
End: 2026-08-16 10:02:30
Result: PASS
```

### 2. Release tag or build version recorded
- [ ] Release version captured.
- [ ] Deployer recorded exact build SHA or tag.
- [ ] Previous stable version recorded.

Evidence format:
```text
Version: v2026.08.16-01
Previous stable version: v2026.08.15-07
```

### 3. Rollback trigger defined
- [ ] P0/P1 issue trigger defined.
- [ ] Critical auth issue trigger defined.
- [ ] Critical CRUD failure trigger defined.
- [ ] Data integrity trigger defined.

### 4. Rollback commands prepared and tested
Example command set:

```bash
# Restore app
cp -r /path/to/previous_release /path/to/current_release

# Restore config if needed
cp /path/to/backup/.env /path/to/current/.env

# Restore DB
mysql -u USER -p"PASSWORD" DB_NAME < /path/to/backup.sql

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
```

### 5. Rollback validation
After rollback, verify:
- [ ] Site loads.
- [ ] Login works.
- [ ] One critical CRUD operation works.
- [ ] Error log is clean for the recovered version.
- [ ] Monitoring shows recovery complete.

Evidence format:
```text
Start rollback: 2026-08-16 12:00:00
Command: mysql ... < backup.sql
Expected: previous working DB restored
End: 2026-08-16 12:03:45
Result: PASS

Validation:
- Home page HTTP 200
- Login page HTTP 200
- Product list loads
- No critical log errors
```

### 6. Rollback proof table

```text
Step | Start Time | Command | Expected Result | End Time | Result | Evidence
1 | ... | ... | ... | ... | PASS/FAIL | log/screenshot
2 | ... | ... | ... | ... | PASS/FAIL | log/screenshot
3 | ... | ... | ... | ... | PASS/FAIL | log/screenshot
4 | ... | ... | ... | ... | PASS/FAIL | log/screenshot
```

### Final rollback decision
- If rollback can be executed and validated within the agreed recovery window, rollback readiness is PASS.
- If backup is missing, commands are not tested, or verification fails, rollback readiness is FAIL.

## Final ROLLBACK READY result
- PASS only when all required evidence exists.
- FAIL if any of the following is missing:
  - backup proof
  - restore command proof
  - validation after restore proof
  - timestamp and operator record

---

## One-page sign-off template

```text
Rollback Ready: PASS / FAIL
Backup Completed: YES / NO
Previous Stable Version Known: YES / NO
Rollback Commands Tested: YES / NO
Post-rollback Smoke Test Passed: YES / NO
Operator: ______________
Approval: ______________
Date/Time: ______________
```
