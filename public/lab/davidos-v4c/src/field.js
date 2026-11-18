import { alphabet, knot, makeDiagram, projects } from "./scenes.js";

const quad = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;
const head = `#version 300 es
precision highp float;
uniform sampler2D stateTex,shapeTex,wallTex,diagramTex,tileTex,atlasTex;
uniform vec2 grid,cell,screen,cssSize;
uniform vec3 accent;
uniform vec4 wake;
uniform float t,dt,seed,phase,within,settle;
out vec4 outColor;
`;
const simulation =
  head +
  `
void main(){
 vec2 p=gl_FragCoord.xy,uv=p/grid;
 vec4 wall=texture(wallTex,uv), route=texture(diagramTex,uv);
 if(wall.a>.5){outColor=vec4(.5,.5,0,0);return;}
 vec4 last=texture(stateTex,uv);
 vec2 velocity=(last.rg-.5)*40.;
 vec4 adv=texture(stateTex,uv-velocity*dt/grid);
 vec2 old=(adv.rg-.5)*40.;
 vec4 surface=texture(shapeTex,uv+(seed>.5?vec2(0):old*.1/grid));
 float inside=step(.001,surface.r);
 float wave=sin(p.x*.041+sin(p.y*.117+t*.16)*1.7-t*.23);
 vec2 drift=vec2(4.8+2.*wave,1.4*cos(p.x*.035+t*.21)-1.5*sin(p.y*.093));
 vec2 flow=mix(drift,(surface.gb-.5)*22.,inside);
 float angle=route.a*6.2831853-3.14159265;
 if(route.r>0.)flow=vec2(cos(angle),sin(angle))*11.;
 vec2 normal=(wall.rg-.5)*2.;
 flow-=normal*min(0.,dot(flow,normal))*wall.b;
 flow+=normal*wall.b*4.;
 float d=length((p-wake.xy)*vec2(1.,1.6));
 float touch=exp(-d*d*.023)*wake.w;
 vec2 radial=(p-wake.xy)/max(d,1.);
 flow+=touch*(radial*10.+vec2(-radial.y,radial.x)*14.+vec2(wake.z*4.,0.));
 vec2 v=mix(old,flow,seed>.5?1.:1.-exp(-dt*5.));
 float bands=.5+.5*sin(p.x*.07+p.y*.41+4.*sin(p.x*.035-t*.14)-t*.32);
 float ambient=.025+.062*pow(bands,5.)+.018*wave;
 float source=mix(ambient,surface.r*(.65+.28*surface.a+.18*sin(p.y*.67+p.x*.25-t*1.8))+.09,inside);
 float energized=1.-step(.1,abs(route.g*255.-phase-1.));
 float packet=energized*exp(-pow((route.b-within)*6.,2.))*step(.001,route.r);
 source+=touch*.55+packet*.85;
 float density=mix(adv.b,source,seed>.5?1.:1.-exp(-dt*(inside>.5?5.:3.)));
 outColor=vec4(clamp(v/40.+.5,0.,1.),clamp(density,0.,1.),max(packet,adv.a*exp(-dt*5.)));
}`;
const classify =
  head +
  `
float noise(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
 vec2 p=gl_FragCoord.xy, uv=p/grid;
 vec4 a=texture(stateTex,uv), route=texture(diagramTex,uv);
 float n=noise(floor(p)),den=a.b;
 vec2 v=(a.rg-.5)*40.;
 float g=1.;
 if(den>.11){
   float level=clamp((den-.09)*10.+n*1.5,1.,11.);
   g=floor(level);
   if(den>.54 && mod(p.x*.25+p.y*.5,2.)<.9)g=7.;
   if(mod(floor(p.x*.25+p.y*.36),4.)<.75 && level<6.){
     g=abs(v.x)>2.5*abs(v.y)?12.:abs(v.y)>1.9*abs(v.x)?14.:v.x*v.y<0.?13.:15.;
   }
 }else{g=n>.42?1.:(abs(v.y)>.9?13.:3.);}
 float light=den>.105?.14+den*.68:den*(n>.35?.86:.36);
 if(den<.034 || (den<.068 && n>.32))light=0.;
 if(route.r>0.){
   g=floor(route.r*255.+.5);
   float energized=1.-step(.1,abs(route.g*255.-phase-1.));
   light=mix(light,(route.g==0.?.28:.52)+energized*.2+.42*a.a,settle);
   if(a.a>.53 && (g==12. || g==14. || g==30. || g==4.))g=31.;
 }
 if(texture(wallTex,uv).a>.5)light=0.;
 outColor=vec4(g/255.,clamp(light,0.,1.),0.,1.);
}`;
const draw =
  head +
  `
void main(){
 vec2 px=vec2(gl_FragCoord.x,screen.y-gl_FragCoord.y)*cssSize/screen;
 vec2 q=px/cell, index=floor(q);
 vec4 tile=texelFetch(tileTex,ivec2(index),0);
 float glyph=floor(tile.r*255.+.5);
 float ink=texture(atlasTex,(vec2(glyph,0.)+fract(q))/vec2(32.,1.)).a;
 vec3 bg=vec3(10./255.);
 outColor=vec4(mix(bg,accent,tile.g*ink),1.);
}`;

function createAtlas() {
  const c = document.createElement("canvas");
  const w = 24,
    h = 48;
  c.width = w * alphabet.length;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.font = "40px JB";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "white";
  alphabet.forEach((ch, i) => {
    const x = i * w;
    if (ch === "■") {
      ctx.fillRect(x + 2, 14, w - 4, 20);
    } else if ("─│┌┐└┘═".includes(ch)) {
      const midX = x + w / 2,
        midY = h / 2,
        pen = 4;
      if (ch === "═") {
        ctx.fillRect(x, midY - 5, w, pen);
        ctx.fillRect(x, midY + 3, w, pen);
      } else {
        if ("─┐┘".includes(ch))
          ctx.fillRect(x, midY - pen / 2, w / 2 + pen / 2, pen);
        if ("─┌└".includes(ch))
          ctx.fillRect(midX - pen / 2, midY - pen / 2, w / 2 + pen / 2, pen);
        if ("│└┘".includes(ch))
          ctx.fillRect(midX - pen / 2, 0, pen, h / 2 + pen / 2);
        if ("│┌┐".includes(ch))
          ctx.fillRect(midX - pen / 2, midY - pen / 2, pen, h / 2 + pen / 2);
      }
    } else if (i >= 8 && i <= 11) {
      for (let py = 0; py < h; py += 4)
        for (let px = 0; px < w; px += 4)
          if ((px / 4 + (py / 4) * 3) % 4 <= i - 8)
            ctx.fillRect(x + px, py, 3, 3);
      if (i === 11) ctx.fillRect(x, 2, w, h - 4);
    } else ctx.fillText(ch, x + w / 2, 38, w);
  });
  return c;
}

function compile(gl, frag) {
  const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, i) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, i === 0 ? quad : frag);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(s));
    return s;
  });
  const p = gl.createProgram();
  shaders.forEach((s) => gl.attachShader(p, s));
  gl.linkProgram(p);
  shaders.forEach((s) => gl.deleteShader(s));
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw Error(gl.getProgramInfoLog(p));
  const uniforms = {};
  for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) {
    const name = gl.getActiveUniform(p, i).name;
    uniforms[name] = gl.getUniformLocation(p, name);
  }
  return { p, u: uniforms };
}

function obstacleMap(cols, rows, cw, ch) {
  const result = new Uint8Array(cols * rows * 4);
  for (let i = 0; i < result.length; i += 4) {
    result[i] = result[i + 1] = 128;
  }
  function block(r) {
    if (!r.width || !r.height) return;
    const x0 = (r.left + scrollX - 3) / cw,
      x1 = (r.right + scrollX + 3) / cw;
    const y0 = (r.top + scrollY - 2) / ch,
      y1 = (r.bottom + scrollY + 2) / ch;
    for (
      let y = Math.max(0, Math.floor(y0 - 4));
      y < Math.min(rows, Math.ceil(y1 + 4));
      y++
    ) {
      for (
        let x = Math.max(0, Math.floor(x0 - 4));
        x < Math.min(cols, Math.ceil(x1 + 4));
        x++
      ) {
        const k = (y * cols + x) * 4;
        if (x + 1 > x0 && x < x1 && y + 1 > y0 && y < y1) {
          result[k + 3] = 255;
          continue;
        }
        const dx = x + 0.5 - Math.max(x0, Math.min(x1, x + 0.5)),
          dy = y + 0.5 - Math.max(y0, Math.min(y1, y + 0.5));
        const d = Math.hypot(dx, dy),
          weight = Math.round(255 * Math.max(0, 1 - d / 4));
        if (weight > result[k + 2]) {
          result[k] = 128 + Math.round((dx / d) * 126);
          result[k + 1] = 128 + Math.round((dy / d) * 126);
          result[k + 2] = weight;
        }
      }
    }
  }
  const root = document.querySelector(".page"),
    walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (
      !node.textContent.trim() ||
      node.parentElement.closest("[hidden],.sr,.fallback")
    )
      continue;
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) block(r);
  }
  for (const el of root.querySelectorAll(
    "input,.mark,.brand-glyph,#swatches,nav a,.availability i,.primary,#commands:not([hidden]),kbd,.field-label",
  ))
    block(el.getBoundingClientRect());
  return result;
}

export function mountField({ capture, onPhase, onFrame, onState, onSize }) {
  const canvas = document.querySelector("#field"),
    stage = document.querySelector("#stage"),
    labels = document.querySelector("#labels");
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  let pipe = null;
  if (gl) {
    try {
      pipe = [simulation, classify, draw].map((src) => compile(gl, src));
    } catch (e) {
      console.error(e);
    }
  }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let tex = [],
    buffers = [],
    front = 0,
    width,
    height,
    cw,
    ch,
    cols,
    rows,
    layout,
    atlas,
    stale = true,
    canvasDirty = true;
  let allocatedCols = 0,
    allocatedRows = 0;
  let mode = -1,
    t = 0,
    clock = 0,
    last = 0,
    raf = 0,
    lastPhase = -1,
    quality = Math.min(2, devicePixelRatio);
  let nframes = 0,
    intervalSum = 0,
    measure = 0,
    slow = 0,
    steps = 0;
  let tint = [0, 1, 0.533],
    mouse = [-100, -100, 0, 0];
  function texture(linear = false) {
    const o = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, o);
    for (const p of [gl.TEXTURE_MAG_FILTER, gl.TEXTURE_MIN_FILTER])
      gl.texParameteri(gl.TEXTURE_2D, p, linear ? gl.LINEAR : gl.NEAREST);
    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T])
      gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
    return o;
  }
  const upload = (o, w, h, data) => {
    gl.bindTexture(gl.TEXTURE_2D, o);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data,
    );
  };
  if (pipe) {
    atlas = texture(true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      createAtlas(),
    );
    tex = Array.from({ length: 6 }, (_, i) => texture(i === 0 || i === 1));
    buffers = [0, 1, 5].map(() => gl.createFramebuffer());
  }
  function geometry() {
    const r = stage.getBoundingClientRect(),
      x = Math.ceil((r.x + scrollX) / cw),
      y = Math.ceil((r.y + scrollY) / ch);
    const w = Math.max(5, Math.floor((r.right + scrollX) / cw) - x),
      h = Math.max(5, Math.floor((r.bottom + scrollY) / ch) - y);
    return {
      x,
      y,
      w,
      h,
      dx: x * cw - r.x - scrollX,
      dy: y * ch - r.y - scrollY,
    };
  }
  function updateLayout() {
    width = document.documentElement.clientWidth;
    height = Math.ceil(
      document.querySelector(".page").getBoundingClientRect().height,
    );
    canvas.style.height = height + "px";
    cw = document.querySelector("#cell").getBoundingClientRect().width;
    ch = 12;
    cols = Math.ceil(width / cw);
    rows = Math.ceil(height / ch);
    layout = geometry();
    const { x, y, w, h, dx, dy } = layout,
      surface = new Uint8Array(cols * rows * 4),
      routes = new Uint8Array(cols * rows * 4);
    onSize(w, h);
    const scene = mode < 0 ? null : makeDiagram(mode, w, h);
    const form = scene ? null : knot(w, h);
    labels.replaceChildren();
    if (form) {
      for (let j = 0; j < h; j++)
        surface.set(
          form.subarray(j * w * 4, (j + 1) * w * 4),
          ((y + j) * cols + x) * 4,
        );
    } else {
      for (const l of scene.labels) {
        const el = document.createElement("span");
        el.className = "annotation";
        el.textContent = l.text;
        el.dataset.phase = l.group;
        el.style.left = dx + l.x * cw + "px";
        el.style.top = dy + l.y * ch + "px";
        labels.append(el);
      }
      for (const c of scene.cells) {
        if (c.x < 0 || c.x >= w || c.y < 0 || c.y >= h) continue;
        routes.set(
          [
            alphabet.indexOf(c.g),
            c.group + 1,
            Math.round(c.progress * 255),
            Math.round((c.angle / Math.PI + 1) * 127.5),
          ],
          ((y + c.y) * cols + x + c.x) * 4,
        );
      }
    }
    const walls = obstacleMap(cols, rows, cw, ch);
    if (!pipe) {
      canvas.hidden = true;
      const still = document.createElement("canvas");
      still.setAttribute("aria-hidden", "true");
      still.className = "fallback";
      still.width = w * 12;
      still.height = h * 24;
      still.style.cssText =
        "position:absolute;pointer-events:none;width:" +
        w * cw +
        "px;height:" +
        h * ch +
        "px;left:" +
        dx +
        "px;top:" +
        dy +
        "px";
      const ctx = still.getContext("2d"),
        sheet = createAtlas();
      for (let j = 0; j < h; j++)
        for (let i = 0; i < w; i++) {
          const k = ((j + y) * cols + i + x) * 4;
          if (walls[k + 3]) continue;
          const g = scene
            ? routes[k]
            : Math.floor((form[(j * w + i) * 4] / 255) * 9);
          if (g)
            ctx.drawImage(sheet, g * 24, 0, 24, 48, i * 12, j * 24, 12, 24);
        }
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--accent");
      ctx.fillRect(0, 0, still.width, still.height);
      still.style.opacity = ".65";
      labels.prepend(still);
    } else {
      if (cols !== allocatedCols || rows !== allocatedRows) {
        for (const i of [0, 1, 5]) upload(tex[i], cols, rows, null);
        allocatedCols = cols;
        allocatedRows = rows;
        steps = 0;
      }
      [surface, walls, routes].forEach((a, j) =>
        upload(tex[j + 2], cols, rows, a),
      );
      buffers.forEach((f, i) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          tex[[0, 1, 5][i]],
          0,
        );
      });
    }
    stale = false;
    canvasDirty = true;
    lastPhase = -1;
    if (capture !== null || reduced.matches) steps = 0;
  }
  function pass(type, target, seed = 0, dt = 0) {
    const { p, u } = pipe[type];
    gl.useProgram(p);
    const names = [
        "stateTex",
        "shapeTex",
        "wallTex",
        "diagramTex",
        "tileTex",
        "atlasTex",
      ],
      textures = [tex[front], tex[2], tex[3], tex[4], tex[5], atlas];
    names.forEach((name, i) => {
      if (u[name]) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.uniform1i(u[name], i);
      }
    });
    gl.uniform2f(u.grid, cols, rows);
    gl.uniform2f(u.cell, cw, ch);
    gl.uniform2f(u.cssSize, width, height);
    gl.uniform2f(u.screen, canvas.width, canvas.height);
    gl.uniform1f(
      u.settle,
      capture !== null || reduced.matches ? 1 : Math.min(1, clock * 3),
    );
    gl.uniform1f(u.t, t);
    gl.uniform1f(u.seed, seed);
    gl.uniform1f(u.dt, dt);
    gl.uniform1f(u.phase, lastPhase);
    gl.uniform1f(u.within, (clock / 2.8) % 1);
    gl.uniform3fv(u.accent, tint);
    gl.uniform4fv(u.wake, mouse);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target < 0 ? null : buffers[target]);
    gl.viewport(
      0,
      0,
      target < 0 ? canvas.width : cols,
      target < 0 ? canvas.height : rows,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function frame(now) {
    raf = 0;
    if (document.hidden) return;
    const gap = last ? (now - last) * 0.001 : 0;
    last = now;
    const live = !!pipe && capture === null && !reduced.matches;
    if (live) {
      const dt = Math.min(gap, 0.075);
      t += dt;
      clock += dt;
      mouse[3] *= Math.exp(-dt * 2.8);
    } else {
      clock = t =
        reduced.matches || !pipe
          ? mode < 0
            ? 0
            : (projects[mode].steps.length - 0.45) * 2.8
          : capture;
    }
    const phase =
      mode < 0 ? -1 : Math.floor(clock / 2.8) % projects[mode].steps.length;
    if (lastPhase !== phase || stale) onPhase(phase);
    if (stale) updateLayout();
    else if (lastPhase !== phase && pipe)
      upload(tex[3], cols, rows, obstacleMap(cols, rows, cw, ch));
    if (lastPhase !== phase) {
      lastPhase = phase;
      labels
        .querySelectorAll(".annotation")
        .forEach((el) =>
          el.classList.toggle("current", Number(el.dataset.phase) === phase),
        );
    }
    if (pipe) {
      if (canvasDirty) {
        canvas.width = Math.max(1, Math.round(width * quality));
        canvas.height = Math.max(1, Math.round(height * quality));
        canvasDirty = false;
      }
      if (!steps || live) {
        pass(0, 1 - front, steps ? 0 : 1, Math.min(gap || 1 / 60, 0.075));
        front = 1 - front;
        steps++;
        if (!live && capture !== null && !reduced.matches && steps === 1) {
          const fixed = t;
          for (let i = 0; i < 12; i++) {
            t = fixed - (11 - i) / 30;
            pass(0, 1 - front, 0, 1 / 30);
            front = 1 - front;
          }
          t = fixed;
        }
      }
      pass(1, 2);
      pass(2, -1);
    }
    if (live && gap > 0) {
      intervalSum += gap * 1000;
      nframes++;
      measure += gap;
      if (measure >= 1) {
        const avg = intervalSum / nframes;
        onFrame(avg);
        slow = avg > 24 ? slow + 1 : 0;
        if (slow >= 2 && quality > 0.67) {
          quality = Math.max(0.67, quality * 0.8);
          canvasDirty = true;
          slow = 0;
        }
        intervalSum = nframes = measure = 0;
      }
    }
    if (live) schedule();
  }
  function schedule() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function refresh() {
    stale = true;
    schedule();
  }
  function state() {
    onState(
      pipe
        ? reduced.matches
          ? "still"
          : capture !== null
            ? "capture"
            : "live"
        : "fallback",
    );
    last = 0;
    refresh();
  }
  if (gl)
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      pipe = null;
      state();
    });
  const observer = new ResizeObserver(refresh);
  observer.observe(document.querySelector(".page"));
  observer.observe(stage);
  observer.observe(document.querySelector(".metrics"));
  window.addEventListener("resize", refresh);
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    if (!document.hidden) schedule();
  });
  reduced.addEventListener("change", state);
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!pipe || capture !== null || reduced.matches || !cw) return;
      mouse = [
        e.pageX / cw,
        e.pageY / ch,
        Math.sign(e.movementX),
        Math.min(1.8, 0.55 + Math.hypot(e.movementX, e.movementY) * 0.07),
      ];
    },
    { passive: true },
  );
  state();
  return {
    refresh,
    setMode(i) {
      mode = i;
      clock = 0;
      refresh();
    },
    tint(rgb) {
      tint = rgb;
      if (!pipe) refresh();
      else schedule();
    },
  };
}
