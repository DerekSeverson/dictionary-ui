import superagent from 'superagent';

const BASEURL = process.env.SERVER;

const TIMEOUT = 12000;
const METHODS = ['GET', 'POST', 'PUT', 'HEAD', 'PATCH', 'DELETE'];

export default async function request(args) {
  // Defaults

  args = Object.assign({
    method: 'GET',
    baseurl: BASEURL
  }, args);

  // Validate Args.

  if (!METHODS.includes(args.method)) {
    throw new Error('Invalid Request Method');
  }

  if (!args.baseurl) {
    throw new Error('Invalid Request Baseurl');
  }

  // Build Request

  let req = superagent(args.method, `${args.baseurl}${args.url}`);

  if (args.query) {
    req = req.query(args.query);
  }

  if (args.headers) {
    req = req.set(args.headers);
  }

  if (args.auth) {
    req = req.set('Authorization', args.auth);
  }

  if (args.body) {
    req = req.send(args.body);
  }

  if (args.timeout !== false) {
    req = req.timeout(args.timeout || TIMEOUT);
  }

  if (args.parse === false) {
    req = req.buffer(true).parse(body => body);
  }

  return await req;
}
