// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register("types", [], function (exports_1, context_1) {
  "use strict";
  var ACTIONS;
  var __moduleName = context_1 && context_1.id;
  return {
    setters: [],
    execute: function () {
      (function (ACTIONS) {
        ACTIONS[ACTIONS["NONE"] = 0] = "NONE";
        ACTIONS[ACTIONS["CHOOSE"] = 1] = "CHOOSE";
        ACTIONS[ACTIONS["QUESTION"] = 2] = "QUESTION";
      })(ACTIONS || (ACTIONS = {}));
      exports_1("ACTIONS", ACTIONS);
    },
  };
});
System.register("printer", [], function (exports_2, context_2) {
  "use strict";
  var dividerChar, Printer;
  var __moduleName = context_2 && context_2.id;
  return {
    setters: [],
    execute: function () {
      dividerChar = "-";
      Printer = class Printer {
        constructor(config) {
          this.silent = false;
          this.writeLine = (value, includeNewline) => {
            if (!this.silent) {
              const e = new TextEncoder().encode(
                `${value}${includeNewline ? "\n" : ""}`,
              );
              Deno.stdout.writeSync(Uint8Array.from(e));
            }
          };
          this.print = (value, includeNewline) => {
            this.writeLine(value, includeNewline);
          };
          this.newline = () => {
            this.writeLine("\n", false);
          };
          this.divider = (length = 10) => {
            let outStr = "";
            for (let i = 0; i < length; i++) {
              outStr += dividerChar;
            }
            this.writeLine(outStr, true);
          };
          this.silent = config?.silent ?? false;
        }
      };
      exports_2("default", Printer);
    },
  };
});
System.register("history", ["types"], function (exports_3, context_3) {
  "use strict";
  var types_ts_1, History;
  var __moduleName = context_3 && context_3.id;
  return {
    setters: [
      function (types_ts_1_1) {
        types_ts_1 = types_ts_1_1;
      },
    ],
    execute: function () {
      History = class History {
        constructor() {
          this.last = {
            argument: "",
            lastOptionClose: false,
            action: types_ts_1.ACTIONS.NONE,
            includeNewline: false,
          };
          this.save = (argument, action, lastOptionClose, includeNewline) => {
            this.last = {
              argument,
              lastOptionClose: lastOptionClose ?? this.last.lastOptionClose,
              includeNewline: includeNewline ?? this.last.includeNewline,
              action,
            };
          };
          this.retrieve = () => {
            return this.last;
          };
        }
      };
      exports_3("default", History);
    },
  };
});
System.register(
  "index",
  ["types", "printer", "history"],
  function (exports_4, context_4) {
    "use strict";
    var types_ts_2, printer_ts_1, history_ts_1, InputLoop;
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [
        function (types_ts_2_1) {
          types_ts_2 = types_ts_2_1;
        },
        function (printer_ts_1_1) {
          printer_ts_1 = printer_ts_1_1;
        },
        function (history_ts_1_1) {
          history_ts_1 = history_ts_1_1;
        },
      ],
      execute: function () {
        InputLoop = class InputLoop {
          constructor(args) {
            this.buf = new Uint8Array(1024);
            this.done = false;
            this.out = new printer_ts_1.default();
            this.history = new history_ts_1.default();
            this.coerceChoice = (value) => {
              if (typeof value === "number") {
                return String(value);
              }
              return value;
            };
            this.promisify = (value) => {
              return new Promise((resolve) => resolve(value));
            };
            this.cleanInput = (value) => {
              return value?.replace("\n", "").replace("\r", "") ?? "";
            };
            /**
                     * Repeats the last prompt
                     * @param {string | number} value value to auto-select
                     */
            this.repeat = (value) => {
              if (this.history.retrieve().action) {
                if (
                  this.history.retrieve().action === types_ts_2.ACTIONS.CHOOSE
                ) {
                  return this.choose(
                    this.history.retrieve().argument,
                    this.history.retrieve().lastOptionClose,
                    value,
                  );
                }
                if (
                  this.history.retrieve().action === types_ts_2.ACTIONS.QUESTION
                ) {
                  return this.question(
                    this.history.retrieve().argument,
                    this.history.retrieve().includeNewline,
                    value,
                  );
                }
              }
            };
            /**
                     * Read input from the console
                     * @returns {Promise<string>} The value read
                     */
            this.read = async () => {
              return new Promise(async (resolve, reject) => {
                const n = await Deno.stdin.read(this.buf);
                if (n) {
                  resolve(
                    this.cleanInput(
                      new TextDecoder().decode(this.buf.subarray(0, n)),
                    ),
                  );
                } else {
                  reject();
                }
              });
            };
            /**
                     * Prompts the user to choose from a list of options
                     * @param {string[]} options
                     * @param {boolean} lastOptionClose Whether selecting the last option in the list should close the loop
                     * @param {string | number} choice value to auto-select
                     * @returns {Promise<boolean[]>} An array of booleans representing which index was selected
                     */
            this.choose = async (options, lastOptionClose, choice) => {
              this.out.newline();
              options.forEach((option, index) => {
                if (options.length < 5) {
                  this.out.print(`[${index}] ${option}  `);
                } else {
                  this.out.print(`${index}: ${option}`, true);
                }
              });
              // Allow passing a result directly instead of prompting for it.
              // Mostly used for testing without the need for interactive input
              let result;
              if (choice !== undefined) {
                result = this.cleanInput(this.coerceChoice(choice));
              } else {
                result = await this.read();
              }
              this.history.save(
                options,
                types_ts_2.ACTIONS.CHOOSE,
                lastOptionClose ?? false,
              );
              if (lastOptionClose && result === String(options.length - 1)) {
                this.close();
              }
              return options.map((_option, index) => {
                if (result === String(index)) {
                  return true;
                }
                return false;
              });
            };
            /**
                     * Prompts the user to answer a question
                     * @param {string} question
                     * @param {boolean} includeNewline Include a newline before asking for the input
                     * @param {string | number} value value to auto-select
                     * @returns {Promise<string>} The value entered
                     */
            this.question = (question, includeNewline, value) => {
              this.out.print(question, includeNewline ?? true);
              this.history.save(
                question,
                types_ts_2.ACTIONS.QUESTION,
                undefined,
                includeNewline ?? true,
              );
              if (value) {
                return this.promisify(
                  this.cleanInput(this.coerceChoice(value)),
                );
              }
              return this.read();
            };
            /**
                     * Closes the loop
                     */
            this.close = () => {
              this.done = true;
            };
            this.out = new printer_ts_1.default(args);
          }
        };
        exports_4("default", InputLoop);
      },
    };
  },
);

const __exp = __instantiate("index");
export default __exp["default"];
