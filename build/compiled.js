(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };

  // lib/marked.min.js
  var marked_min_exports = {};
  var init_marked_min = __esm({
    "lib/marked.min.js"() {
      !function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).marked = {});
      }(void 0, function(e) {
        "use strict";
        function t() {
          return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
        }
        function n(t2) {
          e.defaults = t2;
        }
        e.defaults = { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
        const s = /[&<>"']/, r = new RegExp(s.source, "g"), i = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, l = new RegExp(i.source, "g"), o = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, a = (e2) => o[e2];
        function c(e2, t2) {
          if (t2) {
            if (s.test(e2))
              return e2.replace(r, a);
          } else if (i.test(e2))
            return e2.replace(l, a);
          return e2;
        }
        const h = /(^|[^\[])\^/g;
        function p(e2, t2) {
          let n2 = "string" == typeof e2 ? e2 : e2.source;
          t2 = t2 || "";
          const s2 = { replace: (e3, t3) => {
            let r2 = "string" == typeof t3 ? t3 : t3.source;
            return r2 = r2.replace(h, "$1"), n2 = n2.replace(e3, r2), s2;
          }, getRegex: () => new RegExp(n2, t2) };
          return s2;
        }
        function u(e2) {
          try {
            e2 = encodeURI(e2).replace(/%25/g, "%");
          } catch {
            return null;
          }
          return e2;
        }
        const k = { exec: () => null };
        function g(e2, t2) {
          const n2 = e2.replace(/\|/g, (e3, t3, n3) => {
            let s3 = false, r2 = t3;
            for (; --r2 >= 0 && "\\" === n3[r2]; )
              s3 = !s3;
            return s3 ? "|" : " |";
          }).split(/ \|/);
          let s2 = 0;
          if (n2[0].trim() || n2.shift(), n2.length > 0 && !n2[n2.length - 1].trim() && n2.pop(), t2)
            if (n2.length > t2)
              n2.splice(t2);
            else
              for (; n2.length < t2; )
                n2.push("");
          for (; s2 < n2.length; s2++)
            n2[s2] = n2[s2].trim().replace(/\\\|/g, "|");
          return n2;
        }
        function f(e2, t2, n2) {
          const s2 = e2.length;
          if (0 === s2)
            return "";
          let r2 = 0;
          for (; r2 < s2; ) {
            const i2 = e2.charAt(s2 - r2 - 1);
            if (i2 !== t2 || n2) {
              if (i2 === t2 || !n2)
                break;
              r2++;
            } else
              r2++;
          }
          return e2.slice(0, s2 - r2);
        }
        function d(e2, t2, n2, s2) {
          const r2 = t2.href, i2 = t2.title ? c(t2.title) : null, l2 = e2[1].replace(/\\([\[\]])/g, "$1");
          if ("!" !== e2[0].charAt(0)) {
            s2.state.inLink = true;
            const e3 = { type: "link", raw: n2, href: r2, title: i2, text: l2, tokens: s2.inlineTokens(l2) };
            return s2.state.inLink = false, e3;
          }
          return { type: "image", raw: n2, href: r2, title: i2, text: c(l2) };
        }
        class x {
          options;
          rules;
          lexer;
          constructor(t2) {
            this.options = t2 || e.defaults;
          }
          space(e2) {
            const t2 = this.rules.block.newline.exec(e2);
            if (t2 && t2[0].length > 0)
              return { type: "space", raw: t2[0] };
          }
          code(e2) {
            const t2 = this.rules.block.code.exec(e2);
            if (t2) {
              const e3 = t2[0].replace(/^ {1,4}/gm, "");
              return { type: "code", raw: t2[0], codeBlockStyle: "indented", text: this.options.pedantic ? e3 : f(e3, "\n") };
            }
          }
          fences(e2) {
            const t2 = this.rules.block.fences.exec(e2);
            if (t2) {
              const e3 = t2[0], n2 = function(e4, t3) {
                const n3 = e4.match(/^(\s+)(?:```)/);
                if (null === n3)
                  return t3;
                const s2 = n3[1];
                return t3.split("\n").map((e5) => {
                  const t4 = e5.match(/^\s+/);
                  if (null === t4)
                    return e5;
                  const [n4] = t4;
                  return n4.length >= s2.length ? e5.slice(s2.length) : e5;
                }).join("\n");
              }(e3, t2[3] || "");
              return { type: "code", raw: e3, lang: t2[2] ? t2[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t2[2], text: n2 };
            }
          }
          heading(e2) {
            const t2 = this.rules.block.heading.exec(e2);
            if (t2) {
              let e3 = t2[2].trim();
              if (/#$/.test(e3)) {
                const t3 = f(e3, "#");
                this.options.pedantic ? e3 = t3.trim() : t3 && !/ $/.test(t3) || (e3 = t3.trim());
              }
              return { type: "heading", raw: t2[0], depth: t2[1].length, text: e3, tokens: this.lexer.inline(e3) };
            }
          }
          hr(e2) {
            const t2 = this.rules.block.hr.exec(e2);
            if (t2)
              return { type: "hr", raw: f(t2[0], "\n") };
          }
          blockquote(e2) {
            const t2 = this.rules.block.blockquote.exec(e2);
            if (t2) {
              let e3 = f(t2[0], "\n").split("\n"), n2 = "", s2 = "";
              const r2 = [];
              for (; e3.length > 0; ) {
                let t3 = false;
                const i2 = [];
                let l2;
                for (l2 = 0; l2 < e3.length; l2++)
                  if (/^ {0,3}>/.test(e3[l2]))
                    i2.push(e3[l2]), t3 = true;
                  else {
                    if (t3)
                      break;
                    i2.push(e3[l2]);
                  }
                e3 = e3.slice(l2);
                const o2 = i2.join("\n"), a2 = o2.replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, "\n    $1").replace(/^ {0,3}>[ \t]?/gm, "");
                n2 = n2 ? `${n2}
${o2}` : o2, s2 = s2 ? `${s2}
${a2}` : a2;
                const c2 = this.lexer.state.top;
                if (this.lexer.state.top = true, this.lexer.blockTokens(a2, r2, true), this.lexer.state.top = c2, 0 === e3.length)
                  break;
                const h2 = r2[r2.length - 1];
                if ("code" === h2?.type)
                  break;
                if ("blockquote" === h2?.type) {
                  const t4 = h2, i3 = t4.raw + "\n" + e3.join("\n"), l3 = this.blockquote(i3);
                  r2[r2.length - 1] = l3, n2 = n2.substring(0, n2.length - t4.raw.length) + l3.raw, s2 = s2.substring(0, s2.length - t4.text.length) + l3.text;
                  break;
                }
                if ("list" !== h2?.type)
                  ;
                else {
                  const t4 = h2, i3 = t4.raw + "\n" + e3.join("\n"), l3 = this.list(i3);
                  r2[r2.length - 1] = l3, n2 = n2.substring(0, n2.length - h2.raw.length) + l3.raw, s2 = s2.substring(0, s2.length - t4.raw.length) + l3.raw, e3 = i3.substring(r2[r2.length - 1].raw.length).split("\n");
                }
              }
              return { type: "blockquote", raw: n2, tokens: r2, text: s2 };
            }
          }
          list(e2) {
            let t2 = this.rules.block.list.exec(e2);
            if (t2) {
              let n2 = t2[1].trim();
              const s2 = n2.length > 1, r2 = { type: "list", raw: "", ordered: s2, start: s2 ? +n2.slice(0, -1) : "", loose: false, items: [] };
              n2 = s2 ? `\\d{1,9}\\${n2.slice(-1)}` : `\\${n2}`, this.options.pedantic && (n2 = s2 ? n2 : "[*+-]");
              const i2 = new RegExp(`^( {0,3}${n2})((?:[	 ][^\\n]*)?(?:\\n|$))`);
              let l2 = false;
              for (; e2; ) {
                let n3 = false, s3 = "", o2 = "";
                if (!(t2 = i2.exec(e2)))
                  break;
                if (this.rules.block.hr.test(e2))
                  break;
                s3 = t2[0], e2 = e2.substring(s3.length);
                let a2 = t2[2].split("\n", 1)[0].replace(/^\t+/, (e3) => " ".repeat(3 * e3.length)), c2 = e2.split("\n", 1)[0], h2 = !a2.trim(), p2 = 0;
                if (this.options.pedantic ? (p2 = 2, o2 = a2.trimStart()) : h2 ? p2 = t2[1].length + 1 : (p2 = t2[2].search(/[^ ]/), p2 = p2 > 4 ? 1 : p2, o2 = a2.slice(p2), p2 += t2[1].length), h2 && /^ *$/.test(c2) && (s3 += c2 + "\n", e2 = e2.substring(c2.length + 1), n3 = true), !n3) {
                  const t3 = new RegExp(`^ {0,${Math.min(3, p2 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), n4 = new RegExp(`^ {0,${Math.min(3, p2 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), r3 = new RegExp(`^ {0,${Math.min(3, p2 - 1)}}(?:\`\`\`|~~~)`), i3 = new RegExp(`^ {0,${Math.min(3, p2 - 1)}}#`);
                  for (; e2; ) {
                    const l3 = e2.split("\n", 1)[0];
                    if (c2 = l3, this.options.pedantic && (c2 = c2.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), r3.test(c2))
                      break;
                    if (i3.test(c2))
                      break;
                    if (t3.test(c2))
                      break;
                    if (n4.test(e2))
                      break;
                    if (c2.search(/[^ ]/) >= p2 || !c2.trim())
                      o2 += "\n" + c2.slice(p2);
                    else {
                      if (h2)
                        break;
                      if (a2.search(/[^ ]/) >= 4)
                        break;
                      if (r3.test(a2))
                        break;
                      if (i3.test(a2))
                        break;
                      if (n4.test(a2))
                        break;
                      o2 += "\n" + c2;
                    }
                    h2 || c2.trim() || (h2 = true), s3 += l3 + "\n", e2 = e2.substring(l3.length + 1), a2 = c2.slice(p2);
                  }
                }
                r2.loose || (l2 ? r2.loose = true : /\n *\n *$/.test(s3) && (l2 = true));
                let u2, k2 = null;
                this.options.gfm && (k2 = /^\[[ xX]\] /.exec(o2), k2 && (u2 = "[ ] " !== k2[0], o2 = o2.replace(/^\[[ xX]\] +/, ""))), r2.items.push({ type: "list_item", raw: s3, task: !!k2, checked: u2, loose: false, text: o2, tokens: [] }), r2.raw += s3;
              }
              r2.items[r2.items.length - 1].raw = r2.items[r2.items.length - 1].raw.trimEnd(), r2.items[r2.items.length - 1].text = r2.items[r2.items.length - 1].text.trimEnd(), r2.raw = r2.raw.trimEnd();
              for (let e3 = 0; e3 < r2.items.length; e3++)
                if (this.lexer.state.top = false, r2.items[e3].tokens = this.lexer.blockTokens(r2.items[e3].text, []), !r2.loose) {
                  const t3 = r2.items[e3].tokens.filter((e4) => "space" === e4.type), n3 = t3.length > 0 && t3.some((e4) => /\n.*\n/.test(e4.raw));
                  r2.loose = n3;
                }
              if (r2.loose)
                for (let e3 = 0; e3 < r2.items.length; e3++)
                  r2.items[e3].loose = true;
              return r2;
            }
          }
          html(e2) {
            const t2 = this.rules.block.html.exec(e2);
            if (t2) {
              return { type: "html", block: true, raw: t2[0], pre: "pre" === t2[1] || "script" === t2[1] || "style" === t2[1], text: t2[0] };
            }
          }
          def(e2) {
            const t2 = this.rules.block.def.exec(e2);
            if (t2) {
              const e3 = t2[1].toLowerCase().replace(/\s+/g, " "), n2 = t2[2] ? t2[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s2 = t2[3] ? t2[3].substring(1, t2[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t2[3];
              return { type: "def", tag: e3, raw: t2[0], href: n2, title: s2 };
            }
          }
          table(e2) {
            const t2 = this.rules.block.table.exec(e2);
            if (!t2)
              return;
            if (!/[:|]/.test(t2[2]))
              return;
            const n2 = g(t2[1]), s2 = t2[2].replace(/^\||\| *$/g, "").split("|"), r2 = t2[3] && t2[3].trim() ? t2[3].replace(/\n[ \t]*$/, "").split("\n") : [], i2 = { type: "table", raw: t2[0], header: [], align: [], rows: [] };
            if (n2.length === s2.length) {
              for (const e3 of s2)
                /^ *-+: *$/.test(e3) ? i2.align.push("right") : /^ *:-+: *$/.test(e3) ? i2.align.push("center") : /^ *:-+ *$/.test(e3) ? i2.align.push("left") : i2.align.push(null);
              for (let e3 = 0; e3 < n2.length; e3++)
                i2.header.push({ text: n2[e3], tokens: this.lexer.inline(n2[e3]), header: true, align: i2.align[e3] });
              for (const e3 of r2)
                i2.rows.push(g(e3, i2.header.length).map((e4, t3) => ({ text: e4, tokens: this.lexer.inline(e4), header: false, align: i2.align[t3] })));
              return i2;
            }
          }
          lheading(e2) {
            const t2 = this.rules.block.lheading.exec(e2);
            if (t2)
              return { type: "heading", raw: t2[0], depth: "=" === t2[2].charAt(0) ? 1 : 2, text: t2[1], tokens: this.lexer.inline(t2[1]) };
          }
          paragraph(e2) {
            const t2 = this.rules.block.paragraph.exec(e2);
            if (t2) {
              const e3 = "\n" === t2[1].charAt(t2[1].length - 1) ? t2[1].slice(0, -1) : t2[1];
              return { type: "paragraph", raw: t2[0], text: e3, tokens: this.lexer.inline(e3) };
            }
          }
          text(e2) {
            const t2 = this.rules.block.text.exec(e2);
            if (t2)
              return { type: "text", raw: t2[0], text: t2[0], tokens: this.lexer.inline(t2[0]) };
          }
          escape(e2) {
            const t2 = this.rules.inline.escape.exec(e2);
            if (t2)
              return { type: "escape", raw: t2[0], text: c(t2[1]) };
          }
          tag(e2) {
            const t2 = this.rules.inline.tag.exec(e2);
            if (t2)
              return !this.lexer.state.inLink && /^<a /i.test(t2[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && /^<\/a>/i.test(t2[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t2[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t2[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t2[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t2[0] };
          }
          link(e2) {
            const t2 = this.rules.inline.link.exec(e2);
            if (t2) {
              const e3 = t2[2].trim();
              if (!this.options.pedantic && /^</.test(e3)) {
                if (!/>$/.test(e3))
                  return;
                const t3 = f(e3.slice(0, -1), "\\");
                if ((e3.length - t3.length) % 2 == 0)
                  return;
              } else {
                const e4 = function(e5, t3) {
                  if (-1 === e5.indexOf(t3[1]))
                    return -1;
                  let n3 = 0;
                  for (let s3 = 0; s3 < e5.length; s3++)
                    if ("\\" === e5[s3])
                      s3++;
                    else if (e5[s3] === t3[0])
                      n3++;
                    else if (e5[s3] === t3[1] && (n3--, n3 < 0))
                      return s3;
                  return -1;
                }(t2[2], "()");
                if (e4 > -1) {
                  const n3 = (0 === t2[0].indexOf("!") ? 5 : 4) + t2[1].length + e4;
                  t2[2] = t2[2].substring(0, e4), t2[0] = t2[0].substring(0, n3).trim(), t2[3] = "";
                }
              }
              let n2 = t2[2], s2 = "";
              if (this.options.pedantic) {
                const e4 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n2);
                e4 && (n2 = e4[1], s2 = e4[3]);
              } else
                s2 = t2[3] ? t2[3].slice(1, -1) : "";
              return n2 = n2.trim(), /^</.test(n2) && (n2 = this.options.pedantic && !/>$/.test(e3) ? n2.slice(1) : n2.slice(1, -1)), d(t2, { href: n2 ? n2.replace(this.rules.inline.anyPunctuation, "$1") : n2, title: s2 ? s2.replace(this.rules.inline.anyPunctuation, "$1") : s2 }, t2[0], this.lexer);
            }
          }
          reflink(e2, t2) {
            let n2;
            if ((n2 = this.rules.inline.reflink.exec(e2)) || (n2 = this.rules.inline.nolink.exec(e2))) {
              const e3 = t2[(n2[2] || n2[1]).replace(/\s+/g, " ").toLowerCase()];
              if (!e3) {
                const e4 = n2[0].charAt(0);
                return { type: "text", raw: e4, text: e4 };
              }
              return d(n2, e3, n2[0], this.lexer);
            }
          }
          emStrong(e2, t2, n2 = "") {
            let s2 = this.rules.inline.emStrongLDelim.exec(e2);
            if (!s2)
              return;
            if (s2[3] && n2.match(/[\p{L}\p{N}]/u))
              return;
            if (!(s2[1] || s2[2] || "") || !n2 || this.rules.inline.punctuation.exec(n2)) {
              const n3 = [...s2[0]].length - 1;
              let r2, i2, l2 = n3, o2 = 0;
              const a2 = "*" === s2[0][0] ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
              for (a2.lastIndex = 0, t2 = t2.slice(-1 * e2.length + n3); null != (s2 = a2.exec(t2)); ) {
                if (r2 = s2[1] || s2[2] || s2[3] || s2[4] || s2[5] || s2[6], !r2)
                  continue;
                if (i2 = [...r2].length, s2[3] || s2[4]) {
                  l2 += i2;
                  continue;
                }
                if ((s2[5] || s2[6]) && n3 % 3 && !((n3 + i2) % 3)) {
                  o2 += i2;
                  continue;
                }
                if (l2 -= i2, l2 > 0)
                  continue;
                i2 = Math.min(i2, i2 + l2 + o2);
                const t3 = [...s2[0]][0].length, a3 = e2.slice(0, n3 + s2.index + t3 + i2);
                if (Math.min(n3, i2) % 2) {
                  const e3 = a3.slice(1, -1);
                  return { type: "em", raw: a3, text: e3, tokens: this.lexer.inlineTokens(e3) };
                }
                const c2 = a3.slice(2, -2);
                return { type: "strong", raw: a3, text: c2, tokens: this.lexer.inlineTokens(c2) };
              }
            }
          }
          codespan(e2) {
            const t2 = this.rules.inline.code.exec(e2);
            if (t2) {
              let e3 = t2[2].replace(/\n/g, " ");
              const n2 = /[^ ]/.test(e3), s2 = /^ /.test(e3) && / $/.test(e3);
              return n2 && s2 && (e3 = e3.substring(1, e3.length - 1)), e3 = c(e3, true), { type: "codespan", raw: t2[0], text: e3 };
            }
          }
          br(e2) {
            const t2 = this.rules.inline.br.exec(e2);
            if (t2)
              return { type: "br", raw: t2[0] };
          }
          del(e2) {
            const t2 = this.rules.inline.del.exec(e2);
            if (t2)
              return { type: "del", raw: t2[0], text: t2[2], tokens: this.lexer.inlineTokens(t2[2]) };
          }
          autolink(e2) {
            const t2 = this.rules.inline.autolink.exec(e2);
            if (t2) {
              let e3, n2;
              return "@" === t2[2] ? (e3 = c(t2[1]), n2 = "mailto:" + e3) : (e3 = c(t2[1]), n2 = e3), { type: "link", raw: t2[0], text: e3, href: n2, tokens: [{ type: "text", raw: e3, text: e3 }] };
            }
          }
          url(e2) {
            let t2;
            if (t2 = this.rules.inline.url.exec(e2)) {
              let e3, n2;
              if ("@" === t2[2])
                e3 = c(t2[0]), n2 = "mailto:" + e3;
              else {
                let s2;
                do {
                  s2 = t2[0], t2[0] = this.rules.inline._backpedal.exec(t2[0])?.[0] ?? "";
                } while (s2 !== t2[0]);
                e3 = c(t2[0]), n2 = "www." === t2[1] ? "http://" + t2[0] : t2[0];
              }
              return { type: "link", raw: t2[0], text: e3, href: n2, tokens: [{ type: "text", raw: e3, text: e3 }] };
            }
          }
          inlineText(e2) {
            const t2 = this.rules.inline.text.exec(e2);
            if (t2) {
              let e3;
              return e3 = this.lexer.state.inRawBlock ? t2[0] : c(t2[0]), { type: "text", raw: t2[0], text: e3 };
            }
          }
        }
        const b = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, w = /(?:[*+-]|\d{1,9}[.)])/, m = p(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, w).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), y = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, $ = /(?!\s*\])(?:\\.|[^\[\]\\])+/, z = p(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", $).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), T = p(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, w).getRegex(), R = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", _ = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, A = p("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", _).replace("tag", R).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), S = p(y).replace("hr", b).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", R).getRegex(), I = { blockquote: p(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", S).getRegex(), code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, def: z, fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, hr: b, html: A, lheading: m, list: T, newline: /^(?: *(?:\n|$))+/, paragraph: S, table: k, text: /^[^\n]+/ }, E = p("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", b).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", R).getRegex(), q = { ...I, table: E, paragraph: p(y).replace("hr", b).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", E).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", R).getRegex() }, Z = { ...I, html: p(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: k, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: p(y).replace("hr", b).replace("heading", " *#{1,6} *[^\n]").replace("lheading", m).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, P = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, L = /^( {2,}|\\)\n(?!\s*$)/, Q = "\\p{P}\\p{S}", v = p(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, Q).getRegex(), B = p(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, Q).getRegex(), M = p("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, Q).getRegex(), O = p("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, Q).getRegex(), j = p(/\\([punct])/, "gu").replace(/punct/g, Q).getRegex(), D = p(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), C = p(_).replace("(?:-->|$)", "-->").getRegex(), H = p("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", C).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), U = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, X = p(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", U).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), F = p(/^!?\[(label)\]\[(ref)\]/).replace("label", U).replace("ref", $).getRegex(), N = p(/^!?\[(ref)\](?:\[\])?/).replace("ref", $).getRegex(), G = { _backpedal: k, anyPunctuation: j, autolink: D, blockSkip: /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g, br: L, code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, del: k, emStrongLDelim: B, emStrongRDelimAst: M, emStrongRDelimUnd: O, escape: P, link: X, nolink: N, punctuation: v, reflink: F, reflinkSearch: p("reflink|nolink(?!\\()", "g").replace("reflink", F).replace("nolink", N).getRegex(), tag: H, text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, url: k }, J = { ...G, link: p(/^!?\[(label)\]\((.*?)\)/).replace("label", U).getRegex(), reflink: p(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", U).getRegex() }, K = { ...G, escape: p(P).replace("])", "~|])").getRegex(), url: p(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/, text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/ }, V = { ...K, br: p(L).replace("{2,}", "*").getRegex(), text: p(K.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, W = { normal: I, gfm: q, pedantic: Z }, Y = { normal: G, gfm: K, breaks: V, pedantic: J };
        class ee {
          tokens;
          options;
          state;
          tokenizer;
          inlineQueue;
          constructor(t2) {
            this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t2 || e.defaults, this.options.tokenizer = this.options.tokenizer || new x(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
            const n2 = { block: W.normal, inline: Y.normal };
            this.options.pedantic ? (n2.block = W.pedantic, n2.inline = Y.pedantic) : this.options.gfm && (n2.block = W.gfm, this.options.breaks ? n2.inline = Y.breaks : n2.inline = Y.gfm), this.tokenizer.rules = n2;
          }
          static get rules() {
            return { block: W, inline: Y };
          }
          static lex(e2, t2) {
            return new ee(t2).lex(e2);
          }
          static lexInline(e2, t2) {
            return new ee(t2).inlineTokens(e2);
          }
          lex(e2) {
            e2 = e2.replace(/\r\n|\r/g, "\n"), this.blockTokens(e2, this.tokens);
            for (let e3 = 0; e3 < this.inlineQueue.length; e3++) {
              const t2 = this.inlineQueue[e3];
              this.inlineTokens(t2.src, t2.tokens);
            }
            return this.inlineQueue = [], this.tokens;
          }
          blockTokens(e2, t2 = [], n2 = false) {
            let s2, r2, i2;
            for (e2 = this.options.pedantic ? e2.replace(/\t/g, "    ").replace(/^ +$/gm, "") : e2.replace(/^( *)(\t+)/gm, (e3, t3, n3) => t3 + "    ".repeat(n3.length)); e2; )
              if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((n3) => !!(s2 = n3.call({ lexer: this }, e2, t2)) && (e2 = e2.substring(s2.raw.length), t2.push(s2), true))))
                if (s2 = this.tokenizer.space(e2))
                  e2 = e2.substring(s2.raw.length), 1 === s2.raw.length && t2.length > 0 ? t2[t2.length - 1].raw += "\n" : t2.push(s2);
                else if (s2 = this.tokenizer.code(e2))
                  e2 = e2.substring(s2.raw.length), r2 = t2[t2.length - 1], !r2 || "paragraph" !== r2.type && "text" !== r2.type ? t2.push(s2) : (r2.raw += "\n" + s2.raw, r2.text += "\n" + s2.text, this.inlineQueue[this.inlineQueue.length - 1].src = r2.text);
                else if (s2 = this.tokenizer.fences(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else if (s2 = this.tokenizer.heading(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else if (s2 = this.tokenizer.hr(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else if (s2 = this.tokenizer.blockquote(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else if (s2 = this.tokenizer.list(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else if (s2 = this.tokenizer.html(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else if (s2 = this.tokenizer.def(e2))
                  e2 = e2.substring(s2.raw.length), r2 = t2[t2.length - 1], !r2 || "paragraph" !== r2.type && "text" !== r2.type ? this.tokens.links[s2.tag] || (this.tokens.links[s2.tag] = { href: s2.href, title: s2.title }) : (r2.raw += "\n" + s2.raw, r2.text += "\n" + s2.raw, this.inlineQueue[this.inlineQueue.length - 1].src = r2.text);
                else if (s2 = this.tokenizer.table(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else if (s2 = this.tokenizer.lheading(e2))
                  e2 = e2.substring(s2.raw.length), t2.push(s2);
                else {
                  if (i2 = e2, this.options.extensions && this.options.extensions.startBlock) {
                    let t3 = 1 / 0;
                    const n3 = e2.slice(1);
                    let s3;
                    this.options.extensions.startBlock.forEach((e3) => {
                      s3 = e3.call({ lexer: this }, n3), "number" == typeof s3 && s3 >= 0 && (t3 = Math.min(t3, s3));
                    }), t3 < 1 / 0 && t3 >= 0 && (i2 = e2.substring(0, t3 + 1));
                  }
                  if (this.state.top && (s2 = this.tokenizer.paragraph(i2)))
                    r2 = t2[t2.length - 1], n2 && "paragraph" === r2?.type ? (r2.raw += "\n" + s2.raw, r2.text += "\n" + s2.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = r2.text) : t2.push(s2), n2 = i2.length !== e2.length, e2 = e2.substring(s2.raw.length);
                  else if (s2 = this.tokenizer.text(e2))
                    e2 = e2.substring(s2.raw.length), r2 = t2[t2.length - 1], r2 && "text" === r2.type ? (r2.raw += "\n" + s2.raw, r2.text += "\n" + s2.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = r2.text) : t2.push(s2);
                  else if (e2) {
                    const t3 = "Infinite loop on byte: " + e2.charCodeAt(0);
                    if (this.options.silent) {
                      console.error(t3);
                      break;
                    }
                    throw new Error(t3);
                  }
                }
            return this.state.top = true, t2;
          }
          inline(e2, t2 = []) {
            return this.inlineQueue.push({ src: e2, tokens: t2 }), t2;
          }
          inlineTokens(e2, t2 = []) {
            let n2, s2, r2, i2, l2, o2, a2 = e2;
            if (this.tokens.links) {
              const e3 = Object.keys(this.tokens.links);
              if (e3.length > 0)
                for (; null != (i2 = this.tokenizer.rules.inline.reflinkSearch.exec(a2)); )
                  e3.includes(i2[0].slice(i2[0].lastIndexOf("[") + 1, -1)) && (a2 = a2.slice(0, i2.index) + "[" + "a".repeat(i2[0].length - 2) + "]" + a2.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
            }
            for (; null != (i2 = this.tokenizer.rules.inline.blockSkip.exec(a2)); )
              a2 = a2.slice(0, i2.index) + "[" + "a".repeat(i2[0].length - 2) + "]" + a2.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
            for (; null != (i2 = this.tokenizer.rules.inline.anyPunctuation.exec(a2)); )
              a2 = a2.slice(0, i2.index) + "++" + a2.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
            for (; e2; )
              if (l2 || (o2 = ""), l2 = false, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((s3) => !!(n2 = s3.call({ lexer: this }, e2, t2)) && (e2 = e2.substring(n2.raw.length), t2.push(n2), true))))
                if (n2 = this.tokenizer.escape(e2))
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
                else if (n2 = this.tokenizer.tag(e2))
                  e2 = e2.substring(n2.raw.length), s2 = t2[t2.length - 1], s2 && "text" === n2.type && "text" === s2.type ? (s2.raw += n2.raw, s2.text += n2.text) : t2.push(n2);
                else if (n2 = this.tokenizer.link(e2))
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
                else if (n2 = this.tokenizer.reflink(e2, this.tokens.links))
                  e2 = e2.substring(n2.raw.length), s2 = t2[t2.length - 1], s2 && "text" === n2.type && "text" === s2.type ? (s2.raw += n2.raw, s2.text += n2.text) : t2.push(n2);
                else if (n2 = this.tokenizer.emStrong(e2, a2, o2))
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
                else if (n2 = this.tokenizer.codespan(e2))
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
                else if (n2 = this.tokenizer.br(e2))
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
                else if (n2 = this.tokenizer.del(e2))
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
                else if (n2 = this.tokenizer.autolink(e2))
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
                else if (this.state.inLink || !(n2 = this.tokenizer.url(e2))) {
                  if (r2 = e2, this.options.extensions && this.options.extensions.startInline) {
                    let t3 = 1 / 0;
                    const n3 = e2.slice(1);
                    let s3;
                    this.options.extensions.startInline.forEach((e3) => {
                      s3 = e3.call({ lexer: this }, n3), "number" == typeof s3 && s3 >= 0 && (t3 = Math.min(t3, s3));
                    }), t3 < 1 / 0 && t3 >= 0 && (r2 = e2.substring(0, t3 + 1));
                  }
                  if (n2 = this.tokenizer.inlineText(r2))
                    e2 = e2.substring(n2.raw.length), "_" !== n2.raw.slice(-1) && (o2 = n2.raw.slice(-1)), l2 = true, s2 = t2[t2.length - 1], s2 && "text" === s2.type ? (s2.raw += n2.raw, s2.text += n2.text) : t2.push(n2);
                  else if (e2) {
                    const t3 = "Infinite loop on byte: " + e2.charCodeAt(0);
                    if (this.options.silent) {
                      console.error(t3);
                      break;
                    }
                    throw new Error(t3);
                  }
                } else
                  e2 = e2.substring(n2.raw.length), t2.push(n2);
            return t2;
          }
        }
        class te {
          options;
          parser;
          constructor(t2) {
            this.options = t2 || e.defaults;
          }
          space(e2) {
            return "";
          }
          code({ text: e2, lang: t2, escaped: n2 }) {
            const s2 = (t2 || "").match(/^\S*/)?.[0], r2 = e2.replace(/\n$/, "") + "\n";
            return s2 ? '<pre><code class="language-' + c(s2) + '">' + (n2 ? r2 : c(r2, true)) + "</code></pre>\n" : "<pre><code>" + (n2 ? r2 : c(r2, true)) + "</code></pre>\n";
          }
          blockquote({ tokens: e2 }) {
            return `<blockquote>
${this.parser.parse(e2)}</blockquote>
`;
          }
          html({ text: e2 }) {
            return e2;
          }
          heading({ tokens: e2, depth: t2 }) {
            return `<h${t2}>${this.parser.parseInline(e2)}</h${t2}>
`;
          }
          hr(e2) {
            return "<hr>\n";
          }
          list(e2) {
            const t2 = e2.ordered, n2 = e2.start;
            let s2 = "";
            for (let t3 = 0; t3 < e2.items.length; t3++) {
              const n3 = e2.items[t3];
              s2 += this.listitem(n3);
            }
            const r2 = t2 ? "ol" : "ul";
            return "<" + r2 + (t2 && 1 !== n2 ? ' start="' + n2 + '"' : "") + ">\n" + s2 + "</" + r2 + ">\n";
          }
          listitem(e2) {
            let t2 = "";
            if (e2.task) {
              const n2 = this.checkbox({ checked: !!e2.checked });
              e2.loose ? e2.tokens.length > 0 && "paragraph" === e2.tokens[0].type ? (e2.tokens[0].text = n2 + " " + e2.tokens[0].text, e2.tokens[0].tokens && e2.tokens[0].tokens.length > 0 && "text" === e2.tokens[0].tokens[0].type && (e2.tokens[0].tokens[0].text = n2 + " " + e2.tokens[0].tokens[0].text)) : e2.tokens.unshift({ type: "text", raw: n2 + " ", text: n2 + " " }) : t2 += n2 + " ";
            }
            return t2 += this.parser.parse(e2.tokens, !!e2.loose), `<li>${t2}</li>
`;
          }
          checkbox({ checked: e2 }) {
            return "<input " + (e2 ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
          }
          paragraph({ tokens: e2 }) {
            return `<p>${this.parser.parseInline(e2)}</p>
`;
          }
          table(e2) {
            let t2 = "", n2 = "";
            for (let t3 = 0; t3 < e2.header.length; t3++)
              n2 += this.tablecell(e2.header[t3]);
            t2 += this.tablerow({ text: n2 });
            let s2 = "";
            for (let t3 = 0; t3 < e2.rows.length; t3++) {
              const r2 = e2.rows[t3];
              n2 = "";
              for (let e3 = 0; e3 < r2.length; e3++)
                n2 += this.tablecell(r2[e3]);
              s2 += this.tablerow({ text: n2 });
            }
            return s2 && (s2 = `<tbody>${s2}</tbody>`), "<table>\n<thead>\n" + t2 + "</thead>\n" + s2 + "</table>\n";
          }
          tablerow({ text: e2 }) {
            return `<tr>
${e2}</tr>
`;
          }
          tablecell(e2) {
            const t2 = this.parser.parseInline(e2.tokens), n2 = e2.header ? "th" : "td";
            return (e2.align ? `<${n2} align="${e2.align}">` : `<${n2}>`) + t2 + `</${n2}>
`;
          }
          strong({ tokens: e2 }) {
            return `<strong>${this.parser.parseInline(e2)}</strong>`;
          }
          em({ tokens: e2 }) {
            return `<em>${this.parser.parseInline(e2)}</em>`;
          }
          codespan({ text: e2 }) {
            return `<code>${e2}</code>`;
          }
          br(e2) {
            return "<br>";
          }
          del({ tokens: e2 }) {
            return `<del>${this.parser.parseInline(e2)}</del>`;
          }
          link({ href: e2, title: t2, tokens: n2 }) {
            const s2 = this.parser.parseInline(n2), r2 = u(e2);
            if (null === r2)
              return s2;
            let i2 = '<a href="' + (e2 = r2) + '"';
            return t2 && (i2 += ' title="' + t2 + '"'), i2 += ">" + s2 + "</a>", i2;
          }
          image({ href: e2, title: t2, text: n2 }) {
            const s2 = u(e2);
            if (null === s2)
              return n2;
            let r2 = `<img src="${e2 = s2}" alt="${n2}"`;
            return t2 && (r2 += ` title="${t2}"`), r2 += ">", r2;
          }
          text(e2) {
            return "tokens" in e2 && e2.tokens ? this.parser.parseInline(e2.tokens) : e2.text;
          }
        }
        class ne {
          strong({ text: e2 }) {
            return e2;
          }
          em({ text: e2 }) {
            return e2;
          }
          codespan({ text: e2 }) {
            return e2;
          }
          del({ text: e2 }) {
            return e2;
          }
          html({ text: e2 }) {
            return e2;
          }
          text({ text: e2 }) {
            return e2;
          }
          link({ text: e2 }) {
            return "" + e2;
          }
          image({ text: e2 }) {
            return "" + e2;
          }
          br() {
            return "";
          }
        }
        class se {
          options;
          renderer;
          textRenderer;
          constructor(t2) {
            this.options = t2 || e.defaults, this.options.renderer = this.options.renderer || new te(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ne();
          }
          static parse(e2, t2) {
            return new se(t2).parse(e2);
          }
          static parseInline(e2, t2) {
            return new se(t2).parseInline(e2);
          }
          parse(e2, t2 = true) {
            let n2 = "";
            for (let s2 = 0; s2 < e2.length; s2++) {
              const r2 = e2[s2];
              if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[r2.type]) {
                const e3 = r2, t3 = this.options.extensions.renderers[e3.type].call({ parser: this }, e3);
                if (false !== t3 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(e3.type)) {
                  n2 += t3 || "";
                  continue;
                }
              }
              const i2 = r2;
              switch (i2.type) {
                case "space":
                  n2 += this.renderer.space(i2);
                  continue;
                case "hr":
                  n2 += this.renderer.hr(i2);
                  continue;
                case "heading":
                  n2 += this.renderer.heading(i2);
                  continue;
                case "code":
                  n2 += this.renderer.code(i2);
                  continue;
                case "table":
                  n2 += this.renderer.table(i2);
                  continue;
                case "blockquote":
                  n2 += this.renderer.blockquote(i2);
                  continue;
                case "list":
                  n2 += this.renderer.list(i2);
                  continue;
                case "html":
                  n2 += this.renderer.html(i2);
                  continue;
                case "paragraph":
                  n2 += this.renderer.paragraph(i2);
                  continue;
                case "text": {
                  let r3 = i2, l2 = this.renderer.text(r3);
                  for (; s2 + 1 < e2.length && "text" === e2[s2 + 1].type; )
                    r3 = e2[++s2], l2 += "\n" + this.renderer.text(r3);
                  n2 += t2 ? this.renderer.paragraph({ type: "paragraph", raw: l2, text: l2, tokens: [{ type: "text", raw: l2, text: l2 }] }) : l2;
                  continue;
                }
                default: {
                  const e3 = 'Token with "' + i2.type + '" type was not found.';
                  if (this.options.silent)
                    return console.error(e3), "";
                  throw new Error(e3);
                }
              }
            }
            return n2;
          }
          parseInline(e2, t2) {
            t2 = t2 || this.renderer;
            let n2 = "";
            for (let s2 = 0; s2 < e2.length; s2++) {
              const r2 = e2[s2];
              if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[r2.type]) {
                const e3 = this.options.extensions.renderers[r2.type].call({ parser: this }, r2);
                if (false !== e3 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(r2.type)) {
                  n2 += e3 || "";
                  continue;
                }
              }
              const i2 = r2;
              switch (i2.type) {
                case "escape":
                case "text":
                  n2 += t2.text(i2);
                  break;
                case "html":
                  n2 += t2.html(i2);
                  break;
                case "link":
                  n2 += t2.link(i2);
                  break;
                case "image":
                  n2 += t2.image(i2);
                  break;
                case "strong":
                  n2 += t2.strong(i2);
                  break;
                case "em":
                  n2 += t2.em(i2);
                  break;
                case "codespan":
                  n2 += t2.codespan(i2);
                  break;
                case "br":
                  n2 += t2.br(i2);
                  break;
                case "del":
                  n2 += t2.del(i2);
                  break;
                default: {
                  const e3 = 'Token with "' + i2.type + '" type was not found.';
                  if (this.options.silent)
                    return console.error(e3), "";
                  throw new Error(e3);
                }
              }
            }
            return n2;
          }
        }
        class re {
          options;
          constructor(t2) {
            this.options = t2 || e.defaults;
          }
          static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
          preprocess(e2) {
            return e2;
          }
          postprocess(e2) {
            return e2;
          }
          processAllTokens(e2) {
            return e2;
          }
        }
        class ie {
          defaults = { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
          options = this.setOptions;
          parse = this.parseMarkdown(ee.lex, se.parse);
          parseInline = this.parseMarkdown(ee.lexInline, se.parseInline);
          Parser = se;
          Renderer = te;
          TextRenderer = ne;
          Lexer = ee;
          Tokenizer = x;
          Hooks = re;
          constructor(...e2) {
            this.use(...e2);
          }
          walkTokens(e2, t2) {
            let n2 = [];
            for (const s2 of e2)
              switch (n2 = n2.concat(t2.call(this, s2)), s2.type) {
                case "table": {
                  const e3 = s2;
                  for (const s3 of e3.header)
                    n2 = n2.concat(this.walkTokens(s3.tokens, t2));
                  for (const s3 of e3.rows)
                    for (const e4 of s3)
                      n2 = n2.concat(this.walkTokens(e4.tokens, t2));
                  break;
                }
                case "list": {
                  const e3 = s2;
                  n2 = n2.concat(this.walkTokens(e3.items, t2));
                  break;
                }
                default: {
                  const e3 = s2;
                  this.defaults.extensions?.childTokens?.[e3.type] ? this.defaults.extensions.childTokens[e3.type].forEach((s3) => {
                    const r2 = e3[s3].flat(1 / 0);
                    n2 = n2.concat(this.walkTokens(r2, t2));
                  }) : e3.tokens && (n2 = n2.concat(this.walkTokens(e3.tokens, t2)));
                }
              }
            return n2;
          }
          use(...e2) {
            const t2 = this.defaults.extensions || { renderers: {}, childTokens: {} };
            return e2.forEach((e3) => {
              const n2 = { ...e3 };
              if (n2.async = this.defaults.async || n2.async || false, e3.extensions && (e3.extensions.forEach((e4) => {
                if (!e4.name)
                  throw new Error("extension name required");
                if ("renderer" in e4) {
                  const n3 = t2.renderers[e4.name];
                  t2.renderers[e4.name] = n3 ? function(...t3) {
                    let s2 = e4.renderer.apply(this, t3);
                    return false === s2 && (s2 = n3.apply(this, t3)), s2;
                  } : e4.renderer;
                }
                if ("tokenizer" in e4) {
                  if (!e4.level || "block" !== e4.level && "inline" !== e4.level)
                    throw new Error("extension level must be 'block' or 'inline'");
                  const n3 = t2[e4.level];
                  n3 ? n3.unshift(e4.tokenizer) : t2[e4.level] = [e4.tokenizer], e4.start && ("block" === e4.level ? t2.startBlock ? t2.startBlock.push(e4.start) : t2.startBlock = [e4.start] : "inline" === e4.level && (t2.startInline ? t2.startInline.push(e4.start) : t2.startInline = [e4.start]));
                }
                "childTokens" in e4 && e4.childTokens && (t2.childTokens[e4.name] = e4.childTokens);
              }), n2.extensions = t2), e3.renderer) {
                const t3 = this.defaults.renderer || new te(this.defaults);
                for (const n3 in e3.renderer) {
                  if (!(n3 in t3))
                    throw new Error(`renderer '${n3}' does not exist`);
                  if (["options", "parser"].includes(n3))
                    continue;
                  const s2 = n3, r2 = e3.renderer[s2], i2 = t3[s2];
                  t3[s2] = (...e4) => {
                    let n4 = r2.apply(t3, e4);
                    return false === n4 && (n4 = i2.apply(t3, e4)), n4 || "";
                  };
                }
                n2.renderer = t3;
              }
              if (e3.tokenizer) {
                const t3 = this.defaults.tokenizer || new x(this.defaults);
                for (const n3 in e3.tokenizer) {
                  if (!(n3 in t3))
                    throw new Error(`tokenizer '${n3}' does not exist`);
                  if (["options", "rules", "lexer"].includes(n3))
                    continue;
                  const s2 = n3, r2 = e3.tokenizer[s2], i2 = t3[s2];
                  t3[s2] = (...e4) => {
                    let n4 = r2.apply(t3, e4);
                    return false === n4 && (n4 = i2.apply(t3, e4)), n4;
                  };
                }
                n2.tokenizer = t3;
              }
              if (e3.hooks) {
                const t3 = this.defaults.hooks || new re();
                for (const n3 in e3.hooks) {
                  if (!(n3 in t3))
                    throw new Error(`hook '${n3}' does not exist`);
                  if ("options" === n3)
                    continue;
                  const s2 = n3, r2 = e3.hooks[s2], i2 = t3[s2];
                  re.passThroughHooks.has(n3) ? t3[s2] = (e4) => {
                    if (this.defaults.async)
                      return Promise.resolve(r2.call(t3, e4)).then((e5) => i2.call(t3, e5));
                    const n4 = r2.call(t3, e4);
                    return i2.call(t3, n4);
                  } : t3[s2] = (...e4) => {
                    let n4 = r2.apply(t3, e4);
                    return false === n4 && (n4 = i2.apply(t3, e4)), n4;
                  };
                }
                n2.hooks = t3;
              }
              if (e3.walkTokens) {
                const t3 = this.defaults.walkTokens, s2 = e3.walkTokens;
                n2.walkTokens = function(e4) {
                  let n3 = [];
                  return n3.push(s2.call(this, e4)), t3 && (n3 = n3.concat(t3.call(this, e4))), n3;
                };
              }
              this.defaults = { ...this.defaults, ...n2 };
            }), this;
          }
          setOptions(e2) {
            return this.defaults = { ...this.defaults, ...e2 }, this;
          }
          lexer(e2, t2) {
            return ee.lex(e2, t2 ?? this.defaults);
          }
          parser(e2, t2) {
            return se.parse(e2, t2 ?? this.defaults);
          }
          parseMarkdown(e2, t2) {
            return (n2, s2) => {
              const r2 = { ...s2 }, i2 = { ...this.defaults, ...r2 }, l2 = this.onError(!!i2.silent, !!i2.async);
              if (true === this.defaults.async && false === r2.async)
                return l2(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
              if (null == n2)
                return l2(new Error("marked(): input parameter is undefined or null"));
              if ("string" != typeof n2)
                return l2(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n2) + ", string expected"));
              if (i2.hooks && (i2.hooks.options = i2), i2.async)
                return Promise.resolve(i2.hooks ? i2.hooks.preprocess(n2) : n2).then((t3) => e2(t3, i2)).then((e3) => i2.hooks ? i2.hooks.processAllTokens(e3) : e3).then((e3) => i2.walkTokens ? Promise.all(this.walkTokens(e3, i2.walkTokens)).then(() => e3) : e3).then((e3) => t2(e3, i2)).then((e3) => i2.hooks ? i2.hooks.postprocess(e3) : e3).catch(l2);
              try {
                i2.hooks && (n2 = i2.hooks.preprocess(n2));
                let s3 = e2(n2, i2);
                i2.hooks && (s3 = i2.hooks.processAllTokens(s3)), i2.walkTokens && this.walkTokens(s3, i2.walkTokens);
                let r3 = t2(s3, i2);
                return i2.hooks && (r3 = i2.hooks.postprocess(r3)), r3;
              } catch (e3) {
                return l2(e3);
              }
            };
          }
          onError(e2, t2) {
            return (n2) => {
              if (n2.message += "\nPlease report this to https://github.com/markedjs/marked.", e2) {
                const e3 = "<p>An error occurred:</p><pre>" + c(n2.message + "", true) + "</pre>";
                return t2 ? Promise.resolve(e3) : e3;
              }
              if (t2)
                return Promise.reject(n2);
              throw n2;
            };
          }
        }
        const le = new ie();
        function oe(e2, t2) {
          return le.parse(e2, t2);
        }
        oe.options = oe.setOptions = function(e2) {
          return le.setOptions(e2), oe.defaults = le.defaults, n(oe.defaults), oe;
        }, oe.getDefaults = t, oe.defaults = e.defaults, oe.use = function(...e2) {
          return le.use(...e2), oe.defaults = le.defaults, n(oe.defaults), oe;
        }, oe.walkTokens = function(e2, t2) {
          return le.walkTokens(e2, t2);
        }, oe.parseInline = le.parseInline, oe.Parser = se, oe.parser = se.parse, oe.Renderer = te, oe.TextRenderer = ne, oe.Lexer = ee, oe.lexer = ee.lex, oe.Tokenizer = x, oe.Hooks = re, oe.parse = oe;
        const ae = oe.options, ce = oe.setOptions, he = oe.use, pe = oe.walkTokens, ue = oe.parseInline, ke = oe, ge = se.parse, fe = ee.lex;
        e.Hooks = re, e.Lexer = ee, e.Marked = ie, e.Parser = se, e.Renderer = te, e.TextRenderer = ne, e.Tokenizer = x, e.getDefaults = t, e.lexer = fe, e.marked = oe, e.options = ae, e.parse = ke, e.parseInline = ue, e.parser = ge, e.setOptions = ce, e.use = he, e.walkTokens = pe;
      });
    }
  });

  // lib/plugin.js
  var plugin = {
    constants: {},
    insertText: {},
    noteOption: {
      "format note": {
        check: async function(app, noteUUID) {
          return true;
        },
        run: async function(app, noteUUID) {
          const noteContent = await app.getNoteContent({ uuid: noteUUID });
          const { marked } = await Promise.resolve().then(() => (init_marked_min(), marked_min_exports));
          const html = marked.parse(noteContent);
          app.openSidebarEmbed(html);
        }
      }
    }
  };
  var plugin_default = plugin;
})();
