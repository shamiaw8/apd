# ticketing data model

this project includes mock archtics-style ticketing data. it does not contain proprietary ticketmaster or archtics data.

## source-like entities

- `accounts`: fan/customer account records
- `events`: home games and event metadata
- `tickets`: seat-level ticket sales/resale transactions
- `scans`: gate scan activity
- `merch_orders`: fanatics-style merchandise orders
- `stream_events`: near real-time ticket scan/merch event examples

## facts and dimensions

- `dim_account`: one row per fan account
- `dim_event`: one row per game/event
- `fact_ticket_sales`: one row per ticket sold/resold
- `fact_ticket_scans`: one row per scan event
- `fact_merch_orders`: one row per merchandise order
- `mart_event_revenue`: event-level scan rate, ticket revenue, and merch revenue

## use cases

- attendance pacing
- scan rate by event/gate
- revenue by fan segment
- campaign targeting by buyer channel
- event operations dashboarding
