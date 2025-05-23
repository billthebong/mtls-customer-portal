var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-61vKSy/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// ../../node_modules/jose/dist/webapi/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}
__name(concat, "concat");

// ../../node_modules/jose/dist/webapi/lib/base64.js
function encodeBase64(input) {
  if (Uint8Array.prototype.toBase64) {
    return input.toBase64();
  }
  const CHUNK_SIZE = 32768;
  const arr = [];
  for (let i = 0; i < input.length; i += CHUNK_SIZE) {
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
  }
  return btoa(arr.join(""));
}
__name(encodeBase64, "encodeBase64");
function decodeBase64(encoded) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(encoded);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
__name(decodeBase64, "decodeBase64");

// ../../node_modules/jose/dist/webapi/util/base64url.js
function decode(input) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
      alphabet: "base64url"
    });
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}
__name(decode, "decode");
function encode(input) {
  let unencoded = input;
  if (typeof unencoded === "string") {
    unencoded = encoder.encode(unencoded);
  }
  if (Uint8Array.prototype.toBase64) {
    return unencoded.toBase64({ alphabet: "base64url", omitPadding: true });
  }
  return encodeBase64(unencoded).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
__name(encode, "encode");

// ../../node_modules/jose/dist/webapi/util/errors.js
var JOSEError = class extends Error {
  static {
    __name(this, "JOSEError");
  }
  static code = "ERR_JOSE_GENERIC";
  code = "ERR_JOSE_GENERIC";
  constructor(message2, options) {
    super(message2, options);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var JWTClaimValidationFailed = class extends JOSEError {
  static {
    __name(this, "JWTClaimValidationFailed");
  }
  static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  claim;
  reason;
  payload;
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
var JWTExpired = class extends JOSEError {
  static {
    __name(this, "JWTExpired");
  }
  static code = "ERR_JWT_EXPIRED";
  code = "ERR_JWT_EXPIRED";
  claim;
  reason;
  payload;
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
var JOSEAlgNotAllowed = class extends JOSEError {
  static {
    __name(this, "JOSEAlgNotAllowed");
  }
  static code = "ERR_JOSE_ALG_NOT_ALLOWED";
  code = "ERR_JOSE_ALG_NOT_ALLOWED";
};
var JOSENotSupported = class extends JOSEError {
  static {
    __name(this, "JOSENotSupported");
  }
  static code = "ERR_JOSE_NOT_SUPPORTED";
  code = "ERR_JOSE_NOT_SUPPORTED";
};
var JWSInvalid = class extends JOSEError {
  static {
    __name(this, "JWSInvalid");
  }
  static code = "ERR_JWS_INVALID";
  code = "ERR_JWS_INVALID";
};
var JWTInvalid = class extends JOSEError {
  static {
    __name(this, "JWTInvalid");
  }
  static code = "ERR_JWT_INVALID";
  code = "ERR_JWT_INVALID";
};
var JWSSignatureVerificationFailed = class extends JOSEError {
  static {
    __name(this, "JWSSignatureVerificationFailed");
  }
  static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  constructor(message2 = "signature verification failed", options) {
    super(message2, options);
  }
};

// ../../node_modules/jose/dist/webapi/lib/crypto_key.js
function unusable(name, prop = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
__name(unusable, "unusable");
function isAlgorithm(algorithm, name) {
  return algorithm.name === name;
}
__name(isAlgorithm, "isAlgorithm");
function getHashLength(hash) {
  return parseInt(hash.name.slice(4), 10);
}
__name(getHashLength, "getHashLength");
function getNamedCurve(alg) {
  switch (alg) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
__name(getNamedCurve, "getNamedCurve");
function checkUsage(key, usage) {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
  }
}
__name(checkUsage, "checkUsage");
function checkSigCryptoKey(key, alg, usage) {
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!isAlgorithm(key.algorithm, "HMAC"))
        throw unusable("HMAC");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
        throw unusable("RSASSA-PKCS1-v1_5");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!isAlgorithm(key.algorithm, "RSA-PSS"))
        throw unusable("RSA-PSS");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "Ed25519":
    case "EdDSA": {
      if (!isAlgorithm(key.algorithm, "Ed25519"))
        throw unusable("Ed25519");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!isAlgorithm(key.algorithm, "ECDSA"))
        throw unusable("ECDSA");
      const expected = getNamedCurve(alg);
      const actual = key.algorithm.namedCurve;
      if (actual !== expected)
        throw unusable(expected, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usage);
}
__name(checkSigCryptoKey, "checkSigCryptoKey");

// ../../node_modules/jose/dist/webapi/lib/invalid_key_input.js
function message(msg, actual, ...types) {
  types = types.filter(Boolean);
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(", ")}, or ${last}.`;
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`;
  } else {
    msg += `of type ${types[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
__name(message, "message");
var invalid_key_input_default = /* @__PURE__ */ __name((actual, ...types) => {
  return message("Key must be ", actual, ...types);
}, "default");
function withAlg(alg, actual, ...types) {
  return message(`Key for the ${alg} algorithm must be `, actual, ...types);
}
__name(withAlg, "withAlg");

// ../../node_modules/jose/dist/webapi/lib/is_key_like.js
function isCryptoKey(key) {
  return key?.[Symbol.toStringTag] === "CryptoKey";
}
__name(isCryptoKey, "isCryptoKey");
function isKeyObject(key) {
  return key?.[Symbol.toStringTag] === "KeyObject";
}
__name(isKeyObject, "isKeyObject");
var is_key_like_default = /* @__PURE__ */ __name((key) => {
  return isCryptoKey(key) || isKeyObject(key);
}, "default");

// ../../node_modules/jose/dist/webapi/lib/is_disjoint.js
var is_disjoint_default = /* @__PURE__ */ __name((...headers) => {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
}, "default");

// ../../node_modules/jose/dist/webapi/lib/is_object.js
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
__name(isObjectLike, "isObjectLike");
var is_object_default = /* @__PURE__ */ __name((input) => {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}, "default");

// ../../node_modules/jose/dist/webapi/lib/check_key_length.js
var check_key_length_default = /* @__PURE__ */ __name((alg, key) => {
  if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
}, "default");

// ../../node_modules/jose/dist/webapi/lib/jwk_to_key.js
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          algorithm = { name: "ECDSA", namedCurve: "P-384" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          algorithm = { name: "ECDSA", namedCurve: "P-521" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "Ed25519":
        case "EdDSA":
          algorithm = { name: "Ed25519" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm, keyUsages };
}
__name(subtleMapping, "subtleMapping");
var jwk_to_key_default = /* @__PURE__ */ __name(async (jwk) => {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return crypto.subtle.importKey("jwk", keyData, algorithm, jwk.ext ?? (jwk.d ? false : true), jwk.key_ops ?? keyUsages);
}, "default");

// ../../node_modules/jose/dist/webapi/lib/validate_crit.js
var validate_crit_default = /* @__PURE__ */ __name((Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) => {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return /* @__PURE__ */ new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}, "default");

// ../../node_modules/jose/dist/webapi/lib/validate_algorithms.js
var validate_algorithms_default = /* @__PURE__ */ __name((option, algorithms) => {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
}, "default");

// ../../node_modules/jose/dist/webapi/lib/is_jwk.js
function isJWK(key) {
  return is_object_default(key) && typeof key.kty === "string";
}
__name(isJWK, "isJWK");
function isPrivateJWK(key) {
  return key.kty !== "oct" && typeof key.d === "string";
}
__name(isPrivateJWK, "isPrivateJWK");
function isPublicJWK(key) {
  return key.kty !== "oct" && typeof key.d === "undefined";
}
__name(isPublicJWK, "isPublicJWK");
function isSecretJWK(key) {
  return key.kty === "oct" && typeof key.k === "string";
}
__name(isSecretJWK, "isSecretJWK");

// ../../node_modules/jose/dist/webapi/lib/normalize_key.js
var cache;
var handleJWK = /* @__PURE__ */ __name(async (key, jwk, alg, freeze = false) => {
  cache ||= /* @__PURE__ */ new WeakMap();
  let cached = cache.get(key);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const cryptoKey = await jwk_to_key_default({ ...jwk, alg });
  if (freeze)
    Object.freeze(key);
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
}, "handleJWK");
var handleKeyObject = /* @__PURE__ */ __name((keyObject, alg) => {
  cache ||= /* @__PURE__ */ new WeakMap();
  let cached = cache.get(keyObject);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const isPublic = keyObject.type === "public";
  const extractable = isPublic ? true : false;
  let cryptoKey;
  if (keyObject.asymmetricKeyType === "x25519") {
    switch (alg) {
      case "ECDH-ES":
      case "ECDH-ES+A128KW":
      case "ECDH-ES+A192KW":
      case "ECDH-ES+A256KW":
        break;
      default:
        throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, isPublic ? [] : ["deriveBits"]);
  }
  if (keyObject.asymmetricKeyType === "ed25519") {
    if (alg !== "EdDSA" && alg !== "Ed25519") {
      throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
      isPublic ? "verify" : "sign"
    ]);
  }
  if (keyObject.asymmetricKeyType === "rsa") {
    let hash;
    switch (alg) {
      case "RSA-OAEP":
        hash = "SHA-1";
        break;
      case "RS256":
      case "PS256":
      case "RSA-OAEP-256":
        hash = "SHA-256";
        break;
      case "RS384":
      case "PS384":
      case "RSA-OAEP-384":
        hash = "SHA-384";
        break;
      case "RS512":
      case "PS512":
      case "RSA-OAEP-512":
        hash = "SHA-512";
        break;
      default:
        throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    if (alg.startsWith("RSA-OAEP")) {
      return keyObject.toCryptoKey({
        name: "RSA-OAEP",
        hash
      }, extractable, isPublic ? ["encrypt"] : ["decrypt"]);
    }
    cryptoKey = keyObject.toCryptoKey({
      name: alg.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
      hash
    }, extractable, [isPublic ? "verify" : "sign"]);
  }
  if (keyObject.asymmetricKeyType === "ec") {
    const nist = /* @__PURE__ */ new Map([
      ["prime256v1", "P-256"],
      ["secp384r1", "P-384"],
      ["secp521r1", "P-521"]
    ]);
    const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve);
    if (!namedCurve) {
      throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    if (alg === "ES256" && namedCurve === "P-256") {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDSA",
        namedCurve
      }, extractable, [isPublic ? "verify" : "sign"]);
    }
    if (alg === "ES384" && namedCurve === "P-384") {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDSA",
        namedCurve
      }, extractable, [isPublic ? "verify" : "sign"]);
    }
    if (alg === "ES512" && namedCurve === "P-521") {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDSA",
        namedCurve
      }, extractable, [isPublic ? "verify" : "sign"]);
    }
    if (alg.startsWith("ECDH-ES")) {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDH",
        namedCurve
      }, extractable, isPublic ? [] : ["deriveBits"]);
    }
  }
  if (!cryptoKey) {
    throw new TypeError("given KeyObject instance cannot be used for this algorithm");
  }
  if (!cached) {
    cache.set(keyObject, { [alg]: cryptoKey });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
}, "handleKeyObject");
var normalize_key_default = /* @__PURE__ */ __name(async (key, alg) => {
  if (key instanceof Uint8Array) {
    return key;
  }
  if (isCryptoKey(key)) {
    return key;
  }
  if (isKeyObject(key)) {
    if (key.type === "secret") {
      return key.export();
    }
    if ("toCryptoKey" in key && typeof key.toCryptoKey === "function") {
      try {
        return handleKeyObject(key, alg);
      } catch (err) {
        if (err instanceof TypeError) {
          throw err;
        }
      }
    }
    let jwk = key.export({ format: "jwk" });
    return handleJWK(key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k) {
      return decode(key.k);
    }
    return handleJWK(key, key, alg, true);
  }
  throw new Error("unreachable");
}, "default");

// ../../node_modules/jose/dist/webapi/lib/check_key_type.js
var tag = /* @__PURE__ */ __name((key) => key?.[Symbol.toStringTag], "tag");
var jwkMatchesOp = /* @__PURE__ */ __name((alg, key, usage) => {
  if (key.use !== void 0) {
    let expected;
    switch (usage) {
      case "sign":
      case "verify":
        expected = "sig";
        break;
      case "encrypt":
      case "decrypt":
        expected = "enc";
        break;
    }
    if (key.use !== expected) {
      throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
    }
  }
  if (key.alg !== void 0 && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
  }
  if (Array.isArray(key.key_ops)) {
    let expectedKeyOp;
    switch (true) {
      case (usage === "sign" || usage === "verify"):
      case alg === "dir":
      case alg.includes("CBC-HS"):
        expectedKeyOp = usage;
        break;
      case alg.startsWith("PBES2"):
        expectedKeyOp = "deriveBits";
        break;
      case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg):
        if (!alg.includes("GCM") && alg.endsWith("KW")) {
          expectedKeyOp = usage === "encrypt" ? "wrapKey" : "unwrapKey";
        } else {
          expectedKeyOp = usage;
        }
        break;
      case (usage === "encrypt" && alg.startsWith("RSA")):
        expectedKeyOp = "wrapKey";
        break;
      case usage === "decrypt":
        expectedKeyOp = alg.startsWith("RSA") ? "unwrapKey" : "deriveBits";
        break;
    }
    if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
      throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
    }
  }
  return true;
}, "jwkMatchesOp");
var symmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage) => {
  if (key instanceof Uint8Array)
    return;
  if (isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
      return;
    throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
  }
  if (key.type !== "secret") {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  }
}, "symmetricTypeCheck");
var asymmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage) => {
  if (isJWK(key)) {
    switch (usage) {
      case "decrypt":
      case "sign":
        if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a private JWK`);
      case "encrypt":
      case "verify":
        if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a public JWK`);
    }
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
  }
  if (key.type === "secret") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (key.type === "public") {
    switch (usage) {
      case "sign":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
      case "decrypt":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
      default:
        break;
    }
  }
  if (key.type === "private") {
    switch (usage) {
      case "verify":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
      case "encrypt":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
      default:
        break;
    }
  }
}, "asymmetricTypeCheck");
var check_key_type_default = /* @__PURE__ */ __name((alg, key, usage) => {
  const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A(?:128|192|256)(?:GCM)?(?:KW)?$/.test(alg) || /^A(?:128|192|256)CBC-HS(?:256|384|512)$/.test(alg);
  if (symmetric) {
    symmetricTypeCheck(alg, key, usage);
  } else {
    asymmetricTypeCheck(alg, key, usage);
  }
}, "default");

// ../../node_modules/jose/dist/webapi/lib/subtle_dsa.js
var subtle_dsa_default = /* @__PURE__ */ __name((alg, algorithm) => {
  const hash = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash, name: "RSA-PSS", saltLength: parseInt(alg.slice(-3), 10) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash, name: "ECDSA", namedCurve: algorithm.namedCurve };
    case "Ed25519":
    case "EdDSA":
      return { name: "Ed25519" };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
}, "default");

// ../../node_modules/jose/dist/webapi/lib/get_sign_verify_key.js
var get_sign_verify_key_default = /* @__PURE__ */ __name(async (alg, key, usage) => {
  if (key instanceof Uint8Array) {
    if (!alg.startsWith("HS")) {
      throw new TypeError(invalid_key_input_default(key, "CryptoKey", "KeyObject", "JSON Web Key"));
    }
    return crypto.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
  }
  checkSigCryptoKey(key, alg, usage);
  return key;
}, "default");

// ../../node_modules/jose/dist/webapi/lib/verify.js
var verify_default = /* @__PURE__ */ __name(async (alg, key, signature, data) => {
  const cryptoKey = await get_sign_verify_key_default(alg, key, "verify");
  check_key_length_default(alg, cryptoKey);
  const algorithm = subtle_dsa_default(alg, cryptoKey.algorithm);
  try {
    return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
  } catch {
    return false;
  }
}, "default");

// ../../node_modules/jose/dist/webapi/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!is_object_default(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === void 0 && jws.header === void 0) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== void 0 && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === void 0) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== void 0 && !is_object_default(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  let parsedProt = {};
  if (jws.protected) {
    try {
      const protectedHeader = decode(jws.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader));
    } catch {
      throw new JWSInvalid("JWS Protected Header is invalid");
    }
  }
  if (!is_disjoint_default(parsedProt, jws.header)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...parsedProt,
    ...jws.header
  };
  const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const algorithms = options && validate_algorithms_default("algorithms", options.algorithms);
  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
  }
  check_key_type_default(alg, key, "verify");
  const data = concat(encoder.encode(jws.protected ?? ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
  let signature;
  try {
    signature = decode(jws.signature);
  } catch {
    throw new JWSInvalid("Failed to base64url decode the signature");
  }
  const k = await normalize_key_default(key, alg);
  const verified = await verify_default(alg, k, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    try {
      payload = decode(jws.payload);
    } catch {
      throw new JWSInvalid("Failed to base64url decode the payload");
    }
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  const result = { payload };
  if (jws.protected !== void 0) {
    result.protectedHeader = parsedProt;
  }
  if (jws.header !== void 0) {
    result.unprotectedHeader = jws.header;
  }
  if (resolvedKey) {
    return { ...result, key: k };
  }
  return result;
}
__name(flattenedVerify, "flattenedVerify");

// ../../node_modules/jose/dist/webapi/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(compactVerify, "compactVerify");

// ../../node_modules/jose/dist/webapi/lib/epoch.js
var epoch_default = /* @__PURE__ */ __name((date) => Math.floor(date.getTime() / 1e3), "default");

// ../../node_modules/jose/dist/webapi/lib/secs.js
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var secs_default = /* @__PURE__ */ __name((str) => {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
}, "default");

// ../../node_modules/jose/dist/webapi/lib/jwt_claims_set.js
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
__name(validateInput, "validateInput");
var normalizeTyp = /* @__PURE__ */ __name((value) => {
  if (value.includes("/")) {
    return value.toLowerCase();
  }
  return `application/${value.toLowerCase()}`;
}, "normalizeTyp");
var checkAudiencePresence = /* @__PURE__ */ __name((audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
}, "checkAudiencePresence");
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {
  }
  if (!is_object_default(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0)
    presenceCheck.push("iat");
  if (audience !== void 0)
    presenceCheck.push("aud");
  if (subject !== void 0)
    presenceCheck.push("sub");
  if (issuer !== void 0)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
  }
  if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs_default(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now = epoch_default(currentDate || /* @__PURE__ */ new Date());
  if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
    }
  }
  if (maxTokenAge) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
    }
  }
  return payload;
}
__name(validateClaimsSet, "validateClaimsSet");
var JWTClaimsBuilder = class {
  static {
    __name(this, "JWTClaimsBuilder");
  }
  #payload;
  constructor(payload) {
    if (!is_object_default(payload)) {
      throw new TypeError("JWT Claims Set MUST be an object");
    }
    this.#payload = structuredClone(payload);
  }
  data() {
    return encoder.encode(JSON.stringify(this.#payload));
  }
  get iss() {
    return this.#payload.iss;
  }
  set iss(value) {
    this.#payload.iss = value;
  }
  get sub() {
    return this.#payload.sub;
  }
  set sub(value) {
    this.#payload.sub = value;
  }
  get aud() {
    return this.#payload.aud;
  }
  set aud(value) {
    this.#payload.aud = value;
  }
  set jti(value) {
    this.#payload.jti = value;
  }
  set nbf(value) {
    if (typeof value === "number") {
      this.#payload.nbf = validateInput("setNotBefore", value);
    } else if (value instanceof Date) {
      this.#payload.nbf = validateInput("setNotBefore", epoch_default(value));
    } else {
      this.#payload.nbf = epoch_default(/* @__PURE__ */ new Date()) + secs_default(value);
    }
  }
  set exp(value) {
    if (typeof value === "number") {
      this.#payload.exp = validateInput("setExpirationTime", value);
    } else if (value instanceof Date) {
      this.#payload.exp = validateInput("setExpirationTime", epoch_default(value));
    } else {
      this.#payload.exp = epoch_default(/* @__PURE__ */ new Date()) + secs_default(value);
    }
  }
  set iat(value) {
    if (typeof value === "undefined") {
      this.#payload.iat = epoch_default(/* @__PURE__ */ new Date());
    } else if (value instanceof Date) {
      this.#payload.iat = validateInput("setIssuedAt", epoch_default(value));
    } else if (typeof value === "string") {
      this.#payload.iat = validateInput("setIssuedAt", epoch_default(/* @__PURE__ */ new Date()) + secs_default(value));
    } else {
      this.#payload.iat = validateInput("setIssuedAt", value);
    }
  }
};

// ../../node_modules/jose/dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await compactVerify(jwt, key, options);
  if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = validateClaimsSet(verified.protectedHeader, verified.payload, options);
  const result = { payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(jwtVerify, "jwtVerify");

// ../../node_modules/jose/dist/webapi/lib/sign.js
var sign_default = /* @__PURE__ */ __name(async (alg, key, data) => {
  const cryptoKey = await get_sign_verify_key_default(alg, key, "sign");
  check_key_length_default(alg, cryptoKey);
  const signature = await crypto.subtle.sign(subtle_dsa_default(alg, cryptoKey.algorithm), cryptoKey, data);
  return new Uint8Array(signature);
}, "default");

// ../../node_modules/jose/dist/webapi/jws/flattened/sign.js
var FlattenedSign = class {
  static {
    __name(this, "FlattenedSign");
  }
  #payload;
  #protectedHeader;
  #unprotectedHeader;
  constructor(payload) {
    if (!(payload instanceof Uint8Array)) {
      throw new TypeError("payload must be an instance of Uint8Array");
    }
    this.#payload = payload;
  }
  setProtectedHeader(protectedHeader) {
    if (this.#protectedHeader) {
      throw new TypeError("setProtectedHeader can only be called once");
    }
    this.#protectedHeader = protectedHeader;
    return this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    if (this.#unprotectedHeader) {
      throw new TypeError("setUnprotectedHeader can only be called once");
    }
    this.#unprotectedHeader = unprotectedHeader;
    return this;
  }
  async sign(key, options) {
    if (!this.#protectedHeader && !this.#unprotectedHeader) {
      throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    }
    if (!is_disjoint_default(this.#protectedHeader, this.#unprotectedHeader)) {
      throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
      ...this.#protectedHeader,
      ...this.#unprotectedHeader
    };
    const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, this.#protectedHeader, joseHeader);
    let b64 = true;
    if (extensions.has("b64")) {
      b64 = this.#protectedHeader.b64;
      if (typeof b64 !== "boolean") {
        throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
      }
    }
    const { alg } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    check_key_type_default(alg, key, "sign");
    let payload = this.#payload;
    if (b64) {
      payload = encoder.encode(encode(payload));
    }
    let protectedHeader;
    if (this.#protectedHeader) {
      protectedHeader = encoder.encode(encode(JSON.stringify(this.#protectedHeader)));
    } else {
      protectedHeader = encoder.encode("");
    }
    const data = concat(protectedHeader, encoder.encode("."), payload);
    const k = await normalize_key_default(key, alg);
    const signature = await sign_default(alg, k, data);
    const jws = {
      signature: encode(signature),
      payload: ""
    };
    if (b64) {
      jws.payload = decoder.decode(payload);
    }
    if (this.#unprotectedHeader) {
      jws.header = this.#unprotectedHeader;
    }
    if (this.#protectedHeader) {
      jws.protected = decoder.decode(protectedHeader);
    }
    return jws;
  }
};

// ../../node_modules/jose/dist/webapi/jws/compact/sign.js
var CompactSign = class {
  static {
    __name(this, "CompactSign");
  }
  #flattened;
  constructor(payload) {
    this.#flattened = new FlattenedSign(payload);
  }
  setProtectedHeader(protectedHeader) {
    this.#flattened.setProtectedHeader(protectedHeader);
    return this;
  }
  async sign(key, options) {
    const jws = await this.#flattened.sign(key, options);
    if (jws.payload === void 0) {
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    }
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
  }
};

// ../../node_modules/jose/dist/webapi/jwt/sign.js
var SignJWT = class {
  static {
    __name(this, "SignJWT");
  }
  #protectedHeader;
  #jwt;
  constructor(payload = {}) {
    this.#jwt = new JWTClaimsBuilder(payload);
  }
  setIssuer(issuer) {
    this.#jwt.iss = issuer;
    return this;
  }
  setSubject(subject) {
    this.#jwt.sub = subject;
    return this;
  }
  setAudience(audience) {
    this.#jwt.aud = audience;
    return this;
  }
  setJti(jwtId) {
    this.#jwt.jti = jwtId;
    return this;
  }
  setNotBefore(input) {
    this.#jwt.nbf = input;
    return this;
  }
  setExpirationTime(input) {
    this.#jwt.exp = input;
    return this;
  }
  setIssuedAt(input) {
    this.#jwt.iat = input;
    return this;
  }
  setProtectedHeader(protectedHeader) {
    this.#protectedHeader = protectedHeader;
    return this;
  }
  async sign(key, options) {
    const sig = new CompactSign(this.#jwt.data());
    sig.setProtectedHeader(this.#protectedHeader);
    if (Array.isArray(this.#protectedHeader?.crit) && this.#protectedHeader.crit.includes("b64") && this.#protectedHeader.b64 === false) {
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    return sig.sign(key, options);
  }
};

// worker.js
var worker_default = {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};
async function handleRequest(request, env) {
  const CLOUDFLARE_API_URL = "https://api.cloudflare.com/client/v4";
  const ACCOUNT_ID = env.ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN;
  const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
  if (!ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !env.CERTIFICATES_KV) {
    return new Response(JSON.stringify({
      error: "Configuration error",
      details: "Required environment variables are missing",
      missing: {
        ACCOUNT_ID: !env.ACCOUNT_ID,
        CLOUDFLARE_API_TOKEN: !env.CLOUDFLARE_API_TOKEN,
        CERTIFICATES_KV: !env.CERTIFICATES_KV
      }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const path = url.pathname;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://mtls-customer-portal-worker.your-namespace.workers.dev",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (path === "/api/login" && request.method === "POST") {
    try {
      const { username, password } = await request.json();
      if (username === "customer" && password === "securepassword") {
        const token = await new SignJWT({ username, id: "customer_id" }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(JWT_SECRET);
        return new Response(JSON.stringify({ token }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Login error", details: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
  if (path === "/api/certificates" && request.method === "POST") {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Invalid or missing Authorization header" }), {
        status: 401,
        headers: corsHeaders
      });
    }
    const token = authHeader.slice(7).trim();
    console.log("Received token:", token);
    if (!token) return new Response(JSON.stringify({ error: "Empty token" }), { status: 401, headers: corsHeaders });
    try {
      await jwtVerify(token, JWT_SECRET);
      console.log("Generating client certificate...");
      const response = await fetch(`${CLOUDFLARE_API_URL}/accounts/${ACCOUNT_ID}/client_certificates`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          private_key_type: "RSA",
          validity_period: 365
        })
      });
      const data = await response.json();
      console.log("Certificate API response status:", response.status);
      if (!data.success) {
        const errorMsg = data.errors?.[0]?.message || `API error: ${response.status}`;
        console.error("Certificate generation failed:", errorMsg);
        throw new Error(errorMsg);
      }
      const { id, certificate, private_key } = data.result;
      const downloadToken = crypto.randomUUID();
      await env.CERTIFICATES_KV.put(downloadToken, JSON.stringify({
        certificate,
        private_key
      }), {
        expirationTtl: 3600
      });
      return new Response(JSON.stringify({ certificateId: id, downloadToken }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } catch (err) {
      console.error("Certificate generation error:", err.message);
      return new Response(JSON.stringify({
        error: "Failed to generate certificate",
        details: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
  if (path.startsWith("/api/certificates/download/") && request.method === "GET") {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Invalid or missing Authorization header" }), {
        status: 401,
        headers: corsHeaders
      });
    }
    const token = authHeader.slice(7).trim();
    console.log("Received token:", token);
    if (!token) return new Response(JSON.stringify({ error: "Empty token" }), { status: 401, headers: corsHeaders });
    try {
      await jwtVerify(token, JWT_SECRET);
      const downloadToken = path.split("/").pop();
      const data = await env.CERTIFICATES_KV.get(downloadToken, "json");
      if (!data) {
        return new Response(JSON.stringify({ error: "Invalid or expired download link" }), {
          status: 404,
          headers: corsHeaders
        });
      }
      await env.CERTIFICATES_KV.delete(downloadToken);
      return new Response(data.certificate, {
        headers: {
          "Content-Disposition": "attachment; filename=certificate.pem",
          "Content-Type": "application/x-pem-file",
          ...corsHeaders
        }
      });
    } catch (err) {
      console.error("Certificate download error:", err.message);
      return new Response(JSON.stringify({
        error: "Failed to download certificate",
        details: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
  if (path === "/api/debug" && request.method === "GET") {
    return new Response(JSON.stringify({
      status: "ok",
      env: {
        hasApiToken: !!CLOUDFLARE_API_TOKEN,
        hasJwtSecret: !!JWT_SECRET,
        hasAccountId: !!ACCOUNT_ID,
        hasKv: !!env.CERTIFICATES_KV
      }
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
  return new Response("Not found", { status: 404, headers: corsHeaders });
}
__name(handleRequest, "handleRequest");

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-61vKSy/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-61vKSy/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
