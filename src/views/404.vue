<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <router-link to="/">
      <img src="/assets/logo.svg" alt="XE" width="60">
    </router-link>
    <h1 class="m-0 mt-20 text-2xl font-bold">Uh oh. How'd we get here?</h1>
    <p class="mt-5 mb-0 monospace">Unfortunately the page you are looking for doesn't exist.</p>
    <router-link to="/">
      <a class="mt-20 button button--solid">Go to homepage</a>
    </router-link>
  </div>
</template>

<script>
export default {
  title() {
    return 'XE Explorer » 404'
  }
}
</script>
<style scoped>
</style>