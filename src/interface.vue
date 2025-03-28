<template>
  <v-button
    @click="showDrawer = true"
    :disabled="disabled">
    {{ displayText?.countryName ? displayText.countryName : 'Select a country' }}
  </v-button>

  <v-drawer
    v-model="showDrawer"
    title="Select a country"
    @cancel="showDrawer = false">
    <template #actions>
      <v-input
        v-model="searchQuery"
        placeholder="Search country..."
        autofocus>
        <template #prepend><v-icon name="search" /></template>
      </v-input>
    </template>
    <div class="countries-list">
      <v-list>
        <v-list-item
          v-for="country in filteredCountries"
          :key="country.value"
          :active="selectedValue?.countryCode === country.value"
          clickable
          @click="selectCountry(country.value)">
          <v-list-item-content>{{ country.text }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-drawer>

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
  import { computed, ref, watch } from 'vue';

  const props = defineProps<{
    value: string | null;
    disabled: boolean;
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

  const getCountryByCode = (code: string) => {
    return countriesList[code];
  };

  const selectedValue = computed(() => {
    if (!props.value) return null;
    try {
      if (typeof props.value === 'string' && props.value.startsWith('{')) {
        return JSON.parse(props.value);
      }
      // Handle legacy format where only country code was stored
      const country = getCountryByCode(props.value);
      return {
        countryName: country?.name,
        countryCode: props.value,
        defaultLocale: props.value.toLowerCase(),
        currency: country?.currency,
        phone: '+' + country?.phone
      };
    } catch {
      return null;
    }
  });

  const displayText = computed(() => {
    if (!selectedValue.value) return props.value ? props.value : 'Select a country';
    return selectedValue.value.countryName;
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

  const showDrawer = ref(false);

  const selectCountry = (code: string) => {
    updateSelectedCountry(code);
    showDrawer.value = false;
  };

  const searchQuery = ref('');

  const filteredCountries = computed(() => {
    const query = searchQuery.value.toLowerCase();
    if (!query) return countries.value;

    return countries.value.filter(country =>
      country.text.toLowerCase().includes(query)
    );
  });

  // Reset search when drawer closes
  watch(showDrawer, (isOpen) => {
    if (!isOpen) {
      searchQuery.value = '';
    }
  });
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

.countries-list {
  height: 100%;
  overflow-y: auto;
}

.v-input {
  margin-bottom: 12px;
}
</style>
