import fs from 'fs';

var JWTPublicKey: string|undefined = undefined;
var JWTPrivateKey: string|undefined = undefined;

(async()=>{
    if (!fs.existsSync('jwt.key') || !fs.existsSync('jwt.key.pub')) {
        console.error("=========================================================================");
        console.error("Could not find RSA keys for JWT, run 'npm run keygen' to create new keys!");
        console.error("=========================================================================");
        return;
    }
    fs.readFile('jwt.key.pub', {encoding: 'utf-8'}, (err, data)=>{
        if (err) console.error("Error while reading jwt.key.pub: ", err);
        else JWTPublicKey = data;
    });
    fs.readFile('jwt.key', {encoding: 'utf-8'}, (err, data)=>{
        if (err) console.error("Error while reading jwt.key: ", err);
        else JWTPrivateKey = data;
    });
})();

export function getJWTPublicKey(): string {
    if (JWTPublicKey) return JWTPublicKey;
    else throw new Error("Could not obtain JWT Public Key, run 'npm run keygen' to create new keys")
}

export function getJWTPrivateKey(): string {
    if (JWTPrivateKey) return JWTPrivateKey;
    else throw new Error("Could not obtain JWT Private Key, run 'npm run keygen' to create new keys")
}