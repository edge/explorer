<template>
  <div class="faucet flex flex-col w-full h-full">
    <h3>Testnet XE Faucet</h3>
    <div class="flex flex-col flex-1 px-24 py-32 bg-white rounded">
      <h1 class="facuet-header my-0 pt-0 pb-20">
        <img src="assets/faucet.svg" class="inline">
        XE Automated Faucet
      </h1>
      <p class="flex-1 my-0">
        To request funds, please make a <a :href="`${twitterUrl}${twitterMsg}`" target="_about" class="tweet">tweet</a> including your XE wallet address, then paste the URL of the tweet into the text box below.
      </p>
      <p class="flex-1">
        <input :disabled="true" v-model="url" type="text" placeholder="URL of tweet including your XE address..." class="faucet-input">
      </p>
      <div class="w-full text-right">
        <button
          class="request-button py-8 button button--solid"
          :disabled="true"
          @click="requestXE">
          Coming soon!
        </button>
        <!-- Request XE / :disabled="!urlIsValid" -->
      </div>
    </div>
  </div>
</template>

<style>
.facuet-header {
  font-size: 1.2rem;
  line-height: 24px;
  text-align: center;
  padding: 1rem 0;
}
.facuet-header img {
  width: 24px;
  height: 24px;
}

.faucet a.tweet {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green;
}
.faucet a.tweet:hover {
  @apply text-green;
}

.faucet .request-button {
  @apply text-white bg-green border-green hover:bg-black hover:border-black;
}

.faucet .request-button:disabled {
  @apply cursor-not-allowed bg-gray-300 border-gray-300;
}

.faucet-input {
  background-color: #f2f2f2 !important;
  border-color: #f2f2f2 !important;
  color: #333333 !important;
}
</style>

<script>
  export default {
    name: 'Faucet',
    data: function() {
      return {
        url: null,
        twitterUrl: 'https://twitter.com/intent/tweet?text=',
        twitterMsg: encodeURIComponent(
          'Requesting faucet funds for xe_0000000000000000000000000000000000000000 on https://test.network/'
          + '\n\n@edgenetwork $XE $EDGE'
        )
      }
    },
    computed: {
      urlIsValid: function() {
        return this.url && this.isValidTweetUrl(this.url)
      }
    },
    methods: {
      requestXE: function() {
        console.log('requestXE', this.isValidTweetUrl(this.url))
        // TODO
      },
      isValidTweetUrl: function (url) {
        return url && url.match(/^https:\/\/twitter\.com\/.*\/status\/\d+/) !== null
      }
    }
  }
</script>


