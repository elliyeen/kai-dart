-- KAI station intelligence: proposed relational schema (PostgreSQL-compatible; adaptable to Cloudflare D1/SQLite).
-- Design notes: every monitored thing has an ID and an owner; every state change writes an audit_log row;
-- tickets close only through an inspection by a different user than the one who submitted proof.

CREATE TABLE owners (id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL CHECK (kind IN ('team','contractor','role')));
CREATE TABLE users (id TEXT PRIMARY KEY, display_name TEXT NOT NULL, role TEXT NOT NULL, owner_id TEXT REFERENCES owners(id), disabled INTEGER NOT NULL DEFAULT 0);
CREATE TABLE user_station_scopes (user_id TEXT REFERENCES users(id), station_id TEXT, PRIMARY KEY (user_id, station_id));
CREATE TABLE sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), signed_in_at TEXT NOT NULL, signed_out_at TEXT, ip TEXT, user_agent TEXT, method TEXT NOT NULL);

CREATE TABLE stations (id TEXT PRIMARY KEY, name TEXT NOT NULL, official_stop_id TEXT, address TEXT, lat REAL, lng REAL, owner_id TEXT REFERENCES owners(id));
CREATE TABLE station_lines (station_id TEXT REFERENCES stations(id), line TEXT NOT NULL CHECK (line IN ('red','green','blue','orange','silver')), position INTEGER, PRIMARY KEY (station_id, line));

CREATE TABLE assets (
  id TEXT PRIMARY KEY, station_id TEXT NOT NULL REFERENCES stations(id), type TEXT NOT NULL CHECK (type IN ('elevator','camera','stairwell','trash_can','bus_cover')),
  status TEXT NOT NULL CHECK (status IN ('in_service','out_of_service','retired')), owner_id TEXT NOT NULL REFERENCES owners(id),
  input_source TEXT NOT NULL, output_use TEXT NOT NULL, installed_on TEXT, last_inspected_on TEXT, updated_at TEXT NOT NULL
);

CREATE TABLE tickets (
  id TEXT PRIMARY KEY, station_id TEXT NOT NULL REFERENCES stations(id), asset_id TEXT REFERENCES assets(id), type TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('critical','high','routine')), status TEXT NOT NULL CHECK (status IN ('open','in_progress','done','cancelled')),
  notes TEXT, reported_by TEXT, source TEXT NOT NULL, owner_id TEXT NOT NULL REFERENCES owners(id), created_at TEXT NOT NULL, closed_at TEXT
);
CREATE TABLE work_orders (id TEXT PRIMARY KEY, ticket_id TEXT NOT NULL REFERENCES tickets(id), assigned_to TEXT REFERENCES users(id), assigned_by TEXT REFERENCES users(id), status TEXT NOT NULL, external_ref TEXT, created_at TEXT NOT NULL);
CREATE TABLE proofs (id TEXT PRIMARY KEY, work_order_id TEXT NOT NULL REFERENCES work_orders(id), submitted_by TEXT NOT NULL REFERENCES users(id), notes TEXT, photo_key TEXT, submitted_at TEXT NOT NULL);
CREATE TABLE inspections (
  id TEXT PRIMARY KEY, station_id TEXT NOT NULL REFERENCES stations(id), work_order_id TEXT REFERENCES work_orders(id), inspector_id TEXT NOT NULL REFERENCES users(id),
  outcome TEXT NOT NULL CHECK (outcome IN ('approved','rejected','routine')), checklist_json TEXT, created_at TEXT NOT NULL
);
CREATE TABLE readiness_scores (station_id TEXT REFERENCES stations(id), computed_at TEXT NOT NULL, score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100), factors_json TEXT NOT NULL, PRIMARY KEY (station_id, computed_at));

-- Append-only: who did what, the input, the output, and the owning team. No UPDATE/DELETE grants on this table.
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY, at TEXT NOT NULL, actor_id TEXT NOT NULL, role TEXT NOT NULL, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
  input TEXT NOT NULL, output TEXT NOT NULL, owner_id TEXT, session_id TEXT REFERENCES sessions(id)
);
CREATE INDEX audit_entity ON audit_log (entity_type, entity_id);
CREATE INDEX audit_actor ON audit_log (actor_id, at);

-- Separation of duties, enforced in the application and checkable here:
-- SELECT w.id FROM work_orders w JOIN proofs p ON p.work_order_id = w.id JOIN inspections i ON i.work_order_id = w.id WHERE p.submitted_by = i.inspector_id;  -- must return zero rows
