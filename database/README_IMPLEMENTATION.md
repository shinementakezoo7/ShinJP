# Database Implementation Guide

## ShinJP Japanese Learning Platform - Advanced Database Setup

This guide provides step-by-step instructions for implementing the enhanced database schema and backend improvements.

---

## Prerequisites

- [x] Supabase account with project created
- [x] PostgreSQL 14+ (managed by Supabase)
- [x] Database credentials configured in `.env.local`
- [x] Basic understanding of SQL and PostgreSQL

---

## Implementation Steps

### Phase 1: Apply Core Migrations (Day 1)

#### 1.1 Review Current Database State

```bash
# Connect to your database
psql "$POSTGRES_URL"

# List all tables
\dt

# Check current migration status
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

#### 1.2 Backup Current Database

**CRITICAL: Always backup before major changes!**

```bash
# Using pg_dump
pg_dump "$POSTGRES_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use Supabase dashboard:
# 1. Go to Database > Backups
# 2. Create manual backup
# 3. Wait for completion
```

#### 1.3 Apply Migration 011

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Copy contents of `database/migrations/011_advanced_enhancements.sql`
5. Paste and click **Run**
6. Wait for completion (may take 2-5 minutes)
7. Check for errors in output

**Option B: Via psql**

```bash
psql "$POSTGRES_URL" < database/migrations/011_advanced_enhancements.sql
```

**Option C: Via Supabase CLI**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migration
supabase db push
```

#### 1.4 Verify Migration Success

```sql
-- Check new tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'notifications',
  'content_recommendations',
  'error_logs',
  'api_rate_limits',
  'content_versions',
  'user_settings',
  'learning_streaks',
  'user_activity_log'
);

-- Check new functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN (
  'calculate_fsrs_parameters',
  'generate_content_recommendations',
  'update_user_streak',
  'get_user_dashboard_data',
  'refresh_all_materialized_views',
  'cleanup_old_data',
  'database_health_check'
);

-- Check materialized views
SELECT matviewname 
FROM pg_matviews 
WHERE schemaname = 'public';
```

Expected output: 8 new tables, 7+ functions, 3+ materialized views

---

### Phase 2: Update Application Code (Day 2-3)

#### 2.1 Install Enhanced Database Client

The advanced database client is already created at:
`src/lib/database/advanced-client.ts`

#### 2.2 Update Environment Variables

Add to `.env.local` (if not already present):

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Features
ENABLE_QUERY_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true
```

#### 2.3 Replace Old Database Calls

**Before:**
```typescript
import { supabase } from '@/lib/supabase/client'

const { data, error } = await supabase
  .from('textbooks')
  .select('*')
```

**After:**
```typescript
import { db } from '@/lib/database/advanced-client'

const { data, error } = await db.authenticated
  .from('textbooks')
  .select('*')
```

#### 2.4 Use New Database Functions

```typescript
import { db } from '@/lib/database/advanced-client'

// Get user dashboard data (optimized single query)
const dashboard = await db.getUserDashboard(userId)

// Generate content recommendations
const recommendations = await db.generateRecommendations(userId, 10)

// Create notification
await db.createNotification(userId, {
  type: 'achievement',
  title: 'Achievement Unlocked!',
  message: 'You completed your first lesson!',
  priority: 'high'
})

// Full-text search
const results = await db.fullTextSearch('textbooks', 'japanese grammar', 20)

// Batch operations
await db.batchInsert('srs_cards', cards)
await db.batchUpdate('textbooks', updates)
await db.batchDelete('old_records', ids, true) // soft delete
```

---

### Phase 3: Initialize Data (Day 4)

#### 3.1 Refresh Materialized Views

```sql
SELECT refresh_all_materialized_views();
```

#### 3.2 Initialize User Settings for Existing Users

```sql
INSERT INTO user_settings (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_settings);
```

#### 3.3 Initialize Learning Streaks

```sql
INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_start_date)
SELECT 
  id,
  study_streak,
  longest_streak,
  CURRENT_DATE,
  CURRENT_DATE
FROM users
WHERE id NOT IN (SELECT user_id FROM learning_streaks);
```

---

### Phase 4: Setup Scheduled Jobs (Day 5)

#### 4.1 Using Supabase Cron (Recommended)

Go to **Database > Functions** in Supabase Dashboard

**Job 1: Refresh Materialized Views (Every hour)**
```sql
SELECT cron.schedule(
  'refresh-materialized-views',
  '0 * * * *',  -- Every hour
  $$SELECT refresh_all_materialized_views()$$
);
```

**Job 2: Cleanup Old Data (Daily at 2 AM)**
```sql
SELECT cron.schedule(
  'cleanup-old-data',
  '0 2 * * *',  -- Daily at 2 AM
  $$SELECT cleanup_old_data()$$
);
```

**Job 3: Database Health Check (Every 6 hours)**
```sql
SELECT cron.schedule(
  'health-check',
  '0 */6 * * *',  -- Every 6 hours
  $$
  INSERT INTO error_logs (error_type, error_message, severity, metadata)
  SELECT 
    'health_check',
    check_name || ': ' || details,
    CASE status 
      WHEN 'WARNING' THEN 'warning'
      WHEN 'ERROR' THEN 'error'
      ELSE 'info'
    END,
    json_build_object('status', status)
  FROM database_health_check()
  WHERE status IN ('WARNING', 'ERROR')
  $$
);
```

#### 4.2 View Scheduled Jobs

```sql
SELECT * FROM cron.job;
```

---

### Phase 5: Setup Real-Time Subscriptions (Day 6)

#### 5.1 Enable Real-Time in Supabase

Go to **Database > Replication** in Supabase Dashboard

Enable replication for:
- notifications
- content_recommendations
- learning_streaks
- conversations

#### 5.2 Subscribe to Changes in Frontend

```typescript
import { useEffect } from 'react'
import { db } from '@/lib/database/advanced-client'

export function useNotifications(userId: string) {
  useEffect(() => {
    const subscription = db.authenticated
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification:', payload.new)
          // Handle new notification (show toast, update UI, etc.)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])
}
```

---

### Phase 6: Performance Monitoring (Day 7)

#### 6.1 Setup Query Monitoring

```typescript
import { db } from '@/lib/database/advanced-client'

// Get performance metrics
const metrics = db.getPerformanceMetrics()

console.log('Database Performance:', {
  averageDuration: metrics.averageDuration,
  successRate: metrics.successRate,
  slowQueries: metrics.slowQueries.length,
  totalQueries: metrics.totalQueries,
})
```

#### 6.2 Monitor Slow Queries

```sql
-- Enable pg_stat_statements (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slowest queries
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

#### 6.3 Monitor Table Sizes

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;
```

---

## Testing

### 1. Test New Functions

```sql
-- Test user dashboard
SELECT get_user_dashboard_data('your-user-uuid');

-- Test recommendations
SELECT * FROM generate_content_recommendations('your-user-uuid', 5);

-- Test streak update
SELECT update_user_streak('your-user-uuid');

-- Test health check
SELECT * FROM database_health_check();
```

### 2. Test New Tables

```sql
-- Create test notification
INSERT INTO notifications (user_id, type, title, message)
VALUES ('your-user-uuid', 'test', 'Test Notification', 'This is a test');

-- Create test recommendation
INSERT INTO content_recommendations (user_id, content_type, content_id, score, reason_type)
VALUES ('your-user-uuid', 'textbook', 'some-uuid', 0.85, 'personalized');

-- Query test data
SELECT * FROM notifications WHERE user_id = 'your-user-uuid';
SELECT * FROM content_recommendations WHERE user_id = 'your-user-uuid';
```

### 3. Test Full-Text Search

```sql
-- Test textbook search
SELECT title, description 
FROM textbooks 
WHERE search_vector @@ to_tsquery('english', 'japanese & grammar')
LIMIT 5;
```

---

## Rollback Plan

If something goes wrong, you can rollback:

### Option 1: Restore from Backup

```bash
# Restore from backup
psql "$POSTGRES_URL" < backup_20250109_120000.sql
```

### Option 2: Drop New Tables

```sql
-- CAUTION: This will delete all data in new tables!
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS content_recommendations CASCADE;
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS api_rate_limits CASCADE;
DROP TABLE IF EXISTS content_versions CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS learning_streaks CASCADE;
DROP TABLE IF EXISTS user_activity_log CASCADE;

-- Drop new functions
DROP FUNCTION IF EXISTS calculate_fsrs_parameters CASCADE;
DROP FUNCTION IF EXISTS generate_content_recommendations CASCADE;
DROP FUNCTION IF EXISTS update_user_streak CASCADE;
DROP FUNCTION IF EXISTS get_user_dashboard_data CASCADE;
-- ... etc
```

---

## Performance Tuning

### 1. Analyze and Vacuum

Run regularly to maintain performance:

```sql
-- Analyze all tables
ANALYZE;

-- Vacuum and analyze
VACUUM ANALYZE;

-- For specific tables
VACUUM ANALYZE textbooks;
VACUUM ANALYZE srs_cards;
```

### 2. Reindex

If queries become slow:

```sql
-- Reindex all
REINDEX DATABASE postgres;

-- Or specific tables
REINDEX TABLE textbooks;
REINDEX TABLE srs_cards;
```

### 3. Update Statistics

```sql
-- Update table statistics
ANALYZE users;
ANALYZE textbooks;
ANALYZE srs_cards;
```

---

## Monitoring Dashboard Queries

### Query 1: Database Overview

```sql
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM textbooks WHERE deleted_at IS NULL) as total_textbooks,
  (SELECT COUNT(*) FROM srs_cards WHERE deleted_at IS NULL) as total_srs_cards,
  (SELECT COUNT(*) FROM notifications WHERE read_at IS NULL) as unread_notifications,
  (SELECT COUNT(*) FROM error_logs WHERE resolved_at IS NULL) as unresolved_errors;
```

### Query 2: Active Users

```sql
SELECT 
  date_trunc('day', last_active_at) as date,
  COUNT(*) as active_users
FROM users
WHERE last_active_at >= NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;
```

### Query 3: Popular Content

```sql
SELECT * FROM mv_popular_content
ORDER BY active_learners DESC
LIMIT 10;
```

### Query 4: System Health

```sql
SELECT * FROM database_health_check();
```

---

## Troubleshooting

### Issue: Migration Fails

**Solution:**
1. Check Supabase logs for specific error
2. Ensure no active connections blocking migration
3. Try running migration in smaller parts
4. Contact support if persistent

### Issue: Slow Queries

**Solution:**
1. Run `ANALYZE` on affected tables
2. Check if indexes exist
3. Review query execution plan with `EXPLAIN ANALYZE`
4. Consider adding more specific indexes

### Issue: High Memory Usage

**Solution:**
1. Run `VACUUM FULL` to reclaim space
2. Drop unused indexes
3. Archive old data
4. Upgrade Supabase plan if needed

---

## Maintenance Schedule

### Daily
- [x] Monitor error logs
- [x] Check for slow queries
- [x] Review notification delivery

### Weekly
- [x] Run `VACUUM ANALYZE`
- [x] Review performance metrics
- [x] Check table sizes
- [x] Archive old data (automatic via cron)

### Monthly
- [x] Full database backup (in addition to automatic)
- [x] Review and optimize indexes
- [x] Update statistics
- [x] Performance audit

---

## Next Steps

1. ✅ Migration applied successfully
2. ✅ Application code updated
3. ✅ Scheduled jobs configured
4. ✅ Real-time subscriptions enabled
5. ✅ Monitoring in place

**You're ready to use the enhanced database!**

---

## Support

If you encounter issues:

1. Check Supabase logs: https://supabase.com/dashboard/project/YOUR_PROJECT/logs
2. Review migration file: `database/migrations/011_advanced_enhancements.sql`
3. Check documentation: `docs/DATABASE_ANALYSIS_AND_ENHANCEMENTS.md`
4. Review advanced client: `src/lib/database/advanced-client.ts`

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Best Practices](https://supabase.com/docs/guides/database/database-best-practices)
- [Performance Tuning](https://supabase.com/docs/guides/platform/performance)

