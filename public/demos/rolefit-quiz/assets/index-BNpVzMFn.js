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
function uv(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, 'default')
    ? l.default
    : l;
}
var Ps = { exports: {} },
  Sn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ev = Symbol.for('react.transitional.element'),
  nv = Symbol.for('react.fragment');
function l0(l, t, a) {
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
    { $$typeof: ev, type: l, key: u, ref: t !== void 0 ? t : null, props: a }
  );
}
Sn.Fragment = nv;
Sn.jsx = l0;
Sn.jsxs = l0;
Ps.exports = Sn;
var p = Ps.exports,
  t0 = { exports: {} },
  O = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var zi = Symbol.for('react.transitional.element'),
  fv = Symbol.for('react.portal'),
  iv = Symbol.for('react.fragment'),
  cv = Symbol.for('react.strict_mode'),
  sv = Symbol.for('react.profiler'),
  yv = Symbol.for('react.consumer'),
  dv = Symbol.for('react.context'),
  vv = Symbol.for('react.forward_ref'),
  ov = Symbol.for('react.suspense'),
  mv = Symbol.for('react.memo'),
  a0 = Symbol.for('react.lazy'),
  hv = Symbol.for('react.activity'),
  Ec = Symbol.iterator;
function gv(l) {
  return l === null || typeof l != 'object'
    ? null
    : ((l = (Ec && l[Ec]) || l['@@iterator']),
      typeof l == 'function' ? l : null);
}
var u0 = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {}
  },
  e0 = Object.assign,
  n0 = {};
function lu(l, t, a) {
  (this.props = l),
    (this.context = t),
    (this.refs = n0),
    (this.updater = a || u0);
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
function f0() {}
f0.prototype = lu.prototype;
function Ti(l, t, a) {
  (this.props = l),
    (this.context = t),
    (this.refs = n0),
    (this.updater = a || u0);
}
var Ei = (Ti.prototype = new f0());
Ei.constructor = Ti;
e0(Ei, lu.prototype);
Ei.isPureReactComponent = !0;
var Ac = Array.isArray;
function pf() {}
var W = { H: null, A: null, T: null, S: null },
  i0 = Object.prototype.hasOwnProperty;
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
function Sv(l, t) {
  return Ai(l.type, t, l.props);
}
function pi(l) {
  return typeof l == 'object' && l !== null && l.$$typeof === zi;
}
function rv(l) {
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
    ? rv('' + l.key)
    : t.toString(36);
}
function bv(l) {
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
          case fv:
            f = !0;
            break;
          case a0:
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
          Ta(e, t, a, '', function (o) {
            return o;
          }))
        : e != null &&
          (pi(e) &&
            (e = Sv(
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
  else if (((c = gv(l)), typeof c == 'function'))
    for (l = c.call(l), c = 0; !(u = l.next()).done; )
      (u = u.value), (n = i + Yn(u, c++)), (f += Ta(u, t, a, n, e));
  else if (n === 'object') {
    if (typeof l.then == 'function') return Ta(bv(l), t, a, u, e);
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
function se(l, t, a) {
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
function zv(l) {
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
  Tv = {
    map: se,
    forEach: function (l, t, a) {
      se(
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
        se(l, function () {
          t++;
        }),
        t
      );
    },
    toArray: function (l) {
      return (
        se(l, function (t) {
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
O.Activity = hv;
O.Children = Tv;
O.Component = lu;
O.Fragment = iv;
O.Profiler = sv;
O.PureComponent = Ti;
O.StrictMode = cv;
O.Suspense = ov;
O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = W;
O.__COMPILER_RUNTIME = {
  __proto__: null,
  c: function (l) {
    return W.H.useMemoCache(l);
  }
};
O.cache = function (l) {
  return function () {
    return l.apply(null, arguments);
  };
};
O.cacheSignal = function () {
  return null;
};
O.cloneElement = function (l, t, a) {
  if (l == null)
    throw Error(
      'The argument must be a React element, but you passed ' + l + '.'
    );
  var u = e0({}, l.props),
    e = l.key;
  if (t != null)
    for (n in (t.key !== void 0 && (e = '' + t.key), t))
      !i0.call(t, n) ||
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
O.createContext = function (l) {
  return (
    (l = {
      $$typeof: dv,
      _currentValue: l,
      _currentValue2: l,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }),
    (l.Provider = l),
    (l.Consumer = { $$typeof: yv, _context: l }),
    l
  );
};
O.createElement = function (l, t, a) {
  var u,
    e = {},
    n = null;
  if (t != null)
    for (u in (t.key !== void 0 && (n = '' + t.key), t))
      i0.call(t, u) &&
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
O.createRef = function () {
  return { current: null };
};
O.forwardRef = function (l) {
  return { $$typeof: vv, render: l };
};
O.isValidElement = pi;
O.lazy = function (l) {
  return { $$typeof: a0, _payload: { _status: -1, _result: l }, _init: zv };
};
O.memo = function (l, t) {
  return { $$typeof: mv, type: l, compare: t === void 0 ? null : t };
};
O.startTransition = function (l) {
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
O.unstable_useCacheRefresh = function () {
  return W.H.useCacheRefresh();
};
O.use = function (l) {
  return W.H.use(l);
};
O.useActionState = function (l, t, a) {
  return W.H.useActionState(l, t, a);
};
O.useCallback = function (l, t) {
  return W.H.useCallback(l, t);
};
O.useContext = function (l) {
  return W.H.useContext(l);
};
O.useDebugValue = function () {};
O.useDeferredValue = function (l, t) {
  return W.H.useDeferredValue(l, t);
};
O.useEffect = function (l, t) {
  return W.H.useEffect(l, t);
};
O.useEffectEvent = function (l) {
  return W.H.useEffectEvent(l);
};
O.useId = function () {
  return W.H.useId();
};
O.useImperativeHandle = function (l, t, a) {
  return W.H.useImperativeHandle(l, t, a);
};
O.useInsertionEffect = function (l, t) {
  return W.H.useInsertionEffect(l, t);
};
O.useLayoutEffect = function (l, t) {
  return W.H.useLayoutEffect(l, t);
};
O.useMemo = function (l, t) {
  return W.H.useMemo(l, t);
};
O.useOptimistic = function (l, t) {
  return W.H.useOptimistic(l, t);
};
O.useReducer = function (l, t, a) {
  return W.H.useReducer(l, t, a);
};
O.useRef = function (l) {
  return W.H.useRef(l);
};
O.useState = function (l) {
  return W.H.useState(l);
};
O.useSyncExternalStore = function (l, t, a) {
  return W.H.useSyncExternalStore(l, t, a);
};
O.useTransition = function () {
  return W.H.useTransition();
};
O.version = '19.2.8';
t0.exports = O;
var Il = t0.exports;
const Ev = uv(Il);
var c0 = { exports: {} },
  rn = {},
  s0 = { exports: {} },
  y0 = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (l) {
  function t(T, x) {
    var H = T.length;
    T.push(x);
    l: for (; 0 < H; ) {
      var ll = (H - 1) >>> 1,
        sl = T[ll];
      if (0 < e(sl, x)) (T[ll] = x), (T[H] = sl), (H = ll);
      else break l;
    }
  }
  function a(T) {
    return T.length === 0 ? null : T[0];
  }
  function u(T) {
    if (T.length === 0) return null;
    var x = T[0],
      H = T.pop();
    if (H !== x) {
      T[0] = H;
      l: for (var ll = 0, sl = T.length, fe = sl >>> 1; ll < fe; ) {
        var ie = 2 * (ll + 1) - 1,
          qn = T[ie],
          It = ie + 1,
          ce = T[It];
        if (0 > e(qn, H))
          It < sl && 0 > e(ce, qn)
            ? ((T[ll] = ce), (T[It] = H), (ll = It))
            : ((T[ll] = qn), (T[ie] = H), (ll = ie));
        else if (It < sl && 0 > e(ce, H)) (T[ll] = ce), (T[It] = H), (ll = It);
        else break l;
      }
    }
    return x;
  }
  function e(T, x) {
    var H = T.sortIndex - x.sortIndex;
    return H !== 0 ? H : T.id - x.id;
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
    o = [],
    g = 1,
    h = null,
    d = 3,
    v = !1,
    b = !1,
    E = !1,
    R = !1,
    y = typeof setTimeout == 'function' ? setTimeout : null,
    s = typeof clearTimeout == 'function' ? clearTimeout : null,
    m = typeof setImmediate < 'u' ? setImmediate : null;
  function S(T) {
    for (var x = a(o); x !== null; ) {
      if (x.callback === null) u(o);
      else if (x.startTime <= T)
        u(o), (x.sortIndex = x.expirationTime), t(c, x);
      else break;
      x = a(o);
    }
  }
  function A(T) {
    if (((E = !1), S(T), !b))
      if (a(c) !== null) (b = !0), U || ((U = !0), pt());
      else {
        var x = a(o);
        x !== null && Cn(A, x.startTime - T);
      }
  }
  var U = !1,
    z = -1,
    M = 5,
    N = -1;
  function q() {
    return R ? !0 : !(l.unstable_now() - N < M);
  }
  function Yl() {
    if (((R = !1), U)) {
      var T = l.unstable_now();
      N = T;
      var x = !0;
      try {
        l: {
          (b = !1), E && ((E = !1), s(z), (z = -1)), (v = !0);
          var H = d;
          try {
            t: {
              for (
                S(T), h = a(c);
                h !== null && !(h.expirationTime > T && q());

              ) {
                var ll = h.callback;
                if (typeof ll == 'function') {
                  (h.callback = null), (d = h.priorityLevel);
                  var sl = ll(h.expirationTime <= T);
                  if (((T = l.unstable_now()), typeof sl == 'function')) {
                    (h.callback = sl), S(T), (x = !0);
                    break t;
                  }
                  h === a(c) && u(c), S(T);
                } else u(c);
                h = a(c);
              }
              if (h !== null) x = !0;
              else {
                var fe = a(o);
                fe !== null && Cn(A, fe.startTime - T), (x = !1);
              }
            }
            break l;
          } finally {
            (h = null), (d = H), (v = !1);
          }
          x = void 0;
        }
      } finally {
        x ? pt() : (U = !1);
      }
    }
  }
  var pt;
  if (typeof m == 'function')
    pt = function () {
      m(Yl);
    };
  else if (typeof MessageChannel < 'u') {
    var Tc = new MessageChannel(),
      av = Tc.port2;
    (Tc.port1.onmessage = Yl),
      (pt = function () {
        av.postMessage(null);
      });
  } else
    pt = function () {
      y(Yl, 0);
    };
  function Cn(T, x) {
    z = y(function () {
      T(l.unstable_now());
    }, x);
  }
  (l.unstable_IdlePriority = 5),
    (l.unstable_ImmediatePriority = 1),
    (l.unstable_LowPriority = 4),
    (l.unstable_NormalPriority = 3),
    (l.unstable_Profiling = null),
    (l.unstable_UserBlockingPriority = 2),
    (l.unstable_cancelCallback = function (T) {
      T.callback = null;
    }),
    (l.unstable_forceFrameRate = function (T) {
      0 > T || 125 < T
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
          )
        : (M = 0 < T ? Math.floor(1e3 / T) : 5);
    }),
    (l.unstable_getCurrentPriorityLevel = function () {
      return d;
    }),
    (l.unstable_next = function (T) {
      switch (d) {
        case 1:
        case 2:
        case 3:
          var x = 3;
          break;
        default:
          x = d;
      }
      var H = d;
      d = x;
      try {
        return T();
      } finally {
        d = H;
      }
    }),
    (l.unstable_requestPaint = function () {
      R = !0;
    }),
    (l.unstable_runWithPriority = function (T, x) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var H = d;
      d = T;
      try {
        return x();
      } finally {
        d = H;
      }
    }),
    (l.unstable_scheduleCallback = function (T, x, H) {
      var ll = l.unstable_now();
      switch (
        (typeof H == 'object' && H !== null
          ? ((H = H.delay), (H = typeof H == 'number' && 0 < H ? ll + H : ll))
          : (H = ll),
        T)
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
        (sl = H + sl),
        (T = {
          id: g++,
          callback: x,
          priorityLevel: T,
          startTime: H,
          expirationTime: sl,
          sortIndex: -1
        }),
        H > ll
          ? ((T.sortIndex = H),
            t(o, T),
            a(c) === null &&
              T === a(o) &&
              (E ? (s(z), (z = -1)) : (E = !0), Cn(A, H - ll)))
          : ((T.sortIndex = sl),
            t(c, T),
            b || v || ((b = !0), U || ((U = !0), pt()))),
        T
      );
    }),
    (l.unstable_shouldYield = q),
    (l.unstable_wrapCallback = function (T) {
      var x = d;
      return function () {
        var H = d;
        d = x;
        try {
          return T.apply(this, arguments);
        } finally {
          d = H;
        }
      };
    });
})(y0);
s0.exports = y0;
var Av = s0.exports,
  d0 = { exports: {} },
  zl = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var pv = Il;
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
  _v = Symbol.for('react.portal');
function Mv(l, t, a) {
  var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: _v,
    key: u == null ? null : '' + u,
    children: l,
    containerInfo: t,
    implementation: a
  };
}
var zu = pv.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function bn(l, t) {
  if (l === 'font') return '';
  if (typeof t == 'string') return t === 'use-credentials' ? t : '';
}
zl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = bl;
zl.createPortal = function (l, t) {
  var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
    throw Error(v0(299));
  return Mv(l, t, null, a);
};
zl.flushSync = function (l) {
  var t = zu.T,
    a = bl.p;
  try {
    if (((zu.T = null), (bl.p = 2), l)) return l();
  } finally {
    (zu.T = t), (bl.p = a), bl.d.f();
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
  return zu.H.useFormState(l, t, a);
};
zl.useFormStatus = function () {
  return zu.H.useHostTransitionStatus();
};
zl.version = '19.2.8';
function o0() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o0);
    } catch (l) {
      console.error(l);
    }
}
o0(), (d0.exports = zl);
var Ov = d0.exports;
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var cl = Av,
  m0 = Il,
  Dv = Ov;
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
function h0(l) {
  return !(!l || (l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11));
}
function $u(l) {
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
function g0(l) {
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
function S0(l) {
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
function Mc(l) {
  if ($u(l) !== l) throw Error(r(188));
}
function Uv(l) {
  var t = l.alternate;
  if (!t) {
    if (((t = $u(l)), t === null)) throw Error(r(188));
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
        if (n === a) return Mc(e), l;
        if (n === u) return Mc(e), t;
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
function r0(l) {
  var t = l.tag;
  if (t === 5 || t === 26 || t === 27 || t === 6) return l;
  for (l = l.child; l !== null; ) {
    if (((t = r0(l)), t !== null)) return t;
    l = l.sibling;
  }
  return null;
}
var F = Object.assign,
  Nv = Symbol.for('react.element'),
  ye = Symbol.for('react.transitional.element'),
  hu = Symbol.for('react.portal'),
  pa = Symbol.for('react.fragment'),
  b0 = Symbol.for('react.strict_mode'),
  _f = Symbol.for('react.profiler'),
  z0 = Symbol.for('react.consumer'),
  vt = Symbol.for('react.context'),
  _i = Symbol.for('react.forward_ref'),
  Mf = Symbol.for('react.suspense'),
  Of = Symbol.for('react.suspense_list'),
  Mi = Symbol.for('react.memo'),
  Mt = Symbol.for('react.lazy'),
  Df = Symbol.for('react.activity'),
  Hv = Symbol.for('react.memo_cache_sentinel'),
  Oc = Symbol.iterator;
function cu(l) {
  return l === null || typeof l != 'object'
    ? null
    : ((l = (Oc && l[Oc]) || l['@@iterator']),
      typeof l == 'function' ? l : null);
}
var xv = Symbol.for('react.client.reference');
function Uf(l) {
  if (l == null) return null;
  if (typeof l == 'function')
    return l.$$typeof === xv ? null : l.displayName || l.name || null;
  if (typeof l == 'string') return l;
  switch (l) {
    case pa:
      return 'Fragment';
    case _f:
      return 'Profiler';
    case b0:
      return 'StrictMode';
    case Mf:
      return 'Suspense';
    case Of:
      return 'SuspenseList';
    case Df:
      return 'Activity';
  }
  if (typeof l == 'object')
    switch (l.$$typeof) {
      case hu:
        return 'Portal';
      case vt:
        return l.displayName || 'Context';
      case z0:
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
      case Mi:
        return (
          (t = l.displayName || null), t !== null ? t : Uf(l.type) || 'Memo'
        );
      case Mt:
        (t = l._payload), (l = l._init);
        try {
          return Uf(l(t));
        } catch {}
    }
  return null;
}
var gu = Array.isArray,
  _ = m0.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
  Q = Dv.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
  ea = { pending: !1, data: null, method: null, action: null },
  Nf = [],
  _a = -1;
function ut(l) {
  return { current: l };
}
function vl(l) {
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
      l = (l = t.documentElement) && (l = l.namespaceURI) ? js(l) : 0;
      break;
    default:
      if (((l = t.tagName), (t = t.namespaceURI))) (t = js(t)), (l = Qd(t, l));
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
  vl(at), J(at, l);
}
function La() {
  vl(at), vl(Bu), vl(qt);
}
function Hf(l) {
  l.memoizedState !== null && J(Xe, l);
  var t = at.current,
    a = Qd(t, l.type);
  t !== a && (J(Bu, l), J(at, a));
}
function Le(l) {
  Bu.current === l && (vl(at), vl(Bu)),
    Xe.current === l && (vl(Xe), (Ku._currentValue = ea));
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
            var h = function () {
              throw Error();
            };
            if (
              (Object.defineProperty(h.prototype, 'props', {
                set: function () {
                  throw Error();
                }
              }),
              typeof Reflect == 'object' && Reflect.construct)
            ) {
              try {
                Reflect.construct(h, []);
              } catch (v) {
                var d = v;
              }
              Reflect.construct(l, [], h);
            } else {
              try {
                h.call();
              } catch (v) {
                d = v;
              }
              l.call(h.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (v) {
              d = v;
            }
            (h = l()) &&
              typeof h.catch == 'function' &&
              h.catch(function () {});
          }
        } catch (v) {
          if (v && d && typeof v.stack == 'string') return [v.stack, d.stack];
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
        o = i.split(`
`);
      for (
        e = u = 0;
        u < c.length && !c[u].includes('DetermineComponentFrameRoot');

      )
        u++;
      for (; e < o.length && !o[e].includes('DetermineComponentFrameRoot'); )
        e++;
      if (u === c.length || e === o.length)
        for (
          u = c.length - 1, e = o.length - 1;
          1 <= u && 0 <= e && c[u] !== o[e];

        )
          e--;
      for (; 1 <= u && 0 <= e; u--, e--)
        if (c[u] !== o[e]) {
          if (u !== 1 || e !== 1)
            do
              if ((u--, e--, 0 > e || c[u] !== o[e])) {
                var g =
                  `
` + c[u].replace(' at new ', ' at ');
                return (
                  l.displayName &&
                    g.includes('<anonymous>') &&
                    (g = g.replace('<anonymous>', l.displayName)),
                  g
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
function jv(l, t) {
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
    do (t += jv(l, a)), (a = l), (l = l.return);
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
  Oi = cl.unstable_scheduleCallback,
  Zn = cl.unstable_cancelCallback,
  Bv = cl.unstable_shouldYield,
  Rv = cl.unstable_requestPaint,
  xl = cl.unstable_now,
  Cv = cl.unstable_getCurrentPriorityLevel,
  T0 = cl.unstable_ImmediatePriority,
  E0 = cl.unstable_UserBlockingPriority,
  Ve = cl.unstable_NormalPriority,
  qv = cl.unstable_LowPriority,
  A0 = cl.unstable_IdlePriority,
  Yv = cl.log,
  Gv = cl.unstable_setDisableYieldValue,
  Wu = null,
  jl = null;
function xt(l) {
  if (
    (typeof Yv == 'function' && Gv(l),
    jl && typeof jl.setStrictMode == 'function')
  )
    try {
      jl.setStrictMode(Wu, l);
    } catch {}
}
var Bl = Math.clz32 ? Math.clz32 : Zv,
  Qv = Math.log,
  Xv = Math.LN2;
function Zv(l) {
  return (l >>>= 0), l === 0 ? 32 : (31 - ((Qv(l) / Xv) | 0)) | 0;
}
var de = 256,
  ve = 262144,
  oe = 4194304;
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
function Fu(l, t) {
  return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
}
function Lv(l, t) {
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
function p0() {
  var l = oe;
  return (oe <<= 1), !(oe & 62914560) && (oe = 4194304), l;
}
function Ln(l) {
  for (var t = [], a = 0; 31 > a; a++) t.push(l);
  return t;
}
function ku(l, t) {
  (l.pendingLanes |= t),
    t !== 268435456 &&
      ((l.suspendedLanes = 0), (l.pingedLanes = 0), (l.warmLanes = 0));
}
function Vv(l, t, a, u, e, n) {
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
    o = l.hiddenUpdates;
  for (a = f & ~a; 0 < a; ) {
    var g = 31 - Bl(a),
      h = 1 << g;
    (i[g] = 0), (c[g] = -1);
    var d = o[g];
    if (d !== null)
      for (o[g] = null, g = 0; g < d.length; g++) {
        var v = d[g];
        v !== null && (v.lane &= -536870913);
      }
    a &= ~h;
  }
  u !== 0 && _0(l, u, 0),
    n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(f & ~t));
}
function _0(l, t, a) {
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
function O0(l, t) {
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
function D0() {
  var l = Q.p;
  return l !== 0 ? l : ((l = window.event), l === void 0 ? 32 : kd(l.type));
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
  Ml = '__reactProps$' + Ft,
  tu = '__reactContainer$' + Ft,
  jf = '__reactEvents$' + Ft,
  Kv = '__reactListeners$' + Ft,
  Jv = '__reactHandles$' + Ft,
  Hc = '__reactResources$' + Ft,
  Iu = '__reactMarker$' + Ft;
function Ni(l) {
  delete l[ml], delete l[Ml], delete l[jf], delete l[Kv], delete l[Jv];
}
function Ma(l) {
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
  l[Iu] = !0;
}
var U0 = new Set(),
  N0 = {};
function ma(l, t) {
  Va(l, t), Va(l + 'Capture', t);
}
function Va(l, t) {
  for (N0[l] = t, l = 0; l < t.length; l++) U0.add(t[l]);
}
var wv = RegExp(
    '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$'
  ),
  xc = {},
  jc = {};
function $v(l) {
  return xf.call(jc, l)
    ? !0
    : xf.call(xc, l)
      ? !1
      : wv.test(l)
        ? (jc[l] = !0)
        : ((xc[l] = !0), !1);
}
function Me(l, t, a) {
  if ($v(t))
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
function me(l, t, a) {
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
function Ql(l) {
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
function H0(l) {
  var t = l.type;
  return (
    (l = l.nodeName) &&
    l.toLowerCase() === 'input' &&
    (t === 'checkbox' || t === 'radio')
  );
}
function Wv(l, t, a) {
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
function Bf(l) {
  if (!l._valueTracker) {
    var t = H0(l) ? 'checked' : 'value';
    l._valueTracker = Wv(l, t, '' + l[t]);
  }
}
function x0(l) {
  if (!l) return !1;
  var t = l._valueTracker;
  if (!t) return !0;
  var a = t.getValue(),
    u = '';
  return (
    l && (u = H0(l) ? (l.checked ? 'true' : 'false') : l.value),
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
var Fv = /[\n"\\]/g;
function Ll(l) {
  return l.replace(Fv, function (t) {
    return '\\' + t.charCodeAt(0).toString(16) + ' ';
  });
}
function Rf(l, t, a, u, e, n, f, i) {
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
          (l.value = '' + Ql(t))
        : l.value !== '' + Ql(t) && (l.value = '' + Ql(t))
      : (f !== 'submit' && f !== 'reset') || l.removeAttribute('value'),
    t != null
      ? Cf(l, f, Ql(t))
      : a != null
        ? Cf(l, f, Ql(a))
        : u != null && l.removeAttribute('value'),
    e == null && n != null && (l.defaultChecked = !!n),
    e != null &&
      (l.checked = e && typeof e != 'function' && typeof e != 'symbol'),
    i != null &&
    typeof i != 'function' &&
    typeof i != 'symbol' &&
    typeof i != 'boolean'
      ? (l.name = '' + Ql(i))
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
      Bf(l);
      return;
    }
    (a = a != null ? '' + Ql(a) : ''),
      (t = t != null ? '' + Ql(t) : a),
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
    Bf(l);
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
    for (a = '' + Ql(a), t = null, e = 0; e < l.length; e++) {
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
    ((t = '' + Ql(t)), t !== l.value && (l.value = t), a == null)
  ) {
    l.defaultValue !== t && (l.defaultValue = t);
    return;
  }
  l.defaultValue = a != null ? '' + Ql(a) : '';
}
function R0(l, t, a, u) {
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
  (a = Ql(t)),
    (l.defaultValue = a),
    (u = l.textContent),
    u === a && u !== '' && u !== null && (l.value = u),
    Bf(l);
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
var kv = new Set(
  'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
    ' '
  )
);
function Bc(l, t, a) {
  var u = t.indexOf('--') === 0;
  a == null || typeof a == 'boolean' || a === ''
    ? u
      ? l.setProperty(t, '')
      : t === 'float'
        ? (l.cssFloat = '')
        : (l[t] = '')
    : u
      ? l.setProperty(t, a)
      : typeof a != 'number' || a === 0 || kv.has(t)
        ? t === 'float'
          ? (l.cssFloat = a)
          : (l[t] = ('' + a).trim())
        : (l[t] = a + 'px');
}
function C0(l, t, a) {
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
      (u = t[e]), t.hasOwnProperty(e) && a[e] !== u && Bc(l, e, u);
  } else for (var n in t) t.hasOwnProperty(n) && Bc(l, n, t[n]);
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
var Iv = new Map([
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
  Pv =
    /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
function Oe(l) {
  return Pv.test('' + l)
    ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
    : l;
}
function ot() {}
var qf = null;
function xi(l) {
  return (
    (l = l.target || l.srcElement || window),
    l.correspondingUseElement && (l = l.correspondingUseElement),
    l.nodeType === 3 ? l.parentNode : l
  );
}
var Oa = null,
  Ya = null;
function Rc(l) {
  var t = au(l);
  if (t && (l = t.stateNode)) {
    var a = l[Ml] || null;
    l: switch (((l = t.stateNode), t.type)) {
      case 'input':
        if (
          (Rf(
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
              'input[name="' + Ll('' + t) + '"][type="radio"]'
            ),
              t = 0;
            t < a.length;
            t++
          ) {
            var u = a[t];
            if (u !== l && u.form === l.form) {
              var e = u[Ml] || null;
              if (!e) throw Error(r(90));
              Rf(
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
          for (t = 0; t < a.length; t++) (u = a[t]), u.form === l.form && x0(u);
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
function q0(l, t, a) {
  if (Vn) return l(t, a);
  Vn = !0;
  try {
    var u = l(t);
    return u;
  } finally {
    if (
      ((Vn = !1),
      (Oa !== null || Ya !== null) &&
        (xn(), Oa && ((t = Oa), (l = Ya), (Ya = Oa = null), Rc(t), l)))
    )
      for (t = 0; t < l.length; t++) Rc(l[t]);
  }
}
function Ru(l, t) {
  var a = l.stateNode;
  if (a === null) return null;
  var u = a[Ml] || null;
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
var jt = null,
  ji = null,
  De = null;
function Y0() {
  if (De) return De;
  var l,
    t = ji,
    a = t.length,
    u,
    e = 'value' in jt ? jt.value : jt.textContent,
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
function he() {
  return !0;
}
function Cc() {
  return !1;
}
function Ol(l) {
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
        ? he
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
          (this.isDefaultPrevented = he));
      },
      stopPropagation: function () {
        var a = this.nativeEvent;
        a &&
          (a.stopPropagation
            ? a.stopPropagation()
            : typeof a.cancelBubble != 'unknown' && (a.cancelBubble = !0),
          (this.isPropagationStopped = he));
      },
      persist: function () {},
      isPersistent: he
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
  Tn = Ol(ha),
  Pu = F({}, ha, { view: 0, detail: 0 }),
  lo = Ol(Pu),
  Kn,
  Jn,
  yu,
  En = F({}, Pu, {
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
    getModifierState: Bi,
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
  qc = Ol(En),
  to = F({}, En, { dataTransfer: 0 }),
  ao = Ol(to),
  uo = F({}, Pu, { relatedTarget: 0 }),
  wn = Ol(uo),
  eo = F({}, ha, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  no = Ol(eo),
  fo = F({}, ha, {
    clipboardData: function (l) {
      return 'clipboardData' in l ? l.clipboardData : window.clipboardData;
    }
  }),
  io = Ol(fo),
  co = F({}, ha, { data: 0 }),
  Yc = Ol(co),
  so = {
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
  yo = {
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
  vo = {
    Alt: 'altKey',
    Control: 'ctrlKey',
    Meta: 'metaKey',
    Shift: 'shiftKey'
  };
function oo(l) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(l) : (l = vo[l]) ? !!t[l] : !1;
}
function Bi() {
  return oo;
}
var mo = F({}, Pu, {
    key: function (l) {
      if (l.key) {
        var t = so[l.key] || l.key;
        if (t !== 'Unidentified') return t;
      }
      return l.type === 'keypress'
        ? ((l = Ue(l)), l === 13 ? 'Enter' : String.fromCharCode(l))
        : l.type === 'keydown' || l.type === 'keyup'
          ? yo[l.keyCode] || 'Unidentified'
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
    getModifierState: Bi,
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
  ho = Ol(mo),
  go = F({}, En, {
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
  Gc = Ol(go),
  So = F({}, Pu, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Bi
  }),
  ro = Ol(So),
  bo = F({}, ha, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  zo = Ol(bo),
  To = F({}, En, {
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
  Eo = Ol(To),
  Ao = F({}, ha, { newState: 0, oldState: 0 }),
  po = Ol(Ao),
  _o = [9, 13, 27, 32],
  Ri = rt && 'CompositionEvent' in window,
  Tu = null;
rt && 'documentMode' in document && (Tu = document.documentMode);
var Mo = rt && 'TextEvent' in window && !Tu,
  G0 = rt && (!Ri || (Tu && 8 < Tu && 11 >= Tu)),
  Qc = ' ',
  Xc = !1;
function Q0(l, t) {
  switch (l) {
    case 'keyup':
      return _o.indexOf(t.keyCode) !== -1;
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
function X0(l) {
  return (l = l.detail), typeof l == 'object' && 'data' in l ? l.data : null;
}
var Da = !1;
function Oo(l, t) {
  switch (l) {
    case 'compositionend':
      return X0(t);
    case 'keypress':
      return t.which !== 32 ? null : ((Xc = !0), Qc);
    case 'textInput':
      return (l = t.data), l === Qc && Xc ? null : l;
    default:
      return null;
  }
}
function Do(l, t) {
  if (Da)
    return l === 'compositionend' || (!Ri && Q0(l, t))
      ? ((l = Y0()), (De = ji = jt = null), (Da = !1), l)
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
      return G0 && t.locale !== 'ko' ? null : t.data;
    default:
      return null;
  }
}
var Uo = {
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
  return t === 'input' ? !!Uo[l.type] : t === 'textarea';
}
function Z0(l, t, a, u) {
  Oa ? (Ya ? Ya.push(u) : (Ya = [u])) : (Oa = u),
    (t = yn(t, 'onChange')),
    0 < t.length &&
      ((a = new Tn('onChange', 'change', null, a, u)),
      l.push({ event: a, listeners: t }));
}
var Eu = null,
  Cu = null;
function No(l) {
  qd(l, 0);
}
function An(l) {
  var t = Su(l);
  if (x0(t)) return l;
}
function Lc(l, t) {
  if (l === 'change') return t;
}
var L0 = !1;
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
  L0 = $n && (!document.documentMode || 9 < document.documentMode);
}
function Kc() {
  Eu && (Eu.detachEvent('onpropertychange', V0), (Cu = Eu = null));
}
function V0(l) {
  if (l.propertyName === 'value' && An(Cu)) {
    var t = [];
    Z0(t, Cu, l, xi(l)), q0(No, t);
  }
}
function Ho(l, t, a) {
  l === 'focusin'
    ? (Kc(), (Eu = t), (Cu = a), Eu.attachEvent('onpropertychange', V0))
    : l === 'focusout' && Kc();
}
function xo(l) {
  if (l === 'selectionchange' || l === 'keyup' || l === 'keydown')
    return An(Cu);
}
function jo(l, t) {
  if (l === 'click') return An(t);
}
function Bo(l, t) {
  if (l === 'input' || l === 'change') return An(t);
}
function Ro(l, t) {
  return (l === t && (l !== 0 || 1 / l === 1 / t)) || (l !== l && t !== t);
}
var Cl = typeof Object.is == 'function' ? Object.is : Ro;
function qu(l, t) {
  if (Cl(l, t)) return !0;
  if (typeof l != 'object' || l === null || typeof t != 'object' || t === null)
    return !1;
  var a = Object.keys(l),
    u = Object.keys(t);
  if (a.length !== u.length) return !1;
  for (u = 0; u < a.length; u++) {
    var e = a[u];
    if (!xf.call(t, e) || !Cl(l[e], t[e])) return !1;
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
function K0(l, t) {
  return l && t
    ? l === t
      ? !0
      : l && l.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? K0(l, t.parentNode)
          : 'contains' in l
            ? l.contains(t)
            : l.compareDocumentPosition
              ? !!(l.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function J0(l) {
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
var Co = rt && 'documentMode' in document && 11 >= document.documentMode,
  Ua = null,
  Gf = null,
  Au = null,
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
    (Au && qu(Au, u)) ||
      ((Au = u),
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
  w0 = {};
rt &&
  ((w0 = document.createElement('div').style),
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
  for (a in t) if (t.hasOwnProperty(a) && a in w0) return (Fn[l] = t[a]);
  return l;
}
var $0 = ga('animationend'),
  W0 = ga('animationiteration'),
  F0 = ga('animationstart'),
  qo = ga('transitionrun'),
  Yo = ga('transitionstart'),
  Go = ga('transitioncancel'),
  k0 = ga('transitionend'),
  I0 = new Map(),
  Xf =
    'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
      ' '
    );
Xf.push('scrollEnd');
function kl(l, t) {
  I0.set(l, t), ma(t, [l]);
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
  Gl = [],
  Ha = 0,
  qi = 0;
function pn() {
  for (var l = Ha, t = (qi = Ha = 0); t < l; ) {
    var a = Gl[t];
    Gl[t++] = null;
    var u = Gl[t];
    Gl[t++] = null;
    var e = Gl[t];
    Gl[t++] = null;
    var n = Gl[t];
    if (((Gl[t++] = null), u !== null && e !== null)) {
      var f = u.pending;
      f === null ? (e.next = e) : ((e.next = f.next), (f.next = e)),
        (u.pending = e);
    }
    n !== 0 && P0(a, e, n);
  }
}
function _n(l, t, a, u) {
  (Gl[Ha++] = l),
    (Gl[Ha++] = t),
    (Gl[Ha++] = a),
    (Gl[Ha++] = u),
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
function P0(l, t, a) {
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
  if (50 < xu) throw ((xu = 0), (ci = null), Error(r(185)));
  for (var t = l.return; t !== null; ) (l = t), (t = l.return);
  return l.tag === 3 ? l.stateNode : null;
}
var xa = {};
function Qo(l, t, a, u) {
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
function Nl(l, t, a, u) {
  return new Qo(l, t, a, u);
}
function Gi(l) {
  return (l = l.prototype), !(!l || !l.isReactComponent);
}
function ht(l, t) {
  var a = l.alternate;
  return (
    a === null
      ? ((a = Nl(l.tag, t, l.key, l.mode)),
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
function ly(l, t) {
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
    f = Km(l, a, at.current)
      ? 26
      : l === 'html' || l === 'head' || l === 'body'
        ? 27
        : 5;
  else
    l: switch (l) {
      case Df:
        return (l = Nl(31, a, t, e)), (l.elementType = Df), (l.lanes = n), l;
      case pa:
        return na(a.children, e, n, t);
      case b0:
        (f = 8), (e |= 24);
        break;
      case _f:
        return (
          (l = Nl(12, a, t, e | 2)), (l.elementType = _f), (l.lanes = n), l
        );
      case Mf:
        return (l = Nl(13, a, t, e)), (l.elementType = Mf), (l.lanes = n), l;
      case Of:
        return (l = Nl(19, a, t, e)), (l.elementType = Of), (l.lanes = n), l;
      default:
        if (typeof l == 'object' && l !== null)
          switch (l.$$typeof) {
            case vt:
              f = 10;
              break l;
            case z0:
              f = 9;
              break l;
            case _i:
              f = 11;
              break l;
            case Mi:
              f = 14;
              break l;
            case Mt:
              (f = 16), (u = null);
              break l;
          }
        (f = 29),
          (a = Error(r(130, l === null ? 'null' : typeof l, ''))),
          (u = null);
    }
  return (
    (t = Nl(f, a, t, e)), (t.elementType = l), (t.type = u), (t.lanes = n), t
  );
}
function na(l, t, a, u) {
  return (l = Nl(7, l, u, t)), (l.lanes = a), l;
}
function kn(l, t, a) {
  return (l = Nl(6, l, null, t)), (l.lanes = a), l;
}
function ty(l) {
  var t = Nl(18, null, null, 0);
  return (t.stateNode = l), t;
}
function In(l, t, a) {
  return (
    (t = Nl(4, l.children !== null ? l.children : [], l.key, t)),
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
function Vl(l, t) {
  if (typeof l == 'object' && l !== null) {
    var a = Wc.get(l);
    return a !== void 0
      ? a
      : ((t = { value: l, source: t, stack: Uc(t) }), Wc.set(l, t), t);
  }
  return { value: l, source: t, stack: Uc(t) };
}
var ja = [],
  Ba = 0,
  $e = null,
  Yu = 0,
  Xl = [],
  Zl = 0,
  Jt = null,
  Pl = 1,
  lt = '';
function yt(l, t) {
  (ja[Ba++] = Yu), (ja[Ba++] = $e), ($e = l), (Yu = t);
}
function ay(l, t, a) {
  (Xl[Zl++] = Pl), (Xl[Zl++] = lt), (Xl[Zl++] = Jt), (Jt = l);
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
  l.return !== null && (yt(l, 1), ay(l, 1, 0));
}
function Xi(l) {
  for (; l === $e; )
    ($e = ja[--Ba]), (ja[Ba] = null), (Yu = ja[--Ba]), (ja[Ba] = null);
  for (; l === Jt; )
    (Jt = Xl[--Zl]),
      (Xl[Zl] = null),
      (lt = Xl[--Zl]),
      (Xl[Zl] = null),
      (Pl = Xl[--Zl]),
      (Xl[Zl] = null);
}
function uy(l, t) {
  (Xl[Zl++] = Pl),
    (Xl[Zl++] = lt),
    (Xl[Zl++] = Jt),
    (Pl = t.id),
    (lt = t.overflow),
    (Jt = l);
}
var hl = null,
  $ = null,
  Y = !1,
  Yt = null,
  Kl = !1,
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
  throw (Gu(Vl(t, l)), Zf);
}
function Fc(l) {
  var t = l.stateNode,
    a = l.type,
    u = l.memoizedProps;
  switch (((t[ml] = l), (t[Ml] = u), a)) {
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
      for (a = 0; a < Lu.length; a++) j(Lu[a], t);
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
      j('invalid', t), R0(t, u.value, u.defaultValue, u.children);
  }
  (a = u.children),
    (typeof a != 'string' && typeof a != 'number' && typeof a != 'bigint') ||
    t.textContent === '' + a ||
    u.suppressHydrationWarning === !0 ||
    Gd(t.textContent, a)
      ? (u.popover != null && (j('beforetoggle', t), j('toggle', t)),
        u.onScroll != null && j('scroll', t),
        u.onScrollEnd != null && j('scrollend', t),
        u.onClick != null && (t.onclick = ot),
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
        Kl = !1;
        return;
      case 27:
      case 3:
        Kl = !0;
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
        (a = !(a !== 'form' && a !== 'button') || oi(l.type, l.memoizedProps))),
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
      : ($ = hl ? wl(l.stateNode.nextSibling) : null);
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
function Gu(l) {
  Yt === null ? (Yt = [l]) : Yt.push(l);
}
var Lf = ut(null),
  ra = null,
  mt = null;
function Dt(l, t, a) {
  J(Lf, t._currentValue), (t._currentValue = a);
}
function gt(l) {
  (l._currentValue = Lf.current), vl(Lf);
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
        Cl(e.pendingProps.value, f.value) ||
          (l !== null ? l.push(i) : (l = [i]));
      }
    } else if (e === Xe.current) {
      if (((f = e.alternate), f === null)) throw Error(r(387));
      f.memoizedState.memoizedState !== e.memoizedState.memoizedState &&
        (l !== null ? l.push(Ku) : (l = [Ku]));
    }
    e = e.return;
  }
  l !== null && Kf(t, l, a, u), (t.flags |= 262144);
}
function We(l) {
  for (l = l.firstContext; l !== null; ) {
    if (!Cl(l.context._currentValue, l.memoizedValue)) return !0;
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
  return ey(ra, l);
}
function ge(l, t) {
  return ra === null && ya(l), ey(l, t);
}
function ey(l, t) {
  var a = t._currentValue;
  if (((t = { context: t, memoizedValue: a, next: null }), mt === null)) {
    if (l === null) throw Error(r(308));
    (mt = t),
      (l.dependencies = { lanes: 0, firstContext: t }),
      (l.flags |= 524288);
  } else mt = mt.next = t;
  return a;
}
var Xo =
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
  Zo = cl.unstable_scheduleCallback,
  Lo = cl.unstable_NormalPriority,
  nl = {
    $$typeof: vt,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
function Zi() {
  return { controller: new Xo(), data: new Map(), refCount: 0 };
}
function le(l) {
  l.refCount--,
    l.refCount === 0 &&
      Zo(Lo, function () {
        l.controller.abort();
      });
}
var pu = null,
  Jf = 0,
  Ja = 0,
  Ga = null;
function Vo(l, t) {
  if (pu === null) {
    var a = (pu = []);
    (Jf = 0),
      (Ja = oc()),
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
  if (--Jf === 0 && pu !== null) {
    Ga !== null && (Ga.status = 'fulfilled');
    var l = pu;
    (pu = null), (Ja = 0), (Ga = null);
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
}
function Ko(l, t) {
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
var Pc = _.S;
_.S = function (l, t) {
  (rd = xl()),
    typeof t == 'object' &&
      t !== null &&
      typeof t.then == 'function' &&
      Vo(l, t),
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
function ny() {
  var l = Li();
  return l === null ? null : { parent: nl._currentValue, pool: l };
}
var eu = Error(r(460)),
  Vi = Error(r(474)),
  Mn = Error(r(542)),
  Fe = { then: function () {} };
function ls(l) {
  return (l = l.status), l === 'fulfilled' || l === 'rejected';
}
function fy(l, t, a) {
  switch (
    ((a = l[a]),
    a === void 0 ? l.push(t) : a !== t && (t.then(ot, ot), (t = a)),
    t.status)
  ) {
    case 'fulfilled':
      return t.value;
    case 'rejected':
      throw ((l = t.reason), as(l), l);
    default:
      if (typeof t.status == 'string') t.then(ot, ot);
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
  if (l === eu || l === Mn) throw Error(r(483));
}
var Qa = null,
  Qu = 0;
function Se(l) {
  var t = Qu;
  return (Qu += 1), Qa === null && (Qa = []), fy(Qa, l, t);
}
function du(l, t) {
  (t = t.props.ref), (l.ref = t !== void 0 ? t : null);
}
function re(l, t) {
  throw t.$$typeof === Nv
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
function iy(l) {
  function t(y, s) {
    if (l) {
      var m = y.deletions;
      m === null ? ((y.deletions = [s]), (y.flags |= 16)) : m.push(s);
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
  function n(y, s, m) {
    return (
      (y.index = m),
      l
        ? ((m = y.alternate),
          m !== null
            ? ((m = m.index), m < s ? ((y.flags |= 67108866), s) : m)
            : ((y.flags |= 67108866), s))
        : ((y.flags |= 1048576), s)
    );
  }
  function f(y) {
    return l && y.alternate === null && (y.flags |= 67108866), y;
  }
  function i(y, s, m, S) {
    return s === null || s.tag !== 6
      ? ((s = kn(m, y.mode, S)), (s.return = y), s)
      : ((s = e(s, m)), (s.return = y), s);
  }
  function c(y, s, m, S) {
    var A = m.type;
    return A === pa
      ? g(y, s, m.props.children, S, m.key)
      : s !== null &&
          (s.elementType === A ||
            (typeof A == 'object' &&
              A !== null &&
              A.$$typeof === Mt &&
              aa(A) === s.type))
        ? ((s = e(s, m.props)), du(s, m), (s.return = y), s)
        : ((s = Ne(m.type, m.key, m.props, null, y.mode, S)),
          du(s, m),
          (s.return = y),
          s);
  }
  function o(y, s, m, S) {
    return s === null ||
      s.tag !== 4 ||
      s.stateNode.containerInfo !== m.containerInfo ||
      s.stateNode.implementation !== m.implementation
      ? ((s = In(m, y.mode, S)), (s.return = y), s)
      : ((s = e(s, m.children || [])), (s.return = y), s);
  }
  function g(y, s, m, S, A) {
    return s === null || s.tag !== 7
      ? ((s = na(m, y.mode, S, A)), (s.return = y), s)
      : ((s = e(s, m)), (s.return = y), s);
  }
  function h(y, s, m) {
    if (
      (typeof s == 'string' && s !== '') ||
      typeof s == 'number' ||
      typeof s == 'bigint'
    )
      return (s = kn('' + s, y.mode, m)), (s.return = y), s;
    if (typeof s == 'object' && s !== null) {
      switch (s.$$typeof) {
        case ye:
          return (
            (m = Ne(s.type, s.key, s.props, null, y.mode, m)),
            du(m, s),
            (m.return = y),
            m
          );
        case hu:
          return (s = In(s, y.mode, m)), (s.return = y), s;
        case Mt:
          return (s = aa(s)), h(y, s, m);
      }
      if (gu(s) || cu(s))
        return (s = na(s, y.mode, m, null)), (s.return = y), s;
      if (typeof s.then == 'function') return h(y, Se(s), m);
      if (s.$$typeof === vt) return h(y, ge(y, s), m);
      re(y, s);
    }
    return null;
  }
  function d(y, s, m, S) {
    var A = s !== null ? s.key : null;
    if (
      (typeof m == 'string' && m !== '') ||
      typeof m == 'number' ||
      typeof m == 'bigint'
    )
      return A !== null ? null : i(y, s, '' + m, S);
    if (typeof m == 'object' && m !== null) {
      switch (m.$$typeof) {
        case ye:
          return m.key === A ? c(y, s, m, S) : null;
        case hu:
          return m.key === A ? o(y, s, m, S) : null;
        case Mt:
          return (m = aa(m)), d(y, s, m, S);
      }
      if (gu(m) || cu(m)) return A !== null ? null : g(y, s, m, S, null);
      if (typeof m.then == 'function') return d(y, s, Se(m), S);
      if (m.$$typeof === vt) return d(y, s, ge(y, m), S);
      re(y, m);
    }
    return null;
  }
  function v(y, s, m, S, A) {
    if (
      (typeof S == 'string' && S !== '') ||
      typeof S == 'number' ||
      typeof S == 'bigint'
    )
      return (y = y.get(m) || null), i(s, y, '' + S, A);
    if (typeof S == 'object' && S !== null) {
      switch (S.$$typeof) {
        case ye:
          return (y = y.get(S.key === null ? m : S.key) || null), c(s, y, S, A);
        case hu:
          return (y = y.get(S.key === null ? m : S.key) || null), o(s, y, S, A);
        case Mt:
          return (S = aa(S)), v(y, s, m, S, A);
      }
      if (gu(S) || cu(S)) return (y = y.get(m) || null), g(s, y, S, A, null);
      if (typeof S.then == 'function') return v(y, s, m, Se(S), A);
      if (S.$$typeof === vt) return v(y, s, m, ge(s, S), A);
      re(s, S);
    }
    return null;
  }
  function b(y, s, m, S) {
    for (
      var A = null, U = null, z = s, M = (s = 0), N = null;
      z !== null && M < m.length;
      M++
    ) {
      z.index > M ? ((N = z), (z = null)) : (N = z.sibling);
      var q = d(y, z, m[M], S);
      if (q === null) {
        z === null && (z = N);
        break;
      }
      l && z && q.alternate === null && t(y, z),
        (s = n(q, s, M)),
        U === null ? (A = q) : (U.sibling = q),
        (U = q),
        (z = N);
    }
    if (M === m.length) return a(y, z), Y && yt(y, M), A;
    if (z === null) {
      for (; M < m.length; M++)
        (z = h(y, m[M], S)),
          z !== null &&
            ((s = n(z, s, M)), U === null ? (A = z) : (U.sibling = z), (U = z));
      return Y && yt(y, M), A;
    }
    for (z = u(z); M < m.length; M++)
      (N = v(z, y, M, m[M], S)),
        N !== null &&
          (l && N.alternate !== null && z.delete(N.key === null ? M : N.key),
          (s = n(N, s, M)),
          U === null ? (A = N) : (U.sibling = N),
          (U = N));
    return (
      l &&
        z.forEach(function (Yl) {
          return t(y, Yl);
        }),
      Y && yt(y, M),
      A
    );
  }
  function E(y, s, m, S) {
    if (m == null) throw Error(r(151));
    for (
      var A = null, U = null, z = s, M = (s = 0), N = null, q = m.next();
      z !== null && !q.done;
      M++, q = m.next()
    ) {
      z.index > M ? ((N = z), (z = null)) : (N = z.sibling);
      var Yl = d(y, z, q.value, S);
      if (Yl === null) {
        z === null && (z = N);
        break;
      }
      l && z && Yl.alternate === null && t(y, z),
        (s = n(Yl, s, M)),
        U === null ? (A = Yl) : (U.sibling = Yl),
        (U = Yl),
        (z = N);
    }
    if (q.done) return a(y, z), Y && yt(y, M), A;
    if (z === null) {
      for (; !q.done; M++, q = m.next())
        (q = h(y, q.value, S)),
          q !== null &&
            ((s = n(q, s, M)), U === null ? (A = q) : (U.sibling = q), (U = q));
      return Y && yt(y, M), A;
    }
    for (z = u(z); !q.done; M++, q = m.next())
      (q = v(z, y, M, q.value, S)),
        q !== null &&
          (l && q.alternate !== null && z.delete(q.key === null ? M : q.key),
          (s = n(q, s, M)),
          U === null ? (A = q) : (U.sibling = q),
          (U = q));
    return (
      l &&
        z.forEach(function (pt) {
          return t(y, pt);
        }),
      Y && yt(y, M),
      A
    );
  }
  function R(y, s, m, S) {
    if (
      (typeof m == 'object' &&
        m !== null &&
        m.type === pa &&
        m.key === null &&
        (m = m.props.children),
      typeof m == 'object' && m !== null)
    ) {
      switch (m.$$typeof) {
        case ye:
          l: {
            for (var A = m.key; s !== null; ) {
              if (s.key === A) {
                if (((A = m.type), A === pa)) {
                  if (s.tag === 7) {
                    a(y, s.sibling),
                      (S = e(s, m.props.children)),
                      (S.return = y),
                      (y = S);
                    break l;
                  }
                } else if (
                  s.elementType === A ||
                  (typeof A == 'object' &&
                    A !== null &&
                    A.$$typeof === Mt &&
                    aa(A) === s.type)
                ) {
                  a(y, s.sibling),
                    (S = e(s, m.props)),
                    du(S, m),
                    (S.return = y),
                    (y = S);
                  break l;
                }
                a(y, s);
                break;
              } else t(y, s);
              s = s.sibling;
            }
            m.type === pa
              ? ((S = na(m.props.children, y.mode, S, m.key)),
                (S.return = y),
                (y = S))
              : ((S = Ne(m.type, m.key, m.props, null, y.mode, S)),
                du(S, m),
                (S.return = y),
                (y = S));
          }
          return f(y);
        case hu:
          l: {
            for (A = m.key; s !== null; ) {
              if (s.key === A)
                if (
                  s.tag === 4 &&
                  s.stateNode.containerInfo === m.containerInfo &&
                  s.stateNode.implementation === m.implementation
                ) {
                  a(y, s.sibling),
                    (S = e(s, m.children || [])),
                    (S.return = y),
                    (y = S);
                  break l;
                } else {
                  a(y, s);
                  break;
                }
              else t(y, s);
              s = s.sibling;
            }
            (S = In(m, y.mode, S)), (S.return = y), (y = S);
          }
          return f(y);
        case Mt:
          return (m = aa(m)), R(y, s, m, S);
      }
      if (gu(m)) return b(y, s, m, S);
      if (cu(m)) {
        if (((A = cu(m)), typeof A != 'function')) throw Error(r(150));
        return (m = A.call(m)), E(y, s, m, S);
      }
      if (typeof m.then == 'function') return R(y, s, Se(m), S);
      if (m.$$typeof === vt) return R(y, s, ge(y, m), S);
      re(y, m);
    }
    return (typeof m == 'string' && m !== '') ||
      typeof m == 'number' ||
      typeof m == 'bigint'
      ? ((m = '' + m),
        s !== null && s.tag === 6
          ? (a(y, s.sibling), (S = e(s, m)), (S.return = y), (y = S))
          : (a(y, s), (S = kn(m, y.mode, S)), (S.return = y), (y = S)),
        f(y))
      : a(y, s);
  }
  return function (y, s, m, S) {
    try {
      Qu = 0;
      var A = R(y, s, m, S);
      return (Qa = null), A;
    } catch (z) {
      if (z === eu || z === Mn) throw z;
      var U = Nl(29, z, null, y.mode);
      return (U.lanes = S), (U.return = y), U;
    } finally {
    }
  };
}
var da = iy(!0),
  cy = iy(!1),
  Ot = !1;
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
      P0(l, null, a),
      t
    );
  }
  return _n(l, u, t, a), we(l);
}
function _u(l, t, a) {
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
function Ou(l, t, a, u) {
  $f = !1;
  var e = l.updateQueue;
  Ot = !1;
  var n = e.firstBaseUpdate,
    f = e.lastBaseUpdate,
    i = e.shared.pending;
  if (i !== null) {
    e.shared.pending = null;
    var c = i,
      o = c.next;
    (c.next = null), f === null ? (n = o) : (f.next = o), (f = c);
    var g = l.alternate;
    g !== null &&
      ((g = g.updateQueue),
      (i = g.lastBaseUpdate),
      i !== f &&
        (i === null ? (g.firstBaseUpdate = o) : (i.next = o),
        (g.lastBaseUpdate = c)));
  }
  if (n !== null) {
    var h = e.baseState;
    (f = 0), (g = o = c = null), (i = n);
    do {
      var d = i.lane & -536870913,
        v = d !== i.lane;
      if (v ? (C & d) === d : (u & d) === d) {
        d !== 0 && d === Ja && ($f = !0),
          g !== null &&
            (g = g.next =
              {
                lane: 0,
                tag: i.tag,
                payload: i.payload,
                callback: null,
                next: null
              });
        l: {
          var b = l,
            E = i;
          d = t;
          var R = a;
          switch (E.tag) {
            case 1:
              if (((b = E.payload), typeof b == 'function')) {
                h = b.call(R, h, d);
                break l;
              }
              h = b;
              break l;
            case 3:
              b.flags = (b.flags & -65537) | 128;
            case 0:
              if (
                ((b = E.payload),
                (d = typeof b == 'function' ? b.call(R, h, d) : b),
                d == null)
              )
                break l;
              h = F({}, h, d);
              break l;
            case 2:
              Ot = !0;
          }
        }
        (d = i.callback),
          d !== null &&
            ((l.flags |= 64),
            v && (l.flags |= 8192),
            (v = e.callbacks),
            v === null ? (e.callbacks = [d]) : v.push(d));
      } else
        (v = {
          lane: d,
          tag: i.tag,
          payload: i.payload,
          callback: i.callback,
          next: null
        }),
          g === null ? ((o = g = v), (c = h)) : (g = g.next = v),
          (f |= d);
      if (((i = i.next), i === null)) {
        if (((i = e.shared.pending), i === null)) break;
        (v = i),
          (i = v.next),
          (v.next = null),
          (e.lastBaseUpdate = v),
          (e.shared.pending = null);
      }
    } while (!0);
    g === null && (c = h),
      (e.baseState = c),
      (e.firstBaseUpdate = o),
      (e.lastBaseUpdate = g),
      n === null && (e.shared.lanes = 0),
      (Wt |= f),
      (l.lanes = f),
      (l.memoizedState = h);
  }
}
function sy(l, t) {
  if (typeof l != 'function') throw Error(r(191, l));
  l.call(t);
}
function yy(l, t) {
  var a = l.callbacks;
  if (a !== null)
    for (l.callbacks = null, l = 0; l < a.length; l++) sy(a[l], t);
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
  (Et = ke.current), vl(wa), vl(ke);
}
var ql = ut(null),
  Jl = null;
function Ut(l) {
  var t = l.alternate;
  J(tl, tl.current & 1),
    J(ql, l),
    Jl === null &&
      (t === null || wa.current !== null || t.memoizedState !== null) &&
      (Jl = l);
}
function Ff(l) {
  J(tl, tl.current), J(ql, l), Jl === null && (Jl = l);
}
function dy(l) {
  l.tag === 22 ? (J(tl, tl.current), J(ql, l), Jl === null && (Jl = l)) : Nt();
}
function Nt() {
  J(tl, tl.current), J(ql, ql.current);
}
function Ul(l) {
  vl(ql), Jl === l && (Jl = null), vl(tl);
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
  D = null,
  V = null,
  ul = null,
  Pe = !1,
  Xa = !1,
  va = !1,
  ln = 0,
  Xu = 0,
  Za = null,
  Jo = 0;
function I() {
  throw Error(r(321));
}
function wi(l, t) {
  if (t === null) return !1;
  for (var a = 0; a < t.length && a < l.length; a++)
    if (!Cl(l[a], t[a])) return !1;
  return !0;
}
function $i(l, t, a, u, e, n) {
  return (
    (bt = n),
    (D = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (_.H = l === null || l.memoizedState === null ? Zy : nc),
    (va = !1),
    (n = a(u, e)),
    (va = !1),
    Xa && (n = oy(t, a, u, e)),
    vy(l),
    n
  );
}
function vy(l) {
  _.H = Zu;
  var t = V !== null && V.next !== null;
  if (((bt = 0), (ul = V = D = null), (Pe = !1), (Xu = 0), (Za = null), t))
    throw Error(r(300));
  l === null || fl || ((l = l.dependencies), l !== null && We(l) && (fl = !0));
}
function oy(l, t, a, u) {
  D = l;
  var e = 0;
  do {
    if ((Xa && (Za = null), (Xu = 0), (Xa = !1), 25 <= e)) throw Error(r(301));
    if (((e += 1), (ul = V = null), l.updateQueue != null)) {
      var n = l.updateQueue;
      (n.lastEffect = null),
        (n.events = null),
        (n.stores = null),
        n.memoCache != null && (n.memoCache.index = 0);
    }
    (_.H = Ly), (n = t(a, u));
  } while (Xa);
  return n;
}
function wo() {
  var l = _.H,
    t = l.useState()[0];
  return (
    (t = typeof t.then == 'function' ? te(t) : t),
    (l = l.useState()[0]),
    (V !== null ? V.memoizedState : null) !== l && (D.flags |= 1024),
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
  (bt = 0), (ul = V = D = null), (Xa = !1), (Xu = ln = 0), (Za = null);
}
function rl() {
  var l = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  return ul === null ? (D.memoizedState = ul = l) : (ul = ul.next = l), ul;
}
function al() {
  if (V === null) {
    var l = D.alternate;
    l = l !== null ? l.memoizedState : null;
  } else l = V.next;
  var t = ul === null ? D.memoizedState : ul.next;
  if (t !== null) (ul = t), (V = l);
  else {
    if (l === null) throw D.alternate === null ? Error(r(467)) : Error(r(310));
    (V = l),
      (l = {
        memoizedState: V.memoizedState,
        baseState: V.baseState,
        baseQueue: V.baseQueue,
        queue: V.queue,
        next: null
      }),
      ul === null ? (D.memoizedState = ul = l) : (ul = ul.next = l);
  }
  return ul;
}
function On() {
  return { lastEffect: null, events: null, stores: null, memoCache: null };
}
function te(l) {
  var t = Xu;
  return (
    (Xu += 1),
    Za === null && (Za = []),
    (l = fy(Za, l, t)),
    (t = D),
    (ul === null ? t.memoizedState : ul.next) === null &&
      ((t = t.alternate),
      (_.H = t === null || t.memoizedState === null ? Zy : nc)),
    l
  );
}
function Dn(l) {
  if (l !== null && typeof l == 'object') {
    if (typeof l.then == 'function') return te(l);
    if (l.$$typeof === vt) return gl(l);
  }
  throw Error(r(438, String(l)));
}
function Ii(l) {
  var t = null,
    a = D.updateQueue;
  if ((a !== null && (t = a.memoCache), t == null)) {
    var u = D.alternate;
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
    a === null && ((a = On()), (D.updateQueue = a)),
    (a.memoCache = t),
    (a = t.data[t.index]),
    a === void 0)
  )
    for (a = t.data[t.index] = Array(l), u = 0; u < l; u++) a[u] = Hv;
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
      o = t,
      g = !1;
    do {
      var h = o.lane & -536870913;
      if (h !== o.lane ? (C & h) === h : (bt & h) === h) {
        var d = o.revertLane;
        if (d === 0)
          c !== null &&
            (c = c.next =
              {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: o.action,
                hasEagerState: o.hasEagerState,
                eagerState: o.eagerState,
                next: null
              }),
            h === Ja && (g = !0);
        else if ((bt & d) === d) {
          (o = o.next), d === Ja && (g = !0);
          continue;
        } else
          (h = {
            lane: 0,
            revertLane: o.revertLane,
            gesture: null,
            action: o.action,
            hasEagerState: o.hasEagerState,
            eagerState: o.eagerState,
            next: null
          }),
            c === null ? ((i = c = h), (f = n)) : (c = c.next = h),
            (D.lanes |= d),
            (Wt |= d);
        (h = o.action),
          va && a(n, h),
          (n = o.hasEagerState ? o.eagerState : a(n, h));
      } else
        (d = {
          lane: h,
          revertLane: o.revertLane,
          gesture: o.gesture,
          action: o.action,
          hasEagerState: o.hasEagerState,
          eagerState: o.eagerState,
          next: null
        }),
          c === null ? ((i = c = d), (f = n)) : (c = c.next = d),
          (D.lanes |= h),
          (Wt |= h);
      o = o.next;
    } while (o !== null && o !== t);
    if (
      (c === null ? (f = n) : (c.next = i),
      !Cl(n, l.memoizedState) && ((fl = !0), g && ((a = Ga), a !== null)))
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
    Cl(n, t.memoizedState) || (fl = !0),
      (t.memoizedState = n),
      t.baseQueue === null && (t.baseState = n),
      (a.lastRenderedState = n);
  }
  return [n, u];
}
function my(l, t, a) {
  var u = D,
    e = al(),
    n = Y;
  if (n) {
    if (a === void 0) throw Error(r(407));
    a = a();
  } else a = t();
  var f = !Cl((V || e).memoizedState, a);
  if (
    (f && ((e.memoizedState = a), (fl = !0)),
    (e = e.queue),
    lc(Sy.bind(null, u, e, l), [l]),
    e.getSnapshot !== t || f || (ul !== null && ul.memoizedState.tag & 1))
  ) {
    if (
      ((u.flags |= 2048),
      $a(9, { destroy: void 0 }, gy.bind(null, u, e, a, t), null),
      K === null)
    )
      throw Error(r(349));
    n || bt & 127 || hy(u, t, a);
  }
  return a;
}
function hy(l, t, a) {
  (l.flags |= 16384),
    (l = { getSnapshot: t, value: a }),
    (t = D.updateQueue),
    t === null
      ? ((t = On()), (D.updateQueue = t), (t.stores = [l]))
      : ((a = t.stores), a === null ? (t.stores = [l]) : a.push(l));
}
function gy(l, t, a, u) {
  (t.value = a), (t.getSnapshot = u), ry(t) && by(l);
}
function Sy(l, t, a) {
  return a(function () {
    ry(t) && by(l);
  });
}
function ry(l) {
  var t = l.getSnapshot;
  l = l.value;
  try {
    var a = t();
    return !Cl(l, a);
  } catch {
    return !0;
  }
}
function by(l) {
  var t = Sa(l, 2);
  t !== null && _l(t, l, 2);
}
function kf(l) {
  var t = rl();
  if (typeof l == 'function') {
    var a = l;
    if (((l = a()), va)) {
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
function zy(l, t, a, u) {
  return (l.baseState = a), Pi(l, V, typeof u == 'function' ? u : zt);
}
function $o(l, t, a, u, e) {
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
    _.T !== null ? a(!0) : (n.isTransition = !1),
      u(n),
      (a = t.pending),
      a === null
        ? ((n.next = t.pending = n), Ty(t, n))
        : ((n.next = a.next), (t.pending = a.next = n));
  }
}
function Ty(l, t) {
  var a = t.action,
    u = t.payload,
    e = l.state;
  if (t.isTransition) {
    var n = _.T,
      f = {};
    _.T = f;
    try {
      var i = a(e, u),
        c = _.S;
      c !== null && c(f, i), es(l, t, i);
    } catch (o) {
      If(l, t, o);
    } finally {
      n !== null && f.types !== null && (n.types = f.types), (_.T = n);
    }
  } else
    try {
      (n = a(e, u)), es(l, t, n);
    } catch (o) {
      If(l, t, o);
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
    Ey(t),
    (l.state = a),
    (t = l.pending),
    t !== null &&
      ((a = t.next),
      a === t ? (l.pending = null) : ((a = a.next), (t.next = a), Ty(l, a)));
}
function If(l, t, a) {
  var u = l.pending;
  if (((l.pending = null), u !== null)) {
    u = u.next;
    do (t.status = 'rejected'), (t.reason = a), Ey(t), (t = t.next);
    while (t !== u);
  }
  l.action = null;
}
function Ey(l) {
  l = l.listeners;
  for (var t = 0; t < l.length; t++) (0, l[t])();
}
function Ay(l, t) {
  return t;
}
function fs(l, t) {
  if (Y) {
    var a = K.formState;
    if (a !== null) {
      l: {
        var u = D;
        if (Y) {
          if ($) {
            t: {
              for (var e = $, n = Kl; e.nodeType !== 8; ) {
                if (!n) {
                  e = null;
                  break t;
                }
                if (((e = wl(e.nextSibling)), e === null)) {
                  e = null;
                  break t;
                }
              }
              (n = e.data), (e = n === 'F!' || n === 'F' ? e : null);
            }
            if (e) {
              ($ = wl(e.nextSibling)), (u = e.data === 'F!');
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
      lastRenderedReducer: Ay,
      lastRenderedState: t
    }),
    (a.queue = u),
    (a = Gy.bind(null, D, u)),
    (u.dispatch = a),
    (u = kf(!1)),
    (n = ec.bind(null, D, !1, u.queue)),
    (u = rl()),
    (e = { state: t, dispatch: null, action: l, pending: null }),
    (u.queue = e),
    (a = $o.bind(null, D, e, n, a)),
    (e.dispatch = a),
    (u.memoizedState = l),
    [t, a, !1]
  );
}
function is(l) {
  var t = al();
  return py(t, V, l);
}
function py(l, t, a) {
  if (
    ((t = Pi(l, t, Ay)[0]),
    (l = xe(zt)[0]),
    typeof t == 'object' && t !== null && typeof t.then == 'function')
  )
    try {
      var u = te(t);
    } catch (f) {
      throw f === eu ? Mn : f;
    }
  else u = t;
  t = al();
  var e = t.queue,
    n = e.dispatch;
  return (
    a !== t.memoizedState &&
      ((D.flags |= 2048),
      $a(9, { destroy: void 0 }, Wo.bind(null, e, a), null)),
    [u, n, l]
  );
}
function Wo(l, t) {
  l.action = t;
}
function cs(l) {
  var t = al(),
    a = V;
  if (a !== null) return py(t, a, l);
  al(), (t = t.memoizedState), (a = al());
  var u = a.queue.dispatch;
  return (a.memoizedState = l), [t, u, !1];
}
function $a(l, t, a, u) {
  return (
    (l = { tag: l, create: a, deps: u, inst: t, next: null }),
    (t = D.updateQueue),
    t === null && ((t = On()), (D.updateQueue = t)),
    (a = t.lastEffect),
    a === null
      ? (t.lastEffect = l.next = l)
      : ((u = a.next), (a.next = l), (l.next = u), (t.lastEffect = l)),
    l
  );
}
function _y() {
  return al().memoizedState;
}
function je(l, t, a, u) {
  var e = rl();
  (D.flags |= l),
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
    : ((D.flags |= l), (e.memoizedState = $a(1 | t, n, a, u)));
}
function ss(l, t) {
  je(8390656, 8, l, t);
}
function lc(l, t) {
  Un(2048, 8, l, t);
}
function Fo(l) {
  D.flags |= 4;
  var t = D.updateQueue;
  if (t === null) (t = On()), (D.updateQueue = t), (t.events = [l]);
  else {
    var a = t.events;
    a === null ? (t.events = [l]) : a.push(l);
  }
}
function My(l) {
  var t = al().memoizedState;
  return (
    Fo({ ref: t, nextImpl: l }),
    function () {
      if (G & 2) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    }
  );
}
function Oy(l, t) {
  return Un(4, 2, l, t);
}
function Dy(l, t) {
  return Un(4, 4, l, t);
}
function Uy(l, t) {
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
function Ny(l, t, a) {
  (a = a != null ? a.concat([l]) : null), Un(4, 4, Uy.bind(null, t, l), a);
}
function tc() {}
function Hy(l, t) {
  var a = al();
  t = t === void 0 ? null : t;
  var u = a.memoizedState;
  return t !== null && wi(t, u[1]) ? u[0] : ((a.memoizedState = [l, t]), l);
}
function xy(l, t) {
  var a = al();
  t = t === void 0 ? null : t;
  var u = a.memoizedState;
  if (t !== null && wi(t, u[1])) return u[0];
  if (((u = l()), va)) {
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
    : ((l.memoizedState = a), (l = zd()), (D.lanes |= l), (Wt |= l), a);
}
function jy(l, t, a, u) {
  return Cl(a, t)
    ? a
    : wa.current !== null
      ? ((l = ac(l, a, u)), Cl(l, t) || (fl = !0), l)
      : !(bt & 42) || (bt & 1073741824 && !(C & 261930))
        ? ((fl = !0), (l.memoizedState = a))
        : ((l = zd()), (D.lanes |= l), (Wt |= l), t);
}
function By(l, t, a, u, e) {
  var n = Q.p;
  Q.p = n !== 0 && 8 > n ? n : 8;
  var f = _.T,
    i = {};
  (_.T = i), ec(l, !1, t, a);
  try {
    var c = e(),
      o = _.S;
    if (
      (o !== null && o(i, c),
      c !== null && typeof c == 'object' && typeof c.then == 'function')
    ) {
      var g = Ko(c, u);
      Du(l, t, g, Rl(l));
    } else Du(l, t, u, Rl(l));
  } catch (h) {
    Du(l, t, { then: function () {}, status: 'rejected', reason: h }, Rl());
  } finally {
    (Q.p = n), f !== null && i.types !== null && (f.types = i.types), (_.T = f);
  }
}
function ko() {}
function Pf(l, t, a, u) {
  if (l.tag !== 5) throw Error(r(476));
  var e = Ry(l).queue;
  By(
    l,
    e,
    t,
    ea,
    a === null
      ? ko
      : function () {
          return Cy(l), a(u);
        }
  );
}
function Ry(l) {
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
function Cy(l) {
  var t = Ry(l);
  t.next === null && (t = l.alternate.memoizedState),
    Du(l, t.next.queue, {}, Rl());
}
function uc() {
  return gl(Ku);
}
function qy() {
  return al().memoizedState;
}
function Yy() {
  return al().memoizedState;
}
function Io(l) {
  for (var t = l.return; t !== null; ) {
    switch (t.tag) {
      case 24:
      case 3:
        var a = Rl();
        l = Gt(a);
        var u = Qt(t, l, a);
        u !== null && (_l(u, t, a), _u(u, t, a)),
          (t = { cache: Zi() }),
          (l.payload = t);
        return;
    }
    t = t.return;
  }
}
function Po(l, t, a) {
  var u = Rl();
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
      ? Qy(t, a)
      : ((a = Yi(l, t, a, u)), a !== null && (_l(a, l, u), Xy(a, t, u)));
}
function Gy(l, t, a) {
  var u = Rl();
  Du(l, t, a, u);
}
function Du(l, t, a, u) {
  var e = {
    lane: u,
    revertLane: 0,
    gesture: null,
    action: a,
    hasEagerState: !1,
    eagerState: null,
    next: null
  };
  if (Nn(l)) Qy(t, e);
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
        if (((e.hasEagerState = !0), (e.eagerState = i), Cl(i, f)))
          return _n(l, t, e, 0), K === null && pn(), !1;
      } catch {
      } finally {
      }
    if (((a = Yi(l, t, e, u)), a !== null)) return _l(a, l, u), Xy(a, t, u), !0;
  }
  return !1;
}
function ec(l, t, a, u) {
  if (
    ((u = {
      lane: 2,
      revertLane: oc(),
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
  return l === D || (t !== null && t === D);
}
function Qy(l, t) {
  Xa = Pe = !0;
  var a = l.pending;
  a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)),
    (l.pending = t);
}
function Xy(l, t, a) {
  if (a & 4194048) {
    var u = t.lanes;
    (u &= l.pendingLanes), (a |= u), (t.lanes = a), M0(l, a);
  }
}
var Zu = {
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
Zu.useEffectEvent = I;
var Zy = {
    readContext: gl,
    use: Dn,
    useCallback: function (l, t) {
      return (rl().memoizedState = [l, t === void 0 ? null : t]), l;
    },
    useContext: gl,
    useEffect: ss,
    useImperativeHandle: function (l, t, a) {
      (a = a != null ? a.concat([l]) : null),
        je(4194308, 4, Uy.bind(null, t, l), a);
    },
    useLayoutEffect: function (l, t) {
      return je(4194308, 4, l, t);
    },
    useInsertionEffect: function (l, t) {
      je(4, 2, l, t);
    },
    useMemo: function (l, t) {
      var a = rl();
      t = t === void 0 ? null : t;
      var u = l();
      if (va) {
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
        if (va) {
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
        (l = l.dispatch = Po.bind(null, D, l)),
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
        a = Gy.bind(null, D, t);
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
        (l = By.bind(null, D, l.queue, !0, !1)),
        (rl().memoizedState = l),
        [!1, l]
      );
    },
    useSyncExternalStore: function (l, t, a) {
      var u = D,
        e = rl();
      if (Y) {
        if (a === void 0) throw Error(r(407));
        a = a();
      } else {
        if (((a = t()), K === null)) throw Error(r(349));
        C & 127 || hy(u, t, a);
      }
      e.memoizedState = a;
      var n = { value: a, getSnapshot: t };
      return (
        (e.queue = n),
        ss(Sy.bind(null, u, n, l), [l]),
        (u.flags |= 2048),
        $a(9, { destroy: void 0 }, gy.bind(null, u, n, a, t), null),
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
      } else (a = Jo++), (t = '_' + t + 'r_' + a.toString(32) + '_');
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
        (t.queue = a), (t = ec.bind(null, D, !0, a)), (a.dispatch = t), [l, t]
      );
    },
    useMemoCache: Ii,
    useCacheRefresh: function () {
      return (rl().memoizedState = Io.bind(null, D));
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
    useCallback: Hy,
    useContext: gl,
    useEffect: lc,
    useImperativeHandle: Ny,
    useInsertionEffect: Oy,
    useLayoutEffect: Dy,
    useMemo: xy,
    useReducer: xe,
    useRef: _y,
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
      return [typeof l == 'boolean' ? l : te(l), t];
    },
    useSyncExternalStore: my,
    useId: qy,
    useHostTransitionStatus: uc,
    useFormState: is,
    useActionState: is,
    useOptimistic: function (l, t) {
      var a = al();
      return zy(a, V, l, t);
    },
    useMemoCache: Ii,
    useCacheRefresh: Yy
  };
nc.useEffectEvent = My;
var Ly = {
  readContext: gl,
  use: Dn,
  useCallback: Hy,
  useContext: gl,
  useEffect: lc,
  useImperativeHandle: Ny,
  useInsertionEffect: Oy,
  useLayoutEffect: Dy,
  useMemo: xy,
  useReducer: tf,
  useRef: _y,
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
    return [typeof l == 'boolean' ? l : te(l), t];
  },
  useSyncExternalStore: my,
  useId: qy,
  useHostTransitionStatus: uc,
  useFormState: cs,
  useActionState: cs,
  useOptimistic: function (l, t) {
    var a = al();
    return V !== null
      ? zy(a, V, l, t)
      : ((a.baseState = l), [l, a.queue.dispatch]);
  },
  useMemoCache: Ii,
  useCacheRefresh: Yy
};
Ly.useEffectEvent = My;
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
    var u = Rl(),
      e = Gt(u);
    (e.payload = t),
      a != null && (e.callback = a),
      (t = Qt(l, e, u)),
      t !== null && (_l(t, l, u), _u(t, l, u));
  },
  enqueueReplaceState: function (l, t, a) {
    l = l._reactInternals;
    var u = Rl(),
      e = Gt(u);
    (e.tag = 1),
      (e.payload = t),
      a != null && (e.callback = a),
      (t = Qt(l, e, u)),
      t !== null && (_l(t, l, u), _u(t, l, u));
  },
  enqueueForceUpdate: function (l, t) {
    l = l._reactInternals;
    var a = Rl(),
      u = Gt(a);
    (u.tag = 2),
      t != null && (u.callback = t),
      (t = Qt(l, u, a)),
      t !== null && (_l(t, l, a), _u(t, l, a));
  }
};
function ys(l, t, a, u, e, n, f) {
  return (
    (l = l.stateNode),
    typeof l.shouldComponentUpdate == 'function'
      ? l.shouldComponentUpdate(u, n, f)
      : t.prototype && t.prototype.isPureReactComponent
        ? !qu(a, u) || !qu(e, n)
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
function oa(l, t) {
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
function Vy(l) {
  Je(l);
}
function Ky(l) {
  console.error(l);
}
function Jy(l) {
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
function vs(l, t, a) {
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
function wy(l) {
  return (l = Gt(l)), (l.tag = 3), l;
}
function $y(l, t, a, u) {
  var e = a.type.getDerivedStateFromError;
  if (typeof e == 'function') {
    var n = u.value;
    (l.payload = function () {
      return e(n);
    }),
      (l.callback = function () {
        vs(t, a, u);
      });
  }
  var f = a.stateNode;
  f !== null &&
    typeof f.componentDidCatch == 'function' &&
    (l.callback = function () {
      vs(t, a, u),
        typeof e != 'function' &&
          (Xt === null ? (Xt = new Set([this])) : Xt.add(this));
      var i = u.stack;
      this.componentDidCatch(u.value, { componentStack: i !== null ? i : '' });
    });
}
function lm(l, t, a, u, e) {
  if (
    ((a.flags |= 32768),
    u !== null && typeof u == 'object' && typeof u.then == 'function')
  ) {
    if (
      ((t = a.alternate),
      t !== null && uu(t, a, e, !0),
      (a = ql.current),
      a !== null)
    ) {
      switch (a.tag) {
        case 31:
        case 13:
          return (
            Jl === null ? fn() : a.alternate === null && P === 0 && (P = 3),
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
      (t = ql.current),
      t !== null
        ? (!(t.flags & 65536) && (t.flags |= 256),
          (t.flags |= 65536),
          (t.lanes = e),
          u !== Zf && ((l = Error(r(422), { cause: u })), Gu(Vl(l, a))))
        : (u !== Zf && ((t = Error(r(423), { cause: u })), Gu(Vl(t, a))),
          (l = l.current.alternate),
          (l.flags |= 65536),
          (e &= -e),
          (l.lanes |= e),
          (u = Vl(u, a)),
          (e = ti(l.stateNode, u, e)),
          lf(l, e),
          P !== 4 && (P = 2)),
      !1
    );
  var n = Error(r(520), { cause: u });
  if (
    ((n = Vl(n, a)),
    Hu === null ? (Hu = [n]) : Hu.push(n),
    P !== 4 && (P = 2),
    t === null)
  )
    return !0;
  (u = Vl(u, a)), (a = t);
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
            (e = wy(e)),
            $y(e, l, a, u),
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
function ol(l, t, a, u) {
  t.child = l === null ? cy(t, null, a, u) : da(t, l.child, a, u);
}
function os(l, t, a, u, e) {
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
      : (Y && i && Qi(t), (t.flags |= 1), ol(l, t, u, e), t.child)
  );
}
function ms(l, t, a, u, e) {
  if (l === null) {
    var n = a.type;
    return typeof n == 'function' &&
      !Gi(n) &&
      n.defaultProps === void 0 &&
      a.compare === null
      ? ((t.tag = 15), (t.type = n), Wy(l, t, n, u, e))
      : ((l = Ne(a.type, null, u, t, t.mode, e)),
        (l.ref = t.ref),
        (l.return = t),
        (t.child = l));
  }
  if (((n = l.child), !ic(l, e))) {
    var f = n.memoizedProps;
    if (
      ((a = a.compare), (a = a !== null ? a : qu), a(f, u) && l.ref === t.ref)
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
function Wy(l, t, a, u, e) {
  if (l !== null) {
    var n = l.memoizedProps;
    if (qu(n, u) && l.ref === t.ref)
      if (((fl = !1), (t.pendingProps = u = n), ic(l, e)))
        l.flags & 131072 && (fl = !0);
      else return (t.lanes = l.lanes), Tt(l, t, e);
  }
  return ai(l, t, a, u, e);
}
function Fy(l, t, a, u) {
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
        dy(t);
    else
      return (
        (u = t.lanes = 536870912),
        hs(l, t, n !== null ? n.baseLanes | a : a, a, u)
      );
  } else
    n !== null
      ? (He(t, n.cachePool), us(t, n), Nt(), (t.memoizedState = null))
      : (l !== null && He(t, null), Wf(), Nt());
  return ol(l, t, e, a), t.child;
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
    dy(t),
    l !== null && uu(l, t, u, !0),
    (t.childLanes = e),
    null
  );
}
function Be(l, t) {
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
    (l = Be(t, t.pendingProps)),
    (l.flags |= 2),
    Ul(t),
    (t.memoizedState = null),
    l
  );
}
function tm(l, t, a) {
  var u = t.pendingProps,
    e = (t.flags & 128) !== 0;
  if (((t.flags &= -129), l === null)) {
    if (Y) {
      if (u.mode === 'hidden')
        return (l = Be(t, u)), (t.lanes = 536870912), ru(null, l);
      if (
        (Ff(t),
        (l = $)
          ? ((l = Zd(l, Kl)),
            (l = l !== null && l.data === '&' ? l : null),
            l !== null &&
              ((t.memoizedState = {
                dehydrated: l,
                treeContext: Jt !== null ? { id: Pl, overflow: lt } : null,
                retryLane: 536870912,
                hydrationErrors: null
              }),
              (a = ty(l)),
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
    return Be(t, u);
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
        ((u = K), u !== null && ((f = O0(u, a)), f !== 0 && f !== n.retryLane))
      )
        throw ((n.retryLane = f), Sa(l, f), _l(u, l, f), fc);
      fn(), (t = gs(l, t, a));
    } else
      (l = n.treeContext),
        ($ = wl(f.nextSibling)),
        (hl = t),
        (Y = !0),
        (Yt = null),
        (Kl = !1),
        l !== null && uy(t, l),
        (t = Be(t, u)),
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
function Re(l, t) {
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
      : (Y && u && Qi(t), (t.flags |= 1), ol(l, t, a, e), t.child)
  );
}
function Ss(l, t, a, u, e, n) {
  return (
    ya(t),
    (t.updateQueue = null),
    (a = oy(t, u, a, e)),
    vy(l),
    (u = Wi()),
    l !== null && !fl
      ? (Fi(l, t, n), Tt(l, t, n))
      : (Y && u && Qi(t), (t.flags |= 1), ol(l, t, a, n), t.child)
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
        Ou(t, u, n, e),
        Mu(),
        (n.state = t.memoizedState)),
      typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
      (u = !0);
  } else if (l === null) {
    n = t.stateNode;
    var i = t.memoizedProps,
      c = oa(a, i);
    n.props = c;
    var o = n.context,
      g = a.contextType;
    (f = xa), typeof g == 'object' && g !== null && (f = gl(g));
    var h = a.getDerivedStateFromProps;
    (g =
      typeof h == 'function' || typeof n.getSnapshotBeforeUpdate == 'function'),
      (i = t.pendingProps !== i),
      g ||
        (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
          typeof n.componentWillReceiveProps != 'function') ||
        ((i || o !== f) && ds(t, n, u, f)),
      (Ot = !1);
    var d = t.memoizedState;
    (n.state = d),
      Ou(t, u, n, e),
      Mu(),
      (o = t.memoizedState),
      i || d !== o || Ot
        ? (typeof h == 'function' && (af(t, a, h, u), (o = t.memoizedState)),
          (c = Ot || ys(t, a, c, u, d, o, f))
            ? (g ||
                (typeof n.UNSAFE_componentWillMount != 'function' &&
                  typeof n.componentWillMount != 'function') ||
                (typeof n.componentWillMount == 'function' &&
                  n.componentWillMount(),
                typeof n.UNSAFE_componentWillMount == 'function' &&
                  n.UNSAFE_componentWillMount()),
              typeof n.componentDidMount == 'function' && (t.flags |= 4194308))
            : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
              (t.memoizedProps = u),
              (t.memoizedState = o)),
          (n.props = u),
          (n.state = o),
          (n.context = f),
          (u = c))
        : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
          (u = !1));
  } else {
    (n = t.stateNode),
      wf(l, t),
      (f = t.memoizedProps),
      (g = oa(a, f)),
      (n.props = g),
      (h = t.pendingProps),
      (d = n.context),
      (o = a.contextType),
      (c = xa),
      typeof o == 'object' && o !== null && (c = gl(o)),
      (i = a.getDerivedStateFromProps),
      (o =
        typeof i == 'function' ||
        typeof n.getSnapshotBeforeUpdate == 'function') ||
        (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
          typeof n.componentWillReceiveProps != 'function') ||
        ((f !== h || d !== c) && ds(t, n, u, c)),
      (Ot = !1),
      (d = t.memoizedState),
      (n.state = d),
      Ou(t, u, n, e),
      Mu();
    var v = t.memoizedState;
    f !== h ||
    d !== v ||
    Ot ||
    (l !== null && l.dependencies !== null && We(l.dependencies))
      ? (typeof i == 'function' && (af(t, a, i, u), (v = t.memoizedState)),
        (g =
          Ot ||
          ys(t, a, g, u, d, v, c) ||
          (l !== null && l.dependencies !== null && We(l.dependencies)))
          ? (o ||
              (typeof n.UNSAFE_componentWillUpdate != 'function' &&
                typeof n.componentWillUpdate != 'function') ||
              (typeof n.componentWillUpdate == 'function' &&
                n.componentWillUpdate(u, v, c),
              typeof n.UNSAFE_componentWillUpdate == 'function' &&
                n.UNSAFE_componentWillUpdate(u, v, c)),
            typeof n.componentDidUpdate == 'function' && (t.flags |= 4),
            typeof n.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
          : (typeof n.componentDidUpdate != 'function' ||
              (f === l.memoizedProps && d === l.memoizedState) ||
              (t.flags |= 4),
            typeof n.getSnapshotBeforeUpdate != 'function' ||
              (f === l.memoizedProps && d === l.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = u),
            (t.memoizedState = v)),
        (n.props = u),
        (n.state = v),
        (n.context = c),
        (u = g))
      : (typeof n.componentDidUpdate != 'function' ||
          (f === l.memoizedProps && d === l.memoizedState) ||
          (t.flags |= 4),
        typeof n.getSnapshotBeforeUpdate != 'function' ||
          (f === l.memoizedProps && d === l.memoizedState) ||
          (t.flags |= 1024),
        (u = !1));
  }
  return (
    (n = u),
    Re(l, t),
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
          : ol(l, t, a, e),
        (t.memoizedState = n.state),
        (l = t.child))
      : (l = Tt(l, t, e)),
    l
  );
}
function bs(l, t, a, u) {
  return sa(), (t.flags |= 256), ol(l, t, a, u), t.child;
}
var uf = {
  dehydrated: null,
  treeContext: null,
  retryLane: 0,
  hydrationErrors: null
};
function ef(l) {
  return { baseLanes: l, cachePool: ny() };
}
function nf(l, t, a) {
  return (l = l !== null ? l.childLanes & ~a : 0), t && (l |= Hl), l;
}
function ky(l, t, a) {
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
          ? ((l = Zd(l, Kl)),
            (l = l !== null && l.data !== '&' ? l : null),
            l !== null &&
              ((t.memoizedState = {
                dehydrated: l,
                treeContext: Jt !== null ? { id: Pl, overflow: lt } : null,
                retryLane: 536870912,
                hydrationErrors: null
              }),
              (a = ty(l)),
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
      if (((f = i.nextSibling && i.nextSibling.dataset), f)) var o = f.dgst;
      (f = o),
        (u = Error(r(419))),
        (u.stack = ''),
        (u.digest = f),
        Gu({ value: u, source: null, stack: null }),
        (t = ff(l, t, a));
    } else if (
      (fl || uu(l, t, a, !1), (f = (a & l.childLanes) !== 0), fl || f)
    ) {
      if (
        ((f = K), f !== null && ((u = O0(f, a)), u !== 0 && u !== c.retryLane))
      )
        throw ((c.retryLane = u), Sa(l, u), _l(f, l, u), fc);
      hi(i) || fn(), (t = ff(l, t, a));
    } else
      hi(i)
        ? ((t.flags |= 192), (t.child = l.child), (t = null))
        : ((l = c.treeContext),
          ($ = wl(i.nextSibling)),
          (hl = t),
          (Y = !0),
          (Yt = null),
          (Kl = !1),
          l !== null && uy(t, l),
          (t = ui(t, u.children)),
          (t.flags |= 4096));
    return t;
  }
  return e
    ? (Nt(),
      (i = u.fallback),
      (e = t.mode),
      (c = l.child),
      (o = c.sibling),
      (u = ht(c, { mode: 'hidden', children: u.children })),
      (u.subtreeFlags = c.subtreeFlags & 65011712),
      o !== null ? (i = ht(o, i)) : ((i = na(i, e, a, null)), (i.flags |= 2)),
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
            : (e = ny()),
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
  return (l = Nl(22, l, null, t)), (l.lanes = 0), l;
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
function Iy(l, t, a) {
  var u = t.pendingProps,
    e = u.revealOrder,
    n = u.tail;
  u = u.children;
  var f = tl.current,
    i = (f & 2) !== 0;
  if (
    (i ? ((f = (f & 1) | 2), (t.flags |= 128)) : (f &= 1),
    J(tl, f),
    ol(l, t, u, a),
    (u = Y ? Yu : 0),
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
function am(l, t, a) {
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
            ? ky(l, t, a)
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
        if (u) return Iy(l, t, a);
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
      return (t.lanes = 0), Fy(l, t, a, t.pendingProps);
    case 24:
      Dt(t, nl, l.memoizedState.cache);
  }
  return Tt(l, t, a);
}
function Py(l, t, a) {
  if (l !== null)
    if (l.memoizedProps !== t.pendingProps) fl = !0;
    else {
      if (!ic(l, a) && !(t.flags & 128)) return (fl = !1), am(l, t, a);
      fl = !!(l.flags & 131072);
    }
  else (fl = !1), Y && t.flags & 1048576 && ay(t, Yu, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 16:
      l: {
        var u = t.pendingProps;
        if (((l = aa(t.elementType)), (t.type = l), typeof l == 'function'))
          Gi(l)
            ? ((u = oa(l, u)), (t.tag = 1), (t = rs(null, t, l, u, a)))
            : ((t.tag = 0), (t = ai(null, t, l, u, a)));
        else {
          if (l != null) {
            var e = l.$$typeof;
            if (e === _i) {
              (t.tag = 11), (t = os(null, t, l, u, a));
              break l;
            } else if (e === Mi) {
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
      return (u = t.type), (e = oa(u, t.pendingProps)), rs(l, t, u, e, a);
    case 3:
      l: {
        if ((Ze(t, t.stateNode.containerInfo), l === null)) throw Error(r(387));
        u = t.pendingProps;
        var n = t.memoizedState;
        (e = n.element), wf(l, t), Ou(t, u, null, a);
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
            (e = Vl(Error(r(424)), t)), Gu(e), (t = bs(l, t, u, a));
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
              $ = wl(l.firstChild),
                hl = t,
                Y = !0,
                Yt = null,
                Kl = !0,
                a = cy(t, null, u, a),
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
          ol(l, t, u, a);
        }
        t = t.child;
      }
      return t;
    case 26:
      return (
        Re(l, t),
        l === null
          ? (a = Qs(t.type, null, t.pendingProps, null))
            ? (t.memoizedState = a)
            : Y ||
              ((a = t.type),
              (l = t.pendingProps),
              (u = dn(qt.current).createElement(a)),
              (u[ml] = t),
              (u[Ml] = l),
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
          ((u = t.stateNode = Ld(t.type, t.pendingProps, qt.current)),
          (hl = t),
          (Kl = !0),
          (e = $),
          kt(t.type) ? ((Si = e), ($ = wl(u.firstChild))) : ($ = e)),
        ol(l, t, t.pendingProps.children, a),
        Re(l, t),
        l === null && (t.flags |= 4194304),
        t.child
      );
    case 5:
      return (
        l === null &&
          Y &&
          ((e = u = $) &&
            ((u = xm(u, t.type, t.pendingProps, Kl)),
            u !== null
              ? ((t.stateNode = u),
                (hl = t),
                ($ = wl(u.firstChild)),
                (Kl = !1),
                (e = !0))
              : (e = !1)),
          e || wt(t)),
        Hf(t),
        (e = t.type),
        (n = t.pendingProps),
        (f = l !== null ? l.memoizedProps : null),
        (u = n.children),
        oi(e, n) ? (u = null) : f !== null && oi(e, f) && (t.flags |= 32),
        t.memoizedState !== null &&
          ((e = $i(l, t, wo, null, null, a)), (Ku._currentValue = e)),
        Re(l, t),
        ol(l, t, u, a),
        t.child
      );
    case 6:
      return (
        l === null &&
          Y &&
          ((l = a = $) &&
            ((a = jm(a, t.pendingProps, Kl)),
            a !== null
              ? ((t.stateNode = a), (hl = t), ($ = null), (l = !0))
              : (l = !1)),
          l || wt(t)),
        null
      );
    case 13:
      return ky(l, t, a);
    case 4:
      return (
        Ze(t, t.stateNode.containerInfo),
        (u = t.pendingProps),
        l === null ? (t.child = da(t, null, u, a)) : ol(l, t, u, a),
        t.child
      );
    case 11:
      return os(l, t, t.type, t.pendingProps, a);
    case 7:
      return ol(l, t, t.pendingProps, a), t.child;
    case 8:
      return ol(l, t, t.pendingProps.children, a), t.child;
    case 12:
      return ol(l, t, t.pendingProps.children, a), t.child;
    case 10:
      return (
        (u = t.pendingProps),
        Dt(t, t.type, u.value),
        ol(l, t, u.children, a),
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
        ol(l, t, u, a),
        t.child
      );
    case 14:
      return ms(l, t, t.type, t.pendingProps, a);
    case 15:
      return Wy(l, t, t.type, t.pendingProps, a);
    case 19:
      return Iy(l, t, a);
    case 31:
      return tm(l, t, a);
    case 22:
      return Fy(l, t, a, t.pendingProps);
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
          : (l.lanes & a && (wf(l, t), Ou(t, null, null, a), Mu()),
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
        ol(l, t, t.pendingProps.children, a),
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
      else if (Ad()) l.flags |= 8192;
      else throw ((ia = Fe), Vi);
  } else l.flags &= -16777217;
}
function Ts(l, t) {
  if (t.type !== 'stylesheet' || t.state.loading & 4) l.flags &= -16777217;
  else if (((l.flags |= 16777216), !Jd(t)))
    if (Ad()) l.flags |= 8192;
    else throw ((ia = Fe), Vi);
}
function be(l, t) {
  t !== null && (l.flags |= 4),
    l.flags & 16384 &&
      ((t = l.tag !== 22 ? p0() : 536870912), (l.lanes |= t), (Wa |= t));
}
function vu(l, t) {
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
function um(l, t, a) {
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
          ba(t) ? Fc(t) : ((l = Ld(e, u, a)), (t.stateNode = l), ft(t));
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
          (n[ml] = t), (n[Ml] = u);
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
              Gd(l.nodeValue, a)
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
        if (!l) return t.flags & 256 ? (Ul(t), t) : (Ul(t), null);
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
        if (!e) return t.flags & 256 ? (Ul(t), t) : (Ul(t), null);
      }
      return (
        Ul(t),
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
            be(t, t.updateQueue),
            w(t),
            null)
      );
    case 4:
      return La(), l === null && mc(t.stateNode.containerInfo), w(t), null;
    case 10:
      return gt(t.type), w(t), null;
    case 19:
      if ((vl(tl), (u = t.memoizedState), u === null)) return w(t), null;
      if (((e = (t.flags & 128) !== 0), (n = u.rendering), n === null))
        if (e) vu(u, !1);
        else {
          if (P !== 0 || (l !== null && l.flags & 128))
            for (l = t.child; l !== null; ) {
              if (((n = Ie(l)), n !== null)) {
                for (
                  t.flags |= 128,
                    vu(u, !1),
                    l = n.updateQueue,
                    t.updateQueue = l,
                    be(t, l),
                    t.subtreeFlags = 0,
                    l = a,
                    a = t.child;
                  a !== null;

                )
                  ly(a, l), (a = a.sibling);
                return (
                  J(tl, (tl.current & 1) | 2),
                  Y && yt(t, u.treeForkCount),
                  t.child
                );
              }
              l = l.sibling;
            }
          u.tail !== null &&
            xl() > en &&
            ((t.flags |= 128), (e = !0), vu(u, !1), (t.lanes = 4194304));
        }
      else {
        if (!e)
          if (((l = Ie(n)), l !== null)) {
            if (
              ((t.flags |= 128),
              (e = !0),
              (l = l.updateQueue),
              (t.updateQueue = l),
              be(t, l),
              vu(u, !0),
              u.tail === null && u.tailMode === 'hidden' && !n.alternate && !Y)
            )
              return w(t), null;
          } else
            2 * xl() - u.renderingStartTime > en &&
              a !== 536870912 &&
              ((t.flags |= 128), (e = !0), vu(u, !1), (t.lanes = 4194304));
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
          (u.renderingStartTime = xl()),
          (l.sibling = null),
          (a = tl.current),
          J(tl, e ? (a & 1) | 2 : a & 1),
          Y && yt(t, u.treeForkCount),
          l)
        : (w(t), null);
    case 22:
    case 23:
      return (
        Ul(t),
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
        a !== null && be(t, a.retryQueue),
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
        l !== null && vl(fa),
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
function em(l, t) {
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
        if ((Ul(t), t.alternate === null)) throw Error(r(340));
        sa();
      }
      return (
        (l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
      );
    case 13:
      if ((Ul(t), (l = t.memoizedState), l !== null && l.dehydrated !== null)) {
        if (t.alternate === null) throw Error(r(340));
        sa();
      }
      return (
        (l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
      );
    case 19:
      return vl(tl), null;
    case 4:
      return La(), null;
    case 10:
      return gt(t.type), null;
    case 22:
    case 23:
      return (
        Ul(t),
        Ji(),
        l !== null && vl(fa),
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
function ld(l, t) {
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
      t.memoizedState !== null && Ul(t);
      break;
    case 13:
      Ul(t);
      break;
    case 19:
      vl(tl);
      break;
    case 10:
      gt(t.type);
      break;
    case 22:
    case 23:
      Ul(t), Ji(), l !== null && vl(fa);
      break;
    case 24:
      gt(nl);
  }
}
function ae(l, t) {
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
              o = i;
            try {
              o();
            } catch (g) {
              Z(e, c, g);
            }
          }
        }
        u = u.next;
      } while (u !== n);
    }
  } catch (g) {
    Z(t, t.return, g);
  }
}
function td(l) {
  var t = l.updateQueue;
  if (t !== null) {
    var a = l.stateNode;
    try {
      yy(t, a);
    } catch (u) {
      Z(l, l.return, u);
    }
  }
}
function ad(l, t, a) {
  (a.props = oa(l.type, l.memoizedProps)), (a.state = l.memoizedState);
  try {
    a.componentWillUnmount();
  } catch (u) {
    Z(l, t, u);
  }
}
function Uu(l, t) {
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
function ud(l) {
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
    Mm(u, l.type, a, t), (u[Ml] = t);
  } catch (e) {
    Z(l, l.return, e);
  }
}
function ed(l) {
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
      if (l.return === null || ed(l.return)) return null;
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
          a != null || t.onclick !== null || (t.onclick = ot));
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
function nd(l) {
  var t = l.stateNode,
    a = l.memoizedProps;
  try {
    for (var u = l.type, e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    Sl(t, u, a), (t[ml] = l), (t[Ml] = a);
  } catch (n) {
    Z(l, l.return, n);
  }
}
var dt = !1,
  el = !1,
  vf = !1,
  Es = typeof WeakSet == 'function' ? WeakSet : Set,
  yl = null;
function nm(l, t) {
  if (((l = l.containerInfo), (di = hn), (l = J0(l)), Ci(l))) {
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
            o = 0,
            g = 0,
            h = l,
            d = null;
          t: for (;;) {
            for (
              var v;
              h !== a || (e !== 0 && h.nodeType !== 3) || (i = f + e),
                h !== n || (u !== 0 && h.nodeType !== 3) || (c = f + u),
                h.nodeType === 3 && (f += h.nodeValue.length),
                (v = h.firstChild) !== null;

            )
              (d = h), (h = v);
            for (;;) {
              if (h === l) break t;
              if (
                (d === a && ++o === e && (i = f),
                d === n && ++g === u && (c = f),
                (v = h.nextSibling) !== null)
              )
                break;
              (h = d), (d = h.parentNode);
            }
            h = v;
          }
          a = i === -1 || c === -1 ? null : { start: i, end: c };
        } else a = null;
      }
    a = a || { start: 0, end: 0 };
  } else a = null;
  for (
    vi = { focusedElem: l, selectionRange: a }, hn = !1, yl = t;
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
                var b = oa(a.type, e);
                (l = u.getSnapshotBeforeUpdate(b, n)),
                  (u.__reactInternalSnapshotBeforeUpdate = l);
              } catch (E) {
                Z(a, a.return, E);
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
function fd(l, t, a) {
  var u = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 15:
      ct(l, a), u & 4 && ae(5, a);
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
          var e = oa(a.type, t.memoizedProps);
          t = t.memoizedState;
          try {
            l.componentDidUpdate(e, t, l.__reactInternalSnapshotBeforeUpdate);
          } catch (f) {
            Z(a, a.return, f);
          }
        }
      u & 64 && td(a), u & 512 && Uu(a, a.return);
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
          yy(l, t);
        } catch (f) {
          Z(a, a.return, f);
        }
      }
      break;
    case 27:
      t === null && u & 4 && nd(a);
    case 26:
    case 5:
      ct(l, a), t === null && u & 4 && ud(a), u & 512 && Uu(a, a.return);
      break;
    case 12:
      ct(l, a);
      break;
    case 31:
      ct(l, a), u & 4 && sd(l, a);
      break;
    case 13:
      ct(l, a),
        u & 4 && yd(l, a),
        u & 64 &&
          ((l = a.memoizedState),
          l !== null &&
            ((l = l.dehydrated),
            l !== null && ((a = mm.bind(null, a)), Bm(l, a))));
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
function id(l) {
  var t = l.alternate;
  t !== null && ((l.alternate = null), id(t)),
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
  for (a = a.child; a !== null; ) cd(l, t, a), (a = a.sibling);
}
function cd(l, t, a) {
  if (jl && typeof jl.onCommitFiberUnmount == 'function')
    try {
      jl.onCommitFiberUnmount(Wu, a);
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
            Rs(
              l.nodeType === 9
                ? l.body
                : l.nodeName === 'HTML'
                  ? l.ownerDocument.body
                  : l,
              a.stateNode
            ),
            Pa(l))
          : Rs(k, a.stateNode));
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
        typeof u.componentWillUnmount == 'function' && ad(a, t, u)),
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
function sd(l, t) {
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
function yd(l, t) {
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
function fm(l) {
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
function ze(l, t) {
  var a = fm(l);
  t.forEach(function (u) {
    if (!a.has(u)) {
      a.add(u);
      var e = hm.bind(null, l, u);
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
      cd(n, f, e),
        (k = null),
        (Al = !1),
        (n = e.alternate),
        n !== null && (n.return = null),
        (e.return = null);
    }
  if (t.subtreeFlags & 13886)
    for (t = t.child; t !== null; ) dd(t, l), (t = t.sibling);
}
var Fl = null;
function dd(l, t) {
  var a = l.alternate,
    u = l.flags;
  switch (l.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      Tl(t, l),
        El(l),
        u & 4 && ($t(3, l, l.return), ae(3, l), $t(5, l, l.return));
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
      var e = Fl;
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
                        n[Iu] ||
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
        } catch (b) {
          Z(l, l.return, b);
        }
      }
      u & 4 &&
        l.stateNode != null &&
        ((e = l.memoizedProps), yf(l, e, a !== null ? a.memoizedProps : e)),
        u & 1024 && (vf = !0);
      break;
    case 6:
      if ((Tl(t, l), El(l), u & 4)) {
        if (l.stateNode === null) throw Error(r(162));
        (u = l.memoizedProps), (a = l.stateNode);
        try {
          a.nodeValue = u;
        } catch (b) {
          Z(l, l.return, b);
        }
      }
      break;
    case 3:
      if (
        ((Ye = null),
        (e = Fl),
        (Fl = vn(t.containerInfo)),
        Tl(t, l),
        (Fl = e),
        El(l),
        u & 4 && a !== null && a.memoizedState.isDehydrated)
      )
        try {
          Pa(t.containerInfo);
        } catch (b) {
          Z(l, l.return, b);
        }
      vf && ((vf = !1), vd(l));
      break;
    case 4:
      (u = Fl), (Fl = vn(l.stateNode.containerInfo)), Tl(t, l), El(l), (Fl = u);
      break;
    case 12:
      Tl(t, l), El(l);
      break;
    case 31:
      Tl(t, l),
        El(l),
        u & 4 &&
          ((u = l.updateQueue),
          u !== null && ((l.updateQueue = null), ze(l, u)));
      break;
    case 13:
      Tl(t, l),
        El(l),
        l.child.flags & 8192 &&
          (l.memoizedState !== null) !=
            (a !== null && a.memoizedState !== null) &&
          (Hn = xl()),
        u & 4 &&
          ((u = l.updateQueue),
          u !== null && ((l.updateQueue = null), ze(l, u)));
      break;
    case 22:
      e = l.memoizedState !== null;
      var c = a !== null && a.memoizedState !== null,
        o = dt,
        g = el;
      if (
        ((dt = o || e),
        (el = g || c),
        Tl(t, l),
        (el = g),
        (dt = o),
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
                  var h = c.memoizedProps.style,
                    d =
                      h != null && h.hasOwnProperty('display')
                        ? h.display
                        : null;
                  i.style.display =
                    d == null || typeof d == 'boolean' ? '' : ('' + d).trim();
                }
              } catch (b) {
                Z(c, c.return, b);
              }
            }
          } else if (t.tag === 6) {
            if (a === null) {
              c = t;
              try {
                c.stateNode.nodeValue = e ? '' : c.memoizedProps;
              } catch (b) {
                Z(c, c.return, b);
              }
            }
          } else if (t.tag === 18) {
            if (a === null) {
              c = t;
              try {
                var v = c.stateNode;
                e ? Cs(v, !0) : Cs(c.stateNode, !1);
              } catch (b) {
                Z(c, c.return, b);
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
          a !== null && ((u.retryQueue = null), ze(l, a))));
      break;
    case 19:
      Tl(t, l),
        El(l),
        u & 4 &&
          ((u = l.updateQueue),
          u !== null && ((l.updateQueue = null), ze(l, u)));
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
        if (ed(u)) {
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
            o = df(l);
          ei(l, o, c);
          break;
        default:
          throw Error(r(161));
      }
    } catch (g) {
      Z(l, l.return, g);
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
    for (t = t.child; t !== null; ) fd(l, t.alternate, t), (t = t.sibling);
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
        typeof a.componentWillUnmount == 'function' && ad(t, t.return, a),
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
        st(e, n, a), ae(4, n);
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
          } catch (o) {
            Z(u, u.return, o);
          }
        if (((u = n), (e = u.updateQueue), e !== null)) {
          var i = u.stateNode;
          try {
            var c = e.shared.hiddenCallbacks;
            if (c !== null)
              for (e.shared.hiddenCallbacks = null, e = 0; e < c.length; e++)
                sy(c[e], i);
          } catch (o) {
            Z(u, u.return, o);
          }
        }
        a && f & 64 && td(n), Uu(n, n.return);
        break;
      case 27:
        nd(n);
      case 26:
      case 5:
        st(e, n, a), a && u === null && f & 4 && ud(n), Uu(n, n.return);
        break;
      case 12:
        st(e, n, a);
        break;
      case 31:
        st(e, n, a), a && f & 4 && sd(e, n);
        break;
      case 13:
        st(e, n, a), a && f & 4 && yd(e, n);
        break;
      case 22:
        n.memoizedState === null && st(e, n, a), Uu(n, n.return);
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
    l !== a && (l != null && l.refCount++, a != null && le(a));
}
function sc(l, t) {
  (l = null),
    t.alternate !== null && (l = t.alternate.memoizedState.cache),
    (t = t.memoizedState.cache),
    t !== l && (t.refCount++, l != null && le(l));
}
function Wl(l, t, a, u) {
  if (t.subtreeFlags & 10256)
    for (t = t.child; t !== null; ) od(l, t, a, u), (t = t.sibling);
}
function od(l, t, a, u) {
  var e = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 15:
      Wl(l, t, a, u), e & 2048 && ae(9, t);
      break;
    case 1:
      Wl(l, t, a, u);
      break;
    case 3:
      Wl(l, t, a, u),
        e & 2048 &&
          ((l = null),
          t.alternate !== null && (l = t.alternate.memoizedState.cache),
          (t = t.memoizedState.cache),
          t !== l && (t.refCount++, l != null && le(l)));
      break;
    case 12:
      if (e & 2048) {
        Wl(l, t, a, u), (l = t.stateNode);
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
      } else Wl(l, t, a, u);
      break;
    case 31:
      Wl(l, t, a, u);
      break;
    case 13:
      Wl(l, t, a, u);
      break;
    case 23:
      break;
    case 22:
      (n = t.stateNode),
        (f = t.alternate),
        t.memoizedState !== null
          ? n._visibility & 2
            ? Wl(l, t, a, u)
            : Nu(l, t)
          : n._visibility & 2
            ? Wl(l, t, a, u)
            : ((n._visibility |= 2),
              Ea(l, t, a, u, (t.subtreeFlags & 10256) !== 0 || !1)),
        e & 2048 && cc(f, t);
      break;
    case 24:
      Wl(l, t, a, u), e & 2048 && sc(t.alternate, t);
      break;
    default:
      Wl(l, t, a, u);
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
      o = f.flags;
    switch (f.tag) {
      case 0:
      case 11:
      case 15:
        Ea(n, f, i, c, e), ae(8, f);
        break;
      case 23:
        break;
      case 22:
        var g = f.stateNode;
        f.memoizedState !== null
          ? g._visibility & 2
            ? Ea(n, f, i, c, e)
            : Nu(n, f)
          : ((g._visibility |= 2), Ea(n, f, i, c, e)),
          e && o & 2048 && cc(f.alternate, f);
        break;
      case 24:
        Ea(n, f, i, c, e), e && o & 2048 && sc(f.alternate, f);
        break;
      default:
        Ea(n, f, i, c, e);
    }
    t = t.sibling;
  }
}
function Nu(l, t) {
  if (t.subtreeFlags & 10256)
    for (t = t.child; t !== null; ) {
      var a = l,
        u = t,
        e = u.flags;
      switch (u.tag) {
        case 22:
          Nu(a, u), e & 2048 && cc(u.alternate, u);
          break;
        case 24:
          Nu(a, u), e & 2048 && sc(u.alternate, u);
          break;
        default:
          Nu(a, u);
      }
      t = t.sibling;
    }
}
var bu = 8192;
function za(l, t, a) {
  if (l.subtreeFlags & bu)
    for (l = l.child; l !== null; ) md(l, t, a), (l = l.sibling);
}
function md(l, t, a) {
  switch (l.tag) {
    case 26:
      za(l, t, a),
        l.flags & bu &&
          l.memoizedState !== null &&
          Jm(a, Fl, l.memoizedState, l.memoizedProps);
      break;
    case 5:
      za(l, t, a);
      break;
    case 3:
    case 4:
      var u = Fl;
      (Fl = vn(l.stateNode.containerInfo)), za(l, t, a), (Fl = u);
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
function hd(l) {
  var t = l.alternate;
  if (t !== null && ((l = t.child), l !== null)) {
    t.child = null;
    do (t = l.sibling), (l.sibling = null), (l = t);
    while (l !== null);
  }
}
function ou(l) {
  var t = l.deletions;
  if (l.flags & 16) {
    if (t !== null)
      for (var a = 0; a < t.length; a++) {
        var u = t[a];
        (yl = u), Sd(u, l);
      }
    hd(l);
  }
  if (l.subtreeFlags & 10256)
    for (l = l.child; l !== null; ) gd(l), (l = l.sibling);
}
function gd(l) {
  switch (l.tag) {
    case 0:
    case 11:
    case 15:
      ou(l), l.flags & 2048 && $t(9, l, l.return);
      break;
    case 3:
      ou(l);
      break;
    case 12:
      ou(l);
      break;
    case 22:
      var t = l.stateNode;
      l.memoizedState !== null &&
      t._visibility & 2 &&
      (l.return === null || l.return.tag !== 13)
        ? ((t._visibility &= -3), Ce(l))
        : ou(l);
      break;
    default:
      ou(l);
  }
}
function Ce(l) {
  var t = l.deletions;
  if (l.flags & 16) {
    if (t !== null)
      for (var a = 0; a < t.length; a++) {
        var u = t[a];
        (yl = u), Sd(u, l);
      }
    hd(l);
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
function Sd(l, t) {
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
        le(a.memoizedState.cache);
    }
    if (((u = a.child), u !== null)) (u.return = a), (yl = u);
    else
      l: for (a = l; yl !== null; ) {
        u = yl;
        var e = u.sibling,
          n = u.return;
        if ((id(u), u === a)) {
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
var im = {
    getCacheForType: function (l) {
      var t = gl(nl),
        a = t.data.get(l);
      return a === void 0 && ((a = l()), t.data.set(l, a)), a;
    },
    cacheSignal: function () {
      return gl(nl).controller.signal;
    }
  },
  cm = typeof WeakMap == 'function' ? WeakMap : Map,
  G = 0,
  K = null,
  B = null,
  C = 0,
  X = 0,
  Dl = null,
  Bt = !1,
  nu = !1,
  yc = !1,
  Et = 0,
  P = 0,
  Wt = 0,
  ca = 0,
  dc = 0,
  Hl = 0,
  Wa = 0,
  Hu = null,
  pl = null,
  ni = !1,
  Hn = 0,
  rd = 0,
  en = 1 / 0,
  nn = null,
  Xt = null,
  il = 0,
  Zt = null,
  Fa = null,
  St = 0,
  fi = 0,
  ii = null,
  bd = null,
  xu = 0,
  ci = null;
function Rl() {
  return G & 2 && C !== 0 ? C & -C : _.T !== null ? oc() : D0();
}
function zd() {
  if (Hl === 0)
    if (!(C & 536870912) || Y) {
      var l = ve;
      (ve <<= 1), !(ve & 3932160) && (ve = 262144), (Hl = l);
    } else Hl = 536870912;
  return (l = ql.current), l !== null && (l.flags |= 32), Hl;
}
function _l(l, t, a) {
  ((l === K && (X === 2 || X === 9)) || l.cancelPendingCommit !== null) &&
    (ka(l, 0), Rt(l, C, Hl, !1)),
    ku(l, a),
    (!(G & 2) || l !== K) &&
      (l === K && (!(G & 2) && (ca |= a), P === 4 && Rt(l, C, Hl, !1)), et(l));
}
function Td(l, t, a) {
  if (G & 6) throw Error(r(327));
  var u = (!a && (t & 127) === 0 && (t & l.expiredLanes) === 0) || Fu(l, t),
    e = u ? dm(l, t) : of(l, t, !0),
    n = u;
  do {
    if (e === 0) {
      nu && !u && Rt(l, t, 0, !1);
      break;
    } else {
      if (((a = l.current.alternate), n && !sm(a))) {
        (e = of(l, t, !1)), (n = !1);
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
            e = Hu;
            var c = i.current.memoizedState.isDehydrated;
            if ((c && (ka(i, f).flags |= 256), (f = of(i, f, !1)), f !== 2)) {
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
        ka(l, 0), Rt(l, t, 0, !0);
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
            Rt(u, t, Hl, !Bt);
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
        if ((t & 62914560) === t && ((e = Hn + 300 - xl()), 10 < e)) {
          if ((Rt(u, t, Hl, !Bt), zn(u, 0, !0) !== 0)) break l;
          (St = t),
            (u.timeoutHandle = Xd(
              As.bind(
                null,
                u,
                a,
                pl,
                nn,
                ni,
                t,
                Hl,
                ca,
                Wa,
                Bt,
                n,
                'Throttled',
                -0,
                0
              ),
              e
            ));
          break l;
        }
        As(u, a, pl, nn, ni, t, Hl, ca, Wa, Bt, n, null, -0, 0);
      }
    }
    break;
  } while (!0);
  et(l);
}
function As(l, t, a, u, e, n, f, i, c, o, g, h, d, v) {
  if (
    ((l.timeoutHandle = -1),
    (h = t.subtreeFlags),
    h & 8192 || (h & 16785408) === 16785408)
  ) {
    (h = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: ot
    }),
      md(t, n, h);
    var b =
      (n & 62914560) === n ? Hn - xl() : (n & 4194048) === n ? rd - xl() : 0;
    if (((b = wm(h, b)), b !== null)) {
      (St = n),
        (l.cancelPendingCommit = b(
          _s.bind(null, l, t, n, a, u, e, f, i, c, g, h, null, d, v)
        )),
        Rt(l, n, f, !o);
      return;
    }
  }
  _s(l, t, n, a, u, e, f, i, c);
}
function sm(l) {
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
          if (!Cl(n(), e)) return !1;
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
function Rt(l, t, a, u) {
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
  a !== 0 && _0(l, a, t);
}
function xn() {
  return G & 6 ? !0 : (ue(0), !1);
}
function vc() {
  if (B !== null) {
    if (X === 0) var l = B.return;
    else (l = B), (mt = ra = null), ki(l), (Qa = null), (Qu = 0), (l = B);
    for (; l !== null; ) ld(l.alternate, l), (l = l.return);
    B = null;
  }
}
function ka(l, t) {
  var a = l.timeoutHandle;
  a !== -1 && ((l.timeoutHandle = -1), Um(a)),
    (a = l.cancelPendingCommit),
    a !== null && ((l.cancelPendingCommit = null), a()),
    (St = 0),
    vc(),
    (K = l),
    (B = a = ht(l.current, null)),
    (C = t),
    (X = 0),
    (Dl = null),
    (Bt = !1),
    (nu = Fu(l, t)),
    (yc = !1),
    (Wa = Hl = dc = ca = Wt = P = 0),
    (pl = Hu = null),
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
function Ed(l, t) {
  (D = null),
    (_.H = Zu),
    t === eu || t === Mn
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
    B === null && ((P = 1), tn(l, Vl(t, l.current)));
}
function Ad() {
  var l = ql.current;
  return l === null
    ? !0
    : (C & 4194048) === C
      ? Jl === null
      : (C & 62914560) === C || C & 536870912
        ? l === Jl
        : !1;
}
function pd() {
  var l = _.H;
  return (_.H = Zu), l === null ? Zu : l;
}
function _d() {
  var l = _.A;
  return (_.A = im), l;
}
function fn() {
  (P = 4),
    Bt || ((C & 4194048) !== C && ql.current !== null) || (nu = !0),
    (!(Wt & 134217727) && !(ca & 134217727)) || K === null || Rt(K, C, Hl, !1);
}
function of(l, t, a) {
  var u = G;
  G |= 2;
  var e = pd(),
    n = _d();
  (K !== l || C !== t) && ((nn = null), ka(l, t)), (t = !1);
  var f = P;
  l: do
    try {
      if (X !== 0 && B !== null) {
        var i = B,
          c = Dl;
        switch (X) {
          case 8:
            vc(), (f = 6);
            break l;
          case 3:
          case 2:
          case 9:
          case 6:
            ql.current === null && (t = !0);
            var o = X;
            if (((X = 0), (Dl = null), Ra(l, i, c, o), a && nu)) {
              f = 0;
              break l;
            }
            break;
          default:
            (o = X), (X = 0), (Dl = null), Ra(l, i, c, o);
        }
      }
      ym(), (f = P);
      break;
    } catch (g) {
      Ed(l, g);
    }
  while (!0);
  return (
    t && l.shellSuspendCounter++,
    (mt = ra = null),
    (G = u),
    (_.H = e),
    (_.A = n),
    B === null && ((K = null), (C = 0), pn()),
    f
  );
}
function ym() {
  for (; B !== null; ) Md(B);
}
function dm(l, t) {
  var a = G;
  G |= 2;
  var u = pd(),
    e = _d();
  K !== l || C !== t
    ? ((nn = null), (en = xl() + 500), ka(l, t))
    : (nu = Fu(l, t));
  l: do
    try {
      if (X !== 0 && B !== null) {
        t = B;
        var n = Dl;
        t: switch (X) {
          case 1:
            (X = 0), (Dl = null), Ra(l, t, n, 1);
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
              : ((X = 0), (Dl = null), Ra(l, t, n, 7));
            break;
          case 5:
            var f = null;
            switch (B.tag) {
              case 26:
                f = B.memoizedState;
              case 5:
              case 27:
                var i = B;
                if (f ? Jd(f) : i.stateNode.complete) {
                  (X = 0), (Dl = null);
                  var c = i.sibling;
                  if (c !== null) B = c;
                  else {
                    var o = i.return;
                    o !== null ? ((B = o), jn(o)) : (B = null);
                  }
                  break t;
                }
            }
            (X = 0), (Dl = null), Ra(l, t, n, 5);
            break;
          case 6:
            (X = 0), (Dl = null), Ra(l, t, n, 6);
            break;
          case 8:
            vc(), (P = 6);
            break l;
          default:
            throw Error(r(462));
        }
      }
      vm();
      break;
    } catch (g) {
      Ed(l, g);
    }
  while (!0);
  return (
    (mt = ra = null),
    (_.H = u),
    (_.A = e),
    (G = a),
    B !== null ? 0 : ((K = null), (C = 0), pn(), P)
  );
}
function vm() {
  for (; B !== null && !Bv(); ) Md(B);
}
function Md(l) {
  var t = Py(l.alternate, l, Et);
  (l.memoizedProps = l.pendingProps), t === null ? jn(l) : (B = t);
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
      ld(a, t), (t = B = ly(t, Et)), (t = Py(a, t, Et));
  }
  (l.memoizedProps = l.pendingProps), t === null ? jn(l) : (B = t);
}
function Ra(l, t, a, u) {
  (mt = ra = null), ki(t), (Qa = null), (Qu = 0);
  var e = t.return;
  try {
    if (lm(l, e, t, a, C)) {
      (P = 1), tn(l, Vl(a, l.current)), (B = null);
      return;
    }
  } catch (n) {
    if (e !== null) throw ((B = e), n);
    (P = 1), tn(l, Vl(a, l.current)), (B = null);
    return;
  }
  t.flags & 32768
    ? (Y || u === 1
        ? (l = !0)
        : nu || C & 536870912
          ? (l = !1)
          : ((Bt = l = !0),
            (u === 2 || u === 9 || u === 3 || u === 6) &&
              ((u = ql.current),
              u !== null && u.tag === 13 && (u.flags |= 16384))),
      Od(t, l))
    : jn(t);
}
function jn(l) {
  var t = l;
  do {
    if (t.flags & 32768) {
      Od(t, Bt);
      return;
    }
    l = t.return;
    var a = um(t.alternate, t, Et);
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
function Od(l, t) {
  do {
    var a = em(l.alternate, l);
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
  do Bn();
  while (il !== 0);
  if (G & 6) throw Error(r(327));
  if (t !== null) {
    if (t === l.current) throw Error(r(177));
    if (
      ((n = t.lanes | t.childLanes),
      (n |= qi),
      Vv(l, a, n, f, i, c),
      l === K && ((B = K = null), (C = 0)),
      (Fa = t),
      (Zt = l),
      (St = a),
      (fi = n),
      (ii = e),
      (bd = u),
      t.subtreeFlags & 10256 || t.flags & 10256
        ? ((l.callbackNode = null),
          (l.callbackPriority = 0),
          gm(Ve, function () {
            return xd(), null;
          }))
        : ((l.callbackNode = null), (l.callbackPriority = 0)),
      (u = (t.flags & 13878) !== 0),
      t.subtreeFlags & 13878 || u)
    ) {
      (u = _.T), (_.T = null), (e = Q.p), (Q.p = 2), (f = G), (G |= 4);
      try {
        nm(l, t, a);
      } finally {
        (G = f), (Q.p = e), (_.T = u);
      }
    }
    (il = 1), Dd(), Ud(), Nd();
  }
}
function Dd() {
  if (il === 1) {
    il = 0;
    var l = Zt,
      t = Fa,
      a = (t.flags & 13878) !== 0;
    if (t.subtreeFlags & 13878 || a) {
      (a = _.T), (_.T = null);
      var u = Q.p;
      Q.p = 2;
      var e = G;
      G |= 4;
      try {
        dd(t, l);
        var n = vi,
          f = J0(l.containerInfo),
          i = n.focusedElem,
          c = n.selectionRange;
        if (
          f !== i &&
          i &&
          i.ownerDocument &&
          K0(i.ownerDocument.documentElement, i)
        ) {
          if (c !== null && Ci(i)) {
            var o = c.start,
              g = c.end;
            if ((g === void 0 && (g = o), 'selectionStart' in i))
              (i.selectionStart = o),
                (i.selectionEnd = Math.min(g, i.value.length));
            else {
              var h = i.ownerDocument || document,
                d = (h && h.defaultView) || window;
              if (d.getSelection) {
                var v = d.getSelection(),
                  b = i.textContent.length,
                  E = Math.min(c.start, b),
                  R = c.end === void 0 ? E : Math.min(c.end, b);
                !v.extend && E > R && ((f = R), (R = E), (E = f));
                var y = wc(i, E),
                  s = wc(i, R);
                if (
                  y &&
                  s &&
                  (v.rangeCount !== 1 ||
                    v.anchorNode !== y.node ||
                    v.anchorOffset !== y.offset ||
                    v.focusNode !== s.node ||
                    v.focusOffset !== s.offset)
                ) {
                  var m = h.createRange();
                  m.setStart(y.node, y.offset),
                    v.removeAllRanges(),
                    E > R
                      ? (v.addRange(m), v.extend(s.node, s.offset))
                      : (m.setEnd(s.node, s.offset), v.addRange(m));
                }
              }
            }
          }
          for (h = [], v = i; (v = v.parentNode); )
            v.nodeType === 1 &&
              h.push({ element: v, left: v.scrollLeft, top: v.scrollTop });
          for (
            typeof i.focus == 'function' && i.focus(), i = 0;
            i < h.length;
            i++
          ) {
            var S = h[i];
            (S.element.scrollLeft = S.left), (S.element.scrollTop = S.top);
          }
        }
        (hn = !!di), (vi = di = null);
      } finally {
        (G = e), (Q.p = u), (_.T = a);
      }
    }
    (l.current = t), (il = 2);
  }
}
function Ud() {
  if (il === 2) {
    il = 0;
    var l = Zt,
      t = Fa,
      a = (t.flags & 8772) !== 0;
    if (t.subtreeFlags & 8772 || a) {
      (a = _.T), (_.T = null);
      var u = Q.p;
      Q.p = 2;
      var e = G;
      G |= 4;
      try {
        fd(l, t.alternate, t);
      } finally {
        (G = e), (Q.p = u), (_.T = a);
      }
    }
    il = 3;
  }
}
function Nd() {
  if (il === 4 || il === 3) {
    (il = 0), Rv();
    var l = Zt,
      t = Fa,
      a = St,
      u = bd;
    t.subtreeFlags & 10256 || t.flags & 10256
      ? (il = 5)
      : ((il = 0), (Fa = Zt = null), Hd(l, l.pendingLanes));
    var e = l.pendingLanes;
    if (
      (e === 0 && (Xt = null),
      Ui(a),
      (t = t.stateNode),
      jl && typeof jl.onCommitFiberRoot == 'function')
    )
      try {
        jl.onCommitFiberRoot(Wu, t, void 0, (t.current.flags & 128) === 128);
      } catch {}
    if (u !== null) {
      (t = _.T), (e = Q.p), (Q.p = 2), (_.T = null);
      try {
        for (var n = l.onRecoverableError, f = 0; f < u.length; f++) {
          var i = u[f];
          n(i.value, { componentStack: i.stack });
        }
      } finally {
        (_.T = t), (Q.p = e);
      }
    }
    St & 3 && Bn(),
      et(l),
      (e = l.pendingLanes),
      a & 261930 && e & 42
        ? l === ci
          ? xu++
          : ((xu = 0), (ci = l))
        : (xu = 0),
      ue(0);
  }
}
function Hd(l, t) {
  (l.pooledCacheLanes &= t) === 0 &&
    ((t = l.pooledCache), t != null && ((l.pooledCache = null), le(t)));
}
function Bn() {
  return Dd(), Ud(), Nd(), xd();
}
function xd() {
  if (il !== 5) return !1;
  var l = Zt,
    t = fi;
  fi = 0;
  var a = Ui(St),
    u = _.T,
    e = Q.p;
  try {
    (Q.p = 32 > a ? 32 : a), (_.T = null), (a = ii), (ii = null);
    var n = Zt,
      f = St;
    if (((il = 0), (Fa = Zt = null), (St = 0), G & 6)) throw Error(r(331));
    var i = G;
    if (
      ((G |= 4),
      gd(n.current),
      od(n, n.current, f, a),
      (G = i),
      ue(0, !1),
      jl && typeof jl.onPostCommitFiberRoot == 'function')
    )
      try {
        jl.onPostCommitFiberRoot(Wu, n);
      } catch {}
    return !0;
  } finally {
    (Q.p = e), (_.T = u), Hd(l, t);
  }
}
function Ms(l, t, a) {
  (t = Vl(a, t)),
    (t = ti(l.stateNode, t, 2)),
    (l = Qt(l, t, 2)),
    l !== null && (ku(l, 2), et(l));
}
function Z(l, t, a) {
  if (l.tag === 3) Ms(l, l, a);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Ms(t, l, a);
        break;
      } else if (t.tag === 1) {
        var u = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == 'function' ||
          (typeof u.componentDidCatch == 'function' &&
            (Xt === null || !Xt.has(u)))
        ) {
          (l = Vl(a, l)),
            (a = wy(2)),
            (u = Qt(t, a, 2)),
            u !== null && ($y(a, u, t, l), ku(u, 2), et(u));
          break;
        }
      }
      t = t.return;
    }
}
function mf(l, t, a) {
  var u = l.pingCache;
  if (u === null) {
    u = l.pingCache = new cm();
    var e = new Set();
    u.set(t, e);
  } else (e = u.get(t)), e === void 0 && ((e = new Set()), u.set(t, e));
  e.has(a) || ((yc = !0), e.add(a), (l = om.bind(null, l, t, a)), t.then(l, l));
}
function om(l, t, a) {
  var u = l.pingCache;
  u !== null && u.delete(t),
    (l.pingedLanes |= l.suspendedLanes & a),
    (l.warmLanes &= ~a),
    K === l &&
      (C & a) === a &&
      (P === 4 || (P === 3 && (C & 62914560) === C && 300 > xl() - Hn)
        ? !(G & 2) && ka(l, 0)
        : (dc |= a),
      Wa === C && (Wa = 0)),
    et(l);
}
function jd(l, t) {
  t === 0 && (t = p0()), (l = Sa(l, t)), l !== null && (ku(l, t), et(l));
}
function mm(l) {
  var t = l.memoizedState,
    a = 0;
  t !== null && (a = t.retryLane), jd(l, a);
}
function hm(l, t) {
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
function gm(l, t) {
  return Oi(l, t);
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
    si || ((si = !0), rm());
}
function ue(l, t) {
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
          n !== 0 && ((a = !0), Os(u, n));
        } else
          (n = C),
            (n = zn(
              u,
              u === K ? n : 0,
              u.cancelPendingCommit !== null || u.timeoutHandle !== -1
            )),
            !(n & 3) || Fu(u, n) || ((a = !0), Os(u, n));
        u = u.next;
      }
    while (a);
    hf = !1;
  }
}
function Sm() {
  Bd();
}
function Bd() {
  sn = si = !1;
  var l = 0;
  Ct !== 0 && Dm() && (l = Ct);
  for (var t = xl(), a = null, u = cn; u !== null; ) {
    var e = u.next,
      n = Rd(u, t);
    n === 0
      ? ((u.next = null),
        a === null ? (cn = e) : (a.next = e),
        e === null && (Aa = a))
      : ((a = u), (l !== 0 || n & 3) && (sn = !0)),
      (u = e);
  }
  (il !== 0 && il !== 5) || ue(l), Ct !== 0 && (Ct = 0);
}
function Rd(l, t) {
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
      ? (!(i & a) || i & u) && (e[f] = Lv(i, t))
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
  if (!(a & 3) || Fu(l, a)) {
    if (((t = a & -a), t === l.callbackPriority)) return t;
    switch ((u !== null && Zn(u), Ui(a))) {
      case 2:
      case 8:
        a = E0;
        break;
      case 32:
        a = Ve;
        break;
      case 268435456:
        a = A0;
        break;
      default:
        a = Ve;
    }
    return (
      (u = Cd.bind(null, l)),
      (a = Oi(a, u)),
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
function Cd(l, t) {
  if (il !== 0 && il !== 5)
    return (l.callbackNode = null), (l.callbackPriority = 0), null;
  var a = l.callbackNode;
  if (Bn() && l.callbackNode !== a) return null;
  var u = C;
  return (
    (u = zn(
      l,
      l === K ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    )),
    u === 0
      ? null
      : (Td(l, u, t),
        Rd(l, xl()),
        l.callbackNode != null && l.callbackNode === a
          ? Cd.bind(null, l)
          : null)
  );
}
function Os(l, t) {
  if (Bn()) return null;
  Td(l, t, !0);
}
function rm() {
  Nm(function () {
    G & 6 ? Oi(T0, Sm) : Bd();
  });
}
function oc() {
  if (Ct === 0) {
    var l = Ja;
    l === 0 && ((l = de), (de <<= 1), !(de & 261888) && (de = 256)), (Ct = l);
  }
  return Ct;
}
function Ds(l) {
  return l == null || typeof l == 'symbol' || typeof l == 'boolean'
    ? null
    : typeof l == 'function'
      ? l
      : Oe('' + l);
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
function bm(l, t, a, u, e) {
  if (t === 'submit' && a && a.stateNode === e) {
    var n = Ds((e[Ml] || null).action),
      f = u.submitter;
    f &&
      ((t = (t = f[Ml] || null)
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
    zm = Sf.toLowerCase(),
    Tm = Sf[0].toUpperCase() + Sf.slice(1);
  kl(zm, 'on' + Tm);
}
kl($0, 'onAnimationEnd');
kl(W0, 'onAnimationIteration');
kl(F0, 'onAnimationStart');
kl('dblclick', 'onDoubleClick');
kl('focusin', 'onFocus');
kl('focusout', 'onBlur');
kl(qo, 'onTransitionRun');
kl(Yo, 'onTransitionStart');
kl(Go, 'onTransitionCancel');
kl(k0, 'onTransitionEnd');
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
var Lu =
    'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
      ' '
    ),
  Em = new Set(
    'beforetoggle cancel close invalid load scroll scrollend toggle'
      .split(' ')
      .concat(Lu)
  );
function qd(l, t) {
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
            o = i.currentTarget;
          if (((i = i.listener), c !== n && e.isPropagationStopped())) break l;
          (n = i), (e.currentTarget = o);
          try {
            n(e);
          } catch (g) {
            Je(g);
          }
          (e.currentTarget = null), (n = c);
        }
      else
        for (f = 0; f < u.length; f++) {
          if (
            ((i = u[f]),
            (c = i.instance),
            (o = i.currentTarget),
            (i = i.listener),
            c !== n && e.isPropagationStopped())
          )
            break l;
          (n = i), (e.currentTarget = o);
          try {
            n(e);
          } catch (g) {
            Je(g);
          }
          (e.currentTarget = null), (n = c);
        }
    }
  }
}
function j(l, t) {
  var a = t[jf];
  a === void 0 && (a = t[jf] = new Set());
  var u = l + '__bubble';
  a.has(u) || (Yd(t, l, 2, !1), a.add(u));
}
function rf(l, t, a) {
  var u = 0;
  t && (u |= 4), Yd(a, l, u, t);
}
var Te = '_reactListening' + Math.random().toString(36).slice(2);
function mc(l) {
  if (!l[Te]) {
    (l[Te] = !0),
      U0.forEach(function (a) {
        a !== 'selectionchange' && (Em.has(a) || rf(a, !1, l), rf(a, !0, l));
      });
    var t = l.nodeType === 9 ? l : l.ownerDocument;
    t === null || t[Te] || ((t[Te] = !0), rf('selectionchange', !1, t));
  }
}
function Yd(l, t, a, u) {
  switch (kd(t)) {
    case 2:
      var e = Fm;
      break;
    case 8:
      e = km;
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
          if (((f = Ma(i)), f === null)) return;
          if (((c = f.tag), c === 5 || c === 6 || c === 26 || c === 27)) {
            u = n = f;
            continue l;
          }
          i = i.parentNode;
        }
      }
      u = u.return;
    }
  q0(function () {
    var o = n,
      g = xi(a),
      h = [];
    l: {
      var d = I0.get(l);
      if (d !== void 0) {
        var v = Tn,
          b = l;
        switch (l) {
          case 'keypress':
            if (Ue(a) === 0) break l;
          case 'keydown':
          case 'keyup':
            v = ho;
            break;
          case 'focusin':
            (b = 'focus'), (v = wn);
            break;
          case 'focusout':
            (b = 'blur'), (v = wn);
            break;
          case 'beforeblur':
          case 'afterblur':
            v = wn;
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
            v = qc;
            break;
          case 'drag':
          case 'dragend':
          case 'dragenter':
          case 'dragexit':
          case 'dragleave':
          case 'dragover':
          case 'dragstart':
          case 'drop':
            v = ao;
            break;
          case 'touchcancel':
          case 'touchend':
          case 'touchmove':
          case 'touchstart':
            v = ro;
            break;
          case $0:
          case W0:
          case F0:
            v = no;
            break;
          case k0:
            v = zo;
            break;
          case 'scroll':
          case 'scrollend':
            v = lo;
            break;
          case 'wheel':
            v = Eo;
            break;
          case 'copy':
          case 'cut':
          case 'paste':
            v = io;
            break;
          case 'gotpointercapture':
          case 'lostpointercapture':
          case 'pointercancel':
          case 'pointerdown':
          case 'pointermove':
          case 'pointerout':
          case 'pointerover':
          case 'pointerup':
            v = Gc;
            break;
          case 'toggle':
          case 'beforetoggle':
            v = po;
        }
        var E = (t & 4) !== 0,
          R = !E && (l === 'scroll' || l === 'scrollend'),
          y = E ? (d !== null ? d + 'Capture' : null) : d;
        E = [];
        for (var s = o, m; s !== null; ) {
          var S = s;
          if (
            ((m = S.stateNode),
            (S = S.tag),
            (S !== 5 && S !== 26 && S !== 27) ||
              m === null ||
              y === null ||
              ((S = Ru(s, y)), S != null && E.push(Vu(s, S, m))),
            R)
          )
            break;
          s = s.return;
        }
        0 < E.length &&
          ((d = new v(d, b, null, a, g)), h.push({ event: d, listeners: E }));
      }
    }
    if (!(t & 7)) {
      l: {
        if (
          ((d = l === 'mouseover' || l === 'pointerover'),
          (v = l === 'mouseout' || l === 'pointerout'),
          d &&
            a !== qf &&
            (b = a.relatedTarget || a.fromElement) &&
            (Ma(b) || b[tu]))
        )
          break l;
        if (
          (v || d) &&
          ((d =
            g.window === g
              ? g
              : (d = g.ownerDocument)
                ? d.defaultView || d.parentWindow
                : window),
          v
            ? ((b = a.relatedTarget || a.toElement),
              (v = o),
              (b = b ? Ma(b) : null),
              b !== null &&
                ((R = $u(b)),
                (E = b.tag),
                b !== R || (E !== 5 && E !== 27 && E !== 6)) &&
                (b = null))
            : ((v = null), (b = o)),
          v !== b)
        ) {
          if (
            ((E = qc),
            (S = 'onMouseLeave'),
            (y = 'onMouseEnter'),
            (s = 'mouse'),
            (l === 'pointerout' || l === 'pointerover') &&
              ((E = Gc),
              (S = 'onPointerLeave'),
              (y = 'onPointerEnter'),
              (s = 'pointer')),
            (R = v == null ? d : Su(v)),
            (m = b == null ? d : Su(b)),
            (d = new E(S, s + 'leave', v, a, g)),
            (d.target = R),
            (d.relatedTarget = m),
            (S = null),
            Ma(g) === o &&
              ((E = new E(y, s + 'enter', b, a, g)),
              (E.target = m),
              (E.relatedTarget = R),
              (S = E)),
            (R = S),
            v && b)
          )
            t: {
              for (E = Am, y = v, s = b, m = 0, S = y; S; S = E(S)) m++;
              S = 0;
              for (var A = s; A; A = E(A)) S++;
              for (; 0 < m - S; ) (y = E(y)), m--;
              for (; 0 < S - m; ) (s = E(s)), S--;
              for (; m--; ) {
                if (y === s || (s !== null && y === s.alternate)) {
                  E = y;
                  break t;
                }
                (y = E(y)), (s = E(s));
              }
              E = null;
            }
          else E = null;
          v !== null && Ns(h, d, v, E, !1),
            b !== null && R !== null && Ns(h, R, b, E, !0);
        }
      }
      l: {
        if (
          ((d = o ? Su(o) : window),
          (v = d.nodeName && d.nodeName.toLowerCase()),
          v === 'select' || (v === 'input' && d.type === 'file'))
        )
          var U = Lc;
        else if (Zc(d))
          if (L0) U = Bo;
          else {
            U = xo;
            var z = Ho;
          }
        else
          (v = d.nodeName),
            !v ||
            v.toLowerCase() !== 'input' ||
            (d.type !== 'checkbox' && d.type !== 'radio')
              ? o && Hi(o.elementType) && (U = Lc)
              : (U = jo);
        if (U && (U = U(l, o))) {
          Z0(h, U, a, g);
          break l;
        }
        z && z(l, d, o),
          l === 'focusout' &&
            o &&
            d.type === 'number' &&
            o.memoizedProps.value != null &&
            Cf(d, 'number', d.value);
      }
      switch (((z = o ? Su(o) : window), l)) {
        case 'focusin':
          (Zc(z) || z.contentEditable === 'true') &&
            ((Ua = z), (Gf = o), (Au = null));
          break;
        case 'focusout':
          Au = Gf = Ua = null;
          break;
        case 'mousedown':
          Qf = !0;
          break;
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          (Qf = !1), $c(h, a, g);
          break;
        case 'selectionchange':
          if (Co) break;
        case 'keydown':
        case 'keyup':
          $c(h, a, g);
      }
      var M;
      if (Ri)
        l: {
          switch (l) {
            case 'compositionstart':
              var N = 'onCompositionStart';
              break l;
            case 'compositionend':
              N = 'onCompositionEnd';
              break l;
            case 'compositionupdate':
              N = 'onCompositionUpdate';
              break l;
          }
          N = void 0;
        }
      else
        Da
          ? Q0(l, a) && (N = 'onCompositionEnd')
          : l === 'keydown' && a.keyCode === 229 && (N = 'onCompositionStart');
      N &&
        (G0 &&
          a.locale !== 'ko' &&
          (Da || N !== 'onCompositionStart'
            ? N === 'onCompositionEnd' && Da && (M = Y0())
            : ((jt = g),
              (ji = 'value' in jt ? jt.value : jt.textContent),
              (Da = !0))),
        (z = yn(o, N)),
        0 < z.length &&
          ((N = new Yc(N, l, null, a, g)),
          h.push({ event: N, listeners: z }),
          M ? (N.data = M) : ((M = X0(a)), M !== null && (N.data = M)))),
        (M = Mo ? Oo(l, a) : Do(l, a)) &&
          ((N = yn(o, 'onBeforeInput')),
          0 < N.length &&
            ((z = new Yc('onBeforeInput', 'beforeinput', null, a, g)),
            h.push({ event: z, listeners: N }),
            (z.data = M))),
        bm(h, l, o, a, g);
    }
    qd(h, t);
  });
}
function Vu(l, t, a) {
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
        ((e = Ru(l, a)),
        e != null && u.unshift(Vu(l, e, n)),
        (e = Ru(l, t)),
        e != null && u.push(Vu(l, e, n))),
      l.tag === 3)
    )
      return u;
    l = l.return;
  }
  return [];
}
function Am(l) {
  if (l === null) return null;
  do l = l.return;
  while (l && l.tag !== 5 && l.tag !== 27);
  return l || null;
}
function Ns(l, t, a, u, e) {
  for (var n = t._reactName, f = []; a !== null && a !== u; ) {
    var i = a,
      c = i.alternate,
      o = i.stateNode;
    if (((i = i.tag), c !== null && c === u)) break;
    (i !== 5 && i !== 26 && i !== 27) ||
      o === null ||
      ((c = o),
      e
        ? ((o = Ru(a, n)), o != null && f.unshift(Vu(a, o, c)))
        : e || ((o = Ru(a, n)), o != null && f.push(Vu(a, o, c)))),
      (a = a.return);
  }
  f.length !== 0 && l.push({ event: t, listeners: f });
}
var pm = /\r\n?/g,
  _m = /\u0000|\uFFFD/g;
function Hs(l) {
  return (typeof l == 'string' ? l : '' + l)
    .replace(
      pm,
      `
`
    )
    .replace(_m, '');
}
function Gd(l, t) {
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
      me(l, 'class', u);
      break;
    case 'tabIndex':
      me(l, 'tabindex', u);
      break;
    case 'dir':
    case 'role':
    case 'viewBox':
    case 'width':
    case 'height':
      me(l, a, u);
      break;
    case 'style':
      C0(l, u, n);
      break;
    case 'data':
      if (t !== 'object') {
        me(l, 'data', u);
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
      (u = Oe('' + u)), l.setAttribute(a, u);
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
      (u = Oe('' + u)), l.setAttribute(a, u);
      break;
    case 'onClick':
      u != null && (l.onclick = ot);
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
      (a = Oe('' + u)),
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
      j('beforetoggle', l), j('toggle', l), Me(l, 'popover', u);
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
      Me(l, 'is', u);
      break;
    case 'innerText':
    case 'textContent':
      break;
    default:
      (!(2 < a.length) ||
        (a[0] !== 'o' && a[0] !== 'O') ||
        (a[1] !== 'n' && a[1] !== 'N')) &&
        ((a = Iv.get(a) || a), Me(l, a, u));
  }
}
function yi(l, t, a, u, e, n) {
  switch (a) {
    case 'style':
      C0(l, u, n);
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
      u != null && (l.onclick = ot);
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
      if (!N0.hasOwnProperty(a))
        l: {
          if (
            a[0] === 'o' &&
            a[1] === 'n' &&
            ((e = a.endsWith('Capture')),
            (t = a.slice(2, e ? a.length - 7 : void 0)),
            (n = l[Ml] || null),
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
          a in l ? (l[a] = u) : u === !0 ? l.setAttribute(a, '') : Me(l, a, u);
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
        o = null;
      for (u in a)
        if (a.hasOwnProperty(u)) {
          var g = a[u];
          if (g != null)
            switch (u) {
              case 'name':
                e = g;
                break;
              case 'type':
                f = g;
                break;
              case 'checked':
                c = g;
                break;
              case 'defaultChecked':
                o = g;
                break;
              case 'value':
                n = g;
                break;
              case 'defaultValue':
                i = g;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (g != null) throw Error(r(137, t));
                break;
              default:
                L(l, t, u, g, a, null);
            }
        }
      j0(l, n, i, c, o, f, e, !1);
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
      R0(l, u, e, n);
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
      for (u = 0; u < Lu.length; u++) j(Lu[u], l);
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
      for (o in a)
        if (a.hasOwnProperty(o) && ((u = a[o]), u != null))
          switch (o) {
            case 'children':
            case 'dangerouslySetInnerHTML':
              throw Error(r(137, t));
            default:
              L(l, t, o, u, a, null);
          }
      return;
    default:
      if (Hi(t)) {
        for (g in a)
          a.hasOwnProperty(g) &&
            ((u = a[g]), u !== void 0 && yi(l, t, g, u, a, void 0));
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
        o = null,
        g = null;
      for (v in a) {
        var h = a[v];
        if (a.hasOwnProperty(v) && h != null)
          switch (v) {
            case 'checked':
              break;
            case 'value':
              break;
            case 'defaultValue':
              c = h;
            default:
              u.hasOwnProperty(v) || L(l, t, v, null, u, h);
          }
      }
      for (var d in u) {
        var v = u[d];
        if (((h = a[d]), u.hasOwnProperty(d) && (v != null || h != null)))
          switch (d) {
            case 'type':
              n = v;
              break;
            case 'name':
              e = v;
              break;
            case 'checked':
              o = v;
              break;
            case 'defaultChecked':
              g = v;
              break;
            case 'value':
              f = v;
              break;
            case 'defaultValue':
              i = v;
              break;
            case 'children':
            case 'dangerouslySetInnerHTML':
              if (v != null) throw Error(r(137, t));
              break;
            default:
              v !== h && L(l, t, d, v, u, h);
          }
      }
      Rf(l, f, i, c, o, g, n, e);
      return;
    case 'select':
      v = f = i = d = null;
      for (n in a)
        if (((c = a[n]), a.hasOwnProperty(n) && c != null))
          switch (n) {
            case 'value':
              break;
            case 'multiple':
              v = c;
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
              d = n;
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
        (u = v),
        d != null
          ? qa(l, !!a, d, !1)
          : !!u != !!a &&
            (t != null ? qa(l, !!a, t, !0) : qa(l, !!a, a ? [] : '', !1));
      return;
    case 'textarea':
      v = d = null;
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
              d = e;
              break;
            case 'defaultValue':
              v = e;
              break;
            case 'children':
              break;
            case 'dangerouslySetInnerHTML':
              if (e != null) throw Error(r(91));
              break;
            default:
              e !== n && L(l, t, f, e, u, n);
          }
      B0(l, d, v);
      return;
    case 'option':
      for (var b in a)
        if (
          ((d = a[b]), a.hasOwnProperty(b) && d != null && !u.hasOwnProperty(b))
        )
          switch (b) {
            case 'selected':
              l.selected = !1;
              break;
            default:
              L(l, t, b, null, u, d);
          }
      for (c in u)
        if (
          ((d = u[c]),
          (v = a[c]),
          u.hasOwnProperty(c) && d !== v && (d != null || v != null))
        )
          switch (c) {
            case 'selected':
              l.selected = d && typeof d != 'function' && typeof d != 'symbol';
              break;
            default:
              L(l, t, c, d, u, v);
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
      for (var E in a)
        (d = a[E]),
          a.hasOwnProperty(E) &&
            d != null &&
            !u.hasOwnProperty(E) &&
            L(l, t, E, null, u, d);
      for (o in u)
        if (
          ((d = u[o]),
          (v = a[o]),
          u.hasOwnProperty(o) && d !== v && (d != null || v != null))
        )
          switch (o) {
            case 'children':
            case 'dangerouslySetInnerHTML':
              if (d != null) throw Error(r(137, t));
              break;
            default:
              L(l, t, o, d, u, v);
          }
      return;
    default:
      if (Hi(t)) {
        for (var R in a)
          (d = a[R]),
            a.hasOwnProperty(R) &&
              d !== void 0 &&
              !u.hasOwnProperty(R) &&
              yi(l, t, R, void 0, u, d);
        for (g in u)
          (d = u[g]),
            (v = a[g]),
            !u.hasOwnProperty(g) ||
              d === v ||
              (d === void 0 && v === void 0) ||
              yi(l, t, g, d, u, v);
        return;
      }
  }
  for (var y in a)
    (d = a[y]),
      a.hasOwnProperty(y) &&
        d != null &&
        !u.hasOwnProperty(y) &&
        L(l, t, y, null, u, d);
  for (h in u)
    (d = u[h]),
      (v = a[h]),
      !u.hasOwnProperty(h) ||
        d === v ||
        (d == null && v == null) ||
        L(l, t, h, d, u, v);
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
function Om() {
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
            o = c.startTime;
          if (o > i) break;
          var g = c.transferSize,
            h = c.initiatorType;
          g &&
            xs(h) &&
            ((c = c.responseEnd), (f += g * (c < i ? 1 : (i - o) / (c - o))));
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
  vi = null;
function dn(l) {
  return l.nodeType === 9 ? l : l.ownerDocument;
}
function js(l) {
  switch (l) {
    case 'http://www.w3.org/2000/svg':
      return 1;
    case 'http://www.w3.org/1998/Math/MathML':
      return 2;
    default:
      return 0;
  }
}
function Qd(l, t) {
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
function oi(l, t) {
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
function Dm() {
  var l = window.event;
  return l && l.type === 'popstate'
    ? l === zf
      ? !1
      : ((zf = l), !0)
    : ((zf = null), !1);
}
var Xd = typeof setTimeout == 'function' ? setTimeout : void 0,
  Um = typeof clearTimeout == 'function' ? clearTimeout : void 0,
  Bs = typeof Promise == 'function' ? Promise : void 0,
  Nm =
    typeof queueMicrotask == 'function'
      ? queueMicrotask
      : typeof Bs < 'u'
        ? function (l) {
            return Bs.resolve(null).then(l).catch(Hm);
          }
        : Xd;
function Hm(l) {
  setTimeout(function () {
    throw l;
  });
}
function kt(l) {
  return l === 'head';
}
function Rs(l, t) {
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
          n[Iu] ||
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
function xm(l, t, a, u) {
  for (; l.nodeType === 1; ) {
    var e = a;
    if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
      if (!u && (l.nodeName !== 'INPUT' || l.type !== 'hidden')) break;
    } else if (u) {
      if (!l[Iu])
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
    if (((l = wl(l.nextSibling)), l === null)) break;
  }
  return null;
}
function jm(l, t, a) {
  if (t === '') return null;
  for (; l.nodeType !== 3; )
    if (
      ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') &&
        !a) ||
      ((l = wl(l.nextSibling)), l === null)
    )
      return null;
  return l;
}
function Zd(l, t) {
  for (; l.nodeType !== 8; )
    if (
      ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') &&
        !t) ||
      ((l = wl(l.nextSibling)), l === null)
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
function wl(l) {
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
        if (t === 0) return wl(l.nextSibling);
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
function Ld(l, t, a) {
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
var $l = new Map(),
  Gs = new Set();
function vn(l) {
  return typeof l.getRootNode == 'function'
    ? l.getRootNode()
    : l.nodeType === 9
      ? l
      : l.ownerDocument;
}
var At = Q.d;
Q.d = { f: Rm, r: Cm, D: qm, C: Ym, L: Gm, m: Qm, X: Zm, S: Xm, M: Lm };
function Rm() {
  var l = At.f(),
    t = xn();
  return l || t;
}
function Cm(l) {
  var t = au(l);
  t !== null && t.tag === 5 && t.type === 'form' ? Cy(t) : At.r(l);
}
var fu = typeof document > 'u' ? null : document;
function Vd(l, t, a) {
  var u = fu;
  if (u && typeof t == 'string' && t) {
    var e = Ll(t);
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
function qm(l) {
  At.D(l), Vd('dns-prefetch', l, null);
}
function Ym(l, t) {
  At.C(l, t), Vd('preconnect', l, t);
}
function Gm(l, t, a) {
  At.L(l, t, a);
  var u = fu;
  if (u && l && t) {
    var e = 'link[rel="preload"][as="' + Ll(t) + '"]';
    t === 'image' && a && a.imageSrcSet
      ? ((e += '[imagesrcset="' + Ll(a.imageSrcSet) + '"]'),
        typeof a.imageSizes == 'string' &&
          (e += '[imagesizes="' + Ll(a.imageSizes) + '"]'))
      : (e += '[href="' + Ll(l) + '"]');
    var n = e;
    switch (t) {
      case 'style':
        n = Ia(l);
        break;
      case 'script':
        n = iu(l);
    }
    $l.has(n) ||
      ((l = F(
        {
          rel: 'preload',
          href: t === 'image' && a && a.imageSrcSet ? void 0 : l,
          as: t
        },
        a
      )),
      $l.set(n, l),
      u.querySelector(e) !== null ||
        (t === 'style' && u.querySelector(ee(n))) ||
        (t === 'script' && u.querySelector(ne(n))) ||
        ((t = u.createElement('link')),
        Sl(t, 'link', l),
        dl(t),
        u.head.appendChild(t)));
  }
}
function Qm(l, t) {
  At.m(l, t);
  var a = fu;
  if (a && l) {
    var u = t && typeof t.as == 'string' ? t.as : 'script',
      e = 'link[rel="modulepreload"][as="' + Ll(u) + '"][href="' + Ll(l) + '"]',
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
      !$l.has(n) &&
      ((l = F({ rel: 'modulepreload', href: l }, t)),
      $l.set(n, l),
      a.querySelector(e) === null)
    ) {
      switch (u) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          if (a.querySelector(ne(n))) return;
      }
      (u = a.createElement('link')),
        Sl(u, 'link', l),
        dl(u),
        a.head.appendChild(u);
    }
  }
}
function Xm(l, t, a) {
  At.S(l, t, a);
  var u = fu;
  if (u && l) {
    var e = Ca(u).hoistableStyles,
      n = Ia(l);
    t = t || 'default';
    var f = e.get(n);
    if (!f) {
      var i = { loading: 0, preload: null };
      if ((f = u.querySelector(ee(n)))) i.loading = 5;
      else {
        (l = F({ rel: 'stylesheet', href: l, 'data-precedence': t }, a)),
          (a = $l.get(n)) && hc(l, a);
        var c = (f = u.createElement('link'));
        dl(c),
          Sl(c, 'link', l),
          (c._p = new Promise(function (o, g) {
            (c.onload = o), (c.onerror = g);
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
function Zm(l, t) {
  At.X(l, t);
  var a = fu;
  if (a && l) {
    var u = Ca(a).hoistableScripts,
      e = iu(l),
      n = u.get(e);
    n ||
      ((n = a.querySelector(ne(e))),
      n ||
        ((l = F({ src: l, async: !0 }, t)),
        (t = $l.get(e)) && gc(l, t),
        (n = a.createElement('script')),
        dl(n),
        Sl(n, 'link', l),
        a.head.appendChild(n)),
      (n = { type: 'script', instance: n, count: 1, state: null }),
      u.set(e, n));
  }
}
function Lm(l, t) {
  At.M(l, t);
  var a = fu;
  if (a && l) {
    var u = Ca(a).hoistableScripts,
      e = iu(l),
      n = u.get(e);
    n ||
      ((n = a.querySelector(ne(e))),
      n ||
        ((l = F({ src: l, async: !0, type: 'module' }, t)),
        (t = $l.get(e)) && gc(l, t),
        (n = a.createElement('script')),
        dl(n),
        Sl(n, 'link', l),
        a.head.appendChild(n)),
      (n = { type: 'script', instance: n, count: 1, state: null }),
      u.set(e, n));
  }
}
function Qs(l, t, a, u) {
  var e = (e = qt.current) ? vn(e) : null;
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
            (n = e.querySelector(ee(l))) &&
              !n._p &&
              ((f.instance = n), (f.state.loading = 5)),
            $l.has(l) ||
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
              $l.set(l, a),
              n || Vm(e, l, a, f.state))),
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
  return 'href="' + Ll(l) + '"';
}
function ee(l) {
  return 'link[rel="stylesheet"][' + l + ']';
}
function Kd(l) {
  return F({}, l, { 'data-precedence': l.precedence, precedence: null });
}
function Vm(l, t, a, u) {
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
  return '[src="' + Ll(l) + '"]';
}
function ne(l) {
  return 'script[async]' + l;
}
function Xs(l, t, a) {
  if ((t.count++, t.instance === null))
    switch (t.type) {
      case 'style':
        var u = l.querySelector('style[data-href~="' + Ll(a.href) + '"]');
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
        var n = l.querySelector(ee(e));
        if (n) return (t.state.loading |= 4), (t.instance = n), dl(n), n;
        (u = Kd(a)),
          (e = $l.get(e)) && hc(u, e),
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
          (e = l.querySelector(ne(n)))
            ? ((t.instance = e), dl(e), e)
            : ((u = a),
              (e = $l.get(n)) && ((u = F({}, a)), gc(u, e)),
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
        n[Iu] ||
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
function Km(l, t, a) {
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
function Jd(l) {
  return !(l.type === 'stylesheet' && !(l.state.loading & 3));
}
function Jm(l, t, a, u) {
  if (
    a.type === 'stylesheet' &&
    (typeof u.media != 'string' || matchMedia(u.media).matches !== !1) &&
    !(a.state.loading & 4)
  ) {
    if (a.instance === null) {
      var e = Ia(u.href),
        n = t.querySelector(ee(e));
      if (n) {
        (t = n._p),
          t !== null &&
            typeof t == 'object' &&
            typeof t.then == 'function' &&
            (l.count++, (l = on.bind(l)), t.then(l, l)),
          (a.state.loading |= 4),
          (a.instance = n),
          dl(n);
        return;
      }
      (n = t.ownerDocument || t),
        (u = Kd(u)),
        (e = $l.get(e)) && hc(u, e),
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
        (a = on.bind(l)),
        t.addEventListener('load', a),
        t.addEventListener('error', a));
  }
}
var Tf = 0;
function wm(l, t) {
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
          0 < l.imgBytes && Tf === 0 && (Tf = 62500 * Om());
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
function on() {
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
      (l.count++, (mn = new Map()), t.forEach($m, l), (mn = null), on.call(l));
}
function $m(l, t) {
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
      (u = on.bind(this)),
      e.addEventListener('load', u),
      e.addEventListener('error', u),
      n
        ? n.parentNode.insertBefore(e, n.nextSibling)
        : ((l = l.nodeType === 9 ? l.head : l),
          l.insertBefore(e, l.firstChild)),
      (t.state.loading |= 4);
  }
}
var Ku = {
  $$typeof: vt,
  Provider: null,
  Consumer: null,
  _currentValue: ea,
  _currentValue2: ea,
  _threadCount: 0
};
function Wm(l, t, a, u, e, n, f, i, c) {
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
function wd(l, t, a, u, e, n, f, i, c, o, g, h) {
  return (
    (l = new Wm(l, t, a, f, c, o, g, h, i)),
    (t = 1),
    n === !0 && (t |= 24),
    (n = Nl(3, null, null, t)),
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
function $d(l) {
  return l ? ((l = xa), l) : xa;
}
function Wd(l, t, a, u, e, n) {
  (e = $d(e)),
    u.context === null ? (u.context = e) : (u.pendingContext = e),
    (u = Gt(t)),
    (u.payload = { element: a }),
    (n = n === void 0 ? null : n),
    n !== null && (u.callback = n),
    (a = Qt(l, u, t)),
    a !== null && (_l(a, l, t), _u(a, l, t));
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
function Fd(l) {
  if (l.tag === 13 || l.tag === 31) {
    var t = Sa(l, 67108864);
    t !== null && _l(t, l, 67108864), Sc(l, 67108864);
  }
}
function Ks(l) {
  if (l.tag === 13 || l.tag === 31) {
    var t = Rl();
    t = Di(t);
    var a = Sa(l, t);
    a !== null && _l(a, l, t), Sc(l, t);
  }
}
var hn = !0;
function Fm(l, t, a, u) {
  var e = _.T;
  _.T = null;
  var n = Q.p;
  try {
    (Q.p = 2), rc(l, t, a, u);
  } finally {
    (Q.p = n), (_.T = e);
  }
}
function km(l, t, a, u) {
  var e = _.T;
  _.T = null;
  var n = Q.p;
  try {
    (Q.p = 8), rc(l, t, a, u);
  } finally {
    (Q.p = n), (_.T = e);
  }
}
function rc(l, t, a, u) {
  if (hn) {
    var e = ri(u);
    if (e === null) bf(l, t, u, gn, a), Js(l, u);
    else if (Pm(e, l, t, a, u)) u.stopPropagation();
    else if ((Js(l, u), t & 4 && -1 < Im.indexOf(l))) {
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
                  et(n), !(G & 6) && ((en = xl() + 500), ue(0));
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
  if (((gn = null), (l = Ma(l)), l !== null)) {
    var t = $u(l);
    if (t === null) l = null;
    else {
      var a = t.tag;
      if (a === 13) {
        if (((l = g0(t)), l !== null)) return l;
        l = null;
      } else if (a === 31) {
        if (((l = S0(t)), l !== null)) return l;
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
function kd(l) {
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
      switch (Cv()) {
        case T0:
          return 2;
        case E0:
          return 8;
        case Ve:
        case qv:
          return 32;
        case A0:
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
  Ju = new Map(),
  wu = new Map(),
  Ht = [],
  Im =
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
      Ju.delete(t.pointerId);
      break;
    case 'gotpointercapture':
    case 'lostpointercapture':
      wu.delete(t.pointerId);
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
      t !== null && ((t = au(t)), t !== null && Fd(t)),
      l)
    : ((l.eventSystemFlags |= u),
      (t = l.targetContainers),
      e !== null && t.indexOf(e) === -1 && t.push(e),
      l);
}
function Pm(l, t, a, u, e) {
  switch (t) {
    case 'focusin':
      return (Lt = mu(Lt, l, t, a, u, e)), !0;
    case 'dragenter':
      return (Vt = mu(Vt, l, t, a, u, e)), !0;
    case 'mouseover':
      return (Kt = mu(Kt, l, t, a, u, e)), !0;
    case 'pointerover':
      var n = e.pointerId;
      return Ju.set(n, mu(Ju.get(n) || null, l, t, a, u, e)), !0;
    case 'gotpointercapture':
      return (
        (n = e.pointerId), wu.set(n, mu(wu.get(n) || null, l, t, a, u, e)), !0
      );
  }
  return !1;
}
function Id(l) {
  var t = Ma(l.target);
  if (t !== null) {
    var a = $u(t);
    if (a !== null) {
      if (((t = a.tag), t === 13)) {
        if (((t = g0(a)), t !== null)) {
          (l.blockedOn = t),
            Nc(l.priority, function () {
              Ks(a);
            });
          return;
        }
      } else if (t === 31) {
        if (((t = S0(a)), t !== null)) {
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
    } else return (t = au(a)), t !== null && Fd(t), (l.blockedOn = a), !1;
    t.shift();
  }
  return !0;
}
function ws(l, t, a) {
  Qe(l) && a.delete(t);
}
function lh() {
  (bi = !1),
    Lt !== null && Qe(Lt) && (Lt = null),
    Vt !== null && Qe(Vt) && (Vt = null),
    Kt !== null && Qe(Kt) && (Kt = null),
    Ju.forEach(ws),
    wu.forEach(ws);
}
function Ee(l, t) {
  l.blockedOn === t &&
    ((l.blockedOn = null),
    bi ||
      ((bi = !0),
      cl.unstable_scheduleCallback(cl.unstable_NormalPriority, lh)));
}
var Ae = null;
function $s(l) {
  Ae !== l &&
    ((Ae = l),
    cl.unstable_scheduleCallback(cl.unstable_NormalPriority, function () {
      Ae === l && (Ae = null);
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
    return Ee(c, l);
  }
  Lt !== null && Ee(Lt, l),
    Vt !== null && Ee(Vt, l),
    Kt !== null && Ee(Kt, l),
    Ju.forEach(t),
    wu.forEach(t);
  for (var a = 0; a < Ht.length; a++) {
    var u = Ht[a];
    u.blockedOn === l && (u.blockedOn = null);
  }
  for (; 0 < Ht.length && ((a = Ht[0]), a.blockedOn === null); )
    Id(a), a.blockedOn === null && Ht.shift();
  if (((a = (l.ownerDocument || l).$$reactFormReplay), a != null))
    for (u = 0; u < a.length; u += 3) {
      var e = a[u],
        n = a[u + 1],
        f = e[Ml] || null;
      if (typeof n == 'function') f || $s(a);
      else if (f) {
        var i = null;
        if (n && n.hasAttribute('formAction')) {
          if (((e = n), (f = n[Ml] || null))) i = f.formAction;
          else if (bc(e) !== null) continue;
        } else i = f.action;
        typeof i == 'function' ? (a[u + 1] = i) : (a.splice(u, 3), (u -= 3)),
          $s(a);
      }
    }
}
function Pd() {
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
Rn.prototype.render = zc.prototype.render = function (l) {
  var t = this._internalRoot;
  if (t === null) throw Error(r(409));
  var a = t.current,
    u = Rl();
  Wd(a, u, l, t, null, null);
};
Rn.prototype.unmount = zc.prototype.unmount = function () {
  var l = this._internalRoot;
  if (l !== null) {
    this._internalRoot = null;
    var t = l.containerInfo;
    Wd(l.current, 2, null, l, null, null), xn(), (t[tu] = null);
  }
};
function Rn(l) {
  this._internalRoot = l;
}
Rn.prototype.unstable_scheduleHydration = function (l) {
  if (l) {
    var t = D0();
    l = { blockedOn: null, target: l, priority: t };
    for (var a = 0; a < Ht.length && t !== 0 && t < Ht[a].priority; a++);
    Ht.splice(a, 0, l), a === 0 && Id(l);
  }
};
var Ws = m0.version;
if (Ws !== '19.2.8') throw Error(r(527, Ws, '19.2.8'));
Q.findDOMNode = function (l) {
  var t = l._reactInternals;
  if (t === void 0)
    throw typeof l.render == 'function'
      ? Error(r(188))
      : ((l = Object.keys(l).join(',')), Error(r(268, l)));
  return (
    (l = Uv(t)),
    (l = l !== null ? r0(l) : null),
    (l = l === null ? null : l.stateNode),
    l
  );
};
var th = {
  bundleType: 0,
  version: '19.2.8',
  rendererPackageName: 'react-dom',
  currentDispatcherRef: _,
  reconcilerVersion: '19.2.8'
};
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
  var pe = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!pe.isDisabled && pe.supportsFiber)
    try {
      (Wu = pe.inject(th)), (jl = pe);
    } catch {}
}
rn.createRoot = function (l, t) {
  if (!h0(l)) throw Error(r(299));
  var a = !1,
    u = '',
    e = Vy,
    n = Ky,
    f = Jy;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (a = !0),
      t.identifierPrefix !== void 0 && (u = t.identifierPrefix),
      t.onUncaughtError !== void 0 && (e = t.onUncaughtError),
      t.onCaughtError !== void 0 && (n = t.onCaughtError),
      t.onRecoverableError !== void 0 && (f = t.onRecoverableError)),
    (t = wd(l, 1, !1, null, null, a, u, null, e, n, f, Pd)),
    (l[tu] = t.current),
    mc(l),
    new zc(t)
  );
};
rn.hydrateRoot = function (l, t, a) {
  if (!h0(l)) throw Error(r(299));
  var u = !1,
    e = '',
    n = Vy,
    f = Ky,
    i = Jy,
    c = null;
  return (
    a != null &&
      (a.unstable_strictMode === !0 && (u = !0),
      a.identifierPrefix !== void 0 && (e = a.identifierPrefix),
      a.onUncaughtError !== void 0 && (n = a.onUncaughtError),
      a.onCaughtError !== void 0 && (f = a.onCaughtError),
      a.onRecoverableError !== void 0 && (i = a.onRecoverableError),
      a.formState !== void 0 && (c = a.formState)),
    (t = wd(l, 1, !0, t, a ?? null, u, e, c, n, f, i, Pd)),
    (t.context = $d(null)),
    (a = t.current),
    (u = Rl()),
    (u = Di(u)),
    (e = Gt(u)),
    (e.callback = null),
    Qt(a, e, u),
    (a = u),
    (t.current.lanes = a),
    ku(t, a),
    et(t),
    (l[tu] = t.current),
    mc(l),
    new Rn(t)
  );
};
rn.version = '19.2.8';
function lv() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(lv);
    } catch (l) {
      console.error(l);
    }
}
lv(), (c0.exports = rn);
var ah = c0.exports;
const _e = {
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
function uh({ answers: l, onRestart: t }) {
  const [a, u] = Il.useState('idle'),
    e = Il.useRef(null),
    n = Fs[l.industry] || Fs.other,
    f = ks[l.intent] || ks.explore,
    i = Is[l.urgency] || Is.plan,
    c = "Based on your answers — here's the David-shaped solution",
    o = eh(l);
  function g() {
    h();
    const d = document.createElement('a');
    (d.href = e.current.toDataURL('image/png')),
      (d.download = 'rolefit-summary.png'),
      d.click();
  }
  function h() {
    u('generating');
    const d = e.current;
    if (!d) {
      u('idle');
      return;
    }
    const v = d.getContext('2d'),
      b = d.width,
      E = d.height,
      R = v.createLinearGradient(0, 0, 0, E);
    R.addColorStop(0, '#0b0c10'),
      R.addColorStop(1, '#16202c'),
      (v.fillStyle = R),
      v.fillRect(0, 0, b, E);
    const y = 44;
    let s = y + 6;
    (v.textBaseline = 'top'),
      (v.font =
        "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#ffffff'),
      (v.textAlign = 'left'),
      Af(v, c, y, s, b - y * 2, 30),
      (s += Ef(v, c, b - y * 2, 30) + 18),
      (v.font =
        "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#3b82f6'),
      v.fillText(`Role lens: ${n.lens}`, y, s),
      (s += 26),
      (v.font =
        "15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#cbd5e1'),
      Af(v, `Experience: ${n.experience}`, y, s, b - y * 2, 22),
      (s += Ef(v, n.experience, b - y * 2, 22) + 16),
      (v.font =
        "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#ffffff'),
      v.fillText(`Project: ${f.project}`, y, s),
      (s += 26),
      (v.font =
        "15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#e2e8f0'),
      f.sketch.forEach((S, A) => {
        v.fillText(`• ${S} (illustrative plan)`, y, s), (s += 22);
      }),
      (s += 14),
      (v.font =
        "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#94a3b8'),
      Af(
        v,
        `Your picks: ${l.industry} → ${l.intent} → ${l.urgency}`,
        y,
        s,
        b - y * 2,
        18
      ),
      (s += Ef(v, l.intent, b - y * 2, 18) + 14),
      (v.font =
        "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#60a5fa'),
      (v.textAlign = 'right'),
      v.fillText(`Fit score: ${o}% (deterministic)`, b - y, s),
      (v.textAlign = 'left'),
      (s = E - y - 4),
      (v.font =
        "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"),
      (v.fillStyle = '#475569'),
      (v.textAlign = 'center'),
      v.fillText(
        `David Papp — AI Solutions Developer (WEBINFORM IT Ltd, Oct 2024)
Prototype — illustrative plan`,
        b / 2,
        s
      ),
      u('done');
  }
  return p.jsxs('div', {
    className: 'flex flex-col gap-4',
    children: [
      p.jsx('div', {
        className: 'bubble bubble-bot text-[14px]',
        dangerouslySetInnerHTML: { __html: `<strong>${c}</strong>` }
      }),
      p.jsxs('div', {
        className:
          'rounded-[18px] bg-[#0f131a] border border-[#222a38] p-4 text-[15px] space-y-3',
        children: [
          p.jsxs('div', {
            children: [
              p.jsx('span', {
                className: 'text-[#3b82f6] font-medium',
                children: 'Role lens:'
              }),
              ' ',
              p.jsx('span', { className: 'text-[#e6e7ea]', children: n.lens })
            ]
          }),
          p.jsxs('div', {
            children: [
              p.jsx('span', {
                className: 'text-[#94a3b8]',
                children: 'Relevant experience:'
              }),
              ' ',
              p.jsx('span', {
                className: 'text-[#e6e7ea]',
                children: n.experience
              })
            ]
          }),
          p.jsxs('div', {
            children: [
              p.jsx('span', {
                className: 'text-[#3b82f6] font-medium',
                children: 'Matching project:'
              }),
              ' ',
              p.jsx('span', {
                className: 'text-[#e6e7ea]',
                children: f.project
              })
            ]
          }),
          p.jsxs('div', {
            className: 'pt-1',
            children: [
              p.jsxs('div', {
                className:
                  'flex items-baseline gap-2 text-[13px] text-[#94a3b8]',
                children: [
                  p.jsx('span', {
                    className: 'text-[#60a5fa] font-medium',
                    children: 'Illustrative plan'
                  }),
                  p.jsxs('span', {
                    children: ['(fit ', o, '% • delivery ', i, ')']
                  })
                ]
              }),
              p.jsx('ul', {
                className: 'mt-1 list-none space-y-1.5 pl-0',
                children: f.sketch.map((d, v) =>
                  p.jsxs(
                    'li',
                    {
                      className: 'flex gap-2 text-[#cbd5e1]',
                      children: [
                        p.jsx('span', {
                          className: 'text-[#3b82f6]',
                          children: '•'
                        }),
                        p.jsx('span', { children: d })
                      ]
                    },
                    v
                  )
                )
              })
            ]
          }),
          p.jsxs('div', {
            className:
              'border-t border-[#222a38] pt-3 text-[13px] text-[#94a3b8]',
            children: [
              'Your picks verbatim:',
              ' ',
              p.jsxs('span', {
                className: 'text-[#e6e7ea]',
                children: [l.industry, ' → ', l.intent, ' → ', l.urgency]
              })
            ]
          }),
          p.jsxs('div', {
            className: 'border-t border-[#222a38] pt-3 text-[13px]',
            children: [
              p.jsx('span', {
                className: 'text-[#94a3b8]',
                children: 'Delivery stack:'
              }),
              ' ',
              p.jsx('span', {
                className: 'text-[#e6e7ea]',
                children:
                  'Next.js · TypeScript · Prisma · Clerk · Supabase · Tailwind'
              }),
              p.jsxs('div', {
                className: 'mt-1',
                children: [
                  p.jsx('span', {
                    className: 'text-[#94a3b8]',
                    children: 'Live demo:'
                  }),
                  ' ',
                  p.jsx('span', {
                    className: 'text-[#3b82f6] underline',
                    children: p.jsx('a', {
                      href: 'https://promptshield-cyan.vercel.app',
                      target: '_blank',
                      rel: 'noreferrer',
                      children: 'AgentSec Suite'
                    })
                  })
                ]
              }),
              p.jsx('div', {
                className: 'mt-1 text-[#94a3b8]',
                children: 'Personal projects are prototypes, never production.'
              })
            ]
          })
        ]
      }),
      p.jsxs('div', {
        className: 'flex flex-col gap-2',
        children: [
          p.jsx('button', {
            onClick: g,
            disabled: a === 'generating',
            className: 'chip border-[#3b82f6] text-[#3b82f6]',
            children:
              a === 'generating' ? 'Generating…' : 'Download share card (PNG)'
          }),
          p.jsx('a', {
            href: 'mailto:david@pappdavid.dev',
            className: 'chip justify-center border-[#2a2f3a] text-[#94a3b8]',
            children: 'Talk to an AI builder'
          }),
          p.jsx('button', {
            onClick: t,
            className: 'chip border-[#2a2f3a] text-[#94a3b8]',
            children: 'Take quiz again'
          })
        ]
      }),
      p.jsx('canvas', {
        ref: e,
        width: 1080,
        height: 1350,
        className: 'hidden'
      })
    ]
  });
}
function Ef(l, t, a, u) {
  return tv(l, t, a).length * u;
}
function tv(l, t, a) {
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
  tv(l, t, e).forEach((i, c) => l.fillText(i, a, u + c * n));
}
function eh(l) {
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
function nh() {
  const [l, t] = Il.useState(0),
    [a, u] = Il.useState({ industry: null, intent: null, urgency: null }),
    [e, n] = Il.useState([]),
    f = _e.questions;
  function i(h, d) {
    u((v) => ({ ...v, [h]: d })), n((v) => [...v, { who: 'human', text: d }]);
  }
  function c() {
    t((h) => h + 1);
  }
  Il.useEffect(() => {
    if (l > 0 && l <= f.length) {
      const h = f[l - 1];
      n((d) =>
        [...d].reverse().find((b) => b.who === 'bot' && b.q === h.id)
          ? d
          : [...d, { who: 'bot', text: h.ask, q: h.id, chips: h.options }]
      );
    }
  }, [l]),
    Il.useEffect(() => {
      l === f.length + 1 &&
        a.industry &&
        a.intent &&
        a.urgency &&
        t(f.length + 2);
    }, [l, a, f.length]);
  function o() {
    t(0), u({ industry: null, intent: null, urgency: null }), n([]);
  }
  function g() {
    if (l === 0)
      return p.jsxs('div', {
        className: 'flex flex-col items-center gap-4 text-center',
        children: [
          p.jsx('div', {
            className: 'text-[22px] font-semibold leading-tight',
            children: _e.title
          }),
          p.jsx('div', {
            className: 'text-[15px] text-[#9aa0ad]',
            children: _e.subtitle
          }),
          p.jsx('button', {
            onClick: () => t(1),
            className: 'chip w-full border-[#3b82f6] text-[#3b82f6]',
            children: 'Start Quiz'
          }),
          p.jsx('div', {
            className: 'text-[12px] text-[#5e6269]',
            children: _e.hint
          })
        ]
      });
    if (l >= 1 && l <= f.length) {
      const h = f[l - 1],
        d = h.field,
        v = a[d];
      return p.jsxs('div', {
        className: 'flex flex-col gap-4',
        children: [
          p.jsx('div', { className: 'bubble bubble-bot', children: h.ask }),
          p.jsx('div', {
            className: 'flex flex-wrap gap-2',
            children: h.options.map((b) =>
              p.jsx(
                'button',
                {
                  onClick: () => {
                    i(d, b.label), i('_tap_' + d, b.label), c();
                  },
                  className: `chip ${v === b.label ? 'selected' : ''}`,
                  children: b.label
                },
                b.value
              )
            )
          }),
          v &&
            p.jsx('div', {
              className: 'bubble bubble-human self-end',
              children: v
            })
        ]
      });
    }
    if (l === f.length + 1)
      return p.jsx('div', {
        className: 'bubble bubble-bot',
        children: 'Let me find the right fit…'
      });
    if (l === f.length + 2) return p.jsx(uh, { answers: a, onRestart: o });
  }
  return p.jsx('div', {
    className: 'space-y-3',
    children: p.jsx('div', { className: 'h-1 transition-all', children: g() })
  });
}
function fh() {
  return p.jsx('div', {
    className: 'mx-auto max-w-[390px] px-3 pt-4 pb-8',
    children: p.jsx(nh, {})
  });
}
ah.createRoot(document.getElementById('root')).render(
  p.jsx(Ev.StrictMode, { children: p.jsx(fh, {}) })
);
