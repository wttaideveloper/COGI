// Orthographic Earth projection rendered at device-pixel resolution on the GPU.
export function createEarthRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false })
  if (!gl) return null
  const shader = (type: number, source: string) => {
    const result = gl.createShader(type)!
    gl.shaderSource(result, source)
    gl.compileShader(result)
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      gl.deleteShader(result)
      throw new Error('Earth shader could not compile')
    }
    return result
  }
  const vertex = shader(gl.VERTEX_SHADER, `
    attribute vec2 position;
    varying vec2 point;
    void main() { point = position; gl_Position = vec4(position, 0.0, 1.0); }
  `)
  const fragment = shader(gl.FRAGMENT_SHADER, `
    precision highp float;
    varying vec2 point;
    uniform sampler2D earth;
    uniform vec2 rotation;
    uniform float ready;
    uniform float resolution;
    void main() {
      vec2 p = point / 0.98056;
      float r2 = dot(p, p);
      if (r2 > 1.0) { gl_FragColor = vec4(0.0); return; }
      float z = sqrt(max(0.0, 1.0 - r2));
      float a = rotation.x, b = rotation.y;
      float worldY = cos(b) * p.y + sin(b) * z;
      float forward = -sin(b) * p.y + cos(b) * z;
      float worldX = cos(a) * p.x + sin(a) * forward;
      float worldZ = -sin(a) * p.x + cos(a) * forward;
      vec2 uv = vec2(atan(worldX, worldZ) / 6.28318530718 + 0.5,
                     asin(clamp(worldY, -1.0, 1.0)) / 3.14159265359 + 0.5);
      vec3 color = mix(vec3(0.035, 0.17, 0.29), texture2D(earth, uv).rgb, ready);
      float light = 0.72 + 0.32 * max(0.0, dot(vec3(p, z), normalize(vec3(-0.3, 0.3, 0.85))));
      float atmosphere = pow(1.0 - z, 4.0) * 0.13;
      color = color * light + vec3(0.15, 0.45, 0.8) * atmosphere;
      float alpha = smoothstep(0.0, 3.0 / resolution, 1.0 - sqrt(r2));
      gl_FragColor = vec4(color, alpha);
    }
  `)
  const program = gl.createProgram()!
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Earth shader could not link')
  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8, 40, 70, 255]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const rotation = gl.getUniformLocation(program, 'rotation')
  const ready = gl.getUniformLocation(program, 'ready')
  const resolution = gl.getUniformLocation(program, 'resolution')
  let lastView = { lat: 12, lng: 42 }
  const draw = (view = lastView) => {
    lastView = view
    const size = Math.min(1536, Math.max(720, Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 3))))
    if (canvas.width !== size) canvas.width = canvas.height = size
    gl.viewport(0, 0, size, size)
    gl.uniform1f(resolution, size)
    gl.uniform2f(rotation, view.lng * Math.PI / 180, view.lat * Math.PI / 180)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
  const observer = new ResizeObserver(() => draw())
  observer.observe(canvas)
  return {
    draw,
    setImage(image: HTMLImageElement) {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.uniform1f(ready, 1)
      draw()
    },
    destroy() {
      observer.disconnect()
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    },
  }
}
