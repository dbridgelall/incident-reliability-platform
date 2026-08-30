-- ============================================================
-- Migration: Backfill CREATED incident events
-- ============================================================
-- Incidents created before lifecycle event tracking was added
-- do not have a CREATED event.
--
-- Use each incident's original created_at timestamp so the
-- historical event accurately reflects when it was created.
-- Existing CREATED events are left unchanged.
-- ============================================================

INSERT INTO incident_events (
    incident_id,
    event_type,
    created_at
)
SELECT
    i.id,
    'CREATED',
    i.created_at
FROM incidents AS i
WHERE NOT EXISTS (
    SELECT 1
    FROM incident_events AS e
    WHERE e.incident_id = i.id
      AND e.event_type = 'CREATED'
);