<template>
  <div class="country-selector">
    <v-select
      :model-value="displayValue"
      :items="countries"
      :placeholder="$t('Select a country')"
      item-value="value"
      item-text="text"
      @update:model-value="onChange" />
    <v-icon
      v-if="displayValue"
      name="close"
      class="clear-button"
      small
      @click="clearSelection" />
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

  const countries = ref(
    Object.entries(countriesList).map(([code, country]) => ({
      text: country.name,
      value: code
    }))
  );

  const parseStoredValue = (value: string | null) => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return parsed.countryCode;
    } catch {
      return value;
    }
  };

  const displayValue = computed(() => {
    const countryCode = parseStoredValue(props.value);
    const selectedCountry = countries.value.find(country => country.value === countryCode);
    return selectedCountry?.text || countryCode;
  });

  const onChange = (newValue: string) => {
    emit('input', newValue);
  };

  const clearSelection = () => {
    emit('input', '');
  };
</script>

<style scoped>
.country-selector {
  position: relative;
  display: flex;
  align-items: center;
}

.clear-button {
  position: absolute;
  right: 3px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.clear-button:hover {
  opacity: 1;
}
</style>
