import { proofImportIsPossible } from "./arbitrary-plugin-module"

const plugin = {
  constants: {
  },

  insertText: {
  },

  noteOption: {
    "format note": {
      check: async function (app, noteUUID) {
        return true
      },
      run: async function (app, noteUUID) {
        const noteContent = await app.getNoteContent({ uuid: noteUUID });
        const { marked } = await import('./marked.min.js');

        const html = marked.parse(noteContent);

        app.openSidebarEmbed(html);
      }
    }
  },
};
export default plugin;
