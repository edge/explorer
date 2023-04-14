<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="wallet" :title="'Wallet'" :address="address" />
    <HeroPanel v-else :title="'Wallets'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="address && wallet" class="container">
        <div>
          <div class="row mb-25">
            <WalletOverview :wallet="wallet" />
            <WalletSummary :wallet="wallet" />
          </div>
          <div>
            <h3>Wallet Transactions</h3>
            <TransactionsTable
              :limit="txsLimit"
              :receiveMetadata="onTransactionsUpdate"
              :page="txsCurrentPage"
            />
            <Pagination
              v-if="txsMetadata.totalCount > txsLimit"
              baseRoute="Wallet"
              :currentPage="txsCurrentPage"
              :limit="txsLimit"
              :totalCount="txsMetadata.totalCount"
              query="txsPage"
            />
          </div>
          <div class="mt-20">
            <h3>Wallet Stakes</h3>
            <div class="checkbox-container" @click="updateHideReleasedStakes" >
              <label>Hide Released Stakes</label>
              <input type="checkbox" :checked="hideReleasedStakes" />
              <span class="checkmark"></span>
            </div>
            <StakesTable
              :hideReleasedStakes="hideReleasedStakes"
              :limit="stakesLimit"
              :receiveMetadata="onStakesUpdate"
              :page="stakesCurrentPage"
            />
            <Pagination
              v-if="stakesMetadata.totalCount > stakesLimit"
              baseRoute="Wallet"
              :currentPage="stakesCurrentPage"
              :limit="stakesLimit"
              :totalCount="stakesMetadata.totalCount"
              query="stakesPage"
            />
          </div>
        </div>
      </div>
      <div v-else-if="!address" class="container">
        <WalletsTable
          :limit="limit"
          :receiveMetadata="onWalletsUpdate"
          :page="currentPage"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Wallets"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
      </div>
      <div v-else class="container h-full">
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This wallet doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different wallet, or <router-link to="/wallets" class="underline hover:text-green">view all wallets</router-link>.
          </p>
          <router-link to="/wallets">
            <a class="mt-20 button button--solid">View all wallets</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import HeroPanel from "@/components/HeroPanel.vue"
import Pagination from "@/components/Pagination.vue";
import RawData from "@/components/RawData.vue"
import StakesTable from "@/components/StakesTable.vue"
import TransactionsTable from "@/components/TransactionsTable.vue"
import WalletOverview from "@/components/WalletOverview.vue"
import WalletSummary from "@/components/WalletSummary.vue"
import WalletsTable from "@/components/WalletsTable.vue"
import { checksumAddressIsValid } from '@edge/wallet-utils'
import { fetchWallet } from '../utils/api'

const numRegEx = /^[-+]?\d*$/

export default {
  name: 'Wallets',
  title() {
    const parts = window.location.href.split('/')
    const last = parts[parts.length - 1]
    const secondToLast = parts[parts.length - 2]
    let walletAddress = ''
    if (checksumAddressIsValid(last)) walletAddress = last
    else if (checksumAddressIsValid(secondToLast)) walletAddress = secondToLast
    else return 'Wallets'

    return `Wallet ${walletAddress}`
  },
  data: function () {
    return {
      loading: true,
      pollInterval: 10000,
      polling: null,
      rawData: null,
      limit: 20,
      stakesLimit: 10,
      txsLimit: 10,
      metadata: { totalCount: 0 },
      stakesMetadata: { totalCount: 0 },
      txsMetadata: { totalCount: 0 },
      wallet: null,
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    RawData,
    StakesTable,
    TransactionsTable,
    WalletOverview,
    WalletSummary,
    WalletsTable
  },
  computed: {
    address() {
      return this.$route.params.address
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    hideReleasedStakes() {
      return this.$route.query.hideReleased === '1' || false
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    stakesCurrentPage() {
      return Math.max(1, parseInt(this.$route.query.stakesPage) || 1)
    },
    stakesLastPage() {
      return Math.max(1, Math.ceil(this.stakesMetadata.totalCount / this.stakesLimit))
    },
    txsCurrentPage() {
      return Math.max(1, parseInt(this.$route.query.txsPage) || 1)
    },
    txsLastPage() {
      return Math.max(1, Math.ceil(this.txsMetadata.totalCount / this.txsLimit))
    },
  },
  mounted() {
    if (this.address) {
      this.fetchData()
      this.pollData()
    }
  },
  methods: {
    beforeDestroy() {
      // Stops the data polling.
      clearInterval(this.polling)
    },
    async fetchData() {
      if (this.address) {
        this.loading = true
        const wallet = await fetchWallet(this.address)
        if (wallet.address) this.wallet = wallet
        else if (checksumAddressIsValid(this.address)) {
          this.wallet = {
            address: this.address,
            balance: 0,
            nonce: 0,
            txCount: 0
          }
        }
        this.loading = false
      }
    },
    onStakesUpdate(metadata) {
      this.stakesMetadata = metadata
    },
    onTransactionsUpdate(metadata) {
      this.txsMetadata = metadata
    },
    onWalletsUpdate(metadata) {
      this.metadata = metadata
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetchData()
      }, this.pollInterval)
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    updateHideReleasedStakes() {
      console.log('test')
      const hideReleased = !this.hideReleasedStakes ? 1 : undefined
      const query = { ...this.$route.query, hideReleased }
      this.$router.replace({ query })
    }
  },
  watch: {
    $route(to, from) {
      this.beforeDestroy()
      this.fetchData()
    },
    metadata() {
      if (this.$route.query.page) {
        if (this.$route.query.page < 1 || !numRegEx.test(this.$route.query.page)) this.$router.replace({ query: { ...this.$route.query, page: 1 } })
      }
      if (this.currentPage > this.lastPage) this.$router.replace({ query: { ...this.$route.query, page: this.lastPage } })
    },
    stakesMetadata() {
      if (this.$route.query.stakesPage) {
        if (this.$route.query.stakesPage < 1 || !numRegEx.test(this.$route.query.stakesPage)) this.$router.replace({ query: { ...this.$route.query, stakesPage: 1 } })
      }
      if (this.stakesCurrentPage > this.stakesLastPage) this.$router.replace({ query: { ...this.$route.query, stakesPage: this.stakesLastPage } })
    },
    txsMetadata() {
      if (this.$route.query.txsPage) {
        if (this.$route.query.txsPage < 1 || !numRegEx.test(this.$route.query.txsPage)) this.$router.replace({ query: { ...this.$route.query, txsPage: 1 } })
      }
      if (this.txsCurrentPage > this.txsLastPage) this.$router.replace({ query: { ...this.$route.query, txsPage: this.txsLastPage } })
    }
  }
}
</script>
<style scoped>
.row {
  @apply grid items-start grid-cols-1 gap-24;
  @apply lg:grid-cols-2;
}

.checkbox-container {
@apply flex items-center mb-10 justify-end;
cursor: pointer;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}

.checkbox-container label {
@apply cursor-pointer mr-5 mb-0;
}

.checkbox-container input {
opacity: 0;
height: 0;
width: 0;
}

/* Create custom checkbox */
.checkmark {
@apply cursor-pointer mr-5 mb-0;
position: relative;
height: 13px;
width: 13px;
border: solid 1px #787878;
border-radius: 3px;
}

/* On mouse-over, add grey background color */
.checkbox-container:hover input ~ .checkmark {
border-color: rgb(70, 70, 70);
}

/* When checkbox is checked, add green background */
.checkbox-container input:checked ~ .checkmark {
background-color: rgb(14,204,95);
border: none;
}

/* Create checkmark (hidden when not checked) */
.checkmark:after {
content: "";
position: absolute;
display: none;
}

/* Show checkmark when checked */
.checkbox-container input:checked ~ .checkmark:after {
display: block;
}

/* Style for checkmark */
.checkbox-container .checkmark:after {
left: 4px;
top: 1px;
width: 5px;
height: 9px;
border: solid white;
border-width: 0 2px 2px 0;
-webkit-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);
}
</style>
