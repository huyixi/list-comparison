// plugins/cropper.client.ts
import Cropper from "cropperjs";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      cropper: Cropper,
    },
  };
});
