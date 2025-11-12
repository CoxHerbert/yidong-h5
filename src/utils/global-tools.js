export const globalTools = {
  notify(message) {
    if (typeof window !== 'undefined') {
      window.alert(message);
    } else {
      console.info('[Global notify]:', message);
    }
  },
  reload() {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },
};
