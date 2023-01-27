<template>
  <div class="flex flex-col w-full h-full">
    <h3 class="md:text-gray-100">Visit the Edge Community Wiki</h3>
    <a href="https://wiki.edge.network/" class="rounded">
      <img src="/assets/e-wiki-promo.png" class="wiki-image w-full object-cover object-top rounded">
    </a>
    <!-- temporarily disabled the text and button to fit additional statistics onto the overview apge -->
    <!-- <div class="flex flex-col flex-1 px-12 pt-12 pb-12 bg-white rounded-b">
      <p class="flex-1">The Community Wiki is the go to resource for all things Edge. Learn about the tech, find out how to contribute, and get answers to common support questions.</p>
      <div class="w-full text-right">
        <a href="https://wiki.edge.network/" target="_about" class="py-8 button button--solid">Edge Wiki</a>
      </div>
    </div> -->
  </div>
</template>

<script>
  export default {
    name: 'NewsPromo',
  }
</script>

<style scoped>
.wiki-image {
  height: 206px;
}
</style>
