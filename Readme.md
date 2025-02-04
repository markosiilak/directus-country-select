
# Directus Country Selector Interface

A custom interface for Directus that provides a searchable country selector dropdown.

## Description

This interface extension adds a country selector dropdown to Directus that allows users to:
- Search countries by name
- Select countries from a dropdown list
- Store country data as ISO codes
- Display country flags alongside names

## Installation

1. Download or clone this repository
2. Move the `directus-country-select` folder to your Directus extensions directory
3. Restart your Directus instance

## Usage

1. Create a new field in your collection
2. Select "Country Selector" as the interface type
3. Configure any desired options in the interface settings

## Options

- `allowMultiple`: Allow selecting multiple countries (boolean)
- `displayFlags`: Show country flags in the dropdown (boolean)
- `defaultValue`: Set a default country selection (string - ISO code)
