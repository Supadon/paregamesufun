const fs = require('fs');
const path = require('path');
const file = path.resolve('..', 'paregamesufun-new', 'src', 'lib', 'types.ts');
let code = fs.readFileSync(file, 'utf8');
code = code.replace("status: 'done' | 'wip'", "status: GameStatus");
fs.writeFileSync(file, code, 'utf8');
console.log('Fixed Game.status in types.ts');
