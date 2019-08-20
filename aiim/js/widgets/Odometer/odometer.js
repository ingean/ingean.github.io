(function() {
  var G, H, w, h, t, u, y, I, n, z, A, B, m, C, D, E, F, J, K, L = [].slice;
  G = /^\(?([^)]*)\)?(?:(.)(d+))?$/;
  H = 1E3 / 30;
  m = document.createElement("div").style;
  t = null != m.transition || null != m.webkitTransition || null != m.mozTransition || null != m.oTransition;
  A = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  w = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  y = function(b) {
      var a;
      a = document.createElement("div");
      a.innerHTML = b;
      return a.children[0]
  };
  z = function(b, a) {
      return b.className = b.className.replace(new RegExp("(^| )" + a.split(" ").join("|") + "( |$)", "gi"), " ")
  };
  u = function(b, a) {
      z(b, a);
      return b.className += " " + a
  };
  C = function(b, a) {
      var d;
      if (null != document.createEvent) return d = document.createEvent("HTMLEvents"), d.initEvent(a, !0, !0), b.dispatchEvent(d)
  };
  n = function() {
      var b, a;
      return null != (b = null != (a = window.performance) ? "function" === typeof a.now ? a.now() : void 0 : void 0) ? b : +new Date
  };
  B = function(b, a) {
      null == a && (a = 0);
      if (!a) return Math.round(b);
      b *= Math.pow(10, a);
      b = Math.floor(b + .5);
      return b / Math.pow(10, a)
  };
  D = function(b) {
      return 0 > b ? Math.ceil(b) : Math.floor(b)
  };
  I = function(b) {
      return b - B(b)
  };
  E = !1;
  (m = function() {
      var b, a, d, c, g;
      if (!E && null != window.jQuery) {
          E = !0;
          c = ["html", "text"];
          g = [];
          a = 0;
          for (d = c.length; a < d; a++) b = c[a], g.push(function(a) {
              var d;
              d = window.jQuery.fn[a];
              return window.jQuery.fn[a] = function(a) {
                  var c;
                  return null == a || null == (null != (c = this[0]) ? c.odometer : void 0) ? d.apply(this, arguments) : this[0].odometer.update(a)
              }
          }(b));
          return g
      }
  })();
  setTimeout(m,
      0);
  h = function() {
      function b(a) {
          var d, c, g, e, k, f, x, h = this;
          this.options = a;
          this.el = this.options.el;
          if (null != this.el.odometer) return this.el.odometer;
          this.el.odometer = this;
          k = b.options;
          for (d in k) a = k[d], null == this.options[d] && (this.options[d] = a);
          null == (d = this.options).duration && (d.duration = 2E3);
          this.MAX_VALUES = this.options.duration / H / 2 | 0;
          this.resetFormat();
          this.value = this.cleanValue(null != (f = this.options.value) ? f : "");
          this.renderInside();
          this.render();
          try {
              for (x = ["innerHTML", "innerText", "textContent"], g = 0,
                  e = x.length; g < e; g++) c = x[g], null != this.el[c] && function(a) {
                  return Object.defineProperty(h.el, a, {
                      get: function() {
                          var d;
                          return "innerHTML" === a ? h.inside.outerHTML : null != (d = h.inside.innerText) ? d : h.inside.textContent
                      },
                      set: function(a) {
                          return h.update(a)
                      }
                  })
              }(c)
          } catch (l) {
              this.watchForMutations()
          }
          this
      }
      b.prototype.renderInside = function() {
          this.inside = document.createElement("div");
          this.inside.className = "odometer-inside";
          this.el.innerHTML = "";
          return this.el.appendChild(this.inside)
      };
      b.prototype.watchForMutations = function() {
          var a =
              this;
          if (null != w) try {
              return null == this.observer && (this.observer = new w(function(d) {
                  d = a.el.innerText;
                  a.renderInside();
                  a.render(a.value);
                  return a.update(d)
              })), this.watchMutations = !0, this.startWatchingMutations()
          } catch (d) {}
      };
      b.prototype.startWatchingMutations = function() {
          if (this.watchMutations) return this.observer.observe(this.el, {
              childList: !0
          })
      };
      b.prototype.stopWatchingMutations = function() {
          var a;
          return null != (a = this.observer) ? a.disconnect() : void 0
      };
      b.prototype.cleanValue = function(a) {
          var d;
          "string" === typeof a &&
              (a = a.replace(null != (d = this.format.radix) ? d : ".", "<radix>"), a = a.replace(/[.,]/g, ""), a = a.replace("<radix>", "."), a = parseFloat(a, 10) || 0);
          return B(a, this.format.precision)
      };
      b.prototype.bindTransitionEnd = function() {
          var a, d, c, b, e, k, f = this;
          if (!this.transitionEndBound) {
              this.transitionEndBound = !0;
              d = !1;
              e = ["transitionend", "webkitTransitionEnd", "oTransitionEnd", "otransitionend", "MSTransitionEnd"];
              k = [];
              c = 0;
              for (b = e.length; c < b; c++) a = e[c], k.push(this.el.addEventListener(a, function() {
                  if (d) return !0;
                  d = !0;
                  setTimeout(function() {
                      f.render();
                      d = !1;
                      return C(f.el, "odometerdone")
                  }, 0);
                  return !0
              }, !1));
              return k
          }
      };
      b.prototype.resetFormat = function() {
          var a, d, c;
          (a = null != (c = this.options.format) ? c : "(,ddd).dd") || (a = "d");
          a = G.exec(a);
          if (!a) throw Error("Odometer: Unparsable digit format");
          d = a.slice(1, 4);
          c = d[0];
          a = d[1];
          d = d[2];
          return this.format = {
              repeating: c,
              radix: a,
              precision: (null != d ? d.length : void 0) || 0
          }
      };
      b.prototype.render = function(a) {
          var d, c, b, e, k, f, x;
          null == a && (a = this.value);
          this.stopWatchingMutations();
          this.resetFormat();
          this.inside.innerHTML = "";
          k = this.options.theme;
          d = this.el.className.split(" ");
          e = [];
          f = 0;
          for (x = d.length; f < x; f++) c = d[f], c.length && ((b = /^odometer-theme-(.+)$/.exec(c)) ? k = b[1] : /^odometer(-|$)/.test(c) || e.push(c));
          e.push("odometer");
          t || e.push("odometer-no-transitions");
          k ? e.push("odometer-theme-" + k) : e.push("odometer-auto-theme");
          this.el.className = e.join(" ");
          this.ribbons = {};
          this.formatDigits(a);
          return this.startWatchingMutations()
      };
      b.prototype.formatDigits = function(a) {
          var d, c, b, e;
          this.digits = [];
          if (this.options.formatFunction)
              for (a = this.options.formatFunction(a),
                  e = a.split("").reverse(), c = 0, b = e.length; c < b; c++) d = e[c], d.match(/0-9/) ? (a = this.renderDigit(), a.querySelector(".odometer-value").innerHTML = d, this.digits.push(a), this.insertDigit(a)) : this.addSpacer(d);
          else
              for (d = !this.format.precision || !I(a) || !1, e = a.toString().split("").reverse(), c = 0, b = e.length; c < b; c++) a = e[c], "." === a && (d = !0), this.addDigit(a, d)
      };
      b.prototype.update = function(a) {
          var d, c = this;
          a = this.cleanValue(a);
          if (d = a - this.value) return z(this.el, "odometer-animating-up odometer-animating-down odometer-animating"),
              0 < d ? u(this.el, "odometer-animating-up") : u(this.el, "odometer-animating-down"), this.stopWatchingMutations(), this.animate(a), this.startWatchingMutations(), setTimeout(function() {
                  c.el.offsetHeight;
                  return u(c.el, "odometer-animating")
              }, 0), this.value = a
      };
      b.prototype.renderDigit = function() {
          return y('<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner"><span class="odometer-ribbon"><span class="odometer-ribbon-inner"><span class="odometer-value"></span></span></span></span></span>')
      };
      b.prototype.insertDigit = function(a, d) {
          return null != d ? this.inside.insertBefore(a, d) : this.inside.children.length ? this.inside.insertBefore(a, this.inside.children[0]) : this.inside.appendChild(a)
      };
      b.prototype.addSpacer = function(a, d, c) {
          var b;
          b = y('<span class="odometer-formatting-mark"></span>');
          b.innerHTML = a;
          c && u(b, c);
          return this.insertDigit(b, d)
      };
      b.prototype.addDigit = function(a, d) {
          var c, b;
          null == d && (d = !0);
          if ("-" === a) return this.addSpacer(a, null, "odometer-negation-mark");
          if ("." === a) return this.addSpacer(null !=
              (c = this.format.radix) ? c : ".", null, "odometer-radix-mark");
          if (d)
              for (b = !1;;) {
                  if (!this.format.repeating.length) {
                      if (b) throw Error("Bad odometer format without digits");
                      this.resetFormat();
                      b = !0
                  }
                  c = this.format.repeating[this.format.repeating.length - 1];
                  this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1);
                  if ("d" === c) break;
                  this.addSpacer(c)
              }
          c = this.renderDigit();
          c.querySelector(".odometer-value").innerHTML = a;
          
          this.digits.push(c);
          return this.insertDigit(c)
      };
      b.prototype.animate =
          function(a) {
              return t && "count" !== this.options.animation ? this.animateSlide(a) : this.animateCount(a)
          };
      b.prototype.animateCount = function(a) {
          var d, b, g, e, k, f = this;
          if (b = +a - this.value) return e = g = n(), d = this.value, (k = function() {
              var c;
              if (n() - e > f.options.duration) f.value = a, f.render(), C(f.el, "odometerdone");
              else return c = n() - g, 50 < c && (g = n(), c /= f.options.duration, c *= b, d += c, f.render(Math.round(d))), null != A ? A(k) : setTimeout(k, 50)
          })()
      };
      b.prototype.getDigitCount = function() {
          var a, d, b, g, e;
          b = 1 <= arguments.length ? L.call(arguments,
              0) : [];
          a = g = 0;
          for (e = b.length; g < e; a = ++g) d = b[a], b[a] = Math.abs(d);
          a = Math.max.apply(Math, b);
          return Math.ceil(Math.log(a + 1) / Math.log(10))
      };
      b.prototype.getFractionalDigitCount = function() {
          var a, b, c, g, e, k;
          g = 1 <= arguments.length ? L.call(arguments, 0) : [];
          b = /^\-?\d*\.(\d*?)0*$/;
          a = e = 0;
          for (k = g.length; e < k; a = ++e) c = g[a], g[a] = c.toString(), c = b.exec(g[a]), g[a] = null == c ? 0 : c[1].length;
          return Math.max.apply(Math, g)
      };
      b.prototype.resetDigits = function() {
          this.digits = [];
          this.ribbons = [];
          this.inside.innerHTML = "";
          return this.resetFormat()
      };
      b.prototype.animateSlide = function(a) {
          var b, c, g, e, k, f, h, m, l, p, q, v, n, r, w, t;
          q = this.value;
          if (m = this.getFractionalDigitCount(q, a)) a *= Math.pow(10, m), q *= Math.pow(10, m);
          if (g = a - q) {
              this.bindTransitionEnd();
              e = this.getDigitCount(q, a);
              k = [];
              for (f = r = b = 0; 0 <= e ? r < e : r > e; f = 0 <= e ? ++r : --r) {
                  v = D(q / Math.pow(10, e - f - 1));
                  h = D(a / Math.pow(10, e - f - 1));
                  f = h - v;
                  if (Math.abs(f) > this.MAX_VALUES) {
                      l = [];
                      p = f / (this.MAX_VALUES + this.MAX_VALUES * b * .5);
                      for (c = v; 0 < f && c < h || 0 > f && c > h;) l.push(Math.round(c)), c += p;
                      l[l.length - 1] !== h && l.push(h);
                      b++
                  } else l =
                      function() {
                          t = [];
                          for (var a = v; v <= h ? a <= h : a >= h; v <= h ? a++ : a--) t.push(a);
                          return t
                      }.apply(this);
                  f = p = 0;
                  for (w = l.length; p < w; f = ++p) c = l[f], l[f] = Math.abs(c % 10);
                  k.push(l)
              }
              this.resetDigits();
              p = k.reverse();
              f = e = 0;
              for (k = p.length; e < k; f = ++e)
                  for (l = p[f], this.digits[f] || this.addDigit(" ", f >= m), null == (n = this.ribbons)[f] && (n[f] = this.digits[f].querySelector(".odometer-ribbon-inner")), this.ribbons[f].innerHTML = "", 0 > g && (l = l.reverse()), a = r = 0, q = l.length; r < q; a = ++r) c = l[a], b = document.createElement("div"), b.className = "odometer-value",
                      b.innerHTML = c, this.ribbons[f].appendChild(b), a === l.length - 1 && u(b, "odometer-last-value"), 0 === a && u(b, "odometer-first-value");
              0 > v && this.addDigit("-");
              g = this.inside.querySelector(".odometer-radix-mark");
              null != g && g.parent.removeChild(g);
              if (m) return this.addSpacer(this.format.radix, this.digits[m - 1], "odometer-radix-mark")
          }
      };
      return b
  }();
  h.options = null != (J = window.odometerOptions) ? J : {};
  setTimeout(function() {
      var b, a, d, c, g;
      if (window.odometerOptions) {
          c = window.odometerOptions;
          g = [];
          for (b in c) a = c[b], g.push(null !=
              (d = h.options)[b] ? (d = h.options)[b] : d[b] = a);
          return g
      }
  }, 0);
  h.init = function() {
      var b, a, d, c, g, e;
      if (null != document.querySelectorAll) {
          a = document.querySelectorAll(h.options.selector || ".odometer");
          e = [];
          d = 0;
          for (c = a.length; d < c; d++) b = a[d], e.push(b.odometer = new h({
              el: b,
              value: null != (g = b.innerText) ? g : b.textContent
          }));
          return e
      }
  };
  null != (null != (K = document.documentElement) ? K.doScroll : void 0) && null != document.createEventObject ? (F = document.onreadystatechange, document.onreadystatechange = function() {
      "complete" === document.readyState &&
          !1 !== h.options.auto && h.init();
      return null != F ? F.apply(this, arguments) : void 0
  }) : document.addEventListener("DOMContentLoaded", function() {
      if (!1 !== h.options.auto) return h.init()
  }, !1);
  "function" === typeof define && define.amd ? define([], function() {
      return h
  }) : "undefined" !== typeof exports && null !== exports ? module.exports = h : window.Odometer = h
}).call(this);