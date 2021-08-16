<template>
  <div class="search" :class="size==='large' ? 'search--lge' : ''">
    <input class="search__input" type="text" placeholder="Search Tx or Block ID" />
    <button class="search__submit">
      <div class="search__icon">
        <SearchIcon />
      </div>
    </button>
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