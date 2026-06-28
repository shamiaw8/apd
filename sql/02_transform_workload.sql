-- transforms raw workload into an analysis-ready fact table

create or replace view fct_workload as
select
    athlete_id,
    date,
    duration_minutes,
    rpe,
    high_speed_yards,
    duration_minutes * rpe as session_load
from raw_workload;
