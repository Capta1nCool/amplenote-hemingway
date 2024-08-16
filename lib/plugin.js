import * as markedModule from './marked.min.js';

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
        // const { marked } = await import('./marked.js');

        // const html = marked.parse(noteContent);

        // app.openSidebarEmbed(html);

        console.log(markedModule)
      }
    }
  },
};
export default plugin;
