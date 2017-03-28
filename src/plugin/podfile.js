const fs = require('fs');

function applyPatch(file, patch) {
  var content = fs.readFileSync(file, 'utf8');


  if(content.match(patch.findPattern)){
    content = content.replace(patch.findPattern, '')
  }

  content = content.replace(patch.pattern, match => `${patch.patch}${match}`)

  fs.writeFileSync(file, content)
};
// aim is to match (space insignificant around the comma, comma optional):
//     pod 'Foobar', '1.2'
//     pod 'Foobar', 'abc 123 1.2'
//     pod 'PonyDebugger', :configurations => ['Debug', 'Beta']


function makeBuildPatch(name, version) {
  return {
    pattern: /\t*pod\s+\'\w+\'\s*,?.*\n/,
    patch: `    pod '${name}', '${version}'\n`,
    findPattern:new RegExp('    pod\\s+\''+name+'\'\\s*,?.*\\n',"g")
  };
};

function revokePatch(file, patch) {
  fs.writeFileSync(file, fs
      .readFileSync(file, 'utf8')
      .replace(patch.findPattern, '')
  );
};

//

module.exports = {
  applyPatch,
  makeBuildPatch,
  revokePatch
}