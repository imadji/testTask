import { defineStore } from 'pinia'
import axios from 'axios'

interface CurrencyRates {
  [key: string]: number
}

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    rates: {} as CurrencyRates,
    selectedCurrency: 'usd',
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchRates() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('https://status.neuralgeneration.com/api/currency')
        this.rates = response.data
      } catch (err) {
        this.error = 'Failed to fetch currency rates'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    setCurrency(currency: string) {
      this.selectedCurrency = currency
      localStorage.setItem('selectedCurrency', currency)
    },
  },
  getters: {
    currentRate(): (targetCurrency: string) => number | null {
      return (targetCurrency: string) => {
        const key = `${this.selectedCurrency}-${targetCurrency}`
        return this.rates[key] || null
      }
    },
    ratesForBaseCurrency: (state) => {
      const result: Record<string, number> = {}
      const prefix = `${state.selectedCurrency}-`

      Object.entries(state.rates).forEach(([key, value]) => {
        if (key.startsWith(prefix)) {
          const targetCurrency = key.replace(prefix, '')
          result[targetCurrency] = value
        }
      })

      return result
    },
    availableCurrencies(): string[] {
      const currencies = new Set<string>()
      Object.keys(this.rates).forEach((key) => {
        const [from] = key.split('-')
        currencies.add(from)
      })
      return Array.from(currencies).sort()
    },
  },
})
