<template>
  <nav class="pagination">
    <ol class="pagination__list">
      <li class="pagination__item">
        <router-link to="/">First</router-link>
      </li>
      <li class="pagination__item">
        <router-link to="/">
          <ChevronLeftIcon/>
        </router-link>
      </li>
      <!-- <li class="pagination__item">
        <router-link to="/">1</router-link>
      </li>
      <li class="pagination__item">
        <router-link to="/">2</router-link>
      </li>
      <li class="pagination__item">
        <span>...</span>
      </li>
      <li class="pagination__item">
        <span class="active">4</span>
      </li>
      <li class="pagination__item">
        <router-link to="/">5</router-link>
      </li> -->
      <li class="pagination__item">
        Page 1 of 10,000
      </li>
      <li class="pagination__item">
        <router-link to="/">
          <ChevronRightIcon/>
        </router-link>
      </li>
      <li class="pagination__item">
        <router-link to="/">Last</router-link>
      </li>
    </ol>
  </nav>
</template>

<script>
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/solid";

export default {
  name: "Pagination",
  components: {ChevronRightIcon, ChevronLeftIcon}
}
</script>

<style scoped>
.pagination {
  @apply mt-10;
}

.pagination__list {
  @apply flex items-center flex-wrap justify-center md:justify-end text-sm2 space-x-4;
}

.pagination__item {
  @apply py-6 px-12 bg-white rounded text-gray-400;
}

.pagination__item a {
  @apply hover:text-green;
}

.pagination__item .active {
  @apply text-green;
}

.pagination__item svg {
  @apply w-18;
}
</style>