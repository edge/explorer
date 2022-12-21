
<template>
  <ul class="header-tools">
    <li class="header-tools__item">
      <a :href="governanceUrl" class="header-tools__link" target="_blank" rel="noreferrer">
        <span class="header-tools__icon">
          <AnnotationIcon/>
        </span>
        Governance
      </a>
    </li>
    <li class="header-tools__item">
      <a :href="walletUrl" class="header-tools__link" target="_blank" rel="noreferrer">
        <span class="header-tools__icon">
          <CreditCardIcon/>
        </span>
        Wallet
      </a>
    </li>
  </ul>
</template>

<script>
  import { AnnotationIcon, CreditCardIcon } from "@heroicons/vue/outline";
  export default {
    name: "HeaderTools",
    components: { AnnotationIcon, CreditCardIcon },
    data() {
      return {
        governanceUrl: process.env.VUE_APP_GOVERNANCE_URL,
        walletUrl: process.env.VUE_APP_IS_TESTNET === 'true' ? 'https://wallet.test.network' : 'https://wallet.xe.network'
      }
    }
  }
</script>

<style scoped>
  .header-tools {
    @apply mt-auto px-15 flex-shrink-0;
  }

  .header-tools__link {
    @apply flex items-center text-gray transition-colors hover:text-white p-12 block;
  }

  .header-tools__icon {
    @apply block flex-shrink-0 mr-7 w-20;
  }

  @screen md {
    .header-tools {
      @apply flex flex-wrap mt-0 px-0;
    }

    .header-tools__item {
      @apply flex flex-wrap ml-32;
    }

    .header-tools__link {
      @apply p-0;
    }
  }
</style>