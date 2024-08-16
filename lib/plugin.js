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
        const { marked } = await import('./marked.esm.js');

        const html = marked.parse(noteContent);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const paragraphs = Array.from(tempDiv.querySelectorAll('p'));

        paragraphs.forEach(p => {
          const sentences = p.innerHTML.split('.').filter(sentence => sentence.trim().length > 0);

          const analyzedSentences = sentences.map(sentence => {
            const words = sentence.split(" ").filter(word => word.length > 0).length;
            const letters = sentence.replace(/\s+/g, '').length; // Removing all spaces
            const level = this.calculateLevel(letters, words, 1);

            if (words < 14) {
              return sentence;
            } else if (level >= 10 && level < 14) {
              return `<mark style="background-color:#443A07;color:#F3DE6C;">${sentence}.</mark>`;
            } else if (level >= 14) {
              return `<mark style="background-color:#441A14;color:#F5614C;">${sentence}.</mark>`;
            } else {
              return sentence;
            }
          });

          p.innerHTML = analyzedSentences.join(' ');
        });

        app.openSidebarEmbed(1, tempDiv.innerHTML);
      }
    }
  },

  renderEmbed(app, ...args) {
    return args;
  },
  
  calculateLevel(letters, words, sentences) {
    if (words === 0 || sentences === 0) {
      return 0;
    }
    let level = Math.round(
      4.71 * (letters / words) + 0.5 * words / sentences - 21.43
    );
    return level <= 0 ? 0 : level;
  },
};
export default plugin;
