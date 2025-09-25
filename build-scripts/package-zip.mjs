import path from 'path';
import fse from 'fs-extra';
import AdmZip from 'adm-zip';

const projectName = Object.keys(
  JSON.parse(fse.readFileSync('angular.json').toString()).projects,
)[0];

function walk(dir) {
  const filePaths = [];
  const paths = fse.readdirSync(dir);
  for (const filePath of paths) {
    const relativePath = path.join(dir, filePath);
    const isFile = fse.statSync(relativePath).isFile();
    if (isFile) filePaths.push(relativePath);
    else {
      filePaths.push(...walk(relativePath));
    }
  }
  return filePaths;
}

function makeManifest() {
  const buildDir = path.join('dist', projectName, 'browser');
  const buildDirExists =
    fse.existsSync(buildDir) && fse.statSync(buildDir).isDirectory();

  // Run twice to include manifest.json inside manifest.json
  for (let i = 1; i <= 2; i++) {
    if (!buildDirExists) continue;
    const manifest = walk(buildDir).map((filepath) =>
      path.relative(buildDir, filepath).split(path.sep).join('/'),
    );

    const rendererManifest = manifest;

    const manifestJsonPath = path.join(buildDir, 'manifest.json');
    fse.writeFileSync(
      manifestJsonPath,
      JSON.stringify(rendererManifest, null, 2),
    );
  }
}

async function removeExtraFiles() {
  const buildDir = path.join('dist', projectName);
  const filenames = fse
    .readdirSync(buildDir)
    .filter((name) => fse.statSync(path.join(buildDir, name)).isFile());

  for (const filepath of filenames.map((filename) =>
    path.join(buildDir, filename),
  )) {
    fse.rmSync(filepath);
  }
}

async function makeZip() {
  const buildDir = path.join('dist', projectName, 'browser');
  const version = JSON.parse(
    fse.readFileSync('package.json').toString(),
  ).version;

  const outputFilepath = path.join('dist', `${projectName}-v${version}.zip`);

  const zip = new AdmZip();
  zip.addLocalFolder(buildDir);
  zip.writeZip(outputFilepath);
}

async function main() {
  removeExtraFiles();
  makeManifest();
  makeZip();
}

main();
