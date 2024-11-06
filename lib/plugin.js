const plugin = {
  noteOption: {
    "analyze note": {
      check: async function (app, noteUUID) {
        return true
      },
      run: async function (app, noteUUID) {
        let rfnotes = '';
        let rfnoteCount = 0;
        const note = await app.notes.find(noteUUID);
        const noteContent = await app.getNoteContent({ uuid: noteUUID });
        await this._loadRecordRTC("https://cdnjs.cloudflare.com/ajax/libs/marked/14.1.3/marked.min.js");
        await this._loadRecordRTC('https://cdnjs.cloudflare.com/ajax/libs/turndown/7.0.0/turndown.js')

        let turndownService = new TurndownService()

        function rgbToHex(rgb) {
          const result = rgb.match(/\d+/g);
          return `#${((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1)}`;
        }

        // Custom rule to keep the <mark> tag and convert RGB to HEX
        turndownService.addRule('keepMarkTag', {
          filter: ['mark'],
          replacement: function (content, node) {
            const backgroundColor = node.style.backgroundColor ? rgbToHex(node.style.backgroundColor) : '#ffff00';  // default to yellow
            const color = node.style.color ? rgbToHex(node.style.color) : '#000000';  // default to black
            return `<mark style="background-color:${backgroundColor};color:${color};">${content}</mark>`;
          }
        });

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
          p.innerHTML = analyzedSentences.join(' ');

          // Adverbs
          p.innerHTML = p.innerHTML.replace(/\b\w+ly\b/g, '<mark style="background-color:#11343a;color:#3AABB9;"> $& </mark>');

          // Justifier Words
          const justifierPattern = new RegExp(
            '\\b(' + Object.keys(this.constants.justifierWords).join('|') + ')\\b',
            'gi'
          );
          // Highlight justifier words in pink
          p.innerHTML = p.innerHTML.replace(justifierPattern, '<mark style="background-color:#211831;color:#8D68DA;""> $& </mark>');

          // Complex Words
          const complexPattern = new RegExp(
            '\\b(' + Object.keys(this.constants.phrases).join('|') + ')\\b',
            'gi'
          );

          // Highlight justifier words in purple
          p.innerHTML = p.innerHTML.replace(complexPattern, (match) => {
            rfnoteCount++;
            const alternatives = this.constants.phrases[match.toLowerCase()] || [];  // Find alternative words if any
            rfnotes += `\n\n
[^${rfnoteCount}]: [${match}]()
  alternative words: ${JSON.stringify(alternatives)}\n
`;

            return `[${match}][^${rfnoteCount}]`;
          });
        });

        //var turndownService = new TurndownService()
        var markdown = turndownService.turndown(tempDiv.innerHTML)
        markdown = markdown.replace(/\\([^\w\s])/g, '$1');

        markdown += rfnotes

        const uuid = await app.createNote(`Hemingway - ${note.name}`);
        app.insertNoteContent({ uuid: uuid }, markdown);
        app.navigate(`https://www.amplenote.com/notes/${uuid}`);
      }
    },
    "remove highlight": {
      check: async function (app, noteUUID) {
        return true
      },
      run: async function (app, noteUUID) {
        const regex = /<mark\s+style="background-color:(#2C1021;color:#E5569E|#211831;color:#8D68DA|#443A07;color:#F3DE6C|#441A14;color:#F5614C|#0A2A2c;color:#65D2AA|#11343a;color:#3AABB9);">|<\/mark>/gi;
        const noteContent = await app.getNoteContent({ uuid: noteUUID });
        const cleanedContent = noteContent.replace(regex, '');

        await app.replaceNoteContent({ uuid: noteUUID }, cleanedContent);
      }
    }
  },

  getComplex(sent) {
    const rfNotes = sent.match(/\[\^(\d+)\]:\s*<a\s+href="[^"]*">[^<]*<\/a>\./);

    console.log(rfNotes.length)
  },

  getPassive(sent) {
    let words = sent.split(" ");
    let preWords = ["is", "are", "was", "were", "be", "been", "being"];
    for (let i = 0; i < words.length - 1; i++) {
      if (preWords.includes(words[i]) && words[i + 1].match(/^[a-z]+(ed|done|gone)$/i)) {
        words[i] = `<mark style="background-color:#0A2A2c;color:#65D2AA;">${words[i]}`;
        words[i + 2] = `${words[i + 2]}</mark>`;
      }

      // Additional check for "by" phrase indicating passive voice
      if (words[i].toLowerCase() === "by" && i > 0 && preWords.includes(words[i - 2].toLowerCase())) {
        words[i - 2] = `<mark style="background-color:#0A2A2c;color:#65D2AA;">${words[i - 2]}`;
        words[i] = `${words[i]}</mark>`;
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

  _loadRecordRTC(url) {
    if (this._haveLoadedRecordRTC) return Promise.resolve(true);

    return new Promise(function (resolve) {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", url);
      script.addEventListener("load", function () {
        this._haveLoadedRecordRTC = true;
        resolve(true);
      });
      document.body.appendChild(script);
    });
  },

  constants: {
    justifierWords: {
      "i believe": 1,
      "i consider": 1,
      "i don't believe": 1,
      "i don't consider": 1,
      "i don't feel": 1,
      "i don't suggest": 1,
      "i don't think": 1,
      "i feel": 1,
      "i hope to": 1,
      "i might": 1,
      "i suggest": 1,
      "i think": 1,
      "i was wondering": 1,
      "i will try": 1,
      "i wonder": 1,
      "in my opinion": 1,
      "is kind of": 1,
      "is sort of": 1,
      "just": 1,
      "maybe": 1,
      "perhaps": 1,
      "possibly": 1,
      "we believe": 1,
      "we consider": 1,
      "we don't believe": 1,
      "we don't consider": 1,
      "we don't feel": 1,
      "we don't suggest": 1,
      "we don't think": 1,
      "we feel": 1,
      "we hope to": 1,
      "we might": 1,
      "we suggest": 1,
      "we think": 1,
      "we were wondering": 1,
      "we will try": 1,
      "we wonder": 1
    },

    phrases: {
      "a number of": ["many", "some"],
      "abundance": ["enough", "plenty"],
      "accede to": ["allow", "agree to"],
      "accelerate": ["speed up"],
      "accentuate": ["stress"],
      "accompany": ["go with", "with"],
      "accomplish": ["do"],
      "accorded": ["given"],
      "accrue": ["add", "gain"],
      "acquiesce": ["agree"],
      "acquire": ["get"],
      "additional": ["more", "extra"],
      "adjacent to": ["next to"],
      "adjustment": ["change"],
      "admissible": ["allowed", "accepted"],
      "advantageous": ["helpful"],
      "adversely impact": ["hurt"],
      "advise": ["tell"],
      "aforementioned": ["remove"],
      "aggregate": ["total", "add"],
      "aircraft": ["plane"],
      "all of": ["all"],
      "alleviate": ["ease", "reduce"],
      "allocate": ["divide"],
      "along the lines of": ["like", "as in"],
      "already existing": ["existing"],
      "alternatively": ["or"],
      "ameliorate": ["improve", "help"],
      "anticipate": ["expect"],
      "apparent": ["clear", "plain"],
      "appreciable": ["many"],
      "as a means of": ["to"],
      "as of yet": ["yet"],
      "as to": ["on", "about"],
      "as yet": ["yet"],
      "ascertain": ["find out", "learn"],
      "assistance": ["help"],
      "at this time": ["now"],
      "attain": ["meet"],
      "attributable to": ["because"],
      "authorize": ["allow", "let"],
      "because of the fact that": ["because"],
      "belated": ["late"],
      "benefit from": ["enjoy"],
      "bestow": ["give", "award"],
      "by virtue of": ["by", "under"],
      "cease": ["stop"],
      "close proximity": ["near"],
      "commence": ["begin or start"],
      "comply with": ["follow"],
      "concerning": ["about", "on"],
      "consequently": ["so"],
      "consolidate": ["join", "merge"],
      "constitutes": ["is", "forms", "makes up"],
      "demonstrate": ["prove", "show"],
      "depart": ["leave", "go"],
      "designate": ["choose", "name"],
      "discontinue": ["drop", "stop"],
      "due to the fact that": ["because", "since"],
      "each and every": ["each"],
      "economical": ["cheap"],
      "eliminate": ["cut", "drop", "end"],
      "elucidate": ["explain"],
      "employ": ["use"],
      "endeavor": ["try"],
      "enumerate": ["count"],
      "equitable": ["fair"],
      "equivalent": ["equal"],
      "evaluate": ["test", "check"],
      "evidenced": ["showed"],
      "exclusively": ["only"],
      "expedite": ["hurry"],
      "expend": ["spend"],
      "expiration": ["end"],
      "facilitate": ["ease", "help"],
      "factual evidence": ["facts", "evidence"],
      "feasible": ["workable"],
      "finalize": ["complete", "finish"],
      "first and foremost": ["first"],
      "for the purpose of": ["to"],
      "forfeit": ["lose", "give up"],
      "formulate": ["plan"],
      "honest truth": ["truth"],
      "however": ["but", "yet"],
      "if and when": ["if", "when"],
      "impacted": ["affected", "harmed", "changed"],
      "implement": ["install", "put in place", "tool"],
      "in a timely manner": ["on time"],
      "in accordance with": ["by", "under"],
      "in addition": ["also", "besides", "too"],
      "in all likelihood": ["probably"],
      "in an effort to": ["to"],
      "in between": ["between"],
      "in excess of": ["more than"],
      "in lieu of": ["instead"],
      "in light of the fact that": ["because"],
      "in many cases": ["often"],
      "in order to": ["to"],
      "in regard to": ["about", "concerning", "on"],
      "in some instances": ["sometimes"],
      "in terms of": ["omit"],
      "in the near future": ["soon"],
      "in the process of": ["omit"],
      "inception": ["start"],
      "incumbent upon": ["must"],
      "indicate": ["say", "state", "or show"],
      "indication": ["sign"],
      "initiate": ["start"],
      "is applicable to": ["applies to"],
      "is authorized to": ["may"],
      "is responsible for": ["handles"],
      "it is essential": ["must", "need to"],
      "literally": ["omit"],
      "magnitude": ["size"],
      "maximum": ["greatest", "largest", "most"],
      "methodology": ["method"],
      "minimize": ["cut"],
      "minimum": ["least", "smallest", "small"],
      "modify": ["change"],
      "monitor": ["check", "watch", "track"],
      "multiple": ["many"],
      "necessitate": ["cause", "need"],
      "nevertheless": ["still", "besides", "even so"],
      "not certain": ["uncertain"],
      "not many": ["few"],
      "not often": ["rarely"],
      "not unless": ["only if"],
      "not unlike": ["similar", "alike"],
      "notwithstanding": ["in spite of", "still"],
      "null and void": ["use either null or void"],
      "numerous": ["many"],
      "objective": ["aim", "fair", "goal"],
      "obligate": ["bind", "compel"],
      "obtain": ["get"],
      "on the contrary": ["but", "so"],
      "on the other hand": ["omit", "but", "so"],
      "one particular": ["one"],
      "optimum": ["best", "greatest", "most"],
      "overall": ["omit"],
      "owing to the fact that": ["because", "since"],
      "participate": ["take part"],
      "particulars": ["details"],
      "pass away": ["die"],
      "pertaining to": ["about", "of", "on"],
      "point in time": ["time", "point", "moment", "now"],
      "portion": ["part"],
      "possess": ["have", "own"],
      "preclude": ["prevent"],
      "previously": ["before"],
      "prior to": ["before"],
      "prioritize": ["rank", "focus on"],
      "procure": ["buy", "get"],
      "proficiency": ["skill"],
      "provided that": ["if"],
      "purchase": ["buy", "sale"],
      "put simply": ["omit"],
      "readily apparent": ["clear"],
      "refer back": ["refer"],
      "regarding": ["about", "of", "on"],
      "relocate": ["move"],
      "remainder": ["rest"],
      "remuneration": ["payment"],
      "require": ["must", "need"],
      "requirement": ["need", "rule"],
      "reside": ["live"],
      "residence": ["house"],
      "retain": ["keep"],
      "satisfy": ["meet", "please"],
      "shall": ["must", "will"],
      "should you wish": ["if you want"],
      "similar to": ["like"],
      "solicit": ["ask for", "request"],
      "span across": ["span", "cross"],
      "strategize": ["plan"],
      "subsequent": ["later", "next", "after", "then"],
      "substantial": ["large", "much"],
      "successfully complete": ["complete", "pass"],
      "sufficient": ["enough"],
      "terminate": ["end", "stop"],
      "the month of": ["omit"],
      "therefore": ["thus", "so"],
      "this day and age": ["today"],
      "time period": ["time", "period"],
      "took advantage of": ["preyed on"],
      "transmit": ["send"],
      "transpire": ["happen"],
      "until such time as": ["until"],
      "utilization": ["use"],
      "utilize": ["use"],
      "validate": ["confirm"],
      "various different": ["various", "different"],
      "whether or not": ["whether"],
      "with respect to": ["on", "about"],
      "with the exception of": ["except for"],
      "witnessed": ["saw", "seen"]
    }
  },
}
