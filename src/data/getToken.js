// import "server-only";
import { KJUR } from "jsrsasign";

export function getData(slug) {
  const JWT =  generateSignature(slug, 1);
  return JWT;
}


function generateSignature(sessionName, role) {
  
    // if (!process.env.ZOOM_SDK_KEY || !process.env.ZOOM_SDK_SECRET) {
    //   throw new Error("Missing ZOOM_SDK_KEY or ZOOM_SDK_SECRET");
    // }
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };
    const sdkKey = 'eKAdUX2TJWSsRS9s2pISA';
    const sdkSecret = '6HNobch79kBBz1E57EpEToRd8envqb2C';
    const oPayload = {
      app_key: sdkKey, tpc: sessionName, role_type: role, version: 1, iat: iat, exp: exp,
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
    return sdkJWT;
  }