-- =====================================================
-- DATABASE MONITORING QUERIES
-- For ShinJP Japanese Learning Platform
-- Run these periodically to monitor database health
-- =====================================================

-- =====================================================
-- 1. DATABASE OVERVIEW
-- =====================================================

SELECT 
    'DATABASE OVERVIEW' as section,
    'Metric' as metric,
    'Value' as value
UNION ALL
SELECT 
    NULL,
    'Database Size',
    pg_size_pretty(pg_database_size(current_database()))
UNION ALL
SELECT 
    NULL,
    'Total Tables',
    COUNT(*)::text
FROM pg_tables
WHERE schemaname = 'public'
UNION ALL
SELECT 
    NULL,
    'Total Indexes',
    COUNT(*)::text
FROM pg_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
    NULL,
    'Total Functions',
    COUNT(*)::text
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';

-- =====================================================
-- 2. TABLE SIZES
-- =====================================================

SELECT 
    'TABLE SIZES (Top 10)' as section,
    NULL::text as table_name,
    NULL::text as row_count,
    NULL::text as total_size,
    NULL::text as table_size,
    NULL::text as indexes_size
UNION ALL
SELECT 
    NULL,
    schemaname || '.' || tablename as table_name,
    n_live_tup::text as row_count,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables t
JOIN pg_stat_user_tables s ON t.tablename = s.relname
WHERE t.schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 11;

-- =====================================================
-- 3. INDEX USAGE STATISTICS
-- =====================================================

SELECT 
    'INDEX USAGE (Top 20)' as section,
    NULL::text as table_name,
    NULL::text as index_name,
    NULL::bigint as scans,
    NULL::bigint as tuples_read,
    NULL::text as size
UNION ALL
SELECT 
    NULL,
    schemaname || '.' || tablename,
    indexrelname,
    idx_scan,
    idx_tup_read,
    pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 21;

-- =====================================================
-- 4. UNUSED INDEXES (Candidates for removal)
-- =====================================================

SELECT 
    'UNUSED INDEXES' as section,
    NULL::text as table_name,
    NULL::text as index_name,
    NULL::text as size,
    NULL::text as scans
UNION ALL
SELECT 
    NULL,
    schemaname || '.' || tablename,
    indexrelname,
    pg_size_pretty(pg_relation_size(indexrelid)),
    idx_scan::text
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
AND idx_scan = 0
AND indexrelname NOT LIKE '%_pkey'  -- Don't include primary keys
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 11;

-- =====================================================
-- 5. SLOW QUERIES (Requires pg_stat_statements)
-- =====================================================

SELECT 
    'SLOW QUERIES (Top 10)' as section,
    NULL::text as avg_time,
    NULL::bigint as calls,
    NULL::text as total_time,
    NULL::text as query_preview
UNION ALL
SELECT 
    NULL,
    ROUND(mean_exec_time::numeric, 2)::text || ' ms',
    calls,
    ROUND(total_exec_time::numeric, 2)::text || ' ms',
    LEFT(query, 100) || '...'
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
AND query NOT LIKE '%pg_catalog%'
ORDER BY mean_exec_time DESC
LIMIT 11;

-- =====================================================
-- 6. CACHE HIT RATIO (Should be > 90%)
-- =====================================================

SELECT 
    'CACHE HIT RATIO' as section,
    NULL::text as type,
    NULL::numeric as ratio,
    NULL::text as status
UNION ALL
SELECT 
    NULL,
    'Table Cache',
    ROUND(
        100.0 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit + heap_blks_read), 0),
        2
    ),
    CASE 
        WHEN ROUND(100.0 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit + heap_blks_read), 0), 2) > 90 THEN '✅ Good'
        WHEN ROUND(100.0 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit + heap_blks_read), 0), 2) > 80 THEN '⚠️ Fair'
        ELSE '❌ Poor'
    END
FROM pg_statio_user_tables
UNION ALL
SELECT 
    NULL,
    'Index Cache',
    ROUND(
        100.0 * sum(idx_blks_hit) / NULLIF(sum(idx_blks_hit + idx_blks_read), 0),
        2
    ),
    CASE 
        WHEN ROUND(100.0 * sum(idx_blks_hit) / NULLIF(sum(idx_blks_hit + idx_blks_read), 0), 2) > 90 THEN '✅ Good'
        WHEN ROUND(100.0 * sum(idx_blks_hit) / NULLIF(sum(idx_blks_hit + idx_blks_read), 0), 2) > 80 THEN '⚠️ Fair'
        ELSE '❌ Poor'
    END
FROM pg_statio_user_indexes;

-- =====================================================
-- 7. TABLE BLOAT ESTIMATION
-- =====================================================

WITH bloat_data AS (
  SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size,
    n_dead_tup,
    n_live_tup,
    ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as bloat_pct
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
)
SELECT 
    'TABLE BLOAT' as section,
    NULL::text as table_name,
    NULL::text as size,
    NULL::bigint as dead_tuples,
    NULL::numeric as bloat_percent,
    NULL::text as status
UNION ALL
SELECT 
    NULL,
    schemaname || '.' || tablename,
    size,
    n_dead_tup,
    bloat_pct,
    CASE 
        WHEN bloat_pct > 20 THEN '❌ Needs VACUUM'
        WHEN bloat_pct > 10 THEN '⚠️ Consider VACUUM'
        ELSE '✅ OK'
    END
FROM bloat_data
WHERE bloat_pct > 5
ORDER BY bloat_pct DESC
LIMIT 11;

-- =====================================================
-- 8. ACTIVE CONNECTIONS
-- =====================================================

SELECT 
    'ACTIVE CONNECTIONS' as section,
    NULL::text as state,
    NULL::bigint as count
UNION ALL
SELECT 
    NULL,
    state,
    COUNT(*)
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state
ORDER BY count DESC;

-- =====================================================
-- 9. LONG RUNNING QUERIES
-- =====================================================

SELECT 
    'LONG RUNNING QUERIES' as section,
    NULL::text as pid,
    NULL::text as duration,
    NULL::text as state,
    NULL::text as query_preview
UNION ALL
SELECT 
    NULL,
    pid::text,
    now() - query_start as duration,
    state,
    LEFT(query, 100) || '...'
FROM pg_stat_activity
WHERE state != 'idle'
AND datname = current_database()
AND now() - query_start > interval '1 minute'
ORDER BY query_start
LIMIT 11;

-- =====================================================
-- 10. LOCKS
-- =====================================================

SELECT 
    'CURRENT LOCKS' as section,
    NULL::text as lock_type,
    NULL::text as relation,
    NULL::text as mode,
    NULL::text as granted
UNION ALL
SELECT 
    NULL,
    locktype,
    relation::regclass::text,
    mode,
    granted::text
FROM pg_locks
WHERE NOT granted
LIMIT 11;

-- =====================================================
-- 11. RECENT ERRORS (From error_logs table)
-- =====================================================

SELECT 
    'RECENT ERRORS (Last 24h)' as section,
    NULL::text as occurred_at,
    NULL::text as error_type,
    NULL::text as severity,
    NULL::text as message_preview
UNION ALL
SELECT 
    NULL,
    occurred_at::text,
    error_type,
    severity,
    LEFT(error_message, 80) || '...'
FROM error_logs
WHERE occurred_at > NOW() - INTERVAL '24 hours'
ORDER BY occurred_at DESC
LIMIT 11;

-- =====================================================
-- 12. MATERIALIZED VIEW FRESHNESS
-- =====================================================

SELECT 
    'MATERIALIZED VIEWS' as section,
    NULL::text as view_name,
    NULL::text as definition_length,
    NULL::text as indexes
UNION ALL
SELECT 
    NULL,
    matviewname,
    LENGTH(definition)::text || ' chars',
    (SELECT COUNT(*)::text FROM pg_indexes WHERE tablename = matviewname)
FROM pg_matviews
WHERE schemaname = 'public';

-- =====================================================
-- 13. RLS POLICY STATUS
-- =====================================================

SELECT 
    'RLS POLICIES' as section,
    NULL::text as table_name,
    NULL::text as policy_count,
    NULL::text as rls_enabled
UNION ALL
SELECT 
    NULL,
    tablename,
    (SELECT COUNT(*)::text FROM pg_policies WHERE tablename = t.tablename),
    CASE 
        WHEN c.relrowsecurity THEN '✅ Enabled'
        ELSE '❌ Disabled'
    END
FROM pg_tables t
LEFT JOIN pg_class c ON t.tablename = c.relname
WHERE t.schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- 14. USER STATISTICS
-- =====================================================

SELECT 
    'USER STATISTICS' as section,
    NULL::text as metric,
    NULL::text as value
UNION ALL
SELECT 
    NULL,
    'Total Users',
    COUNT(*)::text
FROM users
UNION ALL
SELECT 
    NULL,
    'Active Users (7d)',
    COUNT(*)::text
FROM users
WHERE last_active_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
    NULL,
    'Active Users (30d)',
    COUNT(*)::text
FROM users
WHERE last_active_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
    NULL,
    'New Users (7d)',
    COUNT(*)::text
FROM users
WHERE created_at > NOW() - INTERVAL '7 days';

-- =====================================================
-- 15. CONTENT STATISTICS
-- =====================================================

SELECT 
    'CONTENT STATISTICS' as section,
    NULL::text as content_type,
    NULL::text as total,
    NULL::text as active
UNION ALL
SELECT 
    NULL,
    'Textbooks',
    COUNT(*)::text,
    COUNT(*) FILTER (WHERE deleted_at IS NULL)::text
FROM textbooks
UNION ALL
SELECT 
    NULL,
    'Lessons',
    COUNT(*)::text,
    COUNT(*) FILTER (WHERE deleted_at IS NULL)::text
FROM lessons
UNION ALL
SELECT 
    NULL,
    'SRS Cards',
    COUNT(*)::text,
    COUNT(*) FILTER (WHERE deleted_at IS NULL)::text
FROM srs_cards
UNION ALL
SELECT 
    NULL,
    'Study Sessions',
    COUNT(*)::text,
    COUNT(*) FILTER (WHERE start_time > NOW() - INTERVAL '30 days')::text
FROM study_sessions;

-- =====================================================
-- 16. NOTIFICATION STATISTICS
-- =====================================================

SELECT 
    'NOTIFICATIONS' as section,
    NULL::text as metric,
    NULL::text as count
UNION ALL
SELECT 
    NULL,
    'Total Unread',
    COUNT(*)::text
FROM notifications
WHERE read_at IS NULL
UNION ALL
SELECT 
    NULL,
    'Sent Today',
    COUNT(*)::text
FROM notifications
WHERE created_at::date = CURRENT_DATE
UNION ALL
SELECT 
    NULL,
    'Expired',
    COUNT(*)::text
FROM notifications
WHERE expires_at < NOW();

-- =====================================================
-- 17. RECOMMENDATIONS STATISTICS
-- =====================================================

SELECT 
    'RECOMMENDATIONS' as section,
    NULL::text as metric,
    NULL::text as count
UNION ALL
SELECT 
    NULL,
    'Active Recommendations',
    COUNT(*)::text
FROM content_recommendations
WHERE dismissed_at IS NULL
AND expires_at > NOW()
UNION ALL
SELECT 
    NULL,
    'Clicked Today',
    COUNT(*)::text
FROM content_recommendations
WHERE clicked_at::date = CURRENT_DATE;

-- =====================================================
-- 18. AUTOVACUUM STATUS
-- =====================================================

SELECT 
    'AUTOVACUUM STATUS' as section,
    NULL::text as table_name,
    NULL::text as last_vacuum,
    NULL::text as last_autovacuum,
    NULL::text as vacuum_count,
    NULL::text as autovacuum_count
UNION ALL
SELECT 
    NULL,
    schemaname || '.' || relname,
    last_vacuum::text,
    last_autovacuum::text,
    vacuum_count::text,
    autovacuum_count::text
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY last_autovacuum DESC NULLS LAST
LIMIT 11;

-- =====================================================
-- 19. DISK SPACE WARNING
-- =====================================================

SELECT 
    'DISK SPACE' as section,
    NULL::text as component,
    NULL::text as size,
    NULL::text as status
UNION ALL
SELECT 
    NULL,
    'Database Total',
    pg_size_pretty(pg_database_size(current_database())),
    CASE 
        WHEN pg_database_size(current_database()) > 10737418240 THEN '⚠️ > 10GB'  -- 10GB
        WHEN pg_database_size(current_database()) > 5368709120 THEN '✅ > 5GB'   -- 5GB
        ELSE '✅ < 5GB'
    END
UNION ALL
SELECT 
    NULL,
    'Largest Table',
    pg_size_pretty(MAX(pg_total_relation_size(schemaname||'.'||tablename))),
    NULL
FROM pg_tables
WHERE schemaname = 'public';

-- =====================================================
-- 20. HEALTH CHECK SUMMARY
-- =====================================================

SELECT 
    '=== HEALTH CHECK SUMMARY ===' as section,
    NULL::text as check_name,
    NULL::text as status,
    NULL::text as details
UNION ALL
SELECT 
    NULL,
    check_name,
    status,
    details
FROM database_health_check()
UNION ALL
SELECT 
    '=============================',
    NULL,
    NULL,
    NULL;

-- =====================================================
-- END OF MONITORING QUERIES
-- =====================================================

-- For continuous monitoring, consider running these queries:
-- 1. Every hour: Cache hit ratio, active connections
-- 2. Every day: Table sizes, index usage, slow queries
-- 3. Every week: Bloat estimation, unused indexes
-- 4. Every month: Full analysis and optimization

-- Save results to a monitoring table for trend analysis:
-- CREATE TABLE monitoring_results (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     metric_name TEXT,
--     metric_value JSONB,
--     measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
