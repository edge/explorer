<template>
  <nav class="pagination">
    <ol class="pagination__list">
      <li class="pagination__item">
        <router-link v-if="currentPage !== 1" :to="{ name: baseRoute, params: { page: 1 }}">First</router-link>
        <span v-else>First</span>
      </li>
      <li class="pagination__item">
        <router-link v-if="currentPage !== 1" :to="{ name: baseRoute, params: { page: currentPage - 1 }}">
          <ChevronLeftIcon/>
        </router-link>
        <span v-else><ChevronLeftIcon/></span>
      </li>
      <li class="pagination__item">
        <span v-if="totalPages">Page {{currentPage}} of {{totalPages}}</span>
        <span v-else>&nbsp;</span>
      </li>
      <li class="pagination__item">
        <router-link v-if="currentPage < totalPages" :to="{ name: baseRoute, params: { page: currentPage + 1 }}">
          <ChevronRightIcon/>
        </router-link>
        <span v-else><ChevronRightIcon/></span>
      </li>
      <li class="pagination__item">
        <router-link v-if="currentPage < totalPages" :to="{ name: baseRoute, params: { page: totalPages }}">
          Last
        </router-link>
        <span v-else>Last</span>
      </li>
    </ol>
  </nav>
</template>

<script>
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/solid";

export default {
  name: "Pagination",
  components: {ChevronRightIcon, ChevronLeftIcon},
  props: ['baseRoute', 'currentPage', 'totalPages']
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