# Page Visitor Metric Definition

## Source of truth

- Table: `click_events`
- Fields used: `event_type`, `page_key`, `user_id`, `session_id`, `created_at`
- Time window: last 30 days, from `created_at >= now()->subDays(30)->startOfDay()`
- Event type: `page_view`
- Page keys: `home`, `products`, `about`, `careers`, `contact`

## Visitor definition

A page visitor is counted as a unique person/session per page within the 30-day window.

Rule:
- Count distinct identity = `CASE WHEN user_id IS NOT NULL THEN CONCAT('user:', user_id) ELSE session_id END`
- This means:
  - authenticated user with a real `user_id` is counted once for that page per user
  - anonymous session with a real `session_id` is counted once for that page per session
  - repeated visits in the same session to the same page do not increase the count
  - when both `user_id` and `session_id` are present, the authenticated user identity wins and the session identity is not double-counted
- Different sessions/users for the same page are counted separately

This is intentionally chosen to avoid double-counting the same visitor while still reflecting real system usage.

## Page mapping

| Route | page_key | stored event | dashboard field |
| --- | --- | --- | --- |
| `/` | `home` | `page_view` | `pageVisitors.series[0].value` |
| `/products` | `products` | `page_view` | `pageVisitors.series[1].value` |
| `/about` | `about` | `page_view` | `pageVisitors.series[2].value` |
| `/careers` | `careers` | `page_view` | `pageVisitors.series[3].value` |
| `/contact` | `contact` | `page_view` | `pageVisitors.series[4].value` |

## Aggregation rule

```
SELECT page_key,
       COUNT(DISTINCT CASE
           WHEN user_id IS NOT NULL THEN CONCAT('user:', user_id)
           ELSE session_id
       END) AS total
FROM click_events
WHERE event_type = 'page_view'
  AND created_at >= NOW() - INTERVAL 30 DAY
GROUP BY page_key;
```

## Data contract

- `0` means the page truly has zero unique visitors during the window.
- `null` / no data is reserved for missing source tables or no tracking data at all.
- Dashboard renders the empty state only when the source table is absent or no page_view records exist.
