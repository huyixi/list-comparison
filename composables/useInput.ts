export function useInput(initial = "") {
  const input = ref(initial);

  function setInput(text: string) {
    input.value = text;
  }

  function appendInput(text: string) {
    const needsNewline = input.value.length > 0 && !input.value.endsWith("\n");
    input.value += (needsNewline ? "\n" : "") + text;
  }

  function clearInput() {
    input.value = "";
  }

  return {
    input,
    setInput,
    appendInput,
    clearInput,
  };
}
