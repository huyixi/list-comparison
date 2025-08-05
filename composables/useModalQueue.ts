// composables/useModalQueue.ts
type ModalTask = () => Promise<void>;

const queue: ModalTask[] = [];
const isRunning = ref(false);

export const useModalQueue = () => {
  const queueModal = (task: ModalTask) => {
    queue.push(task);
    runQueue();
  };

  const runQueue = async () => {
    if (isRunning.value) return;
    isRunning.value = true;

    while (queue.length > 0) {
      const task = queue.shift();
      if (task) {
        await task();
      }
    }
    isRunning.value = false;
  };

  return { queueModal };
};
