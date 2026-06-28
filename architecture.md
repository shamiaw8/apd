# architecture overview

this repo is frontend-only so it can run on github pages, but the project is intentionally designed like a sports and entertainment data engineering solution.

## simulated production flow

1. source systems
   - athlete wellness exports
   - gps/workload exports
   - ticketmaster archtics-style accounts, events, tickets, scans
   - fan merchandise orders

2. ingestion
   - azure data factory style batch ingestion into adls bronze
   - kafka/kinesis style scan stream for near real-time gate events
   - azure functions style event-triggered merch order ingestion

3. storage and modeling
   - bronze: raw json/csv-like source records
   - silver: cleaned, typed, conformed tables
   - gold: dashboard-ready marts
   - delta lake/databricks sql examples in `databricks/`

4. governance
   - metadata catalog includes owner, pii classification, freshness sla, and quality rule
   - production equivalent: unity catalog, microsoft purview, or databricks table tags

5. delivery
   - github pages static dashboard
   - github actions deployment workflow
   - reporting-ready outputs that could support power bi or another bi layer

## why this matters for data engineering roles

this project demonstrates data ingestion, data modeling, data quality, ci/cd, lakehouse thinking, cloud architecture, ticketing data familiarity, and sports industry context without requiring paid cloud resources.
