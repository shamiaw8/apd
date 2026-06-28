-- final reporting view intended for dashboards such as power bi, tableau, or a custom frontend

create or replace view rpt_team_readiness_summary as
select
    athlete_id,
    name,
    position,
    position_group,
    recovery_score,
    acute_chronic_workload_ratio,
    case
        when recovery_score < 60
          or acute_chronic_workload_ratio > 1.3
          or latest_soreness >= 7
          or latest_sleep_hours < 6.5
        then 'needs attention'
        else 'normal'
    end as risk_status
from mart_athlete_readiness;
