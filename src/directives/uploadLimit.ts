import type { ObjectDirective } from 'vue';

function updateEntrance(el: HTMLElement, disabled: boolean) {
  // Disable only the entrance so existing files can still be removed.
  const entrance = el.querySelector<HTMLElement>('.el-upload');
  if (!entrance) return;
  entrance.inert = disabled;
  entrance.setAttribute('aria-disabled', String(disabled));
  entrance.classList.toggle('is-limit-reached', disabled);
}

export const vUploadLimit: ObjectDirective<HTMLElement, boolean> = {
  mounted(el, binding) {
    updateEntrance(el, binding.value);
    el.addEventListener('drop', (event) => {
      if ((event.target as HTMLElement).closest('.el-upload.is-limit-reached')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  },
  updated(el, binding) {
    updateEntrance(el, binding.value);
  },
};
