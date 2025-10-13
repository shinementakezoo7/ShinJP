-- =====================================================
-- QUICK START: Advanced Database Setup
-- Run this after migration 011 to verify and initialize
-- =====================================================

-- =====================================================
-- STEP 1: VERIFICATION
-- Check that all new tables and functions exist
-- =====================================================

DO $$
DECLARE
    v_table_count INTEGER;
    v_function_count INTEGER;
    v_matview_count INTEGER;
BEGIN
    RAISE NOTICE '=== VERIFICATION STARTED ===';
    
    -- Check tables
    SELECT COUNT(*) INTO v_table_count
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
    
    RAISE NOTICE 'New tables found: %/8', v_table_count;
    
    -- Check functions
    SELECT COUNT(*) INTO v_function_count
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
    
    RAISE NOTICE 'New functions found: %/7', v_function_count;
    
    -- Check materialized views
    SELECT COUNT(*) INTO v_matview_count
    FROM pg_matviews 
    WHERE schemaname = 'public'
    AND matviewname IN (
        'mv_popular_content',
        'mv_learning_progress_summary',
        'mv_content_quality_metrics'
    );
    
    RAISE NOTICE 'New materialized views found: %/3', v_matview_count;
    
    IF v_table_count = 8 AND v_function_count >= 7 AND v_matview_count >= 3 THEN
        RAISE NOTICE '✅ All components verified successfully!';
    ELSE
        RAISE WARNING '⚠️ Some components are missing. Please review migration 011.';
    END IF;
    
    RAISE NOTICE '=== VERIFICATION COMPLETE ===';
END $$;

-- =====================================================
-- STEP 2: INITIALIZE USER SETTINGS FOR EXISTING USERS
-- =====================================================

INSERT INTO user_settings (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_settings)
ON CONFLICT (user_id) DO NOTHING;

SELECT 'Initialized user settings for ' || COUNT(*) || ' users' as message
FROM user_settings;

-- =====================================================
-- STEP 3: INITIALIZE LEARNING STREAKS
-- =====================================================

INSERT INTO learning_streaks (
    user_id, 
    current_streak, 
    longest_streak, 
    last_activity_date, 
    streak_start_date,
    total_days_active
)
SELECT 
    id,
    COALESCE(study_streak, 0),
    COALESCE(longest_streak, 0),
    COALESCE(last_active_at::date, CURRENT_DATE),
    CURRENT_DATE,
    COALESCE(study_streak, 0)
FROM users
WHERE id NOT IN (SELECT user_id FROM learning_streaks)
ON CONFLICT (user_id) DO NOTHING;

SELECT 'Initialized learning streaks for ' || COUNT(*) || ' users' as message
FROM learning_streaks;

-- =====================================================
-- STEP 4: REFRESH MATERIALIZED VIEWS
-- =====================================================

SELECT refresh_all_materialized_views();

SELECT 'Materialized views refreshed successfully' as message;

-- =====================================================
-- STEP 5: DATABASE HEALTH CHECK
-- =====================================================

SELECT 
    '=== DATABASE HEALTH CHECK ===' as section,
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
    '=========================',
    NULL,
    NULL,
    NULL;

-- =====================================================
-- STEP 6: INDEX HEALTH CHECK
-- =====================================================

SELECT 
    'Index Health: ' || 
    CASE 
        WHEN COUNT(*) > 50 THEN 'Excellent'
        WHEN COUNT(*) > 30 THEN 'Good'
        WHEN COUNT(*) > 20 THEN 'Fair'
        ELSE 'Needs Improvement'
    END as message,
    COUNT(*) as total_indexes
FROM pg_indexes
WHERE schemaname = 'public';

-- =====================================================
-- STEP 7: TABLE SIZE REPORT
-- =====================================================

SELECT 
    '=== TOP 10 LARGEST TABLES ===' as report_section,
    NULL::text as table_name,
    NULL::text as total_size,
    NULL::numeric as row_count
UNION ALL
SELECT 
    NULL,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)),
    (SELECT COUNT(*) FROM (SELECT 1 FROM only public.textbooks LIMIT 1000000) t) -- Approximate
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 11;

-- =====================================================
-- STEP 8: RLS POLICY CHECK
-- =====================================================

SELECT 
    'RLS Policies: ' || COUNT(*) || ' policies active' as message
FROM pg_policies
WHERE schemaname = 'public';

SELECT 
    'Tables with RLS enabled: ' || COUNT(*) || ' tables' as message
FROM pg_tables t
JOIN pg_class c ON t.tablename = c.relname
WHERE t.schemaname = 'public'
AND c.relrowsecurity = true;

-- =====================================================
-- STEP 9: CREATE SAMPLE NOTIFICATION (OPTIONAL)
-- =====================================================

-- Uncomment to create test notifications
/*
INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    priority,
    data
)
SELECT 
    id,
    'system',
    'Database Enhanced! 🎉',
    'Your database has been upgraded with advanced features including notifications, recommendations, and performance optimizations.',
    'normal',
    json_build_object(
        'features', ARRAY[
            'Real-time notifications',
            'Content recommendations', 
            'Performance monitoring',
            'Advanced search',
            'Learning streaks'
        ]
    )
FROM users
LIMIT 5;  -- Only for first 5 users as a test

SELECT 'Created ' || COUNT(*) || ' test notifications' as message
FROM notifications
WHERE type = 'system' AND title LIKE '%Enhanced%';
*/

-- =====================================================
-- STEP 10: SETUP RECOMMENDED CRON JOBS
-- Instructions (run these separately via Supabase dashboard)
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== RECOMMENDED CRON JOBS ===';
    RAISE NOTICE 'Run these in Supabase Dashboard > Database > Functions:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Refresh Materialized Views (hourly):';
    RAISE NOTICE '   SELECT cron.schedule(''refresh-views'', ''0 * * * *'', $$SELECT refresh_all_materialized_views()$$);';
    RAISE NOTICE '';
    RAISE NOTICE '2. Cleanup Old Data (daily at 2 AM):';
    RAISE NOTICE '   SELECT cron.schedule(''cleanup'', ''0 2 * * *'', $$SELECT cleanup_old_data()$$);';
    RAISE NOTICE '';
    RAISE NOTICE '3. Health Check (every 6 hours):';
    RAISE NOTICE '   Run: SELECT * FROM database_health_check();';
    RAISE NOTICE '';
    RAISE NOTICE '===============================';
END $$;

-- =====================================================
-- STEP 11: PERFORMANCE BASELINE
-- =====================================================

SELECT 
    '=== PERFORMANCE BASELINE ===' as section,
    NULL::text as metric,
    NULL::text as value
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
WHERE n.nspname = 'public'
UNION ALL
SELECT 
    NULL,
    'Total Materialized Views',
    COUNT(*)::text
FROM pg_matviews
WHERE schemaname = 'public'
UNION ALL
SELECT 
    NULL,
    'Database Size',
    pg_size_pretty(pg_database_size(current_database()))
UNION ALL
SELECT 
    '============================',
    NULL,
    NULL;

-- =====================================================
-- STEP 12: USEFUL QUERY SAMPLES
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== USEFUL QUERIES ===';
    RAISE NOTICE '';
    RAISE NOTICE '1. View Popular Content:';
    RAISE NOTICE '   SELECT * FROM mv_popular_content ORDER BY active_learners DESC LIMIT 10;';
    RAISE NOTICE '';
    RAISE NOTICE '2. Check User Progress:';
    RAISE NOTICE '   SELECT * FROM mv_learning_progress_summary WHERE user_id = ''YOUR_UUID'';';
    RAISE NOTICE '';
    RAISE NOTICE '3. Get User Dashboard:';
    RAISE NOTICE '   SELECT get_user_dashboard_data(''YOUR_UUID'');';
    RAISE NOTICE '';
    RAISE NOTICE '4. Generate Recommendations:';
    RAISE NOTICE '   SELECT * FROM generate_content_recommendations(''YOUR_UUID'', 10);';
    RAISE NOTICE '';
    RAISE NOTICE '5. Update User Streak:';
    RAISE NOTICE '   SELECT update_user_streak(''YOUR_UUID'');';
    RAISE NOTICE '';
    RAISE NOTICE '6. Full-Text Search:';
    RAISE NOTICE '   SELECT * FROM textbooks WHERE search_vector @@ to_tsquery(''japanese & grammar'');';
    RAISE NOTICE '';
    RAISE NOTICE '7. Monitor Slow Queries:';
    RAISE NOTICE '   SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;';
    RAISE NOTICE '';
    RAISE NOTICE '=====================';
END $$;

-- =====================================================
-- FINAL SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨';
    RAISE NOTICE '✨                                    ✨';
    RAISE NOTICE '✨   DATABASE SETUP COMPLETE! 🎉     ✨';
    RAISE NOTICE '✨                                    ✨';
    RAISE NOTICE '✨   Your database is now enhanced   ✨';
    RAISE NOTICE '✨   with advanced features!         ✨';
    RAISE NOTICE '✨                                    ✨';
    RAISE NOTICE '✨   Next: Update your app code      ✨';
    RAISE NOTICE '✨   See: README_IMPLEMENTATION.md   ✨';
    RAISE NOTICE '✨                                    ✨';
    RAISE NOTICE '✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨';
    RAISE NOTICE '';
END $$;
