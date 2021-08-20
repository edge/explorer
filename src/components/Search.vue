<template>
  <div class="search" :class="size==='large' ? 'search--lge' : ''">
    <input @keyup.enter="search" class="search__input" v-model="searchInput" type="text" placeholder="Search Tx or Block ID" />
    <button
      class="search__submit"
      @click="search"
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
      :class="size==='large' ? '-bottom-20 md:-bottom-24' : '-bottom-20 md:-top-24'"
      v-if="showFeedback"
    >
      {{ searchFeedback }}
    </div>
  </div>
</template>

<script>

import { ArrowRightIcon, SearchIcon } from '@heroicons/vue/solid'
import { search } from '../utils/api'

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
      searchFeedback: '',
      searchInput: '',
      showFeedback: false
    }
  },
  methods: {
    async search () {
      this.isSearching = true
      
      const result = await search(this.searchInput)
     
      this.isSearching = true

      const { blocks, transactions } = result
      
      if (blocks && blocks[0]) {
        this.$router.push(`/block/${blocks[0].height}`)
      } else if (transactions && transactions[0]) {
        this.$router.push(`/transaction/${transactions[0].hash}`)
      } else {
        // No result.
        setTimeout(() => {
          this.searchFeedback = "Come on dude, that's not a valid Tx or Block ID."
          this.showFeedback = true
          this.isSearching = false
        }, 1000)
      }
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
