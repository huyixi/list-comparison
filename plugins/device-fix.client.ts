export default defineNuxtPlugin({
  name: "device-fix",
  enforce: "post",
  setup() {
    const device = useDevice();
    const ipadTabletFix = useCookie("ipadTabletFix", {
      maxAge: 60 * 60 * 24 * 365,
    });

    if (import.meta.server) {
      if (ipadTabletFix?.value === true) {
        device.isTablet = true;
        device.isMobileOrTablet = true;
        device.isDesktop = false;
      }
    }

    if (import.meta.client) {
      if (
        !device.isTablet &&
        !device.isMobile &&
        device.isApple &&
        window.ontouchstart !== undefined
      ) {
        device.isTablet = true;
        device.isMobileOrTablet = true;
        device.isDesktop = false;

        if (!ipadTabletFix.value) {
          // Set cookie to fix iPad tablet detection and reload Nuxt app
          ipadTabletFix.value = true;
          reloadNuxtApp({ force: true });
        }
      }
    }
  },
});
