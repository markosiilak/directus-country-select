<template>
  <v-select
    v-model="selectedValue"
    :items="countries"
    :placeholder="$t('Select a country')"
    item-text="text"
    item-value="value"
    @update:model-value="updateSelectedCountry" />

  <div v-if="selectedValue" class="country-info">
    <div class="country-info-header">
      <span class="country-name">{{ selectedValue?.countryName }}</span>
      <span class="country-code">{{ selectedValue?.countryCode }}</span>
    </div>
    <div class="country-info-details">
      <div class="info-item">
        <span class="label">Locale:</span>
        <span>{{ selectedValue?.defaultLocale }}</span>
      </div>
      <div class="info-item">
        <span class="label">Currency:</span>
        <span>{{ selectedValue?.currency }}</span>
      </div>
      <div class="info-item">
        <span class="label">Phone:</span>
        <span>{{ selectedValue?.phone }}</span>
      </div>
    </div>
  </div>
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

<style scoped>
.country-info {
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background: var(--background-subdued);
  border: 1px solid var(--border-normal);
}

.country-info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.country-name {
  font-weight: bold;
  color: var(--primary);
}

.country-code {
  padding: 2px 6px;
  background: var(--primary-alt);
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--primary);
}

.country-info-details {
  display: grid;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: var(--foreground-subdued);
  min-width: 70px;
}
</style>
