# illustrative terraform only. not intended to run without provider config and real azure names.

resource "azurerm_resource_group" "sports_data" {
  name     = "rg-sports-data-dev"
  location = "eastus"
}

resource "azurerm_storage_account" "adls" {
  name                     = "stathleteperfdev"
  resource_group_name      = azurerm_resource_group.sports_data.name
  location                 = azurerm_resource_group.sports_data.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  is_hns_enabled           = true
}

resource "azurerm_storage_data_lake_gen2_filesystem" "bronze" {
  name               = "bronze"
  storage_account_id = azurerm_storage_account.adls.id
}

resource "azurerm_storage_data_lake_gen2_filesystem" "silver" {
  name               = "silver"
  storage_account_id = azurerm_storage_account.adls.id
}

resource "azurerm_storage_data_lake_gen2_filesystem" "gold" {
  name               = "gold"
  storage_account_id = azurerm_storage_account.adls.id
}
