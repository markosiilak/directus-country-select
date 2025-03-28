<template>
  <v-select
    v-model="selectedValue"
    :items="countries"
    :placeholder="$t('Select a country')"
    item-text="text"
    item-value="value"
    @update:model-value="updateSelectedCountry" />
</template>

<script setup lang="ts">
  import { countries as countriesList } from 'countries-list';
  import { computed, ref } from 'vue';

  const props = defineProps<{
    value: string | null;
  }>();

  const emit = defineEmits<{
    (e: 'input', value: string): void;
  }>();

  const formatCountryText = (name: string, code: string, currency: string, phone: string) => {
    return `${name}, ${code} (${currency}) +${phone}`;
  };

  const countries = ref(
    Object.entries(countriesList).map(([code, country]) => ({
      text: formatCountryText(country.name, code, country.currency, country.phone),
      value: code
    }))
  );

  const parseStoredValue = (value: string | null) => {
    if (!value) return null;
    try {
      if (typeof value === 'string' && value.startsWith('{')) {
        const parsed = JSON.parse(value);
        return parsed.countryCode;
      }
      return value;
    } catch {
      return value;
    }
  };

  const getCountryByCode = (code: string) => {
    return countriesList[code];
  };

  const selectedValue = computed(() => {
    // Parse the country code from the provided prop value
    const countryCode = parseStoredValue(props.value);
    if (!countryCode) return null;

    return countryCode;
  });

  const updateSelectedCountry = (newValue: string) => {
    const country = getCountryByCode(newValue);
    const data = {
      countryName: country?.name,
      countryCode: newValue,
      defaultLocale: newValue.toLowerCase(),
      currency: country?.currency,
      phone: '+' + country?.phone
    };
    const formattedValue = JSON.stringify(data).replace(/\\/g, '');
    emit('input', formattedValue);
  };
</script>
