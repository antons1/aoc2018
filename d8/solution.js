const input = require('./input.js');
//const input = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";

const list = input.split(' ').map((num) => parseInt(num));

function generateTree(list) {
    const children = list[0];
    const metadata = list[1];
    
    let rest = list.slice(2);
    let childNodes = [];
    for(let i = 0; i < children; i++) {
        let [retRest, retTree] = generateTree(rest);
        childNodes.push(retTree);
        rest = retRest;
    }
    
    const tree = {
        metadata: rest.slice(0, metadata),
        children: childNodes,
        header: [children, metadata]
    }

    rest = rest.slice(metadata);

    return [rest, tree];
}

function traverseTree(tree, traverseFn) {
    let value = 0;
    if(tree.children) {
        for(let i = 0; i < tree.children.length; i++) {
            value += traverseTree(tree.children[i], traverseFn);
        }
        return traverseFn ? value += traverseFn(tree) : console.log(tree);
    } else return;
}

function calculateValues(tree) {
    console.log("In", tree.header, tree.metadata);
    let value = 0;
    if(tree.children.length === 0) value += tree.metadata.reduce((total, meta) => total + meta, 0);
    else {
        for(let i = 0; i < tree.metadata.length; i++) {
            if(!tree.children[tree.metadata[i]-1]) value += 0;
            else value += calculateValues(tree.children[tree.metadata[i]-1]);
        }
    }
    return value;
}

const [rest, tree] = generateTree(list);

console.log(traverseTree(tree, (tree) => tree.metadata.reduce((total, meta) => total + meta, 0)));
console.log(calculateValues(tree));