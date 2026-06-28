-- snowflake-style ddl for the simulated raw data layer
-- this project runs frontend-only, but these models show how the dashboard data could be staged in a warehouse.

create or replace table raw_athletes (
    athlete_id integer,
    name varchar,
    position varchar,
    position_group varchar
);

create or replace table raw_wellness (
    athlete_id integer,
    date date,
    sleep_hours number(4, 1),
    soreness integer,
    stress integer,
    mood integer
);

create or replace table raw_workload (
    athlete_id integer,
    date date,
    duration_minutes integer,
    rpe integer,
    high_speed_yards integer
);
