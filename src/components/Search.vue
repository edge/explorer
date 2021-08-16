<template>
  <div class="search" :class="size==='large' ? 'search--lge' : ''">
    <input class="search__input" type="text" placeholder="Search Tx or Block ID" />
    <button
      class="search__submit"
      @click="isSearching = true, search()"
      :class="isSearching ? 'pointer-events-none' : ''"
    >
      <div class="search__icon" :class="isSearching ? 'animate-spin' : ''">
        <span v-if="isSearching">
          <svg class="w-full" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="12" y1="6" x2="12" y2="3" />
            <line x1="16.25" y1="7.75" x2="18.4" y2="5.6" />
            <line x1="18" y1="12" x2="21" y2="12" />
            <line x1="16.25" y1="16.25" x2="18.4" y2="18.4" />
            <line x1="12" y1="18" x2="12" y2="21" />
            <line x1="7.75" y1="16.25" x2="5.6" y2="18.4" />
            <line x1="6" y1="12" x2="3" y2="12" />
            <line x1="7.75" y1="7.75" x2="5.6" y2="5.6" />
          </svg>
        </span>
        <span v-else>
          <SearchIcon />
        </span>
      </div>
    </button>
    <div
      class="absolute left-0 text-sm2 text-red"
      :class="size==='large' ? '-bottom-24' : '-top-24'"
    >
      Come on man, that's not a valid Tx or Block ID.
    </div>
  </div>
</template>

<script>

import {
  ArrowRightIcon
} from '@heroicons/vue/solid'
import {
  SearchIcon
} from '@heroicons/vue/solid'

export default {
  name: "Search",
  components: {
    ArrowRightIcon,
    SearchIcon
  },
  props: {
    size: {
      type: String
    }
  },
  data: function () {
    return {
      isSearching: false,
      searchInput: ''
    }
  },
  methods: {
    async search () {
      console.log('searching')
    }
  }
}
</script>

<style scoped>
  .search {
    @apply relative bg-white rounded flex items-center h-40 py-8 md:max-w-sm mt-16 md:mt-0 w-full;
  }
  .search--lge {
    @apply md:h-50 lg:w-1/2 max-w-full;
  }
  .search__input {
    @apply bg-transparent text-black rounded-r-none border-none h-full flex items-center w-full !important;
  }
  .search__submit {
    @apply border-l border-gray-200 px-10 h-full text-green;
    @apply hover:text-green-100
  }
  .search--lge .search__submit {
    @apply md:px-18;
  }
  .search__icon {
    @apply w-18;
  }
  .search--lge .search__icon {
    @apply md:w-24;
  }
</style>