-- example reporting model for recovery and readiness scoring

create or replace view mart_athlete_readiness as
with wellness_7_day as (
    select
        athlete_id,
        avg(sleep_hours) as avg_sleep_hours,
        avg(soreness) as avg_soreness,
        avg(stress) as avg_stress,
        avg(mood) as avg_mood
    from raw_wellness
    group by athlete_id
),
workload_7_day as (
    select
        athlete_id,
        sum(session_load) as acute_load,
        avg(session_load) * 7 as chronic_load_estimate
    from fct_workload
    group by athlete_id
),
latest_wellness as (
    select *
    from raw_wellness
    qualify row_number() over (partition by athlete_id order by date desc) = 1
)
select
    a.athlete_id,
    a.name,
    a.position,
    a.position_group,
    round(
        least(avg_sleep_hours / 8, 1) * 35 +
        (1 - ((avg_soreness - 1) / 9)) * 25 +
        (1 - ((avg_stress - 1) / 9)) * 20 +
        (avg_mood / 10) * 20
    ) as recovery_score,
    round(acute_load / nullif(chronic_load_estimate, 0), 2) as acute_chronic_workload_ratio,
    lw.sleep_hours as latest_sleep_hours,
    lw.soreness as latest_soreness,
    lw.stress as latest_stress
from raw_athletes a
join wellness_7_day w using (athlete_id)
join workload_7_day wl using (athlete_id)
join latest_wellness lw using (athlete_id);
