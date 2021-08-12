<template>
  <div class="search">
    <!-- <span class="search__icon">
      <SearchIcon />
    </span> -->
    <input class="search__input" type="text" placeholder="Search Tx or Block ID" />
    <button class="h-full search__submit group">
      <div class="w-16 text-green group-hover:text-green-100">
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
  }
}
</script>

<style scoped>
  .search {
    @apply relative bg-white rounded flex items-center h-40 py-8 md:max-w-sm mt-16 md:mt-0 w-full;
  }
  .search__input {
    @apply bg-transparent text-black rounded-r-none border-none h-full flex items-center w-full !important;
  }
  .search__submit {
    @apply border-l border-gray-200 px-10;
  }
  .search__icon {
    @apply absolute w-16 text-gray-400 left-8 pointer-events-none;
  }
</style>