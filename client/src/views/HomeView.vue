<template>
  <div class="home-view">
    <div class="currency-rates-container">
      <h2>Курсы валют (1 {{ baseCurrency }} = ?)</h2>

      <div class="currency-rates-grid">
        <div v-for="(rate, currency) in filteredRates" :key="currency" class="currency-card">
          <div class="currency-flag">{{ getCurrencyFlag(currency) }}</div>
          <div class="currency-info">
            <div class="currency-code">{{ currency.toUpperCase() }}</div>
            <div class="currency-rate">{{ formatRate(rate) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useCurrencyStore } from '../stores/counter'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const currencyStore = useCurrencyStore()

    const baseCurrency = computed(() => currencyStore.selectedCurrency)

    const filteredRates = computed(() => {
      const rates: Record<string, number> = {}
      const prefix = `${currencyStore.selectedCurrency}-`

      Object.entries(currencyStore.rates).forEach(([key, value]) => {
        if (key.startsWith(prefix)) {
          const targetCurrency = key.replace(prefix, '')
          rates[targetCurrency] = value
        }
      })

      return rates
    })

    const formatRate = (rate: number) => {
      const formatted = rate.toFixed(4)
      return formatted.replace(/\.?0+$/, '')
    }

    const getCurrencyFlag = (currency: string) => {
      const flags: Record<string, string> = {
        usd: 'US',
        eur: 'EU',
        rub: 'RU',
        brl: 'BR',
        kzt: 'KZ',
        idr: 'ID',
      }
      return flags[currency]
    }

    return {
      baseCurrency,
      filteredRates,
      formatRate,
      getCurrencyFlag,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.home-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.currency-rates-container {
  background: rgba(vars.$menu-bg, 0.7);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

h2 {
  color: vars.$text-light;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
}

.currency-rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.currency-card {
  background: rgba(vars.$header-dark, 0.8);
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border: 1px solid rgba(vars.$border-light, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    background: rgba(vars.$header-dark, 0.9);
  }
}

.currency-flag {
  font-size: 2rem;
  line-height: 1;
}

.currency-info {
  display: flex;
  flex-direction: column;
}

.currency-code {
  font-weight: 600;
  color: vars.$text-light;
  font-size: 1.1rem;
}

.currency-rate {
  color: vars.$text-muted;
  font-size: 0.9rem;
  margin-top: 0.3rem;
}

@media (max-width: 768px) {
  .currency-rates-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .currency-card {
    padding: 1rem;
  }
}
</style>
