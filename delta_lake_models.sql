-- databricks sql / delta lake simulation
-- shows how the json-backed dashboard could be implemented as lakehouse tables.

create schema if not exists sports_lakehouse.bronze;
create schema if not exists sports_lakehouse.silver;
create schema if not exists sports_lakehouse.gold;

create or replace table sports_lakehouse.bronze.raw_ticketing_scans
using delta
as select * from json.`/mnt/adls/raw/ticketing/scans/`;

create or replace table sports_lakehouse.silver.ticket_scan_events
using delta
as
select
  scan_id,
  ticket_id,
  event_id,
  cast(scan_timestamp as timestamp) as scan_timestamp,
  lower(gate) as gate,
  scan_result,
  current_timestamp() as processed_at
from sports_lakehouse.bronze.raw_ticketing_scans;

create or replace table sports_lakehouse.gold.event_scan_summary
using delta
as
select
  event_id,
  count(*) as total_scans,
  sum(case when scan_result = 'valid' then 1 else 0 end) as valid_scans,
  round(sum(case when scan_result = 'valid' then 1 else 0 end) / count(*) * 100, 2) as valid_scan_rate
from sports_lakehouse.silver.ticket_scan_events
group by event_id;
