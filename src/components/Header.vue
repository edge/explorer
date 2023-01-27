<template>
    <header class="relative z-10 py-16 header md:pb-15" :class="{'menu-open':showNav}">
      <div class="container flex items-center justify-between">
        <Logo/>
        <BurgerButton @click="showNav = !showNav"/>
        <div id="menu" class="absolute left-0 right-0 flex flex-col flex-1 pt-12 pb-24 bg-black mobile-drop top-full md:static md:flex-row md:px-15 md:p-0">
          <Menu :mainNav="mainNav"/>
          <HeaderTools/>
        </div>
      </div>
    </header>
</template>

<script>
  import Logo from "@/components/Logo";
  import Menu from "@/components/Menu";
  import HeaderTools from "@/components/HeaderTools";
  import BurgerButton from "@/components/BurgerButton";

  export default {
    name: "Header",
    data: function () {
      return {
        showNav: false,
        mainNav: [
          {
            link: "/",
            text: "Overview"
          },
          {
            link: "/blocks",
            text: "Blocks"
          },
          {
            link: "/transactions",
            text: "Transactions"
          },
          {
            link: "/burns",
            text: "Burns"
          },
          {
            link: "/stakes",
            text: "Stakes"
          },
          {
            link: "/nodes",
            text: "Nodes"
          },
          {
            link: "/wallets",
            text: "Wallets"
          }
        ]
      }
    },
    watch: {
      $route () {
        this.showNav = false
      },
      showNav: 'bodyScrollLock',
    },
    methods: {
      bodyScrollLock () {
        const targetElement = document.querySelector('#menu')

        if (this.showNav) {
          bodyScrollLock.disableBodyScroll(targetElement)
        } else {
          bodyScrollLock.enableBodyScroll(targetElement)
        }
      }
    },
    components: {
      Logo,
      Menu,
      HeaderTools,
      BurgerButton
    }
  }
</script>
<style scoped>
  .header {
    @apply bg-black text-white;
  }

  .mobile-drop {
    height: calc((var(--vh) * 100) - 71px);
    transform: translateX(-100%);
    transition: 0.3s transform cubic-bezier(.01,.1,.11,1), 0.3s opacity cubic-bezier(.01,.1,.11,1), 0.3s visibility cubic-bezier(.01,.1,.11,1);
    @apply overflow-hidden overflow-y-auto opacity-0 invisible;
  }

  @screen md {
    .mobile-drop {
      transform: translateX(0);
      @apply h-auto overflow-visible opacity-100 visible;
    }
  }

  .menu-open .mobile-drop {
    transform: translateX(0);
    @apply opacity-100 visible;
  }
</style>