import { ref } from 'vue';
import { defineStore } from 'pinia';

type Device = 'mobile' | 'desktop';

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false);
  const device = ref<Device>('desktop');

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function setDevice(value: Device) {
    device.value = value;
    sidebarCollapsed.value = value === 'mobile';
  }

  return {
    sidebarCollapsed,
    device,
    toggleSidebar,
    setDevice,
  };
});
