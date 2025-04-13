<template>
  <div class="conversion-view">
    <h1>Конвертер валют</h1>
    <div class="converter-form">
      <div class="conversion-row">
        <div class="currency-selector">
          <select v-model="fromCurrency" @change="convert">
            <option
              v-for="currency in availableCurrencies"
              :key="`from-${currency}`"
              :value="currency"
            >
              {{ currency.toUpperCase() }}
            </option>
          </select>
        </div>
        <input
          v-model.number="fromAmount"
          type="number"
          @input="convertFrom"
          placeholder="Введите сумму"
          class="amount-input"
        />
      </div>

      <div class="swap-button" @click="swapCurrencies">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
        </svg>
      </div>

      <div class="conversion-row">
        <div class="currency-selector">
          <select v-model="toCurrency" @change="convert">
            <option
              v-for="currency in availableCurrencies"
              :key="`to-${currency}`"
              :value="currency"
            >
              {{ currency.toUpperCase() }}
            </option>
          </select>
        </div>
        <input
          v-model.number="toAmount"
          type="number"
          @input="convertTo"
          placeholder="Результат"
          class="amount-input"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useCurrencyStore } from '../stores/counter'

export default defineComponent({
  name: 'ConversionView',
  setup() {
    const currencyStore = useCurrencyStore()

    const fromCurrency = ref('rub')
    const toCurrency = ref('usd')
    const fromAmount = ref<number | null>(null)
    const toAmount = ref<number | null>(null)
    const lastChanged = ref<'from' | 'to'>('from')

    const availableCurrencies = computed(() => currencyStore.availableCurrencies)

    const conversionRate = computed(() => {
      if (!fromCurrency.value || !toCurrency.value) return 1

      if (fromCurrency.value === toCurrency.value) return 1

      const rateKey = `${fromCurrency.value}-${toCurrency.value}`
      return currencyStore.rates[rateKey] || 1
    })

    const convertFrom = () => {
      lastChanged.value = 'from'
      if (fromAmount.value === null) {
        toAmount.value = null
        return
      }
      toAmount.value = round(fromAmount.value * conversionRate.value)
    }

    const convertTo = () => {
      lastChanged.value = 'to'
      if (toAmount.value === null) {
        fromAmount.value = null
        return
      }
      fromAmount.value = round(toAmount.value / conversionRate.value)
    }

    const convert = () => {
      if (lastChanged.value === 'from') {
        convertFrom()
      } else {
        convertTo()
      }
    }

    const round = (value: number): number => {
      return Math.round(value * 100) / 100
    }

    const swapCurrencies = () => {
      ;[fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value]
      convert()
    }

    watch(conversionRate, convert)

    return {
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
      availableCurrencies,
      convertFrom,
      convertTo,
      convert,
      swapCurrencies,
    }
  },
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables' as vars;

.conversion-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  color: vars.$text-light;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.converter-form {
  background: rgba(vars.$menu-bg, 0.7);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid vars.$border-light;
  overflow: hidden;
}

.conversion-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;

  &:last-child {
    margin-bottom: 0;
  }
}

.currency-selector {
  flex: 0 0 120px;
  position: relative;
  min-width: 0;

  select {
    width: 100%;
    max-width: 100%;
    background: vars.$header-dark;
    color: vars.$text-light;
    border: 1px solid vars.$border-light;
    border-radius: 8px;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    appearance: none;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:hover {
      background: color.scale(vars.$header-dark, $lightness: 5%);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(vars.$button-active, 0.3);
    }
  }

  &::after {
    content: '▼';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    color: vars.$text-muted;
    pointer-events: none;
  }
}

.amount-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  background: vars.$header-dark;
  color: vars.$text-light;
  border: 1px solid vars.$border-light;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  height: 48px;
  box-sizing: border-box;

  &[type='number'] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &:focus {
    outline: none;
    border-color: vars.$button-active;
    box-shadow: 0 0 0 2px rgba(vars.$button-active, 0.2);
  }
}

.result-input {
  background: rgba(vars.$header-dark, 0.7);
  cursor: not-allowed;
}

.swap-button {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    fill: vars.$text-muted;
    transition: all 0.3s ease;
  }

  &:hover svg {
    fill: vars.$text-light;
    transform: rotate(180deg);
  }
}

@media (max-width: 600px) {
  .conversion-view {
    padding: 1rem;
  }

  .converter-form {
    padding: 1.5rem;
  }

  .conversion-row {
    flex-direction: column;
    gap: 0.8rem;
  }

  .currency-selector {
    width: 100%;
    flex: 1 1 auto;
  }

  .amount-input {
    width: 100%;
  }
}
</style>
