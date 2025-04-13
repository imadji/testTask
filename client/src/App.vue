<template>
  <div class="app">
    <header class="header">
      <div class="header-container">
        <nav class="nav-menu">
          <router-link to="/" class="menu-button" active-class="active-button" exact>
            <span class="button-text">Главная</span>
          </router-link>
          <router-link to="/conversion" class="menu-button" active-class="active-button">
            <span class="button-text">Конвертация</span>
          </router-link>

          <div class="currency-selector">
            <select
              v-model="selectedCurrency"
              @change="setCurrency"
              :disabled="currencyStore.loading"
              class="currency-dropdown"
            >
              <option
                v-for="currency in currencyStore.availableCurrencies"
                :key="currency"
                :value="currency"
              >
                {{ currency.toUpperCase() }}
              </option>
            </select>
          </div>
        </nav>
      </div>
    </header>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useCurrencyStore } from './stores/counter'

export default defineComponent({
  name: 'App',
  setup() {
    const currencyStore = useCurrencyStore()
    const selectedCurrency = ref(currencyStore.selectedCurrency)

    const setCurrency = () => {
      currencyStore.setCurrency(selectedCurrency.value)
    }

    onMounted(async () => {
      if (Object.keys(currencyStore.rates).length === 0) {
        await currencyStore.fetchRates()
      }
      const savedCurrency = localStorage.getItem('selectedCurrency')
      if (savedCurrency) {
        selectedCurrency.value = savedCurrency
        currencyStore.selectedCurrency = savedCurrency
      }
    })

    return {
      currencyStore,
      selectedCurrency,
      setCurrency,
    }
  },
})
</script>

<style lang="scss">
@use 'sass:color';
@use '@/styles/variables' as vars;

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.app {
  min-height: 100vh;
  background-color: vars.$bg-dark;
  color: vars.$text-light;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  background: linear-gradient(180deg, vars.$header-dark 0%, vars.$header-darker 100%);
  padding: 1rem 0;
  border-bottom: 1px solid vars.$border-dark;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
  position: relative;
  z-index: 10;
}

.header-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: 100%;
}

.menu-button {
  color: vars.$text-muted;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border: none;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(vars.$button-hover, 0.5) 0%,
      rgba(vars.$button-hover-dark, 0.2) 100%
    );
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    color: vars.$text-light;

    &::before {
      opacity: 1;
    }

    .button-text {
      transform: scale(1.05);
    }
  }
}

.active-button {
  color: vars.$text-light;
  background: linear-gradient(135deg, vars.$button-active 0%, vars.$button-active-dark 100%);
  box-shadow: 0 4px 15px rgba(vars.$button-active, 0.4);

  &::before {
    opacity: 1;
  }

  .button-text {
    animation: pulse 2s infinite;
  }
}

.button-text {
  position: relative;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}

.currency-selector {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;

  select.currency-dropdown {
    background: vars.$menu-bg;
    color: vars.$text-light;
    border: 1px solid vars.$border-light;
    border-radius: 20px;
    padding: 0.6rem 1.2rem 0.6rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    appearance: none;
    transition: all 0.3s ease;
    min-width: 100px;
    text-align: center;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;

    &:hover {
      background: color.scale(vars.$menu-bg, $lightness: 5%);
      border-color: color.scale(vars.$border-light, $lightness: 10%);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(vars.$button-active, 0.3);
    }
  }

  &::after {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    color: vars.$text-muted;
    pointer-events: none;
    z-index: 2;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.menu-button,
.currency-selector {
  transform: translateZ(0);
}
</style>
