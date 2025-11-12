export interface GlobalTools {
  notify: (message: string) => void;
  reload: () => void;
}

export const globalTools: GlobalTools = {
  notify(message: string) {
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
