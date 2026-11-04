import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import CarArt from './CarArt'
import { shapeFor } from '../data/cars'
import type { Car } from '../data/cars'
import { buildCar, CAR_LENGTH } from '../three/buildCar'

interface CarViewer3DProps {
  car: Car
}

export default function CarViewer3D({ car }: CarViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setFailed(true)
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.95
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.domElement.className = 'viewer-canvas'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.65

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    camera.position.set(7.4, 2.1, 5.8)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.75, 0)
    controls.enableDamping = true
    controls.enablePan = false
    controls.maxPolarAngle = Math.PI / 2 - 0.04
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.6
    let resume: number | undefined
    controls.addEventListener('start', () => {
      controls.autoRotate = false
      window.clearTimeout(resume)
    })
    controls.addEventListener('end', () => {
      resume = window.setTimeout(() => {
        controls.autoRotate = true
      }, 2500)
    })

    // lighting
    const key = new THREE.DirectionalLight(0xffffff, 1.7)
    key.position.set(5, 8, 4)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = -5
    key.shadow.camera.right = 5
    key.shadow.camera.top = 5
    key.shadow.camera.bottom = -5
    key.shadow.bias = -0.0004
    scene.add(key)
    const rim = new THREE.DirectionalLight(new THREE.Color(car.accent), 1.6)
    rim.position.set(-6, 3, -5)
    scene.add(rim)
    scene.add(new THREE.HemisphereLight(0x8a7cff, 0x120818, 0.3))

    // turntable
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.7, 96),
      new THREE.MeshStandardMaterial({
        color: 0x0a0b10,
        roughness: 0.55,
        metalness: 0.15,
        envMapIntensity: 0.25,
      }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.45, 3.58, 128),
      new THREE.MeshBasicMaterial({ color: car.accent, side: THREE.DoubleSide }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.004
    scene.add(ring)

    // car (procedural by default, or a .glb supplied by the user)
    const carHolder = new THREE.Group()
    scene.add(carHolder)
    let spinners: THREE.Object3D[] = []
    let disposed = false

    const useProcedural = () => {
      const built = buildCar(shapeFor(car.category), car.color, car.accent)
      spinners = built.wheels
      carHolder.add(built.group)
    }

    if (car.model) {
      new GLTFLoader().load(
        car.model,
        (gltf) => {
          if (disposed) return
          const model = gltf.scene
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3())
          const scale = CAR_LENGTH / Math.max(size.x, size.z)
          model.scale.setScalar(scale)
          const b2 = new THREE.Box3().setFromObject(model)
          const c = b2.getCenter(new THREE.Vector3())
          model.position.set(-c.x, -b2.min.y, -c.z)
          model.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              o.castShadow = true
              o.receiveShadow = true
            }
          })
          carHolder.add(model)
        },
        undefined,
        () => {
          if (!disposed) useProcedural()
        },
      )
    } else {
      useProcedural()
    }

    const resize = () => {
      const w = Math.max(1, mount.clientWidth)
      const h = Math.max(1, mount.clientHeight)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // keep the whole car in frame on wide and narrow panels alike
      const fov = THREE.MathUtils.degToRad(camera.fov)
      const dist = Math.max(6.6, 7.2 / camera.aspect / (2 * Math.tan(fov / 2)))
      const dir = camera.position.clone().sub(controls.target).normalize()
      camera.position.copy(controls.target).addScaledVector(dir, dist)
      controls.minDistance = dist * 0.75
      controls.maxDistance = dist * 1.35
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    let last = performance.now()
    renderer.setAnimationLoop(() => {
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      for (const s of spinners) s.rotation.z -= dt * 2.2
      controls.update()
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      window.clearTimeout(resume)
      renderer.setAnimationLoop(null)
      ro.disconnect()
      controls.dispose()
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          const m = o.material as THREE.Material | THREE.Material[]
          if (Array.isArray(m)) m.forEach((x) => x.dispose())
          else m.dispose()
        }
      })
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [car])

  if (failed) {
    return (
      <div className="viewer viewer-fallback">
        <CarArt
          color={car.color}
          accent={car.accent}
          shape={shapeFor(car.category)}
          spinning
          title={`${car.brand} ${car.name}`}
        />
      </div>
    )
  }

  return (
    <div className="viewer" ref={mountRef} aria-label={`3D view of ${car.brand} ${car.name}`}>
      <span className="viewer-hint">Drag to rotate · 360°</span>
    </div>
  )
}
