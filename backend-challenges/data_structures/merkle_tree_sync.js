import crypto from 'crypto';

function hash(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

function buildMerkleTree(data) {
    // Primitive values
    if (
        data === null ||
        typeof data !== "object"
    ) {
        const valueHash = hash(JSON.stringify(data));

        return {
            type: "primitive",
            hash: valueHash,
            children: null
        };
    }

    // Arrays
    if (Array.isArray(data)) {
        const children = data.map(item => buildMerkleTree(item));

        const combined = children.map(child => child.hash).join("|");

        return {
            type: "array",
            hash: hash(combined),
            children
        };
    }

    // Objects
    const keys = Object.keys(data).sort();

    const children = {};

    for (const key of keys) {
        children[key] = buildMerkleTree(data[key]);
    }

    const combined = keys
        .map(key => `${key}:${children[key].hash}`)
        .join("|");

    return {
        type: "object",
        hash: hash(combined),
        children
    };
}

function compareTrees(node1, node2, path = "") {
    const changes = [];

    // Same hash -> no need to go deeper
    if (node1.hash === node2.hash) {
        return changes;
    }

    // Different primitive values
    if (
        node1.type === "primitive" ||
        node2.type === "primitive"
    ) {
        changes.push(path || "root");
        return changes;
    }

    // Arrays
    if (node1.type === "array" && node2.type === "array") {
        const maxLen = Math.max(
            node1.children.length,
            node2.children.length
        );

        for (let i = 0; i < maxLen; i++) {
            const child1 = node1.children[i];
            const child2 = node2.children[i];

            const childPath = `${path}[${i}]`;

            if (!child1 || !child2) {
                changes.push(childPath);
            } else {
                changes.push(...compareTrees(child1, child2, childPath));
            }
        }

        return changes;
    }

    // Objects
    const keys = new Set([
        ...Object.keys(node1.children || {}),
        ...Object.keys(node2.children || {})
    ]);

    for (const key of keys) {
        const child1 = node1.children[key];
        const child2 = node2.children[key];

        const childPath = path ? `${path}.${key}` : key;

        if (!child1 || !child2) {
            changes.push(childPath);
        } else {
            changes.push(...compareTrees(child1, child2, childPath));
        }
    }

    return changes;
}

const json1 = {
  user: {
    name: "Subham",
    age: 25
  },
  city: "Bhubaneswar"
};

const json2 = {
  user: {
    name: "Subham",
    age: 26
  },
  city: "Bhubaneswar"
};

const tree1 = buildMerkleTree(json1);
const tree2 = buildMerkleTree(json2);

console.log(compareTrees(tree1, tree2));