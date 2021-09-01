export const decodeBase64 = (base64String)=>{
  return Buffer.from(base64String, 'base64').toString('ascii');
}

export const encodeBase64 = (base64String)=>{
  return Buffer.from(base64String, 'ascii').toString('base64');
}