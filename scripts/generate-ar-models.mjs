import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(projectRoot, "public");
const sourceModelPath = path.join(publicRoot, "Soda-can.gltf");
const sourceBufferPath = path.join(publicRoot, "Soda-can.bin");
const outputRoot = path.join(publicRoot, "ar");

const flavors = [
  { slug: "frostbite-berry", label: "frostbite-berry.png" },
  { slug: "neon-meltdown", label: "neon-meltdown.png" },
  { slug: "cosmic-crush", label: "cosmic-crush.png" },
  { slug: "midnight-citrus", label: "midnight-citrus.png" },
  { slug: "velvet-frost", label: "velvet-frost.png" },
];

const sourceModel = JSON.parse(await readFile(sourceModelPath, "utf8"));

for (const flavor of flavors) {
  const outputDir = path.join(outputRoot, flavor.slug);
  const outputModel = structuredClone(sourceModel);

  outputModel.materials = [
    {
      name: "CRYO brushed aluminium",
      pbrMetallicRoughness: {
        baseColorFactor: [0.78, 0.84, 0.88, 1],
        metallicFactor: 1,
        roughnessFactor: 0.26,
      },
    },
    {
      name: `CRYO ${flavor.slug} label`,
      pbrMetallicRoughness: {
        baseColorTexture: { index: 0 },
        metallicFactor: 0.58,
        roughnessFactor: 0.18,
      },
    },
  ];
  outputModel.samplers = [
    {
      magFilter: 9729,
      minFilter: 9987,
      wrapS: 10497,
      wrapT: 33071,
    },
  ];
  outputModel.images = [
    {
      uri: `../../assets/labels/${flavor.label}`,
    },
  ];
  outputModel.textures = [
    {
      sampler: 0,
      source: 0,
    },
  ];

  outputModel.meshes[0].primitives[0].material = 0;
  outputModel.meshes[1].primitives[0].material = 0;
  outputModel.meshes[1].primitives[1].material = 1;

  outputModel.nodes[1] = {
    ...outputModel.nodes[1],
    scale: [0.18, 0.18, 0.18],
  };

  outputModel.buffers[0].uri = "Soda-can.bin";

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    path.join(outputDir, "can.gltf"),
    `${JSON.stringify(outputModel, null, 2)}\n`,
  );
  await copyFile(sourceBufferPath, path.join(outputDir, "Soda-can.bin"));
}
