(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) u(e);
  new MutationObserver((e) => {
    for (const n of e)
      if (n.type === 'childList')
        for (const f of n.addedNodes)
          f.tagName === 'LINK' && f.rel === 'modulepreload' && u(f);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(e) {
    const n = {};
    return (
      e.integrity && (n.integrity = e.integrity),
      e.referrerPolicy && (n.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === 'use-credentials'
        ? (n.credentials = 'include')
        : e.crossOrigin === 'anonymous'
          ? (n.credentials = 'omit')
          : (n.credentials = 'same-origin'),
      n
    );
  }
  function u(e) {
    if (e.ep) return;
    e.ep = !0;
    const n = a(e);
    fetch(e.href, n);
  }
})();
function eo(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, 'default')
    ? l.default
    : l;
}
var l0 = { exports: {} },
  Sn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var no = Symbol.for('react.transitional.element'),
  fo = Symbol.for('react.fragment');
function t0(l, t, a) {
  var u = null;
  if (
    (a !== void 0 && (u = '' + a),
    t.key !== void 0 && (u = '' + t.key),
    'key' in t)
  ) {
    a = {};
    for (var e in t) e !== 'key' && (a[e] = t[e]);
  } else a = t;
  return (
    (t = a.ref),
    { $$typeof: no, type: l, key: u, ref: t !== void 0 ? t : null, props: a }
  );
}
Sn.Fragment = fo;
Sn.jsx = t0;
Sn.jsxs = t0;
l0.exports = Sn;
var _ = l0.exports,
  a0 = { exports: {} },
  D = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var zi = Symbol.for('react.transitional.element'),
  io = Symbol.for('react.portal'),
  co = Symbol.for('react.fragment'),
  so = Symbol.for('react.strict_mode'),
  yo = Symbol.for('react.profiler'),
  oo = Symbol.for('react.consumer'),
  vo = Symbol.for('react.context'),
  mo = Symbol.for('react.forward_ref'),
  ho = Symbol.for('react.suspense'),
  go = Symbol.for('react.memo'),
  u0 = Symbol.for('react.lazy'),
  So = Symbol.for('react.activity'),
  Ec = Symbol.iterator;
function ro(l) {
  return l === null || typeof l != 'object'
    ? null
    : ((l = (Ec && l[Ec]) || l['@@iterator']),
      typeof l == 'function' ? l : null);
}
var e0 = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {}
  },
  n0 = Object.assign,
  f0 = {};
function lu(l, t, a) {
  (this.props = l),
    (this.context = t),
    (this.refs = f0),
    (this.updater = a || e0);
}
lu.prototype.isReactComponent = {};
lu.prototype.setState = function (l, t) {
  if (typeof l != 'object' && typeof l != 'function' && l != null)
    throw Error(
      'takes an object of state variables to update or a function which returns an object of state variables.'
    );
  this.updater.enqueueSetState(this, l, t, 'setState');
};
lu.prototype.forceUpdate = function (l) {
  this.updater.enqueueForceUpdate(this, l, 'forceUpdate');
};
function i0() {}
i0.prototype = lu.prototype;
function Ti(l, t, a) {
  (this.props = l),
    (this.context = t),
    (this.refs = f0),
    (this.updater = a || e0);
}
var Ei = (Ti.prototype = new i0());
Ei.constructor = Ti;
n0(Ei, lu.prototype);
Ei.isPureReactComponent = !0;
var Ac = Array.isArray;
function pf() {}
var W = { H: null, A: null, T: null, S: null },
  c0 = Object.prototype.hasOwnProperty;
function Ai(l, t, a) {
  var u = a.ref;
  return {
    $$typeof: zi,
    type: l,
    key: t,
    ref: u !== void 0 ? u : null,
    props: a
  };
}
function bo(l, t) {
  return Ai(l.type, t, l.props);
}
function pi(l) {
  return typeof l == 'object' && l !== null && l.$$typeof === zi;
}
function zo(l) {
  var t = { '=': '=0', ':': '=2' };
  return (
    '$' +
    l.replace(/[=:]/g, function (a) {
      return t[a];
    })
  );
}
var pc = /\/+/g;
function Yn(l, t) {
  return typeof l == 'object' && l !== null && l.key != null
    ? zo('' + l.key)
    : t.toString(36);
}
function To(l) {
  switch (l.status) {
    case 'fulfilled':
      return l.value;
    case 'rejected':
      throw l.reason;
    default:
      switch (
        (typeof l.status == 'string'
          ? l.then(pf, pf)
          : ((l.status = 'pending'),
            l.then(
              function (t) {
                l.status === 'pending' &&
                  ((l.status = 'fulfilled'), (l.value = t));
              },
              function (t) {
                l.status === 'pending' &&
                  ((l.status = 'rejected'), (l.reason = t));
              }
            )),
        l.status)
      ) {
        case 'fulfilled':
          return l.value;
        case 'rejected':
          throw l.reason;
      }
  }
  throw l;
}
function Ta(l, t, a, u, e) {
  var n = typeof l;
  (n === 'undefined' || n === 'boolean') && (l = null);
  var f = !1;
  if (l === null) f = !0;
  else
    switch (n) {
      case 'bigint':
      case 'string':
      case 'number':
        f = !0;
        break;
      case 'object':
        switch (l.$$typeof) {
          case zi:
          case io:
            f = !0;
            break;
          case u0:
            return (f = l._init), Ta(f(l._payload), t, a, u, e);
        }
    }
  if (f)
    return (
      (e = e(l)),
      (f = u === '' ? '.' + Yn(l, 0) : u),
      Ac(e)
        ? ((a = ''),
          f != null && (a = f.replace(pc, '$&/') + '/'),
          Ta(e, t, a, '', function (d) {
            return d;
          }))
        : e != null &&
          (pi(e) &&
            (e = bo(
              e,
              a +
                (e.key == null || (l && l.key === e.key)
                  ? ''
                  : ('' + e.key).replace(pc, '$&/') + '/') +
                f
            )),
          t.push(e)),
      1
    );
  f = 0;
  var i = u === '' ? '.' : u + ':';
  if (Ac(l))
    for (var c = 0; c < l.length; c++)
      (u = l[c]), (n = i + Yn(u, c)), (f += Ta(u, t, a, n, e));
  else if (((c = ro(l)), typeof c == 'function'))
    for (l = c.call(l), c = 0; !(u = l.next()).done; )
      (u = u.value), (n = i + Yn(u, c++)), (f += Ta(u, t, a, n, e));
  else if (n === 'object') {
    if (typeof l.then == 'function') return Ta(To(l), t, a, u, e);
    throw (
      ((t = String(l)),
      Error(
        'Objects are not valid as a React child (found: ' +
          (t === '[object Object]'
            ? 'object with keys {' + Object.keys(l).join(', ') + '}'
            : t) +
          '). If you meant to render a collection of children, use an array instead.'
      ))
    );
  }
  return f;
}
function ye(l, t, a) {
  if (l == null) return l;
  var u = [],
    e = 0;
  return (
    Ta(l, u, '', '', function (n) {
      return t.call(a, n, e++);
    }),
    u
  );
}
function Eo(l) {
  if (l._status === -1) {
    var t = l._result;
    (t = t()),
      t.then(
        function (a) {
          (l._status === 0 || l._status === -1) &&
            ((l._status = 1), (l._result = a));
        },
        function (a) {
          (l._status === 0 || l._status === -1) &&
            ((l._status = 2), (l._result = a));
        }
      ),
      l._status === -1 && ((l._status = 0), (l._result = t));
  }
  if (l._status === 1) return l._result.default;
  throw l._result;
}
var _c =
    typeof reportError == 'function'
      ? reportError
      : function (l) {
          if (
            typeof window == 'object' &&
            typeof window.ErrorEvent == 'function'
          ) {
            var t = new window.ErrorEvent('error', {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof l == 'object' &&
                l !== null &&
                typeof l.message == 'string'
                  ? String(l.message)
                  : String(l),
              error: l
            });
            if (!window.dispatchEvent(t)) return;
          } else if (
            typeof process == 'object' &&
            typeof process.emit == 'function'
          ) {
            process.emit('uncaughtException', l);
            return;
          }
          console.error(l);
        },
  Ao = {
    map: ye,
    forEach: function (l, t, a) {
      ye(
        l,
        function () {
          t.apply(this, arguments);
        },
        a
      );
    },
    count: function (l) {
      var t = 0;
      return (
        ye(l, function () {
          t++;
        }),
        t
      );
    },
    toArray: function (l) {
      return (
        ye(l, function (t) {
          return t;
        }) || []
      );
    },
    only: function (l) {
      if (!pi(l))
        throw Error(
          'React.Children.only expected to receive a single React element child.'
        );
      return l;
    }
  };
D.Activity = So;
D.Children = Ao;
D.Component = lu;
D.Fragment = co;
D.Profiler = yo;
D.PureComponent = Ti;
D.StrictMode = so;
D.Suspense = ho;
D.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = W;
D.__COMPILER_RUNTIME = {
  __proto__: null,
  c: function (l) {
    return W.H.useMemoCache(l);
  }
};
D.cache = function (l) {
  return function () {
    return l.apply(null, arguments);
  };
};
D.cacheSignal = function () {
  return null;
};
D.cloneElement = function (l, t, a) {
  if (l == null)
    throw Error(
      'The argument must be a React element, but you passed ' + l + '.'
    );
  var u = n0({}, l.props),
    e = l.key;
  if (t != null)
    for (n in (t.key !== void 0 && (e = '' + t.key), t))
      !c0.call(t, n) ||
        n === 'key' ||
        n === '__self' ||
        n === '__source' ||
        (n === 'ref' && t.ref === void 0) ||
        (u[n] = t[n]);
  var n = arguments.length - 2;
  if (n === 1) u.children = a;
  else if (1 < n) {
    for (var f = Array(n), i = 0; i < n; i++) f[i] = arguments[i + 2];
    u.children = f;
  }
  return Ai(l.type, e, u);
};
D.createContext = function (l) {
  return (
    (l = {
      $$typeof: vo,
      _currentValue: l,
      _currentValue2: l,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }),
    (l.Provider = l),
    (l.Consumer = { $$typeof: oo, _context: l }),
    l
  );
};
D.createElement = function (l, t, a) {
  var u,
    e = {},
    n = null;
  if (t != null)
    for (u in (t.key !== void 0 && (n = '' + t.key), t))
      c0.call(t, u) &&
        u !== 'key' &&
        u !== '__self' &&
        u !== '__source' &&
        (e[u] = t[u]);
  var f = arguments.length - 2;
  if (f === 1) e.children = a;
  else if (1 < f) {
    for (var i = Array(f), c = 0; c < f; c++) i[c] = arguments[c + 2];
    e.children = i;
  }
  if (l && l.defaultProps)
    for (u in ((f = l.defaultProps), f)) e[u] === void 0 && (e[u] = f[u]);
  return Ai(l, n, e);
};
D.createRef = function () {
  return { current: null };
};
D.forwardRef = function (l) {
  return { $$typeof: mo, render: l };
};
D.isValidElement = pi;
D.lazy = function (l) {
  return { $$typeof: u0, _payload: { _status: -1, _result: l }, _init: Eo };
};
D.memo = function (l, t) {
  return { $$typeof: go, type: l, compare: t === void 0 ? null : t };
};
D.startTransition = function (l) {
  var t = W.T,
    a = {};
  W.T = a;
  try {
    var u = l(),
      e = W.S;
    e !== null && e(a, u),
      typeof u == 'object' &&
        u !== null &&
        typeof u.then == 'function' &&
        u.then(pf, _c);
  } catch (n) {
    _c(n);
  } finally {
    t !== null && a.types !== null && (t.types = a.types), (W.T = t);
  }
};
D.unstable_useCacheRefresh = function () {
  return W.H.useCacheRefresh();
};
D.use = function (l) {
  return W.H.use(l);
};
D.useActionState = function (l, t, a) {
  return W.H.useActionState(l, t, a);
};
D.useCallback = function (l, t) {
  return W.H.useCallback(l, t);
};
D.useContext = function (l) {
  return W.H.useContext(l);
};
D.useDebugValue = function () {};
D.useDeferredValue = function (l, t) {
  return W.H.useDeferredValue(l, t);
};
D.useEffect = function (l, t) {
  return W.H.useEffect(l, t);
};
D.useEffectEvent = function (l) {
  return W.H.useEffectEvent(l);
};
D.useId = function () {
  return W.H.useId();
};
D.useImperativeHandle = function (l, t, a) {
  return W.H.useImperativeHandle(l, t, a);
};
D.useInsertionEffect = function (l, t) {
  return W.H.useInsertionEffect(l, t);
};
D.useLayoutEffect = function (l, t) {
  return W.H.useLayoutEffect(l, t);
};
D.useMemo = function (l, t) {
  return W.H.useMemo(l, t);
};
D.useOptimistic = function (l, t) {
  return W.H.useOptimistic(l, t);
};
D.useReducer = function (l, t, a) {
  return W.H.useReducer(l, t, a);
};
D.useRef = function (l) {
  return W.H.useRef(l);
};
D.useState = function (l) {
  return W.H.useState(l);
};
D.useSyncExternalStore = function (l, t, a) {
  return W.H.useSyncExternalStore(l, t, a);
};
D.useTransition = function () {
  return W.H.useTransition();
};
D.version = '19.2.8';
a0.exports = D;
var Ul = a0.exports;
const po = eo(Ul);
var s0 = { exports: {} },
  rn = {},
  y0 = { exports: {} },
  d0 = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (l) {
  function t(p, R) {
    var x = p.length;
    p.push(R);
    l: for (; 0 < x; ) {
      var ll = (x - 1) >>> 1,
        sl = p[ll];
      if (0 < e(sl, R)) (p[ll] = R), (p[x] = sl), (x = ll);
      else break l;
    }
  }
  function a(p) {
    return p.length === 0 ? null : p[0];
  }
  function u(p) {
    if (p.length === 0) return null;
    var R = p[0],
      x = p.pop();
    if (x !== R) {
      p[0] = x;
      l: for (var ll = 0, sl = p.length, ie = sl >>> 1; ll < ie; ) {
        var ce = 2 * (ll + 1) - 1,
          qn = p[ce],
          It = ce + 1,
          se = p[It];
        if (0 > e(qn, x))
          It < sl && 0 > e(se, qn)
            ? ((p[ll] = se), (p[It] = x), (ll = It))
            : ((p[ll] = qn), (p[ce] = x), (ll = ce));
        else if (It < sl && 0 > e(se, x)) (p[ll] = se), (p[It] = x), (ll = It);
        else break l;
      }
    }
    return R;
  }
  function e(p, R) {
    var x = p.sortIndex - R.sortIndex;
    return x !== 0 ? x : p.id - R.id;
  }
  if (
    ((l.unstable_now = void 0),
    typeof performance == 'object' && typeof performance.now == 'function')
  ) {
    var n = performance;
    l.unstable_now = function () {
      return n.now();
    };
  } else {
    var f = Date,
      i = f.now();
    l.unstable_now = function () {
      return f.now() - i;
    };
  }
  var c = [],
    d = [],
    S = 1,
    g = null,
    v = 3,
    m = !1,
    E = !1,
    b = !1,
    z = !1,
    y = typeof setTimeout == 'function' ? setTimeout : null,
    s = typeof clearTimeout == 'function' ? clearTimeout : null,
    o = typeof setImmediate < 'u' ? setImmediate : null;
  function h(p) {
    for (var R = a(d); R !== null; ) {
      if (R.callback === null) u(d);
      else if (R.startTime <= p)
        u(d), (R.sortIndex = R.expirationTime), t(c, R);
      else break;
      R = a(d);
    }
  }
  function T(p) {
    if (((b = !1), h(p), !E))
      if (a(c) !== null) (E = !0), N || ((N = !0), pt());
      else {
        var R = a(d);
        R !== null && Cn(T, R.startTime - p);
      }
  }
  var N = !1,
    A = -1,
    M = 5,
    H = -1;
  function q() {
    return z ? !0 : !(l.unstable_now() - H < M);
  }
  function Gl() {
    if (((z = !1), N)) {
      var p = l.unstable_now();
      H = p;
      var R = !0;
      try {
        l: {
          (E = !1), b && ((b = !1), s(A), (A = -1)), (m = !0);
          var x = v;
          try {
            t: {
              for (
                h(p), g = a(c);
                g !== null && !(g.expirationTime > p && q());

              ) {
                var ll = g.callback;
                if (typeof ll == 'function') {
                  (g.callback = null), (v = g.priorityLevel);
                  var sl = ll(g.expirationTime <= p);
                  if (((p = l.unstable_now()), typeof sl == 'function')) {
                    (g.callback = sl), h(p), (R = !0);
                    break t;
                  }
                  g === a(c) && u(c), h(p);
                } else u(c);
                g = a(c);
              }
              if (g !== null) R = !0;
              else {
                var ie = a(d);
                ie !== null && Cn(T, ie.startTime - p), (R = !1);
              }
            }
            break l;
          } finally {
            (g = null), (v = x), (m = !1);
          }
          R = void 0;
        }
      } finally {
        R ? pt() : (N = !1);
      }
    }
  }
  var pt;
  if (typeof o == 'function')
    pt = function () {
      o(Gl);
    };
  else if (typeof MessageChannel < 'u') {
    var Tc = new MessageChannel(),
      uo = Tc.port2;
    (Tc.port1.onmessage = Gl),
      (pt = function () {
        uo.postMessage(null);
      });
  } else
    pt = function () {
      y(Gl, 0);
    };
  function Cn(p, R) {
    A = y(function () {
      p(l.unstable_now());
    }, R);
  }
  (l.unstable_IdlePriority = 5),
    (l.unstable_ImmediatePriority = 1),
    (l.unstable_LowPriority = 4),
    (l.unstable_NormalPriority = 3),
    (l.unstable_Profiling = null),
    (l.unstable_UserBlockingPriority = 2),
    (l.unstable_cancelCallback = function (p) {
      p.callback = null;
    }),
    (l.unstable_forceFrameRate = function (p) {
      0 > p || 125 < p
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
          )
        : (M = 0 < p ? Math.floor(1e3 / p) : 5);
    }),
    (l.unstable_getCurrentPriorityLevel = function () {
      return v;
    }),
    (l.unstable_next = function (p) {
      switch (v) {
        case 1:
        case 2:
        case 3:
          var R = 3;
          break;
        default:
          R = v;
      }
      var x = v;
      v = R;
      try {
        return p();
      } finally {
        v = x;
      }
    }),
    (l.unstable_requestPaint = function () {
      z = !0;
    }),
    (l.unstable_runWithPriority = function (p, R) {
      switch (p) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          p = 3;
      }
      var x = v;
      v = p;
      try {
        return R();
      } finally {
        v = x;
      }
    }),
    (l.unstable_scheduleCallback = function (p, R, x) {
      var ll = l.unstable_now();
      switch (
        (typeof x == 'object' && x !== null
          ? ((x = x.delay), (x = typeof x == 'number' && 0 < x ? ll + x : ll))
          : (x = ll),
        p)
      ) {
        case 1:
          var sl = -1;
          break;
        case 2:
          sl = 250;
          break;
        case 5:
          sl = 1073741823;
          break;
        case 4:
          sl = 1e4;
          break;
        default:
          sl = 5e3;
      }
      return (
        (sl = x + sl),
        (p = {
          id: S++,
          callback: R,
          priorityLevel: p,
          startTime: x,
          expirationTime: sl,
          sortIndex: -1
        }),
        x > ll
          ? ((p.sortIndex = x),
            t(d, p),
            a(c) === null &&
              p === a(d) &&
              (b ? (s(A), (A = -1)) : (b = !0), Cn(T, x - ll)))
          : ((p.sortIndex = sl),
            t(c, p),
            E || m || ((E = !0), N || ((N = !0), pt()))),
        p
      );
    }),
    (l.unstable_shouldYield = q),
    (l.unstable_wrapCallback = function (p) {
      var R = v;
      return function () {
        var x = v;
        v = R;
        try {
          return p.apply(this, arguments);
        } finally {
          v = x;
        }
      };
    });
})(d0);
y0.exports = d0;
var _o = y0.exports,
  o0 = { exports: {} },
  zl = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Oo = Ul;
function v0(l) {
  var t = 'https://react.dev/errors/' + l;
  if (1 < arguments.length) {
    t += '?args[]=' + encodeURIComponent(arguments[1]);
    for (var a = 2; a < arguments.length; a++)
      t += '&args[]=' + encodeURIComponent(arguments[a]);
  }
  return (
    'Minified React error #' +
    l +
    '; visit ' +
    t +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  );
}
function _t() {}
var bl = {
    d: {
      f: _t,
      r: function () {
        throw Error(v0(522));
      },
      D: _t,
      C: _t,
      L: _t,
      m: _t,
      X: _t,
      S: _t,
      M: _t
    },
    p: 0,
    findDOMNode: null
  },
  Mo = Symbol.for('react.portal');
function Do(l, t, a) {
  var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Mo,
    key: u == null ? null : '' + u,
    children: l,
    containerInfo: t,
    implementation: a
  };
}
var Tu = Oo.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function bn(l, t) {
  if (l === 'font') return '';
  if (typeof t == 'string') return t === 'use-credentials' ? t : '';
}
zl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = bl;
zl.createPortal = function (l, t) {
  var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
    throw Error(v0(299));
  return Do(l, t, null, a);
};
zl.flushSync = function (l) {
  var t = Tu.T,
    a = bl.p;
  try {
    if (((Tu.T = null), (bl.p = 2), l)) return l();
  } finally {
    (Tu.T = t), (bl.p = a), bl.d.f();
  }
};
zl.preconnect = function (l, t) {
  typeof l == 'string' &&
    (t
      ? ((t = t.crossOrigin),
        (t =
          typeof t == 'string' ? (t === 'use-credentials' ? t : '') : void 0))
      : (t = null),
    bl.d.C(l, t));
};
zl.prefetchDNS = function (l) {
  typeof l == 'string' && bl.d.D(l);
};
zl.preinit = function (l, t) {
  if (typeof l == 'string' && t && typeof t.as == 'string') {
    var a = t.as,
      u = bn(a, t.crossOrigin),
      e = typeof t.integrity == 'string' ? t.integrity : void 0,
      n = typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0;
    a === 'style'
      ? bl.d.S(l, typeof t.precedence == 'string' ? t.precedence : void 0, {
          crossOrigin: u,
          integrity: e,
          fetchPriority: n
        })
      : a === 'script' &&
        bl.d.X(l, {
          crossOrigin: u,
          integrity: e,
          fetchPriority: n,
          nonce: typeof t.nonce == 'string' ? t.nonce : void 0
        });
  }
};
zl.preinitModule = function (l, t) {
  if (typeof l == 'string')
    if (typeof t == 'object' && t !== null) {
      if (t.as == null || t.as === 'script') {
        var a = bn(t.as, t.crossOrigin);
        bl.d.M(l, {
          crossOrigin: a,
          integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          nonce: typeof t.nonce == 'string' ? t.nonce : void 0
        });
      }
    } else t == null && bl.d.M(l);
};
zl.preload = function (l, t) {
  if (
    typeof l == 'string' &&
    typeof t == 'object' &&
    t !== null &&
    typeof t.as == 'string'
  ) {
    var a = t.as,
      u = bn(a, t.crossOrigin);
    bl.d.L(l, a, {
      crossOrigin: u,
      integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
      nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
      type: typeof t.type == 'string' ? t.type : void 0,
      fetchPriority:
        typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0,
      referrerPolicy:
        typeof t.referrerPolicy == 'string' ? t.referrerPolicy : void 0,
      imageSrcSet: typeof t.imageSrcSet == 'string' ? t.imageSrcSet : void 0,
      imageSizes: typeof t.imageSizes == 'string' ? t.imageSizes : void 0,
      media: typeof t.media == 'string' ? t.media : void 0
    });
  }
};
zl.preloadModule = function (l, t) {
  if (typeof l == 'string')
    if (t) {
      var a = bn(t.as, t.crossOrigin);
      bl.d.m(l, {
        as: typeof t.as == 'string' && t.as !== 'script' ? t.as : void 0,
        crossOrigin: a,
        integrity: typeof t.integrity == 'string' ? t.integrity : void 0
      });
    } else bl.d.m(l);
};
zl.requestFormReset = function (l) {
  bl.d.r(l);
};
zl.unstable_batchedUpdates = function (l, t) {
  return l(t);
};
zl.useFormState = function (l, t, a) {
  return Tu.H.useFormState(l, t, a);
};
zl.useFormStatus = function () {
  return Tu.H.useHostTransitionStatus();
};
zl.version = '19.2.8';
function m0() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(m0);
    } catch (l) {
      console.error(l);
    }
}
m0(), (o0.exports = zl);
var Uo = o0.exports;
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var cl = _o,
  h0 = Ul,
  No = Uo;
function r(l) {
  var t = 'https://react.dev/errors/' + l;
  if (1 < arguments.length) {
    t += '?args[]=' + encodeURIComponent(arguments[1]);
    for (var a = 2; a < arguments.length; a++)
      t += '&args[]=' + encodeURIComponent(arguments[a]);
  }
  return (
    'Minified React error #' +
    l +
    '; visit ' +
    t +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  );
}
function g0(l) {
  return !(!l || (l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11));
}
function Wu(l) {
  var t = l,
    a = l;
  if (l.alternate) for (; t.return; ) t = t.return;
  else {
    l = t;
    do (t = l), t.flags & 4098 && (a = t.return), (l = t.return);
    while (l);
  }
  return t.tag === 3 ? a : null;
}
function S0(l) {
  if (l.tag === 13) {
    var t = l.memoizedState;
    if (
      (t === null && ((l = l.alternate), l !== null && (t = l.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function r0(l) {
  if (l.tag === 31) {
    var t = l.memoizedState;
    if (
      (t === null && ((l = l.alternate), l !== null && (t = l.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Oc(l) {
  if (Wu(l) !== l) throw Error(r(188));
}
function Ho(l) {
  var t = l.alternate;
  if (!t) {
    if (((t = Wu(l)), t === null)) throw Error(r(188));
    return t !== l ? null : l;
  }
  for (var a = l, u = t; ; ) {
    var e = a.return;
    if (e === null) break;
    var n = e.alternate;
    if (n === null) {
      if (((u = e.return), u !== null)) {
        a = u;
        continue;
      }
      break;
    }
    if (e.child === n.child) {
      for (n = e.child; n; ) {
        if (n === a) return Oc(e), l;
        if (n === u) return Oc(e), t;
        n = n.sibling;
      }
      throw Error(r(188));
    }
    if (a.return !== u.return) (a = e), (u = n);
    else {
      for (var f = !1, i = e.child; i; ) {
        if (i === a) {
          (f = !0), (a = e), (u = n);
          break;
        }
        if (i === u) {
          (f = !0), (u = e), (a = n);
          break;
        }
        i = i.sibling;
      }
      if (!f) {
        for (i = n.child; i; ) {
          if (i === a) {
            (f = !0), (a = n), (u = e);
            break;
          }
          if (i === u) {
            (f = !0), (u = n), (a = e);
            break;
          }
          i = i.sibling;
        }
        if (!f) throw Error(r(189));
      }
    }
    if (a.alternate !== u) throw Error(r(190));
  }
  if (a.tag !== 3) throw Error(r(188));
  return a.stateNode.current === a ? l : t;
}
function b0(l) {
  var t = l.tag;
  if (t === 5 || t === 26 || t === 27 || t === 6) return l;
  for (l = l.child; l !== null; ) {
    if (((t = b0(l)), t !== null)) return t;
    l = l.sibling;
  }
  return null;
}
var F = Object.assign,
  xo = Symbol.for('react.element'),
  de = Symbol.for('react.transitional.element'),
  hu = Symbol.for('react.portal'),
  pa = Symbol.for('react.fragment'),
  z0 = Symbol.for('react.strict_mode'),
  _f = Symbol.for('react.profiler'),
  T0 = Symbol.for('react.consumer'),
  ot = Symbol.for('react.context'),
  _i = Symbol.for('react.forward_ref'),
  Of = Symbol.for('react.suspense'),
  Mf = Symbol.for('react.suspense_list'),
  Oi = Symbol.for('react.memo'),
  Ot = Symbol.for('react.lazy'),
  Df = Symbol.for('react.activity'),
  Ro = Symbol.for('react.memo_cache_sentinel'),
  Mc = Symbol.iterator;
function cu(l) {
  return l === null || typeof l != 'object'
    ? null
    : ((l = (Mc && l[Mc]) || l['@@iterator']),
      typeof l == 'function' ? l : null);
}
var jo = Symbol.for('react.client.reference');
function Uf(l) {
  if (l == null) return null;
  if (typeof l == 'function')
    return l.$$typeof === jo ? null : l.displayName || l.name || null;
  if (typeof l == 'string') return l;
  switch (l) {
    case pa:
      return 'Fragment';
    case _f:
      return 'Profiler';
    case z0:
      return 'StrictMode';
    case Of:
      return 'Suspense';
    case Mf:
      return 'SuspenseList';
    case Df:
      return 'Activity';
  }
  if (typeof l == 'object')
    switch (l.$$typeof) {
      case hu:
        return 'Portal';
      case ot:
        return l.displayName || 'Context';
      case T0:
        return (l._context.displayName || 'Context') + '.Consumer';
      case _i:
        var t = l.render;
        return (
          (l = l.displayName),
          l ||
            ((l = t.displayName || t.name || ''),
            (l = l !== '' ? 'ForwardRef(' + l + ')' : 'ForwardRef')),
          l
        );
      case Oi:
        return (
          (t = l.displayName || null), t !== null ? t : Uf(l.type) || 'Memo'
        );
      case Ot:
        (t = l._payload), (l = l._init);
        try {
          return Uf(l(t));
        } catch {}
    }
  return null;
}
var gu = Array.isArray,
  O = h0.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
  Q = No.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
  ea = { pending: !1, data: null, method: null, action: null },
  Nf = [],
  _a = -1;
function ut(l) {
  return { current: l };
}
function ol(l) {
  0 > _a || ((l.current = Nf[_a]), (Nf[_a] = null), _a--);
}
function J(l, t) {
  _a++, (Nf[_a] = l.current), (l.current = t);
}
var at = ut(null),
  Bu = ut(null),
  qt = ut(null),
  Xe = ut(null);
function Ze(l, t) {
  switch ((J(qt, t), J(Bu, l), J(at, null), t.nodeType)) {
    case 9:
    case 11:
      l = (l = t.documentElement) && (l = l.namespaceURI) ? Rs(l) : 0;
      break;
    default:
      if (((l = t.tagName), (t = t.namespaceURI))) (t = Rs(t)), (l = Xd(t, l));
      else
        switch (l) {
          case 'svg':
            l = 1;
            break;
          case 'math':
            l = 2;
            break;
          default:
            l = 0;
        }
  }
  ol(at), J(at, l);
}
function La() {
  ol(at), ol(Bu), ol(qt);
}
function Hf(l) {
  l.memoizedState !== null && J(Xe, l);
  var t = at.current,
    a = Xd(t, l.type);
  t !== a && (J(Bu, l), J(at, a));
}
function Le(l) {
  Bu.current === l && (ol(at), ol(Bu)),
    Xe.current === l && (ol(Xe), (Ju._currentValue = ea));
}
var Gn, Dc;
function la(l) {
  if (Gn === void 0)
    try {
      throw Error();
    } catch (a) {
      var t = a.stack.trim().match(/\n( *(at )?)/);
      (Gn = (t && t[1]) || ''),
        (Dc =
          -1 <
          a.stack.indexOf(`
    at`)
            ? ' (<anonymous>)'
            : -1 < a.stack.indexOf('@')
              ? '@unknown:0:0'
              : '');
    }
  return (
    `
` +
    Gn +
    l +
    Dc
  );
}
var Qn = !1;
function Xn(l, t) {
  if (!l || Qn) return '';
  Qn = !0;
  var a = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    var u = {
      DetermineComponentFrameRoot: function () {
        try {
          if (t) {
            var g = function () {
              throw Error();
            };
            if (
              (Object.defineProperty(g.prototype, 'props', {
                set: function () {
                  throw Error();
                }
              }),
              typeof Reflect == 'object' && Reflect.construct)
            ) {
              try {
                Reflect.construct(g, []);
              } catch (m) {
                var v = m;
              }
              Reflect.construct(l, [], g);
            } else {
              try {
                g.call();
              } catch (m) {
                v = m;
              }
              l.call(g.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (m) {
              v = m;
            }
            (g = l()) &&
              typeof g.catch == 'function' &&
              g.catch(function () {});
          }
        } catch (m) {
          if (m && v && typeof m.stack == 'string') return [m.stack, v.stack];
        }
        return [null, null];
      }
    };
    u.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
    var e = Object.getOwnPropertyDescriptor(
      u.DetermineComponentFrameRoot,
      'name'
    );
    e &&
      e.configurable &&
      Object.defineProperty(u.DetermineComponentFrameRoot, 'name', {
        value: 'DetermineComponentFrameRoot'
      });
    var n = u.DetermineComponentFrameRoot(),
      f = n[0],
      i = n[1];
    if (f && i) {
      var c = f.split(`
`),
        d = i.split(`
`);
      for (
        e = u = 0;
        u < c.length && !c[u].includes('DetermineComponentFrameRoot');

      )
        u++;
      for (; e < d.length && !d[e].includes('DetermineComponentFrameRoot'); )
        e++;
      if (u === c.length || e === d.length)
        for (
          u = c.length - 1, e = d.length - 1;
          1 <= u && 0 <= e && c[u] !== d[e];

        )
          e--;
      for (; 1 <= u && 0 <= e; u--, e--)
        if (c[u] !== d[e]) {
          if (u !== 1 || e !== 1)
            do
              if ((u--, e--, 0 > e || c[u] !== d[e])) {
                var S =
                  `
` + c[u].replace(' at new ', ' at ');
                return (
                  l.displayName &&
                    S.includes('<anonymous>') &&
                    (S = S.replace('<anonymous>', l.displayName)),
                  S
                );
              }
            while (1 <= u && 0 <= e);
          break;
        }
    }
  } finally {
    (Qn = !1), (Error.prepareStackTrace = a);
  }
  return (a = l ? l.displayName || l.name : '') ? la(a) : '';
}
function Bo(l, t) {
  switch (l.tag) {
    case 26:
    case 27:
    case 5:
      return la(l.type);
    case 16:
      return la('Lazy');
    case 13:
      return l.child !== t && t !== null
        ? la('Suspense Fallback')
        : la('Suspense');
    case 19:
      return la('SuspenseList');
    case 0:
    case 15:
      return Xn(l.type, !1);
    case 11:
      return Xn(l.type.render, !1);
    case 1:
      return Xn(l.type, !0);
    case 31:
      return la('Activity');
    default:
      return '';
  }
}
function Uc(l) {
  try {
    var t = '',
      a = null;
    do (t += Bo(l, a)), (a = l), (l = l.return);
    while (l);
    return t;
  } catch (u) {
    return (
      `
Error generating stack: ` +
      u.message +
      `
` +
      u.stack
    );
  }
}
var xf = Object.prototype.hasOwnProperty,
  Mi = cl.unstable_scheduleCallback,
  Zn = cl.unstable_cancelCallback,
  Co = cl.unstable_shouldYield,
  qo = cl.unstable_requestPaint,
  Rl = cl.unstable_now,
  Yo = cl.unstable_getCurrentPriorityLevel,
  E0 = cl.unstable_ImmediatePriority,
  A0 = cl.unstable_UserBlockingPriority,
  Ve = cl.unstable_NormalPriority,
  Go = cl.unstable_LowPriority,
  p0 = cl.unstable_IdlePriority,
  Qo = cl.log,
  Xo = cl.unstable_setDisableYieldValue,
  Fu = null,
  jl = null;
function xt(l) {
  if (
    (typeof Qo == 'function' && Xo(l),
    jl && typeof jl.setStrictMode == 'function')
  )
    try {
      jl.setStrictMode(Fu, l);
    } catch {}
}
var Bl = Math.clz32 ? Math.clz32 : Vo,
  Zo = Math.log,
  Lo = Math.LN2;
function Vo(l) {
  return (l >>>= 0), l === 0 ? 32 : (31 - ((Zo(l) / Lo) | 0)) | 0;
}
var oe = 256,
  ve = 262144,
  me = 4194304;
function ta(l) {
  var t = l & 42;
  if (t !== 0) return t;
  switch (l & -l) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
      return 64;
    case 128:
      return 128;
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
      return l & 261888;
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return l & 3932160;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
      return l & 62914560;
    case 67108864:
      return 67108864;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 0;
    default:
      return l;
  }
}
function zn(l, t, a) {
  var u = l.pendingLanes;
  if (u === 0) return 0;
  var e = 0,
    n = l.suspendedLanes,
    f = l.pingedLanes;
  l = l.warmLanes;
  var i = u & 134217727;
  return (
    i !== 0
      ? ((u = i & ~n),
        u !== 0
          ? (e = ta(u))
          : ((f &= i),
            f !== 0
              ? (e = ta(f))
              : a || ((a = i & ~l), a !== 0 && (e = ta(a)))))
      : ((i = u & ~n),
        i !== 0
          ? (e = ta(i))
          : f !== 0
            ? (e = ta(f))
            : a || ((a = u & ~l), a !== 0 && (e = ta(a)))),
    e === 0
      ? 0
      : t !== 0 &&
          t !== e &&
          !(t & n) &&
          ((n = e & -e),
          (a = t & -t),
          n >= a || (n === 32 && (a & 4194048) !== 0))
        ? t
        : e
  );
}
function ku(l, t) {
  return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
}
function Ko(l, t) {
  switch (l) {
    case 1:
    case 2:
    case 4:
    case 8:
    case 64:
      return t + 250;
    case 16:
    case 32:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
      return -1;
    case 67108864:
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function _0() {
  var l = me;
  return (me <<= 1), !(me & 62914560) && (me = 4194304), l;
}
function Ln(l) {
  for (var t = [], a = 0; 31 > a; a++) t.push(l);
  return t;
}
function Iu(l, t) {
  (l.pendingLanes |= t),
    t !== 268435456 &&
      ((l.suspendedLanes = 0), (l.pingedLanes = 0), (l.warmLanes = 0));
}
function Jo(l, t, a, u, e, n) {
  var f = l.pendingLanes;
  (l.pendingLanes = a),
    (l.suspendedLanes = 0),
    (l.pingedLanes = 0),
    (l.warmLanes = 0),
    (l.expiredLanes &= a),
    (l.entangledLanes &= a),
    (l.errorRecoveryDisabledLanes &= a),
    (l.shellSuspendCounter = 0);
  var i = l.entanglements,
    c = l.expirationTimes,
    d = l.hiddenUpdates;
  for (a = f & ~a; 0 < a; ) {
    var S = 31 - Bl(a),
      g = 1 << S;
    (i[S] = 0), (c[S] = -1);
    var v = d[S];
    if (v !== null)
      for (d[S] = null, S = 0; S < v.length; S++) {
        var m = v[S];
        m !== null && (m.lane &= -536870913);
      }
    a &= ~g;
  }
  u !== 0 && O0(l, u, 0),
    n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(f & ~t));
}
function O0(l, t, a) {
  (l.pendingLanes |= t), (l.suspendedLanes &= ~t);
  var u = 31 - Bl(t);
  (l.entangledLanes |= t),
    (l.entanglements[u] = l.entanglements[u] | 1073741824 | (a & 261930));
}
function M0(l, t) {
  var a = (l.entangledLanes |= t);
  for (l = l.entanglements; a; ) {
    var u = 31 - Bl(a),
      e = 1 << u;
    (e & t) | (l[u] & t) && (l[u] |= t), (a &= ~e);
  }
}
function D0(l, t) {
  var a = t & -t;
  return (a = a & 42 ? 1 : Di(a)), a & (l.suspendedLanes | t) ? 0 : a;
}
function Di(l) {
  switch (l) {
    case 2:
      l = 1;
      break;
    case 8:
      l = 4;
      break;
    case 32:
      l = 16;
      break;
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
      l = 128;
      break;
    case 268435456:
      l = 134217728;
      break;
    default:
      l = 0;
  }
  return l;
}
function Ui(l) {
  return (l &= -l), 2 < l ? (8 < l ? (l & 134217727 ? 32 : 268435456) : 8) : 2;
}
function U0() {
  var l = Q.p;
  return l !== 0 ? l : ((l = window.event), l === void 0 ? 32 : Id(l.type));
}
function Nc(l, t) {
  var a = Q.p;
  try {
    return (Q.p = l), t();
  } finally {
    Q.p = a;
  }
}
var Ft = Math.random().toString(36).slice(2),
  ml = '__reactFiber$' + Ft,
  Ol = '__reactProps$' + Ft,
  tu = '__reactContainer$' + Ft,
  Rf = '__reactEvents$' + Ft,
  wo = '__reactListeners$' + Ft,
  $o = '__reactHandles$' + Ft,
  Hc = '__reactResources$' + Ft,
  Pu = '__reactMarker$' + Ft;
function Ni(l) {
  delete l[ml], delete l[Ol], delete l[Rf], delete l[wo], delete l[$o];
}
function Oa(l) {
  var t = l[ml];
  if (t) return t;
  for (var a = l.parentNode; a; ) {
    if ((t = a[tu] || a[ml])) {
      if (
        ((a = t.alternate),
        t.child !== null || (a !== null && a.child !== null))
      )
        for (l = Ys(l); l !== null; ) {
          if ((a = l[ml])) return a;
          l = Ys(l);
        }
      return t;
    }
    (l = a), (a = l.parentNode);
  }
  return null;
}
function au(l) {
  if ((l = l[ml] || l[tu])) {
    var t = l.tag;
    if (
      t === 5 ||
      t === 6 ||
      t === 13 ||
      t === 31 ||
      t === 26 ||
      t === 27 ||
      t === 3
    )
      return l;
  }
  return null;
}
function Su(l) {
  var t = l.tag;
  if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
  throw Error(r(33));
}
function Ca(l) {
  var t = l[Hc];
  return (
    t ||
      (t = l[Hc] = { hoistableStyles: new Map(), hoistableScripts: new Map() }),
    t
  );
}
function dl(l) {
  l[Pu] = !0;
}
var N0 = new Set(),
  H0 = {};
function ma(l, t) {
  Va(l, t), Va(l + 'Capture', t);
}
function Va(l, t) {
  for (H0[l] = t, l = 0; l < t.length; l++) N0.add(t[l]);
}
var Wo = RegExp(
    '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$'
  ),
  xc = {},
  Rc = {};
function Fo(l) {
  return xf.call(Rc, l)
    ? !0
    : xf.call(xc, l)
      ? !1
      : Wo.test(l)
        ? (Rc[l] = !0)
        : ((xc[l] = !0), !1);
}
function Oe(l, t, a) {
  if (Fo(t))
    if (a === null) l.removeAttribute(t);
    else {
      switch (typeof a) {
        case 'undefined':
        case 'function':
        case 'symbol':
          l.removeAttribute(t);
          return;
        case 'boolean':
          var u = t.toLowerCase().slice(0, 5);
          if (u !== 'data-' && u !== 'aria-') {
            l.removeAttribute(t);
            return;
          }
      }
      l.setAttribute(t, '' + a);
    }
}
function he(l, t, a) {
  if (a === null) l.removeAttribute(t);
  else {
    switch (typeof a) {
      case 'undefined':
      case 'function':
      case 'symbol':
      case 'boolean':
        l.removeAttribute(t);
        return;
    }
    l.setAttribute(t, '' + a);
  }
}
function nt(l, t, a, u) {
  if (u === null) l.removeAttribute(a);
  else {
    switch (typeof u) {
      case 'undefined':
      case 'function':
      case 'symbol':
      case 'boolean':
        l.removeAttribute(a);
        return;
    }
    l.setAttributeNS(t, a, '' + u);
  }
}
function Xl(l) {
  switch (typeof l) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return l;
    case 'object':
      return l;
    default:
      return '';
  }
}
function x0(l) {
  var t = l.type;
  return (
    (l = l.nodeName) &&
    l.toLowerCase() === 'input' &&
    (t === 'checkbox' || t === 'radio')
  );
}
function ko(l, t, a) {
  var u = Object.getOwnPropertyDescriptor(l.constructor.prototype, t);
  if (
    !l.hasOwnProperty(t) &&
    typeof u < 'u' &&
    typeof u.get == 'function' &&
    typeof u.set == 'function'
  ) {
    var e = u.get,
      n = u.set;
    return (
      Object.defineProperty(l, t, {
        configurable: !0,
        get: function () {
          return e.call(this);
        },
        set: function (f) {
          (a = '' + f), n.call(this, f);
        }
      }),
      Object.defineProperty(l, t, { enumerable: u.enumerable }),
      {
        getValue: function () {
          return a;
        },
        setValue: function (f) {
          a = '' + f;
        },
        stopTracking: function () {
          (l._valueTracker = null), delete l[t];
        }
      }
    );
  }
}
function jf(l) {
  if (!l._valueTracker) {
    var t = x0(l) ? 'checked' : 'value';
    l._valueTracker = ko(l, t, '' + l[t]);
  }
}
function R0(l) {
  if (!l) return !1;
  var t = l._valueTracker;
  if (!t) return !0;
  var a = t.getValue(),
    u = '';
  return (
    l && (u = x0(l) ? (l.checked ? 'true' : 'false') : l.value),
    (l = u),
    l !== a ? (t.setValue(l), !0) : !1
  );
}
function Ke(l) {
  if (((l = l || (typeof document < 'u' ? document : void 0)), typeof l > 'u'))
    return null;
  try {
    return l.activeElement || l.body;
  } catch {
    return l.body;
  }
}
var Io = /[\n"\\]/g;
function Vl(l) {
  return l.replace(Io, function (t) {
    return '\\' + t.charCodeAt(0).toString(16) + ' ';
  });
}
function Bf(l, t, a, u, e, n, f, i) {
  (l.name = ''),
    f != null &&
    typeof f != 'function' &&
    typeof f != 'symbol' &&
    typeof f != 'boolean'
      ? (l.type = f)
      : l.removeAttribute('type'),
    t != null
      ? f === 'number'
        ? ((t === 0 && l.value === '') || l.value != t) &&
          (l.value = '' + Xl(t))
        : l.value !== '' + Xl(t) && (l.value = '' + Xl(t))
      : (f !== 'submit' && f !== 'reset') || l.removeAttribute('value'),
    t != null
      ? Cf(l, f, Xl(t))
      : a != null
        ? Cf(l, f, Xl(a))
        : u != null && l.removeAttribute('value'),
    e == null && n != null && (l.defaultChecked = !!n),
    e != null &&
      (l.checked = e && typeof e != 'function' && typeof e != 'symbol'),
    i != null &&
    typeof i != 'function' &&
    typeof i != 'symbol' &&
    typeof i != 'boolean'
      ? (l.name = '' + Xl(i))
      : l.removeAttribute('name');
}
function j0(l, t, a, u, e, n, f, i) {
  if (
    (n != null &&
      typeof n != 'function' &&
      typeof n != 'symbol' &&
      typeof n != 'boolean' &&
      (l.type = n),
    t != null || a != null)
  ) {
    if (!((n !== 'submit' && n !== 'reset') || t != null)) {
      jf(l);
      return;
    }
    (a = a != null ? '' + Xl(a) : ''),
      (t = t != null ? '' + Xl(t) : a),
      i || t === l.value || (l.value = t),
      (l.defaultValue = t);
  }
  (u = u ?? e),
    (u = typeof u != 'function' && typeof u != 'symbol' && !!u),
    (l.checked = i ? l.checked : !!u),
    (l.defaultChecked = !!u),
    f != null &&
      typeof f != 'function' &&
      typeof f != 'symbol' &&
      typeof f != 'boolean' &&
      (l.name = f),
    jf(l);
}
function Cf(l, t, a) {
  (t === 'number' && Ke(l.ownerDocument) === l) ||
    l.defaultValue === '' + a ||
    (l.defaultValue = '' + a);
}
function qa(l, t, a, u) {
  if (((l = l.options), t)) {
    t = {};
    for (var e = 0; e < a.length; e++) t['$' + a[e]] = !0;
    for (a = 0; a < l.length; a++)
      (e = t.hasOwnProperty('$' + l[a].value)),
        l[a].selected !== e && (l[a].selected = e),
        e && u && (l[a].defaultSelected = !0);
  } else {
    for (a = '' + Xl(a), t = null, e = 0; e < l.length; e++) {
      if (l[e].value === a) {
        (l[e].selected = !0), u && (l[e].defaultSelected = !0);
        return;
      }
      t !== null || l[e].disabled || (t = l[e]);
    }
    t !== null && (t.selected = !0);
  }
}
function B0(l, t, a) {
  if (
    t != null &&
    ((t = '' + Xl(t)), t !== l.value && (l.value = t), a == null)
  ) {
    l.defaultValue !== t && (l.defaultValue = t);
    return;
  }
  l.defaultValue = a != null ? '' + Xl(a) : '';
}
function C0(l, t, a, u) {
  if (t == null) {
    if (u != null) {
      if (a != null) throw Error(r(92));
      if (gu(u)) {
        if (1 < u.length) throw Error(r(93));
        u = u[0];
      }
      a = u;
    }
    a == null && (a = ''), (t = a);
  }
  (a = Xl(t)),
    (l.defaultValue = a),
    (u = l.textContent),
    u === a && u !== '' && u !== null && (l.value = u),
    jf(l);
}
function Ka(l, t) {
  if (t) {
    var a = l.firstChild;
    if (a && a === l.lastChild && a.nodeType === 3) {
      a.nodeValue = t;
      return;
    }
  }
  l.textContent = t;
}
var Po = new Set(
  'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
    ' '
  )
);
function jc(l, t, a) {
  var u = t.indexOf('--') === 0;
  a == null || typeof a == 'boolean' || a === ''
    ? u
      ? l.setProperty(t, '')
      : t === 'float'
        ? (l.cssFloat = '')
        : (l[t] = '')
    : u
      ? l.setProperty(t, a)
      : typeof a != 'number' || a === 0 || Po.has(t)
        ? t === 'float'
          ? (l.cssFloat = a)
          : (l[t] = ('' + a).trim())
        : (l[t] = a + 'px');
}
function q0(l, t, a) {
  if (t != null && typeof t != 'object') throw Error(r(62));
  if (((l = l.style), a != null)) {
    for (var u in a)
      !a.hasOwnProperty(u) ||
        (t != null && t.hasOwnProperty(u)) ||
        (u.indexOf('--') === 0
          ? l.setProperty(u, '')
          : u === 'float'
            ? (l.cssFloat = '')
            : (l[u] = ''));
    for (var e in t)
      (u = t[e]), t.hasOwnProperty(e) && a[e] !== u && jc(l, e, u);
  } else for (var n in t) t.hasOwnProperty(n) && jc(l, n, t[n]);
}
function Hi(l) {
  if (l.indexOf('-') === -1) return !1;
  switch (l) {
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return !1;
    default:
      return !0;
  }
}
var lv = new Map([
    ['acceptCharset', 'accept-charset'],
    ['htmlFor', 'for'],
    ['httpEquiv', 'http-equiv'],
    ['crossOrigin', 'crossorigin'],
    ['accentHeight', 'accent-height'],
    ['alignmentBaseline', 'alignment-baseline'],
    ['arabicForm', 'arabic-form'],
    ['baselineShift', 'baseline-shift'],
    ['capHeight', 'cap-height'],
    ['clipPath', 'clip-path'],
    ['clipRule', 'clip-rule'],
    ['colorInterpolation', 'color-interpolation'],
    ['colorInterpolationFilters', 'color-interpolation-filters'],
    ['colorProfile', 'color-profile'],
    ['colorRendering', 'color-rendering'],
    ['dominantBaseline', 'dominant-baseline'],
    ['enableBackground', 'enable-background'],
    ['fillOpacity', 'fill-opacity'],
    ['fillRule', 'fill-rule'],
    ['floodColor', 'flood-color'],
    ['floodOpacity', 'flood-opacity'],
    ['fontFamily', 'font-family'],
    ['fontSize', 'font-size'],
    ['fontSizeAdjust', 'font-size-adjust'],
    ['fontStretch', 'font-stretch'],
    ['fontStyle', 'font-style'],
    ['fontVariant', 'font-variant'],
    ['fontWeight', 'font-weight'],
    ['glyphName', 'glyph-name'],
    ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
    ['glyphOrientationVertical', 'glyph-orientation-vertical'],
    ['horizAdvX', 'horiz-adv-x'],
    ['horizOriginX', 'horiz-origin-x'],
    ['imageRendering', 'image-rendering'],
    ['letterSpacing', 'letter-spacing'],
    ['lightingColor', 'lighting-color'],
    ['markerEnd', 'marker-end'],
    ['markerMid', 'marker-mid'],
    ['markerStart', 'marker-start'],
    ['overlinePosition', 'overline-position'],
    ['overlineThickness', 'overline-thickness'],
    ['paintOrder', 'paint-order'],
    ['panose-1', 'panose-1'],
    ['pointerEvents', 'pointer-events'],
    ['renderingIntent', 'rendering-intent'],
    ['shapeRendering', 'shape-rendering'],
    ['stopColor', 'stop-color'],
    ['stopOpacity', 'stop-opacity'],
    ['strikethroughPosition', 'strikethrough-position'],
    ['strikethroughThickness', 'strikethrough-thickness'],
    ['strokeDasharray', 'stroke-dasharray'],
    ['strokeDashoffset', 'stroke-dashoffset'],
    ['strokeLinecap', 'stroke-linecap'],
    ['strokeLinejoin', 'stroke-linejoin'],
    ['strokeMiterlimit', 'stroke-miterlimit'],
    ['strokeOpacity', 'stroke-opacity'],
    ['strokeWidth', 'stroke-width'],
    ['textAnchor', 'text-anchor'],
    ['textDecoration', 'text-decoration'],
    ['textRendering', 'text-rendering'],
    ['transformOrigin', 'transform-origin'],
    ['underlinePosition', 'underline-position'],
    ['underlineThickness', 'underline-thickness'],
    ['unicodeBidi', 'unicode-bidi'],
    ['unicodeRange', 'unicode-range'],
    ['unitsPerEm', 'units-per-em'],
    ['vAlphabetic', 'v-alphabetic'],
    ['vHanging', 'v-hanging'],
    ['vIdeographic', 'v-ideographic'],
    ['vMathematical', 'v-mathematical'],
    ['vectorEffect', 'vector-effect'],
    ['vertAdvY', 'vert-adv-y'],
    ['vertOriginX', 'vert-origin-x'],
    ['vertOriginY', 'vert-origin-y'],
    ['wordSpacing', 'word-spacing'],
    ['writingMode', 'writing-mode'],
    ['xmlnsXlink', 'xmlns:xlink'],
    ['xHeight', 'x-height']
  ]),
  tv =
    /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
function Me(l) {
  return tv.test('' + l)
    ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
    : l;
}
function vt() {}
var qf = null;
function xi(l) {
  return (
    (l = l.target || l.srcElement || window),
    l.correspondingUseElement && (l = l.correspondingUseElement),
    l.nodeType === 3 ? l.parentNode : l
  );
}
var Ma = null,
  Ya = null;
function Bc(l) {
  var t = au(l);
  if (t && (l = t.stateNode)) {
    var a = l[Ol] || null;
    l: switch (((l = t.stateNode), t.type)) {
      case 'input':
        if (
          (Bf(
            l,
            a.value,
            a.defaultValue,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name
          ),
          (t = a.name),
          a.type === 'radio' && t != null)
        ) {
          for (a = l; a.parentNode; ) a = a.parentNode;
          for (
            a = a.querySelectorAll(
              'input[name="' + Vl('' + t) + '"][type="radio"]'
            ),
              t = 0;
            t < a.length;
            t++
          ) {
            var u = a[t];
            if (u !== l && u.form === l.form) {
              var e = u[Ol] || null;
              if (!e) throw Error(r(90));
              Bf(
                u,
                e.value,
                e.defaultValue,
                e.defaultValue,
                e.checked,
                e.defaultChecked,
                e.type,
                e.name
              );
            }
          }
          for (t = 0; t < a.length; t++) (u = a[t]), u.form === l.form && R0(u);
        }
        break l;
      case 'textarea':
        B0(l, a.value, a.defaultValue);
        break l;
      case 'select':
        (t = a.value), t != null && qa(l, !!a.multiple, t, !1);
    }
  }
}
var Vn = !1;
function Y0(l, t, a) {
  if (Vn) return l(t, a);
  Vn = !0;
  try {
    var u = l(t);
    return u;
  } finally {
    if (
      ((Vn = !1),
      (Ma !== null || Ya !== null) &&
        (xn(), Ma && ((t = Ma), (l = Ya), (Ya = Ma = null), Bc(t), l)))
    )
      for (t = 0; t < l.length; t++) Bc(l[t]);
  }
}
function Cu(l, t) {
  var a = l.stateNode;
  if (a === null) return null;
  var u = a[Ol] || null;
  if (u === null) return null;
  a = u[t];
  l: switch (t) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
    case 'onMouseEnter':
      (u = !u.disabled) ||
        ((l = l.type),
        (u = !(
          l === 'button' ||
          l === 'input' ||
          l === 'select' ||
          l === 'textarea'
        ))),
        (l = !u);
      break l;
    default:
      l = !1;
  }
  if (l) return null;
  if (a && typeof a != 'function') throw Error(r(231, t, typeof a));
  return a;
}
var rt = !(
    typeof window > 'u' ||
    typeof window.document > 'u' ||
    typeof window.document.createElement > 'u'
  ),
  Yf = !1;
if (rt)
  try {
    var su = {};
    Object.defineProperty(su, 'passive', {
      get: function () {
        Yf = !0;
      }
    }),
      window.addEventListener('test', su, su),
      window.removeEventListener('test', su, su);
  } catch {
    Yf = !1;
  }
var Rt = null,
  Ri = null,
  De = null;
function G0() {
  if (De) return De;
  var l,
    t = Ri,
    a = t.length,
    u,
    e = 'value' in Rt ? Rt.value : Rt.textContent,
    n = e.length;
  for (l = 0; l < a && t[l] === e[l]; l++);
  var f = a - l;
  for (u = 1; u <= f && t[a - u] === e[n - u]; u++);
  return (De = e.slice(l, 1 < u ? 1 - u : void 0));
}
function Ue(l) {
  var t = l.keyCode;
  return (
    'charCode' in l
      ? ((l = l.charCode), l === 0 && t === 13 && (l = 13))
      : (l = t),
    l === 10 && (l = 13),
    32 <= l || l === 13 ? l : 0
  );
}
function ge() {
  return !0;
}
function Cc() {
  return !1;
}
function Ml(l) {
  function t(a, u, e, n, f) {
    (this._reactName = a),
      (this._targetInst = e),
      (this.type = u),
      (this.nativeEvent = n),
      (this.target = f),
      (this.currentTarget = null);
    for (var i in l)
      l.hasOwnProperty(i) && ((a = l[i]), (this[i] = a ? a(n) : n[i]));
    return (
      (this.isDefaultPrevented = (
        n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1
      )
        ? ge
        : Cc),
      (this.isPropagationStopped = Cc),
      this
    );
  }
  return (
    F(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a &&
          (a.preventDefault
            ? a.preventDefault()
            : typeof a.returnValue != 'unknown' && (a.returnValue = !1),
          (this.isDefaultPrevented = ge));
      },
      stopPropagation: function () {
        var a = this.nativeEvent;
        a &&
          (a.stopPropagation
            ? a.stopPropagation()
            : typeof a.cancelBubble != 'unknown' && (a.cancelBubble = !0),
          (this.isPropagationStopped = ge));
      },
      persist: function () {},
      isPersistent: ge
    }),
    t
  );
}
var ha = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  },
  Tn = Ml(ha),
  le = F({}, ha, { view: 0, detail: 0 }),
  av = Ml(le),
  Kn,
  Jn,
  yu,
  En = F({}, le, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: ji,
    button: 0,
    buttons: 0,
    relatedTarget: function (l) {
      return l.relatedTarget === void 0
        ? l.fromElement === l.srcElement
          ? l.toElement
          : l.fromElement
        : l.relatedTarget;
    },
    movementX: function (l) {
      return 'movementX' in l
        ? l.movementX
        : (l !== yu &&
            (yu && l.type === 'mousemove'
              ? ((Kn = l.screenX - yu.screenX), (Jn = l.screenY - yu.screenY))
              : (Jn = Kn = 0),
            (yu = l)),
          Kn);
    },
    movementY: function (l) {
      return 'movementY' in l ? l.movementY : Jn;
    }
  }),
  qc = Ml(En),
  uv = F({}, En, { dataTransfer: 0 }),
  ev = Ml(uv),
  nv = F({}, le, { relatedTarget: 0 }),
  wn = Ml(nv),
  fv = F({}, ha, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  iv = Ml(fv),
  cv = F({}, ha, {
    clipboardData: function (l) {
      return 'clipboardData' in l ? l.clipboardData : window.clipboardData;
    }
  }),
  sv = Ml(cv),
  yv = F({}, ha, { data: 0 }),
  Yc = Ml(yv),
  dv = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified'
  },
  ov = {
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    45: 'Insert',
    46: 'Delete',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    224: 'Meta'
  },
  vv = {
    Alt: 'altKey',
    Control: 'ctrlKey',
    Meta: 'metaKey',
    Shift: 'shiftKey'
  };
function mv(l) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(l) : (l = vv[l]) ? !!t[l] : !1;
}
function ji() {
  return mv;
}
var hv = F({}, le, {
    key: function (l) {
      if (l.key) {
        var t = dv[l.key] || l.key;
        if (t !== 'Unidentified') return t;
      }
      return l.type === 'keypress'
        ? ((l = Ue(l)), l === 13 ? 'Enter' : String.fromCharCode(l))
        : l.type === 'keydown' || l.type === 'keyup'
          ? ov[l.keyCode] || 'Unidentified'
          : '';
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: ji,
    charCode: function (l) {
      return l.type === 'keypress' ? Ue(l) : 0;
    },
    keyCode: function (l) {
      return l.type === 'keydown' || l.type === 'keyup' ? l.keyCode : 0;
    },
    which: function (l) {
      return l.type === 'keypress'
        ? Ue(l)
        : l.type === 'keydown' || l.type === 'keyup'
          ? l.keyCode
          : 0;
    }
  }),
  gv = Ml(hv),
  Sv = F({}, En, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }),
  Gc = Ml(Sv),
  rv = F({}, le, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: ji
  }),
  bv = Ml(rv),
  zv = F({}, ha, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Tv = Ml(zv),
  Ev = F({}, En, {
    deltaX: function (l) {
      return 'deltaX' in l ? l.deltaX : 'wheelDeltaX' in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function (l) {
      return 'deltaY' in l
        ? l.deltaY
        : 'wheelDeltaY' in l
          ? -l.wheelDeltaY
          : 'wheelDelta' in l
            ? -l.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }),
  Av = Ml(Ev),
  pv = F({}, ha, { newState: 0, oldState: 0 }),
  _v = Ml(pv),
  Ov = [9, 13, 27, 32],
  Bi = rt && 'CompositionEvent' in window,
  Eu = null;
rt && 'documentMode' in document && (Eu = document.documentMode);
var Mv = rt && 'TextEvent' in window && !Eu,
  Q0 = rt && (!Bi || (Eu && 8 < Eu && 11 >= Eu)),
  Qc = ' ',
  Xc = !1;
function X0(l, t) {
  switch (l) {
    case 'keyup':
      return Ov.indexOf(t.keyCode) !== -1;
    case 'keydown':
      return t.keyCode !== 229;
    case 'keypress':
    case 'mousedown':
    case 'focusout':
      return !0;
    default:
      return !1;
  }
}
function Z0(l) {
  return (l = l.detail), typeof l == 'object' && 'data' in l ? l.data : null;
}
var Da = !1;
function Dv(l, t) {
  switch (l) {
    case 'compositionend':
      return Z0(t);
    case 'keypress':
      return t.which !== 32 ? null : ((Xc = !0), Qc);
    case 'textInput':
      return (l = t.data), l === Qc && Xc ? null : l;
    default:
      return null;
  }
}
function Uv(l, t) {
  if (Da)
    return l === 'compositionend' || (!Bi && X0(l, t))
      ? ((l = G0()), (De = Ri = Rt = null), (Da = !1), l)
      : null;
  switch (l) {
    case 'paste':
      return null;
    case 'keypress':
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case 'compositionend':
      return Q0 && t.locale !== 'ko' ? null : t.data;
    default:
      return null;
  }
}
var Nv = {
  color: !0,
  date: !0,
  datetime: !0,
  'datetime-local': !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0
};
function Zc(l) {
  var t = l && l.nodeName && l.nodeName.toLowerCase();
  return t === 'input' ? !!Nv[l.type] : t === 'textarea';
}
function L0(l, t, a, u) {
  Ma ? (Ya ? Ya.push(u) : (Ya = [u])) : (Ma = u),
    (t = yn(t, 'onChange')),
    0 < t.length &&
      ((a = new Tn('onChange', 'change', null, a, u)),
      l.push({ event: a, listeners: t }));
}
var Au = null,
  qu = null;
function Hv(l) {
  Yd(l, 0);
}
function An(l) {
  var t = Su(l);
  if (R0(t)) return l;
}
function Lc(l, t) {
  if (l === 'change') return t;
}
var V0 = !1;
if (rt) {
  var $n;
  if (rt) {
    var Wn = 'oninput' in document;
    if (!Wn) {
      var Vc = document.createElement('div');
      Vc.setAttribute('oninput', 'return;'),
        (Wn = typeof Vc.oninput == 'function');
    }
    $n = Wn;
  } else $n = !1;
  V0 = $n && (!document.documentMode || 9 < document.documentMode);
}
function Kc() {
  Au && (Au.detachEvent('onpropertychange', K0), (qu = Au = null));
}
function K0(l) {
  if (l.propertyName === 'value' && An(qu)) {
    var t = [];
    L0(t, qu, l, xi(l)), Y0(Hv, t);
  }
}
function xv(l, t, a) {
  l === 'focusin'
    ? (Kc(), (Au = t), (qu = a), Au.attachEvent('onpropertychange', K0))
    : l === 'focusout' && Kc();
}
function Rv(l) {
  if (l === 'selectionchange' || l === 'keyup' || l === 'keydown')
    return An(qu);
}
function jv(l, t) {
  if (l === 'click') return An(t);
}
function Bv(l, t) {
  if (l === 'input' || l === 'change') return An(t);
}
function Cv(l, t) {
  return (l === t && (l !== 0 || 1 / l === 1 / t)) || (l !== l && t !== t);
}
var ql = typeof Object.is == 'function' ? Object.is : Cv;
function Yu(l, t) {
  if (ql(l, t)) return !0;
  if (typeof l != 'object' || l === null || typeof t != 'object' || t === null)
    return !1;
  var a = Object.keys(l),
    u = Object.keys(t);
  if (a.length !== u.length) return !1;
  for (u = 0; u < a.length; u++) {
    var e = a[u];
    if (!xf.call(t, e) || !ql(l[e], t[e])) return !1;
  }
  return !0;
}
function Jc(l) {
  for (; l && l.firstChild; ) l = l.firstChild;
  return l;
}
function wc(l, t) {
  var a = Jc(l);
  l = 0;
  for (var u; a; ) {
    if (a.nodeType === 3) {
      if (((u = l + a.textContent.length), l <= t && u >= t))
        return { node: a, offset: t - l };
      l = u;
    }
    l: {
      for (; a; ) {
        if (a.nextSibling) {
          a = a.nextSibling;
          break l;
        }
        a = a.parentNode;
      }
      a = void 0;
    }
    a = Jc(a);
  }
}
function J0(l, t) {
  return l && t
    ? l === t
      ? !0
      : l && l.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? J0(l, t.parentNode)
          : 'contains' in l
            ? l.contains(t)
            : l.compareDocumentPosition
              ? !!(l.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function w0(l) {
  l =
    l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null
      ? l.ownerDocument.defaultView
      : window;
  for (var t = Ke(l.document); t instanceof l.HTMLIFrameElement; ) {
    try {
      var a = typeof t.contentWindow.location.href == 'string';
    } catch {
      a = !1;
    }
    if (a) l = t.contentWindow;
    else break;
    t = Ke(l.document);
  }
  return t;
}
function Ci(l) {
  var t = l && l.nodeName && l.nodeName.toLowerCase();
  return (
    t &&
    ((t === 'input' &&
      (l.type === 'text' ||
        l.type === 'search' ||
        l.type === 'tel' ||
        l.type === 'url' ||
        l.type === 'password')) ||
      t === 'textarea' ||
      l.contentEditable === 'true')
  );
}
var qv = rt && 'documentMode' in document && 11 >= document.documentMode,
  Ua = null,
  Gf = null,
  pu = null,
  Qf = !1;
function $c(l, t, a) {
  var u = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
  Qf ||
    Ua == null ||
    Ua !== Ke(u) ||
    ((u = Ua),
    'selectionStart' in u && Ci(u)
      ? (u = { start: u.selectionStart, end: u.selectionEnd })
      : ((u = (
          (u.ownerDocument && u.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (u = {
          anchorNode: u.anchorNode,
          anchorOffset: u.anchorOffset,
          focusNode: u.focusNode,
          focusOffset: u.focusOffset
        })),
    (pu && Yu(pu, u)) ||
      ((pu = u),
      (u = yn(Gf, 'onSelect')),
      0 < u.length &&
        ((t = new Tn('onSelect', 'select', null, t, a)),
        l.push({ event: t, listeners: u }),
        (t.target = Ua))));
}
function Pt(l, t) {
  var a = {};
  return (
    (a[l.toLowerCase()] = t.toLowerCase()),
    (a['Webkit' + l] = 'webkit' + t),
    (a['Moz' + l] = 'moz' + t),
    a
  );
}
var Na = {
    animationend: Pt('Animation', 'AnimationEnd'),
    animationiteration: Pt('Animation', 'AnimationIteration'),
    animationstart: Pt('Animation', 'AnimationStart'),
    transitionrun: Pt('Transition', 'TransitionRun'),
    transitionstart: Pt('Transition', 'TransitionStart'),
    transitioncancel: Pt('Transition', 'TransitionCancel'),
    transitionend: Pt('Transition', 'TransitionEnd')
  },
  Fn = {},
  $0 = {};
rt &&
  (($0 = document.createElement('div').style),
  'AnimationEvent' in window ||
    (delete Na.animationend.animation,
    delete Na.animationiteration.animation,
    delete Na.animationstart.animation),
  'TransitionEvent' in window || delete Na.transitionend.transition);
function ga(l) {
  if (Fn[l]) return Fn[l];
  if (!Na[l]) return l;
  var t = Na[l],
    a;
  for (a in t) if (t.hasOwnProperty(a) && a in $0) return (Fn[l] = t[a]);
  return l;
}
var W0 = ga('animationend'),
  F0 = ga('animationiteration'),
  k0 = ga('animationstart'),
  Yv = ga('transitionrun'),
  Gv = ga('transitionstart'),
  Qv = ga('transitioncancel'),
  I0 = ga('transitionend'),
  P0 = new Map(),
  Xf =
    'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
      ' '
    );
Xf.push('scrollEnd');
function Il(l, t) {
  P0.set(l, t), ma(t, [l]);
}
var Je =
    typeof reportError == 'function'
      ? reportError
      : function (l) {
          if (
            typeof window == 'object' &&
            typeof window.ErrorEvent == 'function'
          ) {
            var t = new window.ErrorEvent('error', {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof l == 'object' &&
                l !== null &&
                typeof l.message == 'string'
                  ? String(l.message)
                  : String(l),
              error: l
            });
            if (!window.dispatchEvent(t)) return;
          } else if (
            typeof process == 'object' &&
            typeof process.emit == 'function'
          ) {
            process.emit('uncaughtException', l);
            return;
          }
          console.error(l);
        },
  Ql = [],
  Ha = 0,
  qi = 0;
function pn() {
  for (var l = Ha, t = (qi = Ha = 0); t < l; ) {
    var a = Ql[t];
    Ql[t++] = null;
    var u = Ql[t];
    Ql[t++] = null;
    var e = Ql[t];
    Ql[t++] = null;
    var n = Ql[t];
    if (((Ql[t++] = null), u !== null && e !== null)) {
      var f = u.pending;
      f === null ? (e.next = e) : ((e.next = f.next), (f.next = e)),
        (u.pending = e);
    }
    n !== 0 && ly(a, e, n);
  }
}
function _n(l, t, a, u) {
  (Ql[Ha++] = l),
    (Ql[Ha++] = t),
    (Ql[Ha++] = a),
    (Ql[Ha++] = u),
    (qi |= u),
    (l.lanes |= u),
    (l = l.alternate),
    l !== null && (l.lanes |= u);
}
function Yi(l, t, a, u) {
  return _n(l, t, a, u), we(l);
}
function Sa(l, t) {
  return _n(l, null, null, t), we(l);
}
function ly(l, t, a) {
  l.lanes |= a;
  var u = l.alternate;
  u !== null && (u.lanes |= a);
  for (var e = !1, n = l.return; n !== null; )
    (n.childLanes |= a),
      (u = n.alternate),
      u !== null && (u.childLanes |= a),
      n.tag === 22 &&
        ((l = n.stateNode), l === null || l._visibility & 1 || (e = !0)),
      (l = n),
      (n = n.return);
  return l.tag === 3
    ? ((n = l.stateNode),
      e &&
        t !== null &&
        ((e = 31 - Bl(a)),
        (l = n.hiddenUpdates),
        (u = l[e]),
        u === null ? (l[e] = [t]) : u.push(t),
        (t.lane = a | 536870912)),
      n)
    : null;
}
function we(l) {
  if (50 < Ru) throw ((Ru = 0), (ci = null), Error(r(185)));
  for (var t = l.return; t !== null; ) (l = t), (t = l.return);
  return l.tag === 3 ? l.stateNode : null;
}
var xa = {};
function Xv(l, t, a, u) {
  (this.tag = l),
    (this.key = a),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.refCleanup = this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = u),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function Hl(l, t, a, u) {
  return new Xv(l, t, a, u);
}
function Gi(l) {
  return (l = l.prototype), !(!l || !l.isReactComponent);
}
function ht(l, t) {
  var a = l.alternate;
  return (
    a === null
      ? ((a = Hl(l.tag, t, l.key, l.mode)),
        (a.elementType = l.elementType),
        (a.type = l.type),
        (a.stateNode = l.stateNode),
        (a.alternate = l),
        (l.alternate = a))
      : ((a.pendingProps = t),
        (a.type = l.type),
        (a.flags = 0),
        (a.subtreeFlags = 0),
        (a.deletions = null)),
    (a.flags = l.flags & 65011712),
    (a.childLanes = l.childLanes),
    (a.lanes = l.lanes),
    (a.child = l.child),
    (a.memoizedProps = l.memoizedProps),
    (a.memoizedState = l.memoizedState),
    (a.updateQueue = l.updateQueue),
    (t = l.dependencies),
    (a.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (a.sibling = l.sibling),
    (a.index = l.index),
    (a.ref = l.ref),
    (a.refCleanup = l.refCleanup),
    a
  );
}
function ty(l, t) {
  l.flags &= 65011714;
  var a = l.alternate;
  return (
    a === null
      ? ((l.childLanes = 0),
        (l.lanes = t),
        (l.child = null),
        (l.subtreeFlags = 0),
        (l.memoizedProps = null),
        (l.memoizedState = null),
        (l.updateQueue = null),
        (l.dependencies = null),
        (l.stateNode = null))
      : ((l.childLanes = a.childLanes),
        (l.lanes = a.lanes),
        (l.child = a.child),
        (l.subtreeFlags = 0),
        (l.deletions = null),
        (l.memoizedProps = a.memoizedProps),
        (l.memoizedState = a.memoizedState),
        (l.updateQueue = a.updateQueue),
        (l.type = a.type),
        (t = a.dependencies),
        (l.dependencies =
          t === null
            ? null
            : { lanes: t.lanes, firstContext: t.firstContext })),
    l
  );
}
function Ne(l, t, a, u, e, n) {
  var f = 0;
  if (((u = l), typeof l == 'function')) Gi(l) && (f = 1);
  else if (typeof l == 'string')
    f = Jm(l, a, at.current)
      ? 26
      : l === 'html' || l === 'head' || l === 'body'
        ? 27
        : 5;
  else
    l: switch (l) {
      case Df:
        return (l = Hl(31, a, t, e)), (l.elementType = Df), (l.lanes = n), l;
      case pa:
        return na(a.children, e, n, t);
      case z0:
        (f = 8), (e |= 24);
        break;
      case _f:
        return (
          (l = Hl(12, a, t, e | 2)), (l.elementType = _f), (l.lanes = n), l
        );
      case Of:
        return (l = Hl(13, a, t, e)), (l.elementType = Of), (l.lanes = n), l;
      case Mf:
        return (l = Hl(19, a, t, e)), (l.elementType = Mf), (l.lanes = n), l;
      default:
        if (typeof l == 'object' && l !== null)
          switch (l.$$typeof) {
            case ot:
              f = 10;
              break l;
            case T0:
              f = 9;
              break l;
            case _i:
              f = 11;
              break l;
            case Oi:
              f = 14;
              break l;
            case Ot:
              (f = 16), (u = null);
              break l;
          }
        (f = 29),
          (a = Error(r(130, l === null ? 'null' : typeof l, ''))),
          (u = null);
    }
  return (
    (t = Hl(f, a, t, e)), (t.elementType = l), (t.type = u), (t.lanes = n), t
  );
}
function na(l, t, a, u) {
  return (l = Hl(7, l, u, t)), (l.lanes = a), l;
}
function kn(l, t, a) {
  return (l = Hl(6, l, null, t)), (l.lanes = a), l;
}
function ay(l) {
  var t = Hl(18, null, null, 0);
  return (t.stateNode = l), t;
}
function In(l, t, a) {
  return (
    (t = Hl(4, l.children !== null ? l.children : [], l.key, t)),
    (t.lanes = a),
    (t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }),
    t
  );
}
var Wc = new WeakMap();
function Kl(l, t) {
  if (typeof l == 'object' && l !== null) {
    var a = Wc.get(l);
    return a !== void 0
      ? a
      : ((t = { value: l, source: t, stack: Uc(t) }), Wc.set(l, t), t);
  }
  return { value: l, source: t, stack: Uc(t) };
}
var Ra = [],
  ja = 0,
  $e = null,
  Gu = 0,
  Zl = [],
  Ll = 0,
  Jt = null,
  Pl = 1,
  lt = '';
function yt(l, t) {
  (Ra[ja++] = Gu), (Ra[ja++] = $e), ($e = l), (Gu = t);
}
function uy(l, t, a) {
  (Zl[Ll++] = Pl), (Zl[Ll++] = lt), (Zl[Ll++] = Jt), (Jt = l);
  var u = Pl;
  l = lt;
  var e = 32 - Bl(u) - 1;
  (u &= ~(1 << e)), (a += 1);
  var n = 32 - Bl(t) + e;
  if (30 < n) {
    var f = e - (e % 5);
    (n = (u & ((1 << f) - 1)).toString(32)),
      (u >>= f),
      (e -= f),
      (Pl = (1 << (32 - Bl(t) + e)) | (a << e) | u),
      (lt = n + l);
  } else (Pl = (1 << n) | (a << e) | u), (lt = l);
}
function Qi(l) {
  l.return !== null && (yt(l, 1), uy(l, 1, 0));
}
function Xi(l) {
  for (; l === $e; )
    ($e = Ra[--ja]), (Ra[ja] = null), (Gu = Ra[--ja]), (Ra[ja] = null);
  for (; l === Jt; )
    (Jt = Zl[--Ll]),
      (Zl[Ll] = null),
      (lt = Zl[--Ll]),
      (Zl[Ll] = null),
      (Pl = Zl[--Ll]),
      (Zl[Ll] = null);
}
function ey(l, t) {
  (Zl[Ll++] = Pl),
    (Zl[Ll++] = lt),
    (Zl[Ll++] = Jt),
    (Pl = t.id),
    (lt = t.overflow),
    (Jt = l);
}
var hl = null,
  $ = null,
  Y = !1,
  Yt = null,
  Jl = !1,
  Zf = Error(r(519));
function wt(l) {
  var t = Error(
    r(
      418,
      1 < arguments.length && arguments[1] !== void 0 && arguments[1]
        ? 'text'
        : 'HTML',
      ''
    )
  );
  throw (Qu(Kl(t, l)), Zf);
}
function Fc(l) {
  var t = l.stateNode,
    a = l.type,
    u = l.memoizedProps;
  switch (((t[ml] = l), (t[Ol] = u), a)) {
    case 'dialog':
      j('cancel', t), j('close', t);
      break;
    case 'iframe':
    case 'object':
    case 'embed':
      j('load', t);
      break;
    case 'video':
    case 'audio':
      for (a = 0; a < Vu.length; a++) j(Vu[a], t);
      break;
    case 'source':
      j('error', t);
      break;
    case 'img':
    case 'image':
    case 'link':
      j('error', t), j('load', t);
      break;
    case 'details':
      j('toggle', t);
      break;
    case 'input':
      j('invalid', t),
        j0(
          t,
          u.value,
          u.defaultValue,
          u.checked,
          u.defaultChecked,
          u.type,
          u.name,
          !0
        );
      break;
    case 'select':
      j('invalid', t);
      break;
    case 'textarea':
      j('invalid', t), C0(t, u.value, u.defaultValue, u.children);
  }
  (a = u.children),
    (typeof a != 'string' && typeof a != 'number' && typeof a != 'bigint') ||
    t.textContent === '' + a ||
    u.suppressHydrationWarning === !0 ||
    Qd(t.textContent, a)
      ? (u.popover != null && (j('beforetoggle', t), j('toggle', t)),
        u.onScroll != null && j('scroll', t),
        u.onScrollEnd != null && j('scrollend', t),
        u.onClick != null && (t.onclick = vt),
        (t = !0))
      : (t = !1),
    t || wt(l, !0);
}
function kc(l) {
  for (hl = l.return; hl; )
    switch (hl.tag) {
      case 5:
      case 31:
      case 13:
        Jl = !1;
        return;
      case 27:
      case 3:
        Jl = !0;
        return;
      default:
        hl = hl.return;
    }
}
function ba(l) {
  if (l !== hl) return !1;
  if (!Y) return kc(l), (Y = !0), !1;
  var t = l.tag,
    a;
  if (
    ((a = t !== 3 && t !== 27) &&
      ((a = t === 5) &&
        ((a = l.type),
        (a = !(a !== 'form' && a !== 'button') || vi(l.type, l.memoizedProps))),
      (a = !a)),
    a && $ && wt(l),
    kc(l),
    t === 13)
  ) {
    if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l))
      throw Error(r(317));
    $ = qs(l);
  } else if (t === 31) {
    if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l))
      throw Error(r(317));
    $ = qs(l);
  } else
    t === 27
      ? ((t = $), kt(l.type) ? ((l = Si), (Si = null), ($ = l)) : ($ = t))
      : ($ = hl ? $l(l.stateNode.nextSibling) : null);
  return !0;
}
function sa() {
  ($ = hl = null), (Y = !1);
}
function Pn() {
  var l = Yt;
  return (
    l !== null && (pl === null ? (pl = l) : pl.push.apply(pl, l), (Yt = null)),
    l
  );
}
function Qu(l) {
  Yt === null ? (Yt = [l]) : Yt.push(l);
}
var Lf = ut(null),
  ra = null,
  mt = null;
function Dt(l, t, a) {
  J(Lf, t._currentValue), (t._currentValue = a);
}
function gt(l) {
  (l._currentValue = Lf.current), ol(Lf);
}
function Vf(l, t, a) {
  for (; l !== null; ) {
    var u = l.alternate;
    if (
      ((l.childLanes & t) !== t
        ? ((l.childLanes |= t), u !== null && (u.childLanes |= t))
        : u !== null && (u.childLanes & t) !== t && (u.childLanes |= t),
      l === a)
    )
      break;
    l = l.return;
  }
}
function Kf(l, t, a, u) {
  var e = l.child;
  for (e !== null && (e.return = l); e !== null; ) {
    var n = e.dependencies;
    if (n !== null) {
      var f = e.child;
      n = n.firstContext;
      l: for (; n !== null; ) {
        var i = n;
        n = e;
        for (var c = 0; c < t.length; c++)
          if (i.context === t[c]) {
            (n.lanes |= a),
              (i = n.alternate),
              i !== null && (i.lanes |= a),
              Vf(n.return, a, l),
              u || (f = null);
            break l;
          }
        n = i.next;
      }
    } else if (e.tag === 18) {
      if (((f = e.return), f === null)) throw Error(r(341));
      (f.lanes |= a),
        (n = f.alternate),
        n !== null && (n.lanes |= a),
        Vf(f, a, l),
        (f = null);
    } else f = e.child;
    if (f !== null) f.return = e;
    else
      for (f = e; f !== null; ) {
        if (f === l) {
          f = null;
          break;
        }
        if (((e = f.sibling), e !== null)) {
          (e.return = f.return), (f = e);
          break;
        }
        f = f.return;
      }
    e = f;
  }
}
function uu(l, t, a, u) {
  l = null;
  for (var e = t, n = !1; e !== null; ) {
    if (!n) {
      if (e.flags & 524288) n = !0;
      else if (e.flags & 262144) break;
    }
    if (e.tag === 10) {
      var f = e.alternate;
      if (f === null) throw Error(r(387));
      if (((f = f.memoizedProps), f !== null)) {
        var i = e.type;
        ql(e.pendingProps.value, f.value) ||
          (l !== null ? l.push(i) : (l = [i]));
      }
    } else if (e === Xe.current) {
      if (((f = e.alternate), f === null)) throw Error(r(387));
      f.memoizedState.memoizedState !== e.memoizedState.memoizedState &&
        (l !== null ? l.push(Ju) : (l = [Ju]));
    }
    e = e.return;
  }
  l !== null && Kf(t, l, a, u), (t.flags |= 262144);
}
function We(l) {
  for (l = l.firstContext; l !== null; ) {
    if (!ql(l.context._currentValue, l.memoizedValue)) return !0;
    l = l.next;
  }
  return !1;
}
function ya(l) {
  (ra = l),
    (mt = null),
    (l = l.dependencies),
    l !== null && (l.firstContext = null);
}
function gl(l) {
  return ny(ra, l);
}
function Se(l, t) {
  return ra === null && ya(l), ny(l, t);
}
function ny(l, t) {
  var a = t._currentValue;
  if (((t = { context: t, memoizedValue: a, next: null }), mt === null)) {
    if (l === null) throw Error(r(308));
    (mt = t),
      (l.dependencies = { lanes: 0, firstContext: t }),
      (l.flags |= 524288);
  } else mt = mt.next = t;
  return a;
}
var Zv =
    typeof AbortController < 'u'
      ? AbortController
      : function () {
          var l = [],
            t = (this.signal = {
              aborted: !1,
              addEventListener: function (a, u) {
                l.push(u);
              }
            });
          this.abort = function () {
            (t.aborted = !0),
              l.forEach(function (a) {
                return a();
              });
          };
        },
  Lv = cl.unstable_scheduleCallback,
  Vv = cl.unstable_NormalPriority,
  nl = {
    $$typeof: ot,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
function Zi() {
  return { controller: new Zv(), data: new Map(), refCount: 0 };
}
function te(l) {
  l.refCount--,
    l.refCount === 0 &&
      Lv(Vv, function () {
        l.controller.abort();
      });
}
var _u = null,
  Jf = 0,
  Ja = 0,
  Ga = null;
function Kv(l, t) {
  if (_u === null) {
    var a = (_u = []);
    (Jf = 0),
      (Ja = vc()),
      (Ga = {
        status: 'pending',
        value: void 0,
        then: function (u) {
          a.push(u);
        }
      });
  }
  return Jf++, t.then(Ic, Ic), t;
}
function Ic() {
  if (--Jf === 0 && _u !== null) {
    Ga !== null && (Ga.status = 'fulfilled');
    var l = _u;
    (_u = null), (Ja = 0), (Ga = null);
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
}
function Jv(l, t) {
  var a = [],
    u = {
      status: 'pending',
      value: null,
      reason: null,
      then: function (e) {
        a.push(e);
      }
    };
  return (
    l.then(
      function () {
        (u.status = 'fulfilled'), (u.value = t);
        for (var e = 0; e < a.length; e++) (0, a[e])(t);
      },
      function (e) {
        for (u.status = 'rejected', u.reason = e, e = 0; e < a.length; e++)
          (0, a[e])(void 0);
      }
    ),
    u
  );
}
var Pc = O.S;
O.S = function (l, t) {
  (bd = Rl()),
    typeof t == 'object' &&
      t !== null &&
      typeof t.then == 'function' &&
      Kv(l, t),
    Pc !== null && Pc(l, t);
};
var fa = ut(null);
function Li() {
  var l = fa.current;
  return l !== null ? l : K.pooledCache;
}
function He(l, t) {
  t === null ? J(fa, fa.current) : J(fa, t.pool);
}
function fy() {
  var l = Li();
  return l === null ? null : { parent: nl._currentValue, pool: l };
}
var eu = Error(r(460)),
  Vi = Error(r(474)),
  On = Error(r(542)),
  Fe = { then: function () {} };
function ls(l) {
  return (l = l.status), l === 'fulfilled' || l === 'rejected';
}
function iy(l, t, a) {
  switch (
    ((a = l[a]),
    a === void 0 ? l.push(t) : a !== t && (t.then(vt, vt), (t = a)),
    t.status)
  ) {
    case 'fulfilled':
      return t.value;
    case 'rejected':
      throw ((l = t.reason), as(l), l);
    default:
      if (typeof t.status == 'string') t.then(vt, vt);
      else {
        if (((l = K), l !== null && 100 < l.shellSuspendCounter))
          throw Error(r(482));
        (l = t),
          (l.status = 'pending'),
          l.then(
            function (u) {
              if (t.status === 'pending') {
                var e = t;
                (e.status = 'fulfilled'), (e.value = u);
              }
            },
            function (u) {
              if (t.status === 'pending') {
                var e = t;
                (e.status = 'rejected'), (e.reason = u);
              }
            }
          );
      }
      switch (t.status) {
        case 'fulfilled':
          return t.value;
        case 'rejected':
          throw ((l = t.reason), as(l), l);
      }
      throw ((ia = t), eu);
  }
}
function aa(l) {
  try {
    var t = l._init;
    return t(l._payload);
  } catch (a) {
    throw a !== null && typeof a == 'object' && typeof a.then == 'function'
      ? ((ia = a), eu)
      : a;
  }
}
var ia = null;
function ts() {
  if (ia === null) throw Error(r(459));
  var l = ia;
  return (ia = null), l;
}
function as(l) {
  if (l === eu || l === On) throw Error(r(483));
}
var Qa = null,
  Xu = 0;
function re(l) {
  var t = Xu;
  return (Xu += 1), Qa === null && (Qa = []), iy(Qa, l, t);
}
function du(l, t) {
  (t = t.props.ref), (l.ref = t !== void 0 ? t : null);
}
function be(l, t) {
  throw t.$$typeof === xo
    ? Error(r(525))
    : ((l = Object.prototype.toString.call(t)),
      Error(
        r(
          31,
          l === '[object Object]'
            ? 'object with keys {' + Object.keys(t).join(', ') + '}'
            : l
        )
      ));
}
function cy(l) {
  function t(y, s) {
    if (l) {
      var o = y.deletions;
      o === null ? ((y.deletions = [s]), (y.flags |= 16)) : o.push(s);
    }
  }
  function a(y, s) {
    if (!l) return null;
    for (; s !== null; ) t(y, s), (s = s.sibling);
    return null;
  }
  function u(y) {
    for (var s = new Map(); y !== null; )
      y.key !== null ? s.set(y.key, y) : s.set(y.index, y), (y = y.sibling);
    return s;
  }
  function e(y, s) {
    return (y = ht(y, s)), (y.index = 0), (y.sibling = null), y;
  }
  function n(y, s, o) {
    return (
      (y.index = o),
      l
        ? ((o = y.alternate),
          o !== null
            ? ((o = o.index), o < s ? ((y.flags |= 67108866), s) : o)
            : ((y.flags |= 67108866), s))
        : ((y.flags |= 1048576), s)
    );
  }
  function f(y) {
    return l && y.alternate === null && (y.flags |= 67108866), y;
  }
  function i(y, s, o, h) {
    return s === null || s.tag !== 6
      ? ((s = kn(o, y.mode, h)), (s.return = y), s)
      : ((s = e(s, o)), (s.return = y), s);
  }
  function c(y, s, o, h) {
    var T = o.type;
    return T === pa
      ? S(y, s, o.props.children, h, o.key)
      : s !== null &&
          (s.elementType === T ||
            (typeof T == 'object' &&
              T !== null &&
              T.$$typeof === Ot &&
              aa(T) === s.type))
        ? ((s = e(s, o.props)), du(s, o), (s.return = y), s)
        : ((s = Ne(o.type, o.key, o.props, null, y.mode, h)),
          du(s, o),
          (s.return = y),
          s);
  }
  function d(y, s, o, h) {
    return s === null ||
      s.tag !== 4 ||
      s.stateNode.containerInfo !== o.containerInfo ||
      s.stateNode.implementation !== o.implementation
      ? ((s = In(o, y.mode, h)), (s.return = y), s)
      : ((s = e(s, o.children || [])), (s.return = y), s);
  }
  function S(y, s, o, h, T) {
    return s === null || s.tag !== 7
      ? ((s = na(o, y.mode, h, T)), (s.return = y), s)
      : ((s = e(s, o)), (s.return = y), s);
  }
  function g(y, s, o) {
    if (
      (typeof s == 'string' && s !== '') ||
      typeof s == 'number' ||
      typeof s == 'bigint'
    )
      return (s = kn('' + s, y.mode, o)), (s.return = y), s;
    if (typeof s == 'object' && s !== null) {
      switch (s.$$typeof) {
        case de:
          return (
            (o = Ne(s.type, s.key, s.props, null, y.mode, o)),
            du(o, s),
            (o.return = y),
            o
          );
        case hu:
          return (s = In(s, y.mode, o)), (s.return = y), s;
        case Ot:
          return (s = aa(s)), g(y, s, o);
      }
      if (gu(s) || cu(s))
        return (s = na(s, y.mode, o, null)), (s.return = y), s;
      if (typeof s.then == 'function') return g(y, re(s), o);
      if (s.$$typeof === ot) return g(y, Se(y, s), o);
      be(y, s);
    }
    return null;
  }
  function v(y, s, o, h) {
    var T = s !== null ? s.key : null;
    if (
      (typeof o == 'string' && o !== '') ||
      typeof o == 'number' ||
      typeof o == 'bigint'
    )
      return T !== null ? null : i(y, s, '' + o, h);
    if (typeof o == 'object' && o !== null) {
      switch (o.$$typeof) {
        case de:
          return o.key === T ? c(y, s, o, h) : null;
        case hu:
          return o.key === T ? d(y, s, o, h) : null;
        case Ot:
          return (o = aa(o)), v(y, s, o, h);
      }
      if (gu(o) || cu(o)) return T !== null ? null : S(y, s, o, h, null);
      if (typeof o.then == 'function') return v(y, s, re(o), h);
      if (o.$$typeof === ot) return v(y, s, Se(y, o), h);
      be(y, o);
    }
    return null;
  }
  function m(y, s, o, h, T) {
    if (
      (typeof h == 'string' && h !== '') ||
      typeof h == 'number' ||
      typeof h == 'bigint'
    )
      return (y = y.get(o) || null), i(s, y, '' + h, T);
    if (typeof h == 'object' && h !== null) {
      switch (h.$$typeof) {
        case de:
          return (y = y.get(h.key === null ? o : h.key) || null), c(s, y, h, T);
        case hu:
          return (y = y.get(h.key === null ? o : h.key) || null), d(s, y, h, T);
        case Ot:
          return (h = aa(h)), m(y, s, o, h, T);
      }
      if (gu(h) || cu(h)) return (y = y.get(o) || null), S(s, y, h, T, null);
      if (typeof h.then == 'function') return m(y, s, o, re(h), T);
      if (h.$$typeof === ot) return m(y, s, o, Se(s, h), T);
      be(s, h);
    }
    return null;
  }
  function E(y, s, o, h) {
    for (
      var T = null, N = null, A = s, M = (s = 0), H = null;
      A !== null && M < o.length;
      M++
    ) {
      A.index > M ? ((H = A), (A = null)) : (H = A.sibling);
      var q = v(y, A, o[M], h);
      if (q === null) {
        A === null && (A = H);
        break;
      }
      l && A && q.alternate === null && t(y, A),
        (s = n(q, s, M)),
        N === null ? (T = q) : (N.sibling = q),
        (N = q),
        (A = H);
    }
    if (M === o.length) return a(y, A), Y && yt(y, M), T;
    if (A === null) {
      for (; M < o.length; M++)
        (A = g(y, o[M], h)),
          A !== null &&
            ((s = n(A, s, M)), N === null ? (T = A) : (N.sibling = A), (N = A));
      return Y && yt(y, M), T;
    }
    for (A = u(A); M < o.length; M++)
      (H = m(A, y, M, o[M], h)),
        H !== null &&
          (l && H.alternate !== null && A.delete(H.key === null ? M : H.key),
          (s = n(H, s, M)),
          N === null ? (T = H) : (N.sibling = H),
          (N = H));
    return (
      l &&
        A.forEach(function (Gl) {
          return t(y, Gl);
        }),
      Y && yt(y, M),
      T
    );
  }
  function b(y, s, o, h) {
    if (o == null) throw Error(r(151));
    for (
      var T = null, N = null, A = s, M = (s = 0), H = null, q = o.next();
      A !== null && !q.done;
      M++, q = o.next()
    ) {
      A.index > M ? ((H = A), (A = null)) : (H = A.sibling);
      var Gl = v(y, A, q.value, h);
      if (Gl === null) {
        A === null && (A = H);
        break;
      }
      l && A && Gl.alternate === null && t(y, A),
        (s = n(Gl, s, M)),
        N === null ? (T = Gl) : (N.sibling = Gl),
        (N = Gl),
        (A = H);
    }
    if (q.done) return a(y, A), Y && yt(y, M), T;
    if (A === null) {
      for (; !q.done; M++, q = o.next())
        (q = g(y, q.value, h)),
          q !== null &&
            ((s = n(q, s, M)), N === null ? (T = q) : (N.sibling = q), (N = q));
      return Y && yt(y, M), T;
    }
    for (A = u(A); !q.done; M++, q = o.next())
      (q = m(A, y, M, q.value, h)),
        q !== null &&
          (l && q.alternate !== null && A.delete(q.key === null ? M : q.key),
          (s = n(q, s, M)),
          N === null ? (T = q) : (N.sibling = q),
          (N = q));
    return (
      l &&
        A.forEach(function (pt) {
          return t(y, pt);
        }),
      Y && yt(y, M),
      T
    );
  }
  function z(y, s, o, h) {
    if (
      (typeof o == 'object' &&
        o !== null &&
        o.type === pa &&
        o.key === null &&
        (o = o.props.children),
      typeof o == 'object' && o !== null)
    ) {
      switch (o.$$typeof) {
        case de:
          l: {
            for (var T = o.key; s !== null; ) {
              if (s.key === T) {
                if (((T = o.type), T === pa)) {
                  if (s.tag === 7) {
                    a(y, s.sibling),
                      (h = e(s, o.props.children)),
                      (h.return = y),
                      (y = h);
                    break l;
                  }
                } else if (
                  s.elementType === T ||
                  (typeof T == 'object' &&
                    T !== null &&
                    T.$$typeof === Ot &&
                    aa(T) === s.type)
                ) {
                  a(y, s.sibling),
                    (h = e(s, o.props)),
                    du(h, o),
                    (h.return = y),
                    (y = h);
                  break l;
                }
                a(y, s);
                break;
              } else t(y, s);
              s = s.sibling;
            }
            o.type === pa
              ? ((h = na(o.props.children, y.mode, h, o.key)),
                (h.return = y),
                (y = h))
              : ((h = Ne(o.type, o.key, o.props, null, y.mode, h)),
                du(h, o),
                (h.return = y),
                (y = h));
          }
          return f(y);
        case hu:
          l: {
            for (T = o.key; s !== null; ) {
              if (s.key === T)
                if (
                  s.tag === 4 &&
                  s.stateNode.containerInfo === o.containerInfo &&
                  s.stateNode.implementation === o.implementation
                ) {
                  a(y, s.sibling),
                    (h = e(s, o.children || [])),
                    (h.return = y),
                    (y = h);
                  break l;
                } else {
                  a(y, s);
                  break;
                }
              else t(y, s);
              s = s.sibling;
            }
            (h = In(o, y.mode, h)), (h.return = y), (y = h);
          }
          return f(y);
        case Ot:
          return (o = aa(o)), z(y, s, o, h);
      }
      if (gu(o)) return E(y, s, o, h);
      if (cu(o)) {
        if (((T = cu(o)), typeof T != 'function')) throw Error(r(150));
        return (o = T.call(o)), b(y, s, o, h);
      }
      if (typeof o.then == 'function') return z(y, s, re(o), h);
      if (o.$$typeof === ot) return z(y, s, Se(y, o), h);
      be(y, o);
    }
    return (typeof o == 'string' && o !== '') ||
      typeof o == 'number' ||
      typeof o == 'bigint'
      ? ((o = '' + o),
        s !== null && s.tag === 6
          ? (a(y, s.sibling), (h = e(s, o)), (h.return = y), (y = h))
          : (a(y, s), (h = kn(o, y.mode, h)), (h.return = y), (y = h)),
        f(y))
      : a(y, s);
  }
  return function (y, s, o, h) {
    try {
      Xu = 0;
      var T = z(y, s, o, h);
      return (Qa = null), T;
    } catch (A) {
      if (A === eu || A === On) throw A;
      var N = Hl(29, A, null, y.mode);
      return (N.lanes = h), (N.return = y), N;
    } finally {
    }
  };
}
var da = cy(!0),
  sy = cy(!1),
  Mt = !1;
function Ki(l) {
  l.updateQueue = {
    baseState: l.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, lanes: 0, hiddenCallbacks: null },
    callbacks: null
  };
}
function wf(l, t) {
  (l = l.updateQueue),
    t.updateQueue === l &&
      (t.updateQueue = {
        baseState: l.baseState,
        firstBaseUpdate: l.firstBaseUpdate,
        lastBaseUpdate: l.lastBaseUpdate,
        shared: l.shared,
        callbacks: null
      });
}
function Gt(l) {
  return { lane: l, tag: 0, payload: null, callback: null, next: null };
}
function Qt(l, t, a) {
  var u = l.updateQueue;
  if (u === null) return null;
  if (((u = u.shared), G & 2)) {
    var e = u.pending;
    return (
      e === null ? (t.next = t) : ((t.next = e.next), (e.next = t)),
      (u.pending = t),
      (t = we(l)),
      ly(l, null, a),
      t
    );
  }
  return _n(l, u, t, a), we(l);
}
function Ou(l, t, a) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (a & 4194048) !== 0))
  ) {
    var u = t.lanes;
    (u &= l.pendingLanes), (a |= u), (t.lanes = a), M0(l, a);
  }
}
function lf(l, t) {
  var a = l.updateQueue,
    u = l.alternate;
  if (u !== null && ((u = u.updateQueue), a === u)) {
    var e = null,
      n = null;
    if (((a = a.firstBaseUpdate), a !== null)) {
      do {
        var f = {
          lane: a.lane,
          tag: a.tag,
          payload: a.payload,
          callback: null,
          next: null
        };
        n === null ? (e = n = f) : (n = n.next = f), (a = a.next);
      } while (a !== null);
      n === null ? (e = n = t) : (n = n.next = t);
    } else e = n = t;
    (a = {
      baseState: u.baseState,
      firstBaseUpdate: e,
      lastBaseUpdate: n,
      shared: u.shared,
      callbacks: u.callbacks
    }),
      (l.updateQueue = a);
    return;
  }
  (l = a.lastBaseUpdate),
    l === null ? (a.firstBaseUpdate = t) : (l.next = t),
    (a.lastBaseUpdate = t);
}
var $f = !1;
function Mu() {
  if ($f) {
    var l = Ga;
    if (l !== null) throw l;
  }
}
function Du(l, t, a, u) {
  $f = !1;
  var e = l.updateQueue;
  Mt = !1;
  var n = e.firstBaseUpdate,
    f = e.lastBaseUpdate,
    i = e.shared.pending;
  if (i !== null) {
    e.shared.pending = null;
    var c = i,
      d = c.next;
    (c.next = null), f === null ? (n = d) : (f.next = d), (f = c);
    var S = l.alternate;
    S !== null &&
      ((S = S.updateQueue),
      (i = S.lastBaseUpdate),
      i !== f &&
        (i === null ? (S.firstBaseUpdate = d) : (i.next = d),
        (S.lastBaseUpdate = c)));
  }
  if (n !== null) {
    var g = e.baseState;
    (f = 0), (S = d = c = null), (i = n);
    do {
      var v = i.lane & -536870913,
        m = v !== i.lane;
      if (m ? (C & v) === v : (u & v) === v) {
        v !== 0 && v === Ja && ($f = !0),
          S !== null &&
            (S = S.next =
              {
                lane: 0,
                tag: i.tag,
                payload: i.payload,
                callback: null,
                next: null
              });
        l: {
          var E = l,
            b = i;
          v = t;
          var z = a;
          switch (b.tag) {
            case 1:
              if (((E = b.payload), typeof E == 'function')) {
                g = E.call(z, g, v);
                break l;
              }
              g = E;
              break l;
            case 3:
              E.flags = (E.flags & -65537) | 128;
            case 0:
              if (
                ((E = b.payload),
                (v = typeof E == 'function' ? E.call(z, g, v) : E),
                v == null)
              )
                break l;
              g = F({}, g, v);
              break l;
            case 2:
              Mt = !0;
          }
        }
        (v = i.callback),
          v !== null &&
            ((l.flags |= 64),
            m && (l.flags |= 8192),
            (m = e.callbacks),
            m === null ? (e.callbacks = [v]) : m.push(v));
      } else
        (m = {
          lane: v,
          tag: i.tag,
          payload: i.payload,
          callback: i.callback,
          next: null
        }),
          S === null ? ((d = S = m), (c = g)) : (S = S.next = m),
          (f |= v);
      if (((i = i.next), i === null)) {
        if (((i = e.shared.pending), i === null)) break;
        (m = i),
          (i = m.next),
          (m.next = null),
          (e.lastBaseUpdate = m),
          (e.shared.pending = null);
      }
    } while (!0);
    S === null && (c = g),
      (e.baseState = c),
      (e.firstBaseUpdate = d),
      (e.lastBaseUpdate = S),
      n === null && (e.shared.lanes = 0),
      (Wt |= f),
      (l.lanes = f),
      (l.memoizedState = g);
  }
}
function yy(l, t) {
  if (typeof l != 'function') throw Error(r(191, l));
  l.call(t);
}
function dy(l, t) {
  var a = l.callbacks;
  if (a !== null)
    for (l.callbacks = null, l = 0; l < a.length; l++) yy(a[l], t);
}
var wa = ut(null),
  ke = ut(0);
function us(l, t) {
  (l = Et), J(ke, l), J(wa, t), (Et = l | t.baseLanes);
}
function Wf() {
  J(ke, Et), J(wa, wa.current);
}
function Ji() {
  (Et = ke.current), ol(wa), ol(ke);
}
var Yl = ut(null),
  wl = null;
function Ut(l) {
  var t = l.alternate;
  J(tl, tl.current & 1),
    J(Yl, l),
    wl === null &&
      (t === null || wa.current !== null || t.memoizedState !== null) &&
      (wl = l);
}
function Ff(l) {
  J(tl, tl.current), J(Yl, l), wl === null && (wl = l);
}
function oy(l) {
  l.tag === 22 ? (J(tl, tl.current), J(Yl, l), wl === null && (wl = l)) : Nt();
}
function Nt() {
  J(tl, tl.current), J(Yl, Yl.current);
}
function Nl(l) {
  ol(Yl), wl === l && (wl = null), ol(tl);
}
var tl = ut(0);
function Ie(l) {
  for (var t = l; t !== null; ) {
    if (t.tag === 13) {
      var a = t.memoizedState;
      if (a !== null && ((a = a.dehydrated), a === null || hi(a) || gi(a)))
        return t;
    } else if (
      t.tag === 19 &&
      (t.memoizedProps.revealOrder === 'forwards' ||
        t.memoizedProps.revealOrder === 'backwards' ||
        t.memoizedProps.revealOrder === 'unstable_legacy-backwards' ||
        t.memoizedProps.revealOrder === 'together')
    ) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === l) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === l) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var bt = 0,
  U = null,
  V = null,
  ul = null,
  Pe = !1,
  Xa = !1,
  oa = !1,
  ln = 0,
  Zu = 0,
  Za = null,
  wv = 0;
function I() {
  throw Error(r(321));
}
function wi(l, t) {
  if (t === null) return !1;
  for (var a = 0; a < t.length && a < l.length; a++)
    if (!ql(l[a], t[a])) return !1;
  return !0;
}
function $i(l, t, a, u, e, n) {
  return (
    (bt = n),
    (U = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (O.H = l === null || l.memoizedState === null ? Ly : nc),
    (oa = !1),
    (n = a(u, e)),
    (oa = !1),
    Xa && (n = my(t, a, u, e)),
    vy(l),
    n
  );
}
function vy(l) {
  O.H = Lu;
  var t = V !== null && V.next !== null;
  if (((bt = 0), (ul = V = U = null), (Pe = !1), (Zu = 0), (Za = null), t))
    throw Error(r(300));
  l === null || fl || ((l = l.dependencies), l !== null && We(l) && (fl = !0));
}
function my(l, t, a, u) {
  U = l;
  var e = 0;
  do {
    if ((Xa && (Za = null), (Zu = 0), (Xa = !1), 25 <= e)) throw Error(r(301));
    if (((e += 1), (ul = V = null), l.updateQueue != null)) {
      var n = l.updateQueue;
      (n.lastEffect = null),
        (n.events = null),
        (n.stores = null),
        n.memoCache != null && (n.memoCache.index = 0);
    }
    (O.H = Vy), (n = t(a, u));
  } while (Xa);
  return n;
}
function $v() {
  var l = O.H,
    t = l.useState()[0];
  return (
    (t = typeof t.then == 'function' ? ae(t) : t),
    (l = l.useState()[0]),
    (V !== null ? V.memoizedState : null) !== l && (U.flags |= 1024),
    t
  );
}
function Wi() {
  var l = ln !== 0;
  return (ln = 0), l;
}
function Fi(l, t, a) {
  (t.updateQueue = l.updateQueue), (t.flags &= -2053), (l.lanes &= ~a);
}
function ki(l) {
  if (Pe) {
    for (l = l.memoizedState; l !== null; ) {
      var t = l.queue;
      t !== null && (t.pending = null), (l = l.next);
    }
    Pe = !1;
  }
  (bt = 0), (ul = V = U = null), (Xa = !1), (Zu = ln = 0), (Za = null);
}
function rl() {
  var l = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  return ul === null ? (U.memoizedState = ul = l) : (ul = ul.next = l), ul;
}
function al() {
  if (V === null) {
    var l = U.alternate;
    l = l !== null ? l.memoizedState : null;
  } else l = V.next;
  var t = ul === null ? U.memoizedState : ul.next;
  if (t !== null) (ul = t), (V = l);
  else {
    if (l === null) throw U.alternate === null ? Error(r(467)) : Error(r(310));
    (V = l),
      (l = {
        memoizedState: V.memoizedState,
        baseState: V.baseState,
        baseQueue: V.baseQueue,
        queue: V.queue,
        next: null
      }),
      ul === null ? (U.memoizedState = ul = l) : (ul = ul.next = l);
  }
  return ul;
}
function Mn() {
  return { lastEffect: null, events: null, stores: null, memoCache: null };
}
function ae(l) {
  var t = Zu;
  return (
    (Zu += 1),
    Za === null && (Za = []),
    (l = iy(Za, l, t)),
    (t = U),
    (ul === null ? t.memoizedState : ul.next) === null &&
      ((t = t.alternate),
      (O.H = t === null || t.memoizedState === null ? Ly : nc)),
    l
  );
}
function Dn(l) {
  if (l !== null && typeof l == 'object') {
    if (typeof l.then == 'function') return ae(l);
    if (l.$$typeof === ot) return gl(l);
  }
  throw Error(r(438, String(l)));
}
function Ii(l) {
  var t = null,
    a = U.updateQueue;
  if ((a !== null && (t = a.memoCache), t == null)) {
    var u = U.alternate;
    u !== null &&
      ((u = u.updateQueue),
      u !== null &&
        ((u = u.memoCache),
        u != null &&
          (t = {
            data: u.data.map(function (e) {
              return e.slice();
            }),
            index: 0
          })));
  }
  if (
    (t == null && (t = { data: [], index: 0 }),
    a === null && ((a = Mn()), (U.updateQueue = a)),
    (a.memoCache = t),
    (a = t.data[t.index]),
    a === void 0)
  )
    for (a = t.data[t.index] = Array(l), u = 0; u < l; u++) a[u] = Ro;
  return t.index++, a;
}
function zt(l, t) {
  return typeof t == 'function' ? t(l) : t;
}
function xe(l) {
  var t = al();
  return Pi(t, V, l);
}
function Pi(l, t, a) {
  var u = l.queue;
  if (u === null) throw Error(r(311));
  u.lastRenderedReducer = a;
  var e = l.baseQueue,
    n = u.pending;
  if (n !== null) {
    if (e !== null) {
      var f = e.next;
      (e.next = n.next), (n.next = f);
    }
    (t.baseQueue = e = n), (u.pending = null);
  }
  if (((n = l.baseState), e === null)) l.memoizedState = n;
  else {
    t = e.next;
    var i = (f = null),
      c = null,
      d = t,
      S = !1;
    do {
      var g = d.lane & -536870913;
      if (g !== d.lane ? (C & g) === g : (bt & g) === g) {
        var v = d.revertLane;
        if (v === 0)
          c !== null &&
            (c = c.next =
              {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: d.action,
                hasEagerState: d.hasEagerState,
                eagerState: d.eagerState,
                next: null
              }),
            g === Ja && (S = !0);
        else if ((bt & v) === v) {
          (d = d.next), v === Ja && (S = !0);
          continue;
        } else
          (g = {
            lane: 0,
            revertLane: d.revertLane,
            gesture: null,
            action: d.action,
            hasEagerState: d.hasEagerState,
            eagerState: d.eagerState,
            next: null
          }),
            c === null ? ((i = c = g), (f = n)) : (c = c.next = g),
            (U.lanes |= v),
            (Wt |= v);
        (g = d.action),
          oa && a(n, g),
          (n = d.hasEagerState ? d.eagerState : a(n, g));
      } else
        (v = {
          lane: g,
          revertLane: d.revertLane,
          gesture: d.gesture,
          action: d.action,
          hasEagerState: d.hasEagerState,
          eagerState: d.eagerState,
          next: null
        }),
          c === null ? ((i = c = v), (f = n)) : (c = c.next = v),
          (U.lanes |= g),
          (Wt |= g);
      d = d.next;
    } while (d !== null && d !== t);
    if (
      (c === null ? (f = n) : (c.next = i),
      !ql(n, l.memoizedState) && ((fl = !0), S && ((a = Ga), a !== null)))
    )
      throw a;
    (l.memoizedState = n),
      (l.baseState = f),
      (l.baseQueue = c),
      (u.lastRenderedState = n);
  }
  return e === null && (u.lanes = 0), [l.memoizedState, u.dispatch];
}
function tf(l) {
  var t = al(),
    a = t.queue;
  if (a === null) throw Error(r(311));
  a.lastRenderedReducer = l;
  var u = a.dispatch,
    e = a.pending,
    n = t.memoizedState;
  if (e !== null) {
    a.pending = null;
    var f = (e = e.next);
    do (n = l(n, f.action)), (f = f.next);
    while (f !== e);
    ql(n, t.memoizedState) || (fl = !0),
      (t.memoizedState = n),
      t.baseQueue === null && (t.baseState = n),
      (a.lastRenderedState = n);
  }
  return [n, u];
}
function hy(l, t, a) {
  var u = U,
    e = al(),
    n = Y;
  if (n) {
    if (a === void 0) throw Error(r(407));
    a = a();
  } else a = t();
  var f = !ql((V || e).memoizedState, a);
  if (
    (f && ((e.memoizedState = a), (fl = !0)),
    (e = e.queue),
    lc(ry.bind(null, u, e, l), [l]),
    e.getSnapshot !== t || f || (ul !== null && ul.memoizedState.tag & 1))
  ) {
    if (
      ((u.flags |= 2048),
      $a(9, { destroy: void 0 }, Sy.bind(null, u, e, a, t), null),
      K === null)
    )
      throw Error(r(349));
    n || bt & 127 || gy(u, t, a);
  }
  return a;
}
function gy(l, t, a) {
  (l.flags |= 16384),
    (l = { getSnapshot: t, value: a }),
    (t = U.updateQueue),
    t === null
      ? ((t = Mn()), (U.updateQueue = t), (t.stores = [l]))
      : ((a = t.stores), a === null ? (t.stores = [l]) : a.push(l));
}
function Sy(l, t, a, u) {
  (t.value = a), (t.getSnapshot = u), by(t) && zy(l);
}
function ry(l, t, a) {
  return a(function () {
    by(t) && zy(l);
  });
}
function by(l) {
  var t = l.getSnapshot;
  l = l.value;
  try {
    var a = t();
    return !ql(l, a);
  } catch {
    return !0;
  }
}
function zy(l) {
  var t = Sa(l, 2);
  t !== null && _l(t, l, 2);
}
function kf(l) {
  var t = rl();
  if (typeof l == 'function') {
    var a = l;
    if (((l = a()), oa)) {
      xt(!0);
      try {
        a();
      } finally {
        xt(!1);
      }
    }
  }
  return (
    (t.memoizedState = t.baseState = l),
    (t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: zt,
      lastRenderedState: l
    }),
    t
  );
}
function Ty(l, t, a, u) {
  return (l.baseState = a), Pi(l, V, typeof u == 'function' ? u : zt);
}
function Wv(l, t, a, u, e) {
  if (Nn(l)) throw Error(r(485));
  if (((l = t.action), l !== null)) {
    var n = {
      payload: e,
      action: l,
      next: null,
      isTransition: !0,
      status: 'pending',
      value: null,
      reason: null,
      listeners: [],
      then: function (f) {
        n.listeners.push(f);
      }
    };
    O.T !== null ? a(!0) : (n.isTransition = !1),
      u(n),
      (a = t.pending),
      a === null
        ? ((n.next = t.pending = n), Ey(t, n))
        : ((n.next = a.next), (t.pending = a.next = n));
  }
}
function Ey(l, t) {
  var a = t.action,
    u = t.payload,
    e = l.state;
  if (t.isTransition) {
    var n = O.T,
      f = {};
    O.T = f;
    try {
      var i = a(e, u),
        c = O.S;
      c !== null && c(f, i), es(l, t, i);
    } catch (d) {
      If(l, t, d);
    } finally {
      n !== null && f.types !== null && (n.types = f.types), (O.T = n);
    }
  } else
    try {
      (n = a(e, u)), es(l, t, n);
    } catch (d) {
      If(l, t, d);
    }
}
function es(l, t, a) {
  a !== null && typeof a == 'object' && typeof a.then == 'function'
    ? a.then(
        function (u) {
          ns(l, t, u);
        },
        function (u) {
          return If(l, t, u);
        }
      )
    : ns(l, t, a);
}
function ns(l, t, a) {
  (t.status = 'fulfilled'),
    (t.value = a),
    Ay(t),
    (l.state = a),
    (t = l.pending),
    t !== null &&
      ((a = t.next),
      a === t ? (l.pending = null) : ((a = a.next), (t.next = a), Ey(l, a)));
}
function If(l, t, a) {
  var u = l.pending;
  if (((l.pending = null), u !== null)) {
    u = u.next;
    do (t.status = 'rejected'), (t.reason = a), Ay(t), (t = t.next);
    while (t !== u);
  }
  l.action = null;
}
function Ay(l) {
  l = l.listeners;
  for (var t = 0; t < l.length; t++) (0, l[t])();
}
function py(l, t) {
  return t;
}
function fs(l, t) {
  if (Y) {
    var a = K.formState;
    if (a !== null) {
      l: {
        var u = U;
        if (Y) {
          if ($) {
            t: {
              for (var e = $, n = Jl; e.nodeType !== 8; ) {
                if (!n) {
                  e = null;
                  break t;
                }
                if (((e = $l(e.nextSibling)), e === null)) {
                  e = null;
                  break t;
                }
              }
              (n = e.data), (e = n === 'F!' || n === 'F' ? e : null);
            }
            if (e) {
              ($ = $l(e.nextSibling)), (u = e.data === 'F!');
              break l;
            }
          }
          wt(u);
        }
        u = !1;
      }
      u && (t = a[0]);
    }
  }
  return (
    (a = rl()),
    (a.memoizedState = a.baseState = t),
    (u = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: py,
      lastRenderedState: t
    }),
    (a.queue = u),
    (a = Qy.bind(null, U, u)),
    (u.dispatch = a),
    (u = kf(!1)),
    (n = ec.bind(null, U, !1, u.queue)),
    (u = rl()),
    (e = { state: t, dispatch: null, action: l, pending: null }),
    (u.queue = e),
    (a = Wv.bind(null, U, e, n, a)),
    (e.dispatch = a),
    (u.memoizedState = l),
    [t, a, !1]
  );
}
function is(l) {
  var t = al();
  return _y(t, V, l);
}
function _y(l, t, a) {
  if (
    ((t = Pi(l, t, py)[0]),
    (l = xe(zt)[0]),
    typeof t == 'object' && t !== null && typeof t.then == 'function')
  )
    try {
      var u = ae(t);
    } catch (f) {
      throw f === eu ? On : f;
    }
  else u = t;
  t = al();
  var e = t.queue,
    n = e.dispatch;
  return (
    a !== t.memoizedState &&
      ((U.flags |= 2048),
      $a(9, { destroy: void 0 }, Fv.bind(null, e, a), null)),
    [u, n, l]
  );
}
function Fv(l, t) {
  l.action = t;
}
function cs(l) {
  var t = al(),
    a = V;
  if (a !== null) return _y(t, a, l);
  al(), (t = t.memoizedState), (a = al());
  var u = a.queue.dispatch;
  return (a.memoizedState = l), [t, u, !1];
}
function $a(l, t, a, u) {
  return (
    (l = { tag: l, create: a, deps: u, inst: t, next: null }),
    (t = U.updateQueue),
    t === null && ((t = Mn()), (U.updateQueue = t)),
    (a = t.lastEffect),
    a === null
      ? (t.lastEffect = l.next = l)
      : ((u = a.next), (a.next = l), (l.next = u), (t.lastEffect = l)),
    l
  );
}
function Oy() {
  return al().memoizedState;
}
function Re(l, t, a, u) {
  var e = rl();
  (U.flags |= l),
    (e.memoizedState = $a(
      1 | t,
      { destroy: void 0 },
      a,
      u === void 0 ? null : u
    ));
}
function Un(l, t, a, u) {
  var e = al();
  u = u === void 0 ? null : u;
  var n = e.memoizedState.inst;
  V !== null && u !== null && wi(u, V.memoizedState.deps)
    ? (e.memoizedState = $a(t, n, a, u))
    : ((U.flags |= l), (e.memoizedState = $a(1 | t, n, a, u)));
}
function ss(l, t) {
  Re(8390656, 8, l, t);
}
function lc(l, t) {
  Un(2048, 8, l, t);
}
function kv(l) {
  U.flags |= 4;
  var t = U.updateQueue;
  if (t === null) (t = Mn()), (U.updateQueue = t), (t.events = [l]);
  else {
    var a = t.events;
    a === null ? (t.events = [l]) : a.push(l);
  }
}
function My(l) {
  var t = al().memoizedState;
  return (
    kv({ ref: t, nextImpl: l }),
    function () {
      if (G & 2) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    }
  );
}
function Dy(l, t) {
  return Un(4, 2, l, t);
}
function Uy(l, t) {
  return Un(4, 4, l, t);
}
function Ny(l, t) {
  if (typeof t == 'function') {
    l = l();
    var a = t(l);
    return function () {
      typeof a == 'function' ? a() : t(null);
    };
  }
  if (t != null)
    return (
      (l = l()),
      (t.current = l),
      function () {
        t.current = null;
      }
    );
}
function Hy(l, t, a) {
  (a = a != null ? a.concat([l]) : null), Un(4, 4, Ny.bind(null, t, l), a);
}
function tc() {}
function xy(l, t) {
  var a = al();
  t = t === void 0 ? null : t;
  var u = a.memoizedState;
  return t !== null && wi(t, u[1]) ? u[0] : ((a.memoizedState = [l, t]), l);
}
function Ry(l, t) {
  var a = al();
  t = t === void 0 ? null : t;
  var u = a.memoizedState;
  if (t !== null && wi(t, u[1])) return u[0];
  if (((u = l()), oa)) {
    xt(!0);
    try {
      l();
    } finally {
      xt(!1);
    }
  }
  return (a.memoizedState = [u, t]), u;
}
function ac(l, t, a) {
  return a === void 0 || (bt & 1073741824 && !(C & 261930))
    ? (l.memoizedState = t)
    : ((l.memoizedState = a), (l = Td()), (U.lanes |= l), (Wt |= l), a);
}
function jy(l, t, a, u) {
  return ql(a, t)
    ? a
    : wa.current !== null
      ? ((l = ac(l, a, u)), ql(l, t) || (fl = !0), l)
      : !(bt & 42) || (bt & 1073741824 && !(C & 261930))
        ? ((fl = !0), (l.memoizedState = a))
        : ((l = Td()), (U.lanes |= l), (Wt |= l), t);
}
function By(l, t, a, u, e) {
  var n = Q.p;
  Q.p = n !== 0 && 8 > n ? n : 8;
  var f = O.T,
    i = {};
  (O.T = i), ec(l, !1, t, a);
  try {
    var c = e(),
      d = O.S;
    if (
      (d !== null && d(i, c),
      c !== null && typeof c == 'object' && typeof c.then == 'function')
    ) {
      var S = Jv(c, u);
      Uu(l, t, S, Cl(l));
    } else Uu(l, t, u, Cl(l));
  } catch (g) {
    Uu(l, t, { then: function () {}, status: 'rejected', reason: g }, Cl());
  } finally {
    (Q.p = n), f !== null && i.types !== null && (f.types = i.types), (O.T = f);
  }
}
function Iv() {}
function Pf(l, t, a, u) {
  if (l.tag !== 5) throw Error(r(476));
  var e = Cy(l).queue;
  By(
    l,
    e,
    t,
    ea,
    a === null
      ? Iv
      : function () {
          return qy(l), a(u);
        }
  );
}
function Cy(l) {
  var t = l.memoizedState;
  if (t !== null) return t;
  t = {
    memoizedState: ea,
    baseState: ea,
    baseQueue: null,
    queue: {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: zt,
      lastRenderedState: ea
    },
    next: null
  };
  var a = {};
  return (
    (t.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: zt,
        lastRenderedState: a
      },
      next: null
    }),
    (l.memoizedState = t),
    (l = l.alternate),
    l !== null && (l.memoizedState = t),
    t
  );
}
function qy(l) {
  var t = Cy(l);
  t.next === null && (t = l.alternate.memoizedState),
    Uu(l, t.next.queue, {}, Cl());
}
function uc() {
  return gl(Ju);
}
function Yy() {
  return al().memoizedState;
}
function Gy() {
  return al().memoizedState;
}
function Pv(l) {
  for (var t = l.return; t !== null; ) {
    switch (t.tag) {
      case 24:
      case 3:
        var a = Cl();
        l = Gt(a);
        var u = Qt(t, l, a);
        u !== null && (_l(u, t, a), Ou(u, t, a)),
          (t = { cache: Zi() }),
          (l.payload = t);
        return;
    }
    t = t.return;
  }
}
function lm(l, t, a) {
  var u = Cl();
  (a = {
    lane: u,
    revertLane: 0,
    gesture: null,
    action: a,
    hasEagerState: !1,
    eagerState: null,
    next: null
  }),
    Nn(l)
      ? Xy(t, a)
      : ((a = Yi(l, t, a, u)), a !== null && (_l(a, l, u), Zy(a, t, u)));
}
function Qy(l, t, a) {
  var u = Cl();
  Uu(l, t, a, u);
}
function Uu(l, t, a, u) {
  var e = {
    lane: u,
    revertLane: 0,
    gesture: null,
    action: a,
    hasEagerState: !1,
    eagerState: null,
    next: null
  };
  if (Nn(l)) Xy(t, e);
  else {
    var n = l.alternate;
    if (
      l.lanes === 0 &&
      (n === null || n.lanes === 0) &&
      ((n = t.lastRenderedReducer), n !== null)
    )
      try {
        var f = t.lastRenderedState,
          i = n(f, a);
        if (((e.hasEagerState = !0), (e.eagerState = i), ql(i, f)))
          return _n(l, t, e, 0), K === null && pn(), !1;
      } catch {
      } finally {
      }
    if (((a = Yi(l, t, e, u)), a !== null)) return _l(a, l, u), Zy(a, t, u), !0;
  }
  return !1;
}
function ec(l, t, a, u) {
  if (
    ((u = {
      lane: 2,
      revertLane: vc(),
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }),
    Nn(l))
  ) {
    if (t) throw Error(r(479));
  } else (t = Yi(l, a, u, 2)), t !== null && _l(t, l, 2);
}
function Nn(l) {
  var t = l.alternate;
  return l === U || (t !== null && t === U);
}
function Xy(l, t) {
  Xa = Pe = !0;
  var a = l.pending;
  a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)),
    (l.pending = t);
}
function Zy(l, t, a) {
  if (a & 4194048) {
    var u = t.lanes;
    (u &= l.pendingLanes), (a |= u), (t.lanes = a), M0(l, a);
  }
}
var Lu = {
  readContext: gl,
  use: Dn,
  useCallback: I,
  useContext: I,
  useEffect: I,
  useImperativeHandle: I,
  useLayoutEffect: I,
  useInsertionEffect: I,
  useMemo: I,
  useReducer: I,
  useRef: I,
  useState: I,
  useDebugValue: I,
  useDeferredValue: I,
  useTransition: I,
  useSyncExternalStore: I,
  useId: I,
  useHostTransitionStatus: I,
  useFormState: I,
  useActionState: I,
  useOptimistic: I,
  useMemoCache: I,
  useCacheRefresh: I
};
Lu.useEffectEvent = I;
var Ly = {
    readContext: gl,
    use: Dn,
    useCallback: function (l, t) {
      return (rl().memoizedState = [l, t === void 0 ? null : t]), l;
    },
    useContext: gl,
    useEffect: ss,
    useImperativeHandle: function (l, t, a) {
      (a = a != null ? a.concat([l]) : null),
        Re(4194308, 4, Ny.bind(null, t, l), a);
    },
    useLayoutEffect: function (l, t) {
      return Re(4194308, 4, l, t);
    },
    useInsertionEffect: function (l, t) {
      Re(4, 2, l, t);
    },
    useMemo: function (l, t) {
      var a = rl();
      t = t === void 0 ? null : t;
      var u = l();
      if (oa) {
        xt(!0);
        try {
          l();
        } finally {
          xt(!1);
        }
      }
      return (a.memoizedState = [u, t]), u;
    },
    useReducer: function (l, t, a) {
      var u = rl();
      if (a !== void 0) {
        var e = a(t);
        if (oa) {
          xt(!0);
          try {
            a(t);
          } finally {
            xt(!1);
          }
        }
      } else e = t;
      return (
        (u.memoizedState = u.baseState = e),
        (l = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: l,
          lastRenderedState: e
        }),
        (u.queue = l),
        (l = l.dispatch = lm.bind(null, U, l)),
        [u.memoizedState, l]
      );
    },
    useRef: function (l) {
      var t = rl();
      return (l = { current: l }), (t.memoizedState = l);
    },
    useState: function (l) {
      l = kf(l);
      var t = l.queue,
        a = Qy.bind(null, U, t);
      return (t.dispatch = a), [l.memoizedState, a];
    },
    useDebugValue: tc,
    useDeferredValue: function (l, t) {
      var a = rl();
      return ac(a, l, t);
    },
    useTransition: function () {
      var l = kf(!1);
      return (
        (l = By.bind(null, U, l.queue, !0, !1)),
        (rl().memoizedState = l),
        [!1, l]
      );
    },
    useSyncExternalStore: function (l, t, a) {
      var u = U,
        e = rl();
      if (Y) {
        if (a === void 0) throw Error(r(407));
        a = a();
      } else {
        if (((a = t()), K === null)) throw Error(r(349));
        C & 127 || gy(u, t, a);
      }
      e.memoizedState = a;
      var n = { value: a, getSnapshot: t };
      return (
        (e.queue = n),
        ss(ry.bind(null, u, n, l), [l]),
        (u.flags |= 2048),
        $a(9, { destroy: void 0 }, Sy.bind(null, u, n, a, t), null),
        a
      );
    },
    useId: function () {
      var l = rl(),
        t = K.identifierPrefix;
      if (Y) {
        var a = lt,
          u = Pl;
        (a = (u & ~(1 << (32 - Bl(u) - 1))).toString(32) + a),
          (t = '_' + t + 'R_' + a),
          (a = ln++),
          0 < a && (t += 'H' + a.toString(32)),
          (t += '_');
      } else (a = wv++), (t = '_' + t + 'r_' + a.toString(32) + '_');
      return (l.memoizedState = t);
    },
    useHostTransitionStatus: uc,
    useFormState: fs,
    useActionState: fs,
    useOptimistic: function (l) {
      var t = rl();
      t.memoizedState = t.baseState = l;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return (
        (t.queue = a), (t = ec.bind(null, U, !0, a)), (a.dispatch = t), [l, t]
      );
    },
    useMemoCache: Ii,
    useCacheRefresh: function () {
      return (rl().memoizedState = Pv.bind(null, U));
    },
    useEffectEvent: function (l) {
      var t = rl(),
        a = { impl: l };
      return (
        (t.memoizedState = a),
        function () {
          if (G & 2) throw Error(r(440));
          return a.impl.apply(void 0, arguments);
        }
      );
    }
  },
  nc = {
    readContext: gl,
    use: Dn,
    useCallback: xy,
    useContext: gl,
    useEffect: lc,
    useImperativeHandle: Hy,
    useInsertionEffect: Dy,
    useLayoutEffect: Uy,
    useMemo: Ry,
    useReducer: xe,
    useRef: Oy,
    useState: function () {
      return xe(zt);
    },
    useDebugValue: tc,
    useDeferredValue: function (l, t) {
      var a = al();
      return jy(a, V.memoizedState, l, t);
    },
    useTransition: function () {
      var l = xe(zt)[0],
        t = al().memoizedState;
      return [typeof l == 'boolean' ? l : ae(l), t];
    },
    useSyncExternalStore: hy,
    useId: Yy,
    useHostTransitionStatus: uc,
    useFormState: is,
    useActionState: is,
    useOptimistic: function (l, t) {
      var a = al();
      return Ty(a, V, l, t);
    },
    useMemoCache: Ii,
    useCacheRefresh: Gy
  };
nc.useEffectEvent = My;
var Vy = {
  readContext: gl,
  use: Dn,
  useCallback: xy,
  useContext: gl,
  useEffect: lc,
  useImperativeHandle: Hy,
  useInsertionEffect: Dy,
  useLayoutEffect: Uy,
  useMemo: Ry,
  useReducer: tf,
  useRef: Oy,
  useState: function () {
    return tf(zt);
  },
  useDebugValue: tc,
  useDeferredValue: function (l, t) {
    var a = al();
    return V === null ? ac(a, l, t) : jy(a, V.memoizedState, l, t);
  },
  useTransition: function () {
    var l = tf(zt)[0],
      t = al().memoizedState;
    return [typeof l == 'boolean' ? l : ae(l), t];
  },
  useSyncExternalStore: hy,
  useId: Yy,
  useHostTransitionStatus: uc,
  useFormState: cs,
  useActionState: cs,
  useOptimistic: function (l, t) {
    var a = al();
    return V !== null
      ? Ty(a, V, l, t)
      : ((a.baseState = l), [l, a.queue.dispatch]);
  },
  useMemoCache: Ii,
  useCacheRefresh: Gy
};
Vy.useEffectEvent = My;
function af(l, t, a, u) {
  (t = l.memoizedState),
    (a = a(u, t)),
    (a = a == null ? t : F({}, t, a)),
    (l.memoizedState = a),
    l.lanes === 0 && (l.updateQueue.baseState = a);
}
var li = {
  enqueueSetState: function (l, t, a) {
    l = l._reactInternals;
    var u = Cl(),
      e = Gt(u);
    (e.payload = t),
      a != null && (e.callback = a),
      (t = Qt(l, e, u)),
      t !== null && (_l(t, l, u), Ou(t, l, u));
  },
  enqueueReplaceState: function (l, t, a) {
    l = l._reactInternals;
    var u = Cl(),
      e = Gt(u);
    (e.tag = 1),
      (e.payload = t),
      a != null && (e.callback = a),
      (t = Qt(l, e, u)),
      t !== null && (_l(t, l, u), Ou(t, l, u));
  },
  enqueueForceUpdate: function (l, t) {
    l = l._reactInternals;
    var a = Cl(),
      u = Gt(a);
    (u.tag = 2),
      t != null && (u.callback = t),
      (t = Qt(l, u, a)),
      t !== null && (_l(t, l, a), Ou(t, l, a));
  }
};
function ys(l, t, a, u, e, n, f) {
  return (
    (l = l.stateNode),
    typeof l.shouldComponentUpdate == 'function'
      ? l.shouldComponentUpdate(u, n, f)
      : t.prototype && t.prototype.isPureReactComponent
        ? !Yu(a, u) || !Yu(e, n)
        : !0
  );
}
function ds(l, t, a, u) {
  (l = t.state),
    typeof t.componentWillReceiveProps == 'function' &&
      t.componentWillReceiveProps(a, u),
    typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
      t.UNSAFE_componentWillReceiveProps(a, u),
    t.state !== l && li.enqueueReplaceState(t, t.state, null);
}
function va(l, t) {
  var a = t;
  if ('ref' in t) {
    a = {};
    for (var u in t) u !== 'ref' && (a[u] = t[u]);
  }
  if ((l = l.defaultProps)) {
    a === t && (a = F({}, a));
    for (var e in l) a[e] === void 0 && (a[e] = l[e]);
  }
  return a;
}
function Ky(l) {
  Je(l);
}
function Jy(l) {
  console.error(l);
}
function wy(l) {
  Je(l);
}
function tn(l, t) {
  try {
    var a = l.onUncaughtError;
    a(t.value, { componentStack: t.stack });
  } catch (u) {
    setTimeout(function () {
      throw u;
    });
  }
}
function os(l, t, a) {
  try {
    var u = l.onCaughtError;
    u(a.value, {
      componentStack: a.stack,
      errorBoundary: t.tag === 1 ? t.stateNode : null
    });
  } catch (e) {
    setTimeout(function () {
      throw e;
    });
  }
}
function ti(l, t, a) {
  return (
    (a = Gt(a)),
    (a.tag = 3),
    (a.payload = { element: null }),
    (a.callback = function () {
      tn(l, t);
    }),
    a
  );
}
function $y(l) {
  return (l = Gt(l)), (l.tag = 3), l;
}
function Wy(l, t, a, u) {
  var e = a.type.getDerivedStateFromError;
  if (typeof e == 'function') {
    var n = u.value;
    (l.payload = function () {
      return e(n);
    }),
      (l.callback = function () {
        os(t, a, u);
      });
  }
  var f = a.stateNode;
  f !== null &&
    typeof f.componentDidCatch == 'function' &&
    (l.callback = function () {
      os(t, a, u),
        typeof e != 'function' &&
          (Xt === null ? (Xt = new Set([this])) : Xt.add(this));
      var i = u.stack;
      this.componentDidCatch(u.value, { componentStack: i !== null ? i : '' });
    });
}
function tm(l, t, a, u, e) {
  if (
    ((a.flags |= 32768),
    u !== null && typeof u == 'object' && typeof u.then == 'function')
  ) {
    if (
      ((t = a.alternate),
      t !== null && uu(t, a, e, !0),
      (a = Yl.current),
      a !== null)
    ) {
      switch (a.tag) {
        case 31:
        case 13:
          return (
            wl === null ? fn() : a.alternate === null && P === 0 && (P = 3),
            (a.flags &= -257),
            (a.flags |= 65536),
            (a.lanes = e),
            u === Fe
              ? (a.flags |= 16384)
              : ((t = a.updateQueue),
                t === null ? (a.updateQueue = new Set([u])) : t.add(u),
                mf(l, u, e)),
            !1
          );
        case 22:
          return (
            (a.flags |= 65536),
            u === Fe
              ? (a.flags |= 16384)
              : ((t = a.updateQueue),
                t === null
                  ? ((t = {
                      transitions: null,
                      markerInstances: null,
                      retryQueue: new Set([u])
                    }),
                    (a.updateQueue = t))
                  : ((a = t.retryQueue),
                    a === null ? (t.retryQueue = new Set([u])) : a.add(u)),
                mf(l, u, e)),
            !1
          );
      }
      throw Error(r(435, a.tag));
    }
    return mf(l, u, e), fn(), !1;
  }
  if (Y)
    return (
      (t = Yl.current),
      t !== null
        ? (!(t.flags & 65536) && (t.flags |= 256),
          (t.flags |= 65536),
          (t.lanes = e),
          u !== Zf && ((l = Error(r(422), { cause: u })), Qu(Kl(l, a))))
        : (u !== Zf && ((t = Error(r(423), { cause: u })), Qu(Kl(t, a))),
          (l = l.current.alternate),
          (l.flags |= 65536),
          (e &= -e),
          (l.lanes |= e),
          (u = Kl(u, a)),
          (e = ti(l.stateNode, u, e)),
          lf(l, e),
          P !== 4 && (P = 2)),
      !1
    );
  var n = Error(r(520), { cause: u });
  if (
    ((n = Kl(n, a)),
    xu === null ? (xu = [n]) : xu.push(n),
    P !== 4 && (P = 2),
    t === null)
  )
    return !0;
  (u = Kl(u, a)), (a = t);
  do {
    switch (a.tag) {
      case 3:
        return (
          (a.flags |= 65536),
          (l = e & -e),
          (a.lanes |= l),
          (l = ti(a.stateNode, u, l)),
          lf(a, l),
          !1
        );
      case 1:
        if (
          ((t = a.type),
          (n = a.stateNode),
          (a.flags & 128) === 0 &&
            (typeof t.getDerivedStateFromError == 'function' ||
              (n !== null &&
                typeof n.componentDidCatch == 'function' &&
                (Xt === null || !Xt.has(n)))))
        )
          return (
            (a.flags |= 65536),
            (e &= -e),
            (a.lanes |= e),
            (e = $y(e)),
            Wy(e, l, a, u),
            lf(a, e),
            !1
          );
    }
    a = a.return;
  } while (a !== null);
  return !1;
}
var fc = Error(r(461)),
  fl = !1;
function vl(l, t, a, u) {
  t.child = l === null ? sy(t, null, a, u) : da(t, l.child, a, u);
}
function vs(l, t, a, u, e) {
  a = a.render;
  var n = t.ref;
  if ('ref' in u) {
    var f = {};
    for (var i in u) i !== 'ref' && (f[i] = u[i]);
  } else f = u;
  return (
    ya(t),
    (u = $i(l, t, a, f, n, e)),
    (i = Wi()),
    l !== null && !fl
      ? (Fi(l, t, e), Tt(l, t, e))
      : (Y && i && Qi(t), (t.flags |= 1), vl(l, t, u, e), t.child)
  );
}
function ms(l, t, a, u, e) {
  if (l === null) {
    var n = a.type;
    return typeof n == 'function' &&
      !Gi(n) &&
      n.defaultProps === void 0 &&
      a.compare === null
      ? ((t.tag = 15), (t.type = n), Fy(l, t, n, u, e))
      : ((l = Ne(a.type, null, u, t, t.mode, e)),
        (l.ref = t.ref),
        (l.return = t),
        (t.child = l));
  }
  if (((n = l.child), !ic(l, e))) {
    var f = n.memoizedProps;
    if (
      ((a = a.compare), (a = a !== null ? a : Yu), a(f, u) && l.ref === t.ref)
    )
      return Tt(l, t, e);
  }
  return (
    (t.flags |= 1),
    (l = ht(n, u)),
    (l.ref = t.ref),
    (l.return = t),
    (t.child = l)
  );
}
function Fy(l, t, a, u, e) {
  if (l !== null) {
    var n = l.memoizedProps;
    if (Yu(n, u) && l.ref === t.ref)
      if (((fl = !1), (t.pendingProps = u = n), ic(l, e)))
        l.flags & 131072 && (fl = !0);
      else return (t.lanes = l.lanes), Tt(l, t, e);
  }
  return ai(l, t, a, u, e);
}
function ky(l, t, a, u) {
  var e = u.children,
    n = l !== null ? l.memoizedState : null;
  if (
    (l === null &&
      t.stateNode === null &&
      (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }),
    u.mode === 'hidden')
  ) {
    if (t.flags & 128) {
      if (((n = n !== null ? n.baseLanes | a : a), l !== null)) {
        for (u = t.child = l.child, e = 0; u !== null; )
          (e = e | u.lanes | u.childLanes), (u = u.sibling);
        u = e & ~n;
      } else (u = 0), (t.child = null);
      return hs(l, t, n, a, u);
    }
    if (a & 536870912)
      (t.memoizedState = { baseLanes: 0, cachePool: null }),
        l !== null && He(t, n !== null ? n.cachePool : null),
        n !== null ? us(t, n) : Wf(),
        oy(t);
    else
      return (
        (u = t.lanes = 536870912),
        hs(l, t, n !== null ? n.baseLanes | a : a, a, u)
      );
  } else
    n !== null
      ? (He(t, n.cachePool), us(t, n), Nt(), (t.memoizedState = null))
      : (l !== null && He(t, null), Wf(), Nt());
  return vl(l, t, e, a), t.child;
}
function ru(l, t) {
  return (
    (l !== null && l.tag === 22) ||
      t.stateNode !== null ||
      (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }),
    t.sibling
  );
}
function hs(l, t, a, u, e) {
  var n = Li();
  return (
    (n = n === null ? null : { parent: nl._currentValue, pool: n }),
    (t.memoizedState = { baseLanes: a, cachePool: n }),
    l !== null && He(t, null),
    Wf(),
    oy(t),
    l !== null && uu(l, t, u, !0),
    (t.childLanes = e),
    null
  );
}
function je(l, t) {
  return (
    (t = an({ mode: t.mode, children: t.children }, l.mode)),
    (t.ref = l.ref),
    (l.child = t),
    (t.return = l),
    t
  );
}
function gs(l, t, a) {
  return (
    da(t, l.child, null, a),
    (l = je(t, t.pendingProps)),
    (l.flags |= 2),
    Nl(t),
    (t.memoizedState = null),
    l
  );
}
function am(l, t, a) {
  var u = t.pendingProps,
    e = (t.flags & 128) !== 0;
  if (((t.flags &= -129), l === null)) {
    if (Y) {
      if (u.mode === 'hidden')
        return (l = je(t, u)), (t.lanes = 536870912), ru(null, l);
      if (
        (Ff(t),
        (l = $)
          ? ((l = Ld(l, Jl)),
            (l = l !== null && l.data === '&' ? l : null),
            l !== null &&
              ((t.memoizedState = {
                dehydrated: l,
                treeContext: Jt !== null ? { id: Pl, overflow: lt } : null,
                retryLane: 536870912,
                hydrationErrors: null
              }),
              (a = ay(l)),
              (a.return = t),
              (t.child = a),
              (hl = t),
              ($ = null)))
          : (l = null),
        l === null)
      )
        throw wt(t);
      return (t.lanes = 536870912), null;
    }
    return je(t, u);
  }
  var n = l.memoizedState;
  if (n !== null) {
    var f = n.dehydrated;
    if ((Ff(t), e))
      if (t.flags & 256) (t.flags &= -257), (t = gs(l, t, a));
      else if (t.memoizedState !== null)
        (t.child = l.child), (t.flags |= 128), (t = null);
      else throw Error(r(558));
    else if ((fl || uu(l, t, a, !1), (e = (a & l.childLanes) !== 0), fl || e)) {
      if (
        ((u = K), u !== null && ((f = D0(u, a)), f !== 0 && f !== n.retryLane))
      )
        throw ((n.retryLane = f), Sa(l, f), _l(u, l, f), fc);
      fn(), (t = gs(l, t, a));
    } else
      (l = n.treeContext),
        ($ = $l(f.nextSibling)),
        (hl = t),
        (Y = !0),
        (Yt = null),
        (Jl = !1),
        l !== null && ey(t, l),
        (t = je(t, u)),
        (t.flags |= 4096);
    return t;
  }
  return (
    (l = ht(l.child, { mode: u.mode, children: u.children })),
    (l.ref = t.ref),
    (t.child = l),
    (l.return = t),
    l
  );
}
function Be(l, t) {
  var a = t.ref;
  if (a === null) l !== null && l.ref !== null && (t.flags |= 4194816);
  else {
    if (typeof a != 'function' && typeof a != 'object') throw Error(r(284));
    (l === null || l.ref !== a) && (t.flags |= 4194816);
  }
}
function ai(l, t, a, u, e) {
  return (
    ya(t),
    (a = $i(l, t, a, u, void 0, e)),
    (u = Wi()),
    l !== null && !fl
      ? (Fi(l, t, e), Tt(l, t, e))
      : (Y && u && Qi(t), (t.flags |= 1), vl(l, t, a, e), t.child)
  );
}
function Ss(l, t, a, u, e, n) {
  return (
    ya(t),
    (t.updateQueue = null),
    (a = my(t, u, a, e)),
    vy(l),
    (u = Wi()),
    l !== null && !fl
      ? (Fi(l, t, n), Tt(l, t, n))
      : (Y && u && Qi(t), (t.flags |= 1), vl(l, t, a, n), t.child)
  );
}
function rs(l, t, a, u, e) {
  if ((ya(t), t.stateNode === null)) {
    var n = xa,
      f = a.contextType;
    typeof f == 'object' && f !== null && (n = gl(f)),
      (n = new a(u, n)),
      (t.memoizedState =
        n.state !== null && n.state !== void 0 ? n.state : null),
      (n.updater = li),
      (t.stateNode = n),
      (n._reactInternals = t),
      (n = t.stateNode),
      (n.props = u),
      (n.state = t.memoizedState),
      (n.refs = {}),
      Ki(t),
      (f = a.contextType),
      (n.context = typeof f == 'object' && f !== null ? gl(f) : xa),
      (n.state = t.memoizedState),
      (f = a.getDerivedStateFromProps),
      typeof f == 'function' && (af(t, a, f, u), (n.state = t.memoizedState)),
      typeof a.getDerivedStateFromProps == 'function' ||
        typeof n.getSnapshotBeforeUpdate == 'function' ||
        (typeof n.UNSAFE_componentWillMount != 'function' &&
          typeof n.componentWillMount != 'function') ||
        ((f = n.state),
        typeof n.componentWillMount == 'function' && n.componentWillMount(),
        typeof n.UNSAFE_componentWillMount == 'function' &&
          n.UNSAFE_componentWillMount(),
        f !== n.state && li.enqueueReplaceState(n, n.state, null),
        Du(t, u, n, e),
        Mu(),
        (n.state = t.memoizedState)),
      typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
      (u = !0);
  } else if (l === null) {
    n = t.stateNode;
    var i = t.memoizedProps,
      c = va(a, i);
    n.props = c;
    var d = n.context,
      S = a.contextType;
    (f = xa), typeof S == 'object' && S !== null && (f = gl(S));
    var g = a.getDerivedStateFromProps;
    (S =
      typeof g == 'function' || typeof n.getSnapshotBeforeUpdate == 'function'),
      (i = t.pendingProps !== i),
      S ||
        (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
          typeof n.componentWillReceiveProps != 'function') ||
        ((i || d !== f) && ds(t, n, u, f)),
      (Mt = !1);
    var v = t.memoizedState;
    (n.state = v),
      Du(t, u, n, e),
      Mu(),
      (d = t.memoizedState),
      i || v !== d || Mt
        ? (typeof g == 'function' && (af(t, a, g, u), (d = t.memoizedState)),
          (c = Mt || ys(t, a, c, u, v, d, f))
            ? (S ||
                (typeof n.UNSAFE_componentWillMount != 'function' &&
                  typeof n.componentWillMount != 'function') ||
                (typeof n.componentWillMount == 'function' &&
                  n.componentWillMount(),
                typeof n.UNSAFE_componentWillMount == 'function' &&
                  n.UNSAFE_componentWillMount()),
              typeof n.componentDidMount == 'function' && (t.flags |= 4194308))
            : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
              (t.memoizedProps = u),
              (t.memoizedState = d)),
          (n.props = u),
          (n.state = d),
          (n.context = f),
          (u = c))
        : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
          (u = !1));
  } else {
    (n = t.stateNode),
      wf(l, t),
      (f = t.memoizedProps),
      (S = va(a, f)),
      (n.props = S),
      (g = t.pendingProps),
      (v = n.context),
      (d = a.contextType),
      (c = xa),
      typeof d == 'object' && d !== null && (c = gl(d)),
      (i = a.getDerivedStateFromProps),
      (d =
        typeof i == 'function' ||
        typeof n.getSnapshotBeforeUpdate == 'function') ||
        (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
          typeof n.componentWillReceiveProps != 'function') ||
        ((f !== g || v !== c) && ds(t, n, u, c)),
      (Mt = !1),
      (v = t.memoizedState),
      (n.state = v),
      Du(t, u, n, e),
      Mu();
    var m = t.memoizedState;
    f !== g ||
    v !== m ||
    Mt ||
    (l !== null && l.dependencies !== null && We(l.dependencies))
      ? (typeof i == 'function' && (af(t, a, i, u), (m = t.memoizedState)),
        (S =
          Mt ||
          ys(t, a, S, u, v, m, c) ||
          (l !== null && l.dependencies !== null && We(l.dependencies)))
          ? (d ||
              (typeof n.UNSAFE_componentWillUpdate != 'function' &&
                typeof n.componentWillUpdate != 'function') ||
              (typeof n.componentWillUpdate == 'function' &&
                n.componentWillUpdate(u, m, c),
              typeof n.UNSAFE_componentWillUpdate == 'function' &&
                n.UNSAFE_componentWillUpdate(u, m, c)),
            typeof n.componentDidUpdate == 'function' && (t.flags |= 4),
            typeof n.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
          : (typeof n.componentDidUpdate != 'function' ||
              (f === l.memoizedProps && v === l.memoizedState) ||
              (t.flags |= 4),
            typeof n.getSnapshotBeforeUpdate != 'function' ||
              (f === l.memoizedProps && v === l.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = u),
            (t.memoizedState = m)),
        (n.props = u),
        (n.state = m),
        (n.context = c),
        (u = S))
      : (typeof n.componentDidUpdate != 'function' ||
          (f === l.memoizedProps && v === l.memoizedState) ||
          (t.flags |= 4),
        typeof n.getSnapshotBeforeUpdate != 'function' ||
          (f === l.memoizedProps && v === l.memoizedState) ||
          (t.flags |= 1024),
        (u = !1));
  }
  return (
    (n = u),
    Be(l, t),
    (u = (t.flags & 128) !== 0),
    n || u
      ? ((n = t.stateNode),
        (a =
          u && typeof a.getDerivedStateFromError != 'function'
            ? null
            : n.render()),
        (t.flags |= 1),
        l !== null && u
          ? ((t.child = da(t, l.child, null, e)), (t.child = da(t, null, a, e)))
          : vl(l, t, a, e),
        (t.memoizedState = n.state),
        (l = t.child))
      : (l = Tt(l, t, e)),
    l
  );
}
function bs(l, t, a, u) {
  return sa(), (t.flags |= 256), vl(l, t, a, u), t.child;
}
var uf = {
  dehydrated: null,
  treeContext: null,
  retryLane: 0,
  hydrationErrors: null
};
function ef(l) {
  return { baseLanes: l, cachePool: fy() };
}
function nf(l, t, a) {
  return (l = l !== null ? l.childLanes & ~a : 0), t && (l |= xl), l;
}
function Iy(l, t, a) {
  var u = t.pendingProps,
    e = !1,
    n = (t.flags & 128) !== 0,
    f;
  if (
    ((f = n) ||
      (f =
        l !== null && l.memoizedState === null ? !1 : (tl.current & 2) !== 0),
    f && ((e = !0), (t.flags &= -129)),
    (f = (t.flags & 32) !== 0),
    (t.flags &= -33),
    l === null)
  ) {
    if (Y) {
      if (
        (e ? Ut(t) : Nt(),
        (l = $)
          ? ((l = Ld(l, Jl)),
            (l = l !== null && l.data !== '&' ? l : null),
            l !== null &&
              ((t.memoizedState = {
                dehydrated: l,
                treeContext: Jt !== null ? { id: Pl, overflow: lt } : null,
                retryLane: 536870912,
                hydrationErrors: null
              }),
              (a = ay(l)),
              (a.return = t),
              (t.child = a),
              (hl = t),
              ($ = null)))
          : (l = null),
        l === null)
      )
        throw wt(t);
      return gi(l) ? (t.lanes = 32) : (t.lanes = 536870912), null;
    }
    var i = u.children;
    return (
      (u = u.fallback),
      e
        ? (Nt(),
          (e = t.mode),
          (i = an({ mode: 'hidden', children: i }, e)),
          (u = na(u, e, a, null)),
          (i.return = t),
          (u.return = t),
          (i.sibling = u),
          (t.child = i),
          (u = t.child),
          (u.memoizedState = ef(a)),
          (u.childLanes = nf(l, f, a)),
          (t.memoizedState = uf),
          ru(null, u))
        : (Ut(t), ui(t, i))
    );
  }
  var c = l.memoizedState;
  if (c !== null && ((i = c.dehydrated), i !== null)) {
    if (n)
      t.flags & 256
        ? (Ut(t), (t.flags &= -257), (t = ff(l, t, a)))
        : t.memoizedState !== null
          ? (Nt(), (t.child = l.child), (t.flags |= 128), (t = null))
          : (Nt(),
            (i = u.fallback),
            (e = t.mode),
            (u = an({ mode: 'visible', children: u.children }, e)),
            (i = na(i, e, a, null)),
            (i.flags |= 2),
            (u.return = t),
            (i.return = t),
            (u.sibling = i),
            (t.child = u),
            da(t, l.child, null, a),
            (u = t.child),
            (u.memoizedState = ef(a)),
            (u.childLanes = nf(l, f, a)),
            (t.memoizedState = uf),
            (t = ru(null, u)));
    else if ((Ut(t), gi(i))) {
      if (((f = i.nextSibling && i.nextSibling.dataset), f)) var d = f.dgst;
      (f = d),
        (u = Error(r(419))),
        (u.stack = ''),
        (u.digest = f),
        Qu({ value: u, source: null, stack: null }),
        (t = ff(l, t, a));
    } else if (
      (fl || uu(l, t, a, !1), (f = (a & l.childLanes) !== 0), fl || f)
    ) {
      if (
        ((f = K), f !== null && ((u = D0(f, a)), u !== 0 && u !== c.retryLane))
      )
        throw ((c.retryLane = u), Sa(l, u), _l(f, l, u), fc);
      hi(i) || fn(), (t = ff(l, t, a));
    } else
      hi(i)
        ? ((t.flags |= 192), (t.child = l.child), (t = null))
        : ((l = c.treeContext),
          ($ = $l(i.nextSibling)),
          (hl = t),
          (Y = !0),
          (Yt = null),
          (Jl = !1),
          l !== null && ey(t, l),
          (t = ui(t, u.children)),
          (t.flags |= 4096));
    return t;
  }
  return e
    ? (Nt(),
      (i = u.fallback),
      (e = t.mode),
      (c = l.child),
      (d = c.sibling),
      (u = ht(c, { mode: 'hidden', children: u.children })),
      (u.subtreeFlags = c.subtreeFlags & 65011712),
      d !== null ? (i = ht(d, i)) : ((i = na(i, e, a, null)), (i.flags |= 2)),
      (i.return = t),
      (u.return = t),
      (u.sibling = i),
      (t.child = u),
      ru(null, u),
      (u = t.child),
      (i = l.child.memoizedState),
      i === null
        ? (i = ef(a))
        : ((e = i.cachePool),
          e !== null
            ? ((c = nl._currentValue),
              (e = e.parent !== c ? { parent: c, pool: c } : e))
            : (e = fy()),
          (i = { baseLanes: i.baseLanes | a, cachePool: e })),
      (u.memoizedState = i),
      (u.childLanes = nf(l, f, a)),
      (t.memoizedState = uf),
      ru(l.child, u))
    : (Ut(t),
      (a = l.child),
      (l = a.sibling),
      (a = ht(a, { mode: 'visible', children: u.children })),
      (a.return = t),
      (a.sibling = null),
      l !== null &&
        ((f = t.deletions),
        f === null ? ((t.deletions = [l]), (t.flags |= 16)) : f.push(l)),
      (t.child = a),
      (t.memoizedState = null),
      a);
}
function ui(l, t) {
  return (
    (t = an({ mode: 'visible', children: t }, l.mode)),
    (t.return = l),
    (l.child = t)
  );
}
function an(l, t) {
  return (l = Hl(22, l, null, t)), (l.lanes = 0), l;
}
function ff(l, t, a) {
  return (
    da(t, l.child, null, a),
    (l = ui(t, t.pendingProps.children)),
    (l.flags |= 2),
    (t.memoizedState = null),
    l
  );
}
function zs(l, t, a) {
  l.lanes |= t;
  var u = l.alternate;
  u !== null && (u.lanes |= t), Vf(l.return, t, a);
}
function cf(l, t, a, u, e, n) {
  var f = l.memoizedState;
  f === null
    ? (l.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: u,
        tail: a,
        tailMode: e,
        treeForkCount: n
      })
    : ((f.isBackwards = t),
      (f.rendering = null),
      (f.renderingStartTime = 0),
      (f.last = u),
      (f.tail = a),
      (f.tailMode = e),
      (f.treeForkCount = n));
}
function Py(l, t, a) {
  var u = t.pendingProps,
    e = u.revealOrder,
    n = u.tail;
  u = u.children;
  var f = tl.current,
    i = (f & 2) !== 0;
  if (
    (i ? ((f = (f & 1) | 2), (t.flags |= 128)) : (f &= 1),
    J(tl, f),
    vl(l, t, u, a),
    (u = Y ? Gu : 0),
    !i && l !== null && l.flags & 128)
  )
    l: for (l = t.child; l !== null; ) {
      if (l.tag === 13) l.memoizedState !== null && zs(l, a, t);
      else if (l.tag === 19) zs(l, a, t);
      else if (l.child !== null) {
        (l.child.return = l), (l = l.child);
        continue;
      }
      if (l === t) break l;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === t) break l;
        l = l.return;
      }
      (l.sibling.return = l.return), (l = l.sibling);
    }
  switch (e) {
    case 'forwards':
      for (a = t.child, e = null; a !== null; )
        (l = a.alternate),
          l !== null && Ie(l) === null && (e = a),
          (a = a.sibling);
      (a = e),
        a === null
          ? ((e = t.child), (t.child = null))
          : ((e = a.sibling), (a.sibling = null)),
        cf(t, !1, e, a, n, u);
      break;
    case 'backwards':
    case 'unstable_legacy-backwards':
      for (a = null, e = t.child, t.child = null; e !== null; ) {
        if (((l = e.alternate), l !== null && Ie(l) === null)) {
          t.child = e;
          break;
        }
        (l = e.sibling), (e.sibling = a), (a = e), (e = l);
      }
      cf(t, !0, a, null, n, u);
      break;
    case 'together':
      cf(t, !1, null, null, void 0, u);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function Tt(l, t, a) {
  if (
    (l !== null && (t.dependencies = l.dependencies),
    (Wt |= t.lanes),
    !(a & t.childLanes))
  )
    if (l !== null) {
      if ((uu(l, t, a, !1), (a & t.childLanes) === 0)) return null;
    } else return null;
  if (l !== null && t.child !== l.child) throw Error(r(153));
  if (t.child !== null) {
    for (
      l = t.child, a = ht(l, l.pendingProps), t.child = a, a.return = t;
      l.sibling !== null;

    )
      (l = l.sibling), (a = a.sibling = ht(l, l.pendingProps)), (a.return = t);
    a.sibling = null;
  }
  return t.child;
}
function ic(l, t) {
  return l.lanes & t ? !0 : ((l = l.dependencies), !!(l !== null && We(l)));
}
function um(l, t, a) {
  switch (t.tag) {
    case 3:
      Ze(t, t.stateNode.containerInfo), Dt(t, nl, l.memoizedState.cache), sa();
      break;
    case 27:
    case 5:
      Hf(t);
      break;
    case 4:
      Ze(t, t.stateNode.containerInfo);
      break;
    case 10:
      Dt(t, t.type, t.memoizedProps.value);
      break;
    case 31:
      if (t.memoizedState !== null) return (t.flags |= 128), Ff(t), null;
      break;
    case 13:
      var u = t.memoizedState;
      if (u !== null)
        return u.dehydrated !== null
          ? (Ut(t), (t.flags |= 128), null)
          : a & t.child.childLanes
            ? Iy(l, t, a)
            : (Ut(t), (l = Tt(l, t, a)), l !== null ? l.sibling : null);
      Ut(t);
      break;
    case 19:
      var e = (l.flags & 128) !== 0;
      if (
        ((u = (a & t.childLanes) !== 0),
        u || (uu(l, t, a, !1), (u = (a & t.childLanes) !== 0)),
        e)
      ) {
        if (u) return Py(l, t, a);
        t.flags |= 128;
      }
      if (
        ((e = t.memoizedState),
        e !== null &&
          ((e.rendering = null), (e.tail = null), (e.lastEffect = null)),
        J(tl, tl.current),
        u)
      )
        break;
      return null;
    case 22:
      return (t.lanes = 0), ky(l, t, a, t.pendingProps);
    case 24:
      Dt(t, nl, l.memoizedState.cache);
  }
  return Tt(l, t, a);
}
function ld(l, t, a) {
  if (l !== null)
    if (l.memoizedProps !== t.pendingProps) fl = !0;
    else {
      if (!ic(l, a) && !(t.flags & 128)) return (fl = !1), um(l, t, a);
      fl = !!(l.flags & 131072);
    }
  else (fl = !1), Y && t.flags & 1048576 && uy(t, Gu, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 16:
      l: {
        var u = t.pendingProps;
        if (((l = aa(t.elementType)), (t.type = l), typeof l == 'function'))
          Gi(l)
            ? ((u = va(l, u)), (t.tag = 1), (t = rs(null, t, l, u, a)))
            : ((t.tag = 0), (t = ai(null, t, l, u, a)));
        else {
          if (l != null) {
            var e = l.$$typeof;
            if (e === _i) {
              (t.tag = 11), (t = vs(null, t, l, u, a));
              break l;
            } else if (e === Oi) {
              (t.tag = 14), (t = ms(null, t, l, u, a));
              break l;
            }
          }
          throw ((t = Uf(l) || l), Error(r(306, t, '')));
        }
      }
      return t;
    case 0:
      return ai(l, t, t.type, t.pendingProps, a);
    case 1:
      return (u = t.type), (e = va(u, t.pendingProps)), rs(l, t, u, e, a);
    case 3:
      l: {
        if ((Ze(t, t.stateNode.containerInfo), l === null)) throw Error(r(387));
        u = t.pendingProps;
        var n = t.memoizedState;
        (e = n.element), wf(l, t), Du(t, u, null, a);
        var f = t.memoizedState;
        if (
          ((u = f.cache),
          Dt(t, nl, u),
          u !== n.cache && Kf(t, [nl], a, !0),
          Mu(),
          (u = f.element),
          n.isDehydrated)
        )
          if (
            ((n = { element: u, isDehydrated: !1, cache: f.cache }),
            (t.updateQueue.baseState = n),
            (t.memoizedState = n),
            t.flags & 256)
          ) {
            t = bs(l, t, u, a);
            break l;
          } else if (u !== e) {
            (e = Kl(Error(r(424)), t)), Qu(e), (t = bs(l, t, u, a));
            break l;
          } else {
            switch (((l = t.stateNode.containerInfo), l.nodeType)) {
              case 9:
                l = l.body;
                break;
              default:
                l = l.nodeName === 'HTML' ? l.ownerDocument.body : l;
            }
            for (
              $ = $l(l.firstChild),
                hl = t,
                Y = !0,
                Yt = null,
                Jl = !0,
                a = sy(t, null, u, a),
                t.child = a;
              a;

            )
              (a.flags = (a.flags & -3) | 4096), (a = a.sibling);
          }
        else {
          if ((sa(), u === e)) {
            t = Tt(l, t, a);
            break l;
          }
          vl(l, t, u, a);
        }
        t = t.child;
      }
      return t;
    case 26:
      return (
        Be(l, t),
        l === null
          ? (a = Qs(t.type, null, t.pendingProps, null))
            ? (t.memoizedState = a)
            : Y ||
              ((a = t.type),
              (l = t.pendingProps),
              (u = dn(qt.current).createElement(a)),
              (u[ml] = t),
              (u[Ol] = l),
              Sl(u, a, l),
              dl(u),
              (t.stateNode = u))
          : (t.memoizedState = Qs(
              t.type,
              l.memoizedProps,
              t.pendingProps,
              l.memoizedState
            )),
        null
      );
    case 27:
      return (
        Hf(t),
        l === null &&
          Y &&
          ((u = t.stateNode = Vd(t.type, t.pendingProps, qt.current)),
          (hl = t),
          (Jl = !0),
          (e = $),
          kt(t.type) ? ((Si = e), ($ = $l(u.firstChild))) : ($ = e)),
        vl(l, t, t.pendingProps.children, a),
        Be(l, t),
        l === null && (t.flags |= 4194304),
        t.child
      );
    case 5:
      return (
        l === null &&
          Y &&
          ((e = u = $) &&
            ((u = Rm(u, t.type, t.pendingProps, Jl)),
            u !== null
              ? ((t.stateNode = u),
                (hl = t),
                ($ = $l(u.firstChild)),
                (Jl = !1),
                (e = !0))
              : (e = !1)),
          e || wt(t)),
        Hf(t),
        (e = t.type),
        (n = t.pendingProps),
        (f = l !== null ? l.memoizedProps : null),
        (u = n.children),
        vi(e, n) ? (u = null) : f !== null && vi(e, f) && (t.flags |= 32),
        t.memoizedState !== null &&
          ((e = $i(l, t, $v, null, null, a)), (Ju._currentValue = e)),
        Be(l, t),
        vl(l, t, u, a),
        t.child
      );
    case 6:
      return (
        l === null &&
          Y &&
          ((l = a = $) &&
            ((a = jm(a, t.pendingProps, Jl)),
            a !== null
              ? ((t.stateNode = a), (hl = t), ($ = null), (l = !0))
              : (l = !1)),
          l || wt(t)),
        null
      );
    case 13:
      return Iy(l, t, a);
    case 4:
      return (
        Ze(t, t.stateNode.containerInfo),
        (u = t.pendingProps),
        l === null ? (t.child = da(t, null, u, a)) : vl(l, t, u, a),
        t.child
      );
    case 11:
      return vs(l, t, t.type, t.pendingProps, a);
    case 7:
      return vl(l, t, t.pendingProps, a), t.child;
    case 8:
      return vl(l, t, t.pendingProps.children, a), t.child;
    case 12:
      return vl(l, t, t.pendingProps.children, a), t.child;
    case 10:
      return (
        (u = t.pendingProps),
        Dt(t, t.type, u.value),
        vl(l, t, u.children, a),
        t.child
      );
    case 9:
      return (
        (e = t.type._context),
        (u = t.pendingProps.children),
        ya(t),
        (e = gl(e)),
        (u = u(e)),
        (t.flags |= 1),
        vl(l, t, u, a),
        t.child
      );
    case 14:
      return ms(l, t, t.type, t.pendingProps, a);
    case 15:
      return Fy(l, t, t.type, t.pendingProps, a);
    case 19:
      return Py(l, t, a);
    case 31:
      return am(l, t, a);
    case 22:
      return ky(l, t, a, t.pendingProps);
    case 24:
      return (
        ya(t),
        (u = gl(nl)),
        l === null
          ? ((e = Li()),
            e === null &&
              ((e = K),
              (n = Zi()),
              (e.pooledCache = n),
              n.refCount++,
              n !== null && (e.pooledCacheLanes |= a),
              (e = n)),
            (t.memoizedState = { parent: u, cache: e }),
            Ki(t),
            Dt(t, nl, e))
          : (l.lanes & a && (wf(l, t), Du(t, null, null, a), Mu()),
            (e = l.memoizedState),
            (n = t.memoizedState),
            e.parent !== u
              ? ((e = { parent: u, cache: u }),
                (t.memoizedState = e),
                t.lanes === 0 &&
                  (t.memoizedState = t.updateQueue.baseState = e),
                Dt(t, nl, u))
              : ((u = n.cache),
                Dt(t, nl, u),
                u !== e.cache && Kf(t, [nl], a, !0))),
        vl(l, t, t.pendingProps.children, a),
        t.child
      );
    case 29:
      throw t.pendingProps;
  }
  throw Error(r(156, t.tag));
}
function ft(l) {
  l.flags |= 4;
}
function sf(l, t, a, u, e) {
  if (((t = (l.mode & 32) !== 0) && (t = !1), t)) {
    if (((l.flags |= 16777216), (e & 335544128) === e))
      if (l.stateNode.complete) l.flags |= 8192;
      else if (pd()) l.flags |= 8192;
      else throw ((ia = Fe), Vi);
  } else l.flags &= -16777217;
}
function Ts(l, t) {
  if (t.type !== 'stylesheet' || t.state.loading & 4) l.flags &= -16777217;
  else if (((l.flags |= 16777216), !wd(t)))
    if (pd()) l.flags |= 8192;
    else throw ((ia = Fe), Vi);
}
function ze(l, t) {
  t !== null && (l.flags |= 4),
    l.flags & 16384 &&
      ((t = l.tag !== 22 ? _0() : 536870912), (l.lanes |= t), (Wa |= t));
}
function ou(l, t) {
  if (!Y)
    switch (l.tailMode) {
      case 'hidden':
        t = l.tail;
        for (var a = null; t !== null; )
          t.alternate !== null && (a = t), (t = t.sibling);
        a === null ? (l.tail = null) : (a.sibling = null);
        break;
      case 'collapsed':
        a = l.tail;
        for (var u = null; a !== null; )
          a.alternate !== null && (u = a), (a = a.sibling);
        u === null
          ? t || l.tail === null
            ? (l.tail = null)
            : (l.tail.sibling = null)
          : (u.sibling = null);
    }
}
function w(l) {
  var t = l.alternate !== null && l.alternate.child === l.child,
    a = 0,
    u = 0;
  if (t)
    for (var e = l.child; e !== null; )
      (a |= e.lanes | e.childLanes),
        (u |= e.subtreeFlags & 65011712),
        (u |= e.flags & 65011712),
        (e.return = l),
        (e = e.sibling);
  else
    for (e = l.child; e !== null; )
      (a |= e.lanes | e.childLanes),
        (u |= e.subtreeFlags),
        (u |= e.flags),
        (e.return = l),
        (e = e.sibling);
  return (l.subtreeFlags |= u), (l.childLanes = a), t;
}
function em(l, t, a) {
  var u = t.pendingProps;
  switch ((Xi(t), t.tag)) {
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return w(t), null;
    case 1:
      return w(t), null;
    case 3:
      return (
        (a = t.stateNode),
        (u = null),
        l !== null && (u = l.memoizedState.cache),
        t.memoizedState.cache !== u && (t.flags |= 2048),
        gt(nl),
        La(),
        a.pendingContext &&
          ((a.context = a.pendingContext), (a.pendingContext = null)),
        (l === null || l.child === null) &&
          (ba(t)
            ? ft(t)
            : l === null ||
              (l.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Pn())),
        w(t),
        null
      );
    case 26:
      var e = t.type,
        n = t.memoizedState;
      return (
        l === null
          ? (ft(t),
            n !== null ? (w(t), Ts(t, n)) : (w(t), sf(t, e, null, u, a)))
          : n
            ? n !== l.memoizedState
              ? (ft(t), w(t), Ts(t, n))
              : (w(t), (t.flags &= -16777217))
            : ((l = l.memoizedProps),
              l !== u && ft(t),
              w(t),
              sf(t, e, l, u, a)),
        null
      );
    case 27:
      if (
        (Le(t),
        (a = qt.current),
        (e = t.type),
        l !== null && t.stateNode != null)
      )
        l.memoizedProps !== u && ft(t);
      else {
        if (!u) {
          if (t.stateNode === null) throw Error(r(166));
          return w(t), null;
        }
        (l = at.current),
          ba(t) ? Fc(t) : ((l = Vd(e, u, a)), (t.stateNode = l), ft(t));
      }
      return w(t), null;
    case 5:
      if ((Le(t), (e = t.type), l !== null && t.stateNode != null))
        l.memoizedProps !== u && ft(t);
      else {
        if (!u) {
          if (t.stateNode === null) throw Error(r(166));
          return w(t), null;
        }
        if (((n = at.current), ba(t))) Fc(t);
        else {
          var f = dn(qt.current);
          switch (n) {
            case 1:
              n = f.createElementNS('http://www.w3.org/2000/svg', e);
              break;
            case 2:
              n = f.createElementNS('http://www.w3.org/1998/Math/MathML', e);
              break;
            default:
              switch (e) {
                case 'svg':
                  n = f.createElementNS('http://www.w3.org/2000/svg', e);
                  break;
                case 'math':
                  n = f.createElementNS(
                    'http://www.w3.org/1998/Math/MathML',
                    e
                  );
                  break;
                case 'script':
                  (n = f.createElement('div')),
                    (n.innerHTML = '<script><\/script>'),
                    (n = n.removeChild(n.firstChild));
                  break;
                case 'select':
                  (n =
                    typeof u.is == 'string'
                      ? f.createElement('select', { is: u.is })
                      : f.createElement('select')),
                    u.multiple
                      ? (n.multiple = !0)
                      : u.size && (n.size = u.size);
                  break;
                default:
                  n =
                    typeof u.is == 'string'
                      ? f.createElement(e, { is: u.is })
                      : f.createElement(e);
              }
          }
          (n[ml] = t), (n[Ol] = u);
          l: for (f = t.child; f !== null; ) {
            if (f.tag === 5 || f.tag === 6) n.appendChild(f.stateNode);
            else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
              (f.child.return = f), (f = f.child);
              continue;
            }
            if (f === t) break l;
            for (; f.sibling === null; ) {
              if (f.return === null || f.return === t) break l;
              f = f.return;
            }
            (f.sibling.return = f.return), (f = f.sibling);
          }
          t.stateNode = n;
          l: switch ((Sl(n, e, u), e)) {
            case 'button':
            case 'input':
            case 'select':
            case 'textarea':
              u = !!u.autoFocus;
              break l;
            case 'img':
              u = !0;
              break l;
            default:
              u = !1;
          }
          u && ft(t);
        }
      }
      return (
        w(t),
        sf(t, t.type, l === null ? null : l.memoizedProps, t.pendingProps, a),
        null
      );
    case 6:
      if (l && t.stateNode != null) l.memoizedProps !== u && ft(t);
      else {
        if (typeof u != 'string' && t.stateNode === null) throw Error(r(166));
        if (((l = qt.current), ba(t))) {
          if (
            ((l = t.stateNode),
            (a = t.memoizedProps),
            (u = null),
            (e = hl),
            e !== null)
          )
            switch (e.tag) {
              case 27:
              case 5:
                u = e.memoizedProps;
            }
          (l[ml] = t),
            (l = !!(
              l.nodeValue === a ||
              (u !== null && u.suppressHydrationWarning === !0) ||
              Qd(l.nodeValue, a)
            )),
            l || wt(t, !0);
        } else (l = dn(l).createTextNode(u)), (l[ml] = t), (t.stateNode = l);
      }
      return w(t), null;
    case 31:
      if (((a = t.memoizedState), l === null || l.memoizedState !== null)) {
        if (((u = ba(t)), a !== null)) {
          if (l === null) {
            if (!u) throw Error(r(318));
            if (
              ((l = t.memoizedState),
              (l = l !== null ? l.dehydrated : null),
              !l)
            )
              throw Error(r(557));
            l[ml] = t;
          } else
            sa(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
          w(t), (l = !1);
        } else
          (a = Pn()),
            l !== null &&
              l.memoizedState !== null &&
              (l.memoizedState.hydrationErrors = a),
            (l = !0);
        if (!l) return t.flags & 256 ? (Nl(t), t) : (Nl(t), null);
        if (t.flags & 128) throw Error(r(558));
      }
      return w(t), null;
    case 13:
      if (
        ((u = t.memoizedState),
        l === null ||
          (l.memoizedState !== null && l.memoizedState.dehydrated !== null))
      ) {
        if (((e = ba(t)), u !== null && u.dehydrated !== null)) {
          if (l === null) {
            if (!e) throw Error(r(318));
            if (
              ((e = t.memoizedState),
              (e = e !== null ? e.dehydrated : null),
              !e)
            )
              throw Error(r(317));
            e[ml] = t;
          } else
            sa(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
          w(t), (e = !1);
        } else
          (e = Pn()),
            l !== null &&
              l.memoizedState !== null &&
              (l.memoizedState.hydrationErrors = e),
            (e = !0);
        if (!e) return t.flags & 256 ? (Nl(t), t) : (Nl(t), null);
      }
      return (
        Nl(t),
        t.flags & 128
          ? ((t.lanes = a), t)
          : ((a = u !== null),
            (l = l !== null && l.memoizedState !== null),
            a &&
              ((u = t.child),
              (e = null),
              u.alternate !== null &&
                u.alternate.memoizedState !== null &&
                u.alternate.memoizedState.cachePool !== null &&
                (e = u.alternate.memoizedState.cachePool.pool),
              (n = null),
              u.memoizedState !== null &&
                u.memoizedState.cachePool !== null &&
                (n = u.memoizedState.cachePool.pool),
              n !== e && (u.flags |= 2048)),
            a !== l && a && (t.child.flags |= 8192),
            ze(t, t.updateQueue),
            w(t),
            null)
      );
    case 4:
      return La(), l === null && mc(t.stateNode.containerInfo), w(t), null;
    case 10:
      return gt(t.type), w(t), null;
    case 19:
      if ((ol(tl), (u = t.memoizedState), u === null)) return w(t), null;
      if (((e = (t.flags & 128) !== 0), (n = u.rendering), n === null))
        if (e) ou(u, !1);
        else {
          if (P !== 0 || (l !== null && l.flags & 128))
            for (l = t.child; l !== null; ) {
              if (((n = Ie(l)), n !== null)) {
                for (
                  t.flags |= 128,
                    ou(u, !1),
                    l = n.updateQueue,
                    t.updateQueue = l,
                    ze(t, l),
                    t.subtreeFlags = 0,
                    l = a,
                    a = t.child;
                  a !== null;

                )
                  ty(a, l), (a = a.sibling);
                return (
                  J(tl, (tl.current & 1) | 2),
                  Y && yt(t, u.treeForkCount),
                  t.child
                );
              }
              l = l.sibling;
            }
          u.tail !== null &&
            Rl() > en &&
            ((t.flags |= 128), (e = !0), ou(u, !1), (t.lanes = 4194304));
        }
      else {
        if (!e)
          if (((l = Ie(n)), l !== null)) {
            if (
              ((t.flags |= 128),
              (e = !0),
              (l = l.updateQueue),
              (t.updateQueue = l),
              ze(t, l),
              ou(u, !0),
              u.tail === null && u.tailMode === 'hidden' && !n.alternate && !Y)
            )
              return w(t), null;
          } else
            2 * Rl() - u.renderingStartTime > en &&
              a !== 536870912 &&
              ((t.flags |= 128), (e = !0), ou(u, !1), (t.lanes = 4194304));
        u.isBackwards
          ? ((n.sibling = t.child), (t.child = n))
          : ((l = u.last),
            l !== null ? (l.sibling = n) : (t.child = n),
            (u.last = n));
      }
      return u.tail !== null
        ? ((l = u.tail),
          (u.rendering = l),
          (u.tail = l.sibling),
          (u.renderingStartTime = Rl()),
          (l.sibling = null),
          (a = tl.current),
          J(tl, e ? (a & 1) | 2 : a & 1),
          Y && yt(t, u.treeForkCount),
          l)
        : (w(t), null);
    case 22:
    case 23:
      return (
        Nl(t),
        Ji(),
        (u = t.memoizedState !== null),
        l !== null
          ? (l.memoizedState !== null) !== u && (t.flags |= 8192)
          : u && (t.flags |= 8192),
        u
          ? a & 536870912 &&
            !(t.flags & 128) &&
            (w(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : w(t),
        (a = t.updateQueue),
        a !== null && ze(t, a.retryQueue),
        (a = null),
        l !== null &&
          l.memoizedState !== null &&
          l.memoizedState.cachePool !== null &&
          (a = l.memoizedState.cachePool.pool),
        (u = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (u = t.memoizedState.cachePool.pool),
        u !== a && (t.flags |= 2048),
        l !== null && ol(fa),
        null
      );
    case 24:
      return (
        (a = null),
        l !== null && (a = l.memoizedState.cache),
        t.memoizedState.cache !== a && (t.flags |= 2048),
        gt(nl),
        w(t),
        null
      );
    case 25:
      return null;
    case 30:
      return null;
  }
  throw Error(r(156, t.tag));
}
function nm(l, t) {
  switch ((Xi(t), t.tag)) {
    case 1:
      return (
        (l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
      );
    case 3:
      return (
        gt(nl),
        La(),
        (l = t.flags),
        l & 65536 && !(l & 128) ? ((t.flags = (l & -65537) | 128), t) : null
      );
    case 26:
    case 27:
    case 5:
      return Le(t), null;
    case 31:
      if (t.memoizedState !== null) {
        if ((Nl(t), t.alternate === null)) throw Error(r(340));
        sa();
      }
      return (
        (l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
      );
    case 13:
      if ((Nl(t), (l = t.memoizedState), l !== null && l.dehydrated !== null)) {
        if (t.alternate === null) throw Error(r(340));
        sa();
      }
      return (
        (l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
      );
    case 19:
      return ol(tl), null;
    case 4:
      return La(), null;
    case 10:
      return gt(t.type), null;
    case 22:
    case 23:
      return (
        Nl(t),
        Ji(),
        l !== null && ol(fa),
        (l = t.flags),
        l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
      );
    case 24:
      return gt(nl), null;
    case 25:
      return null;
    default:
      return null;
  }
}
function td(l, t) {
  switch ((Xi(t), t.tag)) {
    case 3:
      gt(nl), La();
      break;
    case 26:
    case 27:
    case 5:
      Le(t);
      break;
    case 4:
      La();
      break;
    case 31:
      t.memoizedState !== null && Nl(t);
      break;
    case 13:
      Nl(t);
      break;
    case 19:
      ol(tl);
      break;
    case 10:
      gt(t.type);
      break;
    case 22:
    case 23:
      Nl(t), Ji(), l !== null && ol(fa);
      break;
    case 24:
      gt(nl);
  }
}
function ue(l, t) {
  try {
    var a = t.updateQueue,
      u = a !== null ? a.lastEffect : null;
    if (u !== null) {
      var e = u.next;
      a = e;
      do {
        if ((a.tag & l) === l) {
          u = void 0;
          var n = a.create,
            f = a.inst;
          (u = n()), (f.destroy = u);
        }
        a = a.next;
      } while (a !== e);
    }
  } catch (i) {
    Z(t, t.return, i);
  }
}
function $t(l, t, a) {
  try {
    var u = t.updateQueue,
      e = u !== null ? u.lastEffect : null;
    if (e !== null) {
      var n = e.next;
      u = n;
      do {
        if ((u.tag & l) === l) {
          var f = u.inst,
            i = f.destroy;
          if (i !== void 0) {
            (f.destroy = void 0), (e = t);
            var c = a,
              d = i;
            try {
              d();
            } catch (S) {
              Z(e, c, S);
            }
          }
        }
        u = u.next;
      } while (u !== n);
    }
  } catch (S) {
    Z(t, t.return, S);
  }
}
function ad(l) {
  var t = l.updateQueue;
  if (t !== null) {
    var a = l.stateNode;
    try {
      dy(t, a);
    } catch (u) {
      Z(l, l.return, u);
    }
  }
}
function ud(l, t, a) {
  (a.props = va(l.type, l.memoizedProps)), (a.state = l.memoizedState);
  try {
    a.componentWillUnmount();
  } catch (u) {
    Z(l, t, u);
  }
}
function Nu(l, t) {
  try {
    var a = l.ref;
    if (a !== null) {
      switch (l.tag) {
        case 26:
        case 27:
        case 5:
          var u = l.stateNode;
          break;
        case 30:
          u = l.stateNode;
          break;
        default:
          u = l.stateNode;
      }
      typeof a == 'function' ? (l.refCleanup = a(u)) : (a.current = u);
    }
  } catch (e) {
    Z(l, t, e);
  }
}
function tt(l, t) {
  var a = l.ref,
    u = l.refCleanup;
  if (a !== null)
    if (typeof u == 'function')
      try {
        u();
      } catch (e) {
        Z(l, t, e);
      } finally {
        (l.refCleanup = null),
          (l = l.alternate),
          l != null && (l.refCleanup = null);
      }
    else if (typeof a == 'function')
      try {
        a(null);
      } catch (e) {
        Z(l, t, e);
      }
    else a.current = null;
}
function ed(l) {
  var t = l.type,
    a = l.memoizedProps,
    u = l.stateNode;
  try {
    l: switch (t) {
      case 'button':
      case 'input':
      case 'select':
      case 'textarea':
        a.autoFocus && u.focus();
        break l;
      case 'img':
        a.src ? (u.src = a.src) : a.srcSet && (u.srcset = a.srcSet);
    }
  } catch (e) {
    Z(l, l.return, e);
  }
}
function yf(l, t, a) {
  try {
    var u = l.stateNode;
    Mm(u, l.type, a, t), (u[Ol] = t);
  } catch (e) {
    Z(l, l.return, e);
  }
}
function nd(l) {
  return (
    l.tag === 5 ||
    l.tag === 3 ||
    l.tag === 26 ||
    (l.tag === 27 && kt(l.type)) ||
    l.tag === 4
  );
}
function df(l) {
  l: for (;;) {
    for (; l.sibling === null; ) {
      if (l.return === null || nd(l.return)) return null;
      l = l.return;
    }
    for (
      l.sibling.return = l.return, l = l.sibling;
      l.tag !== 5 && l.tag !== 6 && l.tag !== 18;

    ) {
      if (
        (l.tag === 27 && kt(l.type)) ||
        l.flags & 2 ||
        l.child === null ||
        l.tag === 4
      )
        continue l;
      (l.child.return = l), (l = l.child);
    }
    if (!(l.flags & 2)) return l.stateNode;
  }
}
function ei(l, t, a) {
  var u = l.tag;
  if (u === 5 || u === 6)
    (l = l.stateNode),
      t
        ? (a.nodeType === 9
            ? a.body
            : a.nodeName === 'HTML'
              ? a.ownerDocument.body
              : a
          ).insertBefore(l, t)
        : ((t =
            a.nodeType === 9
              ? a.body
              : a.nodeName === 'HTML'
                ? a.ownerDocument.body
                : a),
          t.appendChild(l),
          (a = a._reactRootContainer),
          a != null || t.onclick !== null || (t.onclick = vt));
  else if (
    u !== 4 &&
    (u === 27 && kt(l.type) && ((a = l.stateNode), (t = null)),
    (l = l.child),
    l !== null)
  )
    for (ei(l, t, a), l = l.sibling; l !== null; ) ei(l, t, a), (l = l.sibling);
}
function un(l, t, a) {
  var u = l.tag;
  if (u === 5 || u === 6)
    (l = l.stateNode), t ? a.insertBefore(l, t) : a.appendChild(l);
  else if (
    u !== 4 &&
    (u === 27 && kt(l.type) && (a = l.stateNode), (l = l.child), l !== null)
  )
    for (un(l, t, a), l = l.sibling; l !== null; ) un(l, t, a), (l = l.sibling);
}
function fd(l) {
  var t = l.stateNode,
    a = l.memoizedProps;
  try {
    for (var u = l.type, e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    Sl(t, u, a), (t[ml] = l), (t[Ol] = a);
  } catch (n) {
    Z(l, l.return, n);
  }
}
var dt = !1,
  el = !1,
  of = !1,
  Es = typeof WeakSet == 'function' ? WeakSet : Set,
  yl = null;
function fm(l, t) {
  if (((l = l.containerInfo), (di = hn), (l = w0(l)), Ci(l))) {
    if ('selectionStart' in l)
      var a = { start: l.selectionStart, end: l.selectionEnd };
    else
      l: {
        a = ((a = l.ownerDocument) && a.defaultView) || window;
        var u = a.getSelection && a.getSelection();
        if (u && u.rangeCount !== 0) {
          a = u.anchorNode;
          var e = u.anchorOffset,
            n = u.focusNode;
          u = u.focusOffset;
          try {
            a.nodeType, n.nodeType;
          } catch {
            a = null;
            break l;
          }
          var f = 0,
            i = -1,
            c = -1,
            d = 0,
            S = 0,
            g = l,
            v = null;
          t: for (;;) {
            for (
              var m;
              g !== a || (e !== 0 && g.nodeType !== 3) || (i = f + e),
                g !== n || (u !== 0 && g.nodeType !== 3) || (c = f + u),
                g.nodeType === 3 && (f += g.nodeValue.length),
                (m = g.firstChild) !== null;

            )
              (v = g), (g = m);
            for (;;) {
              if (g === l) break t;
              if (
                (v === a && ++d === e && (i = f),
                v === n && ++S === u && (c = f),
                (m = g.nextSibling) !== null)
              )
                break;
              (g = v), (v = g.parentNode);
            }
            g = m;
          }
          a = i === -1 || c === -1 ? null : { start: i, end: c };
        } else a = null;
      }
    a = a || { start: 0, end: 0 };
  } else a = null;
  for (
    oi = { focusedElem: l, selectionRange: a }, hn = !1, yl = t;
    yl !== null;

  )
    if (((t = yl), (l = t.child), (t.subtreeFlags & 1028) !== 0 && l !== null))
      (l.return = t), (yl = l);
    else
      for (; yl !== null; ) {
        switch (((t = yl), (n = t.alternate), (l = t.flags), t.tag)) {
          case 0:
            if (
              l & 4 &&
              ((l = t.updateQueue),
              (l = l !== null ? l.events : null),
              l !== null)
            )
              for (a = 0; a < l.length; a++)
                (e = l[a]), (e.ref.impl = e.nextImpl);
            break;
          case 11:
          case 15:
            break;
          case 1:
            if (l & 1024 && n !== null) {
              (l = void 0),
                (a = t),
                (e = n.memoizedProps),
                (n = n.memoizedState),
                (u = a.stateNode);
              try {
                var E = va(a.type, e);
                (l = u.getSnapshotBeforeUpdate(E, n)),
                  (u.__reactInternalSnapshotBeforeUpdate = l);
              } catch (b) {
                Z(a, a.return, b);
              }
            }
            break;
          case 3:
            if (l & 1024) {
              if (((l = t.stateNode.containerInfo), (a = l.nodeType), a === 9))
                mi(l);
              else if (a === 1)
                switch (l.nodeName) {
                  case 'HEAD':
                  case 'HTML':
                  case 'BODY':
                    mi(l);
                    break;
                  default:
                    l.textContent = '';
                }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          default:
            if (l & 1024) throw Error(r(163));
        }
        if (((l = t.sibling), l !== null)) {
          (l.return = t.return), (yl = l);
          break;
        }
        yl = t.return;
      }
}
function id(l, t, a) {
  var u = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 15:
      ct(l, a), u & 4 && ue(5, a);
      break;
    case 1:
      if ((ct(l, a), u & 4))
        if (((l = a.stateNode), t === null))
          try {
            l.componentDidMount();
          } catch (f) {
            Z(a, a.return, f);
          }
        else {
          var e = va(a.type, t.memoizedProps);
          t = t.memoizedState;
          try {
            l.componentDidUpdate(e, t, l.__reactInternalSnapshotBeforeUpdate);
          } catch (f) {
            Z(a, a.return, f);
          }
        }
      u & 64 && ad(a), u & 512 && Nu(a, a.return);
      break;
    case 3:
      if ((ct(l, a), u & 64 && ((l = a.updateQueue), l !== null))) {
        if (((t = null), a.child !== null))
          switch (a.child.tag) {
            case 27:
            case 5:
              t = a.child.stateNode;
              break;
            case 1:
              t = a.child.stateNode;
          }
        try {
          dy(l, t);
        } catch (f) {
          Z(a, a.return, f);
        }
      }
      break;
    case 27:
      t === null && u & 4 && fd(a);
    case 26:
    case 5:
      ct(l, a), t === null && u & 4 && ed(a), u & 512 && Nu(a, a.return);
      break;
    case 12:
      ct(l, a);
      break;
    case 31:
      ct(l, a), u & 4 && yd(l, a);
      break;
    case 13:
      ct(l, a),
        u & 4 && dd(l, a),
        u & 64 &&
          ((l = a.memoizedState),
          l !== null &&
            ((l = l.dehydrated),
            l !== null && ((a = hm.bind(null, a)), Bm(l, a))));
      break;
    case 22:
      if (((u = a.memoizedState !== null || dt), !u)) {
        (t = (t !== null && t.memoizedState !== null) || el), (e = dt);
        var n = el;
        (dt = u),
          (el = t) && !n ? st(l, a, (a.subtreeFlags & 8772) !== 0) : ct(l, a),
          (dt = e),
          (el = n);
      }
      break;
    case 30:
      break;
    default:
      ct(l, a);
  }
}
function cd(l) {
  var t = l.alternate;
  t !== null && ((l.alternate = null), cd(t)),
    (l.child = null),
    (l.deletions = null),
    (l.sibling = null),
    l.tag === 5 && ((t = l.stateNode), t !== null && Ni(t)),
    (l.stateNode = null),
    (l.return = null),
    (l.dependencies = null),
    (l.memoizedProps = null),
    (l.memoizedState = null),
    (l.pendingProps = null),
    (l.stateNode = null),
    (l.updateQueue = null);
}
var k = null,
  Al = !1;
function it(l, t, a) {
  for (a = a.child; a !== null; ) sd(l, t, a), (a = a.sibling);
}
function sd(l, t, a) {
  if (jl && typeof jl.onCommitFiberUnmount == 'function')
    try {
      jl.onCommitFiberUnmount(Fu, a);
    } catch {}
  switch (a.tag) {
    case 26:
      el || tt(a, t),
        it(l, t, a),
        a.memoizedState
          ? a.memoizedState.count--
          : a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a));
      break;
    case 27:
      el || tt(a, t);
      var u = k,
        e = Al;
      kt(a.type) && ((k = a.stateNode), (Al = !1)),
        it(l, t, a),
        ju(a.stateNode),
        (k = u),
        (Al = e);
      break;
    case 5:
      el || tt(a, t);
    case 6:
      if (
        ((u = k),
        (e = Al),
        (k = null),
        it(l, t, a),
        (k = u),
        (Al = e),
        k !== null)
      )
        if (Al)
          try {
            (k.nodeType === 9
              ? k.body
              : k.nodeName === 'HTML'
                ? k.ownerDocument.body
                : k
            ).removeChild(a.stateNode);
          } catch (n) {
            Z(a, t, n);
          }
        else
          try {
            k.removeChild(a.stateNode);
          } catch (n) {
            Z(a, t, n);
          }
      break;
    case 18:
      k !== null &&
        (Al
          ? ((l = k),
            Bs(
              l.nodeType === 9
                ? l.body
                : l.nodeName === 'HTML'
                  ? l.ownerDocument.body
                  : l,
              a.stateNode
            ),
            Pa(l))
          : Bs(k, a.stateNode));
      break;
    case 4:
      (u = k),
        (e = Al),
        (k = a.stateNode.containerInfo),
        (Al = !0),
        it(l, t, a),
        (k = u),
        (Al = e);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      $t(2, a, t), el || $t(4, a, t), it(l, t, a);
      break;
    case 1:
      el ||
        (tt(a, t),
        (u = a.stateNode),
        typeof u.componentWillUnmount == 'function' && ud(a, t, u)),
        it(l, t, a);
      break;
    case 21:
      it(l, t, a);
      break;
    case 22:
      (el = (u = el) || a.memoizedState !== null), it(l, t, a), (el = u);
      break;
    default:
      it(l, t, a);
  }
}
function yd(l, t) {
  if (
    t.memoizedState === null &&
    ((l = t.alternate), l !== null && ((l = l.memoizedState), l !== null))
  ) {
    l = l.dehydrated;
    try {
      Pa(l);
    } catch (a) {
      Z(t, t.return, a);
    }
  }
}
function dd(l, t) {
  if (
    t.memoizedState === null &&
    ((l = t.alternate),
    l !== null &&
      ((l = l.memoizedState), l !== null && ((l = l.dehydrated), l !== null)))
  )
    try {
      Pa(l);
    } catch (a) {
      Z(t, t.return, a);
    }
}
function im(l) {
  switch (l.tag) {
    case 31:
    case 13:
    case 19:
      var t = l.stateNode;
      return t === null && (t = l.stateNode = new Es()), t;
    case 22:
      return (
        (l = l.stateNode),
        (t = l._retryCache),
        t === null && (t = l._retryCache = new Es()),
        t
      );
    default:
      throw Error(r(435, l.tag));
  }
}
function Te(l, t) {
  var a = im(l);
  t.forEach(function (u) {
    if (!a.has(u)) {
      a.add(u);
      var e = gm.bind(null, l, u);
      u.then(e, e);
    }
  });
}
function Tl(l, t) {
  var a = t.deletions;
  if (a !== null)
    for (var u = 0; u < a.length; u++) {
      var e = a[u],
        n = l,
        f = t,
        i = f;
      l: for (; i !== null; ) {
        switch (i.tag) {
          case 27:
            if (kt(i.type)) {
              (k = i.stateNode), (Al = !1);
              break l;
            }
            break;
          case 5:
            (k = i.stateNode), (Al = !1);
            break l;
          case 3:
          case 4:
            (k = i.stateNode.containerInfo), (Al = !0);
            break l;
        }
        i = i.return;
      }
      if (k === null) throw Error(r(160));
      sd(n, f, e),
        (k = null),
        (Al = !1),
        (n = e.alternate),
        n !== null && (n.return = null),
        (e.return = null);
    }
  if (t.subtreeFlags & 13886)
    for (t = t.child; t !== null; ) od(t, l), (t = t.sibling);
}
var kl = null;
function od(l, t) {
  var a = l.alternate,
    u = l.flags;
  switch (l.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      Tl(t, l),
        El(l),
        u & 4 && ($t(3, l, l.return), ue(3, l), $t(5, l, l.return));
      break;
    case 1:
      Tl(t, l),
        El(l),
        u & 512 && (el || a === null || tt(a, a.return)),
        u & 64 &&
          dt &&
          ((l = l.updateQueue),
          l !== null &&
            ((u = l.callbacks),
            u !== null &&
              ((a = l.shared.hiddenCallbacks),
              (l.shared.hiddenCallbacks = a === null ? u : a.concat(u)))));
      break;
    case 26:
      var e = kl;
      if (
        (Tl(t, l),
        El(l),
        u & 512 && (el || a === null || tt(a, a.return)),
        u & 4)
      ) {
        var n = a !== null ? a.memoizedState : null;
        if (((u = l.memoizedState), a === null))
          if (u === null)
            if (l.stateNode === null) {
              l: {
                (u = l.type), (a = l.memoizedProps), (e = e.ownerDocument || e);
                t: switch (u) {
                  case 'title':
                    (n = e.getElementsByTagName('title')[0]),
                      (!n ||
                        n[Pu] ||
                        n[ml] ||
                        n.namespaceURI === 'http://www.w3.org/2000/svg' ||
                        n.hasAttribute('itemprop')) &&
                        ((n = e.createElement(u)),
                        e.head.insertBefore(
                          n,
                          e.querySelector('head > title')
                        )),
                      Sl(n, u, a),
                      (n[ml] = l),
                      dl(n),
                      (u = n);
                    break l;
                  case 'link':
                    var f = Zs('link', 'href', e).get(u + (a.href || ''));
                    if (f) {
                      for (var i = 0; i < f.length; i++)
                        if (
                          ((n = f[i]),
                          n.getAttribute('href') ===
                            (a.href == null || a.href === '' ? null : a.href) &&
                            n.getAttribute('rel') ===
                              (a.rel == null ? null : a.rel) &&
                            n.getAttribute('title') ===
                              (a.title == null ? null : a.title) &&
                            n.getAttribute('crossorigin') ===
                              (a.crossOrigin == null ? null : a.crossOrigin))
                        ) {
                          f.splice(i, 1);
                          break t;
                        }
                    }
                    (n = e.createElement(u)),
                      Sl(n, u, a),
                      e.head.appendChild(n);
                    break;
                  case 'meta':
                    if (
                      (f = Zs('meta', 'content', e).get(u + (a.content || '')))
                    ) {
                      for (i = 0; i < f.length; i++)
                        if (
                          ((n = f[i]),
                          n.getAttribute('content') ===
                            (a.content == null ? null : '' + a.content) &&
                            n.getAttribute('name') ===
                              (a.name == null ? null : a.name) &&
                            n.getAttribute('property') ===
                              (a.property == null ? null : a.property) &&
                            n.getAttribute('http-equiv') ===
                              (a.httpEquiv == null ? null : a.httpEquiv) &&
                            n.getAttribute('charset') ===
                              (a.charSet == null ? null : a.charSet))
                        ) {
                          f.splice(i, 1);
                          break t;
                        }
                    }
                    (n = e.createElement(u)),
                      Sl(n, u, a),
                      e.head.appendChild(n);
                    break;
                  default:
                    throw Error(r(468, u));
                }
                (n[ml] = l), dl(n), (u = n);
              }
              l.stateNode = u;
            } else Ls(e, l.type, l.stateNode);
          else l.stateNode = Xs(e, u, l.memoizedProps);
        else
          n !== u
            ? (n === null
                ? a.stateNode !== null &&
                  ((a = a.stateNode), a.parentNode.removeChild(a))
                : n.count--,
              u === null
                ? Ls(e, l.type, l.stateNode)
                : Xs(e, u, l.memoizedProps))
            : u === null &&
              l.stateNode !== null &&
              yf(l, l.memoizedProps, a.memoizedProps);
      }
      break;
    case 27:
      Tl(t, l),
        El(l),
        u & 512 && (el || a === null || tt(a, a.return)),
        a !== null && u & 4 && yf(l, l.memoizedProps, a.memoizedProps);
      break;
    case 5:
      if (
        (Tl(t, l),
        El(l),
        u & 512 && (el || a === null || tt(a, a.return)),
        l.flags & 32)
      ) {
        e = l.stateNode;
        try {
          Ka(e, '');
        } catch (E) {
          Z(l, l.return, E);
        }
      }
      u & 4 &&
        l.stateNode != null &&
        ((e = l.memoizedProps), yf(l, e, a !== null ? a.memoizedProps : e)),
        u & 1024 && (of = !0);
      break;
    case 6:
      if ((Tl(t, l), El(l), u & 4)) {
        if (l.stateNode === null) throw Error(r(162));
        (u = l.memoizedProps), (a = l.stateNode);
        try {
          a.nodeValue = u;
        } catch (E) {
          Z(l, l.return, E);
        }
      }
      break;
    case 3:
      if (
        ((Ye = null),
        (e = kl),
        (kl = on(t.containerInfo)),
        Tl(t, l),
        (kl = e),
        El(l),
        u & 4 && a !== null && a.memoizedState.isDehydrated)
      )
        try {
          Pa(t.containerInfo);
        } catch (E) {
          Z(l, l.return, E);
        }
      of && ((of = !1), vd(l));
      break;
    case 4:
      (u = kl), (kl = on(l.stateNode.containerInfo)), Tl(t, l), El(l), (kl = u);
      break;
    case 12:
      Tl(t, l), El(l);
      break;
    case 31:
      Tl(t, l),
        El(l),
        u & 4 &&
          ((u = l.updateQueue),
          u !== null && ((l.updateQueue = null), Te(l, u)));
      break;
    case 13:
      Tl(t, l),
        El(l),
        l.child.flags & 8192 &&
          (l.memoizedState !== null) !=
            (a !== null && a.memoizedState !== null) &&
          (Hn = Rl()),
        u & 4 &&
          ((u = l.updateQueue),
          u !== null && ((l.updateQueue = null), Te(l, u)));
      break;
    case 22:
      e = l.memoizedState !== null;
      var c = a !== null && a.memoizedState !== null,
        d = dt,
        S = el;
      if (
        ((dt = d || e),
        (el = S || c),
        Tl(t, l),
        (el = S),
        (dt = d),
        El(l),
        u & 8192)
      )
        l: for (
          t = l.stateNode,
            t._visibility = e ? t._visibility & -2 : t._visibility | 1,
            e && (a === null || c || dt || el || ua(l)),
            a = null,
            t = l;
          ;

        ) {
          if (t.tag === 5 || t.tag === 26) {
            if (a === null) {
              c = a = t;
              try {
                if (((n = c.stateNode), e))
                  (f = n.style),
                    typeof f.setProperty == 'function'
                      ? f.setProperty('display', 'none', 'important')
                      : (f.display = 'none');
                else {
                  i = c.stateNode;
                  var g = c.memoizedProps.style,
                    v =
                      g != null && g.hasOwnProperty('display')
                        ? g.display
                        : null;
                  i.style.display =
                    v == null || typeof v == 'boolean' ? '' : ('' + v).trim();
                }
              } catch (E) {
                Z(c, c.return, E);
              }
            }
          } else if (t.tag === 6) {
            if (a === null) {
              c = t;
              try {
                c.stateNode.nodeValue = e ? '' : c.memoizedProps;
              } catch (E) {
                Z(c, c.return, E);
              }
            }
          } else if (t.tag === 18) {
            if (a === null) {
              c = t;
              try {
                var m = c.stateNode;
                e ? Cs(m, !0) : Cs(c.stateNode, !1);
              } catch (E) {
                Z(c, c.return, E);
              }
            }
          } else if (
            ((t.tag !== 22 && t.tag !== 23) ||
              t.memoizedState === null ||
              t === l) &&
            t.child !== null
          ) {
            (t.child.return = t), (t = t.child);
            continue;
          }
          if (t === l) break l;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === l) break l;
            a === t && (a = null), (t = t.return);
          }
          a === t && (a = null), (t.sibling.return = t.return), (t = t.sibling);
        }
      u & 4 &&
        ((u = l.updateQueue),
        u !== null &&
          ((a = u.retryQueue),
          a !== null && ((u.retryQueue = null), Te(l, a))));
      break;
    case 19:
      Tl(t, l),
        El(l),
        u & 4 &&
          ((u = l.updateQueue),
          u !== null && ((l.updateQueue = null), Te(l, u)));
      break;
    case 30:
      break;
    case 21:
      break;
    default:
      Tl(t, l), El(l);
  }
}
function El(l) {
  var t = l.flags;
  if (t & 2) {
    try {
      for (var a, u = l.return; u !== null; ) {
        if (nd(u)) {
          a = u;
          break;
        }
        u = u.return;
      }
      if (a == null) throw Error(r(160));
      switch (a.tag) {
        case 27:
          var e = a.stateNode,
            n = df(l);
          un(l, n, e);
          break;
        case 5:
          var f = a.stateNode;
          a.flags & 32 && (Ka(f, ''), (a.flags &= -33));
          var i = df(l);
          un(l, i, f);
          break;
        case 3:
        case 4:
          var c = a.stateNode.containerInfo,
            d = df(l);
          ei(l, d, c);
          break;
        default:
          throw Error(r(161));
      }
    } catch (S) {
      Z(l, l.return, S);
    }
    l.flags &= -3;
  }
  t & 4096 && (l.flags &= -4097);
}
function vd(l) {
  if (l.subtreeFlags & 1024)
    for (l = l.child; l !== null; ) {
      var t = l;
      vd(t),
        t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
        (l = l.sibling);
    }
}
function ct(l, t) {
  if (t.subtreeFlags & 8772)
    for (t = t.child; t !== null; ) id(l, t.alternate, t), (t = t.sibling);
}
function ua(l) {
  for (l = l.child; l !== null; ) {
    var t = l;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        $t(4, t, t.return), ua(t);
        break;
      case 1:
        tt(t, t.return);
        var a = t.stateNode;
        typeof a.componentWillUnmount == 'function' && ud(t, t.return, a),
          ua(t);
        break;
      case 27:
        ju(t.stateNode);
      case 26:
      case 5:
        tt(t, t.return), ua(t);
        break;
      case 22:
        t.memoizedState === null && ua(t);
        break;
      case 30:
        ua(t);
        break;
      default:
        ua(t);
    }
    l = l.sibling;
  }
}
function st(l, t, a) {
  for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
    var u = t.alternate,
      e = l,
      n = t,
      f = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        st(e, n, a), ue(4, n);
        break;
      case 1:
        if (
          (st(e, n, a),
          (u = n),
          (e = u.stateNode),
          typeof e.componentDidMount == 'function')
        )
          try {
            e.componentDidMount();
          } catch (d) {
            Z(u, u.return, d);
          }
        if (((u = n), (e = u.updateQueue), e !== null)) {
          var i = u.stateNode;
          try {
            var c = e.shared.hiddenCallbacks;
            if (c !== null)
              for (e.shared.hiddenCallbacks = null, e = 0; e < c.length; e++)
                yy(c[e], i);
          } catch (d) {
            Z(u, u.return, d);
          }
        }
        a && f & 64 && ad(n), Nu(n, n.return);
        break;
      case 27:
        fd(n);
      case 26:
      case 5:
        st(e, n, a), a && u === null && f & 4 && ed(n), Nu(n, n.return);
        break;
      case 12:
        st(e, n, a);
        break;
      case 31:
        st(e, n, a), a && f & 4 && yd(e, n);
        break;
      case 13:
        st(e, n, a), a && f & 4 && dd(e, n);
        break;
      case 22:
        n.memoizedState === null && st(e, n, a), Nu(n, n.return);
        break;
      case 30:
        break;
      default:
        st(e, n, a);
    }
    t = t.sibling;
  }
}
function cc(l, t) {
  var a = null;
  l !== null &&
    l.memoizedState !== null &&
    l.memoizedState.cachePool !== null &&
    (a = l.memoizedState.cachePool.pool),
    (l = null),
    t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (l = t.memoizedState.cachePool.pool),
    l !== a && (l != null && l.refCount++, a != null && te(a));
}
function sc(l, t) {
  (l = null),
    t.alternate !== null && (l = t.alternate.memoizedState.cache),
    (t = t.memoizedState.cache),
    t !== l && (t.refCount++, l != null && te(l));
}
function Fl(l, t, a, u) {
  if (t.subtreeFlags & 10256)
    for (t = t.child; t !== null; ) md(l, t, a, u), (t = t.sibling);
}
function md(l, t, a, u) {
  var e = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 15:
      Fl(l, t, a, u), e & 2048 && ue(9, t);
      break;
    case 1:
      Fl(l, t, a, u);
      break;
    case 3:
      Fl(l, t, a, u),
        e & 2048 &&
          ((l = null),
          t.alternate !== null && (l = t.alternate.memoizedState.cache),
          (t = t.memoizedState.cache),
          t !== l && (t.refCount++, l != null && te(l)));
      break;
    case 12:
      if (e & 2048) {
        Fl(l, t, a, u), (l = t.stateNode);
        try {
          var n = t.memoizedProps,
            f = n.id,
            i = n.onPostCommit;
          typeof i == 'function' &&
            i(
              f,
              t.alternate === null ? 'mount' : 'update',
              l.passiveEffectDuration,
              -0
            );
        } catch (c) {
          Z(t, t.return, c);
        }
      } else Fl(l, t, a, u);
      break;
    case 31:
      Fl(l, t, a, u);
      break;
    case 13:
      Fl(l, t, a, u);
      break;
    case 23:
      break;
    case 22:
      (n = t.stateNode),
        (f = t.alternate),
        t.memoizedState !== null
          ? n._visibility & 2
            ? Fl(l, t, a, u)
            : Hu(l, t)
          : n._visibility & 2
            ? Fl(l, t, a, u)
            : ((n._visibility |= 2),
              Ea(l, t, a, u, (t.subtreeFlags & 10256) !== 0 || !1)),
        e & 2048 && cc(f, t);
      break;
    case 24:
      Fl(l, t, a, u), e & 2048 && sc(t.alternate, t);
      break;
    default:
      Fl(l, t, a, u);
  }
}
function Ea(l, t, a, u, e) {
  for (
    e = e && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child;
    t !== null;

  ) {
    var n = l,
      f = t,
      i = a,
      c = u,
      d = f.flags;
    switch (f.tag) {
      case 0:
      case 11:
      case 15:
        Ea(n, f, i, c, e), ue(8, f);
        break;
      case 23:
        break;
      case 22:
        var S = f.stateNode;
        f.memoizedState !== null
          ? S._visibility & 2
            ? Ea(n, f, i, c, e)
            : Hu(n, f)
          : ((S._visibility |= 2), Ea(n, f, i, c, e)),
          e && d & 2048 && cc(f.alternate, f);
        break;
      case 24:
        Ea(n, f, i, c, e), e && d & 2048 && sc(f.alternate, f);
        break;
      default:
        Ea(n, f, i, c, e);
    }
    t = t.sibling;
  }
}
function Hu(l, t) {
  if (t.subtreeFlags & 10256)
    for (t = t.child; t !== null; ) {
      var a = l,
        u = t,
        e = u.flags;
      switch (u.tag) {
        case 22:
          Hu(a, u), e & 2048 && cc(u.alternate, u);
          break;
        case 24:
          Hu(a, u), e & 2048 && sc(u.alternate, u);
          break;
        default:
          Hu(a, u);
      }
      t = t.sibling;
    }
}
var bu = 8192;
function za(l, t, a) {
  if (l.subtreeFlags & bu)
    for (l = l.child; l !== null; ) hd(l, t, a), (l = l.sibling);
}
function hd(l, t, a) {
  switch (l.tag) {
    case 26:
      za(l, t, a),
        l.flags & bu &&
          l.memoizedState !== null &&
          wm(a, kl, l.memoizedState, l.memoizedProps);
      break;
    case 5:
      za(l, t, a);
      break;
    case 3:
    case 4:
      var u = kl;
      (kl = on(l.stateNode.containerInfo)), za(l, t, a), (kl = u);
      break;
    case 22:
      l.memoizedState === null &&
        ((u = l.alternate),
        u !== null && u.memoizedState !== null
          ? ((u = bu), (bu = 16777216), za(l, t, a), (bu = u))
          : za(l, t, a));
      break;
    default:
      za(l, t, a);
  }
}
function gd(l) {
  var t = l.alternate;
  if (t !== null && ((l = t.child), l !== null)) {
    t.child = null;
    do (t = l.sibling), (l.sibling = null), (l = t);
    while (l !== null);
  }
}
function vu(l) {
  var t = l.deletions;
  if (l.flags & 16) {
    if (t !== null)
      for (var a = 0; a < t.length; a++) {
        var u = t[a];
        (yl = u), rd(u, l);
      }
    gd(l);
  }
  if (l.subtreeFlags & 10256)
    for (l = l.child; l !== null; ) Sd(l), (l = l.sibling);
}
function Sd(l) {
  switch (l.tag) {
    case 0:
    case 11:
    case 15:
      vu(l), l.flags & 2048 && $t(9, l, l.return);
      break;
    case 3:
      vu(l);
      break;
    case 12:
      vu(l);
      break;
    case 22:
      var t = l.stateNode;
      l.memoizedState !== null &&
      t._visibility & 2 &&
      (l.return === null || l.return.tag !== 13)
        ? ((t._visibility &= -3), Ce(l))
        : vu(l);
      break;
    default:
      vu(l);
  }
}
function Ce(l) {
  var t = l.deletions;
  if (l.flags & 16) {
    if (t !== null)
      for (var a = 0; a < t.length; a++) {
        var u = t[a];
        (yl = u), rd(u, l);
      }
    gd(l);
  }
  for (l = l.child; l !== null; ) {
    switch (((t = l), t.tag)) {
      case 0:
      case 11:
      case 15:
        $t(8, t, t.return), Ce(t);
        break;
      case 22:
        (a = t.stateNode), a._visibility & 2 && ((a._visibility &= -3), Ce(t));
        break;
      default:
        Ce(t);
    }
    l = l.sibling;
  }
}
function rd(l, t) {
  for (; yl !== null; ) {
    var a = yl;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        $t(8, a, t);
        break;
      case 23:
      case 22:
        if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
          var u = a.memoizedState.cachePool.pool;
          u != null && u.refCount++;
        }
        break;
      case 24:
        te(a.memoizedState.cache);
    }
    if (((u = a.child), u !== null)) (u.return = a), (yl = u);
    else
      l: for (a = l; yl !== null; ) {
        u = yl;
        var e = u.sibling,
          n = u.return;
        if ((cd(u), u === a)) {
          yl = null;
          break l;
        }
        if (e !== null) {
          (e.return = n), (yl = e);
          break l;
        }
        yl = n;
      }
  }
}
var cm = {
    getCacheForType: function (l) {
      var t = gl(nl),
        a = t.data.get(l);
      return a === void 0 && ((a = l()), t.data.set(l, a)), a;
    },
    cacheSignal: function () {
      return gl(nl).controller.signal;
    }
  },
  sm = typeof WeakMap == 'function' ? WeakMap : Map,
  G = 0,
  K = null,
  B = null,
  C = 0,
  X = 0,
  Dl = null,
  jt = !1,
  nu = !1,
  yc = !1,
  Et = 0,
  P = 0,
  Wt = 0,
  ca = 0,
  dc = 0,
  xl = 0,
  Wa = 0,
  xu = null,
  pl = null,
  ni = !1,
  Hn = 0,
  bd = 0,
  en = 1 / 0,
  nn = null,
  Xt = null,
  il = 0,
  Zt = null,
  Fa = null,
  St = 0,
  fi = 0,
  ii = null,
  zd = null,
  Ru = 0,
  ci = null;
function Cl() {
  return G & 2 && C !== 0 ? C & -C : O.T !== null ? vc() : U0();
}
function Td() {
  if (xl === 0)
    if (!(C & 536870912) || Y) {
      var l = ve;
      (ve <<= 1), !(ve & 3932160) && (ve = 262144), (xl = l);
    } else xl = 536870912;
  return (l = Yl.current), l !== null && (l.flags |= 32), xl;
}
function _l(l, t, a) {
  ((l === K && (X === 2 || X === 9)) || l.cancelPendingCommit !== null) &&
    (ka(l, 0), Bt(l, C, xl, !1)),
    Iu(l, a),
    (!(G & 2) || l !== K) &&
      (l === K && (!(G & 2) && (ca |= a), P === 4 && Bt(l, C, xl, !1)), et(l));
}
function Ed(l, t, a) {
  if (G & 6) throw Error(r(327));
  var u = (!a && (t & 127) === 0 && (t & l.expiredLanes) === 0) || ku(l, t),
    e = u ? om(l, t) : vf(l, t, !0),
    n = u;
  do {
    if (e === 0) {
      nu && !u && Bt(l, t, 0, !1);
      break;
    } else {
      if (((a = l.current.alternate), n && !ym(a))) {
        (e = vf(l, t, !1)), (n = !1);
        continue;
      }
      if (e === 2) {
        if (((n = t), l.errorRecoveryDisabledLanes & n)) var f = 0;
        else
          (f = l.pendingLanes & -536870913),
            (f = f !== 0 ? f : f & 536870912 ? 536870912 : 0);
        if (f !== 0) {
          t = f;
          l: {
            var i = l;
            e = xu;
            var c = i.current.memoizedState.isDehydrated;
            if ((c && (ka(i, f).flags |= 256), (f = vf(i, f, !1)), f !== 2)) {
              if (yc && !c) {
                (i.errorRecoveryDisabledLanes |= n), (ca |= n), (e = 4);
                break l;
              }
              (n = pl),
                (pl = e),
                n !== null && (pl === null ? (pl = n) : pl.push.apply(pl, n));
            }
            e = f;
          }
          if (((n = !1), e !== 2)) continue;
        }
      }
      if (e === 1) {
        ka(l, 0), Bt(l, t, 0, !0);
        break;
      }
      l: {
        switch (((u = l), (n = e), n)) {
          case 0:
          case 1:
            throw Error(r(345));
          case 4:
            if ((t & 4194048) !== t) break;
          case 6:
            Bt(u, t, xl, !jt);
            break l;
          case 2:
            pl = null;
            break;
          case 3:
          case 5:
            break;
          default:
            throw Error(r(329));
        }
        if ((t & 62914560) === t && ((e = Hn + 300 - Rl()), 10 < e)) {
          if ((Bt(u, t, xl, !jt), zn(u, 0, !0) !== 0)) break l;
          (St = t),
            (u.timeoutHandle = Zd(
              As.bind(
                null,
                u,
                a,
                pl,
                nn,
                ni,
                t,
                xl,
                ca,
                Wa,
                jt,
                n,
                'Throttled',
                -0,
                0
              ),
              e
            ));
          break l;
        }
        As(u, a, pl, nn, ni, t, xl, ca, Wa, jt, n, null, -0, 0);
      }
    }
    break;
  } while (!0);
  et(l);
}
function As(l, t, a, u, e, n, f, i, c, d, S, g, v, m) {
  if (
    ((l.timeoutHandle = -1),
    (g = t.subtreeFlags),
    g & 8192 || (g & 16785408) === 16785408)
  ) {
    (g = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: vt
    }),
      hd(t, n, g);
    var E =
      (n & 62914560) === n ? Hn - Rl() : (n & 4194048) === n ? bd - Rl() : 0;
    if (((E = $m(g, E)), E !== null)) {
      (St = n),
        (l.cancelPendingCommit = E(
          _s.bind(null, l, t, n, a, u, e, f, i, c, S, g, null, v, m)
        )),
        Bt(l, n, f, !d);
      return;
    }
  }
  _s(l, t, n, a, u, e, f, i, c);
}
function ym(l) {
  for (var t = l; ; ) {
    var a = t.tag;
    if (
      (a === 0 || a === 11 || a === 15) &&
      t.flags & 16384 &&
      ((a = t.updateQueue), a !== null && ((a = a.stores), a !== null))
    )
      for (var u = 0; u < a.length; u++) {
        var e = a[u],
          n = e.getSnapshot;
        e = e.value;
        try {
          if (!ql(n(), e)) return !1;
        } catch {
          return !1;
        }
      }
    if (((a = t.child), t.subtreeFlags & 16384 && a !== null))
      (a.return = t), (t = a);
    else {
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function Bt(l, t, a, u) {
  (t &= ~dc),
    (t &= ~ca),
    (l.suspendedLanes |= t),
    (l.pingedLanes &= ~t),
    u && (l.warmLanes |= t),
    (u = l.expirationTimes);
  for (var e = t; 0 < e; ) {
    var n = 31 - Bl(e),
      f = 1 << n;
    (u[n] = -1), (e &= ~f);
  }
  a !== 0 && O0(l, a, t);
}
function xn() {
  return G & 6 ? !0 : (ee(0), !1);
}
function oc() {
  if (B !== null) {
    if (X === 0) var l = B.return;
    else (l = B), (mt = ra = null), ki(l), (Qa = null), (Xu = 0), (l = B);
    for (; l !== null; ) td(l.alternate, l), (l = l.return);
    B = null;
  }
}
function ka(l, t) {
  var a = l.timeoutHandle;
  a !== -1 && ((l.timeoutHandle = -1), Nm(a)),
    (a = l.cancelPendingCommit),
    a !== null && ((l.cancelPendingCommit = null), a()),
    (St = 0),
    oc(),
    (K = l),
    (B = a = ht(l.current, null)),
    (C = t),
    (X = 0),
    (Dl = null),
    (jt = !1),
    (nu = ku(l, t)),
    (yc = !1),
    (Wa = xl = dc = ca = Wt = P = 0),
    (pl = xu = null),
    (ni = !1),
    t & 8 && (t |= t & 32);
  var u = l.entangledLanes;
  if (u !== 0)
    for (l = l.entanglements, u &= t; 0 < u; ) {
      var e = 31 - Bl(u),
        n = 1 << e;
      (t |= l[e]), (u &= ~n);
    }
  return (Et = t), pn(), a;
}
function Ad(l, t) {
  (U = null),
    (O.H = Lu),
    t === eu || t === On
      ? ((t = ts()), (X = 3))
      : t === Vi
        ? ((t = ts()), (X = 4))
        : (X =
            t === fc
              ? 8
              : t !== null &&
                  typeof t == 'object' &&
                  typeof t.then == 'function'
                ? 6
                : 1),
    (Dl = t),
    B === null && ((P = 1), tn(l, Kl(t, l.current)));
}
function pd() {
  var l = Yl.current;
  return l === null
    ? !0
    : (C & 4194048) === C
      ? wl === null
      : (C & 62914560) === C || C & 536870912
        ? l === wl
        : !1;
}
function _d() {
  var l = O.H;
  return (O.H = Lu), l === null ? Lu : l;
}
function Od() {
  var l = O.A;
  return (O.A = cm), l;
}
function fn() {
  (P = 4),
    jt || ((C & 4194048) !== C && Yl.current !== null) || (nu = !0),
    (!(Wt & 134217727) && !(ca & 134217727)) || K === null || Bt(K, C, xl, !1);
}
function vf(l, t, a) {
  var u = G;
  G |= 2;
  var e = _d(),
    n = Od();
  (K !== l || C !== t) && ((nn = null), ka(l, t)), (t = !1);
  var f = P;
  l: do
    try {
      if (X !== 0 && B !== null) {
        var i = B,
          c = Dl;
        switch (X) {
          case 8:
            oc(), (f = 6);
            break l;
          case 3:
          case 2:
          case 9:
          case 6:
            Yl.current === null && (t = !0);
            var d = X;
            if (((X = 0), (Dl = null), Ba(l, i, c, d), a && nu)) {
              f = 0;
              break l;
            }
            break;
          default:
            (d = X), (X = 0), (Dl = null), Ba(l, i, c, d);
        }
      }
      dm(), (f = P);
      break;
    } catch (S) {
      Ad(l, S);
    }
  while (!0);
  return (
    t && l.shellSuspendCounter++,
    (mt = ra = null),
    (G = u),
    (O.H = e),
    (O.A = n),
    B === null && ((K = null), (C = 0), pn()),
    f
  );
}
function dm() {
  for (; B !== null; ) Md(B);
}
function om(l, t) {
  var a = G;
  G |= 2;
  var u = _d(),
    e = Od();
  K !== l || C !== t
    ? ((nn = null), (en = Rl() + 500), ka(l, t))
    : (nu = ku(l, t));
  l: do
    try {
      if (X !== 0 && B !== null) {
        t = B;
        var n = Dl;
        t: switch (X) {
          case 1:
            (X = 0), (Dl = null), Ba(l, t, n, 1);
            break;
          case 2:
          case 9:
            if (ls(n)) {
              (X = 0), (Dl = null), ps(t);
              break;
            }
            (t = function () {
              (X !== 2 && X !== 9) || K !== l || (X = 7), et(l);
            }),
              n.then(t, t);
            break l;
          case 3:
            X = 7;
            break l;
          case 4:
            X = 5;
            break l;
          case 7:
            ls(n)
              ? ((X = 0), (Dl = null), ps(t))
              : ((X = 0), (Dl = null), Ba(l, t, n, 7));
            break;
          case 5:
            var f = null;
            switch (B.tag) {
              case 26:
                f = B.memoizedState;
              case 5:
              case 27:
                var i = B;
                if (f ? wd(f) : i.stateNode.complete) {
                  (X = 0), (Dl = null);
                  var c = i.sibling;
                  if (c !== null) B = c;
                  else {
                    var d = i.return;
                    d !== null ? ((B = d), Rn(d)) : (B = null);
                  }
                  break t;
                }
            }
            (X = 0), (Dl = null), Ba(l, t, n, 5);
            break;
          case 6:
            (X = 0), (Dl = null), Ba(l, t, n, 6);
            break;
          case 8:
            oc(), (P = 6);
            break l;
          default:
            throw Error(r(462));
        }
      }
      vm();
      break;
    } catch (S) {
      Ad(l, S);
    }
  while (!0);
  return (
    (mt = ra = null),
    (O.H = u),
    (O.A = e),
    (G = a),
    B !== null ? 0 : ((K = null), (C = 0), pn(), P)
  );
}
function vm() {
  for (; B !== null && !Co(); ) Md(B);
}
function Md(l) {
  var t = ld(l.alternate, l, Et);
  (l.memoizedProps = l.pendingProps), t === null ? Rn(l) : (B = t);
}
function ps(l) {
  var t = l,
    a = t.alternate;
  switch (t.tag) {
    case 15:
    case 0:
      t = Ss(a, t, t.pendingProps, t.type, void 0, C);
      break;
    case 11:
      t = Ss(a, t, t.pendingProps, t.type.render, t.ref, C);
      break;
    case 5:
      ki(t);
    default:
      td(a, t), (t = B = ty(t, Et)), (t = ld(a, t, Et));
  }
  (l.memoizedProps = l.pendingProps), t === null ? Rn(l) : (B = t);
}
function Ba(l, t, a, u) {
  (mt = ra = null), ki(t), (Qa = null), (Xu = 0);
  var e = t.return;
  try {
    if (tm(l, e, t, a, C)) {
      (P = 1), tn(l, Kl(a, l.current)), (B = null);
      return;
    }
  } catch (n) {
    if (e !== null) throw ((B = e), n);
    (P = 1), tn(l, Kl(a, l.current)), (B = null);
    return;
  }
  t.flags & 32768
    ? (Y || u === 1
        ? (l = !0)
        : nu || C & 536870912
          ? (l = !1)
          : ((jt = l = !0),
            (u === 2 || u === 9 || u === 3 || u === 6) &&
              ((u = Yl.current),
              u !== null && u.tag === 13 && (u.flags |= 16384))),
      Dd(t, l))
    : Rn(t);
}
function Rn(l) {
  var t = l;
  do {
    if (t.flags & 32768) {
      Dd(t, jt);
      return;
    }
    l = t.return;
    var a = em(t.alternate, t, Et);
    if (a !== null) {
      B = a;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      B = t;
      return;
    }
    B = t = l;
  } while (t !== null);
  P === 0 && (P = 5);
}
function Dd(l, t) {
  do {
    var a = nm(l.alternate, l);
    if (a !== null) {
      (a.flags &= 32767), (B = a);
      return;
    }
    if (
      ((a = l.return),
      a !== null &&
        ((a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)),
      !t && ((l = l.sibling), l !== null))
    ) {
      B = l;
      return;
    }
    B = l = a;
  } while (l !== null);
  (P = 6), (B = null);
}
function _s(l, t, a, u, e, n, f, i, c) {
  l.cancelPendingCommit = null;
  do jn();
  while (il !== 0);
  if (G & 6) throw Error(r(327));
  if (t !== null) {
    if (t === l.current) throw Error(r(177));
    if (
      ((n = t.lanes | t.childLanes),
      (n |= qi),
      Jo(l, a, n, f, i, c),
      l === K && ((B = K = null), (C = 0)),
      (Fa = t),
      (Zt = l),
      (St = a),
      (fi = n),
      (ii = e),
      (zd = u),
      t.subtreeFlags & 10256 || t.flags & 10256
        ? ((l.callbackNode = null),
          (l.callbackPriority = 0),
          Sm(Ve, function () {
            return Rd(), null;
          }))
        : ((l.callbackNode = null), (l.callbackPriority = 0)),
      (u = (t.flags & 13878) !== 0),
      t.subtreeFlags & 13878 || u)
    ) {
      (u = O.T), (O.T = null), (e = Q.p), (Q.p = 2), (f = G), (G |= 4);
      try {
        fm(l, t, a);
      } finally {
        (G = f), (Q.p = e), (O.T = u);
      }
    }
    (il = 1), Ud(), Nd(), Hd();
  }
}
function Ud() {
  if (il === 1) {
    il = 0;
    var l = Zt,
      t = Fa,
      a = (t.flags & 13878) !== 0;
    if (t.subtreeFlags & 13878 || a) {
      (a = O.T), (O.T = null);
      var u = Q.p;
      Q.p = 2;
      var e = G;
      G |= 4;
      try {
        od(t, l);
        var n = oi,
          f = w0(l.containerInfo),
          i = n.focusedElem,
          c = n.selectionRange;
        if (
          f !== i &&
          i &&
          i.ownerDocument &&
          J0(i.ownerDocument.documentElement, i)
        ) {
          if (c !== null && Ci(i)) {
            var d = c.start,
              S = c.end;
            if ((S === void 0 && (S = d), 'selectionStart' in i))
              (i.selectionStart = d),
                (i.selectionEnd = Math.min(S, i.value.length));
            else {
              var g = i.ownerDocument || document,
                v = (g && g.defaultView) || window;
              if (v.getSelection) {
                var m = v.getSelection(),
                  E = i.textContent.length,
                  b = Math.min(c.start, E),
                  z = c.end === void 0 ? b : Math.min(c.end, E);
                !m.extend && b > z && ((f = z), (z = b), (b = f));
                var y = wc(i, b),
                  s = wc(i, z);
                if (
                  y &&
                  s &&
                  (m.rangeCount !== 1 ||
                    m.anchorNode !== y.node ||
                    m.anchorOffset !== y.offset ||
                    m.focusNode !== s.node ||
                    m.focusOffset !== s.offset)
                ) {
                  var o = g.createRange();
                  o.setStart(y.node, y.offset),
                    m.removeAllRanges(),
                    b > z
                      ? (m.addRange(o), m.extend(s.node, s.offset))
                      : (o.setEnd(s.node, s.offset), m.addRange(o));
                }
              }
            }
          }
          for (g = [], m = i; (m = m.parentNode); )
            m.nodeType === 1 &&
              g.push({ element: m, left: m.scrollLeft, top: m.scrollTop });
          for (
            typeof i.focus == 'function' && i.focus(), i = 0;
            i < g.length;
            i++
          ) {
            var h = g[i];
            (h.element.scrollLeft = h.left), (h.element.scrollTop = h.top);
          }
        }
        (hn = !!di), (oi = di = null);
      } finally {
        (G = e), (Q.p = u), (O.T = a);
      }
    }
    (l.current = t), (il = 2);
  }
}
function Nd() {
  if (il === 2) {
    il = 0;
    var l = Zt,
      t = Fa,
      a = (t.flags & 8772) !== 0;
    if (t.subtreeFlags & 8772 || a) {
      (a = O.T), (O.T = null);
      var u = Q.p;
      Q.p = 2;
      var e = G;
      G |= 4;
      try {
        id(l, t.alternate, t);
      } finally {
        (G = e), (Q.p = u), (O.T = a);
      }
    }
    il = 3;
  }
}
function Hd() {
  if (il === 4 || il === 3) {
    (il = 0), qo();
    var l = Zt,
      t = Fa,
      a = St,
      u = zd;
    t.subtreeFlags & 10256 || t.flags & 10256
      ? (il = 5)
      : ((il = 0), (Fa = Zt = null), xd(l, l.pendingLanes));
    var e = l.pendingLanes;
    if (
      (e === 0 && (Xt = null),
      Ui(a),
      (t = t.stateNode),
      jl && typeof jl.onCommitFiberRoot == 'function')
    )
      try {
        jl.onCommitFiberRoot(Fu, t, void 0, (t.current.flags & 128) === 128);
      } catch {}
    if (u !== null) {
      (t = O.T), (e = Q.p), (Q.p = 2), (O.T = null);
      try {
        for (var n = l.onRecoverableError, f = 0; f < u.length; f++) {
          var i = u[f];
          n(i.value, { componentStack: i.stack });
        }
      } finally {
        (O.T = t), (Q.p = e);
      }
    }
    St & 3 && jn(),
      et(l),
      (e = l.pendingLanes),
      a & 261930 && e & 42
        ? l === ci
          ? Ru++
          : ((Ru = 0), (ci = l))
        : (Ru = 0),
      ee(0);
  }
}
function xd(l, t) {
  (l.pooledCacheLanes &= t) === 0 &&
    ((t = l.pooledCache), t != null && ((l.pooledCache = null), te(t)));
}
function jn() {
  return Ud(), Nd(), Hd(), Rd();
}
function Rd() {
  if (il !== 5) return !1;
  var l = Zt,
    t = fi;
  fi = 0;
  var a = Ui(St),
    u = O.T,
    e = Q.p;
  try {
    (Q.p = 32 > a ? 32 : a), (O.T = null), (a = ii), (ii = null);
    var n = Zt,
      f = St;
    if (((il = 0), (Fa = Zt = null), (St = 0), G & 6)) throw Error(r(331));
    var i = G;
    if (
      ((G |= 4),
      Sd(n.current),
      md(n, n.current, f, a),
      (G = i),
      ee(0, !1),
      jl && typeof jl.onPostCommitFiberRoot == 'function')
    )
      try {
        jl.onPostCommitFiberRoot(Fu, n);
      } catch {}
    return !0;
  } finally {
    (Q.p = e), (O.T = u), xd(l, t);
  }
}
function Os(l, t, a) {
  (t = Kl(a, t)),
    (t = ti(l.stateNode, t, 2)),
    (l = Qt(l, t, 2)),
    l !== null && (Iu(l, 2), et(l));
}
function Z(l, t, a) {
  if (l.tag === 3) Os(l, l, a);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Os(t, l, a);
        break;
      } else if (t.tag === 1) {
        var u = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == 'function' ||
          (typeof u.componentDidCatch == 'function' &&
            (Xt === null || !Xt.has(u)))
        ) {
          (l = Kl(a, l)),
            (a = $y(2)),
            (u = Qt(t, a, 2)),
            u !== null && (Wy(a, u, t, l), Iu(u, 2), et(u));
          break;
        }
      }
      t = t.return;
    }
}
function mf(l, t, a) {
  var u = l.pingCache;
  if (u === null) {
    u = l.pingCache = new sm();
    var e = new Set();
    u.set(t, e);
  } else (e = u.get(t)), e === void 0 && ((e = new Set()), u.set(t, e));
  e.has(a) || ((yc = !0), e.add(a), (l = mm.bind(null, l, t, a)), t.then(l, l));
}
function mm(l, t, a) {
  var u = l.pingCache;
  u !== null && u.delete(t),
    (l.pingedLanes |= l.suspendedLanes & a),
    (l.warmLanes &= ~a),
    K === l &&
      (C & a) === a &&
      (P === 4 || (P === 3 && (C & 62914560) === C && 300 > Rl() - Hn)
        ? !(G & 2) && ka(l, 0)
        : (dc |= a),
      Wa === C && (Wa = 0)),
    et(l);
}
function jd(l, t) {
  t === 0 && (t = _0()), (l = Sa(l, t)), l !== null && (Iu(l, t), et(l));
}
function hm(l) {
  var t = l.memoizedState,
    a = 0;
  t !== null && (a = t.retryLane), jd(l, a);
}
function gm(l, t) {
  var a = 0;
  switch (l.tag) {
    case 31:
    case 13:
      var u = l.stateNode,
        e = l.memoizedState;
      e !== null && (a = e.retryLane);
      break;
    case 19:
      u = l.stateNode;
      break;
    case 22:
      u = l.stateNode._retryCache;
      break;
    default:
      throw Error(r(314));
  }
  u !== null && u.delete(t), jd(l, a);
}
function Sm(l, t) {
  return Mi(l, t);
}
var cn = null,
  Aa = null,
  si = !1,
  sn = !1,
  hf = !1,
  Ct = 0;
function et(l) {
  l !== Aa &&
    l.next === null &&
    (Aa === null ? (cn = Aa = l) : (Aa = Aa.next = l)),
    (sn = !0),
    si || ((si = !0), bm());
}
function ee(l, t) {
  if (!hf && sn) {
    hf = !0;
    do
      for (var a = !1, u = cn; u !== null; ) {
        if (l !== 0) {
          var e = u.pendingLanes;
          if (e === 0) var n = 0;
          else {
            var f = u.suspendedLanes,
              i = u.pingedLanes;
            (n = (1 << (31 - Bl(42 | l) + 1)) - 1),
              (n &= e & ~(f & ~i)),
              (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0);
          }
          n !== 0 && ((a = !0), Ms(u, n));
        } else
          (n = C),
            (n = zn(
              u,
              u === K ? n : 0,
              u.cancelPendingCommit !== null || u.timeoutHandle !== -1
            )),
            !(n & 3) || ku(u, n) || ((a = !0), Ms(u, n));
        u = u.next;
      }
    while (a);
    hf = !1;
  }
}
function rm() {
  Bd();
}
function Bd() {
  sn = si = !1;
  var l = 0;
  Ct !== 0 && Um() && (l = Ct);
  for (var t = Rl(), a = null, u = cn; u !== null; ) {
    var e = u.next,
      n = Cd(u, t);
    n === 0
      ? ((u.next = null),
        a === null ? (cn = e) : (a.next = e),
        e === null && (Aa = a))
      : ((a = u), (l !== 0 || n & 3) && (sn = !0)),
      (u = e);
  }
  (il !== 0 && il !== 5) || ee(l), Ct !== 0 && (Ct = 0);
}
function Cd(l, t) {
  for (
    var a = l.suspendedLanes,
      u = l.pingedLanes,
      e = l.expirationTimes,
      n = l.pendingLanes & -62914561;
    0 < n;

  ) {
    var f = 31 - Bl(n),
      i = 1 << f,
      c = e[f];
    c === -1
      ? (!(i & a) || i & u) && (e[f] = Ko(i, t))
      : c <= t && (l.expiredLanes |= i),
      (n &= ~i);
  }
  if (
    ((t = K),
    (a = C),
    (a = zn(
      l,
      l === t ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    )),
    (u = l.callbackNode),
    a === 0 ||
      (l === t && (X === 2 || X === 9)) ||
      l.cancelPendingCommit !== null)
  )
    return (
      u !== null && u !== null && Zn(u),
      (l.callbackNode = null),
      (l.callbackPriority = 0)
    );
  if (!(a & 3) || ku(l, a)) {
    if (((t = a & -a), t === l.callbackPriority)) return t;
    switch ((u !== null && Zn(u), Ui(a))) {
      case 2:
      case 8:
        a = A0;
        break;
      case 32:
        a = Ve;
        break;
      case 268435456:
        a = p0;
        break;
      default:
        a = Ve;
    }
    return (
      (u = qd.bind(null, l)),
      (a = Mi(a, u)),
      (l.callbackPriority = t),
      (l.callbackNode = a),
      t
    );
  }
  return (
    u !== null && u !== null && Zn(u),
    (l.callbackPriority = 2),
    (l.callbackNode = null),
    2
  );
}
function qd(l, t) {
  if (il !== 0 && il !== 5)
    return (l.callbackNode = null), (l.callbackPriority = 0), null;
  var a = l.callbackNode;
  if (jn() && l.callbackNode !== a) return null;
  var u = C;
  return (
    (u = zn(
      l,
      l === K ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    )),
    u === 0
      ? null
      : (Ed(l, u, t),
        Cd(l, Rl()),
        l.callbackNode != null && l.callbackNode === a
          ? qd.bind(null, l)
          : null)
  );
}
function Ms(l, t) {
  if (jn()) return null;
  Ed(l, t, !0);
}
function bm() {
  Hm(function () {
    G & 6 ? Mi(E0, rm) : Bd();
  });
}
function vc() {
  if (Ct === 0) {
    var l = Ja;
    l === 0 && ((l = oe), (oe <<= 1), !(oe & 261888) && (oe = 256)), (Ct = l);
  }
  return Ct;
}
function Ds(l) {
  return l == null || typeof l == 'symbol' || typeof l == 'boolean'
    ? null
    : typeof l == 'function'
      ? l
      : Me('' + l);
}
function Us(l, t) {
  var a = t.ownerDocument.createElement('input');
  return (
    (a.name = t.name),
    (a.value = t.value),
    l.id && a.setAttribute('form', l.id),
    t.parentNode.insertBefore(a, t),
    (l = new FormData(l)),
    a.parentNode.removeChild(a),
    l
  );
}
function zm(l, t, a, u, e) {
  if (t === 'submit' && a && a.stateNode === e) {
    var n = Ds((e[Ol] || null).action),
      f = u.submitter;
    f &&
      ((t = (t = f[Ol] || null)
        ? Ds(t.formAction)
        : f.getAttribute('formAction')),
      t !== null && ((n = t), (f = null)));
    var i = new Tn('action', 'action', null, u, e);
    l.push({
      event: i,
      listeners: [
        {
          instance: null,
          listener: function () {
            if (u.defaultPrevented) {
              if (Ct !== 0) {
                var c = f ? Us(e, f) : new FormData(e);
                Pf(
                  a,
                  { pending: !0, data: c, method: e.method, action: n },
                  null,
                  c
                );
              }
            } else
              typeof n == 'function' &&
                (i.preventDefault(),
                (c = f ? Us(e, f) : new FormData(e)),
                Pf(
                  a,
                  { pending: !0, data: c, method: e.method, action: n },
                  n,
                  c
                ));
          },
          currentTarget: e
        }
      ]
    });
  }
}
for (var gf = 0; gf < Xf.length; gf++) {
  var Sf = Xf[gf],
    Tm = Sf.toLowerCase(),
    Em = Sf[0].toUpperCase() + Sf.slice(1);
  Il(Tm, 'on' + Em);
}
Il(W0, 'onAnimationEnd');
Il(F0, 'onAnimationIteration');
Il(k0, 'onAnimationStart');
Il('dblclick', 'onDoubleClick');
Il('focusin', 'onFocus');
Il('focusout', 'onBlur');
Il(Yv, 'onTransitionRun');
Il(Gv, 'onTransitionStart');
Il(Qv, 'onTransitionCancel');
Il(I0, 'onTransitionEnd');
Va('onMouseEnter', ['mouseout', 'mouseover']);
Va('onMouseLeave', ['mouseout', 'mouseover']);
Va('onPointerEnter', ['pointerout', 'pointerover']);
Va('onPointerLeave', ['pointerout', 'pointerover']);
ma(
  'onChange',
  'change click focusin focusout input keydown keyup selectionchange'.split(' ')
);
ma(
  'onSelect',
  'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
    ' '
  )
);
ma('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']);
ma(
  'onCompositionEnd',
  'compositionend focusout keydown keypress keyup mousedown'.split(' ')
);
ma(
  'onCompositionStart',
  'compositionstart focusout keydown keypress keyup mousedown'.split(' ')
);
ma(
  'onCompositionUpdate',
  'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')
);
var Vu =
    'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
      ' '
    ),
  Am = new Set(
    'beforetoggle cancel close invalid load scroll scrollend toggle'
      .split(' ')
      .concat(Vu)
  );
function Yd(l, t) {
  t = (t & 4) !== 0;
  for (var a = 0; a < l.length; a++) {
    var u = l[a],
      e = u.event;
    u = u.listeners;
    l: {
      var n = void 0;
      if (t)
        for (var f = u.length - 1; 0 <= f; f--) {
          var i = u[f],
            c = i.instance,
            d = i.currentTarget;
          if (((i = i.listener), c !== n && e.isPropagationStopped())) break l;
          (n = i), (e.currentTarget = d);
          try {
            n(e);
          } catch (S) {
            Je(S);
          }
          (e.currentTarget = null), (n = c);
        }
      else
        for (f = 0; f < u.length; f++) {
          if (
            ((i = u[f]),
            (c = i.instance),
            (d = i.currentTarget),
            (i = i.listener),
            c !== n && e.isPropagationStopped())
          )
            break l;
          (n = i), (e.currentTarget = d);
          try {
            n(e);
          } catch (S) {
            Je(S);
          }
          (e.currentTarget = null), (n = c);
        }
    }
  }
}
function j(l, t) {
  var a = t[Rf];
  a === void 0 && (a = t[Rf] = new Set());
  var u = l + '__bubble';
  a.has(u) || (Gd(t, l, 2, !1), a.add(u));
}
function rf(l, t, a) {
  var u = 0;
  t && (u |= 4), Gd(a, l, u, t);
}
var Ee = '_reactListening' + Math.random().toString(36).slice(2);
function mc(l) {
  if (!l[Ee]) {
    (l[Ee] = !0),
      N0.forEach(function (a) {
        a !== 'selectionchange' && (Am.has(a) || rf(a, !1, l), rf(a, !0, l));
      });
    var t = l.nodeType === 9 ? l : l.ownerDocument;
    t === null || t[Ee] || ((t[Ee] = !0), rf('selectionchange', !1, t));
  }
}
function Gd(l, t, a, u) {
  switch (Id(t)) {
    case 2:
      var e = km;
      break;
    case 8:
      e = Im;
      break;
    default:
      e = rc;
  }
  (a = e.bind(null, t, a, l)),
    (e = void 0),
    !Yf ||
      (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') ||
      (e = !0),
    u
      ? e !== void 0
        ? l.addEventListener(t, a, { capture: !0, passive: e })
        : l.addEventListener(t, a, !0)
      : e !== void 0
        ? l.addEventListener(t, a, { passive: e })
        : l.addEventListener(t, a, !1);
}
function bf(l, t, a, u, e) {
  var n = u;
  if (!(t & 1) && !(t & 2) && u !== null)
    l: for (;;) {
      if (u === null) return;
      var f = u.tag;
      if (f === 3 || f === 4) {
        var i = u.stateNode.containerInfo;
        if (i === e) break;
        if (f === 4)
          for (f = u.return; f !== null; ) {
            var c = f.tag;
            if ((c === 3 || c === 4) && f.stateNode.containerInfo === e) return;
            f = f.return;
          }
        for (; i !== null; ) {
          if (((f = Oa(i)), f === null)) return;
          if (((c = f.tag), c === 5 || c === 6 || c === 26 || c === 27)) {
            u = n = f;
            continue l;
          }
          i = i.parentNode;
        }
      }
      u = u.return;
    }
  Y0(function () {
    var d = n,
      S = xi(a),
      g = [];
    l: {
      var v = P0.get(l);
      if (v !== void 0) {
        var m = Tn,
          E = l;
        switch (l) {
          case 'keypress':
            if (Ue(a) === 0) break l;
          case 'keydown':
          case 'keyup':
            m = gv;
            break;
          case 'focusin':
            (E = 'focus'), (m = wn);
            break;
          case 'focusout':
            (E = 'blur'), (m = wn);
            break;
          case 'beforeblur':
          case 'afterblur':
            m = wn;
            break;
          case 'click':
            if (a.button === 2) break l;
          case 'auxclick':
          case 'dblclick':
          case 'mousedown':
          case 'mousemove':
          case 'mouseup':
          case 'mouseout':
          case 'mouseover':
          case 'contextmenu':
            m = qc;
            break;
          case 'drag':
          case 'dragend':
          case 'dragenter':
          case 'dragexit':
          case 'dragleave':
          case 'dragover':
          case 'dragstart':
          case 'drop':
            m = ev;
            break;
          case 'touchcancel':
          case 'touchend':
          case 'touchmove':
          case 'touchstart':
            m = bv;
            break;
          case W0:
          case F0:
          case k0:
            m = iv;
            break;
          case I0:
            m = Tv;
            break;
          case 'scroll':
          case 'scrollend':
            m = av;
            break;
          case 'wheel':
            m = Av;
            break;
          case 'copy':
          case 'cut':
          case 'paste':
            m = sv;
            break;
          case 'gotpointercapture':
          case 'lostpointercapture':
          case 'pointercancel':
          case 'pointerdown':
          case 'pointermove':
          case 'pointerout':
          case 'pointerover':
          case 'pointerup':
            m = Gc;
            break;
          case 'toggle':
          case 'beforetoggle':
            m = _v;
        }
        var b = (t & 4) !== 0,
          z = !b && (l === 'scroll' || l === 'scrollend'),
          y = b ? (v !== null ? v + 'Capture' : null) : v;
        b = [];
        for (var s = d, o; s !== null; ) {
          var h = s;
          if (
            ((o = h.stateNode),
            (h = h.tag),
            (h !== 5 && h !== 26 && h !== 27) ||
              o === null ||
              y === null ||
              ((h = Cu(s, y)), h != null && b.push(Ku(s, h, o))),
            z)
          )
            break;
          s = s.return;
        }
        0 < b.length &&
          ((v = new m(v, E, null, a, S)), g.push({ event: v, listeners: b }));
      }
    }
    if (!(t & 7)) {
      l: {
        if (
          ((v = l === 'mouseover' || l === 'pointerover'),
          (m = l === 'mouseout' || l === 'pointerout'),
          v &&
            a !== qf &&
            (E = a.relatedTarget || a.fromElement) &&
            (Oa(E) || E[tu]))
        )
          break l;
        if (
          (m || v) &&
          ((v =
            S.window === S
              ? S
              : (v = S.ownerDocument)
                ? v.defaultView || v.parentWindow
                : window),
          m
            ? ((E = a.relatedTarget || a.toElement),
              (m = d),
              (E = E ? Oa(E) : null),
              E !== null &&
                ((z = Wu(E)),
                (b = E.tag),
                E !== z || (b !== 5 && b !== 27 && b !== 6)) &&
                (E = null))
            : ((m = null), (E = d)),
          m !== E)
        ) {
          if (
            ((b = qc),
            (h = 'onMouseLeave'),
            (y = 'onMouseEnter'),
            (s = 'mouse'),
            (l === 'pointerout' || l === 'pointerover') &&
              ((b = Gc),
              (h = 'onPointerLeave'),
              (y = 'onPointerEnter'),
              (s = 'pointer')),
            (z = m == null ? v : Su(m)),
            (o = E == null ? v : Su(E)),
            (v = new b(h, s + 'leave', m, a, S)),
            (v.target = z),
            (v.relatedTarget = o),
            (h = null),
            Oa(S) === d &&
              ((b = new b(y, s + 'enter', E, a, S)),
              (b.target = o),
              (b.relatedTarget = z),
              (h = b)),
            (z = h),
            m && E)
          )
            t: {
              for (b = pm, y = m, s = E, o = 0, h = y; h; h = b(h)) o++;
              h = 0;
              for (var T = s; T; T = b(T)) h++;
              for (; 0 < o - h; ) (y = b(y)), o--;
              for (; 0 < h - o; ) (s = b(s)), h--;
              for (; o--; ) {
                if (y === s || (s !== null && y === s.alternate)) {
                  b = y;
                  break t;
                }
                (y = b(y)), (s = b(s));
              }
              b = null;
            }
          else b = null;
          m !== null && Ns(g, v, m, b, !1),
            E !== null && z !== null && Ns(g, z, E, b, !0);
        }
      }
      l: {
        if (
          ((v = d ? Su(d) : window),
          (m = v.nodeName && v.nodeName.toLowerCase()),
          m === 'select' || (m === 'input' && v.type === 'file'))
        )
          var N = Lc;
        else if (Zc(v))
          if (V0) N = Bv;
          else {
            N = Rv;
            var A = xv;
          }
        else
          (m = v.nodeName),
            !m ||
            m.toLowerCase() !== 'input' ||
            (v.type !== 'checkbox' && v.type !== 'radio')
              ? d && Hi(d.elementType) && (N = Lc)
              : (N = jv);
        if (N && (N = N(l, d))) {
          L0(g, N, a, S);
          break l;
        }
        A && A(l, v, d),
          l === 'focusout' &&
            d &&
            v.type === 'number' &&
            d.memoizedProps.value != null &&
            Cf(v, 'number', v.value);
      }
      switch (((A = d ? Su(d) : window), l)) {
        case 'focusin':
          (Zc(A) || A.contentEditable === 'true') &&
            ((Ua = A), (Gf = d), (pu = null));
          break;
        case 'focusout':
          pu = Gf = Ua = null;
          break;
        case 'mousedown':
          Qf = !0;
          break;
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          (Qf = !1), $c(g, a, S);
          break;
        case 'selectionchange':
          if (qv) break;
        case 'keydown':
        case 'keyup':
          $c(g, a, S);
      }
      var M;
      if (Bi)
        l: {
          switch (l) {
            case 'compositionstart':
              var H = 'onCompositionStart';
              break l;
            case 'compositionend':
              H = 'onCompositionEnd';
              break l;
            case 'compositionupdate':
              H = 'onCompositionUpdate';
              break l;
          }
          H = void 0;
        }
      else
        Da
          ? X0(l, a) && (H = 'onCompositionEnd')
          : l === 'keydown' && a.keyCode === 229 && (H = 'onCompositionStart');
      H &&
        (Q0 &&
          a.locale !== 'ko' &&
          (Da || H !== 'onCompositionStart'
            ? H === 'onCompositionEnd' && Da && (M = G0())
            : ((Rt = S),
              (Ri = 'value' in Rt ? Rt.value : Rt.textContent),
              (Da = !0))),
        (A = yn(d, H)),
        0 < A.length &&
          ((H = new Yc(H, l, null, a, S)),
          g.push({ event: H, listeners: A }),
          M ? (H.data = M) : ((M = Z0(a)), M !== null && (H.data = M)))),
        (M = Mv ? Dv(l, a) : Uv(l, a)) &&
          ((H = yn(d, 'onBeforeInput')),
          0 < H.length &&
            ((A = new Yc('onBeforeInput', 'beforeinput', null, a, S)),
            g.push({ event: A, listeners: H }),
            (A.data = M))),
        zm(g, l, d, a, S);
    }
    Yd(g, t);
  });
}
function Ku(l, t, a) {
  return { instance: l, listener: t, currentTarget: a };
}
function yn(l, t) {
  for (var a = t + 'Capture', u = []; l !== null; ) {
    var e = l,
      n = e.stateNode;
    if (
      ((e = e.tag),
      (e !== 5 && e !== 26 && e !== 27) ||
        n === null ||
        ((e = Cu(l, a)),
        e != null && u.unshift(Ku(l, e, n)),
        (e = Cu(l, t)),
        e != null && u.push(Ku(l, e, n))),
      l.tag === 3)
    )
      return u;
    l = l.return;
  }
  return [];
}
function pm(l) {
  if (l === null) return null;
  do l = l.return;
  while (l && l.tag !== 5 && l.tag !== 27);
  return l || null;
}
function Ns(l, t, a, u, e) {
  for (var n = t._reactName, f = []; a !== null && a !== u; ) {
    var i = a,
      c = i.alternate,
      d = i.stateNode;
    if (((i = i.tag), c !== null && c === u)) break;
    (i !== 5 && i !== 26 && i !== 27) ||
      d === null ||
      ((c = d),
      e
        ? ((d = Cu(a, n)), d != null && f.unshift(Ku(a, d, c)))
        : e || ((d = Cu(a, n)), d != null && f.push(Ku(a, d, c)))),
      (a = a.return);
  }
  f.length !== 0 && l.push({ event: t, listeners: f });
}
var _m = /\r\n?/g,
  Om = /\u0000|\uFFFD/g;
function Hs(l) {
  return (typeof l == 'string' ? l : '' + l)
    .replace(
      _m,
      `
`
    )
    .replace(Om, '');
}
function Qd(l, t) {
  return (t = Hs(t)), Hs(l) === t;
}
function L(l, t, a, u, e, n) {
  switch (a) {
    case 'children':
      typeof u == 'string'
        ? t === 'body' || (t === 'textarea' && u === '') || Ka(l, u)
        : (typeof u == 'number' || typeof u == 'bigint') &&
          t !== 'body' &&
          Ka(l, '' + u);
      break;
    case 'className':
      he(l, 'class', u);
      break;
    case 'tabIndex':
      he(l, 'tabindex', u);
      break;
    case 'dir':
    case 'role':
    case 'viewBox':
    case 'width':
    case 'height':
      he(l, a, u);
      break;
    case 'style':
      q0(l, u, n);
      break;
    case 'data':
      if (t !== 'object') {
        he(l, 'data', u);
        break;
      }
    case 'src':
    case 'href':
      if (u === '' && (t !== 'a' || a !== 'href')) {
        l.removeAttribute(a);
        break;
      }
      if (
        u == null ||
        typeof u == 'function' ||
        typeof u == 'symbol' ||
        typeof u == 'boolean'
      ) {
        l.removeAttribute(a);
        break;
      }
      (u = Me('' + u)), l.setAttribute(a, u);
      break;
    case 'action':
    case 'formAction':
      if (typeof u == 'function') {
        l.setAttribute(
          a,
          "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
        );
        break;
      } else
        typeof n == 'function' &&
          (a === 'formAction'
            ? (t !== 'input' && L(l, t, 'name', e.name, e, null),
              L(l, t, 'formEncType', e.formEncType, e, null),
              L(l, t, 'formMethod', e.formMethod, e, null),
              L(l, t, 'formTarget', e.formTarget, e, null))
            : (L(l, t, 'encType', e.encType, e, null),
              L(l, t, 'method', e.method, e, null),
              L(l, t, 'target', e.target, e, null)));
      if (u == null || typeof u == 'symbol' || typeof u == 'boolean') {
        l.removeAttribute(a);
        break;
      }
      (u = Me('' + u)), l.setAttribute(a, u);
      break;
    case 'onClick':
      u != null && (l.onclick = vt);
      break;
    case 'onScroll':
      u != null && j('scroll', l);
      break;
    case 'onScrollEnd':
      u != null && j('scrollend', l);
      break;
    case 'dangerouslySetInnerHTML':
      if (u != null) {
        if (typeof u != 'object' || !('__html' in u)) throw Error(r(61));
        if (((a = u.__html), a != null)) {
          if (e.children != null) throw Error(r(60));
          l.innerHTML = a;
        }
      }
      break;
    case 'multiple':
      l.multiple = u && typeof u != 'function' && typeof u != 'symbol';
      break;
    case 'muted':
      l.muted = u && typeof u != 'function' && typeof u != 'symbol';
      break;
    case 'suppressContentEditableWarning':
    case 'suppressHydrationWarning':
    case 'defaultValue':
    case 'defaultChecked':
    case 'innerHTML':
    case 'ref':
      break;
    case 'autoFocus':
      break;
    case 'xlinkHref':
      if (
        u == null ||
        typeof u == 'function' ||
        typeof u == 'boolean' ||
        typeof u == 'symbol'
      ) {
        l.removeAttribute('xlink:href');
        break;
      }
      (a = Me('' + u)),
        l.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', a);
      break;
    case 'contentEditable':
    case 'spellCheck':
    case 'draggable':
    case 'value':
    case 'autoReverse':
    case 'externalResourcesRequired':
    case 'focusable':
    case 'preserveAlpha':
      u != null && typeof u != 'function' && typeof u != 'symbol'
        ? l.setAttribute(a, '' + u)
        : l.removeAttribute(a);
      break;
    case 'inert':
    case 'allowFullScreen':
    case 'async':
    case 'autoPlay':
    case 'controls':
    case 'default':
    case 'defer':
    case 'disabled':
    case 'disablePictureInPicture':
    case 'disableRemotePlayback':
    case 'formNoValidate':
    case 'hidden':
    case 'loop':
    case 'noModule':
    case 'noValidate':
    case 'open':
    case 'playsInline':
    case 'readOnly':
    case 'required':
    case 'reversed':
    case 'scoped':
    case 'seamless':
    case 'itemScope':
      u && typeof u != 'function' && typeof u != 'symbol'
        ? l.setAttribute(a, '')
        : l.removeAttribute(a);
      break;
    case 'capture':
    case 'download':
      u === !0
        ? l.setAttribute(a, '')
        : u !== !1 &&
            u != null &&
            typeof u != 'function' &&
            typeof u != 'symbol'
          ? l.setAttribute(a, u)
          : l.removeAttribute(a);
      break;
    case 'cols':
    case 'rows':
    case 'size':
    case 'span':
      u != null &&
      typeof u != 'function' &&
      typeof u != 'symbol' &&
      !isNaN(u) &&
      1 <= u
        ? l.setAttribute(a, u)
        : l.removeAttribute(a);
      break;
    case 'rowSpan':
    case 'start':
      u == null || typeof u == 'function' || typeof u == 'symbol' || isNaN(u)
        ? l.removeAttribute(a)
        : l.setAttribute(a, u);
      break;
    case 'popover':
      j('beforetoggle', l), j('toggle', l), Oe(l, 'popover', u);
      break;
    case 'xlinkActuate':
      nt(l, 'http://www.w3.org/1999/xlink', 'xlink:actuate', u);
      break;
    case 'xlinkArcrole':
      nt(l, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', u);
      break;
    case 'xlinkRole':
      nt(l, 'http://www.w3.org/1999/xlink', 'xlink:role', u);
      break;
    case 'xlinkShow':
      nt(l, 'http://www.w3.org/1999/xlink', 'xlink:show', u);
      break;
    case 'xlinkTitle':
      nt(l, 'http://www.w3.org/1999/xlink', 'xlink:title', u);
      break;
    case 'xlinkType':
      nt(l, 'http://www.w3.org/1999/xlink', 'xlink:type', u);
      break;
    case 'xmlBase':
      nt(l, 'http://www.w3.org/XML/1998/namespace', 'xml:base', u);
      break;
    case 'xmlLang':
      nt(l, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', u);
      break;
    case 'xmlSpace':
      nt(l, 'http://www.w3.org/XML/1998/namespace', 'xml:space', u);
      break;
    case 'is':
      Oe(l, 'is', u);
      break;
    case 'innerText':
    case 'textContent':
      break;
    default:
      (!(2 < a.length) ||
        (a[0] !== 'o' && a[0] !== 'O') ||
        (a[1] !== 'n' && a[1] !== 'N')) &&
        ((a = lv.get(a) || a), Oe(l, a, u));
  }
}
function yi(l, t, a, u, e, n) {
  switch (a) {
    case 'style':
      q0(l, u, n);
      break;
    case 'dangerouslySetInnerHTML':
      if (u != null) {
        if (typeof u != 'object' || !('__html' in u)) throw Error(r(61));
        if (((a = u.__html), a != null)) {
          if (e.children != null) throw Error(r(60));
          l.innerHTML = a;
        }
      }
      break;
    case 'children':
      typeof u == 'string'
        ? Ka(l, u)
        : (typeof u == 'number' || typeof u == 'bigint') && Ka(l, '' + u);
      break;
    case 'onScroll':
      u != null && j('scroll', l);
      break;
    case 'onScrollEnd':
      u != null && j('scrollend', l);
      break;
    case 'onClick':
      u != null && (l.onclick = vt);
      break;
    case 'suppressContentEditableWarning':
    case 'suppressHydrationWarning':
    case 'innerHTML':
    case 'ref':
      break;
    case 'innerText':
    case 'textContent':
      break;
    default:
      if (!H0.hasOwnProperty(a))
        l: {
          if (
            a[0] === 'o' &&
            a[1] === 'n' &&
            ((e = a.endsWith('Capture')),
            (t = a.slice(2, e ? a.length - 7 : void 0)),
            (n = l[Ol] || null),
            (n = n != null ? n[a] : null),
            typeof n == 'function' && l.removeEventListener(t, n, e),
            typeof u == 'function')
          ) {
            typeof n != 'function' &&
              n !== null &&
              (a in l
                ? (l[a] = null)
                : l.hasAttribute(a) && l.removeAttribute(a)),
              l.addEventListener(t, u, e);
            break l;
          }
          a in l ? (l[a] = u) : u === !0 ? l.setAttribute(a, '') : Oe(l, a, u);
        }
  }
}
function Sl(l, t, a) {
  switch (t) {
    case 'div':
    case 'span':
    case 'svg':
    case 'path':
    case 'a':
    case 'g':
    case 'p':
    case 'li':
      break;
    case 'img':
      j('error', l), j('load', l);
      var u = !1,
        e = !1,
        n;
      for (n in a)
        if (a.hasOwnProperty(n)) {
          var f = a[n];
          if (f != null)
            switch (n) {
              case 'src':
                u = !0;
                break;
              case 'srcSet':
                e = !0;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(r(137, t));
              default:
                L(l, t, n, f, a, null);
            }
        }
      e && L(l, t, 'srcSet', a.srcSet, a, null),
        u && L(l, t, 'src', a.src, a, null);
      return;
    case 'input':
      j('invalid', l);
      var i = (n = f = e = null),
        c = null,
        d = null;
      for (u in a)
        if (a.hasOwnProperty(u)) {
          var S = a[u];
          if (S != null)
            switch (u) {
              case 'name':
                e = S;
                break;
              case 'type':
                f = S;
                break;
              case 'checked':
                c = S;
                break;
              case 'defaultChecked':
                d = S;
                break;
              case 'value':
                n = S;
                break;
              case 'defaultValue':
                i = S;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (S != null) throw Error(r(137, t));
                break;
              default:
                L(l, t, u, S, a, null);
            }
        }
      j0(l, n, i, c, d, f, e, !1);
      return;
    case 'select':
      j('invalid', l), (u = f = n = null);
      for (e in a)
        if (a.hasOwnProperty(e) && ((i = a[e]), i != null))
          switch (e) {
            case 'value':
              n = i;
              break;
            case 'defaultValue':
              f = i;
              break;
            case 'multiple':
              u = i;
            default:
              L(l, t, e, i, a, null);
          }
      (t = n),
        (a = f),
        (l.multiple = !!u),
        t != null ? qa(l, !!u, t, !1) : a != null && qa(l, !!u, a, !0);
      return;
    case 'textarea':
      j('invalid', l), (n = e = u = null);
      for (f in a)
        if (a.hasOwnProperty(f) && ((i = a[f]), i != null))
          switch (f) {
            case 'value':
              u = i;
              break;
            case 'defaultValue':
              e = i;
              break;
            case 'children':
              n = i;
              break;
            case 'dangerouslySetInnerHTML':
              if (i != null) throw Error(r(91));
              break;
            default:
              L(l, t, f, i, a, null);
          }
      C0(l, u, e, n);
      return;
    case 'option':
      for (c in a)
        if (a.hasOwnProperty(c) && ((u = a[c]), u != null))
          switch (c) {
            case 'selected':
              l.selected = u && typeof u != 'function' && typeof u != 'symbol';
              break;
            default:
              L(l, t, c, u, a, null);
          }
      return;
    case 'dialog':
      j('beforetoggle', l), j('toggle', l), j('cancel', l), j('close', l);
      break;
    case 'iframe':
    case 'object':
      j('load', l);
      break;
    case 'video':
    case 'audio':
      for (u = 0; u < Vu.length; u++) j(Vu[u], l);
      break;
    case 'image':
      j('error', l), j('load', l);
      break;
    case 'details':
      j('toggle', l);
      break;
    case 'embed':
    case 'source':
    case 'link':
      j('error', l), j('load', l);
    case 'area':
    case 'base':
    case 'br':
    case 'col':
    case 'hr':
    case 'keygen':
    case 'meta':
    case 'param':
    case 'track':
    case 'wbr':
    case 'menuitem':
      for (d in a)
        if (a.hasOwnProperty(d) && ((u = a[d]), u != null))
          switch (d) {
            case 'children':
            case 'dangerouslySetInnerHTML':
              throw Error(r(137, t));
            default:
              L(l, t, d, u, a, null);
          }
      return;
    default:
      if (Hi(t)) {
        for (S in a)
          a.hasOwnProperty(S) &&
            ((u = a[S]), u !== void 0 && yi(l, t, S, u, a, void 0));
        return;
      }
  }
  for (i in a)
    a.hasOwnProperty(i) && ((u = a[i]), u != null && L(l, t, i, u, a, null));
}
function Mm(l, t, a, u) {
  switch (t) {
    case 'div':
    case 'span':
    case 'svg':
    case 'path':
    case 'a':
    case 'g':
    case 'p':
    case 'li':
      break;
    case 'input':
      var e = null,
        n = null,
        f = null,
        i = null,
        c = null,
        d = null,
        S = null;
      for (m in a) {
        var g = a[m];
        if (a.hasOwnProperty(m) && g != null)
          switch (m) {
            case 'checked':
              break;
            case 'value':
              break;
            case 'defaultValue':
              c = g;
            default:
              u.hasOwnProperty(m) || L(l, t, m, null, u, g);
          }
      }
      for (var v in u) {
        var m = u[v];
        if (((g = a[v]), u.hasOwnProperty(v) && (m != null || g != null)))
          switch (v) {
            case 'type':
              n = m;
              break;
            case 'name':
              e = m;
              break;
            case 'checked':
              d = m;
              break;
            case 'defaultChecked':
              S = m;
              break;
            case 'value':
              f = m;
              break;
            case 'defaultValue':
              i = m;
              break;
            case 'children':
            case 'dangerouslySetInnerHTML':
              if (m != null) throw Error(r(137, t));
              break;
            default:
              m !== g && L(l, t, v, m, u, g);
          }
      }
      Bf(l, f, i, c, d, S, n, e);
      return;
    case 'select':
      m = f = i = v = null;
      for (n in a)
        if (((c = a[n]), a.hasOwnProperty(n) && c != null))
          switch (n) {
            case 'value':
              break;
            case 'multiple':
              m = c;
            default:
              u.hasOwnProperty(n) || L(l, t, n, null, u, c);
          }
      for (e in u)
        if (
          ((n = u[e]),
          (c = a[e]),
          u.hasOwnProperty(e) && (n != null || c != null))
        )
          switch (e) {
            case 'value':
              v = n;
              break;
            case 'defaultValue':
              i = n;
              break;
            case 'multiple':
              f = n;
            default:
              n !== c && L(l, t, e, n, u, c);
          }
      (t = i),
        (a = f),
        (u = m),
        v != null
          ? qa(l, !!a, v, !1)
          : !!u != !!a &&
            (t != null ? qa(l, !!a, t, !0) : qa(l, !!a, a ? [] : '', !1));
      return;
    case 'textarea':
      m = v = null;
      for (i in a)
        if (
          ((e = a[i]), a.hasOwnProperty(i) && e != null && !u.hasOwnProperty(i))
        )
          switch (i) {
            case 'value':
              break;
            case 'children':
              break;
            default:
              L(l, t, i, null, u, e);
          }
      for (f in u)
        if (
          ((e = u[f]),
          (n = a[f]),
          u.hasOwnProperty(f) && (e != null || n != null))
        )
          switch (f) {
            case 'value':
              v = e;
              break;
            case 'defaultValue':
              m = e;
              break;
            case 'children':
              break;
            case 'dangerouslySetInnerHTML':
              if (e != null) throw Error(r(91));
              break;
            default:
              e !== n && L(l, t, f, e, u, n);
          }
      B0(l, v, m);
      return;
    case 'option':
      for (var E in a)
        if (
          ((v = a[E]), a.hasOwnProperty(E) && v != null && !u.hasOwnProperty(E))
        )
          switch (E) {
            case 'selected':
              l.selected = !1;
              break;
            default:
              L(l, t, E, null, u, v);
          }
      for (c in u)
        if (
          ((v = u[c]),
          (m = a[c]),
          u.hasOwnProperty(c) && v !== m && (v != null || m != null))
        )
          switch (c) {
            case 'selected':
              l.selected = v && typeof v != 'function' && typeof v != 'symbol';
              break;
            default:
              L(l, t, c, v, u, m);
          }
      return;
    case 'img':
    case 'link':
    case 'area':
    case 'base':
    case 'br':
    case 'col':
    case 'embed':
    case 'hr':
    case 'keygen':
    case 'meta':
    case 'param':
    case 'source':
    case 'track':
    case 'wbr':
    case 'menuitem':
      for (var b in a)
        (v = a[b]),
          a.hasOwnProperty(b) &&
            v != null &&
            !u.hasOwnProperty(b) &&
            L(l, t, b, null, u, v);
      for (d in u)
        if (
          ((v = u[d]),
          (m = a[d]),
          u.hasOwnProperty(d) && v !== m && (v != null || m != null))
        )
          switch (d) {
            case 'children':
            case 'dangerouslySetInnerHTML':
              if (v != null) throw Error(r(137, t));
              break;
            default:
              L(l, t, d, v, u, m);
          }
      return;
    default:
      if (Hi(t)) {
        for (var z in a)
          (v = a[z]),
            a.hasOwnProperty(z) &&
              v !== void 0 &&
              !u.hasOwnProperty(z) &&
              yi(l, t, z, void 0, u, v);
        for (S in u)
          (v = u[S]),
            (m = a[S]),
            !u.hasOwnProperty(S) ||
              v === m ||
              (v === void 0 && m === void 0) ||
              yi(l, t, S, v, u, m);
        return;
      }
  }
  for (var y in a)
    (v = a[y]),
      a.hasOwnProperty(y) &&
        v != null &&
        !u.hasOwnProperty(y) &&
        L(l, t, y, null, u, v);
  for (g in u)
    (v = u[g]),
      (m = a[g]),
      !u.hasOwnProperty(g) ||
        v === m ||
        (v == null && m == null) ||
        L(l, t, g, v, u, m);
}
function xs(l) {
  switch (l) {
    case 'css':
    case 'script':
    case 'font':
    case 'img':
    case 'image':
    case 'input':
    case 'link':
      return !0;
    default:
      return !1;
  }
}
function Dm() {
  if (typeof performance.getEntriesByType == 'function') {
    for (
      var l = 0, t = 0, a = performance.getEntriesByType('resource'), u = 0;
      u < a.length;
      u++
    ) {
      var e = a[u],
        n = e.transferSize,
        f = e.initiatorType,
        i = e.duration;
      if (n && i && xs(f)) {
        for (f = 0, i = e.responseEnd, u += 1; u < a.length; u++) {
          var c = a[u],
            d = c.startTime;
          if (d > i) break;
          var S = c.transferSize,
            g = c.initiatorType;
          S &&
            xs(g) &&
            ((c = c.responseEnd), (f += S * (c < i ? 1 : (i - d) / (c - d))));
        }
        if ((--u, (t += (8 * (n + f)) / (e.duration / 1e3)), l++, 10 < l))
          break;
      }
    }
    if (0 < l) return t / l / 1e6;
  }
  return navigator.connection &&
    ((l = navigator.connection.downlink), typeof l == 'number')
    ? l
    : 5;
}
var di = null,
  oi = null;
function dn(l) {
  return l.nodeType === 9 ? l : l.ownerDocument;
}
function Rs(l) {
  switch (l) {
    case 'http://www.w3.org/2000/svg':
      return 1;
    case 'http://www.w3.org/1998/Math/MathML':
      return 2;
    default:
      return 0;
  }
}
function Xd(l, t) {
  if (l === 0)
    switch (t) {
      case 'svg':
        return 1;
      case 'math':
        return 2;
      default:
        return 0;
    }
  return l === 1 && t === 'foreignObject' ? 0 : l;
}
function vi(l, t) {
  return (
    l === 'textarea' ||
    l === 'noscript' ||
    typeof t.children == 'string' ||
    typeof t.children == 'number' ||
    typeof t.children == 'bigint' ||
    (typeof t.dangerouslySetInnerHTML == 'object' &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var zf = null;
function Um() {
  var l = window.event;
  return l && l.type === 'popstate'
    ? l === zf
      ? !1
      : ((zf = l), !0)
    : ((zf = null), !1);
}
var Zd = typeof setTimeout == 'function' ? setTimeout : void 0,
  Nm = typeof clearTimeout == 'function' ? clearTimeout : void 0,
  js = typeof Promise == 'function' ? Promise : void 0,
  Hm =
    typeof queueMicrotask == 'function'
      ? queueMicrotask
      : typeof js < 'u'
        ? function (l) {
            return js.resolve(null).then(l).catch(xm);
          }
        : Zd;
function xm(l) {
  setTimeout(function () {
    throw l;
  });
}
function kt(l) {
  return l === 'head';
}
function Bs(l, t) {
  var a = t,
    u = 0;
  do {
    var e = a.nextSibling;
    if ((l.removeChild(a), e && e.nodeType === 8))
      if (((a = e.data), a === '/$' || a === '/&')) {
        if (u === 0) {
          l.removeChild(e), Pa(t);
          return;
        }
        u--;
      } else if (
        a === '$' ||
        a === '$?' ||
        a === '$~' ||
        a === '$!' ||
        a === '&'
      )
        u++;
      else if (a === 'html') ju(l.ownerDocument.documentElement);
      else if (a === 'head') {
        (a = l.ownerDocument.head), ju(a);
        for (var n = a.firstChild; n; ) {
          var f = n.nextSibling,
            i = n.nodeName;
          n[Pu] ||
            i === 'SCRIPT' ||
            i === 'STYLE' ||
            (i === 'LINK' && n.rel.toLowerCase() === 'stylesheet') ||
            a.removeChild(n),
            (n = f);
        }
      } else a === 'body' && ju(l.ownerDocument.body);
    a = e;
  } while (a);
  Pa(t);
}
function Cs(l, t) {
  var a = l;
  l = 0;
  do {
    var u = a.nextSibling;
    if (
      (a.nodeType === 1
        ? t
          ? ((a._stashedDisplay = a.style.display), (a.style.display = 'none'))
          : ((a.style.display = a._stashedDisplay || ''),
            a.getAttribute('style') === '' && a.removeAttribute('style'))
        : a.nodeType === 3 &&
          (t
            ? ((a._stashedText = a.nodeValue), (a.nodeValue = ''))
            : (a.nodeValue = a._stashedText || '')),
      u && u.nodeType === 8)
    )
      if (((a = u.data), a === '/$')) {
        if (l === 0) break;
        l--;
      } else (a !== '$' && a !== '$?' && a !== '$~' && a !== '$!') || l++;
    a = u;
  } while (a);
}
function mi(l) {
  var t = l.firstChild;
  for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
    var a = t;
    switch (((t = t.nextSibling), a.nodeName)) {
      case 'HTML':
      case 'HEAD':
      case 'BODY':
        mi(a), Ni(a);
        continue;
      case 'SCRIPT':
      case 'STYLE':
        continue;
      case 'LINK':
        if (a.rel.toLowerCase() === 'stylesheet') continue;
    }
    l.removeChild(a);
  }
}
function Rm(l, t, a, u) {
  for (; l.nodeType === 1; ) {
    var e = a;
    if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
      if (!u && (l.nodeName !== 'INPUT' || l.type !== 'hidden')) break;
    } else if (u) {
      if (!l[Pu])
        switch (t) {
          case 'meta':
            if (!l.hasAttribute('itemprop')) break;
            return l;
          case 'link':
            if (
              ((n = l.getAttribute('rel')),
              n === 'stylesheet' && l.hasAttribute('data-precedence'))
            )
              break;
            if (
              n !== e.rel ||
              l.getAttribute('href') !==
                (e.href == null || e.href === '' ? null : e.href) ||
              l.getAttribute('crossorigin') !==
                (e.crossOrigin == null ? null : e.crossOrigin) ||
              l.getAttribute('title') !== (e.title == null ? null : e.title)
            )
              break;
            return l;
          case 'style':
            if (l.hasAttribute('data-precedence')) break;
            return l;
          case 'script':
            if (
              ((n = l.getAttribute('src')),
              (n !== (e.src == null ? null : e.src) ||
                l.getAttribute('type') !== (e.type == null ? null : e.type) ||
                l.getAttribute('crossorigin') !==
                  (e.crossOrigin == null ? null : e.crossOrigin)) &&
                n &&
                l.hasAttribute('async') &&
                !l.hasAttribute('itemprop'))
            )
              break;
            return l;
          default:
            return l;
        }
    } else if (t === 'input' && l.type === 'hidden') {
      var n = e.name == null ? null : '' + e.name;
      if (e.type === 'hidden' && l.getAttribute('name') === n) return l;
    } else return l;
    if (((l = $l(l.nextSibling)), l === null)) break;
  }
  return null;
}
function jm(l, t, a) {
  if (t === '') return null;
  for (; l.nodeType !== 3; )
    if (
      ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') &&
        !a) ||
      ((l = $l(l.nextSibling)), l === null)
    )
      return null;
  return l;
}
function Ld(l, t) {
  for (; l.nodeType !== 8; )
    if (
      ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') &&
        !t) ||
      ((l = $l(l.nextSibling)), l === null)
    )
      return null;
  return l;
}
function hi(l) {
  return l.data === '$?' || l.data === '$~';
}
function gi(l) {
  return (
    l.data === '$!' ||
    (l.data === '$?' && l.ownerDocument.readyState !== 'loading')
  );
}
function Bm(l, t) {
  var a = l.ownerDocument;
  if (l.data === '$~') l._reactRetry = t;
  else if (l.data !== '$?' || a.readyState !== 'loading') t();
  else {
    var u = function () {
      t(), a.removeEventListener('DOMContentLoaded', u);
    };
    a.addEventListener('DOMContentLoaded', u), (l._reactRetry = u);
  }
}
function $l(l) {
  for (; l != null; l = l.nextSibling) {
    var t = l.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (
        ((t = l.data),
        t === '$' ||
          t === '$!' ||
          t === '$?' ||
          t === '$~' ||
          t === '&' ||
          t === 'F!' ||
          t === 'F')
      )
        break;
      if (t === '/$' || t === '/&') return null;
    }
  }
  return l;
}
var Si = null;
function qs(l) {
  l = l.nextSibling;
  for (var t = 0; l; ) {
    if (l.nodeType === 8) {
      var a = l.data;
      if (a === '/$' || a === '/&') {
        if (t === 0) return $l(l.nextSibling);
        t--;
      } else
        (a !== '$' && a !== '$!' && a !== '$?' && a !== '$~' && a !== '&') ||
          t++;
    }
    l = l.nextSibling;
  }
  return null;
}
function Ys(l) {
  l = l.previousSibling;
  for (var t = 0; l; ) {
    if (l.nodeType === 8) {
      var a = l.data;
      if (a === '$' || a === '$!' || a === '$?' || a === '$~' || a === '&') {
        if (t === 0) return l;
        t--;
      } else (a !== '/$' && a !== '/&') || t++;
    }
    l = l.previousSibling;
  }
  return null;
}
function Vd(l, t, a) {
  switch (((t = dn(a)), l)) {
    case 'html':
      if (((l = t.documentElement), !l)) throw Error(r(452));
      return l;
    case 'head':
      if (((l = t.head), !l)) throw Error(r(453));
      return l;
    case 'body':
      if (((l = t.body), !l)) throw Error(r(454));
      return l;
    default:
      throw Error(r(451));
  }
}
function ju(l) {
  for (var t = l.attributes; t.length; ) l.removeAttributeNode(t[0]);
  Ni(l);
}
var Wl = new Map(),
  Gs = new Set();
function on(l) {
  return typeof l.getRootNode == 'function'
    ? l.getRootNode()
    : l.nodeType === 9
      ? l
      : l.ownerDocument;
}
var At = Q.d;
Q.d = { f: Cm, r: qm, D: Ym, C: Gm, L: Qm, m: Xm, X: Lm, S: Zm, M: Vm };
function Cm() {
  var l = At.f(),
    t = xn();
  return l || t;
}
function qm(l) {
  var t = au(l);
  t !== null && t.tag === 5 && t.type === 'form' ? qy(t) : At.r(l);
}
var fu = typeof document > 'u' ? null : document;
function Kd(l, t, a) {
  var u = fu;
  if (u && typeof t == 'string' && t) {
    var e = Vl(t);
    (e = 'link[rel="' + l + '"][href="' + e + '"]'),
      typeof a == 'string' && (e += '[crossorigin="' + a + '"]'),
      Gs.has(e) ||
        (Gs.add(e),
        (l = { rel: l, crossOrigin: a, href: t }),
        u.querySelector(e) === null &&
          ((t = u.createElement('link')),
          Sl(t, 'link', l),
          dl(t),
          u.head.appendChild(t)));
  }
}
function Ym(l) {
  At.D(l), Kd('dns-prefetch', l, null);
}
function Gm(l, t) {
  At.C(l, t), Kd('preconnect', l, t);
}
function Qm(l, t, a) {
  At.L(l, t, a);
  var u = fu;
  if (u && l && t) {
    var e = 'link[rel="preload"][as="' + Vl(t) + '"]';
    t === 'image' && a && a.imageSrcSet
      ? ((e += '[imagesrcset="' + Vl(a.imageSrcSet) + '"]'),
        typeof a.imageSizes == 'string' &&
          (e += '[imagesizes="' + Vl(a.imageSizes) + '"]'))
      : (e += '[href="' + Vl(l) + '"]');
    var n = e;
    switch (t) {
      case 'style':
        n = Ia(l);
        break;
      case 'script':
        n = iu(l);
    }
    Wl.has(n) ||
      ((l = F(
        {
          rel: 'preload',
          href: t === 'image' && a && a.imageSrcSet ? void 0 : l,
          as: t
        },
        a
      )),
      Wl.set(n, l),
      u.querySelector(e) !== null ||
        (t === 'style' && u.querySelector(ne(n))) ||
        (t === 'script' && u.querySelector(fe(n))) ||
        ((t = u.createElement('link')),
        Sl(t, 'link', l),
        dl(t),
        u.head.appendChild(t)));
  }
}
function Xm(l, t) {
  At.m(l, t);
  var a = fu;
  if (a && l) {
    var u = t && typeof t.as == 'string' ? t.as : 'script',
      e = 'link[rel="modulepreload"][as="' + Vl(u) + '"][href="' + Vl(l) + '"]',
      n = e;
    switch (u) {
      case 'audioworklet':
      case 'paintworklet':
      case 'serviceworker':
      case 'sharedworker':
      case 'worker':
      case 'script':
        n = iu(l);
    }
    if (
      !Wl.has(n) &&
      ((l = F({ rel: 'modulepreload', href: l }, t)),
      Wl.set(n, l),
      a.querySelector(e) === null)
    ) {
      switch (u) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          if (a.querySelector(fe(n))) return;
      }
      (u = a.createElement('link')),
        Sl(u, 'link', l),
        dl(u),
        a.head.appendChild(u);
    }
  }
}
function Zm(l, t, a) {
  At.S(l, t, a);
  var u = fu;
  if (u && l) {
    var e = Ca(u).hoistableStyles,
      n = Ia(l);
    t = t || 'default';
    var f = e.get(n);
    if (!f) {
      var i = { loading: 0, preload: null };
      if ((f = u.querySelector(ne(n)))) i.loading = 5;
      else {
        (l = F({ rel: 'stylesheet', href: l, 'data-precedence': t }, a)),
          (a = Wl.get(n)) && hc(l, a);
        var c = (f = u.createElement('link'));
        dl(c),
          Sl(c, 'link', l),
          (c._p = new Promise(function (d, S) {
            (c.onload = d), (c.onerror = S);
          })),
          c.addEventListener('load', function () {
            i.loading |= 1;
          }),
          c.addEventListener('error', function () {
            i.loading |= 2;
          }),
          (i.loading |= 4),
          qe(f, t, u);
      }
      (f = { type: 'stylesheet', instance: f, count: 1, state: i }),
        e.set(n, f);
    }
  }
}
function Lm(l, t) {
  At.X(l, t);
  var a = fu;
  if (a && l) {
    var u = Ca(a).hoistableScripts,
      e = iu(l),
      n = u.get(e);
    n ||
      ((n = a.querySelector(fe(e))),
      n ||
        ((l = F({ src: l, async: !0 }, t)),
        (t = Wl.get(e)) && gc(l, t),
        (n = a.createElement('script')),
        dl(n),
        Sl(n, 'link', l),
        a.head.appendChild(n)),
      (n = { type: 'script', instance: n, count: 1, state: null }),
      u.set(e, n));
  }
}
function Vm(l, t) {
  At.M(l, t);
  var a = fu;
  if (a && l) {
    var u = Ca(a).hoistableScripts,
      e = iu(l),
      n = u.get(e);
    n ||
      ((n = a.querySelector(fe(e))),
      n ||
        ((l = F({ src: l, async: !0, type: 'module' }, t)),
        (t = Wl.get(e)) && gc(l, t),
        (n = a.createElement('script')),
        dl(n),
        Sl(n, 'link', l),
        a.head.appendChild(n)),
      (n = { type: 'script', instance: n, count: 1, state: null }),
      u.set(e, n));
  }
}
function Qs(l, t, a, u) {
  var e = (e = qt.current) ? on(e) : null;
  if (!e) throw Error(r(446));
  switch (l) {
    case 'meta':
    case 'title':
      return null;
    case 'style':
      return typeof a.precedence == 'string' && typeof a.href == 'string'
        ? ((t = Ia(a.href)),
          (a = Ca(e).hoistableStyles),
          (u = a.get(t)),
          u ||
            ((u = { type: 'style', instance: null, count: 0, state: null }),
            a.set(t, u)),
          u)
        : { type: 'void', instance: null, count: 0, state: null };
    case 'link':
      if (
        a.rel === 'stylesheet' &&
        typeof a.href == 'string' &&
        typeof a.precedence == 'string'
      ) {
        l = Ia(a.href);
        var n = Ca(e).hoistableStyles,
          f = n.get(l);
        if (
          (f ||
            ((e = e.ownerDocument || e),
            (f = {
              type: 'stylesheet',
              instance: null,
              count: 0,
              state: { loading: 0, preload: null }
            }),
            n.set(l, f),
            (n = e.querySelector(ne(l))) &&
              !n._p &&
              ((f.instance = n), (f.state.loading = 5)),
            Wl.has(l) ||
              ((a = {
                rel: 'preload',
                as: 'style',
                href: a.href,
                crossOrigin: a.crossOrigin,
                integrity: a.integrity,
                media: a.media,
                hrefLang: a.hrefLang,
                referrerPolicy: a.referrerPolicy
              }),
              Wl.set(l, a),
              n || Km(e, l, a, f.state))),
          t && u === null)
        )
          throw Error(r(528, ''));
        return f;
      }
      if (t && u !== null) throw Error(r(529, ''));
      return null;
    case 'script':
      return (
        (t = a.async),
        (a = a.src),
        typeof a == 'string' &&
        t &&
        typeof t != 'function' &&
        typeof t != 'symbol'
          ? ((t = iu(a)),
            (a = Ca(e).hoistableScripts),
            (u = a.get(t)),
            u ||
              ((u = { type: 'script', instance: null, count: 0, state: null }),
              a.set(t, u)),
            u)
          : { type: 'void', instance: null, count: 0, state: null }
      );
    default:
      throw Error(r(444, l));
  }
}
function Ia(l) {
  return 'href="' + Vl(l) + '"';
}
function ne(l) {
  return 'link[rel="stylesheet"][' + l + ']';
}
function Jd(l) {
  return F({}, l, { 'data-precedence': l.precedence, precedence: null });
}
function Km(l, t, a, u) {
  l.querySelector('link[rel="preload"][as="style"][' + t + ']')
    ? (u.loading = 1)
    : ((t = l.createElement('link')),
      (u.preload = t),
      t.addEventListener('load', function () {
        return (u.loading |= 1);
      }),
      t.addEventListener('error', function () {
        return (u.loading |= 2);
      }),
      Sl(t, 'link', a),
      dl(t),
      l.head.appendChild(t));
}
function iu(l) {
  return '[src="' + Vl(l) + '"]';
}
function fe(l) {
  return 'script[async]' + l;
}
function Xs(l, t, a) {
  if ((t.count++, t.instance === null))
    switch (t.type) {
      case 'style':
        var u = l.querySelector('style[data-href~="' + Vl(a.href) + '"]');
        if (u) return (t.instance = u), dl(u), u;
        var e = F({}, a, {
          'data-href': a.href,
          'data-precedence': a.precedence,
          href: null,
          precedence: null
        });
        return (
          (u = (l.ownerDocument || l).createElement('style')),
          dl(u),
          Sl(u, 'style', e),
          qe(u, a.precedence, l),
          (t.instance = u)
        );
      case 'stylesheet':
        e = Ia(a.href);
        var n = l.querySelector(ne(e));
        if (n) return (t.state.loading |= 4), (t.instance = n), dl(n), n;
        (u = Jd(a)),
          (e = Wl.get(e)) && hc(u, e),
          (n = (l.ownerDocument || l).createElement('link')),
          dl(n);
        var f = n;
        return (
          (f._p = new Promise(function (i, c) {
            (f.onload = i), (f.onerror = c);
          })),
          Sl(n, 'link', u),
          (t.state.loading |= 4),
          qe(n, a.precedence, l),
          (t.instance = n)
        );
      case 'script':
        return (
          (n = iu(a.src)),
          (e = l.querySelector(fe(n)))
            ? ((t.instance = e), dl(e), e)
            : ((u = a),
              (e = Wl.get(n)) && ((u = F({}, a)), gc(u, e)),
              (l = l.ownerDocument || l),
              (e = l.createElement('script')),
              dl(e),
              Sl(e, 'link', u),
              l.head.appendChild(e),
              (t.instance = e))
        );
      case 'void':
        return null;
      default:
        throw Error(r(443, t.type));
    }
  else
    t.type === 'stylesheet' &&
      !(t.state.loading & 4) &&
      ((u = t.instance), (t.state.loading |= 4), qe(u, a.precedence, l));
  return t.instance;
}
function qe(l, t, a) {
  for (
    var u = a.querySelectorAll(
        'link[rel="stylesheet"][data-precedence],style[data-precedence]'
      ),
      e = u.length ? u[u.length - 1] : null,
      n = e,
      f = 0;
    f < u.length;
    f++
  ) {
    var i = u[f];
    if (i.dataset.precedence === t) n = i;
    else if (n !== e) break;
  }
  n
    ? n.parentNode.insertBefore(l, n.nextSibling)
    : ((t = a.nodeType === 9 ? a.head : a), t.insertBefore(l, t.firstChild));
}
function hc(l, t) {
  l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
    l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
    l.title == null && (l.title = t.title);
}
function gc(l, t) {
  l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
    l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
    l.integrity == null && (l.integrity = t.integrity);
}
var Ye = null;
function Zs(l, t, a) {
  if (Ye === null) {
    var u = new Map(),
      e = (Ye = new Map());
    e.set(a, u);
  } else (e = Ye), (u = e.get(a)), u || ((u = new Map()), e.set(a, u));
  if (u.has(l)) return u;
  for (
    u.set(l, null), a = a.getElementsByTagName(l), e = 0;
    e < a.length;
    e++
  ) {
    var n = a[e];
    if (
      !(
        n[Pu] ||
        n[ml] ||
        (l === 'link' && n.getAttribute('rel') === 'stylesheet')
      ) &&
      n.namespaceURI !== 'http://www.w3.org/2000/svg'
    ) {
      var f = n.getAttribute(t) || '';
      f = l + f;
      var i = u.get(f);
      i ? i.push(n) : u.set(f, [n]);
    }
  }
  return u;
}
function Ls(l, t, a) {
  (l = l.ownerDocument || l),
    l.head.insertBefore(
      a,
      t === 'title' ? l.querySelector('head > title') : null
    );
}
function Jm(l, t, a) {
  if (a === 1 || t.itemProp != null) return !1;
  switch (l) {
    case 'meta':
    case 'title':
      return !0;
    case 'style':
      if (
        typeof t.precedence != 'string' ||
        typeof t.href != 'string' ||
        t.href === ''
      )
        break;
      return !0;
    case 'link':
      if (
        typeof t.rel != 'string' ||
        typeof t.href != 'string' ||
        t.href === '' ||
        t.onLoad ||
        t.onError
      )
        break;
      switch (t.rel) {
        case 'stylesheet':
          return (l = t.disabled), typeof t.precedence == 'string' && l == null;
        default:
          return !0;
      }
    case 'script':
      if (
        t.async &&
        typeof t.async != 'function' &&
        typeof t.async != 'symbol' &&
        !t.onLoad &&
        !t.onError &&
        t.src &&
        typeof t.src == 'string'
      )
        return !0;
  }
  return !1;
}
function wd(l) {
  return !(l.type === 'stylesheet' && !(l.state.loading & 3));
}
function wm(l, t, a, u) {
  if (
    a.type === 'stylesheet' &&
    (typeof u.media != 'string' || matchMedia(u.media).matches !== !1) &&
    !(a.state.loading & 4)
  ) {
    if (a.instance === null) {
      var e = Ia(u.href),
        n = t.querySelector(ne(e));
      if (n) {
        (t = n._p),
          t !== null &&
            typeof t == 'object' &&
            typeof t.then == 'function' &&
            (l.count++, (l = vn.bind(l)), t.then(l, l)),
          (a.state.loading |= 4),
          (a.instance = n),
          dl(n);
        return;
      }
      (n = t.ownerDocument || t),
        (u = Jd(u)),
        (e = Wl.get(e)) && hc(u, e),
        (n = n.createElement('link')),
        dl(n);
      var f = n;
      (f._p = new Promise(function (i, c) {
        (f.onload = i), (f.onerror = c);
      })),
        Sl(n, 'link', u),
        (a.instance = n);
    }
    l.stylesheets === null && (l.stylesheets = new Map()),
      l.stylesheets.set(a, t),
      (t = a.state.preload) &&
        !(a.state.loading & 3) &&
        (l.count++,
        (a = vn.bind(l)),
        t.addEventListener('load', a),
        t.addEventListener('error', a));
  }
}
var Tf = 0;
function $m(l, t) {
  return (
    l.stylesheets && l.count === 0 && Ge(l, l.stylesheets),
    0 < l.count || 0 < l.imgCount
      ? function (a) {
          var u = setTimeout(function () {
            if ((l.stylesheets && Ge(l, l.stylesheets), l.unsuspend)) {
              var n = l.unsuspend;
              (l.unsuspend = null), n();
            }
          }, 6e4 + t);
          0 < l.imgBytes && Tf === 0 && (Tf = 62500 * Dm());
          var e = setTimeout(
            function () {
              if (
                ((l.waitingForImages = !1),
                l.count === 0 &&
                  (l.stylesheets && Ge(l, l.stylesheets), l.unsuspend))
              ) {
                var n = l.unsuspend;
                (l.unsuspend = null), n();
              }
            },
            (l.imgBytes > Tf ? 50 : 800) + t
          );
          return (
            (l.unsuspend = a),
            function () {
              (l.unsuspend = null), clearTimeout(u), clearTimeout(e);
            }
          );
        }
      : null
  );
}
function vn() {
  if (
    (this.count--,
    this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
  ) {
    if (this.stylesheets) Ge(this, this.stylesheets);
    else if (this.unsuspend) {
      var l = this.unsuspend;
      (this.unsuspend = null), l();
    }
  }
}
var mn = null;
function Ge(l, t) {
  (l.stylesheets = null),
    l.unsuspend !== null &&
      (l.count++, (mn = new Map()), t.forEach(Wm, l), (mn = null), vn.call(l));
}
function Wm(l, t) {
  if (!(t.state.loading & 4)) {
    var a = mn.get(l);
    if (a) var u = a.get(null);
    else {
      (a = new Map()), mn.set(l, a);
      for (
        var e = l.querySelectorAll(
            'link[data-precedence],style[data-precedence]'
          ),
          n = 0;
        n < e.length;
        n++
      ) {
        var f = e[n];
        (f.nodeName === 'LINK' || f.getAttribute('media') !== 'not all') &&
          (a.set(f.dataset.precedence, f), (u = f));
      }
      u && a.set(null, u);
    }
    (e = t.instance),
      (f = e.getAttribute('data-precedence')),
      (n = a.get(f) || u),
      n === u && a.set(null, e),
      a.set(f, e),
      this.count++,
      (u = vn.bind(this)),
      e.addEventListener('load', u),
      e.addEventListener('error', u),
      n
        ? n.parentNode.insertBefore(e, n.nextSibling)
        : ((l = l.nodeType === 9 ? l.head : l),
          l.insertBefore(e, l.firstChild)),
      (t.state.loading |= 4);
  }
}
var Ju = {
  $$typeof: ot,
  Provider: null,
  Consumer: null,
  _currentValue: ea,
  _currentValue2: ea,
  _threadCount: 0
};
function Fm(l, t, a, u, e, n, f, i, c) {
  (this.tag = 1),
    (this.containerInfo = l),
    (this.pingCache = this.current = this.pendingChildren = null),
    (this.timeoutHandle = -1),
    (this.callbackNode =
      this.next =
      this.pendingContext =
      this.context =
      this.cancelPendingCommit =
        null),
    (this.callbackPriority = 0),
    (this.expirationTimes = Ln(-1)),
    (this.entangledLanes =
      this.shellSuspendCounter =
      this.errorRecoveryDisabledLanes =
      this.expiredLanes =
      this.warmLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Ln(0)),
    (this.hiddenUpdates = Ln(null)),
    (this.identifierPrefix = u),
    (this.onUncaughtError = e),
    (this.onCaughtError = n),
    (this.onRecoverableError = f),
    (this.pooledCache = null),
    (this.pooledCacheLanes = 0),
    (this.formState = c),
    (this.incompleteTransitions = new Map());
}
function $d(l, t, a, u, e, n, f, i, c, d, S, g) {
  return (
    (l = new Fm(l, t, a, f, c, d, S, g, i)),
    (t = 1),
    n === !0 && (t |= 24),
    (n = Hl(3, null, null, t)),
    (l.current = n),
    (n.stateNode = l),
    (t = Zi()),
    t.refCount++,
    (l.pooledCache = t),
    t.refCount++,
    (n.memoizedState = { element: u, isDehydrated: a, cache: t }),
    Ki(n),
    l
  );
}
function Wd(l) {
  return l ? ((l = xa), l) : xa;
}
function Fd(l, t, a, u, e, n) {
  (e = Wd(e)),
    u.context === null ? (u.context = e) : (u.pendingContext = e),
    (u = Gt(t)),
    (u.payload = { element: a }),
    (n = n === void 0 ? null : n),
    n !== null && (u.callback = n),
    (a = Qt(l, u, t)),
    a !== null && (_l(a, l, t), Ou(a, l, t));
}
function Vs(l, t) {
  if (((l = l.memoizedState), l !== null && l.dehydrated !== null)) {
    var a = l.retryLane;
    l.retryLane = a !== 0 && a < t ? a : t;
  }
}
function Sc(l, t) {
  Vs(l, t), (l = l.alternate) && Vs(l, t);
}
function kd(l) {
  if (l.tag === 13 || l.tag === 31) {
    var t = Sa(l, 67108864);
    t !== null && _l(t, l, 67108864), Sc(l, 67108864);
  }
}
function Ks(l) {
  if (l.tag === 13 || l.tag === 31) {
    var t = Cl();
    t = Di(t);
    var a = Sa(l, t);
    a !== null && _l(a, l, t), Sc(l, t);
  }
}
var hn = !0;
function km(l, t, a, u) {
  var e = O.T;
  O.T = null;
  var n = Q.p;
  try {
    (Q.p = 2), rc(l, t, a, u);
  } finally {
    (Q.p = n), (O.T = e);
  }
}
function Im(l, t, a, u) {
  var e = O.T;
  O.T = null;
  var n = Q.p;
  try {
    (Q.p = 8), rc(l, t, a, u);
  } finally {
    (Q.p = n), (O.T = e);
  }
}
function rc(l, t, a, u) {
  if (hn) {
    var e = ri(u);
    if (e === null) bf(l, t, u, gn, a), Js(l, u);
    else if (lh(e, l, t, a, u)) u.stopPropagation();
    else if ((Js(l, u), t & 4 && -1 < Pm.indexOf(l))) {
      for (; e !== null; ) {
        var n = au(e);
        if (n !== null)
          switch (n.tag) {
            case 3:
              if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                var f = ta(n.pendingLanes);
                if (f !== 0) {
                  var i = n;
                  for (i.pendingLanes |= 2, i.entangledLanes |= 2; f; ) {
                    var c = 1 << (31 - Bl(f));
                    (i.entanglements[1] |= c), (f &= ~c);
                  }
                  et(n), !(G & 6) && ((en = Rl() + 500), ee(0));
                }
              }
              break;
            case 31:
            case 13:
              (i = Sa(n, 2)), i !== null && _l(i, n, 2), xn(), Sc(n, 2);
          }
        if (((n = ri(u)), n === null && bf(l, t, u, gn, a), n === e)) break;
        e = n;
      }
      e !== null && u.stopPropagation();
    } else bf(l, t, u, null, a);
  }
}
function ri(l) {
  return (l = xi(l)), bc(l);
}
var gn = null;
function bc(l) {
  if (((gn = null), (l = Oa(l)), l !== null)) {
    var t = Wu(l);
    if (t === null) l = null;
    else {
      var a = t.tag;
      if (a === 13) {
        if (((l = S0(t)), l !== null)) return l;
        l = null;
      } else if (a === 31) {
        if (((l = r0(t)), l !== null)) return l;
        l = null;
      } else if (a === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated)
          return t.tag === 3 ? t.stateNode.containerInfo : null;
        l = null;
      } else t !== l && (l = null);
    }
  }
  return (gn = l), null;
}
function Id(l) {
  switch (l) {
    case 'beforetoggle':
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'toggle':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return 2;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return 8;
    case 'message':
      switch (Yo()) {
        case E0:
          return 2;
        case A0:
          return 8;
        case Ve:
        case Go:
          return 32;
        case p0:
          return 268435456;
        default:
          return 32;
      }
    default:
      return 32;
  }
}
var bi = !1,
  Lt = null,
  Vt = null,
  Kt = null,
  wu = new Map(),
  $u = new Map(),
  Ht = [],
  Pm =
    'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
      ' '
    );
function Js(l, t) {
  switch (l) {
    case 'focusin':
    case 'focusout':
      Lt = null;
      break;
    case 'dragenter':
    case 'dragleave':
      Vt = null;
      break;
    case 'mouseover':
    case 'mouseout':
      Kt = null;
      break;
    case 'pointerover':
    case 'pointerout':
      wu.delete(t.pointerId);
      break;
    case 'gotpointercapture':
    case 'lostpointercapture':
      $u.delete(t.pointerId);
  }
}
function mu(l, t, a, u, e, n) {
  return l === null || l.nativeEvent !== n
    ? ((l = {
        blockedOn: t,
        domEventName: a,
        eventSystemFlags: u,
        nativeEvent: n,
        targetContainers: [e]
      }),
      t !== null && ((t = au(t)), t !== null && kd(t)),
      l)
    : ((l.eventSystemFlags |= u),
      (t = l.targetContainers),
      e !== null && t.indexOf(e) === -1 && t.push(e),
      l);
}
function lh(l, t, a, u, e) {
  switch (t) {
    case 'focusin':
      return (Lt = mu(Lt, l, t, a, u, e)), !0;
    case 'dragenter':
      return (Vt = mu(Vt, l, t, a, u, e)), !0;
    case 'mouseover':
      return (Kt = mu(Kt, l, t, a, u, e)), !0;
    case 'pointerover':
      var n = e.pointerId;
      return wu.set(n, mu(wu.get(n) || null, l, t, a, u, e)), !0;
    case 'gotpointercapture':
      return (
        (n = e.pointerId), $u.set(n, mu($u.get(n) || null, l, t, a, u, e)), !0
      );
  }
  return !1;
}
function Pd(l) {
  var t = Oa(l.target);
  if (t !== null) {
    var a = Wu(t);
    if (a !== null) {
      if (((t = a.tag), t === 13)) {
        if (((t = S0(a)), t !== null)) {
          (l.blockedOn = t),
            Nc(l.priority, function () {
              Ks(a);
            });
          return;
        }
      } else if (t === 31) {
        if (((t = r0(a)), t !== null)) {
          (l.blockedOn = t),
            Nc(l.priority, function () {
              Ks(a);
            });
          return;
        }
      } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
        l.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
        return;
      }
    }
  }
  l.blockedOn = null;
}
function Qe(l) {
  if (l.blockedOn !== null) return !1;
  for (var t = l.targetContainers; 0 < t.length; ) {
    var a = ri(l.nativeEvent);
    if (a === null) {
      a = l.nativeEvent;
      var u = new a.constructor(a.type, a);
      (qf = u), a.target.dispatchEvent(u), (qf = null);
    } else return (t = au(a)), t !== null && kd(t), (l.blockedOn = a), !1;
    t.shift();
  }
  return !0;
}
function ws(l, t, a) {
  Qe(l) && a.delete(t);
}
function th() {
  (bi = !1),
    Lt !== null && Qe(Lt) && (Lt = null),
    Vt !== null && Qe(Vt) && (Vt = null),
    Kt !== null && Qe(Kt) && (Kt = null),
    wu.forEach(ws),
    $u.forEach(ws);
}
function Ae(l, t) {
  l.blockedOn === t &&
    ((l.blockedOn = null),
    bi ||
      ((bi = !0),
      cl.unstable_scheduleCallback(cl.unstable_NormalPriority, th)));
}
var pe = null;
function $s(l) {
  pe !== l &&
    ((pe = l),
    cl.unstable_scheduleCallback(cl.unstable_NormalPriority, function () {
      pe === l && (pe = null);
      for (var t = 0; t < l.length; t += 3) {
        var a = l[t],
          u = l[t + 1],
          e = l[t + 2];
        if (typeof u != 'function') {
          if (bc(u || a) === null) continue;
          break;
        }
        var n = au(a);
        n !== null &&
          (l.splice(t, 3),
          (t -= 3),
          Pf(n, { pending: !0, data: e, method: a.method, action: u }, u, e));
      }
    }));
}
function Pa(l) {
  function t(c) {
    return Ae(c, l);
  }
  Lt !== null && Ae(Lt, l),
    Vt !== null && Ae(Vt, l),
    Kt !== null && Ae(Kt, l),
    wu.forEach(t),
    $u.forEach(t);
  for (var a = 0; a < Ht.length; a++) {
    var u = Ht[a];
    u.blockedOn === l && (u.blockedOn = null);
  }
  for (; 0 < Ht.length && ((a = Ht[0]), a.blockedOn === null); )
    Pd(a), a.blockedOn === null && Ht.shift();
  if (((a = (l.ownerDocument || l).$$reactFormReplay), a != null))
    for (u = 0; u < a.length; u += 3) {
      var e = a[u],
        n = a[u + 1],
        f = e[Ol] || null;
      if (typeof n == 'function') f || $s(a);
      else if (f) {
        var i = null;
        if (n && n.hasAttribute('formAction')) {
          if (((e = n), (f = n[Ol] || null))) i = f.formAction;
          else if (bc(e) !== null) continue;
        } else i = f.action;
        typeof i == 'function' ? (a[u + 1] = i) : (a.splice(u, 3), (u -= 3)),
          $s(a);
      }
    }
}
function lo() {
  function l(n) {
    n.canIntercept &&
      n.info === 'react-transition' &&
      n.intercept({
        handler: function () {
          return new Promise(function (f) {
            return (e = f);
          });
        },
        focusReset: 'manual',
        scroll: 'manual'
      });
  }
  function t() {
    e !== null && (e(), (e = null)), u || setTimeout(a, 20);
  }
  function a() {
    if (!u && !navigation.transition) {
      var n = navigation.currentEntry;
      n &&
        n.url != null &&
        navigation.navigate(n.url, {
          state: n.getState(),
          info: 'react-transition',
          history: 'replace'
        });
    }
  }
  if (typeof navigation == 'object') {
    var u = !1,
      e = null;
    return (
      navigation.addEventListener('navigate', l),
      navigation.addEventListener('navigatesuccess', t),
      navigation.addEventListener('navigateerror', t),
      setTimeout(a, 100),
      function () {
        (u = !0),
          navigation.removeEventListener('navigate', l),
          navigation.removeEventListener('navigatesuccess', t),
          navigation.removeEventListener('navigateerror', t),
          e !== null && (e(), (e = null));
      }
    );
  }
}
function zc(l) {
  this._internalRoot = l;
}
Bn.prototype.render = zc.prototype.render = function (l) {
  var t = this._internalRoot;
  if (t === null) throw Error(r(409));
  var a = t.current,
    u = Cl();
  Fd(a, u, l, t, null, null);
};
Bn.prototype.unmount = zc.prototype.unmount = function () {
  var l = this._internalRoot;
  if (l !== null) {
    this._internalRoot = null;
    var t = l.containerInfo;
    Fd(l.current, 2, null, l, null, null), xn(), (t[tu] = null);
  }
};
function Bn(l) {
  this._internalRoot = l;
}
Bn.prototype.unstable_scheduleHydration = function (l) {
  if (l) {
    var t = U0();
    l = { blockedOn: null, target: l, priority: t };
    for (var a = 0; a < Ht.length && t !== 0 && t < Ht[a].priority; a++);
    Ht.splice(a, 0, l), a === 0 && Pd(l);
  }
};
var Ws = h0.version;
if (Ws !== '19.2.8') throw Error(r(527, Ws, '19.2.8'));
Q.findDOMNode = function (l) {
  var t = l._reactInternals;
  if (t === void 0)
    throw typeof l.render == 'function'
      ? Error(r(188))
      : ((l = Object.keys(l).join(',')), Error(r(268, l)));
  return (
    (l = Ho(t)),
    (l = l !== null ? b0(l) : null),
    (l = l === null ? null : l.stateNode),
    l
  );
};
var ah = {
  bundleType: 0,
  version: '19.2.8',
  rendererPackageName: 'react-dom',
  currentDispatcherRef: O,
  reconcilerVersion: '19.2.8'
};
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
  var _e = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!_e.isDisabled && _e.supportsFiber)
    try {
      (Fu = _e.inject(ah)), (jl = _e);
    } catch {}
}
rn.createRoot = function (l, t) {
  if (!g0(l)) throw Error(r(299));
  var a = !1,
    u = '',
    e = Ky,
    n = Jy,
    f = wy;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (a = !0),
      t.identifierPrefix !== void 0 && (u = t.identifierPrefix),
      t.onUncaughtError !== void 0 && (e = t.onUncaughtError),
      t.onCaughtError !== void 0 && (n = t.onCaughtError),
      t.onRecoverableError !== void 0 && (f = t.onRecoverableError)),
    (t = $d(l, 1, !1, null, null, a, u, null, e, n, f, lo)),
    (l[tu] = t.current),
    mc(l),
    new zc(t)
  );
};
rn.hydrateRoot = function (l, t, a) {
  if (!g0(l)) throw Error(r(299));
  var u = !1,
    e = '',
    n = Ky,
    f = Jy,
    i = wy,
    c = null;
  return (
    a != null &&
      (a.unstable_strictMode === !0 && (u = !0),
      a.identifierPrefix !== void 0 && (e = a.identifierPrefix),
      a.onUncaughtError !== void 0 && (n = a.onUncaughtError),
      a.onCaughtError !== void 0 && (f = a.onCaughtError),
      a.onRecoverableError !== void 0 && (i = a.onRecoverableError),
      a.formState !== void 0 && (c = a.formState)),
    (t = $d(l, 1, !0, t, a ?? null, u, e, c, n, f, i, lo)),
    (t.context = Wd(null)),
    (a = t.current),
    (u = Cl()),
    (u = Di(u)),
    (e = Gt(u)),
    (e.callback = null),
    Qt(a, e, u),
    (a = u),
    (t.current.lanes = a),
    Iu(t, a),
    et(t),
    (l[tu] = t.current),
    mc(l),
    new Bn(t)
  );
};
rn.version = '19.2.8';
function to() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(to);
    } catch (l) {
      console.error(l);
    }
}
to(), (s0.exports = rn);
var uh = s0.exports;
const zu = {
    title: 'What kind of AI builder does your team need?',
    subtitle:
      'Answer 3 taps to get an AI-builder role match for your team — with an instant, shareable plan.',
    hint: 'No form. No sales call. Just a quiz.',
    questions: [
      {
        id: 'industry',
        ask: 'What industry is your team in?',
        field: 'industry',
        options: [
          { label: 'Retail / E-commerce', value: 'retail' },
          { label: 'Finance / Insurtech', value: 'finance' },
          { label: 'Healthcare / Life sciences', value: 'healthcare' },
          { label: 'Industrial / Logistics', value: 'industrial' },
          { label: 'Media / SaaS', value: 'media' },
          { label: 'Other', value: 'other' }
        ]
      },
      {
        id: 'intent',
        ask: 'What should the AI do?',
        field: 'intent',
        options: [
          { label: 'Automate busywork', value: 'automate' },
          { label: 'Connect our systems', value: 'integrate' },
          { label: 'Build a customer-facing feature', value: 'feature' },
          { label: 'Fix something slow / costly', value: 'optimize' },
          { label: "Explore what's possible", value: 'explore' }
        ]
      },
      {
        id: 'urgency',
        ask: "What's the timeline?",
        field: 'urgency',
        options: [
          { label: 'This quarter', value: 'now' },
          { label: 'Next 6 months', value: 'soon' },
          { label: 'Planning ahead', value: 'plan' },
          { label: 'Just curious', value: 'curious' }
        ]
      }
    ]
  },
  Fs = {
    retail: {
      lens: 'Growth Engineer',
      experience:
        '20+ delivered websites/webshops — fast customer-facing builds that convert.'
    },
    finance: {
      lens: 'Risk & Efficiency Engineer',
      experience:
        'Three internal systems + two ERP/AI integration projects — clean, auditable automation.'
    },
    healthcare: {
      lens: 'Workflow Automaton Designer',
      experience:
        'Repairing an inherited AI-first service cut its LLM API costs by roughly 40% — same cost-discipline applies to regulated workflows.'
    },
    industrial: {
      lens: 'Integration Engineer',
      experience:
        'Two ERP/AI integration projects — connecting systems that were never meant to talk.'
    },
    media: {
      lens: 'Feature Builder',
      experience:
        'One user-facing platform + AgentSec Suite — polished, demo-ready customer-facing AI.'
    },
    other: {
      lens: 'Generalist AI Builder',
      experience:
        'Three internal systems + 20+ websites/webshops — adaptable to any stack.'
    }
  },
  ks = {
    automate: {
      project: 'Task-to-Flow style automations',
      sketch: [
        'Map the busiest recurring task to a deterministic, auditable flow.',
        'Ship a 3-tap self-service for the team to trigger/replay actions.',
        'Layer a tiny AI gate on expensive LLM calls to keep costs flat.'
      ]
    },
    integrate: {
      project: 'ERP/AI connection layer',
      sketch: [
        'Audit the two systems that waste the most manual copy-paste today.',
        'Build a one-direction sync first, surface diffs before any write.',
        'Add an illustrative plan card the team can sign off before full rollout.'
      ]
    },
    feature: {
      project: 'Customer-facing AI feature (AgentSec-style)',
      sketch: [
        'Start a Next.js + Tailwind static demo in <1 sprint to validate the interaction.',
        'Ship a single guardrail first (prompt-shield style) then expand.',
        'Use a deterministic preview card so non-devs can see the result instantly.'
      ]
    },
    optimize: {
      project: 'Inherited AI service cost-cut',
      sketch: [
        'Trace the highest-cost LLM calls — usually retries + redundant routing.',
        'Insert a deterministic router/cache to cut spend by roughly 40%.',
        "Hand the team a one-line 'why this fits' card for internal pushback."
      ]
    },
    explore: {
      project: 'Prototype playground (VoidArch-style)',
      sketch: [
        'Frame the idea as a 3-tap quiz so stakeholders can play before committing.',
        "Build one concrete 'aha' screen, not a feature list.",
        'Export a shareable plan card so the conversation has a durable artifact.'
      ]
    }
  },
  Is = {
    now: 'fast (demo first week)',
    soon: 'balanced (MVP in 2-3 sprints)',
    plan: 'planned (proof-of-concept first)',
    curious: 'exploratory (prototype-first)'
  };
function eh({ answers: l, onRestart: t, prefilledField: a = null }) {
  const [u, e] = Ul.useState('idle'),
    n = Ul.useRef(null),
    f = (b) => {
      const z = zu.questions.find((s) => s.field === b),
        y = z && z.options.find((s) => s.value === l[b]);
      return y ? y.label : l[b];
    },
    i = (b) => `${f(b)}${a === b ? ' · prefilled' : ''}`,
    c = Fs[l.industry] || Fs.other,
    d = ks[l.intent] || ks.explore,
    S = Is[l.urgency] || Is.plan,
    g = "Based on your answers — here's the David-shaped solution",
    v = nh(l);
  function m() {
    E();
    const b = document.createElement('a');
    (b.href = n.current.toDataURL('image/png')),
      (b.download = 'rolefit-summary.png'),
      b.click();
  }
  function E() {
    e('generating');
    const b = n.current;
    if (!b) {
      e('idle');
      return;
    }
    const z = b.getContext('2d'),
      y = b.width,
      s = b.height,
      o = z.createLinearGradient(0, 0, 0, s);
    o.addColorStop(0, '#0b0c10'),
      o.addColorStop(1, '#16202c'),
      (z.fillStyle = o),
      z.fillRect(0, 0, y, s);
    const h = 44;
    let T = h + 6;
    (z.textBaseline = 'top'),
      (z.font =
        "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#ffffff'),
      (z.textAlign = 'left'),
      Af(z, g, h, T, y - h * 2, 30),
      (T += Ef(z, g, y - h * 2, 30) + 18),
      (z.font =
        "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#3b82f6'),
      z.fillText(`Role lens: ${c.lens}`, h, T),
      (T += 26),
      (z.font =
        "15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#cbd5e1'),
      Af(z, `Experience: ${c.experience}`, h, T, y - h * 2, 22),
      (T += Ef(z, c.experience, y - h * 2, 22) + 16),
      (z.font =
        "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#ffffff'),
      z.fillText(`Project: ${d.project}`, h, T),
      (T += 26),
      (z.font =
        "15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#e2e8f0'),
      d.sketch.forEach((A, M) => {
        z.fillText(`• ${A} (illustrative plan)`, h, T), (T += 22);
      }),
      (T += 14),
      (z.font =
        "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#94a3b8'),
      Af(
        z,
        `Your picks: ${i('industry')} → ${i('intent')} → ${i('urgency')}`,
        h,
        T,
        y - h * 2,
        18
      ),
      (T += Ef(z, i('intent'), y - h * 2, 18) + 14),
      (z.font =
        "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#60a5fa'),
      (z.textAlign = 'right'),
      z.fillText(`Fit score: ${v}% (deterministic)`, y - h, T),
      (z.textAlign = 'left'),
      (T = s - h - 4),
      (z.font =
        "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (z.fillStyle = '#475569'),
      (z.textAlign = 'center'),
      z.fillText(
        `David Papp — AI Solutions Developer (WEBINFORM IT Ltd, Oct 2024)
Prototype — illustrative plan`,
        y / 2,
        T
      ),
      e('done');
  }
  return _.jsxs('div', {
    className: 'flex flex-col gap-4',
    children: [
      _.jsx('div', {
        className: 'bubble bubble-bot text-[14px]',
        dangerouslySetInnerHTML: { __html: `<strong>${g}</strong>` }
      }),
      _.jsxs('div', {
        className:
          'rounded-[18px] bg-[#0f131a] border border-[#222a38] p-4 text-[15px] space-y-3',
        children: [
          _.jsxs('div', {
            children: [
              _.jsx('span', {
                className: 'text-[#3b82f6] font-medium',
                children: 'Role lens:'
              }),
              ' ',
              _.jsx('span', { className: 'text-[#e6e7ea]', children: c.lens })
            ]
          }),
          _.jsxs('div', {
            children: [
              _.jsx('span', {
                className: 'text-[#94a3b8]',
                children: 'Relevant experience:'
              }),
              ' ',
              _.jsx('span', {
                className: 'text-[#e6e7ea]',
                children: c.experience
              })
            ]
          }),
          _.jsxs('div', {
            children: [
              _.jsx('span', {
                className: 'text-[#3b82f6] font-medium',
                children: 'Matching project:'
              }),
              ' ',
              _.jsx('span', {
                className: 'text-[#e6e7ea]',
                children: d.project
              })
            ]
          }),
          _.jsxs('div', {
            className: 'pt-1',
            children: [
              _.jsxs('div', {
                className:
                  'flex items-baseline gap-2 text-[13px] text-[#94a3b8]',
                children: [
                  _.jsx('span', {
                    className: 'text-[#60a5fa] font-medium',
                    children: 'Illustrative plan'
                  }),
                  _.jsxs('span', {
                    children: ['(fit ', v, '% • delivery ', S, ')']
                  })
                ]
              }),
              _.jsx('ul', {
                className: 'mt-1 list-none space-y-1.5 pl-0',
                children: d.sketch.map((b, z) =>
                  _.jsxs(
                    'li',
                    {
                      className: 'flex gap-2 text-[#cbd5e1]',
                      children: [
                        _.jsx('span', {
                          className: 'text-[#3b82f6]',
                          children: '•'
                        }),
                        _.jsx('span', { children: b })
                      ]
                    },
                    z
                  )
                )
              })
            ]
          }),
          _.jsxs('div', {
            className:
              'border-t border-[#222a38] pt-3 text-[13px] text-[#94a3b8]',
            children: [
              'Your picks verbatim:',
              ' ',
              _.jsxs('span', {
                className: 'text-[#e6e7ea]',
                children: [
                  i('industry'),
                  ' → ',
                  i('intent'),
                  ' →',
                  ' ',
                  i('urgency')
                ]
              })
            ]
          }),
          _.jsxs('div', {
            className: 'border-t border-[#222a38] pt-3 text-[13px]',
            children: [
              _.jsx('span', {
                className: 'text-[#94a3b8]',
                children: 'Delivery stack:'
              }),
              ' ',
              _.jsx('span', {
                className: 'text-[#e6e7ea]',
                children:
                  'Next.js · TypeScript · Prisma · Clerk · Supabase · Tailwind'
              }),
              _.jsxs('div', {
                className: 'mt-1',
                children: [
                  _.jsx('span', {
                    className: 'text-[#94a3b8]',
                    children: 'Live demo:'
                  }),
                  ' ',
                  _.jsx('span', {
                    className: 'text-[#3b82f6] underline',
                    children: _.jsx('a', {
                      href: 'https://promptshield-cyan.vercel.app',
                      target: '_blank',
                      rel: 'noreferrer',
                      children: 'AgentSec Suite'
                    })
                  })
                ]
              }),
              _.jsx('div', {
                className: 'mt-1 text-[#94a3b8]',
                children: 'Personal projects are prototypes, never production.'
              })
            ]
          })
        ]
      }),
      _.jsxs('div', {
        className: 'flex flex-col gap-2',
        children: [
          _.jsx('button', {
            onClick: m,
            disabled: u === 'generating',
            className: 'chip border-[#3b82f6] text-[#3b82f6]',
            children:
              u === 'generating' ? 'Generating…' : 'Download share card (PNG)'
          }),
          _.jsx('a', {
            href: 'mailto:david@pappdavid.dev',
            className: 'chip justify-center border-[#2a2f3a] text-[#94a3b8]',
            children: 'Talk to an AI builder'
          }),
          _.jsx('button', {
            onClick: t,
            className: 'chip border-[#2a2f3a] text-[#94a3b8]',
            children: 'Take quiz again'
          })
        ]
      }),
      _.jsx('canvas', {
        ref: n,
        width: 1080,
        height: 1350,
        className: 'hidden'
      })
    ]
  });
}
function Ef(l, t, a, u) {
  return ao(l, t, a).length * u;
}
function ao(l, t, a) {
  const u = t.split(/\s+/),
    e = [];
  let n = '';
  for (const f of u) {
    const i = n ? n + ' ' + f : f;
    l.measureText(i).width > a && n ? (e.push(n), (n = f)) : (n = i);
  }
  return n && e.push(n), e;
}
function Af(l, t, a, u, e, n) {
  ao(l, t, e).forEach((i, c) => l.fillText(i, a, u + c * n));
}
function nh(l) {
  const t = {
      industry: {
        retail: 92,
        finance: 88,
        healthcare: 85,
        industrial: 90,
        media: 95,
        other: 80
      },
      intent: {
        automate: 88,
        integrate: 91,
        feature: 94,
        optimize: 96,
        explore: 78
      },
      urgency: { now: 85, soon: 92, plan: 90, curious: 75 }
    },
    a = t.industry[l.industry] || 80,
    u = t.intent[l.intent] || 80,
    e = t.urgency[l.urgency] || 80;
  return Math.round(a * 0.3 + u * 0.5 + e * 0.2);
}
function fh({ initialIntent: l = null }) {
  const t = zu.questions,
    [a, u] = Ul.useState(0),
    [e, n] = Ul.useState(() => ({ industry: null, intent: l, urgency: null })),
    [f, i] = Ul.useState(() => {
      if (!l) return {};
      const b = t.find((y) => y.field === 'intent'),
        z = b && b.options.find((y) => y.value === l);
      return z ? { intent: z.label } : {};
    }),
    [c, d] = Ul.useState([]);
  function S(b, z) {
    n((o) => ({ ...o, [b]: z }));
    const y = t.find((o) => o.field === b),
      s = y && y.options.find((o) => o.value === z);
    s && i((o) => ({ ...o, [b]: s.label }));
  }
  function g() {
    u((b) => b + 1);
  }
  const v = Ul.useRef(new Set());
  Ul.useEffect(() => {
    const b = t[a - 1];
    if (b && e[b.field] && !v.current.has(b.id)) {
      v.current.add(b.id), u((z) => z + 1);
      return;
    }
    if (a > 0 && a <= t.length) {
      const z = t[a - 1];
      d((y) =>
        [...y].reverse().find((o) => o.who === 'bot' && o.q === z.id)
          ? y
          : [...y, { who: 'bot', text: z.ask, q: z.id, chips: z.options }]
      );
    }
  }, [a]),
    Ul.useEffect(() => {
      a === t.length + 1 &&
        e.industry &&
        e.intent &&
        e.urgency &&
        u(t.length + 2);
    }, [a, e, t.length]);
  function m() {
    u(0),
      n((b) => ({ ...b, industry: null, intent: null, urgency: null })),
      i({}),
      d([]);
  }
  function E() {
    if (a === 0)
      return _.jsxs('div', {
        className: 'flex flex-col items-center gap-4 text-center',
        children: [
          _.jsx('div', {
            className: 'text-[22px] font-semibold leading-tight',
            children: zu.title
          }),
          _.jsx('div', {
            className: 'text-[15px] text-[#9aa0ad]',
            children: zu.subtitle
          }),
          _.jsx('button', {
            onClick: () => u(1),
            className: 'chip w-full border-[#3b82f6] text-[#3b82f6]',
            children: 'Start Quiz'
          }),
          _.jsx('div', {
            className: 'text-[12px] text-[#5e6269]',
            children: zu.hint
          })
        ]
      });
    if (a >= 1 && a <= t.length) {
      const b = t[a - 1],
        z = b.field,
        y = e[z];
      return _.jsxs('div', {
        className: 'flex flex-col gap-4',
        children: [
          _.jsx('div', { className: 'bubble bubble-bot', children: b.ask }),
          _.jsx('div', {
            className: 'flex flex-wrap gap-2',
            children: b.options.map((s) =>
              _.jsx(
                'button',
                {
                  onClick: () => {
                    S(z, s.value), g();
                  },
                  className: `chip ${y === s.value ? 'selected' : ''}`,
                  children: s.label
                },
                s.value
              )
            )
          }),
          f[z] &&
            _.jsx('div', {
              className: 'bubble bubble-human self-end',
              children: f[z]
            })
        ]
      });
    }
    if (a === t.length + 1)
      return _.jsx('div', {
        className: 'bubble bubble-bot',
        children: 'Let me find the right fit…'
      });
    if (a === t.length + 2)
      return _.jsx(eh, {
        answers: e,
        onRestart: m,
        prefilledField: l ? 'intent' : null
      });
  }
  return _.jsx('div', {
    className: 'space-y-3',
    children: _.jsx('div', { className: 'h-1 transition-all', children: E() })
  });
}
const Ps = {
  automation: 'automate',
  'ai-integration': 'integrate',
  'ai-engineering': 'feature',
  'product-engineering': 'feature'
};
function ih() {
  try {
    const l = new URLSearchParams(window.location.search).get('role');
    return l && Ps[l] ? Ps[l] : null;
  } catch {
    return null;
  }
}
function ch() {
  const [l] = Ul.useState(ih);
  return _.jsx('div', {
    className: 'mx-auto max-w-[390px] px-3 pt-4 pb-8',
    children: _.jsx(fh, { initialIntent: l })
  });
}
uh.createRoot(document.getElementById('root')).render(
  _.jsx(po.StrictMode, { children: _.jsx(ch, {}) })
);
