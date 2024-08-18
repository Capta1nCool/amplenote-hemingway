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

            // Sentence Difficulty Detection
            let processedSentence;
            if (words < 14) {
              processedSentence = sentence;
            } else if (level >= 10 && level < 14) {
              processedSentence = `<mark style="background-color:#443A07;color:#F3DE6C;">${sentence}.</mark>`;
            } else if (level >= 14) {
              processedSentence = `<mark style="background-color:#441A14;color:#F5614C;">${sentence}.</mark>`;
            } else {
              processedSentence = sentence;
            }

            // Passive Sentences
            return this.getPassive(processedSentence);
          });
          p.innerHTML = analyzedSentences.join('. ') + '.';

          // Adverbs
          p.innerHTML = p.innerHTML.replace(/\b\w+ly\b/g, '<mark style="background-color:#11343a;color:#3AABB9;"> $& </mark>');
        });

        console.log(tempDiv.innerHTML);
        app.openSidebarEmbed(1, tempDiv.innerHTML);
      }
    }
  },

  renderEmbed(app, ...args) {
    return args;
  },

  getPassive(sent) {
    let words = sent.split(" ");
    let preWords = ["is", "are", "was", "were", "be", "been", "being"];
    for (let i = 0; i < words.length - 1; i++) {
      if (preWords.includes(words[i].toLowerCase()) && words[i + 1].match(/ed$/)) {
        words[i] = `<mark style="background-color:#0A2A2c;color:#65D2AA;">${words[i]}`;
        words[i + 2] = `${words[i + 2]}</mark>`;
      }
    }
    return words.join(" ");
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
