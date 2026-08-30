-- ============================================================
-- Incident Reliability Platform
-- PostgreSQL Database Schema
-- ============================================================
-- Creates the database objects required by the application.
--
-- This schema is intended for a fresh database installation.
-- Existing installations should use the appropriate migrations
-- instead of recreating these tables.
-- ============================================================


-- ============================================================
-- Incidents
-- ============================================================

CREATE TABLE incidents (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    service VARCHAR(100) NOT NULL,

    severity VARCHAR(20) NOT NULL
        CONSTRAINT incidents_severity_check
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
        CONSTRAINT incidents_status_check
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
-- Incident Lifecycle Events
-- ============================================================

CREATE TABLE incident_events (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    incident_id INTEGER NOT NULL,

    event_type VARCHAR(50) NOT NULL
        CONSTRAINT incident_events_event_type_check
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
-- ============================================================
-- Lifecycle-history requests filter events by incident_id.
-- This index avoids scanning the entire incident_events table.
-- ============================================================

CREATE INDEX idx_incident_events_incident_id
    ON incident_events(incident_id);