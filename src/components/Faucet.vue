<template>
  <div class="faucet flex flex-col w-full h-full">
    <h3>Testnet XE Faucet</h3>
    <div class="faucet-content lex flex-col flex-1 px-24 py-10 bg-white rounded">
      <h1 class="faucet-header my-0 pb-10">
        <img src="/faucet.svg" class="inline">
        Automated Faucet
      </h1>
      <p class="flex-1 my-4">
        To request $EDGE, please make a <a :href="`${twitterUrl}${twitterMsg}`" target="_about" class="tweet">tweet</a> including your XE wallet address, then paste the URL of the tweet into the text box below.
      </p>
      <p class="flex-1 mb-4">
        <input :disabled="submitting" v-model="url" type="text" placeholder="URL of tweet including your XE address..." class="faucet-input">
      </p>
      <div v-if="displayMessage" class="w-full text-left">
        <p class="request-message py-8 my-0">
          <span v-if="success" class="success">Your request has been received and will be processed shortly.</span>
          <span v-if="error" class="error">Error processing your request: {{ error }}</span>
        </p>
      </div>
      <div v-else class="w-full text-right">
        <button
          class="request-button py-8 button button--solid"
          :disabled="!urlIsValid || submitting"
          @click="requestXE">
          {{ submitting ? 'Submitting' : 'Request $EDGE' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@screen md {
  .faucet-content {
    max-height: 206px;
  }
}

.faucet-header {
  font-size: 1.2rem;
  line-height: 20px;
  text-align: center;
  padding: 0.5rem 0;
}
.faucet-header img {
  width: 24px;
  height: 24px;
}

.faucet a.tweet {
  @apply leading-none border-b border-green border-opacity-25 hover:border-black hover:border-opacity-25 text-green;
}
.faucet a.tweet:hover {
  @apply text-black;
}

.faucet .request-button {
  @apply text-white bg-green border-green hover:bg-black hover:border-black;
}

.request-message {
  height: 34px;
}
.request-message .success {
  @apply text-green;
}
.request-message .error {
  @apply text-red;
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
  import superagent from 'superagent'

  export default {
    name: 'Faucet',
    data: function() {
      return {
        url: null,
        error: null,
        success: false,
        displayMessage: false,
        submitting: false,
        faucetUrl: 'https://faucet.test.network/request',
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
    watch: {
      url: function() {
        this.error = null
        this.success = false
        this.displayMessage = false
      }
    },
    methods: {
      requestXE: function() {
        this.submitting = true

        // POST request to faucet using superagent
        superagent
          .post(this.faucetUrl)
          .send({ url: this.url })
          .end((err, res) => {
            this.submitting = false
            this.displayMessage = true

            if (res && res.body && res.body.error) return this.error = res.body.message || res.body.error
            else if (err) return this.error = err

            this.success = true
          })
      },
      isValidTweetUrl: function (url) {
        return url && url.match(/^https:\/\/twitter\.com\/.*\/status\/\d+/) !== null
      }
    }
  }
</script>


