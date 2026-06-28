# data governance and catalog notes

this project includes a small metadata catalog to show governance thinking in a sports data environment.

## catalog fields

- asset name
- lakehouse layer: bronze, silver, gold
- business owner
- classification
- pii indicator
- freshness sla
- data quality rule

## examples

- wellness data is marked restricted because it can include athlete health indicators.
- ticketing scans are confidential because account identifiers can connect to fan behavior.
- reporting marts remove direct pii and are safer for broader analytics access.

## production mapping

this could map to unity catalog, microsoft purview, databricks table comments/tags, or another metadata management platform.
