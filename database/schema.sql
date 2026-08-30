-- ============================================================
-- Incident Reliability Platform
-- PostgreSQL Database Schema
-- ============================================================


-- ============================================================
-- Incidents
-- Stores the current state of each reliability incident.
-- ============================================================

CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL
        CHECK (
            severity IN (
                'LOW',
                'MEDIUM',
                'HIGH',
                'CRITICAL'
            )
        ),
    status VARCHAR(20) NOT NULL
        DEFAULT 'OPEN'
        CHECK (
            status IN (
                'OPEN',
                'INVESTIGATING',
                'RESOLVED'
            )
        ),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- Incident Events
-- Stores the historical lifecycle events for each incident.
-- ============================================================

CREATE TABLE IF NOT EXISTS incident_events (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    incident_id INTEGER NOT NULL,
    event_type VARCHAR(50) NOT NULL
        CHECK (
            event_type IN (
                'CREATED',
                'INVESTIGATION_STARTED',
                'RESOLVED'
            )
        ),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_incident_events_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(id)
        ON DELETE CASCADE
);


-- ============================================================
-- Indexes
-- Improves lookup performance for an incident's event history.
-- ============================================================

CREATE INDEX IF NOT EXISTS
    idx_incident_events_incident_id
ON incident_events(incident_id);